import React from 'react';
import { ShieldCheck, Instagram, Globe } from 'lucide-react';
import { ProductCategory } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onNavigateToJournal: () => void;
  onNavigateToAtelier: () => void;
  onOpenWishlist: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateToJournal,
  onNavigateToAtelier,
  onOpenWishlist,
  onNavigateToAdmin
}) => {
  return (
    <footer id="main-footer" className="w-full bg-[#1d1d1f] text-[#f5f5f7] pt-16 pb-12 border-t border-[#333336]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Atelier Address (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo 
              layout="vertical" 
              size="lg" 
              variant="light" 
              showSubtitle={true} 
              subtitleText="Fine Jewellery Atelier"
              className="items-start text-left"
            />

            <p className="text-xs text-[#a39d96] leading-relaxed max-w-sm font-serif italic pt-1">
              Sculpted in Milan, Antwerp & Florence from certified 100% recycled 18k solid gold, solar-crystallized diamonds, and organic baroque pearls.
            </p>

            <div className="pt-2 text-[10px] text-[#a39d96] space-y-1 font-sans uppercase tracking-wider">
              <p>Official Boutique: <a href="https://naxtto.shop" className="text-[#d4af37] hover:underline">naxtto.shop</a></p>
              <p>Atelier Privé: Via Montenapoleone 8, Milano</p>
              <p>Client Concierge: concierge@naxtto.shop</p>
            </div>
          </div>

          {/* Col 2: The Collections */}
          <div className="space-y-3 font-sans">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#fdfcfb]">
              Selections
            </h4>
            <ul className="space-y-2 text-[11px] text-[#a39d96]">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-white transition-colors">
                  All Pieces
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('rings')} className="hover:text-white transition-colors">
                  Continuous Rings
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('necklaces')} className="hover:text-white transition-colors">
                  Liquid Pendants
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('earrings')} className="hover:text-white transition-colors">
                  Sculpted Hoops
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bracelets')} className="hover:text-white transition-colors">
                  Articulated Cuffs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bespoke')} className="hover:text-white transition-colors">
                  Bespoke Commissions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: The Atelier */}
          <div className="space-y-3 font-sans">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#fdfcfb]">
              Atelier & Journal
            </h4>
            <ul className="space-y-2 text-[11px] text-[#a39d96]">
              <li>
                <button onClick={onNavigateToJournal} className="hover:text-white transition-colors">
                  The NaxtTo Journal
                </button>
              </li>
              <li>
                <button onClick={onNavigateToAtelier} className="hover:text-white transition-colors">
                  100% Recycled Gold Ethos
                </button>
              </li>
              <li>
                <button onClick={onNavigateToJournal} className="hover:text-white transition-colors">
                  Ring Stacking Archetypes
                </button>
              </li>
              <li>
                <button onClick={onNavigateToJournal} className="hover:text-white transition-colors">
                  18K vs 14K Metallurgy
                </button>
              </li>
              <li>
                <button onClick={onOpenWishlist} className="hover:text-white transition-colors">
                  Curated Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Client Services */}
          <div className="space-y-3 font-sans">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#fdfcfb]">
              Concierge
            </h4>
            <ul className="space-y-2 text-[11px] text-[#a39d96]">
              <li>Complimentary Insured Courier</li>
              <li>30-Day Effortless Returns</li>
              <li>Lifetime Care & Polish Guarantee</li>
              <li>Bespoke Sizing Assessment</li>
              <li>Linen Calligraphy Packaging</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Security Badges */}
        <div className="pt-8 border-t border-[#3d3934] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-[#a39d96] font-sans">
          <p>© 2026 NaxtTo Fine Jewellery • Official Store: naxtto.shop. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Atelier</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ethical Bullion Audits</span>
            {onNavigateToAdmin && (
              <button 
                id="footer-staff-login-btn"
                onClick={onNavigateToAdmin} 
                className="hover:text-white cursor-pointer transition-colors text-[#a39d96]/70 hover:text-[#fdfcfb]"
                title="Staff & Management Access"
              >
                Staff Access
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
