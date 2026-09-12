import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { ProductCategory } from '../types';

import bannerPaydayModel from '../assets/images/payday_hero_model_1788375869668.jpg';
import bannerLoveSilver from '../assets/images/banner_love_silver_1788375478655.jpg';
import bannerSilverAnklets from '../assets/images/banner_silver_anklets_1788375493949.jpg';
import bannerFreshDrops from '../assets/images/banner_fresh_drops_1788375506896.jpg';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onSelectCategory?: (category: ProductCategory) => void;
  onExploreJournal?: () => void;
  onOpenPdfCatalogue?: () => void;
}

interface SlideData {
  id: number;
  image: string;
  bgGradient: string;
  accentColor: string;
  type: 'payday' | 'sale-50' | 'anklets' | 'fresh-drops';
  targetCategory?: ProductCategory;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    image: bannerPaydayModel,
    bgGradient: 'from-[#eb2377] via-[#e61d72] to-[#c7135e]',
    accentColor: '#FFFFFF',
    type: 'payday',
    targetCategory: 'all'
  },
  {
    id: 1,
    image: bannerLoveSilver,
    bgGradient: 'from-[#320612] via-[#24030d] to-[#1a0108]',
    accentColor: '#FF6000',
    type: 'sale-50',
    targetCategory: 'all'
  },
  {
    id: 2,
    image: bannerSilverAnklets,
    bgGradient: 'from-[#2e0510] via-[#20020a] to-[#180107]',
    accentColor: '#FFFFFF',
    type: 'anklets',
    targetCategory: 'bracelets'
  },
  {
    id: 3,
    image: bannerFreshDrops,
    bgGradient: 'from-[#340715] via-[#23030d] to-[#190208]',
    accentColor: '#FFAEC0',
    type: 'fresh-drops',
    targetCategory: 'necklaces'
  }
];

// Reusable 4-point star sparkle component matching the user's reference image
const SparkleStar: React.FC<{ className?: string; color?: string; size?: number }> = ({
  className = '',
  color = 'currentColor',
  size = 18
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`inline-block ${className}`}
  >
    <path
      d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z"
      fill={color}
    />
  </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onSelectCategory
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleSlideClick = (slide: SlideData) => {
    if (slide.targetCategory && onSelectCategory) {
      onSelectCategory(slide.targetCategory);
    } else {
      onExploreCatalog();
    }
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('PAYDAY');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section
      id="hero-banner-carousel"
      className="relative w-full overflow-hidden bg-[#1A1816] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Aspect Ratio Container for Wide Commercial Luxury Banner */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[460px] lg:h-[500px] xl:h-[540px] max-h-[580px]">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt="Fine Silver Jewellery Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Slide 0: STARTING ON-MODE PHOTO - FLAT 20% OFF / PAYDAY SALE */}
              {slide.type === 'payday' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-between pointer-events-none">
                  {/* Subtle Background Watermark: SALE */}
                  <div
                    className="absolute top-6 sm:top-10 left-[28%] sm:left-[32%] text-[#ff80a5]/25 font-black text-3xl sm:text-5xl md:text-6xl tracking-widest pointer-events-none select-none uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    SALE
                  </div>

                  {/* Left Content Column */}
                  <div className="max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-start text-left pointer-events-auto z-30">
                    {/* Big bold headline */}
                    <h1
                      className="text-white font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] drop-shadow-md"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      FLAT 20% OFF
                    </h1>

                    {/* Pill Coupon Code */}
                    <div className="mt-3 sm:mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                        title="Click to copy CODE: PAYDAY"
                      >
                        <span>CODE : PAYDAY</span>
                        {copiedCode && (
                          <span className="text-[11px] font-semibold text-emerald-200">✓ COPIED</span>
                        )}
                      </button>

                      {/* Small decorative sparkle */}
                      <SparkleStar color="#1A1816" size={16} className="hidden sm:inline-block" />
                    </div>

                    {/* Cashback Subtitle */}
                    <p className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide mt-2.5 sm:mt-3 drop-shadow-xs">
                      Additional 5% Cashback on Silver Jewellery
                    </p>

                    {/* Shop Now Action Button */}
                    <button
                      type="button"
                      onClick={() => handleSlideClick(slide)}
                      className="mt-4 sm:mt-6 px-8 sm:px-10 py-2.5 sm:py-3 bg-white hover:bg-[#fff0f4] text-[#E61D72] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      SHOP NOW
                    </button>

                    {/* *T&C APPLY */}
                    <div className="absolute bottom-3 sm:bottom-4 left-6 sm:left-12 md:left-16 text-[9px] sm:text-[10px] text-white/75 tracking-wider font-medium uppercase pointer-events-none">
                      *T&C APPLY
                    </div>
                  </div>

                  {/* Right Side Visual Accents: "HOT NOW" and Sparkles */}
                  <div className="hidden md:flex flex-col items-end text-right z-30 pointer-events-none pr-4 lg:pr-12">
                    <div className="flex items-center gap-2">
                      <SparkleStar color="#ffffff" size={16} />
                      <div className="text-[#1A1816] font-black text-2xl lg:text-3xl tracking-tight uppercase leading-none">
                        HOT
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="text-[#1A1816] font-black text-2xl lg:text-3xl tracking-tight uppercase leading-none">
                        NOW
                      </div>
                      <SparkleStar color="#1A1816" size={20} />
                    </div>

                    {/* Floating White Sparkle Star */}
                    <div className="mt-8 mr-2">
                      <SparkleStar color="#ffffff" size={24} />
                    </div>
                  </div>

                  {/* Faint Watermark at bottom right: OFFERS */}
                  <div
                    className="hidden lg:block absolute bottom-6 right-16 text-[#ff80a5]/25 font-black text-3xl tracking-widest pointer-events-none select-none uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    OFFERS
                  </div>

                  {/* Lower left floating sparkle stars */}
                  <div className="absolute bottom-16 left-[27%] hidden md:block pointer-events-none">
                    <SparkleStar color="#1A1816" size={18} />
                  </div>
                  <div className="absolute bottom-10 left-[30%] hidden md:block pointer-events-none">
                    <SparkleStar color="#ffffff" size={22} />
                  </div>
                </div>
              )}

              {/* Slide 1: Love for Silver / UPTO 50% OFF */}
              {slide.type === 'sale-50' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/85 via-[#24030d]/45 to-[#24030d]/20 pointer-events-none" />

                  <div className="relative z-30 flex flex-col items-center">
                    <p
                      className="text-[#ffdbe4] text-2xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-md"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Love for Silver
                    </p>

                    <h2
                      className="text-white font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight mt-1 sm:mt-2 drop-shadow-lg"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      UPTO 50% OFF
                    </h2>

                    <p className="text-white/95 text-xs sm:text-sm md:text-base font-normal tracking-wide mt-1 drop-shadow-xs">
                      on Silver Jewellery
                    </p>

                    <button
                      onClick={() => handleSlideClick(slide)}
                      className="mt-4 sm:mt-6 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-[#fff0f4] text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      SHOP NOW
                    </button>

                    <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 text-[9px] sm:text-[10px] text-white/60 tracking-wider font-light uppercase">
                      *T&C APPLY
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Anklets / Walk in the charm of silver */}
              {slide.type === 'anklets' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/85 via-[#24030d]/45 to-[#24030d]/20 pointer-events-none" />

                  <div className="relative z-30 max-w-md">
                    <h2
                      className="text-white font-serif font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide drop-shadow-lg"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Anklets
                    </h2>

                    <p className="text-white/95 font-light text-sm sm:text-lg md:text-xl tracking-wide mt-2 sm:mt-3 drop-shadow-md">
                      Walk in the charm of silver
                    </p>

                    <button
                      onClick={() => handleSlideClick(slide)}
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      EXPLORE ANKLETS
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 3: Fresh Drops / Silver feels... recently upgraded */}
              {slide.type === 'fresh-drops' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/85 via-[#24030d]/45 to-[#24030d]/20 pointer-events-none" />

                  <div className="relative z-30 max-w-lg">
                    <h2
                      className="text-white font-serif font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide drop-shadow-lg"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Fresh Drops
                    </h2>

                    <p className="text-white/95 font-light text-sm sm:text-lg md:text-xl tracking-wide mt-2 sm:mt-3 drop-shadow-md">
                      Silver feels... recently upgraded
                    </p>

                    <button
                      onClick={() => handleSlideClick(slide)}
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      SHOP NEW ARRIVALS
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Previous & Next Navigation Arrows - Magenta Circles matching Reference Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8f0d3a]/85 hover:bg-[#a61145] text-white flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8f0d3a]/85 hover:bg-[#a61145] text-white flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Side Action Buttons Matching Reference Image */}
        <div className="absolute right-3 sm:right-5 bottom-8 sm:bottom-10 z-40 flex flex-col gap-2 items-center">
          {/* Quick Category Grid Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreCatalog();
            }}
            aria-label="Browse All Collections"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#282c3f] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-100"
            title="Browse All Collections"
          >
            <LayoutGrid className="w-4 h-4 text-[#282c3f]" />
          </button>

          {/* Quick Assist Pill Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            aria-label="Audio Assist"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#1a73e8] text-[#1a73e8] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Accessibility / Audio Support"
          >
            <span className="w-3.5 h-3.5 rounded-full border border-[#1a73e8] flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />
            </span>
          </button>
        </div>

        {/* Bottom Pagination Dots Matching Exact Design in Reference Image */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-9 sm:w-11 h-2.5 sm:h-3 rounded-full bg-white/20 border-2 border-white shadow-xs'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bank & Instant Discount Promo Strip */}
      <div className="bg-white border-t border-[#eaeaec] py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {/* Bank Logos */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-[#db0011] tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                <span className="w-3 h-3 bg-[#db0011] rounded-xs inline-block" />
                HSBC
              </span>
              <span className="flex items-center gap-1 font-bold text-[#0c2340] tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                <span className="text-[#008080] font-black">RBL</span>BANK
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 font-bold text-[#004c8f] tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                HDFC BANK
              </span>
            </div>

            <div className="h-4 w-px bg-gray-300 hidden sm:block" />

            <div className="font-bold text-[#282c3f] text-xs sm:text-sm flex items-center gap-1.5">
              <span>Get 10% Instant Discount*</span>
              <span className="text-[11px] font-normal text-[#535766]">on credit/debit cards &amp; No-Cost EMI</span>
            </div>
          </div>

          <div className="text-[11px] text-[#7e818c] font-medium ml-auto">
            T&amp;C Apply*
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
