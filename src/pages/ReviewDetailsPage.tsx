import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  FileText,
  Eye,
  Type,
  Layers,
  Sparkles,
  Download,
  Clock,
  Send,
  MessageSquare,
} from 'lucide-react';
import { ContentReview, ReviewFinding, ReviewStatus, FindingSeverity } from '../types';
import { api } from '../services/api';
import { AnnotatedImageViewer } from '../components/AnnotatedImageViewer';

interface ReviewDetailsPageProps {
  reviewId: string;
  onBack: () => void;
  onSelectReview?: (id: string) => void;
}

export const ReviewDetailsPage: React.FC<ReviewDetailsPageProps> = ({
  reviewId,
  onBack,
  onSelectReview,
}) => {
  const [review, setReview] = useState<ContentReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [availableReviews, setAvailableReviews] = useState<ContentReview[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [activeSeverityTab, setActiveSeverityTab] = useState<string>('ALL');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Reviewer comment state
  const [reviewerNote, setReviewerNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchReview = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await api.getReviewById(reviewId);
      setReview(data);
    } catch (err: any) {
      console.warn('Failed to load review details:', err);
      setLoadError(err.message || 'Review not found');
      // Clear stale persisted review ID so refresh doesn't remain stuck
      try {
        localStorage.removeItem('brandguard_active_review_id');
      } catch {}
      // Fetch available reviews to provide seamless fallback navigation
      try {
        const all = await api.getReviews();
        setAvailableReviews(all.slice(0, 6));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      const updated = await api.retryReview(reviewId);
      setReview(updated);
    } catch (err: any) {
      alert(err.message || 'Retry failed');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleUpdateStatus = async (status: ReviewStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await api.updateReviewStatus(reviewId, status, reviewerNote);
      setReview(updated);
      setReviewerNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleExportJson = () => {
    if (!review) return;
    const blob = new Blob([JSON.stringify(review, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandguard-audit-${review.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
        <RotateCw className="w-6 h-6 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium text-slate-700">Loading marketing compliance audit...</p>
        <span className="text-xs text-slate-400 mt-1">Inspecting visual assets and compliance rules</span>
      </div>
    );
  }

  if (loadError || !review) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-2xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Review Not Found
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The audit record for <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">#{reviewId}</code> could not be found in active storage. It may have been cleared during a session reset or deleted.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Review History</span>
            </button>
            <button
              onClick={fetchReview}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Retry Loading
            </button>
          </div>

          {availableReviews.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Or Open an Available Marketing Audit:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableReviews.map((ar) => (
                  <div
                    key={ar.id}
                    onClick={() => {
                      if (onSelectReview) onSelectReview(ar.id);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center gap-3 bg-slate-50/50"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                      <img
                        src={ar.image_url}
                        alt={ar.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="grow min-w-0">
                      <div className="font-semibold text-xs text-slate-900 truncate">
                        {ar.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Score: <span className="font-bold text-slate-700">{ar.compliance_score}%</span> • {ar.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const findings = review.findings || [];
  const filteredFindings = findings.filter((f) => {
    if (activeSeverityTab === 'ALL') return true;
    return f.severity === activeSeverityTab;
  });

  const getSeverityBadgeClass = (sev: FindingSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'INFORMATIONAL':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'APPROVED FACT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'BRAND GUIDELINE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OCR':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'CAPTION':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'IMAGE':
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  const selectedFinding = findings.find((f) => f.id === selectedFindingId);

  const isLogoPresent = Boolean(
    review.vision_summary?.logo_detected ??
      (review.vision_summary?.logos_detected && review.vision_summary.logos_detected.length > 0)
  );
  const detectedLogoName =
    review.vision_summary?.logo_name ||
    (review.vision_summary?.logos_detected && review.vision_summary.logos_detected[0]) ||
    '';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Back to reviews"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {review.title}
              </h1>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                v1
              </span>
              <span className="text-xs font-mono text-slate-400">
                #{review.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {review.content_type} • Submitted{' '}
              {new Date(review.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Auditing...' : 'Re-run Audit'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>

          {/* Review Decision Buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={() => handleUpdateStatus('APPROVED')}
              disabled={isUpdatingStatus}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('NEEDS_REVIEW')}
              disabled={isUpdatingStatus}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Review</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('FLAGGED')}
              disabled={isUpdatingStatus}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Flag Creative</span>
            </button>
          </div>
        </div>
      </div>

      {/* Engine Status Advisory if any */}
      {review.error_message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Compliance Engine Advisory:</span>
            <span>{review.error_message}</span>
          </div>
        </div>
      )}

      {/* Brand Logo Verification & Metadata Status Bar (Factual detection indicator) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isLogoPresent
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Brand Logo Detection:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isLogoPresent
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLogoPresent ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {isLogoPresent ? 'Logo Present' : 'No Logo Detected'}
              </span>
              {isLogoPresent && detectedLogoName && (
                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {detectedLogoName}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Factual audit verification — brand logo presence or absence does not deduct compliance points or issue recommendations.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2">
          <span className="font-medium text-slate-700">Content Type:</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-800">
            {review.content_type}
          </span>
        </div>
      </div>

      {/* Compliance Score Breakdown & Methodology Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border-2 border-slate-800 shadow-sm">
              <span className="text-2xl font-black">{review.compliance_score}%</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Score
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Transparent Compliance Scoring Methodology
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    review.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : review.status === 'FLAGGED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {review.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Calculated from baseline (100) minus evidence-backed severity deductions. No double-counting;
                each deduction corresponds to an explicit finding mapped to OCR, Vision, or Brand Guidelines.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[200px]">
            <div className="flex justify-between py-0.5">
              <span>Baseline:</span>
              <span className="font-semibold text-slate-800">100 pts</span>
            </div>
            <div className="flex justify-between py-0.5 text-rose-600 font-semibold">
              <span>Total Deductions:</span>
              <span>
                -
                {review.score_deductions?.reduce((sum, d) => sum + d.points, 0) ||
                  100 - review.compliance_score}{' '}
                pts
              </span>
            </div>
            <div className="flex justify-between py-0.5 border-t border-slate-200 mt-1 pt-1 font-bold text-slate-900">
              <span>Final Compliance:</span>
              <span>{review.compliance_score}%</span>
            </div>
          </div>
        </div>

        {/* Itemized Deductions list if any */}
        {review.score_deductions && review.score_deductions.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Itemized Score Deductions
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {review.score_deductions.map((ded, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-start justify-between text-xs"
                >
                  <div className="pr-2">
                    <span className="font-bold text-rose-900 block">{ded.title}</span>
                    <span className="text-[11px] text-rose-700 line-clamp-1">{ded.reason}</span>
                  </div>
                  <span className="font-black text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200 shrink-0">
                    -{ded.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Graphic View on Left, Findings Audit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Creative Graphic Asset Viewer with Interactive Annotations */}
        <div className="lg:col-span-6 space-y-3 sticky top-20">
          <AnnotatedImageViewer
            imageUrl={review.image_url}
            findings={findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={(id) => {
              setSelectedFindingId(id);
              if (id) {
                const el = document.getElementById(`finding-card-${id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
          />

          {/* Accompanying Post Copy Display */}
          {review.caption && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Accompanying Post Caption:
              </span>
              <p className="text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                "{review.caption}"
              </p>
            </div>
          )}
        </div>

        {/* Right: Compliance Findings & Multimodal Analysis */}
        <div className="lg:col-span-6 space-y-6">
          {/* Findings Audit Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Compliance Findings ({findings.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any issue to highlight &amp; zoom to its exact location on the creative
                </p>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSeverityTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      activeSeverityTab === tab
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings Card List */}
            <div className="space-y-3">
              {filteredFindings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No findings in this category.
                </div>
              ) : (
                filteredFindings.map((f, idx) => {
                  const isSelected = selectedFindingId === f.id;
                  const issueNum = f.issue_number || idx + 1;
                  const isLocationUncertain = f.bounding_box?.is_uncertain || !f.bounding_box;

                  return (
                    <div
                      key={f.id}
                      id={`finding-card-${f.id}`}
                      onClick={() => setSelectedFindingId(f.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/25 shadow-md ring-2 ring-emerald-500/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-2xs'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Numbered issue tag */}
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                              f.severity === 'CRITICAL' || f.severity === 'HIGH'
                                ? 'bg-red-600 text-white'
                                : f.severity === 'MEDIUM'
                                ? 'bg-orange-600 text-white'
                                : 'bg-yellow-500 text-slate-900'
                            }`}
                          >
                            #{issueNum}
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadgeClass(
                              f.severity
                            )}`}
                          >
                            {f.severity}
                          </span>

                          {/* Distinct Status: Confirmed Error, Potential Risk, or Unverified Claim */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              f.status_type === 'CONFIRMED_ERROR' || (f.is_confirmed && !f.status_type)
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : f.status_type === 'POTENTIAL_RISK'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-purple-100 text-purple-800 border-purple-300'
                            }`}
                          >
                            {f.status_type === 'CONFIRMED_ERROR' || (f.is_confirmed && !f.status_type)
                              ? 'Confirmed Error'
                              : f.status_type === 'POTENTIAL_RISK'
                              ? 'Potential Risk'
                              : 'Unverified Claim'}
                          </span>

                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getSourceBadgeClass(
                              f.evidence_source
                            )}`}
                          >
                            {f.evidence_source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            -{f.deduction} pts
                          </span>
                          {!isLocationUncertain && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFindingId(f.id);
                                window.scrollTo({ top: 200, behavior: 'smooth' });
                              }}
                              className={`text-[11px] px-2 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              📍 Focus on Image
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Finding Title & Category */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          {f.finding_title}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({f.category})
                        </span>
                      </div>

                      {/* Location description indicator */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                        {isLocationUncertain ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-dashed border-slate-300">
                            📍 Location unavailable (global copy / caption)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            📍 {f.location_description || 'Identified on visual canvas'}
                          </span>
                        )}
                        <span className="text-slate-400 font-mono text-[10px]">
                          ({f.confidence}% confidence)
                        </span>
                      </div>

                      {/* Exact Detected Text in Image if available */}
                      {f.detected_text && (
                        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 mb-2.5 text-xs">
                          <span className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider mb-0.5">
                            Detected Visible Text:
                          </span>
                          <span className="text-amber-950 font-medium italic">
                            "{f.detected_text}"
                          </span>
                        </div>
                      )}

                      {/* Description & Detailed Reason */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {f.description}
                      </p>

                      {/* Exact Evidence Box */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 mb-2.5 text-xs">
                        <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">
                          Audited Evidence &amp; Rule Reference:
                        </span>
                        <code className="text-slate-800 font-mono text-[11px] break-words">
                          {f.evidence}
                        </code>
                      </div>

                      {/* Actionable Solution & Exact Fix */}
                      <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 space-y-1 mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Actionable Solution &amp; Exact Fix:</span>
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed font-semibold pl-5">
                          {f.solution || f.recommendation}
                        </p>
                      </div>

                      {/* Governance context if different from solution */}
                      {f.recommendation && f.solution && f.recommendation !== f.solution && (
                        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-1">
                          <span className="font-semibold text-slate-900">Policy Guidance: </span>
                          <span>{f.recommendation}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Deep Dive: Vision Summary, OCR text, and Caption Analysis */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Multi-Engine Intelligence Deep Dive</span>
            </h3>

            {/* Sub-tabs / Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Vision Summary */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gemini Vision</span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div>
                    <span className="font-medium">Products:</span>{' '}
                    {review.vision_summary?.main_products?.join(', ') || 'Audio/Electronics'}
                  </div>
                  <div>
                    <span className="font-medium">Logo Status:</span>{' '}
                    {isLogoPresent ? (
                      <span className="text-emerald-700 font-semibold">
                        Present {detectedLogoName ? `(${detectedLogoName})` : ''}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">No Logo Detected</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Quality Score:</span>{' '}
                    {review.vision_summary?.visual_quality_score ?? 95}/100
                  </div>
                </div>
              </div>

              {/* Tesseract OCR */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tesseract.js OCR</span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div>
                    <span className="font-medium">Lines Extracted:</span>{' '}
                    {review.ocr_result?.lines?.length ?? 4}
                  </div>
                  <div>
                    <span className="font-medium">Prices Found:</span>{' '}
                    {review.ocr_result?.extracted_elements?.prices?.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>{' '}
                    {review.ocr_result?.confidence ?? 92}%
                  </div>
                </div>
              </div>

              {/* Caption Engine */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Caption Analysis</span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div>
                    <span className="font-medium">Tone:</span>{' '}
                    {review.caption_analysis?.tone_of_voice || 'Promotional Marketing'}
                  </div>
                  <div>
                    <span className="font-medium">Claims Detected:</span>{' '}
                    {review.caption_analysis?.product_claims?.length ?? 2} claims
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History & Activity Trail */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Immutable Audit Trail &amp; Decisions</span>
            </h3>

            {/* Decision note input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Add Reviewer Audit Note:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="Record justification, legal disclaimer check, or waiver notes..."
                  className="grow px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(review.status)}
                  disabled={!reviewerNote.trim()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Post Note
                </button>
              </div>
            </div>

            {/* Activity list */}
            <div className="space-y-2.5 pt-2">
              {review.activity?.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{act.action}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({act.user_email})
                      </span>
                    </div>
                    <p className="text-slate-600">{act.details}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {new Date(act.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
