import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  FileText,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { ContentReview } from '../types';
import { api } from '../services/api';

interface ReviewHistoryPageProps {
  onNavigateNewReview: () => void;
  onSelectReview: (id: string) => void;
}

export const ReviewHistoryPage: React.FC<ReviewHistoryPageProps> = ({
  onNavigateNewReview,
  onSelectReview,
}) => {
  const [reviews, setReviews] = useState<ContentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [contentTypeFilter, setContentTypeFilter] = useState('ALL');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.getReviews({
        search: searchTerm,
        status: statusFilter,
        contentType: contentTypeFilter,
      });
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch review history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, contentTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this marketing review audit?')) {
      try {
        await api.deleteReview(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Marketing Review History
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Immutable audit trail of creative marketing posts evaluated for brand voice, claims
            verification, and visual identity standards in persistent audit storage.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchReviews}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
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

      {/* Filter and Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs"
      >
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by creative title, campaign, or copy excerpt..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="FLAGGED">Flagged</option>
            <option value="APPROVED">Approved</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Content Types</option>
            <option value="Social Media Post (Instagram / LinkedIn)">
              Social Media Post (Instagram/LinkedIn)
            </option>
            <option value="Promotional Banner (Web / Display)">
              Promotional Banner (Web/Display)
            </option>
            <option value="Product Advertisement (Feed / Story)">
              Product Advertisement (Feed/Story)
            </option>
            <option value="Marketing Poster (Print / Digital)">
              Marketing Poster (Print/Digital)
            </option>
          </select>
        </div>
      </form>

      {/* Review History Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Creative Title</th>
                <th className="py-3.5 px-4">Content Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Compliance</th>
                <th className="py-3.5 px-4">Findings</th>
                <th className="py-3.5 px-4">Decisions</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    No marketing review records match your filters.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => {
                  const findingsCount = rev.findings?.length || 0;
                  const hasFlagged = rev.status === 'FLAGGED' || findingsCount > 0;
                  const decisionCount = rev.activity?.filter((a) => a.action.includes('Status')).length || 0;

                  return (
                    <tr
                      key={rev.id}
                      onClick={() => onSelectReview(rev.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img
                              src={rev.image_url}
                              alt={rev.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {rev.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                v1
                              </span>
                            </div>
                            {rev.caption && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                                {rev.caption}
                              </p>
                            )}
                          </div>
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

                      <td className="py-4 px-4">
                        {findingsCount > 0 ? (
                          <span className="text-rose-600 font-bold">
                            {findingsCount} findings
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {decisionCount}
                      </td>

                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(rev.created_at)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectReview(rev.id);
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors px-2 py-1 rounded hover:bg-emerald-50"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, rev.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Delete review record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
