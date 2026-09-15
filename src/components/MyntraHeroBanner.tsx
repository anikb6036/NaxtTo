import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, ArrowRight, Copy, Check } from 'lucide-react';
import happyJewelleryHero from '../assets/images/happy_jewellery_hero_1789043188213.jpg';
import { BankOfferLogos } from './BankOfferLogos';

interface MyntraHeroBannerProps {
  onSelectGender: (gender: 'men' | 'women') => void;
  onExploreCatalog: () => void;
}

// Sparkle Star matching reference
const SparkleStar: React.FC<{ className?: string; color?: string; size?: number }> = ({
  className = '',
  color = 'currentColor',
  size = 18
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={`inline-block ${className}`}
    style={{ transform: 'rotate(5deg)' }}
  >
    <path d="M12 0L14.2 8.8L23 11L14.2 13.2L12 22L9.8 13.2L1 11L9.8 8.8L12 0Z" />
  </svg>
);

export const MyntraHeroBanner: React.FC<MyntraHeroBannerProps> = ({
  onSelectGender,
  onExploreCatalog,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = 2;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('SHAKHA20').catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div id="myntra-hero-banner-section" className="w-full bg-[#fdfbf7] border-b border-[#eaeaec]">
      
      {/* Mega Hero Visual Frame: Bright, luminous, auspicious Bengali bridal atmosphere */}
      <div 
        className="relative w-full overflow-hidden bg-gradient-to-r from-[#fff5f7] via-[#fff1ea] to-[#fef6f0] min-h-[380px] sm:min-h-[440px] md:min-h-[480px] flex items-center justify-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Background Photo: Radiant Bengali bridal celebration */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
            alt="Authentic Sakha Pola & Bengali Bridal Bangles"
            className="w-full h-full object-cover object-[center_35%] filter brightness-105 contrast-102"
            referrerPolicy="no-referrer"
          />
          {/* Gentle luminous light wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-white/75 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* SLIDE 0: SAKHA POLA UTSAV WITH 22K GOLD BADHANO & SHANKHA */}
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 z-10 transition-opacity duration-500 ${
          currentSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'
        }`}>
          
          {/* LEFT 3D CALLOUT: SAKHA POLA UTSAV • AUTHENTIC BENGAL CRAFT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative inline-block cursor-pointer group" onClick={onExploreCatalog}>
              {/* 3D Badge Container with crimson gold festival glow */}
              <div className="bg-gradient-to-br from-[#c01a27] via-[#9e131e] to-[#6d0d15] text-white px-6 sm:px-8 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl shadow-[0_12px_32px_rgba(192,26,39,0.4)] border-2 border-amber-300/95 transform -rotate-1 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-1.5 justify-center md:justify-start mb-0.5">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-200">
                    Sacred Bengali Bridal Heritage
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                  SAKHA POLA<br />UTSAV
                </h1>
                
                {/* 100% PURE CONCH & 22K GOLD Pill Badge */}
                <div className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-amber-200/50">
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-100">
                    100% PURE CONCH &amp; BIS 22K GOLD
                  </span>
                </div>
              </div>
            </div>

            {/* Subtitle with high contrast */}
            <p className="mt-4 text-[#282c3f] bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border border-amber-200 font-bold text-xs sm:text-sm shadow-xs max-w-md">
              ✨ Hand-Carved Shankha • Coral Pola • Sacred Loha Badhano
            </p>
          </div>

          {/* CENTER: Bridal & Daily Wear Selection Pills */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 my-2">
            <button
              onClick={() => onExploreCatalog()}
              className="group flex items-center gap-2 bg-white hover:bg-[#fff9f9] text-[#282c3f] px-5 sm:px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-rose-200 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Bridal Shankha Sets</span>
              <span className="w-5 h-5 rounded-full bg-[#c01a27] text-white flex items-center justify-center text-xs group-hover:bg-amber-600 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => onExploreCatalog()}
              className="group flex items-center gap-2 bg-white hover:bg-[#fff9f9] text-[#282c3f] px-5 sm:px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-amber-300 font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>22K Gold Badhano</span>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs group-hover:bg-[#c01a27] transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* RIGHT CALLOUT: Handcrafted in Bengal */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-[0_10px_25px_rgba(192,26,39,0.15)]">
              <div className="relative">
                <div className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#c01a27] leading-none font-sans drop-shadow-xs">
                  FLAT 25<span className="text-2xl sm:text-4xl align-top">%</span>
                </div>
                <div className="text-lg sm:text-2xl font-black tracking-widest text-amber-700 uppercase">
                  OFF SETS
                </div>
              </div>

              <div className="mt-1 text-[#282c3f] font-bold text-xs sm:text-sm">
                Bowbazar Karigar Collection
              </div>

              <button
                onClick={onExploreCatalog}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c01a27] to-[#d4af37] hover:opacity-95 text-white px-5 py-2.5 rounded-md font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Shop Sakha Pola</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* SLIDE 1: AUSPICIOUS BRIDAL PROMO WITH COUPON */}
        <div className={`relative max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full py-8 sm:py-12 flex items-center justify-between z-10 transition-opacity duration-500 ${
          currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'
        }`}>
          
          {/* Left Content Column */}
          <div className="max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-start text-left z-30 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-rose-100/90 shadow-[0_12px_30px_rgba(192,26,39,0.15)]">
            {/* Big bold headline */}
            <h1
              className="text-[#c01a27] font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-[0.92] drop-shadow-xs"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              EXTRA 20% OFF
            </h1>

            {/* Pill Coupon Code */}
            <div className="mt-3 sm:mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full border-2 border-[#c01a27] bg-[#fff5f5] hover:bg-[#ffebeb] text-[#c01a27] text-xs sm:text-sm font-black tracking-wider transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                title="Click to copy CODE: SHAKHA20"
              >
                <span>CODE : SHAKHA20</span>
                {copiedCode ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> COPIED
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-[#c01a27]" />
                )}
              </button>

              <SparkleStar color="#d4af37" size={16} className="hidden sm:inline-block" />
            </div>

            {/* Subtitle */}
            <p className="text-[#282c3f] text-xs sm:text-sm md:text-base font-bold tracking-wide mt-3">
              🪞 Free Sizing Velvet Box &amp; BIS 916 Hallmark Certificate
            </p>

            {/* Shop Now Action Button */}
            <button
              type="button"
              onClick={onExploreCatalog}
              className="mt-4 sm:mt-6 px-8 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-[#c01a27] via-[#b01622] to-[#d4af37] hover:opacity-95 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              EXPLORE BRIDAL CATALOGUE
            </button>

            {/* *T&C APPLY */}
            <div className="mt-3 text-[9px] sm:text-[10px] text-[#7e818c] tracking-wider font-semibold uppercase">
              *All India Insured Express Courier • 100% Genuine Conch Shell Guaranteed
            </div>
          </div>

          {/* Right Side Visual Accents: "AUSPICIOUS" and Sparkles */}
          <div className="hidden md:flex flex-col items-end text-right z-30 pointer-events-none pr-4 lg:pr-12 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2">
              <SparkleStar color="#d4af37" size={18} />
              <div className="text-[#c01a27] font-black text-2xl lg:text-3xl tracking-tight uppercase leading-none">
                SACRED
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="text-[#c01a27] font-black text-2xl lg:text-3xl tracking-tight uppercase leading-none">
                BLESSINGS
              </div>
              <SparkleStar color="#c01a27" size={22} />
            </div>

            <div className="mt-4 text-[#d4af37] font-black text-xs tracking-widest uppercase">
              BENGAL KARIGARI
            </div>
          </div>

        </div>

        {/* Carousel Arrow Controls (Crisp, light & modern) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#e0144c] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.12)] border border-gray-200 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#e0144c] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.12)] border border-gray-200 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Carousel Pagination Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === 0
                ? 'w-7 h-2.5 bg-[#e0144c] shadow-sm'
                : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
            }`}
            aria-label="Slide 1"
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === 1
                ? 'w-7 h-2.5 bg-[#e0144c] shadow-sm'
                : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
            }`}
            aria-label="Slide 2"
          />
        </div>

      </div>

      {/* BANK OFFER STRIP (HSBC, RBL Bank, HDFC Bank, Get 10% Instant Discount*) */}
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

    </div>
  );
};

