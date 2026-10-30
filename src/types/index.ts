export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type FindingCategory =
  | 'Claims & Internal Consistency'
  | 'Unsupported Claims'
  | 'Spelling & Text Accuracy'
  | 'Logo & Brand Identity'
  | 'Unapproved Logos & Assets'
  | 'Pricing & Discounts'
  | 'Warranty & Terms'
  | 'Required Disclaimers'
  | 'Layout & Visual Quality'
  | 'IP, Copyright & Trademarks'
  | 'Abusive or Harmful Content';

export type FindingStatusType = 'CONFIRMED_ERROR' | 'POTENTIAL_RISK' | 'UNVERIFIED_CLAIM';

export type EvidenceSource = 'IMAGE' | 'OCR' | 'CAPTION' | 'BRAND GUIDELINE' | 'APPROVED FACT';

export type ReviewStatus = 'UNDER_REVIEW' | 'APPROVED' | 'FLAGGED' | 'NEEDS_REVIEW' | 'ANALYSIS_FAILED' | 'DRAFT';

export interface BoundingBox {
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
  x?: number; // 0.0 to 1.0 (left)
  y?: number; // 0.0 to 1.0 (top)
  width?: number; // 0.0 to 1.0 (width)
  height?: number; // 0.0 to 1.0 (height)
  label?: string;
  is_uncertain?: boolean;
}

export interface ReviewFinding {
  id: string;
  review_id: string;
  issue_number?: number;
  finding_title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  detected_text?: string;
  evidence: string;
  evidence_source: EvidenceSource;
  recommendation: string;
  solution?: string; // Concrete actionable remediation / exact fix
  confidence: number; // 0-100
  is_confirmed: boolean;
  status_type?: FindingStatusType;
  deduction: number;
  location_description?: string;
  bounding_box?: BoundingBox;
  created_at: string;
}

export interface ScoreDeduction {
  finding_id: string;
  title: string;
  severity: FindingSeverity;
  points: number;
  reason: string;
}

export interface VisionSummary {
  main_products: string[];
  services: string[];
  relevant_objects: string[];
  packaging_detected: boolean;
  packaging_notes?: string;
  logos_detected: string[];
  logo_detected?: boolean;
  logo_name?: string;
  promotional_text: string[];
  visible_prices: string[];
  visible_discounts: string[];
  visible_warranty: string[];
  visible_dates: string[];
  detected_colors: string[];
  visual_quality_score: number;
  spelling_errors: { word: string; suggestion: string; context: string }[];
  overall_summary: string;
}

export interface OcrWordBox {
  text: string;
  x: number; // Normalized 0.0 - 1.0 (left)
  y: number; // Normalized 0.0 - 1.0 (top)
  width: number; // Normalized 0.0 - 1.0 (width)
  height: number; // Normalized 0.0 - 1.0 (height)
  box2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
}

export interface OcrResult {
  raw_text: string;
  lines: string[];
  confidence: number;
  extracted_elements: {
    headlines: string[];
    prices: string[];
    discounts: string[];
    dates: string[];
    disclaimers: string[];
  };
  word_boxes?: OcrWordBox[];
  line_boxes?: OcrWordBox[];
  image_width?: number;
  image_height?: number;
}

export interface CaptionAnalysis {
  product_claims: string[];
  promotional_discounts: string[];
  prices_mentioned: string[];
  warranty_terms: string[];
  deadlines_dates: string[];
  promises_guarantees: string[];
  tone_of_voice: string;
  spelling_grammar_issues: string[];
}

export interface ReviewActivity {
  id: string;
  review_id: string;
  user_email: string;
  action: string;
  details: string;
  created_at: string;
}

export interface ContentReview {
  id: string;
  user_id?: string;
  brand_id?: string;
  campaign_id?: string;
  title: string;
  campaign_name?: string;
  content_type: string;
  caption?: string;
  image_url: string;
  original_image_url?: string;
  image_width?: number;
  image_height?: number;
  aspect_ratio?: string;
  status: ReviewStatus;
  analysis_status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  compliance_score: number; // 0-100
  score_baseline: number;
  score_deductions: ScoreDeduction[];
  vision_summary?: VisionSummary;
  ocr_result?: OcrResult;
  caption_analysis?: CaptionAnalysis;
  findings?: ReviewFinding[];
  activity?: ReviewActivity[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface BrandGuideline {
  id: string;
  brand_id?: string;
  rule_title: string;
  category: FindingCategory;
  description: string;
  severity_on_breach: FindingSeverity;
  is_active: boolean;
  required_disclaimer_text?: string;
  prohibited_words?: string[];
  created_at: string;
  updated_at: string;
}

export interface ApprovedFact {
  id: string;
  brand_id?: string;
  entity_type: 'PRODUCT_SPEC' | 'PRICE' | 'WARRANTY' | 'DISCOUNT' | 'OFFER' | 'CLAIM';
  title: string;
  official_statement: string;
  category: string;
  valid_from?: string;
  valid_to?: string;
  verification_doc_ref?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandAsset {
  id: string;
  brand_id?: string;
  brand_name?: string;
  asset_name: string;
  asset_type: 'LOGO' | 'PRODUCT_RENDER' | 'BADGE' | 'COLOR_PALETTE';
  variation_type?: 'PRIMARY' | 'MONOCHROME_WHITE' | 'MONOCHROME_DARK' | 'ICON_ONLY' | 'PARTNER_SPONSOR' | string;
  image_url: string;
  aspect_ratio?: number | string;
  usage_instructions: string;
  clear_space_rule?: string;
  permitted_backgrounds?: string[];
  official_colors?: string[];
  is_approved: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_reviews: number;
  pending_reviews: number;
  approved_reviews: number;
  approval_rate: number;
  flagged_reviews: number;
  needs_review: number;
  avg_compliance_score: number;
  engine_status: {
    storage_connected: boolean;
    storage_provider: 'Supabase PostgreSQL' | 'Local Audit Storage';
    guidelines_count: number;
    facts_count: number;
    assets_count: number;
    vision_engine: 'Active (Gemini 3.8 Flash)' | 'Active';
    ocr_engine: 'Active (Tesseract.js)' | 'Active';
  };
}

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  title: string;
  contentType: string;
  caption: string;
  imageDescription: string;
  svgDataUrl: string;
  expectedFindings: string[];
}
