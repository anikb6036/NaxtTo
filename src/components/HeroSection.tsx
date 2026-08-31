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
      className="relative w-full h-[75vh] min-h-[460px] max-h-[850px] sm:min-h-[540px] md:min-h-[620px] lg:min-h-[700px] overflow-hidden bg-[#c5a17e] select-none flex flex-col justify-between"
    >
      {/* 1. Exact High-Resolution Presentation Background Image */}
      <img
        src={heroBgClean}
        alt="Minimalist Fine Jewelry Presentation"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle Soft Studio Ambient Lighting Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/15 pointer-events-none" />

      {/* Top Spacer */}
      <div className="relative z-10 w-full pt-4 sm:pt-8 md:pt-12 px-4 sm:px-8 md:px-16 flex items-center justify-between pointer-events-auto">
        <div className="opacity-0">.</div>
      </div>

      {/* 2. Main Centered Typography Composition (Est. 2026 / Jewelry / By Emily Dawson) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-center text-center my-auto">
        {/* Top: Est. 2026 */}
        <div className="mb-0 sm:mb-1">
          <p 
            className="text-white font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.05em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
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
          className="text-white font-serif font-normal text-[52px] min-[400px]:text-[64px] sm:text-[100px] md:text-[140px] lg:text-[185px] xl:text-[230px] leading-[0.9] tracking-tight my-0 sm:my-1 cursor-pointer transition-transform duration-300 hover:scale-[1.01] select-none"
          style={{ 
            fontFamily: "'Italiana', 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif",
            textShadow: '0 4px 28px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.6)'
          }}
          onClick={onExploreCatalog}
          title="Click to explore the collection"
        >
          Jewelry
        </h1>

        {/* Bottom Subtitle: By Emily Dawson */}
        <div className="mt-0.5 sm:mt-2">
          <p 
            className="text-white font-serif text-base sm:text-xl md:text-2xl lg:text-3xl tracking-[0.04em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            style={{ 
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontStyle: 'normal'
            }}
          >
            By NaxtTo
          </p>
        </div>
      </div>

      {/* 3. Bottom Two-Column Paragraphs (Exact Placement & Text Alignment) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pb-5 sm:pb-8 md:pb-10 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 lg:gap-20 text-white/95 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-sans font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
          {/* Left Column Text */}
          <div className="text-left">
            <p className="max-w-md tracking-wide">
              Handcrafted in certified 18K solid gold, ethical solar diamonds, and archival baroque pearls. Designed for timeless elegance and everyday heirloom living.
            </p>
          </div>

          {/* Right Column Text */}
          <div className="text-left md:text-right flex justify-start md:justify-end">
            <p className="max-w-md tracking-wide">
              Crafted in our Milanese & Antwerp ateliers with lifetime provenance certification, carbon-neutral shipping, and bespoke personalization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
