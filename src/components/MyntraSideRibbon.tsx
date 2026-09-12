import React, { useState } from 'react';
import { Tag, X, Check, Sparkles, ChevronLeft, ArrowRight, Gift } from 'lucide-react';

interface MyntraSideRibbonProps {
  onApplyCoupon?: (code: string) => void;
}

export const MyntraSideRibbon: React.FC<MyntraSideRibbonProps> = ({ onApplyCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const availableOffers = [
    {
      code: 'FIRST300',
      title: 'Flat ₹300 Off',
      minOrder: 'Valid on min. spend of ₹1,999',
      category: 'New User First Order',
      badge: 'Best Value'
    },
    {
      code: 'GOLD15',
      title: 'Flat 15% Off',
      minOrder: 'Valid on Solid 18K/22K Gold Collections',
      category: 'Festive Flash Sale',
      badge: 'Trending'
    },
    {
      code: 'SOLITAIRE25',
      title: 'Flat ₹2,500 Off',
      minOrder: 'Valid on IGI Certified Diamond Rings',
      category: 'Bridal & Solitaires',
      badge: 'Luxury'
    },
    {
      code: 'FREESHIP',
      title: 'Free Insured Express Delivery',
      minOrder: 'Applicable on all orders',
      category: 'VIP Logistics',
      badge: 'Auto'
    }
  ];

  const handleApply = (code: string) => {
    setAppliedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* The Exact Vertical Side Ribbon Tab (Right Edge of Screen) */}
      <div 
        id="myntra-side-ribbon-tab"
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#282c3f] hover:bg-gradient-to-b hover:from-[#F50087] hover:to-[#F0501A] text-white cursor-pointer px-2 py-4 rounded-l-md shadow-2xl flex items-center gap-1.5 transition-all duration-200 select-none group"
        title="Click to view exclusive offers & coupons"
      >
        <span className="text-[11px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 flex items-center gap-1.5">
          <span className="text-yellow-400 group-hover:text-white">▲</span>
          <span>UPTO ₹300 OFF</span>
        </span>
      </div>

      {/* Slide-out Coupons & Offers Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#282c3f] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F50087] to-[#F0501A] flex items-center justify-center text-white">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-wide text-white">Exclusive Offers & Coupons</h3>
                  <p className="text-xs text-gray-300">Unlock maximum savings on 18K gold & diamonds</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close offers"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coupons List */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#f5f5f6]">
              {availableOffers.map((offer) => {
                const isApplied = appliedCode === offer.code;
                return (
                  <div
                    key={offer.code}
                    className="bg-white rounded-lg border-2 border-dashed border-[#eaeaec] hover:border-[#F50087] p-4 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="inline-block bg-[#F50087]/10 text-[#F50087] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                          {offer.badge}
                        </span>
                        <h4 className="text-base font-extrabold text-[#282c3f]">{offer.title}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#03a685] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {offer.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#7e818c] mb-3">{offer.minOrder}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="bg-[#f5f5f6] px-3 py-1 rounded font-mono font-bold text-xs text-[#282c3f] border border-gray-200 tracking-wider">
                        {offer.code}
                      </div>

                      <button
                        onClick={() => handleApply(offer.code)}
                        className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                          isApplied
                            ? 'bg-[#03a685] text-white'
                            : 'bg-gradient-to-r from-[#F50087] to-[#F0501A] hover:opacity-95 text-white active:scale-95'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>APPLIED</span>
                          </>
                        ) : (
                          <span>APPLY COUPON</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-[#eaeaec] text-center text-xs text-[#7e818c]">
              Coupons are automatically applied during instant checkout.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
