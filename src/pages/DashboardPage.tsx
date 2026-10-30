import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Plus,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Percent,
  ShieldCheck,
  Database,
  BookOpen,
  Eye,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ContentReview, DashboardStats } from '../types';
import { api } from '../services/api';

interface DashboardPageProps {
  onNavigateNewReview: () => void;
  onNavigateHistory: () => void;
  onNavigateGuidelines: () => void;
  onSelectReview: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateNewReview,
  onNavigateHistory,
  onNavigateGuidelines,
  onSelectReview,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<ContentReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, reviewsData] = await Promise.all([
        api.getStats(),
        api.getReviews(),
      ]);
      setStats(statsData);
      setRecentReviews(reviewsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Flagged
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Needs Review
          </span>
        );
      case 'UNDER_REVIEW':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Marketing Governance Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Continuous pre-publication brand governance monitoring against approved visual assets, active
            guidelines, and verified facts.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onNavigateGuidelines}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Brand Setup</span>
          </button>

          <button
            onClick={onNavigateNewReview}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Review</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reviews */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Reviews
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
              {stats?.total_reviews ?? (loading ? '—' : 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats?.pending_reviews ?? 0} pending review
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Approved Content */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Approved Content
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
              {stats?.approved_reviews ?? (loading ? '—' : 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats?.approval_rate ?? 0}% approval rate
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Flagged / Violations */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Flagged / Violations
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
              {stats?.flagged_reviews ?? (loading ? '—' : 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Requires revision
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Avg Compliance Score */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Avg Compliance Score
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1.5">
              {stats?.avg_compliance_score ?? (loading ? '—' : 0)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across audited content
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Governance Engine Infrastructure Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Governance Engine Infrastructure
            </h2>
            <p className="text-xs text-slate-500">
              Core platform capabilities powering image review, OCR, brand rules, and persistent audit logs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Subcard 1 */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Audit Data Storage</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stores reviews, brand rules, verified facts, and authorized assets.
            </p>
          </div>

          {/* Subcard 2 */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Brand Knowledge</span>
              </div>
              <button
                onClick={onNavigateGuidelines}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Configure</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {stats?.engine_status.guidelines_count ?? 9} brand rules · {stats?.engine_status.facts_count ?? 4} verified facts · Authorized visual assets registry.
            </p>
          </div>

          {/* Subcard 3 */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-slate-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Vision &amp; OCR Engine</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Multimodal
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Image-first analysis extracting embedded typography, logo verification, and bounding boxes.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Pre-Publication Reviews Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Pre-Publication Reviews
              </h2>
              <p className="text-xs text-slate-500">
                Latest creative marketing posts and campaigns submitted for governance validation
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateHistory}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View all reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Creative / Post Title</th>
                <th className="py-3.5 px-4">Content Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Compliance</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No marketing reviews submitted yet. Click "New Review" to audit a creative.
                  </td>
                </tr>
              ) : (
                recentReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => onSelectReview(rev.id)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img
                            src={rev.image_url}
                            alt={rev.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                          {rev.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {rev.content_type}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(rev.status)}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {rev.compliance_score}%
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(rev.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReview(rev.id);
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
