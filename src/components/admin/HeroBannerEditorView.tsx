import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Tag, 
  Image as ImageIcon, 
  Check, 
  Layers, 
  Sliders,
  ChevronRight,
  ExternalLink,
  Type,
  Layout,
  Play
} from 'lucide-react';
import { ProductCategory, HeroBannerSlide } from '../../types';
import { DEFAULT_HERO_SLIDES } from '../HeroSection';

interface HeroBannerEditorViewProps {
  slides: HeroBannerSlide[];
  onSaveSlides: (slides: HeroBannerSlide[]) => void;
  onExploreCatalog?: () => void;
}

const PRESET_BANNER_IMAGES = [
  {
    name: 'Artisan Loha Badhano & Red Pola (Storefront Reference)',
    url: '/src/assets/images/loha_badhano_banner_1789477986635.jpg',
    category: 'loha-badhano'
  },
  {
    name: 'Bengali Bridal Shankha & Pola Heritage',
    url: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg',
    category: 'bridal-combos'
  },
  {
    name: '22K Gold Badhano Conch Shell',
    url: '/src/assets/images/sakha_pola_banner_1789477939234.jpg',
    category: 'gold-badhano'
  },
  {
    name: 'Payday Super Sale Model Look',
    url: '/src/assets/images/payday_hero_model_1788375869668.jpg',
    category: 'all'
  },
  {
    name: 'Royal Heritage Kundan & Polki Set',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    category: 'fine-collections'
  },
  {
    name: 'Regal Gold Filigree Choker & Jhumkas',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    category: 'necklaces'
  },
  {
    name: 'Solitaire Diamond Glow Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    category: 'rings'
  },
  {
    name: 'Handcrafted Pola & Gold Bangle Stack',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80',
    category: 'pola'
  }
];

const CATEGORY_OPTIONS: { label: string; value: ProductCategory }[] = [
  { label: 'All Collections', value: 'all' },
  { label: 'Loha Badhano (Bengali Iron Bangle)', value: 'loha-badhano' },
  { label: '22K Gold Badhano', value: 'gold-badhano' },
  { label: 'Bridal Combos & Sets', value: 'bridal-combos' },
  { label: 'Bengali Shankha', value: 'shakha' },
  { label: 'Handcrafted Pola', value: 'pola' },
  { label: 'Necklaces & Chains', value: 'necklaces' },
  { label: 'Earrings & Studs', value: 'earrings' },
  { label: 'Bracelets & Bangles', value: 'bracelets' },
  { label: 'Rings & Solitaires', value: 'rings' },
  { label: 'Fine Collections / Chokers', value: 'fine-collections' }
];

export const HeroBannerEditorView: React.FC<HeroBannerEditorViewProps> = ({
  slides: initialSlides,
  onSaveSlides
}) => {
  const [slides, setSlides] = useState<HeroBannerSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_HERO_SLIDES
  );
  const [selectedSlideId, setSelectedSlideId] = useState<string>(
    slides[0]?.id || 'slide-loha-badhano'
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  const selectedSlide = slides.find(s => s.id === selectedSlideId) || slides[0];

  const handleUpdateSlide = (id: string, updates: Partial<HeroBannerSlide>) => {
    setSlides(prev =>
      prev.map(slide => (slide.id === id ? { ...slide, ...updates } : slide))
    );
    setHasUnsavedChanges(true);
  };

  const handleAddSlide = () => {
    const newId = `slide-custom-${Date.now()}`;
    const newSlide: HeroBannerSlide = {
      id: newId,
      title: 'Artisan Loha Badhano',
      subtitle: 'Pure iron core bound in 22K hallmarked gold filigree with matching handcrafted Pola',
      badge: 'Auspicious Protection',
      buttonText: 'SHOP LOHA BADHANO',
      image: '/src/assets/images/loha_badhano_banner_1789477986635.jpg',
      targetCategory: 'loha-badhano',
      type: 'loha-badhano',
      active: true,
      note: 'Pure 22K Hallmarked Filigree'
    };
    const updated = [newSlide, ...slides];
    setSlides(updated);
    setSelectedSlideId(newId);
    setHasUnsavedChanges(true);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero banner slide in rotation.');
      return;
    }
    const updated = slides.filter(s => s.id !== id);
    setSlides(updated);
    if (selectedSlideId === id) {
      setSelectedSlideId(updated[0]?.id || '');
    }
    setHasUnsavedChanges(true);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);
    setSlides(newSlides);
    setHasUnsavedChanges(true);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset hero banners to the default Atelier collection? Any custom changes will be replaced.')) {
      setSlides(DEFAULT_HERO_SLIDES);
      setSelectedSlideId(DEFAULT_HERO_SLIDES[0].id);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveAll = () => {
    onSaveSlides(slides);
    setHasUnsavedChanges(false);
    setSaveSuccessMsg('Hero banners updated successfully! Storefront carousel is now in sync.');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-pink-50 text-[#E61D72] rounded-lg">
              <Layout className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Hero Banner &amp; Slider Merchandising
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-[#E61D72]">
              {slides.filter(s => s.active !== false).length} Active Banners
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl">
            Edit hero banner images, headline titles, auspicious badges, and CTA button destinations directly for the homepage luxury slider.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddSlide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Slide</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Reset to original storefront banners"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#E61D72] hover:bg-[#c7135e] text-white animate-pulse'
                : 'bg-gray-900 hover:bg-black text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Save Changes *' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs md:text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Interactive Live Storefront Preview of Hero Banner */}
      <div className="bg-[#1A1816] rounded-xl shadow-lg border border-gray-800 overflow-hidden">
        <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#ff80a5]" />
            <span className="font-semibold tracking-wide uppercase text-white/90">
              Live Storefront Banner Preview
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">
              Slide {activePreviewIndex + 1} of {slides.length}: &ldquo;{slides[activePreviewIndex]?.title}&rdquo;
            </span>
          </div>
          <div className="flex items-center gap-1">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActivePreviewIndex(idx);
                  setSelectedSlideId(s.id);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  idx === activePreviewIndex
                    ? 'bg-[#E61D72] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                #{idx + 1} {s.title.slice(0, 14)}...
              </button>
            ))}
          </div>
        </div>

        {/* Banner Mock Canvas */}
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden select-none">
          {slides[activePreviewIndex] && (
            <>
              {/* Background Image */}
              <img
                src={slides[activePreviewIndex].image}
                alt={slides[activePreviewIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/90 via-[#24030d]/50 to-transparent pointer-events-none" />

              {/* Slide Content Box */}
              <div className="absolute inset-0 max-w-5xl mx-auto px-6 sm:px-12 flex flex-col justify-center items-start text-left z-10 pointer-events-none">
                {slides[activePreviewIndex].badge && (
                  <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#ffd700]/25 border border-[#ffd700]/40 text-[#ffe57f] text-[11px] font-bold uppercase tracking-wider drop-shadow-xs">
                    {slides[activePreviewIndex].badge}
                  </span>
                )}

                <h2
                  className="text-white font-serif font-normal text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {slides[activePreviewIndex].title}
                </h2>

                {slides[activePreviewIndex].subtitle && (
                  <p className="text-white/95 font-light text-xs sm:text-sm md:text-base tracking-wide mt-2 sm:mt-3 drop-shadow-md max-w-xl">
                    {slides[activePreviewIndex].subtitle}
                  </p>
                )}

                <div className="mt-4 sm:mt-6">
                  <span className="inline-block px-6 sm:px-8 py-2 bg-white text-[#E61D72] text-xs font-bold uppercase tracking-wider rounded-xs shadow-lg">
                    {slides[activePreviewIndex].buttonText || 'SHOP NOW'}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4 z-20">
                {slides[activePreviewIndex].active === false ? (
                  <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-semibold">
                    Draft (Hidden from Storefront)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-semibold">
                    ✓ Live on Homepage
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Master Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Slides with Ordering & Quick Actions */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Slide Carousel ({slides.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="text-xs text-[#E61D72] hover:text-[#b81254] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100 max-h-[620px] overflow-y-auto">
            {slides.map((slide, index) => {
              const isSelected = slide.id === selectedSlideId;

              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    setSelectedSlideId(slide.id);
                    setActivePreviewIndex(index);
                  }}
                  className={`p-3.5 flex items-center gap-3 transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-rose-50/60 border-l-4 border-[#E61D72]'
                      : 'hover:bg-gray-50/80'
                  }`}
                >
                  {/* Position number */}
                  <div className="w-5 text-center text-xs font-bold text-gray-400 group-hover:text-gray-700">
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-14 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                    {slide.active === false && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[9px] text-white font-bold">
                        OFF
                      </div>
                    )}
                  </div>

                  {/* Title & Badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {slide.title}
                      </p>
                      {slide.active === false && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-gray-200 text-gray-600 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {slide.subtitle}
                    </p>
                    {slide.badge && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.2 bg-pink-100 text-[#E61D72] rounded font-medium">
                        {slide.badge}
                      </span>
                    )}
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(index, 'up');
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-20 cursor-pointer"
                      title="Move slide earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(index, 'down');
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-20 cursor-pointer"
                      title="Move slide later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(slide.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Slide Editor Form */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-xs border border-gray-200 p-5 md:p-6 space-y-6">
          {selectedSlide ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#E61D72]" />
                    <span>Edit Banner Details</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Modifying slide: <span className="font-semibold text-gray-800">{selectedSlide.title}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedSlide.active !== false}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, { active: e.target.checked })
                      }
                      className="w-4 h-4 text-[#E61D72] rounded focus:ring-[#E61D72]"
                    />
                    <span>Active in Slider</span>
                  </label>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Banner Headline / Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-gray-400" />
                    <span>Banner Title / Headline *</span>
                  </label>
                  <input
                    type="text"
                    value={selectedSlide.title}
                    onChange={(e) =>
                      handleUpdateSlide(selectedSlide.id, { title: e.target.value })
                    }
                    placeholder="e.g. Artisan Loha Badhano"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Rendered in Playfair Display serif display font on top of the slide.
                  </p>
                </div>

                {/* Subtitle / Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedSlide.subtitle}
                    onChange={(e) =>
                      handleUpdateSlide(selectedSlide.id, { subtitle: e.target.value })
                    }
                    placeholder="e.g. Pure iron core bound in 22K hallmarked gold filigree with matching handcrafted Pola"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none"
                  />
                </div>

                {/* Badge Tag and Button Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-gray-400" />
                      <span>Auspicious Eyebrow Badge</span>
                    </label>
                    <input
                      type="text"
                      value={selectedSlide.badge || ''}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, { badge: e.target.value })
                      }
                      placeholder="e.g. Auspicious Protection, SALE, Royal Bengali Heritage"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Button Action Text
                    </label>
                    <input
                      type="text"
                      value={selectedSlide.buttonText || 'SHOP NOW'}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, { buttonText: e.target.value })
                      }
                      placeholder="e.g. SHOP LOHA BADHANO"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none"
                    />
                  </div>
                </div>

                {/* Target Category and Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Target Catalog Category (OnClick)
                    </label>
                    <select
                      value={selectedSlide.targetCategory || 'all'}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, {
                          targetCategory: e.target.value as ProductCategory
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none bg-white"
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Footnote / Certification Tag
                    </label>
                    <input
                      type="text"
                      value={selectedSlide.note || ''}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, { note: e.target.value })
                      }
                      placeholder="e.g. *100% BIS Hallmarked Certified"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none"
                    />
                  </div>
                </div>

                {/* Banner Image URL & Image Picker */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span>Banner Background Image *</span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal">
                      High resolution widescreen banner (1200x540 recommended)
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedSlide.image}
                      onChange={(e) =>
                        handleUpdateSlide(selectedSlide.id, { image: e.target.value })
                      }
                      placeholder="Enter Image URL or select from presets below"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E61D72] focus:border-[#E61D72] outline-none font-mono text-xs"
                    />
                  </div>

                  {/* Curated Preset Banner Images for quick one-click selection */}
                  <div className="mt-3">
                    <p className="text-[11px] font-bold text-gray-600 mb-2">
                      Choose from Bengali Fine Jewellery Assets &amp; Banners:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_BANNER_IMAGES.map((preset, idx) => {
                        const isCurrent = selectedSlide.image === preset.url;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              handleUpdateSlide(selectedSlide.id, {
                                image: preset.url,
                                targetCategory: preset.category as ProductCategory
                              })
                            }
                            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'border-[#E61D72] bg-pink-50/50 ring-2 ring-[#E61D72]/30'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="h-16 w-full rounded bg-gray-100 overflow-hidden mb-1 relative">
                              <img
                                src={preset.url}
                                alt={preset.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {isCurrent && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-[#E61D72] text-white rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] font-semibold text-gray-800 line-clamp-1">
                              {preset.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Reminder */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {hasUnsavedChanges
                    ? '⚠️ You have unsaved changes. Click Save Changes above.'
                    : '✓ All banner changes are up to date.'}
                </span>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-[#E61D72] hover:bg-[#c7135e] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400">
              Select a banner slide from the left list to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
