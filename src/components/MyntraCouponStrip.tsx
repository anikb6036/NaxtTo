import React, { useState } from 'react';
import { Copy, Check, Sparkles, Tag, ChevronRight, X } from 'lucide-react';

interface MyntraCouponStripProps {
  onApplyCoupon?: (code: string) => void;
}

export const MyntraCouponStrip: React.FC<MyntraCouponStripProps> = ({ onApplyCoupon }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const couponCode = 'FIRST300';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    if (onApplyCoupon) onApplyCoupon(couponCode);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="myntra-coupon-strip"
      className="w-full bg-[#f26a36] text-white select-none relative overflow-hidden transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Main Voucher Layout */}
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto flex-1 min-w-0">
            
            {/* Left Box: FLAT ₹300 OFF (Large Display Typo) */}
            <div className="flex items-baseline gap-1 sm:gap-2 pr-2.5 sm:pr-8 shrink-0">
              <span className="text-base sm:text-2xl md:text-3xl font-black tracking-tight uppercase whitespace-nowrap text-white drop-shadow-xs">
                FLAT ₹300 OFF
              </span>
            </div>

            {/* Perforated Ticket Divider with Notches */}
            <div className="relative flex flex-col items-center justify-between h-7 sm:h-10 mx-1 sm:mx-2 shrink-0">
              <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white -mt-1.5 sm:-mt-2 -top-1 absolute" />
              <div className="h-full border-l-2 border-dashed border-white/70" />
              <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-white -mb-1.5 sm:-mb-2 -bottom-1 absolute" />
            </div>

            {/* Right Box: On Your 1st Purchase Via NaxtTo App / Web */}
            <div className="pl-2.5 sm:pl-8 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap leading-tight">
                <span className="text-[11px] sm:text-base font-bold text-white tracking-wide whitespace-nowrap">
                  On Your 1<sup>st</sup> Purchase
                </span>
                <span className="text-[11px] sm:text-sm font-semibold text-white/95 flex items-center gap-1 whitespace-nowrap">
                  Via <span className="font-extrabold text-yellow-300 underline decoration-yellow-300 underline-offset-2">NaxtTo</span>
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-white/80 font-medium truncate sm:whitespace-normal">
                Fine 18K solid gold & certified diamonds. Code: <strong className="text-yellow-200 tracking-wider">FIRST300</strong>
              </p>
            </div>
          </div>

          {/* Right Action: Copy / Apply Button & Dismiss */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={handleCopy}
              className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white text-[#f26a36] hover:bg-yellow-300 hover:text-[#1a1a1a] font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
              title="Click to copy coupon code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>APPLIED!</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5" />
                  <span>CLAIM ₹300 OFF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close coupon banner"
            >
              <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
