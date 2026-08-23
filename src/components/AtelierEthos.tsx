import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Printer, 
  Grid, 
  Layers, 
  BookOpen, 
  Check, 
  Download,
  Eye,
  Sliders
} from 'lucide-react';
import { renderPdfSlide, TOTAL_PDF_PAGES, PDF_PAGES_META } from './PdfCatalogueSlides';

interface AtelierEthosProps {
  onOpenFullscreenCatalogue?: () => void;
}

export const AtelierEthos: React.FC<AtelierEthosProps> = ({ onOpenFullscreenCatalogue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'continuous'>('continuous');
  const [activeTab, setActiveTab] = useState<'all' | 'curated'>('all');

  // Auto-play slideshow for interactive mode
  useEffect(() => {
    let timer: any;
    if (isPlaying && viewMode === 'interactive') {
      timer = setInterval(() => {
        setCurrentPage((prev) => (prev >= TOTAL_PDF_PAGES ? 1 : prev + 1));
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, viewMode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section 
      id="atelier-ethos-section" 
      className="w-full bg-white text-[#1d1d1f] py-8 sm:py-12 border-t border-[#e5e5ea]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* View Mode 1: Interactive Presentation Canvas */}
        {viewMode === 'interactive' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Interactive Page Controller Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f8f6f2] p-4 rounded-xs border border-[#eeeae4] text-xs font-sans">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c827a]">
                  Current Page:
                </span>
                <span className="font-serif text-lg font-bold text-[#2d2a26]">
                  {currentPage.toString().padStart(2, '0')} <span className="text-[#a39d96] font-light">/ {TOTAL_PDF_PAGES}</span>
                </span>
                <span className="hidden md:inline-block text-xs font-serif italic text-[#736c64] border-l border-[#d1ccc6] pl-3">
                  {PDF_PAGES_META[currentPage - 1]?.title} — {PDF_PAGES_META[currentPage - 1]?.subtitle}
                </span>
              </div>

              {/* Navigation & Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="about-prev-slide-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white rounded border border-[#d1ccc6] hover:bg-[#2d2a26] hover:text-white hover:border-[#2d2a26] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-inherit disabled:hover:border-[#d1ccc6] transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  id="about-next-slide-btn"
                  onClick={() => setCurrentPage((p) => Math.min(TOTAL_PDF_PAGES, p + 1))}
                  disabled={currentPage === TOTAL_PDF_PAGES}
                  className="p-2 bg-white rounded border border-[#d1ccc6] hover:bg-[#2d2a26] hover:text-white hover:border-[#2d2a26] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-inherit disabled:hover:border-[#d1ccc6] transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  id="about-autoplay-toggle-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-[10px] uppercase tracking-wider font-bold transition-all border ${
                    isPlaying 
                      ? 'bg-[#c5a059] text-[#2d2a26] border-[#c5a059]' 
                      : 'bg-white text-[#2d2a26] border-[#d1ccc6] hover:bg-[#f4efe8]'
                  }`}
                  title="Auto-play presentation slideshow"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>
              </div>
            </div>

            {/* The Actual PDF Slide Container Rendered Inline on the Page */}
            <div className="w-full bg-white rounded-xs border border-[#eeeae4] shadow-xl overflow-hidden transition-all duration-300">
              {renderPdfSlide(currentPage)}
            </div>

            {/* 15-Page Thumbnail Navigator */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#8c827a]">
                <span>Catalogue Index (Pages 1–15)</span>
                <span>Click any thumbnail to jump</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-2 overflow-x-auto p-2 bg-[#f4efe8] rounded-xs border border-[#e5dfd7]">
                {PDF_PAGES_META.map((meta) => (
                  <button
                    key={meta.page}
                    id={`about-thumb-${meta.page}`}
                    onClick={() => setCurrentPage(meta.page)}
                    className={`group flex flex-col items-center justify-center p-1.5 rounded transition-all text-center ${
                      currentPage === meta.page 
                        ? 'bg-[#2d2a26] text-white shadow-md ring-2 ring-[#c5a059]' 
                        : 'bg-white text-[#524e48] hover:bg-[#eeeae4] border border-[#d1ccc6]/40'
                    }`}
                    title={`Page ${meta.page}: ${meta.title}`}
                  >
                    <span className="text-[11px] font-bold font-mono">
                      {meta.page.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[8px] truncate max-w-full font-serif opacity-80 group-hover:opacity-100 hidden sm:block">
                      {meta.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Continuous Publication Mode (All 15 Pages Stacked) */}
        {viewMode === 'continuous' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="space-y-12">
              {Array.from({ length: TOTAL_PDF_PAGES }, (_, idx) => idx + 1).map((pageNum) => (
                <div 
                  key={pageNum} 
                  className="pb-8 border-b border-[#eeeae4] last:border-none"
                >
                  <div className="w-full bg-white rounded-xs border border-[#eeeae4] shadow-lg overflow-hidden">
                    {renderPdfSlide(pageNum)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
