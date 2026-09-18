import React, { useState } from 'react';
import { 
  Home, 
  ListChecks, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Megaphone, 
  FileText, 
  Users, 
  Database,
  RotateCcw,
  UploadCloud,
  Sparkles,
  Building2,
  Share2,
  Bell,
  Headphones,
  ChevronDown,
  Store,
  ArrowLeft,
  X
} from 'lucide-react';

export type SellerNavTab = 
  | 'home'
  | 'listings' 
  | 'inventory' 
  | 'orders' 
  | 'returns'
  | 'pricing'
  | 'claims'
  | 'quality'
  | 'payments' 
  | 'warehouse'
  | 'influencer'
  | 'growth' 
  | 'ads' 
  | 'reports' 
  | 'partner-services'
  | 'storage';

interface SellerSidebarProps {
  activeTab: SellerNavTab;
  onTabChange: (tab: SellerNavTab) => void;
  ordersCount: number;
  listingsCount: number;
  sellerName?: string;
  onExitToStorefront?: () => void;
}

interface NavItem {
  id: SellerNavTab;
  label: string;
  icon: any;
  badge?: number;
  hasChevron?: boolean;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({
  activeTab,
  onTabChange,
  ordersCount,
  listingsCount,
  sellerName = 'NaxtTo',
  onExitToStorefront
}) => {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'notices' | 'support' | null>(null);

  // Grouped Navigation Items
  const businessItems: NavItem[] = [
    { id: 'orders' as SellerNavTab, label: 'Orders', icon: ShoppingBag, badge: ordersCount > 0 ? ordersCount : undefined },
    { id: 'returns' as SellerNavTab, label: 'Returns', icon: RotateCcw },
    { id: 'inventory' as SellerNavTab, label: 'Inventory', icon: Package },
    { id: 'listings' as SellerNavTab, label: 'Catalog Uploads', icon: UploadCloud, badge: listingsCount },
    { id: 'quality' as SellerNavTab, label: 'Quality', icon: Sparkles },
    { id: 'payments' as SellerNavTab, label: 'Payments', icon: CreditCard },
    { id: 'warehouse' as SellerNavTab, label: 'Warehouse', icon: Building2 },
  ];

  const growthItems = [
    { id: 'influencer' as SellerNavTab, label: 'Influencer Marketing', icon: Share2 },
    { id: 'ads' as SellerNavTab, label: 'Advertisement', icon: Megaphone },
    { id: 'storage' as SellerNavTab, label: 'Cloud DB & Storage', icon: Database },
  ];

  return (
    <>
      <aside className="w-52 sm:w-56 bg-[#1e2029] text-[#a0a7b5] flex flex-col shrink-0 select-none min-h-[calc(100vh-3.5rem)] border-r border-[#2a2e3b] overflow-y-auto">
        {/* Top Store Selector Pill */}
        <div className="p-3 border-b border-[#2a2e3b] relative">
          <button
            type="button"
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-[#2a2e3b] transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-white font-semibold text-sm truncate max-w-[110px]">
                {sellerName}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8a919e]" />
          </button>

          {/* Store Dropdown */}
          {storeDropdownOpen && (
            <div className="absolute top-14 left-3 right-3 bg-[#242834] border border-[#343a4a] rounded-xl shadow-xl p-2 z-50 text-xs text-white space-y-1">
              <div className="px-2 py-1.5 border-b border-[#343a4a]">
                <p className="font-bold text-white">{sellerName} Gold Atelier</p>
                <p className="text-[10px] text-[#9ca3af]">Bowbazar Hub (Kolkata)</p>
              </div>
              {onExitToStorefront && (
                <button
                  type="button"
                  onClick={() => {
                    setStoreDropdownOpen(false);
                    onExitToStorefront();
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#323846] rounded-md flex items-center gap-2 text-[#93c5fd]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit to Storefront</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notices & Support Buttons Row */}
        <div className="grid grid-cols-2 gap-1.5 p-2.5 border-b border-[#2a2e3b]">
          <button
            type="button"
            onClick={() => setActiveModal('notices')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#262a36] hover:bg-[#303544] text-[#d1d5db] text-[11px] font-medium rounded-lg border border-[#323846] transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>Notices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('support')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#262a36] hover:bg-[#303544] text-[#d1d5db] text-[11px] font-medium rounded-lg border border-[#323846] transition-colors cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>Support</span>
          </button>
        </div>

        {/* Main Navigation List */}
        <nav className="flex-1 px-2 py-3 space-y-4 text-xs font-medium">
          {/* Home Link */}
          <div>
            <button
              type="button"
              onClick={() => onTabChange('home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === 'home'
                  ? 'bg-[#323644] text-white font-bold shadow-xs'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#282c38]'
              }`}
            >
              <div className={`p-1 rounded-md ${activeTab === 'home' ? 'bg-[#ef4444] text-white' : 'text-[#9ca3af]'}`}>
                <Home className="w-3.5 h-3.5" />
              </div>
              <span className="text-[13px]">Home</span>
            </button>
          </div>

          {/* Manage Business Section */}
          <div className="space-y-0.5">
            <p className="px-3 text-[11px] font-semibold tracking-wider text-[#6b7280] uppercase pb-1">
              Manage Business
            </p>
            {businessItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#323644] text-white font-bold shadow-xs'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#282c38]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#878d9b]'}`} />
                    <span className="text-[12px]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.badge !== undefined && (
                      <span className="min-w-[18px] h-[18px] px-1 bg-[#3b82f6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {item.hasChevron && (
                      <ChevronDown className="w-3.5 h-3.5 text-[#6b7280]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Boost Sales Section */}
          <div className="space-y-0.5 pt-1">
            <p className="px-3 text-[11px] font-semibold tracking-wider text-[#6b7280] uppercase pb-1">
              Boost Sales
            </p>
            {growthItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#323644] text-white font-bold shadow-xs'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#282c38]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#878d9b]'}`} />
                    <span className="text-[12px]">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Supplier Hub Logo / Branding matching the screenshot */}
        <div className="p-3 border-t border-[#2a2e3b] bg-[#1a1c24]">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm tracking-tight">
              NaxtTo
            </span>
            <span className="text-[11px] text-[#9ca3af] font-medium">
              Supplier Hub
            </span>
          </div>
        </div>
      </aside>

      {/* Notices Modal */}
      {activeModal === 'notices' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
              <h3 className="text-base font-bold text-[#1f242e] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#3b82f6]" />
                <span>Seller Notices &amp; Circulars</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#4b5563]">
              <div className="p-3 bg-[#f0f9ff] border border-[#bae6fd] rounded-lg">
                <p className="font-bold text-[#0369a1]">Bengali Wedding Season Rush</p>
                <p className="mt-0.5 text-[#0c4a6e]">
                  High buyer demand detected for 22K Gold Badhano Shankha &amp; Pola. Keep buffer inventory stocked for same-day dispatch.
                </p>
              </div>
              <div className="p-3 bg-[#fdf2f8] border border-[#fbcfe8] rounded-lg">
                <p className="font-bold text-[#be185d]">Zero Marketplace Commission</p>
                <p className="mt-0.5 text-[#9d174d]">
                  Enjoy 0% platform fee on all authentic conch shell handcrafted items this festive quarter.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-[#f3f4f6] text-[#1f242e] text-xs font-semibold rounded-lg hover:bg-[#e5e7eb]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
              <h3 className="text-base font-bold text-[#1f242e] flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#10b981]" />
                <span>Atelier Merchant Support</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#4b5563]">
              <p>Need assistance with courier pickups, return claims, or catalogue hallmarking?</p>
              <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg space-y-1">
                <p className="font-bold text-[#15803d]">Dedicated Account Manager</p>
                <p>Phone: +91 98300 12345 (10 AM – 7 PM IST)</p>
                <p>Email: supplier-desk@naxtto.shop</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-[#f3f4f6] text-[#1f242e] text-xs font-semibold rounded-lg hover:bg-[#e5e7eb]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
