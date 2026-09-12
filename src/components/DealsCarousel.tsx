import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface DealsCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
  onExploreCatalog: () => void;
}

export const DealsCarousel: React.FC<DealsCarouselProps> = ({
  onSelectCategory,
  onExploreCatalog
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 0,
      badge: '⚡ MINUTES EXPRESS',
      title: 'Get certified jewellery in MINUTES',
      subtitle: 'Express 24-Hour Dispatch • 100% BIS Hallmarked 18K & 22K',
      offer: 'UP TO 50% OFF',
      offerSub: 'On Solitaire Bands, Chokers & Anklets',
      cta: 'Shop Express',
      category: 'rings' as ProductCategory,
      bgGradient: 'from-[#3b1728] via-[#240816] to-[#12020a]',
      accentColor: '#ffaec0',
      tagline: 'Instant Delivery to Your Doorstep',
      bannerImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 1,
      badge: 'FESTIVE GOLD GALA',
      title: 'Save big on 18K Solid Gold & Solitaires',
      subtitle: 'Certified IGI & GIA Solitaires • Zero Deduction Gold Exchange',
      offer: 'FROM ₹2,990',
      offerSub: 'Hand-Planished by Milan & Antwerp Artisans',
      cta: 'Explore Gala',
      category: 'all' as ProductCategory,
      bgGradient: 'from-[#1c2e4a] via-[#101d32] to-[#080e1a]',
      accentColor: '#ffd700',
      tagline: 'Lowest Gold Price Guarantee',
      bannerImage: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 2,
      badge: 'PAYDAY GOLD RUSH',
      title: 'Solitaire Studs & Tennis Bracelets',
      subtitle: 'Instant 10% Bank Discount on HDFC, SBI & ICICI Cards',
      offer: 'FROM ₹1,499/MO*',
      offerSub: 'No-Cost EMI Available for up to 12 Months',
      cta: 'Claim Bank Offer',
      category: 'bracelets' as ProductCategory,
      bgGradient: 'from-[#2e1a47] via-[#1c0f2d] to-[#0f071a]',
      accentColor: '#c5a059',
      tagline: 'Bank Offer Ends Midnight',
      bannerImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const active = slides[currentSlide];

  return (
    <section 
      id="deals-banner-carousel"
      className="w-full bg-[#f1f2f4] py-3 sm:py-4 select-none"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative rounded-lg overflow-hidden shadow-sm border border-[#e5e5ea] bg-white">
          {/* Main Hero Slider Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[260px] sm:min-h-[300px] lg:min-h-[330px]">
            {/* Left Promo Card: "Get in MINUTES" (Flipkart Style Card) */}
            <div className="hidden lg:flex lg:col-span-3 bg-gradient-to-br from-[#ffeef2] via-[#fff5f7] to-[#fff] p-5 flex-col justify-between border-r border-[#f0e2e7] relative overflow-hidden">
              <div className="space-y-2 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#d32f2f] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-2xs">
                  <Zap className="w-3 h-3 fill-white" />
                  Minutes Delivery
                </span>
                <h4 className="font-bold text-lg text-[#212121] leading-tight pt-1">
                  Ready to Ship<br />Fine Jewellery
                </h4>
                <p className="text-xs text-[#616161]">
                  Dispatched in 24 hours with insured temperature-safe vault courier.
                </p>
              </div>

              <div className="my-3 z-10">
                <div className="p-3 bg-white/90 rounded-md border border-[#f5c6cb] shadow-2xs">
                  <p className="text-[10px] text-[#c2185b] font-bold uppercase tracking-wider">Spotlight Offer</p>
                  <p className="text-sm font-bold text-[#212121]">Flat 40% OFF</p>
                  <p className="text-[11px] text-[#757575]">On 18K Solid Gold Rings</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCategory('rings');
                  onExploreCatalog();
                }}
                className="w-full py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 z-10"
              >
                <span>Browse Express</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Decorative background glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffcdd2]/40 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Central Main Banner Slide */}
            <div 
              className={`col-span-1 lg:col-span-6 bg-gradient-to-r ${active.bgGradient} text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-700`}
            >
              {/* Top Row: Badge and Trust Indicator */}
              <div className="flex items-center justify-between z-10">
                <span 
                  className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-xs"
                  style={{ backgroundColor: active.accentColor, color: '#1a1a1a' }}
                >
                  {active.badge}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% BIS Certified</span>
                </div>
              </div>

              {/* Central Text & Offer */}
              <div className="my-4 sm:my-6 z-10 max-w-md">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                  {active.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/85 mt-2 font-sans line-clamp-2">
                  {active.subtitle}
                </p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: active.accentColor }}>
                    {active.offer}
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    {active.offerSub}
                  </span>
                </div>
              </div>

              {/* Action Button & Carousel Controls */}
              <div className="flex items-center justify-between z-10 pt-2">
                <button
                  onClick={() => {
                    onSelectCategory(active.category);
                    onExploreCatalog();
                  }}
                  className="px-6 py-2.5 bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] font-bold text-xs sm:text-sm rounded-md shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <span>{active.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Tagline */}
                <span className="text-xs text-white/70 italic hidden sm:inline">
                  {active.tagline}
                </span>
              </div>

              {/* Background decorative image with fade */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 lg:opacity-35 pointer-events-none overflow-hidden">
                <img
                  src={active.bannerImage}
                  alt={active.title}
                  className="w-full h-full object-cover object-center transform scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${active.bgGradient} to-transparent`} />
              </div>
            </div>

            {/* Right Promo Card: Bank Offers & Solitaire Deals (Flipkart Style Card) */}
            <div className="hidden lg:flex lg:col-span-3 bg-gradient-to-bl from-[#fffbee] via-[#fffdf5] to-[#fff] p-5 flex-col justify-between border-l border-[#faeec7] relative overflow-hidden">
              <div className="space-y-2 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f57c00] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-2xs">
                  <Sparkles className="w-3 h-3 fill-white" />
                  Bank & EMI Special
                </span>
                <h4 className="font-bold text-lg text-[#212121] leading-tight pt-1">
                  Solitaire Studs &<br />Diamond Pendants
                </h4>
                <p className="text-xs text-[#616161]">
                  From ₹1,499/month with No-Cost EMI on leading bank credit cards.
                </p>
              </div>

              <div className="my-3 z-10">
                <div className="p-3 bg-white/90 rounded-md border border-[#ffe082] shadow-2xs">
                  <p className="text-[10px] text-[#e65100] font-bold uppercase tracking-wider">Cardholder Bonus</p>
                  <p className="text-sm font-bold text-[#212121]">Instant 10% Off</p>
                  <p className="text-[11px] text-[#757575]">Max discount up to ₹3,500</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCategory('necklaces');
                  onExploreCatalog();
                }}
                className="w-full py-2 bg-[#f57c00] hover:bg-[#e65100] text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 z-10"
              >
                <span>View Bank Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Decorative background glow */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#ffe082]/30 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/90 hover:bg-white text-[#212121] rounded-r-md flex items-center justify-center shadow-md transition-all z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/90 hover:bg-white text-[#212121] rounded-l-md flex items-center justify-center shadow-md transition-all z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  currentSlide === idx 
                    ? 'w-6 h-1.5 bg-white shadow-xs' 
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
