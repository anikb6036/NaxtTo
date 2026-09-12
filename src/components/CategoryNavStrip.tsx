import React, { useRef } from 'react';
import { 
  Sparkles, 
  Gem, 
  Crown, 
  Coins, 
  Gift, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  CircleDot
} from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryNavStripProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  activeSpecialFilter?: string;
  onSelectSpecialFilter?: (filter: string) => void;
}

interface NavCategoryItem {
  id: ProductCategory | string;
  isSpecial?: boolean;
  label: string;
  subLabel?: string;
  icon: React.ReactNode;
  imgUrl: string;
  badge?: string;
}

export const CategoryNavStrip: React.FC<CategoryNavStripProps> = ({
  activeCategory,
  onSelectCategory,
  activeSpecialFilter,
  onSelectSpecialFilter
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: NavCategoryItem[] = [
    {
      id: 'all',
      label: 'For You',
      subLabel: 'Top Deals',
      badge: 'HOT',
      icon: <Sparkles className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'rings',
      label: 'Rings',
      subLabel: 'Solitaire & Bands',
      icon: <CircleDot className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'necklaces',
      label: 'Necklaces',
      subLabel: 'Chokers & Chains',
      icon: <Gem className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'earrings',
      label: 'Earrings',
      subLabel: 'Studs & Drops',
      icon: <Sparkles className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'bracelets',
      label: 'Bangles & Bracelets',
      subLabel: 'Tennis & Kadas',
      icon: <Zap className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'fine-collections',
      label: 'Bridal Sets',
      subLabel: 'Heritage 18K',
      badge: 'WEDDING',
      icon: <Crown className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'chains',
      isSpecial: true,
      label: 'Chains & Mangalsutra',
      subLabel: 'Daily Wear',
      icon: <Flame className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'gold-coins',
      isSpecial: true,
      label: '24K Gold Coins',
      subLabel: '999 Pure Bullion',
      badge: '0% MAKING',
      icon: <Coins className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'silver-925',
      isSpecial: true,
      label: 'Silver 925 & Anklets',
      subLabel: 'Oxidized & Pure',
      icon: <ShieldCheck className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=160&q=80'
    },
    {
      id: 'bespoke',
      label: 'Gifting & Custom',
      subLabel: 'Under ₹10,000',
      icon: <Gift className="w-5 h-5 text-[#b07d1e]" />,
      imgUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=160&q=80'
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleItemClick = (item: NavCategoryItem) => {
    if (item.isSpecial) {
      if (onSelectSpecialFilter) {
        onSelectSpecialFilter(item.id);
      }
      // If chains or silver, set closest base category
      if (item.id === 'chains') {
        onSelectCategory('necklaces');
      } else if (item.id === 'silver-925') {
        onSelectCategory('bracelets');
      } else {
        onSelectCategory('all');
      }
    } else {
      onSelectCategory(item.id as ProductCategory);
    }
  };

  return (
    <section 
      id="category-nav-strip" 
      aria-label="Jewellery Categories"
      className="w-full bg-white border-b border-[#e5e5ea] shadow-xs select-none relative z-10"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative group">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 w-8 h-12 bg-white/95 border border-[#d2d2d7] rounded-r-md items-center justify-center text-[#1d1d1f] shadow-md hover:bg-white hover:text-[#2874f0] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Categories Strip */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-2.5 sm:py-3 scrollbar-none scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id || (cat.id === 'all' && activeCategory === 'all');

            return (
              <button
                key={cat.id}
                id={`cat-nav-${cat.id}`}
                onClick={() => handleItemClick(cat)}
                className={`flex flex-col items-center justify-center shrink-0 min-w-[68px] sm:min-w-[80px] lg:min-w-[92px] group/item transition-all relative pb-1`}
              >
                {/* Badge if present */}
                {cat.badge && (
                  <span className="absolute -top-1 right-1 z-10 px-1.5 py-0.5 bg-[#e41b17] text-white text-[8px] font-bold rounded-full tracking-wider shadow-xs animate-pulse">
                    {cat.badge}
                  </span>
                )}

                {/* Circular Icon Thumbnail Container (Flipkart Style) */}
                <div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border transition-all duration-200 flex items-center justify-center overflow-hidden relative shadow-2xs ${
                    isSelected 
                      ? 'border-[#2874f0] ring-2 ring-[#2874f0]/20 scale-105 shadow-sm' 
                      : 'border-[#e0e0e0] group-hover/item:border-[#b07d1e] group-hover/item:scale-105'
                  }`}
                >
                  <img
                    src={cat.imgUrl}
                    alt={cat.label}
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover/item:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none rounded-full" />
                </div>

                {/* Title */}
                <span 
                  className={`text-xs sm:text-[13px] font-sans font-medium text-center mt-1.5 leading-tight transition-colors line-clamp-1 ${
                    isSelected 
                      ? 'text-[#2874f0] font-bold' 
                      : 'text-[#212121] group-hover/item:text-[#2874f0]'
                  }`}
                >
                  {cat.label}
                </span>

                {/* Active Indicator Bar (Flipkart Style Underline) */}
                {isSelected && (
                  <span className="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#2874f0] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 w-8 h-12 bg-white/95 border border-[#d2d2d7] rounded-l-md items-center justify-center text-[#1d1d1f] shadow-md hover:bg-white hover:text-[#2874f0] transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
