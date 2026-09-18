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
  ExternalLink, 
  Tag, 
  Image as ImageIcon, 
  Check, 
  Layers, 
  Link, 
  Sliders,
  Flame,
  ShoppingBag,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ProductCategory, Product, WowDealItem } from '../../types';
import { DEFAULT_WOW_DEALS } from '../MyntraWowDeals';

interface WowDealsEditorViewProps {
  deals: WowDealItem[];
  onSaveDeals: (deals: WowDealItem[]) => void;
  products: Product[];
  currencySymbol: string;
  headline?: string;
  subheadline?: string;
  emoji?: string;
  onUpdateHeader?: (headline: string, subheadline: string, emoji: string) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Solitaire Diamond Ring',
    category: 'rings',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gold Choker & Pendant',
    category: 'necklaces',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Diamond Studs & Jhumkas',
    category: 'earrings',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tennis Bracelet & Bangles',
    category: 'bracelets',
    url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Royal Bridal Trousseau',
    category: 'bridal-combos',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '24K 999 Pure Gold Bullion',
    category: 'gold-badhano',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '22K Gold Badhano Shankha',
    category: 'shakha',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Handcrafted Coral Pola',
    category: 'pola',
    url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Loha Badhano Iron Bangle',
    category: 'loha-badhano',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
  }
];

const COLOR_PRESETS = [
  { name: 'Myntra Hot Pink', hex: '#ff3e6c' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Kolkata Gold', hex: '#d97706' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Sapphire Blue', hex: '#2563eb' }
];

export const WowDealsEditorView: React.FC<WowDealsEditorViewProps> = ({
  deals,
  onSaveDeals,
  products,
  currencySymbol,
  headline = 'WOW DEALS',
  subheadline = 'Big Brands, Even Bigger Savings',
  emoji = '🤩',
  onUpdateHeader
}) => {
  const [localDeals, setLocalDeals] = useState<WowDealItem[]>(
    deals && deals.length > 0 ? deals : DEFAULT_WOW_DEALS
  );
  const [activeDealId, setActiveDealId] = useState<string | null>(
    localDeals.length > 0 ? localDeals[0].id : null
  );
  const [headerTitle, setHeaderTitle] = useState(headline);
  const [headerSub, setHeaderSub] = useState(subheadline);
  const [headerEmoji, setHeaderEmoji] = useState(emoji);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCatalogSelector, setShowCatalogSelector] = useState<string | null>(null);

  const selectedDeal = localDeals.find(d => d.id === activeDealId) || localDeals[0];

  const handleUpdateDealField = (id: string, field: keyof WowDealItem, value: any) => {
    setLocalDeals(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleAddNewDeal = () => {
    const newId = `deal-${Date.now()}`;
    const newDeal: WowDealItem = {
      id: newId,
      category: 'fine-collections',
      title: 'New Festive Spotlight',
      brand: 'NAXTTO COUTURE',
      discount: 'UP TO 50% OFF',
      tagline: 'Limited Festival Edition',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'Starting ₹3,999',
      badgeColor: '#ff3e6c',
      active: true
    };
    const updated = [...localDeals, newDeal];
    setLocalDeals(updated);
    setActiveDealId(newId);
  };

  const handleDeleteDeal = (id: string) => {
    if (localDeals.length <= 1) {
      alert('You must retain at least one deal card in the showcase.');
      return;
    }
    const updated = localDeals.filter(d => d.id !== id);
    setLocalDeals(updated);
    if (activeDealId === id) {
      setActiveDealId(updated[0]?.id || null);
    }
  };

  const handleMoveDeal = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localDeals.length) return;
    const copy = [...localDeals];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setLocalDeals(copy);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset WOW Deals to factory defaults? All manual customizations will be restored to the initial 6 showcase cards.')) {
      setLocalDeals([...DEFAULT_WOW_DEALS]);
      setHeaderTitle('WOW DEALS');
      setHeaderSub('Big Brands, Even Bigger Savings');
      setHeaderEmoji('🤩');
      onSaveDeals([...DEFAULT_WOW_DEALS]);
      if (onUpdateHeader) onUpdateHeader('WOW DEALS', 'Big Brands, Even Bigger Savings', '🤩');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleSaveAll = () => {
    onSaveDeals(localDeals);
    if (onUpdateHeader) {
      onUpdateHeader(headerTitle, headerSub, headerEmoji);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleApplyProductToDeal = (dealId: string, prod: Product) => {
    setLocalDeals(prev => prev.map(item => {
      if (item.id === dealId) {
        return {
          ...item,
          title: prod.name,
          image: prod.images[0] || item.image,
          category: prod.category,
          priceNotice: `Starting ${currencySymbol}${prod.price.toLocaleString('en-IN')}`,
          tagline: prod.karatPurity || 'Hallmarked 22K Gold'
        };
      }
      return item;
    }));
    setShowCatalogSelector(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Governance Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Storefront WOW DEALS Merchandiser</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  {localDeals.filter(d => d.active !== false).length} Active Promos
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage promotional cards, discount pills, brand names, and destination links featured in the top storefront carousel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore original 6 deals"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewDeal}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deal Card</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              saveSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gradient-to-r from-[#ff3e6c] to-[#e02d5b] text-white hover:opacity-95'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Changes Published!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Publish to Storefront</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Interactive Storefront Simulation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Storefront Live Simulation Preview
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any deal card below to inspect and customize its attributes
          </span>
        </div>

        {/* The Live Rendered Section */}
        <div className="p-6 bg-[#fdfaf3] border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#ec4899] drop-shadow-xs font-sans">
                    {headerTitle}
                  </span>
                  <span className="text-2xl animate-bounce">{headerEmoji}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#282c3f] mt-1 flex items-center gap-1">
                  <span>{headerSub}</span>
                  <ChevronRight className="w-4 h-4 text-[#ff3e6c]" />
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff3e6c] bg-white px-4 py-2 rounded-full border border-[#ff3e6c]/30 shadow-xs">
                <span>View All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Cards Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {localDeals.map((deal, index) => {
                const isSelected = activeDealId === deal.id;
                return (
                  <div
                    key={deal.id}
                    onClick={() => setActiveDealId(deal.id)}
                    className={`relative group cursor-pointer bg-white rounded-lg overflow-hidden border transition-all duration-200 flex flex-col ${
                      isSelected 
                        ? 'ring-2 ring-[#ff3e6c] shadow-lg scale-102 border-[#ff3e6c]' 
                        : 'border-[#eaeaec] hover:border-slate-400'
                    } ${deal.active === false ? 'opacity-40 grayscale-50' : ''}`}
                  >
                    {/* Active slot indicator pill */}
                    <div className="absolute top-1 right-1 z-10 bg-slate-900/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </div>

                    <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div 
                        className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm tracking-wide"
                        style={{ backgroundColor: deal.badgeColor || '#ff3e6c' }}
                      >
                        {deal.discount}
                      </div>
                    </div>

                    <div className="p-2.5 flex flex-col flex-1 justify-between bg-white text-left">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase text-[#7e818c] tracking-wider truncate">
                          {deal.brand}
                        </div>
                        <div className="text-xs font-bold text-[#282c3f] truncate">
                          {deal.title}
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#03a685] truncate">
                          {deal.priceNotice}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="bg-[#ff3e6c] text-white text-[9px] font-bold py-0.5 text-center uppercase tracking-wider">
                        Active in Editor
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Configuration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Deal Cards Reordering & Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Showcase Card Order ({localDeals.length})</span>
              </span>
              <button
                type="button"
                onClick={handleAddNewDeal}
                className="text-[11px] font-bold text-[#ff3e6c] hover:text-[#e02d5b] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New Card</span>
              </button>
            </div>

            <div className="space-y-2">
              {localDeals.map((deal, idx) => {
                const isSelected = activeDealId === deal.id;
                return (
                  <div
                    key={deal.id}
                    onClick={() => setActiveDealId(deal.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/60 border-[#ff3e6c] shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                        <img 
                          src={deal.image} 
                          alt={deal.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-[#ff3e6c] truncate">
                          {deal.brand}
                        </p>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {deal.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {deal.discount} • {deal.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveDeal(idx, 'left')}
                        title="Move left/up"
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === localDeals.length - 1}
                        onClick={() => handleMoveDeal(idx, 'right')}
                        title="Move right/down"
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDeal(deal.id)}
                        title="Remove deal card"
                        className="p-1 rounded text-rose-500 hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Headline Settings */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Section Banner Titles</span>
            </span>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Main Headline Text
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#ff3e6c]"
                  />
                  <input
                    type="text"
                    value={headerEmoji}
                    onChange={(e) => setHeaderEmoji(e.target.value)}
                    title="Section Emoji"
                    className="w-12 text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-[#ff3e6c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subheadline / Tagline
                </label>
                <input
                  type="text"
                  value={headerSub}
                  onChange={(e) => setHeaderSub(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#ff3e6c]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Card Detail Editor (8 cols) */}
        <div className="lg:col-span-8">
          {selectedDeal ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-mono font-bold text-xs flex items-center justify-center">
                    #{localDeals.findIndex(d => d.id === selectedDeal.id) + 1}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Edit Deal Card: {selectedDeal.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Tailor the title, discount badge, image, and target category link for this card.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedDeal.active !== false}
                      onChange={(e) => handleUpdateDealField(selectedDeal.id, 'active', e.target.checked)}
                      className="rounded border-slate-300 text-[#ff3e6c] focus:ring-[#ff3e6c] w-4 h-4 cursor-pointer"
                    />
                    <span>Active on Store</span>
                  </label>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Brand Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand / Atelier Label
                  </label>
                  <input
                    type="text"
                    value={selectedDeal.brand}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'brand', e.target.value)}
                    placeholder="e.g. NAXTTO DIAMONDS, HERITAGE ATELIER"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase tracking-wider font-semibold focus:outline-none focus:border-[#ff3e6c]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Displayed in small caps above the title</span>
                </div>

                {/* Product Title */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Card Title / Jewellery Type
                  </label>
                  <input
                    type="text"
                    value={selectedDeal.title}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'title', e.target.value)}
                    placeholder="e.g. Solitaire Rings, Chokers & Pendants"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#ff3e6c]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Main headline shown on the card</span>
                </div>

                {/* Discount Badge Text */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Discount Badge Text
                  </label>
                  <input
                    type="text"
                    value={selectedDeal.discount}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'discount', e.target.value)}
                    placeholder="e.g. 40-60% OFF, MIN. 50% OFF, ZERO MAKING CHARGES"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-black focus:outline-none focus:border-[#ff3e6c]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Pill shown at top-left of the image</span>
                </div>

                {/* Badge Color Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Badge Color Tone
                  </label>
                  <div className="flex items-center gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleUpdateDealField(selectedDeal.id, 'badgeColor', color.hex)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                          (selectedDeal.badgeColor || '#ff3e6c') === color.hex ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {(selectedDeal.badgeColor || '#ff3e6c') === color.hex && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={selectedDeal.badgeColor || '#ff3e6c'}
                      onChange={(e) => handleUpdateDealField(selectedDeal.id, 'badgeColor', e.target.value)}
                      className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Price Notice / Highlight */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Price Notice / Perk Badge
                  </label>
                  <input
                    type="text"
                    value={selectedDeal.priceNotice}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'priceNotice', e.target.value)}
                    placeholder="e.g. Starting ₹4,990, Best Seller, VIP Making Charges Free"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-semibold focus:outline-none focus:border-[#ff3e6c]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Bottom green teaser text</span>
                </div>

                {/* Destination Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Category Filter
                  </label>
                  <select
                    value={selectedDeal.category}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'category', e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#ff3e6c] cursor-pointer"
                  >
                    <option value="rings">Rings (Solitaire &amp; Band)</option>
                    <option value="necklaces">Necklaces, Chokers &amp; Pendants</option>
                    <option value="earrings">Earrings, Studs &amp; Jhumkas</option>
                    <option value="bracelets">Bracelets &amp; Bangles</option>
                    <option value="bridal-combos">Grand Bridal Trousseau</option>
                    <option value="shakha">Shakha (Conch Shell)</option>
                    <option value="pola">Pola (Coral)</option>
                    <option value="gold-badhano">Gold Badhano / Bullion</option>
                    <option value="loha-badhano">Loha Badhano (Iron Bangle)</option>
                    <option value="fine-collections">Fine Collections</option>
                    <option value="all">All Catalog Items</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">Category applied when shopper taps this card</span>
                </div>
              </div>

              {/* Image Configuration & Preset Picker */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Card High-Res Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCatalogSelector(showCatalogSelector ? null : selectedDeal.id)}
                    className="text-xs text-[#ff3e6c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Copy from Master Catalog Piece</span>
                  </button>
                </div>

                {/* Catalog Piece Quick Select Dropdown */}
                {showCatalogSelector === selectedDeal.id && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-fadeIn">
                    <p className="text-[11px] font-bold text-amber-900">
                      Select a product from the master catalog to automatically populate this deal card:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {products.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyProductToDeal(selectedDeal.id, p)}
                          className="p-2 bg-white rounded-lg border border-amber-200 hover:border-[#ff3e6c] text-left flex items-center gap-2 cursor-pointer transition-all hover:shadow-xs"
                        >
                          <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className="w-8 h-8 rounded object-cover shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">{p.name}</p>
                            <p className="text-[10px] text-emerald-700 font-mono">{currencySymbol}{p.price.toLocaleString('en-IN')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="w-16 h-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img 
                      src={selectedDeal.image} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="url"
                    value={selectedDeal.image}
                    onChange={(e) => handleUpdateDealField(selectedDeal.id, 'image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#ff3e6c] h-10 my-auto"
                  />
                </div>

                {/* Preset Imagery Buttons */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Preset Fine Jewellery Images:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          handleUpdateDealField(selectedDeal.id, 'image', preset.url);
                          if (preset.category) {
                            handleUpdateDealField(selectedDeal.id, 'category', preset.category);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                          selectedDeal.image === preset.url
                            ? 'bg-[#ff3e6c] text-white border-[#ff3e6c]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteDeal(selectedDeal.id)}
                  className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Deal Card</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-5 py-2 bg-[#ff3e6c] hover:bg-[#e02d5b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply &amp; Save Deals</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Flame className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>No deal card selected. Click a deal card on the left to edit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
