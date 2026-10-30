import React from 'react';
import { LayoutDashboard, FilePlus2, History, CheckSquare } from 'lucide-react';

export type NavTab = 'dashboard' | 'new-review' | 'history' | 'guidelines';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  storageProvider?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  storageProvider = 'Audit Storage',
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'new-review' as NavTab,
      label: 'New Content Review',
      icon: FilePlus2,
    },
    {
      id: 'history' as NavTab,
      label: 'Review History',
      icon: History,
    },
    {
      id: 'guidelines' as NavTab,
      label: 'Guidelines, Facts & Assets',
      icon: CheckSquare,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div>
        {/* Brand Governance Navigation */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2.5">
            Brand Governance
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#059669]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Governance Engine Status Card */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Governance Engine
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Platform</span>
              <span className="font-medium text-slate-700">Image-First</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database</span>
              <span className="font-medium text-slate-700">{storageProvider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vision &amp; OCR</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">BrandGuard AI</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </aside>
  );
};
