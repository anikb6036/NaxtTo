import React from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  ArrowLeft, 
  LogOut,
  Sparkles,
  Database
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface SellerHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExitToStorefront: () => void;
  onSignOut: () => void;
  sellerName?: string;
  activeOrdersCount: number;
  onOpenStorageTab?: () => void;
}

export const SellerHeader: React.FC<SellerHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onExitToStorefront,
  onSignOut,
  sellerName = 'NaxtTo',
  activeOrdersCount,
  onOpenStorageTab
}) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="bg-white border-b border-[#e5e5ea] sticky top-0 z-40 h-14 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Official Brand Logo with Lotus Emblem */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-[200px]">
        <div className="cursor-pointer" onClick={onExitToStorefront} title="Back to NaxtTo Storefront">
          <BrandLogo 
            layout="horizontal" 
            size="sm" 
            variant="bronze" 
            showSubtitle={true} 
            subtitleText="SELLER HUB" 
          />
        </div>
      </div>

      {/* Center: Search Rate Card / Listings input */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#878787] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Rate Card, SKU, Title or Orders..."
            className="w-full bg-[#f5f5f7] border border-transparent hover:border-[#d7d7d7] focus:border-[#2874f0] focus:bg-white text-xs text-[#212121] rounded-full pl-10 pr-4 py-2 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Storage Quick Switch */}
        {onOpenStorageTab && (
          <button
            type="button"
            onClick={onOpenStorageTab}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-semibold transition-colors border border-emerald-200"
            title="Cloud Database & Supabase Storage Status"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Cloud DB</span>
          </button>
        )}

        {/* Notification Bell */}
        <button 
          type="button"
          className="relative p-2 text-[#717478] hover:text-[#2874f0] hover:bg-[#f5f5f7] rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff6161] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* Verified Merchant Badge */}
        <div className="flex items-center gap-1.5 bg-[#e8f0fe] border border-[#d2e3fc] px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#1a73e8]" title="Verified Seller Hub">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span className="hidden sm:inline">Verified Seller</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#212121] hover:text-[#2874f0] py-1 px-2 rounded-lg transition-colors"
          >
            <span>{sellerName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#878787]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#e5e5ea] py-1.5 z-50 text-xs text-[#212121] animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#f5f5f7]">
                <p className="font-semibold">{sellerName}</p>
                <p className="text-[11px] text-[#878787]">Merchant Portal</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onExitToStorefront();
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#f5f5f7] flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#878787]" />
                <span>Exit to Storefront</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  onSignOut();
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
