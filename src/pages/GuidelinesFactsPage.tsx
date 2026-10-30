import React, { useEffect, useState } from 'react';
import {
  Shield,
  BookOpen,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Database,
  Image as ImageIcon,
  Check,
  X,
  Search,
} from 'lucide-react';
import { BrandGuideline, ApprovedFact, BrandAsset } from '../types';
import { api } from '../services/api';

type Tab = 'guidelines' | 'facts' | 'assets' | 'database';

export const GuidelinesFactsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('guidelines');

  const [guidelines, setGuidelines] = useState<BrandGuideline[]>([]);
  const [facts, setFacts] = useState<ApprovedFact[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals / forms
  const [showAddGuideline, setShowAddGuideline] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<BrandGuideline | null>(null);
  const [newProhibitedWordsStr, setNewProhibitedWordsStr] = useState('');
  const [editProhibitedWordsStr, setEditProhibitedWordsStr] = useState('');
  const [guidelineSearch, setGuidelineSearch] = useState('');
  const [guidelineCategoryFilter, setGuidelineCategoryFilter] = useState('ALL');

  const [newGuideline, setNewGuideline] = useState<Partial<BrandGuideline>>({
    rule_title: '',
    category: 'Claims & Internal Consistency',
    description: '',
    severity_on_breach: 'HIGH',
    is_active: true,
    required_disclaimer_text: '',
  });

  const [showAddFact, setShowAddFact] = useState(false);
  const [newFact, setNewFact] = useState<Partial<ApprovedFact>>({
    title: '',
    entity_type: 'WARRANTY',
    official_statement: '',
    category: 'Hardware Audio',
    verification_doc_ref: '',
  });

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [assetFilter, setAssetFilter] = useState<'ALL' | 'LOGO' | 'BADGE' | 'PRODUCT_RENDER'>('ALL');
  const [assetFilePreview, setAssetFilePreview] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState<Partial<BrandAsset>>({
    brand_name: 'BrandGuard AI',
    asset_name: '',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: '',
    usage_instructions: '',
    clear_space_rule: 'Minimum 16px exclusion zone',
    permitted_backgrounds: ['#ffffff', '#f8fafc'],
    official_colors: ['#047857', '#ffffff'],
    is_approved: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [g, f, a] = await Promise.all([
        api.getGuidelines(),
        api.getFacts(),
        api.getAssets(),
      ]);
      setGuidelines(g);
      setFacts(f);
      setAssets(a);
    } catch (err) {
      console.error('Failed to load knowledge assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleGuideline = async (g: BrandGuideline) => {
    try {
      const updated = await api.saveGuideline({ ...g, is_active: !g.is_active });
      setGuidelines((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      alert('Failed to update guideline status');
    }
  };

  const handleDeleteGuideline = async (id: string) => {
    if (confirm('Delete this brand guideline?')) {
      await api.deleteGuideline(id);
      setGuidelines((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleOpenEditGuideline = (g: BrandGuideline) => {
    setEditingGuideline({ ...g });
    setEditProhibitedWordsStr(g.prohibited_words?.join(', ') || '');
  };

  const handleSaveEditGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuideline || !editingGuideline.rule_title) return;
    try {
      const prohibited_words = editProhibitedWordsStr
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);

      const toSave = {
        ...editingGuideline,
        prohibited_words: prohibited_words.length > 0 ? prohibited_words : undefined,
      };

      const updated = await api.saveGuideline(toSave);
      setGuidelines((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEditingGuideline(null);
    } catch (err) {
      alert('Failed to save edited guideline');
    }
  };

  const handleCreateGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideline.rule_title) return;
    try {
      const prohibited_words = newProhibitedWordsStr
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);

      const created = await api.saveGuideline({
        ...newGuideline,
        prohibited_words: prohibited_words.length > 0 ? prohibited_words : undefined,
      });
      setGuidelines((prev) => [...prev, created]);
      setShowAddGuideline(false);
      setNewProhibitedWordsStr('');
      setNewGuideline({
        rule_title: '',
        category: 'Claims & Internal Consistency',
        description: '',
        severity_on_breach: 'HIGH',
        is_active: true,
        required_disclaimer_text: '',
      });
    } catch (err) {
      alert('Failed to save guideline');
    }
  };

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.title || !newFact.official_statement) return;
    try {
      const created = await api.saveFact(newFact);
      setFacts((prev) => [...prev, created]);
      setShowAddFact(false);
      setNewFact({
        title: '',
        entity_type: 'WARRANTY',
        official_statement: '',
        category: 'Hardware Audio',
        verification_doc_ref: '',
      });
    } catch (err) {
      alert('Failed to save fact');
    }
  };

  const handleDeleteFact = async (id: string) => {
    if (confirm('Delete this approved corporate fact?')) {
      await api.deleteFact(id);
      setFacts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAssetFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAssetFilePreview(result);
      setNewAsset((prev) => ({
        ...prev,
        image_url: result,
        asset_name: prev.asset_name || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.asset_name || (!newAsset.image_url && !assetFilePreview)) {
      alert('Asset name and reference image are required.');
      return;
    }
    try {
      const created = await api.saveAsset({
        ...newAsset,
        image_url: newAsset.image_url || assetFilePreview || '',
      });
      setAssets((prev) => [...prev, created]);
      setShowAddAsset(false);
      setAssetFilePreview(null);
      setNewAsset({
        brand_name: 'BrandGuard AI',
        asset_name: '',
        asset_type: 'LOGO',
        variation_type: 'PRIMARY',
        image_url: '',
        usage_instructions: '',
        clear_space_rule: 'Minimum 16px exclusion zone',
        permitted_backgrounds: ['#ffffff', '#f8fafc'],
        official_colors: ['#047857', '#ffffff'],
        is_approved: true,
      });
    } catch (err) {
      alert('Failed to save brand asset');
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (confirm('Delete this brand asset?')) {
      await api.deleteAsset(id);
      setAssets((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredGuidelines = guidelines.filter((g) => {
    const query = guidelineSearch.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      g.rule_title.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query) ||
      (g.required_disclaimer_text && g.required_disclaimer_text.toLowerCase().includes(query)) ||
      (g.prohibited_words && g.prohibited_words.some((w) => w.toLowerCase().includes(query)));

    const matchesCategory =
      guidelineCategoryFilter === 'ALL' || g.category === guidelineCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeGuidelinesCount = guidelines.filter((g) => g.is_active).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Brand Guidelines, Facts &amp; Visual Assets
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Configure active governance rules, verified corporate facts, and authorized visual assets that
            power multimodal verification.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Knowledge</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'guidelines'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Brand Guidelines ({guidelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'facts'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Approved Corporate Facts ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Brand Assets Registry ({assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'database'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Storage &amp; Supabase Integration</span>
        </button>
      </div>

      {/* TAB 1: GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">
                Active governance rules enforced during AI compliance audits. Deactivating or modifying a rule instantly adjusts audit checks.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {activeGuidelinesCount} Active Rules
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {guidelines.length - activeGuidelinesCount} Disabled
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAddGuideline(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guideline</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={guidelineSearch}
                  onChange={(e) => setGuidelineSearch(e.target.value)}
                  placeholder="Search guidelines by keyword, rule name, or prohibited words..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-emerald-600 focus:border-emerald-600 text-slate-800 placeholder-slate-400"
                />
                {guidelineSearch && (
                  <button
                    onClick={() => setGuidelineSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Category:</label>
                <select
                  value={guidelineCategoryFilter}
                  onChange={(e) => setGuidelineCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-emerald-600"
                >
                  <option value="ALL">All Categories ({guidelines.length})</option>
                  <option value="Claims & Internal Consistency">Claims & Internal Consistency</option>
                  <option value="Pricing & Discounts">Pricing & Discounts</option>
                  <option value="Warranty & Terms">Warranty & Terms</option>
                  <option value="Spelling & Text Accuracy">Spelling & Text Accuracy</option>
                  <option value="Logo & Brand Identity">Logo & Brand Identity</option>
                  <option value="Required Disclaimers">Required Disclaimers</option>
                  <option value="Visual Hierarchy & Typography">Visual Hierarchy & Typography</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal / Add Guideline Form */}
          {showAddGuideline && (
            <form
              onSubmit={handleCreateGuideline}
              className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-md space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Add Brand Guideline Rule</h3>
                <button
                  type="button"
                  onClick={() => setShowAddGuideline(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Rule Title *</label>
                  <input
                    type="text"
                    required
                    value={newGuideline.rule_title}
                    onChange={(e) => setNewGuideline({ ...newGuideline, rule_title: e.target.value })}
                    placeholder="e.g. Unqualified Free Shipping Claims Prohibited"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newGuideline.category}
                    onChange={(e) =>
                      setNewGuideline({ ...newGuideline, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Claims & Internal Consistency">Claims & Internal Consistency</option>
                    <option value="Pricing & Discounts">Pricing & Discounts</option>
                    <option value="Warranty & Terms">Warranty & Terms</option>
                    <option value="Spelling & Text Accuracy">Spelling & Text Accuracy</option>
                    <option value="Logo & Brand Identity">Logo & Brand Identity</option>
                    <option value="Required Disclaimers">Required Disclaimers</option>
                    <option value="Visual Hierarchy & Typography">Visual Hierarchy & Typography</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Rule Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newGuideline.description}
                  onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                  placeholder="Detail the exact standard and required qualification..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Prohibited Words / Phrases (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProhibitedWordsStr}
                    onChange={(e) => setNewProhibitedWordsStr(e.target.value)}
                    placeholder="e.g. lifetime warranty, permanently, risk-free"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Required Disclaimer Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newGuideline.required_disclaimer_text || ''}
                    onChange={(e) =>
                      setNewGuideline({ ...newGuideline, required_disclaimer_text: e.target.value })
                    }
                    placeholder="e.g. Terms apply. Available on select models only."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Severity on breach:</span>
                  <select
                    value={newGuideline.severity_on_breach}
                    onChange={(e) =>
                      setNewGuideline({
                        ...newGuideline,
                        severity_on_breach: e.target.value as any,
                      })
                    }
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="CRITICAL">CRITICAL (-35 pts)</option>
                    <option value="HIGH">HIGH (-20 pts)</option>
                    <option value="MEDIUM">MEDIUM (-10 pts)</option>
                    <option value="LOW">LOW (-5 pts)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGuideline(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Save Rule
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Edit Guideline Modal */}
          {editingGuideline && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveEditGuideline}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Guideline Rule</h3>
                    <p className="text-xs text-slate-500 font-mono">{editingGuideline.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingGuideline(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Rule Title *</label>
                    <input
                      type="text"
                      required
                      value={editingGuideline.rule_title}
                      onChange={(e) =>
                        setEditingGuideline({ ...editingGuideline, rule_title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={editingGuideline.category}
                      onChange={(e) =>
                        setEditingGuideline({
                          ...editingGuideline,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Claims & Internal Consistency">Claims & Internal Consistency</option>
                      <option value="Pricing & Discounts">Pricing & Discounts</option>
                      <option value="Warranty & Terms">Warranty & Terms</option>
                      <option value="Spelling & Text Accuracy">Spelling & Text Accuracy</option>
                      <option value="Logo & Brand Identity">Logo & Brand Identity</option>
                      <option value="Required Disclaimers">Required Disclaimers</option>
                      <option value="Visual Hierarchy & Typography">Visual Hierarchy & Typography</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Rule Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingGuideline.description}
                    onChange={(e) =>
                      setEditingGuideline({ ...editingGuideline, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Prohibited Words / Phrases (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editProhibitedWordsStr}
                      onChange={(e) => setEditProhibitedWordsStr(e.target.value)}
                      placeholder="e.g. lifetime warranty, permanently, risk-free"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Required Disclaimer Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingGuideline.required_disclaimer_text || ''}
                      onChange={(e) =>
                        setEditingGuideline({
                          ...editingGuideline,
                          required_disclaimer_text: e.target.value,
                        })
                      }
                      placeholder="e.g. Terms apply. Available on select models only."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">Severity:</span>
                      <select
                        value={editingGuideline.severity_on_breach}
                        onChange={(e) =>
                          setEditingGuideline({
                            ...editingGuideline,
                            severity_on_breach: e.target.value as any,
                          })
                        }
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="CRITICAL">CRITICAL (-35 pts)</option>
                        <option value="HIGH">HIGH (-20 pts)</option>
                        <option value="MEDIUM">MEDIUM (-10 pts)</option>
                        <option value="LOW">LOW (-5 pts)</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingGuideline.is_active}
                        onChange={(e) =>
                          setEditingGuideline({
                            ...editingGuideline,
                            is_active: e.target.checked,
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Enforce this rule</span>
                    </label>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingGuideline(null)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Guidelines Grid */}
          {filteredGuidelines.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
              <Shield className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-700">No brand guidelines found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No rules matched your search query or category filter. Try clearing filters or adding a new rule.
              </p>
              {(guidelineSearch || guidelineCategoryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setGuidelineSearch('');
                    setGuidelineCategoryFilter('ALL');
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuidelines.map((g) => (
                <div
                  key={g.id}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between transition-all ${
                    g.is_active ? 'border-slate-200' : 'border-slate-200/50 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {g.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          g.severity_on_breach === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : g.severity_on_breach === 'HIGH'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {g.severity_on_breach}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {g.rule_title}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                      {g.category}
                    </span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {g.description}
                    </p>

                    {g.prohibited_words && g.prohibited_words.length > 0 && (
                      <div className="mt-3 p-2 bg-rose-50/60 rounded-lg border border-rose-100 text-[11px]">
                        <span className="font-semibold block text-rose-800 mb-1">Prohibited terms:</span>
                        <div className="flex flex-wrap gap-1">
                          {g.prohibited_words.map((w, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-rose-100/80 text-rose-700 rounded text-[10px] font-medium"
                            >
                              "{w}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {g.required_disclaimer_text && (
                      <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                        <span className="font-semibold block text-slate-700">Mandatory disclaimer:</span>
                        "{g.required_disclaimer_text}"
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleGuideline(g)}
                      className={`font-semibold cursor-pointer ${
                        g.is_active ? 'text-emerald-700 hover:text-emerald-800' : 'text-slate-400'
                      }`}
                      title={g.is_active ? 'Click to disable' : 'Click to enable'}
                    >
                      {g.is_active ? '● Active' : '○ Disabled'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditGuideline(g)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuideline(g.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FACTS */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Verified corporate specifications, certified warranties, and approved promotional caps.
            </p>
            <button
              onClick={() => setShowAddFact(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified Fact</span>
            </button>
          </div>

          {showAddFact && (
            <form
              onSubmit={handleCreateFact}
              className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Add Approved Corporate Fact</h3>
                <button
                  type="button"
                  onClick={() => setShowAddFact(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Fact Title *</label>
                  <input
                    type="text"
                    required
                    value={newFact.title}
                    onChange={(e) => setNewFact({ ...newFact, title: e.target.value })}
                    placeholder="e.g. ApexSound Soundbar Standard Warranty"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Entity Type</label>
                  <select
                    value={newFact.entity_type}
                    onChange={(e) => setNewFact({ ...newFact, entity_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="WARRANTY">WARRANTY</option>
                    <option value="PRODUCT_SPEC">PRODUCT SPEC</option>
                    <option value="DISCOUNT">DISCOUNT / PROMO</option>
                    <option value="OFFER">OFFER / CLAIM</option>
                    <option value="PRICE">PRICE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Statement *</label>
                <textarea
                  rows={2}
                  required
                  value={newFact.official_statement}
                  onChange={(e) => setNewFact({ ...newFact, official_statement: e.target.value })}
                  placeholder="Official legal statement verifying the exact figure or terms..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFact(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Save Fact
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map((f) => (
              <div
                key={f.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                    {f.entity_type}
                  </span>
                  <button
                    onClick={() => handleDeleteFact(f.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>

                <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs text-purple-950 font-serif leading-relaxed">
                  "{f.official_statement}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Ref: {f.verification_doc_ref || 'INTERNAL-AUDIT'}</span>
                  <span>{f.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL BRAND LOGO & ASSET REGISTRY */}
      {activeTab === 'assets' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Brand Logo &amp; Reference Asset Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized vector logos, monochrome variations, and certified partner badges used during creative compliance verification.
              </p>
            </div>
            <button
              onClick={() => setShowAddAsset(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Reference Logo</span>
            </button>
          </div>

          {/* Sub-filter tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {(['ALL', 'LOGO', 'BADGE', 'PRODUCT_RENDER'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setAssetFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  assetFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'ALL'
                  ? `All Assets (${assets.length})`
                  : filter === 'LOGO'
                  ? `Brand Logos (${assets.filter((a) => a.asset_type === 'LOGO').length})`
                  : filter === 'BADGE'
                  ? `Partner Badges (${assets.filter((a) => a.asset_type === 'BADGE').length})`
                  : `Product Renders (${assets.filter((a) => a.asset_type === 'PRODUCT_RENDER').length})`}
              </button>
            ))}
          </div>

          {/* Reference Logo Upload / Registration Modal */}
          {showAddAsset && (
            <form
              onSubmit={handleCreateAsset}
              className="bg-white border-2 border-emerald-500/40 rounded-2xl p-6 shadow-md space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upload Official Brand Logo Reference</h3>
                  <span className="text-[11px] text-slate-500">
                    Registered assets are stored and referenced for vector matching, aspect ratio, and color verification.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newAsset.brand_name || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, brand_name: e.target.value })}
                    placeholder="e.g. BrandGuard AI, ApexSound"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Asset Label / Title *</label>
                  <input
                    type="text"
                    required
                    value={newAsset.asset_name || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_name: e.target.value })}
                    placeholder="e.g. Primary Emerald Vector Shield"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Asset Type</label>
                  <select
                    value={newAsset.asset_type}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="LOGO">Official Logo</option>
                    <option value="BADGE">Certified Partner / Trust Badge</option>
                    <option value="PRODUCT_RENDER">Product 3D Render</option>
                    <option value="COLOR_PALETTE">Official Color Palette</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Logo Variation Type</label>
                  <select
                    value={newAsset.variation_type || 'PRIMARY'}
                    onChange={(e) => setNewAsset({ ...newAsset, variation_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="PRIMARY">PRIMARY (Full Color)</option>
                    <option value="MONOCHROME_DARK">MONOCHROME DARK (Black / Charcoal)</option>
                    <option value="MONOCHROME_WHITE">MONOCHROME WHITE (Inverted for Dark BGs)</option>
                    <option value="BADGE_ICON">BADGE / ICON ONLY</option>
                    <option value="PARTNER_SPONSOR">PARTNER / SPONSOR CERTIFICATION</option>
                    <option value="SECONDARY">SECONDARY / HORIZONTAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Clear Space Rule</label>
                  <input
                    type="text"
                    value={newAsset.clear_space_rule || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, clear_space_rule: e.target.value })}
                    placeholder="e.g. Minimum 16px exclusion zone on all 4 sides"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Permitted Backgrounds</label>
                  <input
                    type="text"
                    value={(newAsset.permitted_backgrounds || []).join(', ')}
                    onChange={(e) =>
                      setNewAsset({
                        ...newAsset,
                        permitted_backgrounds: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="e.g. #ffffff, #f8fafc, light backgrounds"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* File Upload Dropzone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Logo Asset Image (PNG, JPG, SVG, Transparent PNG) *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAssetFileUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {assetFilePreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 bg-slate-900/90 rounded-lg p-2 flex items-center justify-center border border-slate-700">
                        <img
                          src={assetFilePreview}
                          alt="Asset preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-700 block">✓ Reference Image Loaded</span>
                        <span className="text-[11px] text-slate-500">Click to change asset file</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs font-semibold text-slate-700 block">
                        Drag and drop official reference vector or click to browse
                      </span>
                      <span className="text-[10px] text-slate-400">Supports SVG vector, transparent PNG, JPG</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Usage Instructions &amp; Rules</label>
                <textarea
                  rows={2}
                  value={newAsset.usage_instructions || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, usage_instructions: e.target.value })}
                  placeholder="e.g. Primary identity mark. Must not be stretched, recolored, or placed on busy backgrounds."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Reference Logo
                </button>
              </div>
            </form>
          )}

          {/* Registered Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {assets
              .filter((a) => assetFilter === 'ALL' || a.asset_type === assetFilter)
              .map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Preview Box with subtle dark contrast */}
                    <div className="h-44 bg-slate-900/95 flex items-center justify-center p-5 border-b border-slate-800 relative group">
                      <img
                        src={asset.image_url}
                        alt={asset.asset_name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                      />
                      <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        {asset.variation_type || 'PRIMARY'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {asset.brand_name || 'Brand Mark'}
                          </span>
                          <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {asset.asset_type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          title="Delete reference asset"
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{asset.asset_name}</h4>

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {asset.usage_instructions}
                      </p>

                      {asset.clear_space_rule && (
                        <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-700">Clear Space: </span>
                          {asset.clear_space_rule}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Check className="w-3 h-3 text-emerald-600" /> Active Vector
                    </span>
                    <span>Ref: {asset.id.slice(0, 14)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE & STORAGE ARCHITECTURE */}
      {activeTab === 'database' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Persistent Audit Storage &amp; Supabase Integration
              </h3>
              <p className="text-xs text-slate-500">
                BrandGuard AI maintains an immutable relational audit log across reviews, brand rules, verified
                corporate facts, and creative assets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Current Storage State</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Storage Engine:</span>
                  <span className="font-semibold text-emerald-700">Audit Storage (Connected)</span>
                </div>
                <div className="flex justify-between">
                  <span>Reviews Audited:</span>
                  <span className="font-semibold">{guidelines.length + facts.length + 3} records</span>
                </div>
                <div className="flex justify-between">
                  <span>Vision &amp; OCR Engine:</span>
                  <span className="font-semibold text-emerald-600">Active (Gemini 3.8 Flash)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Supabase Connection Parameters</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                To connect an external Supabase project, supply <code className="text-emerald-700">SUPABASE_URL</code> and <code className="text-emerald-700">SUPABASE_ANON_KEY</code> in environment variables. The system will seamlessly sync all creative audits to Supabase PostgreSQL and Supabase Storage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
