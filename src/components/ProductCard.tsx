import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

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
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = onAddToCart(product, product.availableSizes?.[0], product.metal);
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

  // Calculate discount percentage
  const original = product.originalPrice || Math.round(product.price * 1.5);
  const discountPercent = Math.max(10, Math.round(((original - product.price) / original) * 100));

  const brandName = product.metalName.includes('Gold') 
    ? 'NAXTTO LUXE' 
    : product.metalName.includes('Diamond') 
    ? 'NAXTTO SOLITAIRE' 
    : 'NAXTTO ATELIER';

  return (
    <div
      id={`myntra-product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-[#eaeaec] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer overflow-hidden select-none rounded-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#fafafa]">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#F50087] to-[#F0501A] text-white text-[9px] font-black uppercase tracking-wider rounded-xs shadow-xs">
              Trending
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#F0501A] to-[#FFA033] text-white text-[9px] font-black uppercase tracking-wider rounded-xs shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Myntra-Style Green Rating Pill on Bottom-Left of Image */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-sm shadow-xs flex items-center gap-1 text-[11px] font-bold text-[#282c3f] z-10">
          <span>{product.rating.toFixed(1)}</span>
          <Star className="w-3 h-3 text-[#14958f] fill-[#14958f]" />
          <span className="text-[#94969f] font-normal text-[10px] border-l border-gray-300 pl-1 ml-0.5">
            {product.reviewsCount > 100 ? `${(product.reviewsCount / 100).toFixed(1)}k` : product.reviewsCount}
          </span>
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 shadow-xs ${
            isWishlisted 
              ? 'bg-[#F50087] text-white' 
              : 'bg-white/90 text-[#696e79] hover:text-[#F50087] hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Quick View Trigger (Desktop) */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-1.5 bg-white/95 hover:bg-white text-[#282c3f] rounded-full shadow-md hover:text-[#ff3e6c] transition-colors"
            title="Quick view product"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Body (Matching Myntra Typography & Layout) */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white text-left">
        <div>
          {/* Brand Name */}
          <div className="text-xs sm:text-[13px] font-extrabold uppercase text-[#282c3f] tracking-wide truncate">
            {brandName}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-[13px] text-[#535766] truncate mt-0.5 font-normal">
            {product.name}
          </h3>
        </div>

        {/* Price Row (Selling Price, Strikethrough MRP, Discount in Coral) */}
        <div className="mt-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-[#282c3f]">
              {currencySymbol}{product.price.toLocaleString()}
            </span>

            <span className="text-[11px] text-[#7e818c] line-through font-normal">
              {currencySymbol}{original.toLocaleString()}
            </span>

            <span className="text-[11px] sm:text-xs font-bold text-[#F50087]">
              ({discountPercent}% OFF)
            </span>
          </div>

          {/* Quick Add To Bag Action */}
          <button
            id={`myntra-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className={`mt-2.5 w-full py-2 px-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-98 ${
              addedAnimation
                ? 'bg-[#03a685] text-white'
                : 'bg-white hover:bg-gradient-to-r hover:from-[#F50087] hover:to-[#F0501A] text-[#282c3f] hover:text-white border border-[#eaeaec] hover:border-[#F50087]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
