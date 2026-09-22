import React from 'react';
import { Search, ArrowRight, Sparkles, Tag, ChevronRight, History, X, AlertCircle } from 'lucide-react';
import { Product, ProductCategory } from '../types';

export interface CategorySuggestion {
  id: ProductCategory;
  name: string;
  description: string;
  itemCount: number;
}

interface SearchSuggestionsDropdownProps {
  isOpen: boolean;
  query: string;
  matchedCategories: CategorySuggestion[];
  matchedProducts: Product[];
  totalProductMatches: number;
  recentSearches: string[];
  popularSearches: string[];
  selectedIndex: number;
  currencySymbol: string;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
  onSelectRecentSearch: (search: string) => void;
  onRemoveRecentSearch: (search: string, e: React.MouseEvent) => void;
  onClearAllRecentSearches: () => void;
  onClose: () => void;
}

// Utility to highlight matching query text in a string
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-pink-100 text-[#ff3e6c] font-semibold rounded px-0.5 not-italic">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  isOpen,
  query,
  matchedCategories,
  matchedProducts,
  totalProductMatches,
  recentSearches,
  popularSearches,
  selectedIndex,
  currencySymbol,
  onSelectCategory,
  onSelectProduct,
  onSearchSubmit,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearAllRecentSearches,
  onClose,
}) => {
  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const hasCategories = matchedCategories.length > 0;
  const hasProducts = matchedProducts.length > 0;
  const hasResults = hasCategories || hasProducts;

  // Compute item index offsets for keyboard navigation
  // Indices:
  // 0 .. (matchedCategories.length - 1) => Categories
  // matchedCategories.length .. (matchedCategories.length + matchedProducts.length - 1) => Products
  // matchedCategories.length + matchedProducts.length => View all results button
  const categoryOffset = 0;
  const productOffset = matchedCategories.length;
  const viewAllIndex = productOffset + matchedProducts.length;

  return (
    <div
      id="search-realtime-suggestions-popover"
      className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white rounded-lg shadow-2xl border border-[#eaeaec] z-50 overflow-hidden divide-y divide-[#f5f5f6] text-[#282c3f] animate-in fade-in slide-in-from-top-2 duration-150"
      onMouseDown={(e) => {
        // Prevent search input from losing focus when clicking within the dropdown
        e.preventDefault();
      }}
    >
      {/* 1. EMPTY QUERY: POPULAR SUGGESTIONS & RECENT SEARCHES */}
      {!hasQuery && (
        <div className="p-3.5 sm:p-4 space-y-4 max-h-[380px] overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#696e79] flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#ff3e6c]" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={onClearAllRecentSearches}
                  className="text-[10px] text-[#696e79] hover:text-[#ff3e6c] font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recentSearches.map((term) => (
                  <span
                    key={term}
                    className="inline-flex items-center gap-1 bg-[#f5f5f6] hover:bg-pink-50 hover:text-[#ff3e6c] text-[#282c3f] text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors group"
                    onClick={() => onSelectRecentSearch(term)}
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={(e) => onRemoveRecentSearch(term, e)}
                      className="text-gray-400 group-hover:text-[#ff3e6c] p-0.5 rounded-full"
                      title="Remove"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular / Trending Searches */}
          <div>
            <div className="flex items-center gap-1.5 pb-2 mb-1.5 border-b border-gray-100">
              <Sparkles className="w-3.5 h-3.5 text-[#ff3e6c]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#696e79]">
                Trending Collections &amp; Styles
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectRecentSearch(item)}
                  className="text-xs bg-[#f5f5f6] hover:bg-pink-50 hover:text-[#ff3e6c] text-[#282c3f] px-3 py-1 rounded-full font-medium transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#696e79] pb-2 mb-1.5 border-b border-gray-100">
              Explore By Heritage Category
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory('shakha')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-pink-50 group text-left transition-colors border border-gray-100 hover:border-pink-200"
              >
                <span className="text-xs font-bold text-[#282c3f] group-hover:text-[#ff3e6c]">
                  Shankha Bangles
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff3e6c]" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory('pola')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-pink-50 group text-left transition-colors border border-gray-100 hover:border-pink-200"
              >
                <span className="text-xs font-bold text-[#282c3f] group-hover:text-[#ff3e6c]">
                  Coral Pola Pairs
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff3e6c]" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory('gold-badhano')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-pink-50 group text-left transition-colors border border-gray-100 hover:border-pink-200"
              >
                <span className="text-xs font-bold text-[#282c3f] group-hover:text-[#ff3e6c]">
                  22K Gold Badhano
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff3e6c]" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory('bridal-combos')}
                className="flex items-center justify-between p-2 rounded-md hover:bg-pink-50 group text-left transition-colors border border-gray-100 hover:border-pink-200"
              >
                <span className="text-xs font-bold text-[#282c3f] group-hover:text-[#ff3e6c]">
                  Bridal Combos
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff3e6c]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE QUERY: MATCHED CATEGORIES */}
      {hasQuery && hasCategories && (
        <div className="py-2">
          <div className="px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#696e79] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-[#ff3e6c]" />
              Matching Categories
            </span>
            <span className="text-[10px] text-gray-400 font-normal">Jump directly to collection</span>
          </div>

          <div className="space-y-0.5 mt-1">
            {matchedCategories.map((cat, idx) => {
              const itemIdx = categoryOffset + idx;
              const isSelected = selectedIndex === itemIdx;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between group transition-colors cursor-pointer ${
                    isSelected ? 'bg-pink-50/80 text-[#ff3e6c]' : 'hover:bg-[#f9f9fa] text-[#282c3f]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-[#ff3e6c] text-white' : 'bg-[#f5f5f6] text-[#696e79] group-hover:bg-[#ff3e6c] group-hover:text-white'
                    }`}>
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-[13px] font-bold truncate">
                        {highlightText(cat.name, trimmedQuery)}
                      </div>
                      <div className="text-[11px] text-[#696e79] truncate">
                        {cat.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 group-hover:bg-pink-100 group-hover:text-[#ff3e6c] px-2 py-0.5 rounded-full">
                      {cat.itemCount} items
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff3e6c] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ACTIVE QUERY: MATCHED PRODUCTS */}
      {hasQuery && hasProducts && (
        <div className="py-2 max-h-[340px] overflow-y-auto">
          <div className="px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#696e79] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#ff3e6c]" />
              Matching Jewellery Products
            </span>
            <span className="text-[10px] text-gray-400 font-normal">Direct link to product</span>
          </div>

          <div className="space-y-1 mt-1 px-1">
            {matchedProducts.map((product, idx) => {
              const itemIdx = productOffset + idx;
              const isSelected = selectedIndex === itemIdx;

              const discount = product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className={`w-full p-2 rounded-md text-left flex items-center gap-3 group transition-all cursor-pointer ${
                    isSelected ? 'bg-pink-50 ring-1 ring-[#ff3e6c]/40' : 'hover:bg-[#f9f9fa]'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=150&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#ff3e6c] text-[8px] font-black text-white text-center py-0.2 uppercase">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-[13px] font-bold text-[#282c3f] group-hover:text-[#ff3e6c] truncate">
                      {highlightText(product.name, trimmedQuery)}
                    </div>
                    <div className="text-[11px] text-[#696e79] truncate flex items-center gap-1.5 mt-0.5">
                      <span>{product.metalName || product.category}</span>
                      <span>•</span>
                      <span className="text-[#03a685] font-semibold">
                        {product.inStock ? 'In Stock' : 'Pre-Order'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Rating */}
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-[13px] font-extrabold text-[#282c3f]">
                      {currencySymbol}{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-[10px] text-gray-400 line-through">
                        {currencySymbol}{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                    {product.rating && (
                      <div className="text-[10px] font-bold text-amber-600 mt-0.5">
                        ★ {product.rating}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ACTIVE QUERY: NO RESULTS FOUND */}
      {hasQuery && !hasResults && (
        <div className="p-6 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#282c3f]">
            No matching jewellery found for &ldquo;{trimmedQuery}&rdquo;
          </p>
          <p className="text-[11px] sm:text-xs text-[#696e79] mt-1 max-w-sm mx-auto">
            Try searching for traditional terms like <strong>Shankha</strong>, <strong>Pola</strong>, <strong>Gold Badhano</strong>, or <strong>Loha</strong>.
          </p>
          <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="text-xs bg-[#ff3e6c] hover:bg-[#e0355d] text-white font-bold px-3 py-1.5 rounded transition-colors"
            >
              Browse All Atelier Pieces
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('gold-badhano')}
              className="text-xs bg-[#f5f5f6] hover:bg-gray-200 text-[#282c3f] font-bold px-3 py-1.5 rounded transition-colors"
            >
              22K Gold Badhano
            </button>
          </div>
        </div>
      )}

      {/* 5. FOOTER: SEARCH SUBMISSION BUTTON */}
      {hasQuery && (
        <div className="p-2.5 bg-[#fbfbfc] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSearchSubmit(trimmedQuery)}
            className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              selectedIndex === viewAllIndex
                ? 'bg-[#ff3e6c] text-white'
                : 'bg-white hover:bg-pink-50 text-[#ff3e6c] border border-pink-200'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                View all results for &ldquo;<strong>{trimmedQuery}</strong>&rdquo;
                {totalProductMatches > 0 && ` (${totalProductMatches} items)`}
              </span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};
