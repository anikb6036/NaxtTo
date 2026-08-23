import React from 'react';
import heroBgClean from '../assets/images/jewelry_presentation_clean_1787140244643.jpg';
import { ProductCategory } from '../types';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onSelectCategory?: (category: ProductCategory) => void;
  onExploreJournal?: () => void;
  onOpenPdfCatalogue?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onSelectCategory,
  onExploreJournal,
  onOpenPdfCatalogue
}) => {
  return (
    <section 
      id="hero-presentation-section"
      className="relative w-full aspect-[16/9] min-h-[500px] max-h-[92vh] overflow-hidden bg-[#c5a17e] select-none flex flex-col justify-between"
    >
      {/* 1. Exact High-Resolution Presentation Background Image */}
      <img
        src={heroBgClean}
        alt="Brown Aesthetic Minimalist Jewelry Presentation"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle Soft Studio Ambient Lighting Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

      {/* Top Spacer */}
      <div className="relative z-10 w-full pt-6 sm:pt-10 md:pt-14 px-6 sm:px-12 md:px-16 flex items-center justify-between pointer-events-auto">
        <div className="opacity-0">.</div>
      </div>

      {/* 2. Main Centered Typography Composition (Est. 2026 / Jewelry / By Emily Dawson) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center text-center my-auto -mt-2 sm:-mt-4">
        {/* Top: Est. 2026 */}
        <div className="mb-0 sm:mb-1">
          <p 
            className="text-white font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[48px] tracking-[0.03em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
            style={{ 
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontStyle: 'normal'
            }}
          >
            Єst. 2026
          </p>
        </div>

        {/* Center: "Jewelry" Giant Display Wordmark with High-Fashion Editorial Serifs */}
        <h1 
          className="text-white font-serif font-normal text-[82px] sm:text-[120px] md:text-[160px] lg:text-[210px] xl:text-[250px] leading-[0.88] tracking-tight my-0 sm:my-1 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          style={{ 
            fontFamily: "'Italiana', 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif",
            textShadow: '0 4px 28px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.6)'
          }}
          onClick={onExploreCatalog}
          title="Click to explore the collection"
        >
          Jewelry
        </h1>

        {/* Bottom Subtitle: By Emily Dawson */}
        <div className="mt-1 sm:mt-2">
          <p 
            className="text-white font-serif text-xl sm:text-2xl md:text-3xl lg:text-[38px] tracking-[0.03em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
            style={{ 
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontStyle: 'normal'
            }}
          >
            By Emily Dawson
          </p>
        </div>
      </div>

      {/* 3. Bottom Two-Column Paragraphs (Exact Placement & Text Alignment) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pb-6 sm:pb-8 md:pb-12 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10 lg:gap-24 text-white/95 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-sans font-light leading-[1.65] drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {/* Left Column Text */}
          <div className="text-left">
            <p className="max-w-[460px] tracking-wide">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            </p>
          </div>

          {/* Right Column Text */}
          <div className="text-left md:text-right flex justify-start md:justify-end">
            <p className="max-w-[460px] tracking-wide">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
