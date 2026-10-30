import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ContentReview,
  ReviewFinding,
  BrandGuideline,
  ApprovedFact,
  BrandAsset,
  DashboardStats,
  ReviewStatus,
} from '../types';
import { OFFICIAL_REFERENCE_LOGOS } from '../data/referenceLogos';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'audit_store.json');

interface DatabaseStore {
  reviews: ContentReview[];
  guidelines: BrandGuideline[];
  facts: ApprovedFact[];
  assets: BrandAsset[];
}

// Initial 9 Brand Guidelines as indicated in screenshot
const INITIAL_GUIDELINES: BrandGuideline[] = [
  {
    id: 'bg-01',
    rule_title: 'Unqualified Promotional Discounts Prohibited',
    category: 'Pricing & Discounts',
    description: 'All percentage discounts (e.g., 50% OFF, 70% OFF) must explicitly state product inclusions, minimum spends, or exclusions in both image copy and accompanying caption.',
    severity_on_breach: 'HIGH',
    is_active: true,
    required_disclaimer_text: '*Terms apply. See full details at brandguard.com/terms',
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'bg-02',
    rule_title: 'Cross-Modal Claim Consistency',
    category: 'Claims & Internal Consistency',
    description: 'Promotional percentages, prices, warranty durations, and coupon codes must match exactly between the visual graphic and caption text.',
    severity_on_breach: 'CRITICAL',
    is_active: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'bg-03',
    rule_title: 'Official Warranty Stating Guidelines',
    category: 'Warranty & Terms',
    description: 'Audio soundbars and home speakers are limited strictly to the 1-Year Manufacturer Warranty unless a certified extended plan is explicitly sold.',
    severity_on_breach: 'CRITICAL',
    is_active: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'bg-04',
    rule_title: 'Spelling & Typography Integrity',
    category: 'Spelling & Text Accuracy',
    description: 'Headlines, sub-copy, and CTAs must be free of typographical and spelling mistakes before public release.',
    severity_on_breach: 'MEDIUM',
    is_active: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'bg-05',
    rule_title: 'Campaign Expiration Dates Must Align',
    category: 'Claims & Internal Consistency',
    description: 'Flash sale end dates in graphic footers must synchronize with copy deadlines. No retroactive date extensions permitted.',
    severity_on_breach: 'HIGH',
    is_active: true,
    created_at: new Date('2026-10-02T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-02T10:00:00Z').toISOString(),
  },
  {
    id: 'bg-06',
    rule_title: 'Brand Logo Clearance & Padding',
    category: 'Logo & Brand Identity',
    description: 'Official logos must maintain minimum 16px clear space and may not be distorted, recolored off-palette, or cropped.',
    severity_on_breach: 'MEDIUM',
    is_active: true,
    created_at: new Date('2026-10-02T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-02T10:00:00Z').toISOString(),
  },
  {
    id: 'bg-07',
    rule_title: 'Technical Wattage and Specs Verification',
    category: 'Claims & Internal Consistency',
    description: 'Electronic charging power claims (e.g., GaN 65W vs 100W) must match product chassis labels and verified laboratory spec sheets.',
    severity_on_breach: 'CRITICAL',
    is_active: true,
    created_at: new Date('2026-10-03T11:00:00Z').toISOString(),
    updated_at: new Date('2026-10-03T11:00:00Z').toISOString(),
  },
  {
    id: 'bg-08',
    rule_title: 'Mandatory Environmental Disclaimer',
    category: 'Required Disclaimers',
    description: 'Eco-friendly and sustainability claims require accredited certification reference (e.g., B-Corp, ASTM standard retention note).',
    severity_on_breach: 'HIGH',
    is_active: true,
    required_disclaimer_text: 'Tested according to ASTM international thermal standards.',
    created_at: new Date('2026-10-03T11:00:00Z').toISOString(),
    updated_at: new Date('2026-10-03T11:00:00Z').toISOString(),
  },
  {
    id: 'bg-09',
    rule_title: 'Prohibited Absolute Superiority Claims',
    category: 'Claims & Internal Consistency',
    description: 'Phrases like "100% Guaranteed Best in the World" or "Zero Competitor Equal" require third-party verification benchmarks.',
    severity_on_breach: 'HIGH',
    is_active: true,
    prohibited_words: ['world best', 'unbeatable by law', 'miracle'],
    created_at: new Date('2026-10-04T12:00:00Z').toISOString(),
    updated_at: new Date('2026-10-04T12:00:00Z').toISOString(),
  },
  {
    id: 'bg-10',
    rule_title: 'Unapproved Medical & Dermatologist Seals Prohibited',
    category: 'Unapproved Logos & Assets',
    description: 'Third-party endorsement seals (such as "Dermatologist Approved", medical crosses, or certification stamps) are prohibited unless certified and registered in the Brand Assets Registry.',
    severity_on_breach: 'HIGH',
    is_active: true,
    created_at: new Date('2026-10-05T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-05T08:00:00Z').toISOString(),
  },
  {
    id: 'bg-11',
    rule_title: 'Substantiation Required for Clinical & Anti-Aging Claims',
    category: 'Unsupported Claims',
    description: 'Health, cosmetic, and anti-aging claims (such as "removes wrinkles in 7 days" or "guarantees younger skin") require approved clinical trial evidence in the knowledge base. In absence of evidence, claim is unsupported.',
    severity_on_breach: 'CRITICAL',
    is_active: true,
    created_at: new Date('2026-10-05T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-05T08:00:00Z').toISOString(),
  },
];

// Verified Corporate Facts (Verified baseline knowledge base)
const INITIAL_FACTS: ApprovedFact[] = [
  {
    id: 'cf-01',
    entity_type: 'WARRANTY',
    title: 'ApexSound Audio Hardware Manufacturer Warranty',
    official_statement:
      'Audio soundbars and home theater speakers are limited strictly to the 1-Year Limited Manufacturer Warranty. Extended warranties require a certified add-on service agreement.',
    category: 'Hardware Audio',
    verification_doc_ref: 'DOC-APX-WARR-2026-v2',
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'cf-02',
    entity_type: 'PRODUCT_SPEC',
    title: 'VoltPulse GaN Fast Charger Hardware Specifications',
    official_statement:
      'VoltPulse GaN fast chargers are certified for 65W maximum output (Model VP-65G). 100W laptop hyper-charging is not supported by 65W hardware.',
    category: 'Charging Electronics',
    verification_doc_ref: 'LAB-SPEC-VP65G-TUV',
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'cf-03',
    entity_type: 'CLAIM',
    title: 'EcoHydrate Pro Thermal Retention & Material Standards',
    official_statement:
      'EcoHydrate Pro vessels are manufactured from 100% BPA-free recycled food-grade stainless steel, include the standard 2-Year Manufacturer Warranty, and are tested according to ASTM international thermal standards for 24-hour cold retention.',
    category: 'Sustainability',
    verification_doc_ref: 'ASTM-E1004-TEST-2026',
    created_at: new Date('2026-10-02T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-02T10:00:00Z').toISOString(),
  },
  {
    id: 'cf-04',
    entity_type: 'DISCOUNT',
    title: 'Promotional Discount Qualification & Terms Policy',
    official_statement:
      "Storewide percentage discounts exceeding 30% require explicit product inclusion parameters and disclaimer: '*Terms apply. See full details at brandguard.com/terms'.",
    category: 'Promotional Terms',
    verification_doc_ref: 'FIN-DISC-POL-2026',
    created_at: new Date('2026-10-03T11:00:00Z').toISOString(),
    updated_at: new Date('2026-10-03T11:00:00Z').toISOString(),
  },
  {
    id: 'cf-05',
    entity_type: 'CLAIM',
    title: 'PureVive Skincare Clinical Efficacy & Cosmetic Claim Policy',
    official_statement:
      'PureVive Revitalift Cream is formulated to help visibly revitalize and nourish skin. Absolute guarantees to remove wrinkles in 7 days or medical cures are unverified and prohibited without FDA/independent clinical study registration.',
    category: 'Cosmetic & Skincare',
    verification_doc_ref: 'CLIN-PV-2026-REG',
    created_at: new Date('2026-10-04T12:00:00Z').toISOString(),
    updated_at: new Date('2026-10-04T12:00:00Z').toISOString(),
  },
];

// Brand Assets Registry (Official reference logos and brand marks)
const INITIAL_ASSETS: BrandAsset[] = OFFICIAL_REFERENCE_LOGOS;

// Content Reviews (User marketing creative audits, initialized empty)
const INITIAL_REVIEWS: ContentReview[] = [];

class StorageService {
  private supabase: SupabaseClient | null = null;
  private isSupabaseConfigured = false;
  private _cachedStore: DatabaseStore | null = null;

  constructor() {
    this.initSupabase();
    this.ensureLocalStorage();
  }

  private initSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isSupabaseConfigured = true;
      } catch (e) {
        console.warn('Failed to initialize Supabase client:', e);
        this.supabase = null;
        this.isSupabaseConfigured = false;
      }
    }
  }

  private ensureLocalStorage(): DatabaseStore {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialStore: DatabaseStore = {
        reviews: INITIAL_REVIEWS,
        guidelines: INITIAL_GUIDELINES,
        facts: INITIAL_FACTS,
        assets: INITIAL_ASSETS,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
      return initialStore;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      let needsSave = false;
      if (!parsed.guidelines || parsed.guidelines.length === 0) {
        parsed.guidelines = INITIAL_GUIDELINES;
        needsSave = true;
      }
      if (!parsed.facts || parsed.facts.length === 0) {
        parsed.facts = INITIAL_FACTS;
        needsSave = true;
      }
      if (!parsed.assets || parsed.assets.length === 0) {
        parsed.assets = INITIAL_ASSETS;
        needsSave = true;
      }
      if (!parsed.reviews) {
        parsed.reviews = [];
        needsSave = true;
      }
      if (needsSave) {
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        } catch (err) {
          console.warn('Failed to persist restored items to DB_FILE:', err);
        }
      }
      this._cachedStore = parsed;
      return parsed;
    } catch {
      const initialStore: DatabaseStore = {
        reviews: INITIAL_REVIEWS,
        guidelines: INITIAL_GUIDELINES,
        facts: INITIAL_FACTS,
        assets: INITIAL_ASSETS,
      };
      this._cachedStore = initialStore;
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
      } catch (err) {
        console.warn('Failed to write initial store to disk:', err);
      }
      return initialStore;
    }
  }

  private readLocal(): DatabaseStore {
    if (this._cachedStore) {
      return this._cachedStore;
    }
    return this.ensureLocalStorage();
  }

  private writeLocal(data: DatabaseStore) {
    this._cachedStore = data;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to persist audit store to disk:', err);
    }
  }

  public getStatus() {
    return {
      connected: true,
      provider: this.isSupabaseConfigured ? ('Supabase PostgreSQL' as const) : ('Local Audit Storage' as const),
      supabaseActive: this.isSupabaseConfigured,
    };
  }

  // Dashboard Stats
  public async getDashboardStats(): Promise<DashboardStats> {
    const store = this.readLocal();
    const reviews = store.reviews;
    const total = reviews.length;
    const approved = reviews.filter((r) => r.status === 'APPROVED').length;
    const flagged = reviews.filter((r) => r.status === 'FLAGGED').length;
    const pending = reviews.filter((r) => r.status === 'UNDER_REVIEW' || r.status === 'NEEDS_REVIEW').length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const totalScore = reviews.reduce((sum, r) => sum + (r.compliance_score || 0), 0);
    const avgScore = total > 0 ? Math.round(totalScore / total) : 0;

    return {
      total_reviews: total,
      pending_reviews: pending,
      approved_reviews: approved,
      approval_rate: approvalRate,
      flagged_reviews: flagged,
      needs_review: reviews.filter((r) => r.status === 'NEEDS_REVIEW').length,
      avg_compliance_score: avgScore,
      engine_status: {
        storage_connected: true,
        storage_provider: this.isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Audit Storage',
        guidelines_count: store.guidelines.filter((g) => g.is_active).length,
        facts_count: store.facts.length,
        assets_count: store.assets.length,
        vision_engine: 'Active (Gemini 3.8 Flash)',
        ocr_engine: 'Active (Tesseract.js)',
      },
    };
  }

  // Reviews
  public async getReviews(filter?: {
    search?: string;
    status?: string;
    contentType?: string;
  }): Promise<ContentReview[]> {
    const store = this.readLocal();
    let result = [...store.reviews];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.caption?.toLowerCase().includes(q) ||
          r.campaign_name?.toLowerCase().includes(q)
      );
    }

    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter((r) => r.status === filter.status);
    }

    if (filter?.contentType && filter.contentType !== 'ALL') {
      result = result.filter((r) => r.content_type === filter.contentType);
    }

    // Sort by created_at desc
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }

  public async getReviewById(id: string): Promise<ContentReview | null> {
    const store = this.readLocal();
    if (!id) return null;
    let cleanId = id.trim();
    try {
      cleanId = decodeURIComponent(cleanId);
    } catch {}
    const lowerClean = cleanId.toLowerCase();

    // Exact match first
    const exact = store.reviews.find((r) => r.id === cleanId || r.id === id);
    if (exact) return exact;

    // Case-insensitive match
    const caseMatch = store.reviews.find((r) => (r.id || '').toLowerCase() === lowerClean);
    if (caseMatch) return caseMatch;

    // Substring / prefix match if someone used partial ID
    const partialMatch = store.reviews.find(
      (r) => (r.id || '').toLowerCase().includes(lowerClean) || lowerClean.includes((r.id || '').toLowerCase())
    );
    return partialMatch || null;
  }

  public async saveReview(review: ContentReview): Promise<ContentReview> {
    const store = this.readLocal();
    const existingIndex = store.reviews.findIndex((r) => r.id === review.id);

    if (existingIndex >= 0) {
      store.reviews[existingIndex] = {
        ...store.reviews[existingIndex],
        ...review,
        updated_at: new Date().toISOString(),
      };
    } else {
      store.reviews.unshift(review);
    }

    this.writeLocal(store);
    return review;
  }

  public async updateReviewStatus(
    id: string,
    status: ReviewStatus,
    note?: string,
    userEmail: string = 'reviewer@brandguard.ai'
  ): Promise<ContentReview | null> {
    const store = this.readLocal();
    const review = store.reviews.find((r) => r.id === id);
    if (!review) return null;

    review.status = status;
    review.updated_at = new Date().toISOString();

    if (!review.activity) review.activity = [];
    review.activity.unshift({
      id: `act-${Date.now()}`,
      review_id: id,
      user_email: userEmail,
      action: `Status Updated to ${status}`,
      details: note || `Review decision recorded: ${status}`,
      created_at: new Date().toISOString(),
    });

    this.writeLocal(store);
    return review;
  }

  public async deleteReview(id: string): Promise<boolean> {
    const store = this.readLocal();
    const initialLen = store.reviews.length;
    store.reviews = store.reviews.filter((r) => r.id !== id);
    if (store.reviews.length !== initialLen) {
      this.writeLocal(store);
      return true;
    }
    return false;
  }

  // Guidelines
  public async getGuidelines(): Promise<BrandGuideline[]> {
    return this.readLocal().guidelines;
  }

  public async saveGuideline(guideline: BrandGuideline): Promise<BrandGuideline> {
    const store = this.readLocal();
    const idx = store.guidelines.findIndex((g) => g.id === guideline.id);
    if (idx >= 0) {
      store.guidelines[idx] = { ...guideline, updated_at: new Date().toISOString() };
    } else {
      store.guidelines.push(guideline);
    }
    this.writeLocal(store);
    return guideline;
  }

  public async deleteGuideline(id: string): Promise<boolean> {
    const store = this.readLocal();
    store.guidelines = store.guidelines.filter((g) => g.id !== id);
    this.writeLocal(store);
    return true;
  }

  // Facts
  public async getFacts(): Promise<ApprovedFact[]> {
    return this.readLocal().facts;
  }

  public async saveFact(fact: ApprovedFact): Promise<ApprovedFact> {
    const store = this.readLocal();
    const idx = store.facts.findIndex((f) => f.id === fact.id);
    if (idx >= 0) {
      store.facts[idx] = { ...fact, updated_at: new Date().toISOString() };
    } else {
      store.facts.push(fact);
    }
    this.writeLocal(store);
    return fact;
  }

  public async deleteFact(id: string): Promise<boolean> {
    const store = this.readLocal();
    store.facts = store.facts.filter((f) => f.id !== id);
    this.writeLocal(store);
    return true;
  }

  // Assets
  public async getAssets(): Promise<BrandAsset[]> {
    return this.readLocal().assets;
  }

  public async saveAsset(asset: BrandAsset): Promise<BrandAsset> {
    const store = this.readLocal();
    const idx = store.assets.findIndex((a) => a.id === asset.id);
    if (idx >= 0) {
      store.assets[idx] = asset;
    } else {
      store.assets.push(asset);
    }
    this.writeLocal(store);
    return asset;
  }

  public async deleteAsset(id: string): Promise<boolean> {
    const store = this.readLocal();
    store.assets = store.assets.filter((a) => a.id !== id);
    this.writeLocal(store);
    return true;
  }
}

export const storage = new StorageService();
