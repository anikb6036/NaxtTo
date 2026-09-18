import React, { useState } from 'react';
import { 
  Award, 
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
  Sliders,
  ShoppingBag,
  ChevronRight,
  Star,
  Sparkles,
  Palette
} from 'lucide-react';
import { ProductCategory, Product, TopRatedItem } from '../../types';
import { DEFAULT_TOP_RATED_ITEMS } from '../TopRatedSection';

interface TopRatedEditorViewProps {
  items: TopRatedItem[];
  onSaveItems: (items: TopRatedItem[]) => void;
  products: Product[];
  currencySymbol: string;
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  onUpdateHeader?: (headline: string, subheadline: string, buttonText: string) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Solid Gold Chains & Pendants',
    category: 'necklaces',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Solitaire Studs & Drops',
    category: 'earrings',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tennis Bracelet & Bangles',
    category: 'bracelets',
    url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Royal Bridal Choker Set',
    category: 'fine-collections',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Solitaire Diamond Ring',
    category: 'rings',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Heritage Kundan Haar',
    category: 'bridal-combos',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: '24K Gold Bullion Coin',
    category: 'gold-badhano',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gold Pola & Shakha Bangle',
    category: 'shakha',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=600&q=80'
  }
];

const BADGE_COLOR_PRESETS = [
  { name: 'Forest Green (Classic)', hex: '#388e3c' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Flipkart/Myntra Blue', hex: '#2874f0' },
  { name: 'Coral Pink', hex: '#ff3e6c' },
  { name: 'Bengal Gold', hex: '#d97706' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Royal Purple', hex: '#7c3aed' }
];

const CATEGORY_OPTIONS: { label: string; value: ProductCategory }[] = [
  { label: 'Necklaces & Chains', value: 'necklaces' },
  { label: 'Earrings & Studs', value: 'earrings' },
  { label: 'Bracelets & Bangles', value: 'bracelets' },
  { label: 'Rings & Solitaires', value: 'rings' },
  { label: 'Fine Collections / Chokers', value: 'fine-collections' },
  { label: 'Bridal Combos & Sets', value: 'bridal-combos' },
  { label: 'Bengali Shakha', value: 'shakha' },
  { label: 'Handcrafted Pola', value: 'pola' },
  { label: 'Loha Badhano', value: 'loha-badhano' },
  { label: 'Gold Bullion & Coins', value: 'gold-badhano' },
  { label: 'All Catalog', value: 'all' }
];

export const TopRatedEditorView: React.FC<TopRatedEditorViewProps> = ({
  items: initialItems,
  onSaveItems,
  products,
  currencySymbol,
  headline = 'Top Rated in Fine Jewellery',
  subheadline = 'Certified 18K Hallmarked pieces trusted by 10,000+ patrons',
  buttonText = 'VIEW ALL',
  onUpdateHeader
}) => {
  const [items, setItems] = useState<TopRatedItem[]>(() => {
    return initialItems && initialItems.length > 0 ? initialItems : DEFAULT_TOP_RATED_ITEMS;
  });

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [headerTitle, setHeaderTitle] = useState(headline);
  const [headerSubtitle, setHeaderSubtitle] = useState(subheadline);
  const [headerBtnText, setHeaderBtnText] = useState(buttonText);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showProductPickerModal, setShowProductPickerModal] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const currentItem = items[selectedIdx] || items[0];

  const updateItem = (field: keyof TopRatedItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      if (!copy[selectedIdx]) return prev;
      copy[selectedIdx] = {
        ...copy[selectedIdx],
        [field]: value
      };
      return copy;
    });
    setHasUnsavedChanges(true);
  };

  const handleAddNewItem = () => {
    const newItem: TopRatedItem = {
      id: `top-rated-${Date.now()}`,
      title: 'Diamond Halo Pendant',
      subtitle: 'Exclusive 25% Off',
      price: 'From ₹8,990',
      category: 'necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      badge: 'Trending',
      badgeColor: '#388e3c',
      active: true
    };
    const updated = [...items, newItem];
    setItems(updated);
    setSelectedIdx(updated.length - 1);
    setHasUnsavedChanges(true);
  };

  const handleDeleteItem = (indexToDelete: number) => {
    if (items.length <= 1) {
      alert('You must have at least one card in the Top Rated section.');
      return;
    }
    const updated = items.filter((_, idx) => idx !== indexToDelete);
    setItems(updated);
    setSelectedIdx(Math.max(0, indexToDelete - 1));
    setHasUnsavedChanges(true);
  };

  const handleMoveItem = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setItems(copy);
    setSelectedIdx(targetIndex);
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    onSaveItems(items);
    if (onUpdateHeader) {
      onUpdateHeader(headerTitle, headerSubtitle, headerBtnText);
    }
    setHasUnsavedChanges(false);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset Top Rated showcase to original default products? Any custom edits will be replaced.')) {
      setItems(DEFAULT_TOP_RATED_ITEMS);
      setHeaderTitle('Top Rated in Fine Jewellery');
      setHeaderSubtitle('Certified 18K Hallmarked pieces trusted by 10,000+ patrons');
      setHeaderBtnText('VIEW ALL');
      setSelectedIdx(0);
      onSaveItems(DEFAULT_TOP_RATED_ITEMS);
      if (onUpdateHeader) {
        onUpdateHeader(
          'Top Rated in Fine Jewellery',
          'Certified 18K Hallmarked pieces trusted by 10,000+ patrons',
          'VIEW ALL'
        );
      }
      setHasUnsavedChanges(false);
    }
  };

  const handleApplyFromCatalog = (product: Product) => {
    if (!currentItem) return;
    updateItem('title', product.name);
    updateItem('subtitle', product.subtitle || 'Handcrafted Bestseller');
    updateItem('price', `From ${currencySymbol}${product.price.toLocaleString()}`);
    updateItem('category', product.category);
    updateItem('image', product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80');
    updateItem('badge', 'Bestseller');
    setShowProductPickerModal(false);
  };

  const filteredCatalog = products.filter(p => 
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Top Rated in Fine Jewellery Editor</h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                {items.length} Showcase Cards
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the certified 18K hallmarked bestseller showcase featured on your main store homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to factory default collection"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewItem}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              hasUnsavedChanges 
                ? 'bg-[#2874f0] hover:bg-[#1259c7] text-white shadow-blue-500/20 animate-pulse' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? 'Save Changes *' : 'Save Live Showcase'}</span>
          </button>
        </div>
      </div>

      {/* Live Storefront Interactive Preview (Exact replica of user screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Storefront Live Simulation Preview
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              (Click any card below to edit its properties)
            </span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Real-time Sync
          </span>
        </div>

        {/* Live Container Matching TopRatedSection.tsx exactly */}
        <div className="w-full bg-[#f1f2f4] p-3 sm:p-4 rounded-xl border border-slate-200">
          <div className="bg-white rounded-lg border border-[#e5e5ea] p-4 sm:p-5 shadow-xs">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#212121]">
                  {headerTitle}
                </h3>
                <p className="text-xs text-[#878787] hidden sm:block">
                  {headerSubtitle}
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-[#2874f0] text-white text-xs font-bold rounded-sm shadow-xs flex items-center gap-1 shrink-0">
                <span>{headerBtnText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Grid of 4 Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {items.map((col, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <div
                    key={col.id || idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`group border rounded-md p-3 sm:p-4 flex flex-col items-center text-center cursor-pointer transition-all relative ${
                      isSelected 
                        ? 'border-[#2874f0] ring-2 ring-[#2874f0]/30 shadow-md bg-white' 
                        : 'border-[#e8e8ed] hover:border-[#2874f0] bg-[#fafafa] hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-2 -right-2 bg-[#2874f0] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                        Editing #{idx + 1}
                      </span>
                    )}

                    {/* Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mb-3 rounded-md overflow-hidden bg-white relative flex items-center justify-center">
                      <img
                        src={col.image}
                        alt={col.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span 
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-white text-[9px] font-bold rounded-xs shadow-2xs"
                        style={{ backgroundColor: col.badgeColor || '#388e3c' }}
                      >
                        {col.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-semibold text-[#212121] group-hover:text-[#2874f0] transition-colors line-clamp-1">
                      {col.title}
                    </h4>

                    {/* Subtitle / Offer */}
                    <p className="text-[11px] sm:text-xs text-[#388e3c] font-bold mt-0.5">
                      {col.subtitle}
                    </p>

                    {/* Price */}
                    <p className="text-xs text-[#757575] mt-0.5">
                      {col.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Section: Header Settings + Card Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Card Selector & Section Header Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section Header Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Section Header Text</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => {
                  setHeaderTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="Top Rated in Fine Jewellery"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subheadline
              </label>
              <input
                type="text"
                value={headerSubtitle}
                onChange={(e) => {
                  setHeaderSubtitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="Certified 18K Hallmarked pieces trusted by 10,000+ patrons"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Button Text
              </label>
              <input
                type="text"
                value={headerBtnText}
                onChange={(e) => {
                  setHeaderBtnText(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="VIEW ALL"
              />
            </div>
          </div>

          {/* Cards Order & Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Showcase Cards ({items.length})</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Reorder & Select</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {items.map((it, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <div
                    key={it.id || idx}
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#2874f0] bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img 
                          src={it.image} 
                          alt={it.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="px-1.5 py-0.2 text-[9px] font-bold text-white rounded-xs"
                            style={{ backgroundColor: it.badgeColor || '#388e3c' }}
                          >
                            {it.badge}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {it.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {it.subtitle} &bull; <span className="font-semibold text-slate-700">{it.price}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'left')}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200/60 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMoveItem(idx, 'right')}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200/60 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="p-1 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Card Properties Editor (8 cols) */}
        <div className="lg:col-span-8">
          {currentItem ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              {/* Header of editing card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold text-sm">
                    #{selectedIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Edit Card: {currentItem.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure badge, title, subtitle offer, price label, and imagery.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProductPickerModal(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Copy from Catalog Piece</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Card Title / Jewellery Name
                  </label>
                  <input
                    type="text"
                    value={currentItem.title}
                    onChange={(e) => updateItem('title', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                    placeholder="e.g. Solid Gold Chains"
                  />
                </div>

                {/* Subtitle / Offer */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Offer Highlight / Subtitle (Green text)
                  </label>
                  <input
                    type="text"
                    value={currentItem.subtitle}
                    onChange={(e) => updateItem('subtitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-emerald-700 font-bold"
                    placeholder="e.g. Don't Miss or Flat 35% Off"
                  />
                </div>

                {/* Price Display */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Notice / Teaser
                  </label>
                  <input
                    type="text"
                    value={currentItem.price}
                    onChange={(e) => updateItem('price', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-700"
                    placeholder="e.g. From ₹4,990"
                  />
                </div>

                {/* Target Category Route */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Category Link
                  </label>
                  <select
                    value={currentItem.category}
                    onChange={(e) => updateItem('category', e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Badge Label */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corner Badge Text
                  </label>
                  <input
                    type="text"
                    value={currentItem.badge}
                    onChange={(e) => updateItem('badge', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    placeholder="e.g. Bestseller, Top Pick, Trending, Heritage"
                  />
                </div>

                {/* Badge Color Preset */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Badge Color Palette
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BADGE_COLOR_PRESETS.map((color) => {
                      const isActive = (currentItem.badgeColor || '#388e3c') === color.hex;
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => updateItem('badgeColor', color.hex)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                            isActive ? 'scale-125 ring-2 ring-slate-400' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isActive && <Check className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                    <input
                      type="color"
                      value={currentItem.badgeColor || '#388e3c'}
                      onChange={(e) => updateItem('badgeColor', e.target.value)}
                      className="w-6 h-6 rounded-full overflow-hidden cursor-pointer border-0 p-0"
                      title="Custom Hex Color"
                    />
                  </div>
                </div>
              </div>

              {/* Imagery Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Product Image URL</span>
                  </label>
                  <span className="text-[10px] text-slate-400">High-resolution 1:1 square photo recommended</span>
                </div>

                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={currentItem.image}
                      onChange={(e) => updateItem('image', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-[11px] text-slate-500">
                      Enter any CDN/Unsplash URL or choose from curated fine jewellery presets below.
                    </p>
                  </div>
                </div>

                {/* Preset Imagery Quick Picker */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 mb-2 block">
                    Curated Fine Jewellery Photo Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset, pIdx) => {
                      const isPicked = currentItem.image === preset.url;
                      return (
                        <div
                          key={pIdx}
                          onClick={() => {
                            updateItem('image', preset.url);
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            isPicked 
                              ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                            loading="lazy"
                          />
                          <div className="truncate text-left">
                            <p className="text-[11px] font-semibold text-slate-800 truncate">
                              {preset.name}
                            </p>
                            <span className="text-[9px] text-slate-400 capitalize">
                              {preset.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedIdx === 0}
                    onClick={() => handleMoveItem(selectedIdx, 'left')}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Move Earlier</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedIdx === items.length - 1}
                    onClick={() => handleMoveItem(selectedIdx, 'right')}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Move Later</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedIdx)}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Card #{selectedIdx + 1}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-400">
              Select or add a card to edit.
            </div>
          )}
        </div>
      </div>

      {/* Product Catalog Picker Modal */}
      {showProductPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select Product from Master Inventory
                </h3>
                <p className="text-xs text-slate-500">
                  Quickly populate Card #{selectedIdx + 1} with an authentic piece from your store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductPickerModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />

            {/* List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No products found matching &quot;{catalogSearch}&quot;
                </div>
              ) : (
                filteredCatalog.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleApplyFromCatalog(product)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{product.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {product.category} &bull; <span className="font-semibold text-slate-900">{currencySymbol}{product.price.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-2xs hover:bg-blue-700"
                    >
                      Use Piece
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
