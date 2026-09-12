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
  ShieldCheck,
  FileText,
  LogOut,
  Gift,
  PhoneCall,
  SlidersHorizontal,
  ArrowRight
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
    <header id="myntra-main-header" className="sticky top-0 z-40 w-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-[#f5f5f6] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-18 sm:h-20">
          
          {/* LEFT: MYNTRA-STYLE FASHION LOGO & MAIN NAVIGATION */}
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-[#282c3f] hover:bg-gray-100 rounded-md lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo Mark */}
            <div 
              onClick={() => {
                onSelectCategory('all');
                onNavigateToShop();
              }}
              className="cursor-pointer flex items-center gap-2 group select-none"
            >
              {/* Vibrant Brand Logo Provided by User */}
              <div className="relative w-9 h-7 sm:w-11 sm:h-8 flex items-center justify-center">
                <img
                  src={userBrandLogo}
                  alt="NaxtTo Brand Logo"
                  className="w-full h-full object-contain drop-shadow-xs transition-transform group-hover:scale-105 duration-200"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-[#282c3f]">
                  Naxt<span className="bg-gradient-to-r from-[#F50087] via-[#F0501A] to-[#FFA033] bg-clip-text text-transparent">To</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#696e79] font-bold">
                  LUXE JEWELLERY
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Directly matching MEN, WOMEN, KIDS, HOME, BEAUTY, GENZ, STUDIO NEW) */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 h-full">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="relative text-xs sm:text-[13px] font-extrabold tracking-wider text-[#282c3f] hover:text-[#ff3e6c] transition-colors py-6 select-none flex items-center gap-1 group"
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

          {/* CENTER/RIGHT: MYNTRA ROUNDED SEARCH BAR */}
          <div className="flex-1 max-w-xs sm:max-w-md xl:max-w-xl mx-2 sm:mx-4">
            <div className="relative flex items-center bg-[#f5f5f6] hover:bg-[#eaeaec] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d4d5d9] rounded-sm transition-all px-3 sm:px-4 py-2 sm:py-2.5">
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

          {/* RIGHT: ICON + TEXT BUTTONS (Profile, Wishlist, Bag) */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            
            {/* PROFILE (Stacked Icon + Text with Flyout) */}
            <div 
              ref={profileRef}
              className="relative"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  onOpenAccount();
                }}
                className="flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 transition-colors"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                <span className="text-[10px] sm:text-[11px] font-bold mt-1 text-[#282c3f] group-hover:text-[#ff3e6c]">
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
                        Welcome, {user.name ? user.name.split(' ')[0] : 'Fine Jewellery Patron'}
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

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onOpenPdfCatalogue) onOpenPdfCatalogue();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-[#f5f5f6] flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#696e79]" />
                        <span>Download 2026 Lookbook PDF</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToAtelier();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold hover:bg-[#f5f5f6] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#696e79]" />
                        <span>Certificate Verification (IGI/GIA)</span>
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
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 transition-colors"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff3e6c] text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 text-[#282c3f] group-hover:text-[#ff3e6c]">
                Wishlist
              </span>
            </button>

            {/* BAG / CART (Stacked Icon + Text with Count Badge) */}
            <button
              onClick={onOpenCart}
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 transition-colors"
              aria-label="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff3e6c] text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold mt-1 text-[#282c3f] group-hover:text-[#ff3e6c]">
                Bag
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#eaeaec] bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-xs font-bold text-[#282c3f] py-2 px-3 hover:bg-[#f5f5f6] rounded flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.isNew && (
                  <span className="text-[9px] bg-[#ff3e6c] text-white font-extrabold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateToAdmin) onNavigateToAdmin();
              }}
              className="text-[#ff5722] font-bold flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Hub</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenPdfCatalogue) onOpenPdfCatalogue();
              }}
              className="text-[#282c3f] font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lookbook PDF</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
