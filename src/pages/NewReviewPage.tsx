import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Info,
  Shield,
  FileText,
  X,
  RefreshCw,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

interface NewReviewPageProps {
  onBackToHistory: () => void;
  onReviewCreated: (reviewId: string) => void;
}

export const NewReviewPage: React.FC<NewReviewPageProps> = ({
  onBackToHistory,
  onReviewCreated,
}) => {
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('Social Media Post (Instagram / LinkedIn)');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeStr: string } | null>(null);
  const [activeGuidelinesCount, setActiveGuidelinesCount] = useState<number>(11);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getGuidelines()
      .then((rules) => {
        const active = rules.filter((r) => r.is_active).length;
        if (active > 0) setActiveGuidelinesCount(active);
      })
      .catch(() => {});
  }, []);

  // Core automatic analysis runner
  const runAnalysis = async (
    targetImageUrl: string,
    targetTitle?: string,
    targetContentType?: string,
    targetCaption?: string
  ) => {
    const finalTitle = (targetTitle || title).trim() || `Marketing Creative - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const finalContentType = targetContentType || contentType || 'Social Media Post (Instagram / LinkedIn)';
    const finalCaption = targetCaption !== undefined ? targetCaption : caption;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Fast non-blocking progressive status updates while audit runs concurrently
      setStatusStep('Auditing creative image, typography, logos & brand rules...');
      setProgressPercent(30);

      const timer1 = setTimeout(() => {
        setStatusStep('Multimodal Vision & OCR inspecting visible claims and bounding boxes...');
        setProgressPercent(65);
      }, 300);

      const timer2 = setTimeout(() => {
        setStatusStep('Cross-referencing corporate guidelines and scoring compliance...');
        setProgressPercent(90);
      }, 650);

      const review = await api.submitReview({
        title: finalTitle,
        contentType: finalContentType,
        caption: finalCaption,
        imageUrl: targetImageUrl,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setProgressPercent(100);
      setStatusStep('Compliance audit finalized!');

      // Immediately transition to review results
      onReviewCreated(review.id);
    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorMessage(err.message || 'Compliance review encountered an error. Please retry.');
      setIsSubmitting(false);
      setStatusStep('');
      setProgressPercent(0);
    }
  };

  // Handle file drop / select and AUTOMATICALLY trigger analysis
  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit.');
      return;
    }

    const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const autoTitle = cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      setTitle((prev) => (prev.trim() ? prev : autoTitle));

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        const ratio = (img.width / img.height).toFixed(2);
        setImageMeta({
          width: img.width,
          height: img.height,
          sizeStr: `${img.width}x${img.height} (${(file.size / 1024).toFixed(0)} KB, Aspect ${ratio}:1)`,
        });
      };
      img.src = result;

      // Automatically trigger analysis immediately upon upload
      runAnalysis(result, autoTitle);
    };
    reader.readAsDataURL(file);
    setErrorMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Submit Creative for Pre-Publication Review
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Upload marketing creatives, Instagram post graphics, or ad banners. BrandGuard automatically
            triggers multimodal compliance analysis upon upload.
          </p>
        </div>

        <button
          onClick={onBackToHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to History</span>
        </button>
      </div>

      {/* Active Brand Guidelines Enforcement Banner */}
      <div className="rounded-xl border border-emerald-200 bg-[#f0fdf4] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">
              Live Brand Governance Enforced:
            </span>{' '}
            <span className="text-xs text-slate-600">
              {activeGuidelinesCount} active brand guidelines will inspect this creative for pricing, warranties, typography, and visual compliance.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHistory}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
        >
          View All Brand Guidelines
        </button>
      </div>

      {/* Automatic Analysis Progress Banner */}
      {isSubmitting && (
        <div className="rounded-2xl border border-emerald-300 bg-white p-6 shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automatic Pre-Publication Analysis in Progress
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  {statusStep}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {progressPercent}%
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#047857] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${progressPercent >= 20 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Image Validated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${progressPercent >= 45 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>OCR Extracted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${progressPercent >= 75 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Gemini Vision Audited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${progressPercent >= 100 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Compliance Computed</span>
            </div>
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            {imageUrl && (
              <button
                type="button"
                onClick={() => runAnalysis(imageUrl)}
                className="font-bold underline text-rose-800 hover:text-rose-950 cursor-pointer"
              >
                Retry Analysis
              </button>
            )}
            <button onClick={() => setErrorMessage(null)} className="cursor-pointer">
              <X className="w-4 h-4 text-rose-400 hover:text-rose-600" />
            </button>
          </div>
        </div>
      )}

      {/* Form Content: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Creative Asset Upload */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Marketing Creative Asset</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload any ad image (PNG, JPG, JPEG, WebP up to 10MB). Analysis begins automatically.
            </p>
          </div>

          {/* Dropzone */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {!imageUrl ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20 min-h-[380px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-emerald-600 mb-4">
                <UploadCloud className="w-7 h-7 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Upload Marketing Creative
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Drag and drop your post creative here, or click to browse. Automatic analysis starts immediately upon upload.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-mono text-slate-500">
                <span>PNG</span>
                <span>•</span>
                <span>JPG</span>
                <span>•</span>
                <span>WebP</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[460px] flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Creative preview"
                  className="max-h-[460px] w-auto object-contain mx-auto"
                />
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(null);
                      setImageMeta(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-xs cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Image metadata bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>{imageMeta?.sizeStr || 'Active Creative Asset'}</span>
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    Replace Asset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Campaign Metadata & Post Copy */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Campaign Metadata &amp; Post Copy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured rules, verified facts, and visual assets will be evaluated across this asset
            </p>
          </div>

          {/* Campaign Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Campaign / Creative Title
            </label>
            <input
              type="text"
              value={title}
              disabled={isSubmitting}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Cloud Infrastructure Launch - Instagram Feed"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50"
            />
          </div>

          {/* Content Type Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Content Type
            </label>
            <select
              value={contentType}
              disabled={isSubmitting}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:bg-slate-50"
            >
              <option value="Social Media Post (Instagram / LinkedIn)">
                Social Media Post (Instagram / LinkedIn)
              </option>
              <option value="Promotional Banner (Web / Display)">
                Promotional Banner (Web / Display)
              </option>
              <option value="Product Advertisement (Feed / Story)">
                Product Advertisement (Feed / Story)
              </option>
              <option value="Marketing Poster (Print / Digital)">
                Marketing Poster (Print / Digital)
              </option>
            </select>
          </div>

          {/* Accompanying Post Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Accompanying Post Caption <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={caption}
              disabled={isSubmitting}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional. Paste caption to cross-verify claims against visible image graphic..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed disabled:bg-slate-50"
            />
          </div>

          {/* Image-Only Governance Pipeline Box */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-slate-900">Image-Only Governance Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-600">
              BrandGuard audits the uploaded image pixels and all visible creative content directly across 7 compliance categories:
            </p>

            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Spelling &amp; Text Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Logo &amp; Brand Identity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Abusive or Harmful Content</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Layout &amp; Visual Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Claims &amp; Internal Consistency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>IP, Copyright &amp; Trademarks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100/60 flex items-start gap-1.5 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                No caption required. Findings are mapped directly to image coordinates with bounding boxes.
              </span>
            </div>
          </div>

          {/* Action Button: Manual Trigger / Re-audit if image already selected */}
          {imageUrl && !isSubmitting && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => runAnalysis(imageUrl)}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Analyze Uploaded Creative</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
