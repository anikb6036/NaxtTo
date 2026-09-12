import React, { useState } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search, 
  Check, 
  ChevronDown, 
  Layers,
  CircleDot
} from 'lucide-react';
import { ProductCategory, MetalType, JewelleryStyle, FilterOptions } from '../types';

interface ProductFilterProps {
  filterOptions: FilterOptions;
  onChangeFilter: (newFilters: FilterOptions) => void;
  totalResults: number;
  currencySymbol?: string;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filterOptions,
  onChangeFilter,
  totalResults,
  currencySymbol = '₹'
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Pieces' },
    { id: 'rings', label: 'Rings' },
    { id: 'necklaces', label: 'Necklaces' },
    { id: 'earrings', label: 'Earrings' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'fine-collections', label: 'Fine Collections' },
    { id: 'bespoke', label: 'Bespoke Atelier' }
  ];

  const metals: { id: MetalType; label: string; swatch: string }[] = [
    { id: '18k-yellow-gold', label: '18K Yellow Gold', swatch: '#D4AF37' },
    { id: '18k-white-gold', label: '18K White Gold', swatch: '#E5E4E2' },
    { id: '18k-rose-gold', label: '18K Rose Gold', swatch: '#E0A899' },
    { id: 'platinum', label: 'Platinum 950', swatch: '#CECECE' },
    { id: '925-sterling-silver', label: '925 Sterling Silver', swatch: '#DCDCDC' },
    { id: 'gold-vermeil', label: '18K Gold Vermeil', swatch: '#E6C875' }
  ];

  const styles: { id: JewelleryStyle; label: string }[] = [
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'statement', label: 'Statement' },
    { id: 'sculptural', label: 'Sculptural' },
    { id: 'bridal', label: 'Bridal & Ceremonial' },
    { id: 'everyday-luxe', label: 'Everyday Luxe' },
    { id: 'vintage-modern', label: 'Vintage Modern' }
  ];

  const toggleMetal = (metal: MetalType) => {
    const exists = filterOptions.metals.includes(metal);
    const updated = exists 
      ? filterOptions.metals.filter(m => m !== metal)
      : [...filterOptions.metals, metal];
    onChangeFilter({ ...filterOptions, metals: updated });
  };

  const toggleStyle = (style: JewelleryStyle) => {
    const exists = filterOptions.styles.includes(style);
    const updated = exists 
      ? filterOptions.styles.filter(s => s !== style)
      : [...filterOptions.styles, style];
    onChangeFilter({ ...filterOptions, styles: updated });
  };

  const handleResetFilters = () => {
    onChangeFilter({
      category: 'all',
      metals: [],
      styles: [],
      priceRange: [0, 3000],
      inStockOnly: false,
      sortBy: 'featured',
      searchQuery: ''
    });
  };

  const activeFilterCount = 
    (filterOptions.category !== 'all' ? 1 : 0) +
    filterOptions.metals.length +
    filterOptions.styles.length +
    (filterOptions.inStockOnly ? 1 : 0) +
    (filterOptions.searchQuery ? 1 : 0) +
    (filterOptions.priceRange[0] > 0 || filterOptions.priceRange[1] < 3000 ? 1 : 0);

  return (
    <div id="product-filter-bar" className="w-full bg-white border-b border-[#e5e5ea] pt-6 sm:pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Myntra-Style Sort By Tab Strip */}
        <div className="flex items-center justify-between border-b border-[#eaeaec] pb-2 mb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans shrink-0">
            <span className="font-bold text-[#282c3f] uppercase text-[11px] tracking-wider">Sort By:</span>
            {[
              { id: 'featured', label: 'Recommended' },
              { id: 'rating', label: 'Customer Rating' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
              { id: 'newest', label: 'What\'s New' }
            ].map(s => {
              const active = filterOptions.sortBy === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onChangeFilter({ ...filterOptions, sortBy: s.id as any })}
                  className={`relative py-1 font-semibold transition-colors whitespace-nowrap ${
                    active ? 'text-[#F50087] font-bold' : 'text-[#696e79] hover:text-[#282c3f]'
                  }`}
                >
                  <span>{s.label}</span>
                  {active && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#F50087] to-[#F0501A] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <span className="text-xs text-[#7e818c]">
              Showing <strong className="text-[#282c3f]">{totalResults}</strong> creations
            </span>
          </div>
        </div>

        {/* Category Pills Header & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-3">
          {/* Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => onChangeFilter({ ...filterOptions, category: cat.id })}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-sans font-bold uppercase whitespace-nowrap transition-all duration-200 border shrink-0 ${
                  filterOptions.category === cat.id
                    ? 'bg-[#282c3f] text-white border-[#282c3f] shadow-xs'
                    : 'bg-[#f5f5f6] text-[#535766] border-transparent hover:bg-[#eaeaec] hover:text-[#282c3f]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Drawer Trigger & Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 font-sans pt-1 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f2]">
            <button
              id="open-filter-drawer-btn"
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-sans font-bold uppercase border transition-all ${
                activeFilterCount > 0
                  ? 'bg-gradient-to-r from-[#F50087] to-[#F0501A] text-white border-transparent'
                  : 'bg-white text-[#282c3f] border-[#d4d5d9] hover:border-[#282c3f]'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#F50087] text-[8px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="product-sort-select"
                value={filterOptions.sortBy}
                onChange={(e) => onChangeFilter({ ...filterOptions, sortBy: e.target.value as any })}
                className="appearance-none bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-[#e5e5ea] rounded-full text-[9px] sm:text-[10px] text-[#1d1d1f] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase py-1.5 sm:py-2 pl-3 sm:pl-4 pr-7 sm:pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1d1d1f] font-sans"
              >
                <option value="featured">Curated Selection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">New Archetypes</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#86868b] absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Inline Material & Style Quick Selectors */}
        <div className="hidden lg:flex items-center justify-between pt-3 text-xs border-t border-[#e5e5ea]">
          {/* Material Pills */}
          <div className="flex items-center gap-2 flex-wrap font-sans">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#86868b] mr-1">Material:</span>
            {metals.map(m => {
              const active = filterOptions.metals.includes(m.id);
              return (
                <button
                  key={m.id}
                  id={`quick-metal-${m.id}`}
                  onClick={() => toggleMetal(m.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] font-bold'
                      : 'bg-white text-[#1d1d1f] border-[#e5e5ea] hover:bg-[#f5f5f7] hover:border-[#d2d2d7]'
                  }`}
                >
                  <div 
                    className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'border border-[#1d1d1f]'}`} 
                  />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Style Pills */}
          <div className="flex items-center gap-2 flex-wrap font-sans">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#86868b] mr-1">Style:</span>
            {styles.map(s => {
              const active = filterOptions.styles.includes(s.id);
              return (
                <button
                  key={s.id}
                  id={`quick-style-${s.id}`}
                  onClick={() => toggleStyle(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] tracking-wider uppercase transition-all ${
                    active
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] font-bold'
                      : 'bg-white text-[#1d1d1f] border-[#e5e5ea] hover:bg-[#f5f5f7] hover:border-[#d2d2d7]'
                  }`}
                >
                  <div 
                    className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'border border-[#1d1d1f]'}`} 
                  />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Badges & Result Summary */}
        <div className="flex items-center justify-between pt-3 mt-2 text-xs text-[#86868b] font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest">
              Curated Selection (<strong className="text-[#1d1d1f]">{totalResults}</strong>)
            </span>
            
            {activeFilterCount > 0 && (
              <>
                <span className="text-[#e5e5ea]">•</span>
                <button
                  id="reset-all-filters-btn"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[#1d1d1f] hover:opacity-50 font-bold uppercase tracking-wider text-[9px] transition-opacity"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear Filters</span>
                </button>
              </>
            )}
          </div>

          {filterOptions.searchQuery && (
            <div className="flex items-center gap-1.5 bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide">
              <span>Query: "{filterOptions.searchQuery}"</span>
              <button 
                onClick={() => onChangeFilter({ ...filterOptions, searchQuery: '' })}
                className="hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide-Over Comprehensive Filter Drawer (Mobile & Extended) */}
      {drawerOpen && (
        <div 
          id="filter-flyout-drawer"
          className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-8 animate-slideLeft border-l border-[#e5e5ea]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#eeeae4]">
                <div>
                  <h3 className="font-serif text-2xl font-light italic text-[#2d2a26]">Filter Archetypes</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#a39d96] font-sans mt-0.5">Refine Precious Metallurgy</p>
                </div>
                <button
                  id="close-filter-drawer"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-full hover:opacity-50 text-[#2d2a26]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Keyword Search in Filter */}
              <div className="py-5 border-b border-[#eeeae4]">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans mb-3 text-[#a39d96]">
                  Search Keywords
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    value={filterOptions.searchQuery}
                    onChange={(e) => onChangeFilter({ ...filterOptions, searchQuery: e.target.value })}
                    placeholder="e.g. Lunar, Hoop, Band, Silver..."
                    className="w-full bg-transparent border-b border-[#2d2a26] py-2 pl-7 pr-4 text-xs text-[#2d2a26] focus:outline-none italic font-serif"
                  />
                  <Search className="w-3.5 h-3.5 text-[#a39d96] absolute left-0 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Material Filter */}
              <div className="py-5 border-b border-[#eeeae4]">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans mb-4 text-[#a39d96] border-b border-[#eeeae4] pb-2">
                  Material
                </h4>
                <ul className="flex flex-col gap-3.5 text-xs tracking-wide">
                  {metals.map(m => {
                    const isSelected = filterOptions.metals.includes(m.id);
                    return (
                      <li
                        key={m.id}
                        id={`drawer-metal-${m.id}`}
                        onClick={() => toggleMetal(m.id)}
                        className={`flex items-center justify-between cursor-pointer py-1 transition-opacity hover:opacity-75 ${
                          isSelected ? 'font-bold text-[#2d2a26]' : 'text-[#2d2a26]'
                        }`}
                      >
                        <span className="font-serif text-sm">{m.label}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#2d2a26]' : 'border border-[#2d2a26]'}`} />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Style & Aesthetic Filter */}
              <div className="py-5 border-b border-[#eeeae4]">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans mb-4 text-[#a39d96] border-b border-[#eeeae4] pb-2">
                  Style
                </h4>
                <ul className="flex flex-col gap-3.5 text-xs tracking-wide">
                  {styles.map(s => {
                    const isSelected = filterOptions.styles.includes(s.id);
                    return (
                      <li
                        key={s.id}
                        id={`drawer-style-${s.id}`}
                        onClick={() => toggleStyle(s.id)}
                        className={`flex items-center justify-between cursor-pointer py-1 transition-opacity hover:opacity-75 ${
                          isSelected ? 'font-bold text-[#2d2a26]' : 'text-[#2d2a26]'
                        }`}
                      >
                        <span className="font-serif text-sm">{s.label}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#2d2a26]' : 'border border-[#2d2a26]'}`} />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Range Slider */}
              <div className="py-5 border-b border-[#eeeae4]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#a39d96]">
                    Price Ceiling
                  </h4>
                  <span className="text-xs font-serif font-bold text-[#2d2a26]">
                    Up to {currencySymbol}{filterOptions.priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={filterOptions.priceRange[1]}
                  onChange={(e) => onChangeFilter({
                    ...filterOptions,
                    priceRange: [0, parseInt(e.target.value, 10)]
                  })}
                  className="w-full accent-[#2d2a26] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-sans text-[#a39d96] mt-1">
                  <span>{currencySymbol}200</span>
                  <span>{currencySymbol}1,500</span>
                  <span>{currencySymbol}3,000+</span>
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="py-5 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#2d2a26] font-bold">
                    Immediate Atelier Dispatch
                  </h4>
                  <p className="text-[10px] text-[#a39d96] font-sans">Ready for next-day insured courier.</p>
                </div>
                <button
                  id="in-stock-filter-toggle"
                  onClick={() => onChangeFilter({ ...filterOptions, inStockOnly: !filterOptions.inStockOnly })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    filterOptions.inStockOnly ? 'bg-[#2d2a26]' : 'bg-[#eeeae4]'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      filterOptions.inStockOnly ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#eeeae4] flex items-center gap-4 font-sans">
              <button
                id="reset-drawer-filters"
                onClick={handleResetFilters}
                className="flex-1 py-3 text-[10px] tracking-[0.2em] uppercase font-bold text-[#2d2a26] border border-[#eeeae4] hover:bg-[#f5f2ee] rounded-xs transition-colors"
              >
                Reset
              </button>
              <button
                id="apply-drawer-filters"
                onClick={() => setDrawerOpen(false)}
                className="flex-2 py-3 text-[10px] tracking-[0.2em] uppercase font-bold text-white bg-[#2d2a26] hover:opacity-90 rounded-xs transition-opacity shadow-md"
              >
                Show Selection ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
