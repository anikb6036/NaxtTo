import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { ProductCategory, HeroBannerSlide } from '../types';
import { BankOfferLogos } from './BankOfferLogos';

import bannerPaydayModel from '../assets/images/payday_hero_model_1788375869668.jpg';
import bannerSakhaPola from '../assets/images/sakha_pola_banner_1789477939234.jpg';
import bannerBengaliBridal from '../assets/images/bengali_bridal_bangles_1789477964190.jpg';
import bannerLohaBadhano from '../assets/images/loha_badhano_banner_1789477986635.jpg';

export interface HeroSectionProps {
  slides?: HeroBannerSlide[];
  onExploreCatalog: () => void;
  onSelectCategory?: (category: ProductCategory) => void;
  onExploreJournal?: () => void;
  onOpenPdfCatalogue?: () => void;
}

export const DEFAULT_HERO_SLIDES: HeroBannerSlide[] = [
  {
    id: 'slide-payday',
    image: bannerPaydayModel,
    title: 'FLAT 20% OFF',
    subtitle: 'Additional 5% Cashback on Silver Jewellery',
    badge: 'SALE',
    couponCode: 'PAYDAY',
    buttonText: 'SHOP NOW',
    note: '*T&C APPLY',
    bgGradient: 'from-[#eb2377] via-[#e61d72] to-[#c7135e]',
    accentColor: '#FFFFFF',
    type: 'payday',
    targetCategory: 'all',
    active: true
  },
  {
    id: 'slide-sakha-pola',
    image: bannerSakhaPola,
    title: '22K GOLD BADHANO',
    subtitle: 'Handcrafted Shankha & Coral Pola with Certified Hallmark Gold',
    badge: 'Royal Bengali Heritage',
    buttonText: 'SHOP GOLD BADHANO',
    note: '*100% BIS HALLMARK CERTIFIED',
    bgGradient: 'from-[#320612] via-[#24030d] to-[#1a0108]',
    accentColor: '#FFD700',
    type: 'sakha-pola',
    targetCategory: 'gold-badhano',
    active: true
  },
  {
    id: 'slide-bridal-combos',
    image: bannerBengaliBridal,
    title: 'Bridal Shankha Pola',
    subtitle: 'The sacred tradition of Bengali matrimony crafted with pure conch shell, coral & 22K gold',
    badge: 'Bengali Wedding Special',
    buttonText: 'EXPLORE BRIDAL COMBOS',
    note: 'Certified Artisan Craft',
    bgGradient: 'from-[#2e0510] via-[#20020a] to-[#180107]',
    accentColor: '#FFFFFF',
    type: 'bridal-combos',
    targetCategory: 'bridal-combos',
    active: true
  },
  {
    id: 'slide-loha-badhano',
    image: bannerLohaBadhano,
    title: 'Artisan Loha Badhano',
    subtitle: 'Pure iron core bound in 22K hallmarked gold filigree with matching handcrafted Pola',
    badge: 'Auspicious Protection',
    buttonText: 'SHOP LOHA BADHANO',
    note: 'Pure 22K Hallmarked Filigree',
    bgGradient: 'from-[#340715] via-[#23030d] to-[#190208]',
    accentColor: '#FFAEC0',
    type: 'loha-badhano',
    targetCategory: 'loha-badhano',
    active: true
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
  slides,
  onExploreCatalog,
  onSelectCategory
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeSlides = (slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES).filter(
    (s) => s.active !== false
  );
  const safeSlides = activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_SLIDES;

  // Ensure currentSlide is within bounds if count changes
  useEffect(() => {
    if (currentSlide >= safeSlides.length) {
      setCurrentSlide(0);
    }
  }, [safeSlides.length, currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % safeSlides.length);
  }, [safeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  }, [safeSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleSlideClick = (slide: HeroBannerSlide) => {
    if (slide.targetCategory && onSelectCategory) {
      onSelectCategory(slide.targetCategory);
    } else {
      onExploreCatalog();
    }
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
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
        {safeSlides.map((slide, index) => {
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
                  alt={slide.title || 'Fine Jewellery Hero Banner'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Slide 0: STARTING ON-MODE PHOTO - FLAT 20% OFF / PAYDAY SALE */}
              {slide.type === 'payday' ? (
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-between pointer-events-none">
                  {/* Subtle Background Watermark: SALE */}
                  <div
                    className="absolute top-6 sm:top-10 left-[28%] sm:left-[32%] text-[#ff80a5]/25 font-black text-3xl sm:text-5xl md:text-6xl tracking-widest pointer-events-none select-none uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {slide.badge || 'SALE'}
                  </div>

                  {/* Left Content Column */}
                  <div className="max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-start text-left pointer-events-auto z-30">
                    {/* Big bold headline */}
                    <h1
                      className="text-white font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] drop-shadow-md"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Pill Coupon Code */}
                    {slide.couponCode && (
                      <div className="mt-3 sm:mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(e, slide.couponCode || 'PAYDAY')}
                          className="inline-flex items-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                          title={`Click to copy CODE: ${slide.couponCode}`}
                        >
                          <span>CODE : {slide.couponCode}</span>
                          {copiedCode && (
                            <span className="text-[11px] font-semibold text-emerald-200">✓ COPIED</span>
                          )}
                        </button>

                        {/* Small decorative sparkle */}
                        <SparkleStar color="#1A1816" size={16} className="hidden sm:inline-block" />
                      </div>
                    )}

                    {/* Cashback Subtitle */}
                    {slide.subtitle && (
                      <p className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide mt-2.5 sm:mt-3 drop-shadow-xs">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Shop Now Action Button */}
                    <button
                      type="button"
                      onClick={() => handleSlideClick(slide)}
                      className="mt-4 sm:mt-6 px-8 sm:px-10 py-2.5 sm:py-3 bg-white hover:bg-[#fff0f4] text-[#E61D72] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {slide.buttonText || 'SHOP NOW'}
                    </button>

                    {/* *T&C APPLY */}
                    {slide.note && (
                      <div className="absolute bottom-3 sm:bottom-4 left-6 sm:left-12 md:left-16 text-[9px] sm:text-[10px] text-white/75 tracking-wider font-medium uppercase pointer-events-none">
                        {slide.note}
                      </div>
                    )}
                  </div>

                  {/* Right Side Visual Accents */}
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

                    <div className="mt-8 mr-2">
                      <SparkleStar color="#ffffff" size={24} />
                    </div>
                  </div>
                </div>
              ) : slide.type === 'sakha-pola' ? (
                /* Slide 1: Bengali Sakha Pola - 22K Gold Badhano */
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-center items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/85 via-[#24030d]/50 to-[#24030d]/30 pointer-events-none" />

                  <div className="relative z-30 flex flex-col items-center">
                    {slide.badge && (
                      <p
                        className="text-[#ffdbe4] text-2xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-md"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {slide.badge}
                      </p>
                    )}

                    <h2
                      className="text-white font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight mt-1 sm:mt-2 drop-shadow-lg"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {slide.title}
                    </h2>

                    {slide.subtitle && (
                      <p className="text-white/95 text-xs sm:text-sm md:text-base font-medium tracking-wide mt-1 drop-shadow-xs max-w-lg">
                        {slide.subtitle}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSlideClick(slide)}
                      className="mt-4 sm:mt-6 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-[#fff0f4] text-[#E61D72] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {slide.buttonText || 'SHOP GOLD BADHANO'}
                    </button>

                    {slide.note && (
                      <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 text-[9px] sm:text-[10px] text-white/70 tracking-wider font-light uppercase">
                        {slide.note}
                      </div>
                    )}
                  </div>
                </div>
              ) : slide.type === 'bridal-combos' ? (
                /* Slide 2: Bengali Bridal Shankha Pola */
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/90 via-[#24030d]/50 to-transparent pointer-events-none" />

                  <div className="relative z-30 max-w-lg">
                    {slide.badge && (
                      <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#ff3e6c]/25 border border-[#ff3e6c]/40 text-[#ffadc2] text-[11px] font-bold uppercase tracking-wider">
                        {slide.badge}
                      </span>
                    )}
                    <h2
                      className="text-white font-serif font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide drop-shadow-lg"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {slide.title}
                    </h2>

                    {slide.subtitle && (
                      <p className="text-white/95 font-light text-sm sm:text-base md:text-lg tracking-wide mt-2 sm:mt-3 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSlideClick(slide)}
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-[#fff0f4] text-[#E61D72] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {slide.buttonText || 'EXPLORE BRIDAL COMBOS'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Slide 3 (Artisanal Loha Badhano) or Custom Editorial Banner */
                <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 flex flex-col justify-center items-start text-left">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#24030d]/90 via-[#24030d]/50 to-transparent pointer-events-none" />

                  <div className="relative z-30 max-w-lg">
                    {slide.badge && (
                      <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#ffd700]/25 border border-[#ffd700]/40 text-[#ffe57f] text-[11px] font-bold uppercase tracking-wider">
                        {slide.badge}
                      </span>
                    )}
                    <h2
                      className="text-white font-serif font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide drop-shadow-lg"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {slide.title}
                    </h2>

                    {slide.subtitle && (
                      <p className="text-white/95 font-light text-sm sm:text-base md:text-lg tracking-wide mt-2 sm:mt-3 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSlideClick(slide)}
                      className="mt-5 sm:mt-7 px-7 sm:px-9 py-2 sm:py-2.5 bg-white hover:bg-[#fff0f4] text-[#E61D72] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {slide.buttonText || 'EXPLORE COLLECTION'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Previous & Next Navigation Arrows - Magenta Circles */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8f0d3a]/85 hover:bg-[#a61145] text-white flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8f0d3a]/85 hover:bg-[#a61145] text-white flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Side Action Buttons */}
        <div className="absolute right-3 sm:right-5 bottom-8 sm:bottom-10 z-20 flex flex-col gap-2 items-center">
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
        </div>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
          {safeSlides.map((slide, idx) => (
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
            {/* Real Bank Logos */}
            <BankOfferLogos />

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
