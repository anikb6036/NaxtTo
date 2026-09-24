import React from 'react';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  PackageCheck, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Crown, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  ArrowRight,
  Layout
} from 'lucide-react';
import { AdminUserAccount, SellerAccount, Order, Product } from '../../types';
import { AdminTab } from './AdminSidebar';

interface ExecutiveDashboardViewProps {
  users: AdminUserAccount[];
  sellers: SellerAccount[];
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: AdminTab) => void;
  currencySymbol: string;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  users,
  sellers,
  orders,
  products,
  onNavigateTab,
  currencySymbol
}) => {
  // Aggregate calculations
  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const vipPatronsCount = users.filter(u => u.status === 'vip' || u.memberTier.includes('VIP')).length;
  const totalSellerRevenue = sellers.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome & Atelier Status Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#090d16] p-6 text-white border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fbbf24] uppercase tracking-wider">
                Administrator Command
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cloud Synchronized
              </span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-white">
              NaxtTo Atelier Master Governance
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Platform administration console for managing patron accounts, artisan guild partners, inventory certifications, and global order fulfillment.
            </p>
          </div>

          {/* Quick Nav Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="px-3 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{users.length} Users</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('sellers')}
              className="px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{sellers.length} Guilds</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Platform GMV */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Gross GMV</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">
            {currencySymbol}{totalGMV.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            {orders.length > 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Synchronized platform ledger</span>
              </>
            ) : (
              <span className="text-slate-400 font-normal">Live platform ledger</span>
            )}
          </div>
        </div>

        {/* Metric 2: Registered Patrons */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-sky-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patron Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{vipPatronsCount} VIP Privé Clients</span>
          </div>
        </div>

        {/* Metric 3: Certified Sellers */}
        <div 
          onClick={() => onNavigateTab('sellers')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Artisan Guilds</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{sellers.length}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% BIS Hallmarked</span>
          </div>
        </div>

        {/* Metric 4: Active Orders & Catalog */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-purple-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Orders Ledger</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          <div className="flex items-center gap-1 text-[11px] text-purple-600 font-semibold">
            <span>{pendingOrdersCount} Active in transit/crafting</span>
          </div>
        </div>
      </div>

      {/* Merchandising & Storefront Showcase Spotlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hero Banners Card */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 sm:p-5 rounded-2xl border border-pink-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-[#E61D72] flex items-center justify-center text-white shadow-xs shrink-0">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Hero Banners &amp; Slider</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E61D72] text-white rounded-full uppercase">
                  Storefront Top
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Edit hero banner images, headline titles, auspicious badges, and CTA button destinations for the carousel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('hero_banners')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#E61D72] border border-[#E61D72]/30 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Edit Hero Banners</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Rated in Fine Jewellery Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-teal-50 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Top Rated in Fine Jewellery</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#2874f0] text-white rounded-full uppercase">
                  Bestsellers
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Certified 18K Hallmarked pieces trusted by 10,000+ patrons with custom badge tags and prices.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('top_rated')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#2874f0] border border-[#2874f0]/30 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Edit Top Rated Showcase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WOW Deals Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-4 sm:p-5 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xs shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Storefront WOW DEALS</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ff3e6c] text-white rounded-full uppercase">
                  Active Promo
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Live discount badges, brands, price teasers, and categories featured on the homepage carousel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('wow_deals')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-[#ff3e6c] border border-[#ff3e6c]/30 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Edit WOW Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>


      {/* Two Columns: Recent Patrons & Top Artisan Guilds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Registered Patrons Highlight */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Recent Patron Accounts</span>
              </h2>
              <p className="text-[11px] text-slate-500">Clients registered with verified profiles</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Users ({users.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {users.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Users className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                No patron accounts registered yet.
              </div>
            ) : (
              users.slice(0, 4).map((u) => (
                <div 
                  key={u.id}
                  onClick={() => onNavigateTab('users')}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{u.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                          {u.memberTier}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-xs text-slate-900">
                      {currencySymbol}{u.totalSpent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{u.ordersCount} orders</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Top Artisan Guilds Highlight */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Artisan Seller Guilds</span>
              </h2>
              <p className="text-[11px] text-slate-500">Authorized workshops &amp; trade credentials</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('sellers')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Sellers ({sellers.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {sellers.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Store className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                No artisan guilds onboarded yet.
              </div>
            ) : (
              sellers.slice(0, 4).map((s) => (
                <div 
                  key={s.id}
                  onClick={() => onNavigateTab('sellers')}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                      <Store className="w-4 h-4 text-amber-800" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{s.storeName}</span>
                      <span className="text-[10px] text-slate-500">{s.ownerName} • {s.city}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-xs text-slate-900">
                      {currencySymbol}{s.totalRevenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold block">{s.commissionRate}% take-rate</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
