import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCategory } from '../types';

import bannerLoveSilver from '../assets/images/banner_love_silver_1788375478655.jpg';
import bannerSilverAnklets from '../assets/images/banner_silver_anklets_1788375493949.jpg';
import bannerFreshDrops from '../assets/images/banner_fresh_drops_1788375506896.jpg';
import bannerPaydaySale from '../assets/images/banner_payday_sale_1788375522139.jpg';

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
  type: 'sale-50' | 'anklets' | 'fresh-drops' | 'payday';
  targetCategory?: ProductCategory;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    image: bannerLoveSilver,
    bgGradient: 'from-[#320612] via-[#24030d] to-[#1a0108]',
    accentColor: '#FF6000',
    type: 'sale-50',
    targetCategory: 'all'
  },
  {
    id: 1,
    image: bannerSilverAnklets,
    bgGradient: 'from-[#2e0510] via-[#20020a] to-[#180107]',
    accentColor: '#FFFFFF',
    type: 'anklets',
    targetCategory: 'bracelets'
  },
  {
    id: 2,
    image: bannerFreshDrops,
    bgGradient: 'from-[#340715] via-[#23030d] to-[#190208]',
    accentColor: '#FFAEC0',
    type: 'fresh-drops',
    targetCategory: 'necklaces'
  },
  {
    id: 3,
    image: bannerPaydaySale,
    bgGradient: 'from-[#ff6b93] via-[#fa487a] to-[#e62961]',
    accentColor: '#FFFFFF',
    type: 'payday',
    targetCategory: 'all'
  }
];

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
    }, 4500);
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
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[480px] xl:h-[520px] max-h-[580px]">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image & Ambient Gradients */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt="Fine Silver Jewellery Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {/* Visual Enhancement Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    slide.type === 'payday'
                      ? 'from-pink-600/60 via-pink-500/20 to-transparent'
                      : 'from-[#24030d]/85 via-[#24030d]/45 to-[#24030d]/20'
                  }`}
                />
              </div>

              {/* Slide 1: Love for Silver / UPTO 50% OFF */}
              {slide.type === 'sale-50' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center items-center text-center">
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
                    className="mt-4 sm:mt-6 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-[#fff0f4] text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    SHOP NOW
                  </button>

                  <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 text-[9px] sm:text-[10px] text-white/60 tracking-wider font-light uppercase">
                    *T&C APPLY
                  </div>
                </div>
              )}

              {/* Slide 2: Anklets / Walk in the charm of silver */}
              {slide.type === 'anklets' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="max-w-md">
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
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      EXPLORE ANKLETS
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 3: Fresh Drops / Silver feels... recently upgraded */}
              {slide.type === 'fresh-drops' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="max-w-lg">
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
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white/95 hover:bg-white text-[#1d1d1f] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      SHOP NEW ARRIVALS
                    </button>
                  </div>
                </div>
              )}

              {/* Slide 4: FLAT 20% OFF / PAY DAY SALE */}
              {slide.type === 'payday' && (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center items-start text-left">
                  <div className="max-w-lg">
                    <h2
                      className="text-white font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight drop-shadow-lg"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      FLAT 20% OFF
                    </h2>

                    <div className="flex items-center gap-2 mt-2 sm:mt-3">
                      <div
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/60 text-white text-xs sm:text-sm font-bold tracking-wider cursor-pointer transition-colors"
                        title="Click to copy promo code"
                      >
                        <span>CODE : PAYDAY</span>
                        {copiedCode && <span className="text-[10px] text-emerald-200">✓ COPIED</span>}
                      </div>
                    </div>

                    <p className="text-white/95 text-xs sm:text-sm md:text-base font-medium tracking-wide mt-2 drop-shadow-xs">
                      Additional 5% Cashback on Silver Jewellery
                    </p>

                    <button
                      onClick={() => handleSlideClick(slide)}
                      className="mt-4 sm:mt-6 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-white/95 text-[#e62961] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      SHOP NOW
                    </button>

                    <div className="absolute bottom-3 sm:bottom-4 left-6 sm:left-12 md:left-16 text-[9px] sm:text-[10px] text-white/70 tracking-wider font-light uppercase">
                      *T&C APPLY
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Previous & Next Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-xs transition-all duration-200"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-xs transition-all duration-200"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Pagination Dots Matching Exact Design in Video */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 sm:w-8 h-1.5 sm:h-2 rounded-full bg-white shadow-xs'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/45 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
