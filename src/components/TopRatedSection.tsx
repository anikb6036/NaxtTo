import React from 'react';
import { ChevronRight, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface TopRatedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onExploreCatalog: () => void;
  currencySymbol: string;
}

export const TopRatedSection: React.FC<TopRatedSectionProps> = ({
  products,
  onSelectProduct,
  onSelectCategory,
  onExploreCatalog,
  currencySymbol
}) => {
  // Select 4-6 top-rated items
  const topItems = products.slice(0, 6);

  const curatedCollections = [
    {
      title: 'Solid Gold Chains',
      subtitle: "Don't Miss",
      price: 'From ₹4,990',
      category: 'necklaces' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      badge: 'Bestseller'
    },
    {
      title: 'Solitaire Studs',
      subtitle: 'Flat 35% Off',
      price: 'From ₹7,490',
      category: 'earrings' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
      badge: 'Top Pick'
    },
    {
      title: 'Tennis Bracelets',
      subtitle: 'Popular',
      price: 'From ₹12,990',
      category: 'bracelets' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1611591475155-4284ec9c0e7f?auto=format&fit=crop&w=400&q=80',
      badge: 'Trending'
    },
    {
      title: 'Bridal Chokers',
      subtitle: 'Milan Atelier',
      price: 'From ₹18,990',
      category: 'fine-collections' as ProductCategory,
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=400&q=80',
      badge: 'Heritage'
    }
  ];

  return (
    <section 
      id="top-rated-section" 
      aria-label="Top Rated Jewellery" 
      className="w-full bg-[#f1f2f4] py-2 sm:py-3"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-lg border border-[#e5e5ea] p-4 sm:p-5 shadow-xs">
          {/* Header Row (Flipkart Style: Title + VIEW ALL Button) */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2874f0]/10 flex items-center justify-center text-[#2874f0]">
                <Star className="w-4 h-4 fill-[#2874f0]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#212121]">
                  Top Rated in Fine Jewellery
                </h3>
                <p className="text-xs text-[#878787] hidden sm:block">
                  Certified 18K Hallmarked pieces trusted by 10,000+ patrons
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectCategory('all');
                onExploreCatalog();
              }}
              className="px-3.5 py-1.5 bg-[#2874f0] hover:bg-[#1259c7] text-white text-xs font-bold rounded-sm shadow-xs transition-colors flex items-center gap-1 shrink-0"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Curated Grid of 4 Cards (Matches Video 0:04-0:06) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {curatedCollections.map((col, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectCategory(col.category);
                  onExploreCatalog();
                }}
                className="group border border-[#e8e8ed] hover:border-[#2874f0] rounded-md p-3 sm:p-4 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md bg-[#fafafa] hover:bg-white"
              >
                {/* Image */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 mb-3 rounded-md overflow-hidden bg-white relative flex items-center justify-center">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#388e3c] text-white text-[9px] font-bold rounded-xs shadow-2xs">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
