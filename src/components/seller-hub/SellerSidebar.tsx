import React from 'react';
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
  HelpCircle,
  Database
} from 'lucide-react';

export type SellerNavTab = 
  | 'home'
  | 'listings' 
  | 'inventory' 
  | 'orders' 
  | 'payments' 
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
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({
  activeTab,
  onTabChange,
  ordersCount,
  listingsCount
}) => {
  const navItems: { id: SellerNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'listings', label: 'Listings', icon: ListChecks, badge: listingsCount },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersCount > 0 ? ordersCount : undefined },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'ads', label: 'Ads', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'storage', label: 'Cloud DB', icon: Database },
    { id: 'partner-services', label: 'Partner Services', icon: Users }
  ];

  return (
    <aside className="w-20 sm:w-24 bg-white border-r border-[#e5e5ea] flex flex-col items-center py-4 shrink-0 select-none min-h-[calc(100vh-3.5rem)]">
      <nav className="w-full flex flex-col items-center space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full py-2.5 px-1 flex flex-col items-center justify-center relative transition-all group ${
                isActive
                  ? 'text-[#2874f0] bg-[#f0f5ff]'
                  : 'text-[#666666] hover:text-[#2874f0] hover:bg-[#f9fafb]'
              }`}
            >
              {/* Active left indicator pill */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#2874f0] rounded-r-md" />
              )}

              <div className="relative mb-1">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#2874f0]' : 'text-[#717478]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-[#2874f0] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight text-center font-medium ${
                isActive ? 'font-semibold text-[#2874f0]' : 'text-[#616161]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
