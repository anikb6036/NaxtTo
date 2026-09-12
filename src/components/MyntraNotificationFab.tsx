import React, { useState } from 'react';
import { Bell, X, Sparkles, Tag, ArrowRight, Check } from 'lucide-react';

interface MyntraNotificationFabProps {
  onOpenOffers?: () => void;
}

export const MyntraNotificationFab: React.FC<MyntraNotificationFabProps> = ({ onOpenOffers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 1,
      title: 'Grand Jewellery Bash Is LIVE!',
      desc: 'Get flat 50-80% off on certified solitaire rings and 18K solid gold.',
      time: 'Just now',
      tag: 'Sale Alert',
      color: 'text-[#ff3e6c]'
    },
    {
      id: 2,
      title: 'Flat ₹300 Off Coupon Available',
      desc: 'Use voucher code FIRST300 at checkout on your first order.',
      time: '10m ago',
      tag: 'Coupon',
      color: 'text-[#f26a36]'
    }
  ];

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  return (
    <div id="myntra-notification-fab-container" className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Popup Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#2874f0] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 fill-white" />
              <span className="font-bold text-sm tracking-wide">Live Notifications</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2.5 max-h-80 overflow-y-auto bg-gray-50">
            {notifications.map((n) => (
              <div key={n.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs hover:border-[#2874f0] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${n.color}`}>
                    {n.tag}
                  </span>
                  <span className="text-[10px] text-gray-400">{n.time}</span>
                </div>
                <h4 className="text-xs font-bold text-gray-900">{n.title}</h4>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-white border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenOffers) onOpenOffers();
              }}
              className="text-xs font-bold text-[#2874f0] hover:underline flex items-center justify-center gap-1 w-full"
            >
              <span>Explore All Deals &amp; Coupons</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* The Blue Bell FAB from the screenshot */}
      <button
        onClick={handleOpen}
        className="w-12 h-12 rounded-full bg-[#2874f0] hover:bg-[#1a5ec4] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(40,116,240,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 relative group"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ff3e6c] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

    </div>
  );
};
