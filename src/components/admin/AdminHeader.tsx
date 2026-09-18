import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  LogOut, 
  ExternalLink, 
  Bell, 
  Users, 
  Store, 
  KeyRound, 
  Crown,
  Activity,
  RefreshCw
} from 'lucide-react';

interface AdminHeaderProps {
  adminName: string;
  adminEmail?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeView: 'admin' | 'seller_hub';
  onToggleView: (view: 'admin' | 'seller_hub') => void;
  onExitToStorefront: () => void;
  onSignOut: () => void;
  totalUsersCount: number;
  totalSellersCount: number;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName,
  adminEmail,
  searchQuery,
  onSearchChange,
  activeView,
  onToggleView,
  onExitToStorefront,
  onSignOut,
  totalUsersCount,
  totalSellersCount,
  onRefreshData,
  isRefreshing
}) => {
  return (
    <header className="h-16 bg-[#0f172a] border-b border-[#1e293b] text-white px-4 sm:px-6 flex items-center justify-between shrink-0 select-none shadow-md z-20">
      {/* Brand & Executive Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] via-[#f59e0b] to-[#b45309] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-[#0f172a] rounded-[7px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#f59e0b]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-sm font-bold text-white uppercase">
                NaxtTo
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbbf24] tracking-wide uppercase">
                Executive Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Master Atelier Command Console
            </p>
          </div>
        </div>

        {/* View Switcher Toggle (Admin Suite vs Seller Hub) */}
        <div className="hidden md:flex items-center bg-[#1e293b] p-1 rounded-lg border border-slate-700 ml-4">
          <button
            type="button"
            onClick={() => onToggleView('admin')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'admin'
                ? 'bg-[#d4af37] text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Master Admin Suite</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleView('seller_hub')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'seller_hub'
                ? 'bg-[#d4af37] text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Seller Hub View</span>
          </button>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search accounts, users, sellers, emails, orders, SKU..."
            className="w-full bg-[#1e293b]/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onRefreshData && (
          <button
            type="button"
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Refresh accounts & ledger data"
            className="w-8 h-8 rounded-lg bg-[#1e293b] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
        )}

        {/* Live System Indicators */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-[#1e293b]/70 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{totalUsersCount} Users</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalSellersCount} Sellers</span>
          </div>
        </div>

        {/* Exit to Storefront */}
        <button
          type="button"
          onClick={onExitToStorefront}
          className="px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </button>

        {/* Administrator Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f59e0b] text-slate-950 font-bold text-xs flex items-center justify-center shadow-xs">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{adminName}</p>
            <p className="text-[10px] text-slate-400 font-mono">{adminEmail || 'anik@naxtto.com'}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={onSignOut}
          title="Sign out of administrative session"
          className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
