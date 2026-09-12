import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface FlashSaleBannerProps {
  onShopNow: () => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ onShopNow }) => {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val: number) => val.toString().padStart(2, '0');

  return (
    <div id="flash-sale-promo-strip" className="w-full bg-[#f1f2f4] py-2 sm:py-3">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div 
          onClick={onShopNow}
          className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[#0d47a1] via-[#1565c0] to-[#0288d1] text-white p-4 sm:p-5 shadow-sm cursor-pointer border border-[#0d47a1] group hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Left Flash Sale Badge & Text (Matches Video 0:07) */}
          <div className="flex items-center gap-3 sm:gap-4 z-10">
            {/* Flash Icon Box */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-yellow-400 text-[#0d47a1] flex flex-col items-center justify-center font-black shadow-md shrink-0 transform group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-[#0d47a1]" />
              <span className="text-[9px] uppercase tracking-tighter font-extrabold leading-none">FLASH</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-yellow-400 text-[#1a237e] text-[10px] font-black uppercase rounded-xs tracking-wider">
                  TODAY ONLY
                </span>
                <span className="text-xs text-blue-200 hidden sm:inline">
                  Slots: 2-3 PM • 8-9 PM • 10 PM-12 AM
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
                Flat 15% Off on All Gold & Diamond Pieces
              </h3>
              <p className="text-xs text-blue-100 hidden sm:block">
                Use Code: <strong className="text-yellow-300 tracking-wider">GOLD15</strong> at checkout. Valid on orders above ₹10,000.
              </p>
            </div>
          </div>

          {/* Right Timer and CTA */}
          <div className="flex items-center gap-4 z-10 shrink-0">
            {/* Countdown Box */}
            <div className="flex items-center gap-1 bg-black/30 border border-white/20 px-3 py-1.5 rounded-md backdrop-blur-xs">
              <Clock className="w-4 h-4 text-yellow-300" />
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-white">
                <span className="bg-white/20 px-1.5 py-0.5 rounded-xs">{formatDigits(timeLeft.hours)}h</span>
                <span>:</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded-xs">{formatDigits(timeLeft.minutes)}m</span>
                <span>:</span>
                <span className="bg-yellow-400 text-blue-900 px-1.5 py-0.5 rounded-xs font-black">{formatDigits(timeLeft.seconds)}s</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onShopNow();
              }}
              className="px-4 sm:px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-[#0d47a1] font-black text-xs sm:text-sm rounded-md shadow-md transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <span>GRAB DEAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Background subtle light effects */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
