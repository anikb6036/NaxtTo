import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  PackageCheck, 
  ShieldAlert, 
  Settings, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Flame,
  Award,
  Layout,
  Mail,
  Globe
} from 'lucide-react';

export type AdminTab = 
  | 'overview'
  | 'users'
  | 'sellers'
  | 'products'
  | 'wow_deals'
  | 'top_rated'
  | 'hero_banners'
  | 'orders'
  | 'email_service'
  | 'seo'
  | 'security';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  usersCount: number;
  sellersCount: number;
  ordersCount: number;
  productsCount: number;
  wowDealsCount?: number;
  topRatedCount?: number;
  heroBannersCount?: number;
  onExitToStorefront: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  usersCount,
  sellersCount,
  ordersCount,
  productsCount,
  wowDealsCount = 6,
  topRatedCount = 4,
  heroBannersCount = 4,
  onExitToStorefront
}) => {
  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'hero_banners' as AdminTab,
      label: 'Hero Banners & Slider',
      icon: Layout,
      badge: `${heroBannersCount} Slides`,
      badgeColor: 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
    },
    {
      id: 'top_rated' as AdminTab,
      label: 'Top Rated Jewellery',
      icon: Award,
      badge: `${topRatedCount} Cards`,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'wow_deals' as AdminTab,
      label: 'WOW Deals & Promos',
      icon: Flame,
      badge: `${wowDealsCount} Deals`,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'products' as AdminTab,
      label: 'Master Catalog Pieces',
      icon: ShoppingBag,
      badge: productsCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'users' as AdminTab,
      label: 'User Accounts & Patrons',
      icon: Users,
      badge: usersCount,
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    },
    {
      id: 'sellers' as AdminTab,
      label: 'Seller Accounts & Guilds',
      icon: Store,
      badge: sellersCount,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    {
      id: 'orders' as AdminTab,
      label: 'Global Order Ledger',
      icon: PackageCheck,
      badge: ordersCount,
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    },
    {
      id: 'email_service' as AdminTab,
      label: 'Resend Mail Service',
      icon: Mail,
      badge: 'Resend.com',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'seo' as AdminTab,
      label: 'SEO Settings',
      icon: Globe,
      badge: 'Live Head',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    },
    {
      id: 'security' as AdminTab,
      label: 'Security & Audit Logs',
      icon: ShieldAlert,
      badge: 'Protected',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    }
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-[#1e293b] text-slate-300 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Top Admin Section Banner */}
      <div className="p-4 border-b border-[#1e293b]/80 bg-gradient-to-b from-[#131c2e] to-[#090d16]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Administration
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#fbbf24] border border-[#d4af37]/40">
            Tier 0
          </span>
        </div>
        <p className="text-[12px] text-slate-300 font-medium mt-1">
          Atelier Multi-Tenant Ledger
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#d4af37]/5 text-white border-l-3 border-[#d4af37] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Administrative Status & Storefront Link */}
      <div className="p-3 border-t border-[#1e293b] space-y-2 bg-[#0d1320]">
        <div className="p-2.5 rounded-lg bg-[#151e2e] border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Server Runtime</span>
            <span className="text-emerald-400 font-mono">100% OK</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Cloud SQL + Firestore Active
          </p>
        </div>

        <button
          type="button"
          onClick={onExitToStorefront}
          className="w-full py-2 px-3 rounded-lg bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Public Storefront</span>
        </button>
      </div>
    </aside>
  );
};
