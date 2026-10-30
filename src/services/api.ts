import {
  ContentReview,
  DashboardStats,
  BrandGuideline,
  ApprovedFact,
  BrandAsset,
  ReviewStatus,
} from '../types';

export const api = {
  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  // Reviews
  async getReviews(params?: {
    search?: string;
    status?: string;
    contentType?: string;
  }): Promise<ContentReview[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.contentType) query.set('contentType', params.contentType);

    const res = await fetch(`/api/reviews?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async getReviewById(id: string): Promise<ContentReview> {
    const res = await fetch(`/api/reviews/${id}`);
    if (!res.ok) throw new Error('Review not found');
    return res.json();
  },

  async submitReview(data: {
    title: string;
    contentType: string;
    caption?: string;
    imageUrl: string;
    isDraft?: boolean;
  }): Promise<ContentReview> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze creative review');
    }
    return res.json();
  },

  async retryReview(id: string): Promise<ContentReview> {
    const res = await fetch(`/api/reviews/${id}/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to retry compliance audit');
    return res.json();
  },

  async updateReviewStatus(
    id: string,
    status: ReviewStatus,
    note?: string
  ): Promise<ContentReview> {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, userEmail: 'reviewer@brandguard.ai' }),
    });
    if (!res.ok) throw new Error('Failed to update review status');
    return res.json();
  },

  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
  },

  // Guidelines
  async getGuidelines(): Promise<BrandGuideline[]> {
    const res = await fetch('/api/guidelines');
    if (!res.ok) throw new Error('Failed to load brand guidelines');
    return res.json();
  },

  async saveGuideline(guideline: Partial<BrandGuideline>): Promise<BrandGuideline> {
    const res = await fetch('/api/guidelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guideline),
    });
    if (!res.ok) throw new Error('Failed to save guideline');
    return res.json();
  },

  async deleteGuideline(id: string): Promise<void> {
    const res = await fetch(`/api/guidelines/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete guideline');
  },

  // Facts
  async getFacts(): Promise<ApprovedFact[]> {
    const res = await fetch('/api/facts');
    if (!res.ok) throw new Error('Failed to load corporate facts');
    return res.json();
  },

  async saveFact(fact: Partial<ApprovedFact>): Promise<ApprovedFact> {
    const res = await fetch('/api/facts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fact),
    });
    if (!res.ok) throw new Error('Failed to save corporate fact');
    return res.json();
  },

  async deleteFact(id: string): Promise<void> {
    const res = await fetch(`/api/facts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete fact');
  },

  // Assets
  async getAssets(): Promise<BrandAsset[]> {
    const res = await fetch('/api/assets');
    if (!res.ok) throw new Error('Failed to load brand assets');
    return res.json();
  },

  async saveAsset(asset: Partial<BrandAsset>): Promise<BrandAsset> {
    const res = await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!res.ok) throw new Error('Failed to save brand asset');
    return res.json();
  },

  async deleteAsset(id: string): Promise<void> {
    const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete asset');
  },
};
