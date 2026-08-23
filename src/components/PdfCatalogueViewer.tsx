import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Play, 
  Pause, 
  X, 
  Printer, 
  BookOpen,
  RotateCcw,
  Eye
} from 'lucide-react';
import { renderPdfSlide, TOTAL_PDF_PAGES, PDF_PAGES_META } from './PdfCatalogueSlides';
import { BrandLogo } from './BrandLogo';

interface PdfCatalogueViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfCatalogueViewer: React.FC<PdfCatalogueViewerProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play slideshow
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentPage((prev) => (prev >= TOTAL_PDF_PAGES ? 1 : prev + 1));
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage((p) => Math.min(TOTAL_PDF_PAGES, p + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  const handlePrintPdf = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="pdf-catalogue-modal"
      className="fixed inset-0 z-50 bg-[#1c1a18]/90 backdrop-blur-md flex flex-col text-[#2d2a26] print:bg-white print:p-0 print:m-0 print:fixed print:inset-0 print:z-[9999]"
    >
      {/* Top Header Bar (Hidden during Print) */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#2d2a26] text-[#eeeae4] border-b border-[#3d3934] print:hidden">
        <div className="flex items-center gap-4">
          <BrandLogo layout="horizontal" size="sm" variant="light" showSubtitle subtitleText="Lookbook Catalogue" />
          <div className="hidden md:block h-6 w-px bg-[#3d3934]" />
          <p className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-[#a39d96] font-sans">
            15-Page High Fidelity Editorial Design
          </p>
        </div>

        {/* Central Controls */}
        <div className="flex items-center gap-2 bg-[#3a3530] px-3 py-1 rounded-full text-xs font-sans">
          <button
            id="pdf-prev-page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#4a443d] disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2 font-medium tracking-widest text-[#eeeae4]">
            {currentPage} <span className="text-[#a39d96]">/</span> {TOTAL_PDF_PAGES}
          </span>

          <button
            id="pdf-next-page-btn"
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PDF_PAGES, p + 1))}
            disabled={currentPage === TOTAL_PDF_PAGES}
            className="p-1 rounded hover:bg-[#4a443d] disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 font-sans text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] uppercase tracking-wider transition-colors ${
              isPlaying ? 'bg-[#c5a059] text-[#2d2a26] font-bold' : 'bg-[#3a3530] text-[#eeeae4] hover:bg-[#4a443d]'
            }`}
            title="Auto-play Slideshow"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] uppercase tracking-wider transition-colors ${
              showThumbnails ? 'bg-[#c5a059] text-[#2d2a26] font-bold' : 'bg-[#3a3530] text-[#eeeae4] hover:bg-[#4a443d]'
            }`}
            title="Toggle All 15 Page Thumbnails"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            id="pdf-print-btn"
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fdfcfb] text-[#2d2a26] font-bold rounded text-[11px] uppercase tracking-wider hover:bg-[#eeeae4] transition-colors shadow-xs"
            title="Print or Export all 15 pages to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#3a3530] text-[#a39d96] hover:text-white transition-colors ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Presentation Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 flex items-center justify-center relative print:p-0 print:overflow-visible print:block"
      >
        {/* Interactive Single Slide (Screen Mode) */}
        <div className="w-full max-w-[1050px] shadow-2xl rounded-xs overflow-hidden transition-all duration-300 print:hidden">
          {renderPdfSlide(currentPage)}
        </div>

        {/* Print Layout: Renders all 15 pages sequentially for exact PDF printing */}
        <div className="hidden print:block w-full">
          {Array.from({ length: TOTAL_PDF_PAGES }, (_, i) => i + 1).map((pageNum) => (
            <div key={pageNum} className="w-full h-screen page-break-after-always print-page mb-8 print:mb-0">
              {renderPdfSlide(pageNum)}
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Ribbon Bar */}
      {showThumbnails && (
        <div className="bg-[#262320] border-t border-[#3d3934] p-4 flex gap-3 overflow-x-auto print:hidden">
          {PDF_PAGES_META.map((meta) => (
            <button
              key={meta.page}
              onClick={() => setCurrentPage(meta.page)}
              className={`shrink-0 w-28 aspect-[16/9] bg-white rounded overflow-hidden border-2 transition-all text-left relative group ${
                currentPage === meta.page ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                {renderPdfSlide(meta.page)}
              </div>
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#2d2a26]/80 text-white text-[9px] rounded font-sans font-bold">
                {meta.page}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
