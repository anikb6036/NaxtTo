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
      className="w-full bg-[#f26a36] text-white select-none relative transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Main Voucher Layout */}
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto flex-1 min-w-0 flex-wrap sm:flex-nowrap gap-2 sm:gap-0 text-center sm:text-left">
            
            {/* Left Box: FLAT ₹300 OFF */}
            <div className="flex items-baseline pr-2 sm:pr-4 md:pr-6 shrink-0">
              <span className="text-sm sm:text-xl md:text-2xl font-black tracking-tight uppercase whitespace-nowrap text-white drop-shadow-xs">
                FLAT ₹300 OFF
              </span>
            </div>

            {/* Clean Ticket Perforated Divider */}
            <div className="hidden sm:block h-6 sm:h-8 mx-2 sm:mx-3 shrink-0 border-l border-white/50 border-dashed" />

            {/* Right Box: On Your 1st Purchase Via NaxtTo App / Web */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 flex-wrap leading-tight">
                <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide whitespace-nowrap">
                  On Your 1<sup>st</sup> Purchase
                </span>
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-white/95 flex items-center gap-1 whitespace-nowrap">
                  Via <span className="font-extrabold text-yellow-300 underline decoration-yellow-300 underline-offset-2">NaxtTo</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-white/85 font-medium truncate sm:whitespace-normal">
                Fine 18K solid gold & certified diamonds. Code: <strong className="text-yellow-200 tracking-wider font-extrabold">FIRST300</strong>
              </p>
            </div>
          </div>

          {/* Right Action: Copy / Apply Button & Dismiss */}
          <div className="flex items-center gap-2 shrink-0 justify-center w-full md:w-auto">
            <button
              onClick={handleCopy}
              className="px-3.5 sm:px-4 py-1.5 bg-white text-[#f26a36] hover:bg-yellow-300 hover:text-[#1a1a1a] font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
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
              className="text-white/75 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Close coupon banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
