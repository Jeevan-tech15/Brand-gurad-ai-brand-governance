import React from 'react';
import { Shield, Plus } from 'lucide-react';

interface HeaderProps {
  onNavigateNewReview: () => void;
  storageConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateNewReview,
  storageConnected = true,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#064e3b] flex items-center justify-center text-white shadow-xs">
          <Shield className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-base tracking-tight">BrandGuard</span>
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 leading-none">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-tight">
            Image-First Brand Governance & Creative Compliance
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* DB Connection Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-2xs">
          <span className="text-slate-400 font-mono text-[11px]">DB:</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700">Data Storage Connected</span>
        </div>

        {/* New Review CTA Button */}
        <button
          onClick={onNavigateNewReview}
          className="bg-[#047857] hover:bg-[#065f46] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Review</span>
        </button>
      </div>
    </header>
  );
};
