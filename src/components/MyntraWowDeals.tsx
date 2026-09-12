import React from 'react';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface MyntraWowDealsProps {
  onSelectCategory: (category: ProductCategory) => void;
  onExploreCatalog: () => void;
}

export const MyntraWowDeals: React.FC<MyntraWowDealsProps> = ({
  onSelectCategory,
  onExploreCatalog,
}) => {
  const deals = [
    {
      id: 'rings',
      category: 'rings' as ProductCategory,
      title: 'Solitaire Rings',
      brand: 'NAXTTO DIAMONDS',
      discount: '40-60% OFF',
      tagline: 'Certified 18K Gold',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'Starting ₹4,990'
    },
    {
      id: 'necklaces',
      category: 'necklaces' as ProductCategory,
      title: 'Chokers & Pendants',
      brand: 'HERITAGE ATELIER',
      discount: 'MIN. 50% OFF',
      tagline: 'Handcrafted Perfection',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'Starting ₹8,490'
    },
    {
      id: 'earrings',
      category: 'earrings' as ProductCategory,
      title: 'Diamond Studs & Jhumkas',
      brand: 'MIA LUXE',
      discount: 'UNDER ₹9,999',
      tagline: 'Daily Sparkle',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'Best Seller'
    },
    {
      id: 'bracelets',
      category: 'bracelets' as ProductCategory,
      title: 'Tennis Bracelets & Bangles',
      brand: 'CARAT COUTURE',
      discount: 'FLAT 45% OFF',
      tagline: 'Hallmarked 916',
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'Starting ₹12,990'
    },
    {
      id: 'bridal',
      category: 'bridal' as ProductCategory,
      title: 'Grand Bridal Trousseau',
      brand: 'ROYAL HEIRLOOM',
      discount: '50-70% OFF',
      tagline: 'Kundan & Polki Sets',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      priceNotice: 'VIP Making Charges Free'
    },
    {
      id: 'coins',
      category: 'coins' as ProductCategory,
      title: '24K 999 Pure Gold Coins',
      brand: 'NAXTTO BULLION',
      discount: 'ZERO MAKING CHARGES',
      tagline: 'Tamper-Proof Certi-Card',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
      priceNotice: '1g, 5g, 10g, 50g'
    }
  ];

  return (
    <section id="myntra-wow-deals-section" className="w-full bg-[#fdfaf3] py-8 sm:py-12 border-b border-[#eaeaec]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* WOW DEALS Header directly inspired by the screenshot */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#ec4899] drop-shadow-xs font-sans">
                WOW DEALS
              </span>
              <span className="text-2xl sm:text-3xl animate-bounce">🤩</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#282c3f] mt-1 flex items-center gap-1 cursor-pointer hover:text-[#ff3e6c]" onClick={onExploreCatalog}>
              <span>Big Brands, Even Bigger Savings</span>
              <ChevronRight className="w-4 h-4 text-[#ff3e6c]" />
            </p>
          </div>

          <button
            onClick={onExploreCatalog}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff3e6c] hover:text-[#e02d5b] bg-white px-4 py-2 rounded-full border border-[#ff3e6c]/30 shadow-xs hover:shadow transition-all"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => onSelectCategory(deal.category)}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-[#eaeaec] hover:border-[#ff3e6c] hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image with Deal Pill */}
              <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-[#ff3e6c] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded shadow-sm tracking-wide">
                  {deal.discount}
                </div>
              </div>

              {/* Text Meta */}
              <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between bg-white text-left">
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-[#7e818c] tracking-wider truncate">
                    {deal.brand}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#282c3f] truncate group-hover:text-[#ff3e6c] transition-colors">
                    {deal.title}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#03a685]">
                    {deal.priceNotice}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff3e6c] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
