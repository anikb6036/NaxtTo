import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  History, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  Trash2, 
  Eye,
  Sparkles
} from 'lucide-react';
import { Product, MetalType } from '../types';
import { 
  getRecentlyViewedIds, 
  trackProductVisit, 
  clearRecentlyViewedHistory, 
  resolveRecentlyViewedProducts,
  MAX_RECENTLY_VIEWED
} from '../utils/recentlyViewed';

interface RecentlyViewedCarouselProps {
  currentProductId: string;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: MetalType, quantity?: number) => boolean | void;
  isProductWishlisted?: (productId: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol: string;
}

export const RecentlyViewedCarousel: React.FC<RecentlyViewedCarouselProps> = ({
  currentProductId,
  allProducts,
  onSelectProduct,
  onAddToCart,
  isProductWishlisted,
  onToggleWishlist,
  currencySymbol
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [visitedProducts, setVisitedProducts] = useState<Product[]>([]);

  // Track product visit and resolve the last 5 visited products
  const updateVisitedList = useCallback(() => {
    if (!currentProductId || !allProducts || allProducts.length === 0) return;
    
    // Track current piece in visit history
    const recentIds = trackProductVisit(currentProductId);
    // Resolve full product objects for the last 5 visited pieces
    const resolved = resolveRecentlyViewedProducts(recentIds, allProducts);
    setVisitedProducts(resolved);
  }, [currentProductId, allProducts]);

  useEffect(() => {
    updateVisitedList();
  }, [updateVisitedList]);

  // Listen to cross-component or storage updates
  useEffect(() => {
    const handleUpdate = () => {
      const recentIds = getRecentlyViewedIds();
      const resolved = resolveRecentlyViewedProducts(recentIds, allProducts);
      setVisitedProducts(resolved);
    };

    window.addEventListener('naxtto_recently_viewed_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('naxtto_recently_viewed_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [allProducts]);

  // Check scroll boundary to enable/disable navigation buttons
  const checkScrollBoundaries = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollBoundaries();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollBoundaries);
    window.addEventListener('resize', checkScrollBoundaries);
    return () => {
      container.removeEventListener('scroll', checkScrollBoundaries);
      window.removeEventListener('resize', checkScrollBoundaries);
    };
  }, [visitedProducts, checkScrollBoundaries]);

  // Horizontal scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = Math.max(280, container.clientWidth * 0.75);
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Quick add to cart handler
  const handleQuickAdd = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    onAddToCart(item);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 2000);
  };

  // Clear browsing history
  const handleClearHistory = () => {
    clearRecentlyViewedHistory();
    // After clearing, re-track only the current product
    trackProductVisit(currentProductId);
    const resolved = resolveRecentlyViewedProducts([currentProductId], allProducts);
    setVisitedProducts(resolved);
  };

  if (!visitedProducts || visitedProducts.length === 0) {
    return null;
  }

  return (
    <section 
      id="recently-viewed-section" 
      aria-label="Recently Viewed Products"
      className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[#e5e5ea]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5022c3]/10 text-[#5022c3] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] tracking-tight">
              Recently Viewed
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f5f5f7] text-[#535766] border border-[#e5e5ea]">
              Last {visitedProducts.length} of {MAX_RECENTLY_VIEWED}
            </span>
          </div>
          <p className="text-xs text-[#86868b] mt-1 pl-9">
            Quickly return to pieces you visited during this session
          </p>
        </div>

        {/* Action Controls: Clear History & Scroll Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {visitedProducts.length > 1 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[11px] font-medium text-[#86868b] hover:text-[#d32f2f] transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-red-50/50 cursor-pointer mr-1"
              title="Clear visited products history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll Recently Viewed left"
            className={`w-8 h-8 rounded-full border border-[#d2d2d7] flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b] shadow-xs cursor-pointer active:scale-95' 
                : 'bg-[#f5f5f7] text-[#c7c7cc] border-[#e5e5ea] cursor-not-allowed opacity-60'
            }`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll Recently Viewed right"
            className={`w-8 h-8 rounded-full border border-[#d2d2d7] flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b] shadow-xs cursor-pointer active:scale-95' 
                : 'bg-[#f5f5f7] text-[#c7c7cc] border-[#e5e5ea] cursor-not-allowed opacity-60'
            }`}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth pb-3 px-0.5 scrollbar-none snap-x select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visitedProducts.map((item, idx) => {
          const isCurrent = item.id === currentProductId;
          const originalPrice = item.originalPrice || Math.round(item.price * 1.3);
          const discountPercent = Math.max(5, Math.round(((originalPrice - item.price) / originalPrice) * 100));
          const isItemWishlisted = isProductWishlisted ? isProductWishlisted(item.id) : false;
          const isHovered = hoveredProductId === item.id;
          const displayImage = isHovered && item.images && item.images.length > 1 ? item.images[1] : item.images?.[0];
          const isJustAdded = justAddedId === item.id;

          return (
            <div
              key={item.id}
              id={`recently-viewed-item-${item.id}`}
              onClick={() => {
                if (!isCurrent) {
                  onSelectProduct(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onMouseEnter={() => setHoveredProductId(item.id)}
              onMouseLeave={() => setHoveredProductId(null)}
              className={`snap-start w-[210px] sm:w-[230px] md:w-[250px] shrink-0 bg-white rounded-xl border flex flex-col justify-between overflow-hidden transition-all duration-200 group ${
                isCurrent 
                  ? 'border-[#5022c3]/40 ring-2 ring-[#5022c3]/20 shadow-xs cursor-default' 
                  : 'border-[#e5e5ea] hover:border-[#86868b] hover:shadow-md cursor-pointer'
              }`}
            >
              {/* Card Image Wrapper */}
              <div className="relative aspect-square w-full bg-[#fbfbfd] overflow-hidden">
                <img
                  src={displayImage || '/src/assets/images/shankha_pola_set_1790249913718.jpg'}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5022c3] text-white flex items-center gap-1 shadow-xs">
                      <Eye className="w-3 h-3" />
                      <span>Viewing Now</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      #{idx + 1} Recent
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white shadow-2xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(item);
                  }}
                  aria-label={isItemWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 z-10 shadow-xs cursor-pointer ${
                    isItemWishlisted 
                      ? 'bg-[#ff3e6c] text-white' 
                      : 'bg-white/90 text-[#696e79] hover:text-[#ff3e6c] hover:bg-white'
                  }`}
                  title={isItemWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isItemWishlisted ? 'fill-white' : ''}`} />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1 text-[10px] font-bold text-[#282c3f] z-10">
                  <span>{(item.rating || 4.8).toFixed(1)}</span>
                  <Star className="w-2.5 h-2.5 text-[#14958f] fill-[#14958f]" />
                  <span className="text-[#94969f] font-normal text-[9px] border-l border-gray-300 pl-1 ml-0.5">
                    {item.reviewsCount || 0}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#86868b] truncate">
                    {item.category?.replace('-', ' ') || 'Jewellery'}
                  </p>
                  
                  <h3 className="text-xs font-semibold text-[#1d1d1f] line-clamp-1 mt-0.5 group-hover:text-[#5022c3] transition-colors" title={item.name}>
                    {item.name}
                  </h3>

                  {/* Price Row */}
                  <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-[#1d1d1f]">
                      {currencySymbol}{item.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#86868b] line-through font-normal">
                      {currencySymbol}{originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Action: Add to Bag or Current State */}
                <div className="pt-1">
                  {isCurrent ? (
                    <div className="w-full py-1.5 px-2 rounded bg-purple-50 text-[#5022c3] text-[11px] font-semibold text-center border border-purple-200">
                      Currently on this page
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`w-full py-1.5 px-2 text-[11px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#03a685] text-white'
                          : 'bg-[#f5f5f7] hover:bg-[#5022c3] text-[#282c3f] hover:text-white border border-[#eaeaec] hover:border-[#5022c3]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
