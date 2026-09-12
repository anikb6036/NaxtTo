import React from 'react';
import { Store, ChevronRight, Sparkles } from 'lucide-react';

interface FloatingSellerBadgeProps {
  onOpenSellerHub: () => void;
}

export const FloatingSellerBadge: React.FC<FloatingSellerBadgeProps> = ({ onOpenSellerHub }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 select-none">
      <button
        onClick={onOpenSellerHub}
        id="floating-seller-hub-btn"
        className="flex items-center gap-2 bg-white border border-[#2874f0] hover:border-[#1259c7] text-[#212121] py-1.5 px-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group active:scale-95"
        title="Access Atelier Seller Hub & Vault Management"
      >
        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[#2874f0] shadow-2xs">
          <Store className="w-3.5 h-3.5 fill-[#2874f0]" />
        </div>
        <div className="text-left text-xs leading-tight">
          <span className="font-bold text-[#212121] block flex items-center gap-1">
            Seller Hub
            <span className="text-[9px] text-[#2874f0] font-bold">by NaxtTo</span>
          </span>
          <span className="text-[10px] text-[#2874f0] font-semibold flex items-center">
            Log In <ChevronRight className="w-2.5 h-2.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </button>
    </div>
  );
};
