import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: any) => boolean | void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol: string;
  currencyRate?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  currencySymbol
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(product.availableFinishes?.[0]?.type || product.metal);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = onAddToCart(product, product.availableSizes?.[0], selectedFinish);
    if (result !== false) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  // Determine current image based on hover
  const displayImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-[#e5e5ea] hover:border-[#d2d2d7] hover:shadow-sm rounded-xs transition-all duration-300 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Visual Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f7]">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 font-sans">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 bg-[#1d1d1f] text-white text-[8px] tracking-[0.25em] uppercase font-bold rounded-xs shadow-xs">
              Icon
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-[#86868b] text-white text-[8px] tracking-[0.25em] uppercase font-bold rounded-xs shadow-xs">
              Archetype
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted 
              ? 'bg-[#1d1d1f] text-white shadow-xs' 
              : 'bg-white/90 text-[#1d1d1f] hover:opacity-60 shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Overlay Button (Touch friendly & Hover friendly) */}
        <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10 font-sans">
          <button
            id={`quickview-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-1.5 sm:py-2.5 bg-white/95 hover:bg-white text-[#1d1d1f] text-[8px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase rounded-xs backdrop-blur-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
        </div>
      </div>

      {/* Product Information Card Body */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Metal & Rating Line */}
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-[#86868b] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-sans mb-1">
            <span className="truncate max-w-[95px] sm:max-w-[140px]">
              {product.metalName}
            </span>
            <StarRating 
              rating={product.rating} 
              count={product.reviewsCount} 
              size="xs" 
              countFormat="number"
            />
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-sm sm:text-base md:text-lg font-light text-[#1d1d1f] leading-snug group-hover:opacity-60 transition-opacity line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-[#86868b] font-serif italic line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Action Button & Price Bottom Section */}
        <div className="pt-2 sm:pt-2.5 border-t border-[#e5e5ea] flex items-center justify-between gap-2">
          {/* Buy / Add to Bag Button (moved to bottom left section) */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              id={`quickadd-btn-${product.id}`}
              onClick={handleQuickAdd}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 shrink-0 ${
                addedAnimation
                  ? 'bg-emerald-800 text-white'
                  : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/50'
              }`}
              title="Add to Bag"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  <span className="font-sans whitespace-nowrap">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1A1816]" />
                  <span className="font-sans whitespace-nowrap">Add to Bag</span>
                </>
              )}
            </button>

            {/* Swatches if available */}
            {product.availableFinishes && product.availableFinishes.length > 1 && (
              <div className="hidden md:flex items-center gap-1 shrink-0 ml-0.5" onClick={(e) => e.stopPropagation()}>
                {product.availableFinishes.map(f => (
                  <button
                    key={f.type}
                    onClick={() => setSelectedFinish(f.type)}
                    className={`w-2.5 h-2.5 rounded-full border transition-transform ${
                      selectedFinish === f.type
                        ? 'ring-1 ring-[#1d1d1f] ring-offset-1 scale-110'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: f.colorHex }}
                    title={f.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <div className="flex items-baseline gap-1 justify-end">
              {product.originalPrice && (
                <span className="text-[9px] sm:text-[10px] text-[#86868b] line-through font-sans">
                  {currencySymbol}{product.originalPrice}
                </span>
              )}
              <span className="font-serif text-sm sm:text-base font-light text-[#1d1d1f] whitespace-nowrap">
                {currencySymbol}{product.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
