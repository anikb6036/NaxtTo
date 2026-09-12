import React from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Crown, 
  Gift, 
  Sparkles, 
  Coins, 
  Award,
  Gem
} from 'lucide-react';
import { ProductCategory } from '../types';

interface QuickServicesStripProps {
  onSelectCategory: (category: ProductCategory) => void;
  onExploreCatalog: () => void;
  onOpenPdfCatalogue?: () => void;
}

export const QuickServicesStrip: React.FC<QuickServicesStripProps> = ({
  onSelectCategory,
  onExploreCatalog,
  onOpenPdfCatalogue
}) => {
  const services = [
    {
      id: 'hallmark',
      title: 'BIS Hallmark',
      sub: '916 & 750 Pure',
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      action: () => { onSelectCategory('all'); onExploreCatalog(); }
    },
    {
      id: 'emi',
      title: 'Pay Later / EMI',
      sub: '0% Interest',
      icon: <CreditCard className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-blue-500 to-blue-700',
      action: () => { onSelectCategory('all'); onExploreCatalog(); }
    },
    {
      id: 'exchange',
      title: 'Gold Exchange',
      sub: '100% Full Value',
      icon: <RefreshCw className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-amber-500 to-amber-700',
      action: () => { onSelectCategory('all'); onExploreCatalog(); }
    },
    {
      id: 'plus',
      title: 'NaxtTo Plus',
      sub: 'Free VIP Vault',
      icon: <Crown className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-purple-600 to-purple-800',
      action: () => { onSelectCategory('all'); onExploreCatalog(); }
    },
    {
      id: 'gift',
      title: 'Gift Cards',
      sub: 'Instant Digital',
      icon: <Gift className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-pink-500 to-rose-600',
      action: () => { onSelectCategory('bespoke'); onExploreCatalog(); }
    },
    {
      id: 'supercoins',
      title: 'SuperCoins',
      sub: '5% Coin Rewards',
      icon: <Coins className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      action: () => { onSelectCategory('all'); onExploreCatalog(); }
    },
    {
      id: 'certified',
      title: 'IGI / GIA Solitaire',
      sub: 'Certified Natural',
      icon: <Gem className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-cyan-600 to-teal-700',
      action: () => { onSelectCategory('rings'); onExploreCatalog(); }
    },
    {
      id: 'lookbook',
      title: 'PDF Lookbook',
      sub: '2026 Archive',
      icon: <Award className="w-5 h-5 text-white" />,
      bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
      action: () => { if (onOpenPdfCatalogue) onOpenPdfCatalogue(); }
    }
  ];

  return (
    <section 
      id="quick-services-strip" 
      aria-label="Jewellery Quick Services"
      className="w-full bg-[#f1f2f4] py-2 sm:py-3 select-none"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-lg border border-[#e5e5ea] p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {services.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="flex flex-col items-center justify-center shrink-0 min-w-[76px] sm:min-w-[88px] group transition-all"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${item.bg} flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-[#212121] group-hover:text-[#2874f0] transition-colors mt-1.5 line-clamp-1">
                  {item.title}
                </span>
                <span className="text-[10px] text-[#878787] font-medium leading-none mt-0.5 hidden sm:block">
                  {item.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
