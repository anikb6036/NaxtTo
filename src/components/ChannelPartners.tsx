import React from 'react';

export interface ChannelPartnerItem {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  imgClass?: string;
}

export const CHANNEL_PARTNERS: ChannelPartnerItem[] = [
  // Row 1
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'E-Commerce Marketplace',
    logoUrl: '/partners/amazon_icon.svg',
    imgClass: 'h-8 sm:h-10 max-w-[75%] object-contain',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    category: 'Fashion & Online Luxury',
    logoUrl: '/partners/ajio.svg',
    imgClass: 'h-7 sm:h-8 max-w-[85%] object-contain',
  },

  // Row 2
  {
    id: 'pantaloons',
    name: 'Pantaloons',
    category: 'Aditya Birla Fashion',
    logoUrl: '/partners/pantaloons_card.svg',
    imgClass: 'h-8 sm:h-10 max-w-[90%] object-contain',
  },
  {
    id: 'flipkart-bag',
    name: 'Flipkart',
    category: 'E-Commerce Marketplace',
    logoUrl: '/partners/flipkart_bag.svg',
    imgClass: 'h-9 sm:h-11 max-w-[75%] object-contain',
  },
  {
    id: 'ferns-n-petals',
    name: 'Ferns N Petals',
    category: 'Gifting & Fine Accessories',
    logoUrl: '/partners/fnp_classic.svg',
    imgClass: 'h-8 sm:h-9 max-w-[90%] object-contain',
  },
  {
    id: 'nykaa-beauty',
    name: 'Nykaa',
    category: 'Beauty & Lifestyle',
    logoUrl: '/partners/nykaa.svg',
    imgClass: 'h-7 sm:h-8 max-w-[85%] object-contain',
  },
  {
    id: 'amazon-now',
    name: 'Amazon Now',
    category: 'Quick Commerce Marketplace',
    logoUrl: '/partners/amazon_now.svg',
    imgClass: 'h-7 sm:h-8 max-w-[90%] object-contain',
  },

  // Row 3
  {
    id: 'bigbasket',
    name: 'bigbasket',
    category: 'A TATA Enterprise',
    logoUrl: '/partners/bigbasket.svg',
    imgClass: 'h-7 sm:h-8 max-w-[90%] object-contain',
  },
  {
    id: 'blinkit',
    name: 'blinkit',
    category: '10-Minute Delivery',
    logoUrl: '/partners/blinkit.svg',
    imgClass: 'h-8 sm:h-10 max-w-[85%] object-contain',
  },
  {
    id: 'flipkart-minutes',
    name: 'Flipkart Minutes',
    category: 'Instant Quick Commerce',
    logoUrl: '/partners/flipkart_minutes.png',
    imgClass: 'h-9 sm:h-11 max-w-[85%] object-contain',
  },
  {
    id: 'instamart',
    name: 'Swiggy Instamart',
    category: 'Instant Quick Commerce',
    logoUrl: '/partners/instamart.svg',
    imgClass: 'h-8 sm:h-10 max-w-[85%] object-contain',
  },
  {
    id: 'k-brand',
    name: 'Ketch',
    category: 'Fashion & Retail Partner',
    logoUrl: '/partners/ketch.svg',
    imgClass: 'h-9 sm:h-11 max-w-[75%] object-contain',
  },
  {
    id: 'myntra-full',
    name: 'Myntra',
    category: 'Fashion & Lifestyle',
    logoUrl: '/partners/myntra_full.svg',
    imgClass: 'h-8 sm:h-9 max-w-[85%] object-contain',
  },

  // Row 4
  {
    id: 'zepto',
    name: 'zepto',
    category: '10-Minute Instant Delivery',
    logoUrl: '/partners/zepto.svg',
    imgClass: 'h-6 sm:h-7 max-w-[80%] object-contain',
  },
];

export const ChannelPartners: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section
      id="channel-partners-section"
      className={`w-full bg-[#f2f2f3] py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-gray-300/70 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching reference layout */}
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e293b] tracking-tight">
            Channel Partners
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Official retail, fashion marketplace &amp; quick-commerce fulfilment networks
          </p>
        </div>

        {/* 21 Channel Partner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CHANNEL_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              title={`${partner.name} - ${partner.category}`}
              className="bg-white rounded-lg p-2.5 sm:p-3.5 h-16 sm:h-20 flex items-center justify-center border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
            >
              <div className="w-full h-full flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
                <img
                  src={partner.logoUrl}
                  alt={`${partner.name} official logo`}
                  className={partner.imgClass || 'max-h-10 sm:max-h-12 max-w-[85%] object-contain'}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
