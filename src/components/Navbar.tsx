import React, { useState, useEffect, useRef } from 'react';
import userBrandLogo from '../assets/images/user_brand_logo.svg';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Package,
  Store,
  LogOut,
  Gift,
  PhoneCall,
  SlidersHorizontal,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ProductCategory, UserProfile } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onNavigateToAdmin?: () => void;
  onOpenPdfCatalogue?: () => void;
  onNavigateToJournal: () => void;
  onNavigateToAtelier: () => void;
  onNavigateToShop: () => void;
  currentCurrency: string;
  onChangeCurrency: (curr: string) => void;
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartTotal?: number;
  onSelectGender?: (gender: 'men' | 'women') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onNavigateToAdmin,
  onOpenPdfCatalogue,
  onNavigateToJournal,
  onNavigateToAtelier,
  onNavigateToShop,
  user,
  searchQuery,
  onSearchChange,
  onSelectGender,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile left drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'MEN', action: () => { if (onSelectGender) onSelectGender('men'); onSelectCategory('all'); onNavigateToShop(); } },
    { label: 'WOMEN', action: () => { if (onSelectGender) onSelectGender('women'); onSelectCategory('all'); onNavigateToShop(); } },
    { label: 'RINGS', action: () => { onSelectCategory('rings'); onNavigateToShop(); } },
    { label: 'NECKLACES', action: () => { onSelectCategory('necklaces'); onNavigateToShop(); } },
    { label: 'EARRINGS', action: () => { onSelectCategory('earrings'); onNavigateToShop(); } },
    { label: 'BRACELETS', action: () => { onSelectCategory('bracelets'); onNavigateToShop(); } },
    { label: 'COLLECTIONS', action: () => { onSelectCategory('fine-collections'); onNavigateToShop(); } },
    { label: 'BESPOKE', action: () => { onSelectCategory('bespoke'); onNavigateToShop(); } },
    { 
      label: 'STUDIO', 
      isNew: true, 
      action: () => { onNavigateToAtelier(); } 
    },
  ];

  return (
    <header id="myntra-main-header" className={`sticky top-0 ${mobileMenuOpen ? 'z-[100]' : 'z-50'} w-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-b border-[#f5f5f6] font-sans`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-6 h-14 sm:h-20">
          
          {/* LEFT: MYNTRA-STYLE FASHION LOGO & MAIN NAVIGATION */}
          <div className="flex items-center gap-2 sm:gap-4 xl:gap-8 shrink-0">
            
            {/* Mobile / Tablet Hamburger Menu (Visible up to xl: 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-[#282c3f] hover:bg-gray-100 rounded-md xl:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo Mark */}
            <div 
              onClick={() => {
                onSelectCategory('all');
                onNavigateToShop();
              }}
              className="cursor-pointer flex items-center gap-1.5 sm:gap-2 group select-none shrink-0"
            >
              {/* Vibrant Brand Logo Provided by User */}
              <div className="relative w-8 h-6 sm:w-11 sm:h-8 flex items-center justify-center shrink-0">
                <img
                  src={userBrandLogo}
                  alt="NaxtTo Brand Logo"
                  className="w-full h-full object-contain drop-shadow-xs transition-transform group-hover:scale-105 duration-200"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tighter text-[#282c3f]">
                  Naxt<span className="bg-gradient-to-r from-[#F50087] via-[#F0501A] to-[#FFA033] bg-clip-text text-transparent">To</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#696e79] font-bold hidden xs:block">
                  LUXE JEWELLERY
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Visible on xl: screens where there is ample room) */}
            <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-6 h-full shrink-0">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="relative text-xs 2xl:text-[13px] font-extrabold tracking-wider text-[#282c3f] hover:text-[#ff3e6c] transition-colors py-6 select-none flex items-center gap-1 group whitespace-nowrap"
                >
                  <span>{link.label}</span>
                  {link.isNew && (
                    <span className="text-[9px] font-black uppercase text-[#ff3e6c] -top-1 relative animate-pulse tracking-normal">
                      NEW
                    </span>
                  )}
                  {/* Myntra hover bottom border line */}
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff3e6c] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>
              ))}
            </nav>

          </div>

          {/* CENTER: DESKTOP ROUNDED SEARCH BAR (Flexible width, never overlapping) */}
          <div className="hidden sm:flex flex-1 min-w-[160px] max-w-sm xl:max-w-md 2xl:max-w-xl mx-2 sm:mx-4">
            <div className="w-full relative flex items-center bg-[#f5f5f6] hover:bg-[#eaeaec] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d4d5d9] rounded-sm transition-all px-3 sm:px-4 py-2 sm:py-2.5">
              <Search className="w-4 h-4 text-[#696e79] shrink-0 mr-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigateToShop();
                }}
                placeholder="Search for products, brands and more"
                className="w-full text-xs sm:text-[13px] text-[#282c3f] placeholder:text-[#696e79] focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-[#696e79] hover:text-[#282c3f] p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: ICON + TEXT BUTTONS (Profile, Wishlist, Bag - Protected on mobile) */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-6 shrink-0">
            
            {/* PROFILE (Stacked Icon + Text with Flyout) */}
            <div 
              ref={profileRef}
              className="relative"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenAccount();
                }}
                className="flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[38px] sm:min-w-[48px]"
                aria-label="Profile"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                <span className="text-[10px] sm:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                  Profile
                </span>
              </button>

              {/* Myntra Profile Hover Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full pt-1 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-md shadow-2xl border border-[#eaeaec] py-3 text-[#282c3f]">
                    
                    {/* Welcome Box */}
                    <div className="px-4 pb-3 border-b border-[#f5f5f6]">
                      <p className="text-xs font-bold text-[#282c3f]">
                        Welcome, {user.name ? user.name.split(' ')[0] : 'NaxtTo'}
                      </p>
                      <p className="text-[11px] text-[#696e79] mt-0.5">
                        {user.email || 'anik@naxtto.shop'}
                      </p>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAccount();
                        }}
                        className="mt-2.5 w-full py-1.5 bg-white border border-[#eaeaec] hover:border-[#ff3e6c] hover:text-[#ff3e6c] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        MANAGE ACCOUNT
                      </button>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAccount();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-[#f5f5f6] flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#696e79]" />
                          <span>Orders &amp; Shipments</span>
                        </span>
                        <span className="text-[10px] text-[#ff3e6c] font-bold">Track</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenWishlist();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-[#f5f5f6] flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-[#696e79]" />
                          <span>Wishlist</span>
                        </span>
                        {wishlistCount > 0 && (
                          <span className="text-[10px] bg-[#ff3e6c] text-white px-1.5 py-0.2 rounded-full font-bold">
                            {wishlistCount}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-[#f5f5f6] pt-1 mt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onNavigateToAdmin) onNavigateToAdmin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#ff5722] hover:bg-orange-50 flex items-center gap-2"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Seller Hub / Atelier Admin</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* WISHLIST (Stacked Icon + Text with Count Badge) */}
            <button
              onClick={onOpenWishlist}
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[38px] sm:min-w-[48px]"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff3e6c] text-white text-[9px] sm:text-[10px] font-black rounded-full h-3.5 min-w-[14px] sm:h-4 sm:min-w-[16px] px-1 flex items-center justify-center ring-1 sm:ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                Wishlist
              </span>
            </button>

            {/* BAG / CART (Stacked Icon + Text with Count Badge) */}
            <button
              onClick={onOpenCart}
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[38px] sm:min-w-[48px]"
              aria-label="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff3e6c] text-white text-[9px] sm:text-[10px] font-black rounded-full h-3.5 min-w-[14px] sm:h-4 sm:min-w-[16px] px-1 flex items-center justify-center ring-1 sm:ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                Bag
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE FULL-WIDTH SEARCH BAR (Cleanly placed below top bar so icons never overflow) */}
      <div className="sm:hidden px-3 pb-2 pt-0.5 border-t border-gray-100">
        <div className="relative flex items-center bg-[#f5f5f6] hover:bg-[#eaeaec] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#ff3e6c] rounded-md transition-all px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#696e79] shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigateToShop();
            }}
            placeholder="Search for jewellery, rings, gold..."
            className="w-full text-xs text-[#282c3f] placeholder:text-[#696e79] focus:outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#696e79] hover:text-[#282c3f] p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* LEFT-SIDE SLIDING NAVIGATION DRAWER */}
      {/* Semi-transparent Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] transition-opacity duration-300 xl:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel (Slides in from the Left Side) */}
      <aside
        className={`fixed inset-y-0 left-0 w-[82vw] max-w-[320px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform xl:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-[#fafafa]">
          <div 
            onClick={() => {
              onSelectCategory('all');
              onNavigateToShop();
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer flex items-center gap-2 select-none"
          >
            <img
              src={userBrandLogo}
              alt="NaxtTo Brand Logo"
              className="w-7 h-5 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tighter text-[#282c3f]">
                Naxt<span className="bg-gradient-to-r from-[#F50087] via-[#F0501A] to-[#FFA033] bg-clip-text text-transparent">To</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#696e79] font-bold">
                LUXE JEWELLERY
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 -mr-1 text-[#282c3f] hover:bg-gray-200/80 rounded-full transition-colors active:scale-95"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card / Sign In Shortcut */}
        <div 
          onClick={() => {
            setMobileMenuOpen(false);
            onOpenAccount();
          }}
          className="mx-3 mt-3 p-3 bg-gradient-to-r from-[#fdf7f4] to-[#fef2f6] border border-[#fce4ec] rounded-lg cursor-pointer hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#ff3e6c]/10 flex items-center justify-center shrink-0 text-[#ff3e6c]">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#282c3f] truncate">
                {user?.name ? user.name : 'Welcome to NaxtTo'}
              </p>
              <p className="text-[10px] text-[#ff3e6c] font-semibold flex items-center gap-0.5">
                <span>{user?.name ? 'Manage Profile & Orders' : 'Sign In / Register'}</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#ff3e6c] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Categories List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#696e79]">
            Shop By Category
          </div>

          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                link.action();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs font-bold text-[#282c3f] py-2.5 px-3 hover:bg-[#f5f5f6] active:bg-[#eee] rounded-md flex items-center justify-between transition-colors"
            >
              <span className="tracking-wide">{link.label}</span>
              <div className="flex items-center gap-1.5">
                {link.isNew && (
                  <span className="text-[9px] bg-[#ff3e6c] text-white font-extrabold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-[#94969f]" />
              </div>
            </button>
          ))}

          {/* Quick Services Section */}
          <div className="pt-3 mt-2 border-t border-gray-100">
            <div className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#696e79]">
              Atelier Services
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWishlist();
              }}
              className="w-full text-left text-xs font-semibold text-[#282c3f] py-2 px-3 hover:bg-[#f5f5f6] rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#ff3e6c]" />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="text-[10px] bg-[#ff3e6c] text-white px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full text-left text-xs font-semibold text-[#282c3f] py-2 px-3 hover:bg-[#f5f5f6] rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#282c3f]" />
                <span>Shopping Bag</span>
              </div>
              {cartCount > 0 && (
                <span className="text-[10px] bg-[#ff3e6c] text-white px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateToAdmin) onNavigateToAdmin();
              }}
              className="w-full text-left text-xs font-bold text-[#ff5722] py-2 px-3 hover:bg-[#fff2ed] rounded-md flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-[#ff5722]" />
              <span>Seller Hub / Atelier Admin</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer (Trust Badges) */}
        <div className="p-3 border-t border-gray-100 bg-[#fafafa] text-[10px] text-[#696e79] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#282c3f]">
            <Sparkles className="w-3 h-3 text-[#ff3e6c]" />
            <span>100% Certified 18K Solid Gold & Diamonds</span>
          </div>
          <p className="text-[9px] text-[#696e79]">
            Complimentary Insured Pan-India & Global Express Delivery
          </p>
        </div>
      </aside>
    </header>
  );
};
