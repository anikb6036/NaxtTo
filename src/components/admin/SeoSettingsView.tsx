import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Share2, 
  Twitter, 
  Code2, 
  Check, 
  RefreshCw, 
  Copy, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon, 
  Link2, 
  ShieldCheck, 
  Sliders, 
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { SeoSettings, DEFAULT_SEO_SETTINGS } from '../../types';
import { 
  SEO_PRESETS, 
  applyDynamicSeo, 
  getLiveHeadTags, 
  saveCachedSeoSettings, 
  SeoPreset 
} from '../../utils/seoManager';
import { apiClient } from '../../services/api';

interface SeoSettingsViewProps {
  initialSettings?: SeoSettings;
  onSaveSettings?: (settings: SeoSettings) => Promise<void> | void;
}

export const SeoSettingsView: React.FC<SeoSettingsViewProps> = ({
  initialSettings,
  onSaveSettings
}) => {
  const [settings, setSettings] = useState<SeoSettings>(() => {
    return initialSettings || DEFAULT_SEO_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<'core' | 'og' | 'twitter' | 'schema' | 'inspector'>('core');
  const [previewPlatform, setPreviewPlatform] = useState<'google' | 'social' | 'twitter'>('google');
  const [googleDevice, setGoogleDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [liveTags, setLiveTags] = useState<Record<string, string>>({});
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bengali-bridal-sakha-pola');

  // Available image assets in the atelier
  const availableImageAssets = [
    { label: 'Sakha Pola Stack Detail', url: '/src/assets/images/sakha_pola_stack_1790249812700.jpg' },
    { label: 'Bengali Bridal Wrist Heirloom', url: '/src/assets/images/bengali_bridal_wrist_1790249886691.jpg' },
    { label: '22K Gold Badhano Pola', url: '/src/assets/images/gold_badhano_pola_1790249832633.jpg' },
    { label: 'Bridal Bangles & Conch Set', url: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg' },
    { label: 'Minimalist Gold Diamond Rings', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Refresh live DOM head tags inspector
  const refreshLiveTags = () => {
    const tags = getLiveHeadTags();
    setLiveTags(tags);
  };

  useEffect(() => {
    refreshLiveTags();
  }, [settings]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleFieldChange = (key: keyof SeoSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Quick preset apply
  const applyPreset = (preset: SeoPreset) => {
    setSelectedPresetId(preset.id);
    const updated: SeoSettings = {
      ...settings,
      ...preset.settings,
      updatedAt: new Date().toISOString()
    };
    setSettings(updated);
    applyDynamicSeo(updated);
    saveCachedSeoSettings(updated);
    showNotification(`Applied preset: ${preset.name}`);
  };

  // Immediate Save & Dynamic Head Injection
  const handleSaveAndApply = async () => {
    setIsSaving(true);
    try {
      const finalSettings: SeoSettings = {
        ...settings,
        updatedAt: new Date().toISOString()
      };

      // 1. Immediately inject and update the live browser <head> DOM elements
      applyDynamicSeo(finalSettings);

      // 2. Persist to localStorage
      saveCachedSeoSettings(finalSettings);

      // 3. Persist to backend server API
      try {
        await apiClient.updateSeoSettings(finalSettings);
      } catch (e) {
        console.warn('API updateSeoSettings notice:', e);
      }

      // 4. Invoke external prop handler (for Firestore / App state)
      if (onSaveSettings) {
        await onSaveSettings(finalSettings);
      }

      refreshLiveTags();
      showNotification('SEO settings applied to live document <head> and saved successfully!');
    } catch (err: any) {
      console.error('Failed to save SEO settings:', err);
      showNotification('Failed to save SEO settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all SEO and OpenGraph metadata to default Atelier configuration?')) {
      setSettings(DEFAULT_SEO_SETTINGS);
      applyDynamicSeo(DEFAULT_SEO_SETTINGS);
      saveCachedSeoSettings(DEFAULT_SEO_SETTINGS);
      try {
        await apiClient.resetSeoSettings();
      } catch {}
      if (onSaveSettings) {
        await onSaveSettings(DEFAULT_SEO_SETTINGS);
      }
      refreshLiveTags();
      showNotification('SEO settings restored to Atelier defaults.');
    }
  };

  // Copy full HTML meta tags snippet
  const handleCopyHtmlSnippet = () => {
    const canonical = settings.canonicalUrl || 'https://naxtto.shop/';
    const snippet = `<!-- Primary Meta Tags -->
<title>${settings.siteTitle}</title>
<meta name="title" content="${settings.siteTitle}" />
<meta name="description" content="${settings.metaDescription}" />
<meta name="keywords" content="${settings.metaKeywords}" />
<meta name="author" content="${settings.author}" />
<meta name="robots" content="${settings.robots}" />
<link rel="canonical" href="${canonical}" />

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="${settings.ogType || 'website'}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${settings.ogTitle || settings.siteTitle}" />
<meta property="og:description" content="${settings.ogDescription || settings.metaDescription}" />
<meta property="og:image" content="${settings.ogImage}" />
<meta property="og:image:alt" content="${settings.ogImageAlt || settings.siteTitle}" />
<meta property="og:site_name" content="${settings.ogSiteName}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="${settings.twitterCard}" />
<meta name="twitter:url" content="${canonical}" />
<meta name="twitter:title" content="${settings.twitterTitle || settings.ogTitle || settings.siteTitle}" />
<meta name="twitter:description" content="${settings.twitterDescription || settings.ogDescription || settings.metaDescription}" />
<meta name="twitter:image" content="${settings.twitterImage || settings.ogImage}" />
<meta name="twitter:site" content="${settings.twitterSite}" />
<meta name="twitter:creator" content="${settings.twitterCreator}" />`;

    navigator.clipboard.writeText(snippet);
    showNotification('HTML meta tags snippet copied to clipboard!');
  };

  // Copy structured JSON-LD
  const handleCopyJsonLd = () => {
    const canonical = settings.canonicalUrl || 'https://naxtto.shop/';
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${canonical}#website`,
          "url": canonical,
          "name": settings.ogSiteName,
          "description": settings.metaDescription
        },
        {
          "@type": settings.structuredDataType,
          "@id": `${canonical}#organization`,
          "name": settings.businessName,
          "url": canonical,
          "image": settings.ogImage,
          "description": settings.metaDescription,
          "priceRange": settings.priceRange,
          "currenciesAccepted": settings.currencyAccepted,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": settings.businessAddress
          }
        }
      ]
    };
    navigator.clipboard.writeText(JSON.stringify(jsonLd, null, 2));
    showNotification('Schema.org JSON-LD copied to clipboard!');
  };

  // Title length analysis (30-60 optimal)
  const titleLength = settings.siteTitle.length;
  const isTitleOptimal = titleLength >= 30 && titleLength <= 60;
  const isTitleTooLong = titleLength > 60;

  // Description length analysis (120-160 optimal)
  const descLength = settings.metaDescription.length;
  const isDescOptimal = descLength >= 120 && descLength <= 160;
  const isDescTooLong = descLength > 160;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1322] via-[#141d33] to-[#0d1322] p-6 rounded-2xl border border-slate-800 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">Dynamic SEO & Social Metadata Studio</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Dynamic DOM Active
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dynamically configure search engine meta tags, OpenGraph social cards, Twitter previews, and canonical URLs directly from this UI. Changes are injected straight into the document <code className="text-indigo-300 font-mono text-[11px]">&lt;head&gt;</code> without modifying <code className="text-indigo-300 font-mono text-[11px]">index.html</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyHtmlSnippet}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy HTML</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndApply}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Applying to Live Head...' : 'Apply & Save to Head'}</span>
            </button>
          </div>
        </div>

        {/* Quick System Diagnostics */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Head Injection:</span>
            <span className="text-emerald-400 font-mono">Realtime Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">Current Canonical:</span>
            <span className="text-indigo-300 font-mono truncate max-w-xs">{settings.canonicalUrl || 'Auto (Origin)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">Robots:</span>
            <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs">{settings.robots.split(',')[0]}</span>
          </div>
          {settings.updatedAt && (
            <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
              <span>Last Synchronized: {new Date(settings.updatedAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Pre-Engineered SEO & Social Profiles</h3>
          </div>
          <span className="text-[11px] text-slate-500">Click to instantly populate and test tailored metadata</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SEO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {preset.badge}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Split: Settings Form vs Live Preview & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Configuration Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Navigation Pill Strip */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('core')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'core'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Snippet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('og')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'og'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Open Graph & Social</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('twitter')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'twitter'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter / X Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'schema'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON-LD Schema</span>
            </button>

            <button
              type="button"
              onClick={() => {
                refreshLiveTags();
                setActiveTab('inspector');
              }}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inspector'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Head Tags</span>
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            {/* TAB 1: CORE SEARCH METADATA */}
            {activeTab === 'core' && (
              <div className="space-y-4">
                {/* Site Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Page Title (&lt;title&gt; and og:title)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[11px] font-mono font-semibold ${
                      isTitleOptimal ? 'text-emerald-600' : isTitleTooLong ? 'text-rose-500' : 'text-amber-600'
                    }`}>
                      {titleLength}/60 chars ({isTitleOptimal ? 'Optimal' : isTitleTooLong ? 'Too Long' : 'Brief'})
                    </span>
                  </div>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                    placeholder="e.g. NaxtTo Fine Jewellery | Bengali Sakha Pola & Bridal Heirlooms"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isTitleOptimal ? 'bg-emerald-500' : isTitleTooLong ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Recommended length: 30 to 60 characters for complete display in Google search results without truncation.
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Meta Description (&lt;meta name="description"&gt;)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[11px] font-mono font-semibold ${
                      isDescOptimal ? 'text-emerald-600' : isDescTooLong ? 'text-rose-500' : 'text-amber-600'
                    }`}>
                      {descLength}/160 chars ({isDescOptimal ? 'Optimal' : isDescTooLong ? 'Too Long' : 'Brief'})
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={settings.metaDescription}
                    onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                    placeholder="1–2 sentence summary with actionable keywords and clear brand value proposition..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  />
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isDescOptimal ? 'bg-emerald-500' : isDescTooLong ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Keep between 120 and 160 characters so Google and search engines display the full preview snippet.
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Meta Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={settings.metaKeywords}
                    onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
                    placeholder="Sakha Pola, Shankha Pola, gold badhano, Bengali bridal bangles..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {settings.metaKeywords.split(',').filter(Boolean).slice(0, 6).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Canonical URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Canonical URL (&lt;link rel="canonical"&gt;)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('canonicalUrl', window.location.origin + '/')}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      Use Current Origin
                    </button>
                  </div>
                  <input
                    type="url"
                    value={settings.canonicalUrl}
                    onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                    placeholder="https://naxtto.shop/"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium font-mono text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-500">
                    Defines the authoritative URL to avoid duplicate content penalties across subdomains or trailing slashes.
                  </p>
                </div>

                {/* Robots & Author Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Robots Directive
                    </label>
                    <select
                      value={settings.robots}
                      onChange={(e) => handleFieldChange('robots', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
                        Index, Follow (Recommended / Standard)
                      </option>
                      <option value="noindex, nofollow">
                        NoIndex, NoFollow (Private / Staging)
                      </option>
                      <option value="index, nofollow">
                        Index, NoFollow
                      </option>
                      <option value="noindex, follow">
                        NoIndex, Follow
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Author Attribution
                    </label>
                    <input
                      type="text"
                      value={settings.author}
                      onChange={(e) => handleFieldChange('author', e.target.value)}
                      placeholder="e.g. Sakha Pola Atelier Bowbazar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OPEN GRAPH & SOCIAL CARDS */}
            {activeTab === 'og' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Facebook, WhatsApp &amp; LinkedIn OpenGraph</h4>
                    <p className="text-[11px] text-slate-500">Configures visual cards when sharing links on social platforms</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('ogTitle', settings.siteTitle);
                      handleFieldChange('ogDescription', settings.metaDescription);
                      showNotification('Synced OpenGraph title and description from Core Search metadata');
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Sync from Core Metadata
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    OG Title (og:title)
                  </label>
                  <input
                    type="text"
                    value={settings.ogTitle}
                    onChange={(e) => handleFieldChange('ogTitle', e.target.value)}
                    placeholder="e.g. NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    OG Description (og:description)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.ogDescription}
                    onChange={(e) => handleFieldChange('ogDescription', e.target.value)}
                    placeholder="Social share summary..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* OG Image Selection & Quick Assets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Social Share Image URL (og:image)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Recommended: 1200 x 630 px</span>
                  </div>

                  <input
                    type="text"
                    value={settings.ogImage}
                    onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                    placeholder="https://... or /src/assets/images/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium font-mono text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />

                  {/* Quick Select from Atelier Assets */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Quick Pick from Atelier Assets:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {availableImageAssets.map((asset, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            handleFieldChange('ogImage', asset.url);
                            handleFieldChange('twitterImage', asset.url);
                          }}
                          className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all ${
                            settings.ogImage === asset.url
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={asset.url}
                            alt={asset.label}
                            className="w-full h-12 rounded object-cover mb-1"
                          />
                          <span className="text-[9px] font-medium text-slate-700 line-clamp-1 block">
                            {asset.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Site Name (og:site_name)
                    </label>
                    <input
                      type="text"
                      value={settings.ogSiteName}
                      onChange={(e) => handleFieldChange('ogSiteName', e.target.value)}
                      placeholder="NaxtTo Fine Jewellery"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Image Alt Text (og:image:alt)
                    </label>
                    <input
                      type="text"
                      value={settings.ogImageAlt}
                      onChange={(e) => handleFieldChange('ogImageAlt', e.target.value)}
                      placeholder="NaxtTo Fine Jewellery Heirloom Collection"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TWITTER / X CARD */}
            {activeTab === 'twitter' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Twitter / X Rich Link Cards</h4>
                    <p className="text-[11px] text-slate-500">Configure cards when shared in tweets, DMs, and threads</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('twitterTitle', settings.ogTitle || settings.siteTitle);
                      handleFieldChange('twitterDescription', settings.ogDescription || settings.metaDescription);
                      handleFieldChange('twitterImage', settings.ogImage);
                      showNotification('Mirrored all OpenGraph settings to Twitter Card');
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Mirror from OpenGraph
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Card Format (twitter:card)
                    </label>
                    <select
                      value={settings.twitterCard}
                      onChange={(e) => handleFieldChange('twitterCard', e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="summary_large_image">Large Visual Card (summary_large_image)</option>
                      <option value="summary">Compact Thumbnail Card (summary)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Twitter Handle (twitter:site)
                    </label>
                    <input
                      type="text"
                      value={settings.twitterSite}
                      onChange={(e) => handleFieldChange('twitterSite', e.target.value)}
                      placeholder="@naxtto"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Twitter Title (twitter:title)
                  </label>
                  <input
                    type="text"
                    value={settings.twitterTitle}
                    onChange={(e) => handleFieldChange('twitterTitle', e.target.value)}
                    placeholder="e.g. NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Twitter Description (twitter:description)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.twitterDescription}
                    onChange={(e) => handleFieldChange('twitterDescription', e.target.value)}
                    placeholder="Summary for Twitter cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Twitter Image URL (twitter:image)
                  </label>
                  <input
                    type="text"
                    value={settings.twitterImage}
                    onChange={(e) => handleFieldChange('twitterImage', e.target.value)}
                    placeholder="Defaults to OG Image URL if left empty"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium font-mono text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SCHEMA.ORG JSON-LD */}
            {activeTab === 'schema' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Schema.org Structured Data (JSON-LD)</h4>
                    <p className="text-[11px] text-slate-500">Powers Google Knowledge Graph and Rich Snippets</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.structuredDataEnabled}
                        onChange={(e) => handleFieldChange('structuredDataEnabled', e.target.checked)}
                        className="mr-1.5 accent-indigo-600 rounded"
                      />
                      Enable In Head
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyJsonLd}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Schema Type (@type)
                    </label>
                    <select
                      value={settings.structuredDataType}
                      onChange={(e) => handleFieldChange('structuredDataType', e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="JewelryStore">JewelryStore (E-commerce & Local Atelier)</option>
                      <option value="Organization">Organization (Brand Headquarters)</option>
                      <option value="WebSite">WebSite (Online Catalog)</option>
                      <option value="Product">Product Showcase</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Business Legal Name
                    </label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => handleFieldChange('businessName', e.target.value)}
                      placeholder="NaxtTo Fine Jewellery Atelier"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Operating Address / Cities
                    </label>
                    <input
                      type="text"
                      value={settings.businessAddress}
                      onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                      placeholder="Kolkata & Milan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Currencies Accepted
                    </label>
                    <input
                      type="text"
                      value={settings.currencyAccepted}
                      onChange={(e) => handleFieldChange('currencyAccepted', e.target.value)}
                      placeholder="INR, USD, EUR, GBP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 block">
                      Price Range
                    </label>
                    <input
                      type="text"
                      value={settings.priceRange}
                      onChange={(e) => handleFieldChange('priceRange', e.target.value)}
                      placeholder="₹₹₹ - Luxury"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Live Code Preview */}
                <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                  <pre>{JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                      {
                        "@type": "WebSite",
                        "@id": `${settings.canonicalUrl || 'https://naxtto.shop/'}#website`,
                        "url": settings.canonicalUrl || 'https://naxtto.shop/',
                        "name": settings.ogSiteName,
                        "description": settings.metaDescription
                      },
                      {
                        "@type": settings.structuredDataType,
                        "@id": `${settings.canonicalUrl || 'https://naxtto.shop/'}#organization`,
                        "name": settings.businessName,
                        "url": settings.canonicalUrl || 'https://naxtto.shop/',
                        "image": settings.ogImage,
                        "description": settings.metaDescription,
                        "priceRange": settings.priceRange,
                        "currenciesAccepted": settings.currencyAccepted,
                        "address": {
                          "@type": "PostalAddress",
                          "addressLocality": settings.businessAddress
                        }
                      }
                    ]
                  }, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* TAB 5: LIVE HEAD TAGS INSPECTOR */}
            {activeTab === 'inspector' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Active Browser DOM &lt;head&gt; Readout</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">Live verified elements directly extracted from current tab document</p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshLiveTags}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Scan Head</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {Object.entries(liveTags).map(([tagKey, tagVal]) => (
                    <div key={tagKey} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-700">
                        <span>{tagKey}</span>
                        <span className="text-[10px] text-emerald-600 font-sans font-semibold">Active in DOM</span>
                      </div>
                      <p className="text-xs text-slate-800 font-mono break-all bg-white p-2 rounded border border-slate-200/60">
                        {tagVal || <span className="text-slate-400 italic">Empty or not defined</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Visual Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preview Format Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulated Search &amp; Social Card</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('google')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    previewPlatform === 'google' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('social')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    previewPlatform === 'social' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Facebook / WA
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('twitter')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    previewPlatform === 'twitter' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Twitter / X
                </button>
              </div>
            </div>

            {/* PREVIEW 1: GOOGLE SERP CARD */}
            {previewPlatform === 'google' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
                  <span>Google Snippet Preview</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGoogleDevice('desktop')}
                      className={`cursor-pointer ${googleDevice === 'desktop' ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}
                    >
                      Desktop
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setGoogleDevice('mobile')}
                      className={`cursor-pointer ${googleDevice === 'mobile' ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div className={`p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5 ${
                  googleDevice === 'mobile' ? 'max-w-xs mx-auto border-2 border-slate-300' : ''
                }`}>
                  {/* Google Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                      N
                    </div>
                    <div className="truncate">
                      <span className="text-[12px] font-medium text-[#202124] block leading-tight">{settings.ogSiteName || 'NaxtTo'}</span>
                      <span className="text-[11px] text-[#4d5156] font-mono truncate block">
                        {settings.canonicalUrl || 'https://naxtto.shop/'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base text-[#1a0dab] font-normal hover:underline cursor-pointer line-clamp-2 leading-snug">
                    {settings.siteTitle || 'NaxtTo Fine Jewellery | Bengali Sakha Pola & Bridal Heirlooms'}
                  </h3>

                  {/* Snippet Description */}
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {settings.metaDescription || 'Authentic Bengali Sakha Pola & bridal jewellery atelier featuring hand-carved pure conch Shankha, coral Pola, 22K gold badhano, and auspicious loha bangles.'}
                  </p>
                </div>
              </div>
            )}

            {/* PREVIEW 2: FACEBOOK / WHATSAPP / LINKEDIN OPEN GRAPH CARD */}
            {previewPlatform === 'social' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 block">OpenGraph Rich Card (Facebook, WhatsApp, LinkedIn)</span>
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white shadow-sm">
                  {/* 1.91:1 Aspect ratio Image */}
                  <div className="relative w-full aspect-[1.91/1] bg-slate-100 overflow-hidden">
                    <img
                      src={settings.ogImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'}
                      alt={settings.ogImageAlt || settings.ogTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Footer details */}
                  <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {settings.canonicalUrl ? new URL(settings.canonicalUrl).hostname.toUpperCase() : 'NAXTTO.SHOP'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight">
                      {settings.ogTitle || settings.siteTitle}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {settings.ogDescription || settings.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW 3: TWITTER / X CARD */}
            {previewPlatform === 'twitter' && (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-500 block">Twitter / X Large Summary Card</span>
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                  <div className="relative w-full aspect-[2/1] bg-slate-100 overflow-hidden">
                    <img
                      src={settings.twitterImage || settings.ogImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'}
                      alt={settings.twitterTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white font-mono">
                      {settings.twitterSite}
                    </div>
                  </div>
                  <div className="p-3 space-y-1 bg-white">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {settings.canonicalUrl ? new URL(settings.canonicalUrl).hostname : 'naxtto.shop'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {settings.twitterTitle || settings.ogTitle || settings.siteTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {settings.twitterDescription || settings.ogDescription || settings.metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Check & Validation Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Automated SEO Quality Checklist</span>
            </h4>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                <span className="text-slate-700">Title Tag Length</span>
                <span className={`font-bold ${isTitleOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {titleLength} chars ({isTitleOptimal ? 'Pass' : 'Review'})
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                <span className="text-slate-700">Meta Description Length</span>
                <span className={`font-bold ${isDescOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {descLength} chars ({isDescOptimal ? 'Pass' : 'Review'})
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                <span className="text-slate-700">OpenGraph Social Image</span>
                <span className={`font-bold ${settings.ogImage ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {settings.ogImage ? 'Configured' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                <span className="text-slate-700">Canonical Link Declared</span>
                <span className={`font-bold ${settings.canonicalUrl ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {settings.canonicalUrl ? 'Valid URL' : 'Auto'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                <span className="text-slate-700">Schema.org JSON-LD Injected</span>
                <span className={`font-bold ${settings.structuredDataEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {settings.structuredDataEnabled ? `${settings.structuredDataType} (Active)` : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
