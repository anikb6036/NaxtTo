import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Gem,
  Sliders
} from 'lucide-react';
import { ProductCategory, Product, UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';

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
  currentCurrency,
  onChangeCurrency,
  user,
  searchQuery,
  onSearchChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInlineSearchOpen, setIsInlineSearchOpen] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInlineSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isInlineSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (₹)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
    { code: 'JPY', symbol: '¥', label: 'JPY (¥)' }
  ];

  const navLinks = [
    { id: 'all', label: 'All Creations', action: () => { onSelectCategory('all'); onNavigateToShop(); } },
    { id: 'rings', label: 'Rings', action: () => { onSelectCategory('rings'); onNavigateToShop(); } },
    { id: 'necklaces', label: 'Necklaces', action: () => { onSelectCategory('necklaces'); onNavigateToShop(); } },
    { id: 'earrings', label: 'Earrings', action: () => { onSelectCategory('earrings'); onNavigateToShop(); } },
    { id: 'bracelets', label: 'Bracelets', action: () => { onSelectCategory('bracelets'); onNavigateToShop(); } },
    { id: 'fine-collections', label: 'Fine Collections', action: () => { onSelectCategory('fine-collections'); onNavigateToShop(); } },
    { id: 'bespoke', label: 'Bespoke Atelier', action: () => { onSelectCategory('bespoke'); onNavigateToShop(); } },
    { id: 'journal', label: 'The Journal', action: onNavigateToJournal },
    { id: 'atelier', label: 'Craft & Ethos', action: onNavigateToAtelier }
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Navigation Bar */}
      <nav 
        id="main-navbar"
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#e5e5ea] py-3 px-4 sm:px-6 lg:px-8' 
            : 'bg-white border-b border-[#e5e5ea] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Corner: Brand Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              {/* Mobile Menu Button (Small Screens) */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 -ml-1 text-[#1d1d1f] hover:opacity-50 transition-opacity lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Brand Logo at Left Corner */}
              <div 
                id="navbar-brand-logo"
                className="flex items-center cursor-pointer select-none pr-1 lg:pr-4 shrink-0" 
                onClick={() => { onSelectCategory('all'); onNavigateToShop(); }}
              >
                <BrandLogo 
                  layout="horizontal" 
                  size="md" 
                  variant="bronze" 
                  showSubtitle={true} 
                  subtitleText="FINE JEWELLERY" 
                />
              </div>

              {/* Desktop Navigation Links (Adjacent to Brand Logo) */}
              <div className="hidden lg:flex items-center space-x-3.5 xl:space-x-5 text-xs xl:text-sm font-sans text-[#1d1d1f] ml-1 xl:ml-2">
                <button
                  id="nav-shop-all"
                  onClick={() => { onSelectCategory('all'); onNavigateToShop(); }}
                  className={`hover:text-[#c5a059] transition-colors relative py-1 whitespace-nowrap ${
                    activeCategory === 'all' ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}
                >
                  Shop
                  {activeCategory === 'all' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1d1d1f]" />
                  )}
                </button>
                <button
                  id="nav-rings"
                  onClick={() => { onSelectCategory('rings'); onNavigateToShop(); }}
                  className={`hover:text-[#c5a059] transition-colors relative py-1 whitespace-nowrap ${
                    activeCategory === 'rings' ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}
                >
                  Rings
                </button>
                <button
                  id="nav-necklaces"
                  onClick={() => { onSelectCategory('necklaces'); onNavigateToShop(); }}
                  className={`hover:text-[#c5a059] transition-colors relative py-1 whitespace-nowrap ${
                    activeCategory === 'necklaces' ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}
                >
                  Necklaces
                </button>
                <button
                  id="nav-earrings"
                  onClick={() => { onSelectCategory('earrings'); onNavigateToShop(); }}
                  className={`hover:text-[#c5a059] transition-colors relative py-1 whitespace-nowrap ${
                    activeCategory === 'earrings' ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}
                >
                  Earrings
                </button>
                <button
                  id="nav-bracelets"
                  onClick={() => { onSelectCategory('bracelets'); onNavigateToShop(); }}
                  className={`hover:text-[#c5a059] transition-colors relative py-1 whitespace-nowrap ${
                    activeCategory === 'bracelets' ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}
                >
                  Bracelets
                </button>
                <button
                  id="nav-journal"
                  onClick={onNavigateToJournal}
                  className="hover:text-[#c5a059] transition-colors text-[#86868b] whitespace-nowrap"
                >
                  Archive
                </button>
                <button
                  id="nav-ethos"
                  onClick={onNavigateToAtelier}
                  className="hover:text-[#c5a059] transition-colors text-[#86868b] whitespace-nowrap"
                >
                  About
                </button>
              </div>
            </div>

            {/* Right Section: Search Bar + Utility Icons */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5 lg:space-x-4 text-xs xl:text-sm font-sans text-[#1d1d1f] shrink-0">
              {/* Mobile Search Button (Small Screens) */}
              <button
                id="mobile-search-btn"
                onClick={() => setIsInlineSearchOpen(!isInlineSearchOpen)}
                className="p-1.5 text-[#1d1d1f] hover:opacity-50 transition-opacity md:hidden"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Inline Search Bar */}
              <div 
                id="navbar-search-section"
                className="hidden md:flex items-center gap-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] focus-within:bg-[#f5f5f7] focus-within:ring-1 focus-within:ring-[#1d1d1f]/40 border border-[#e5e5ea] rounded-full px-3 py-1.5 w-36 lg:w-44 xl:w-60 transition-all shrink"
              >
                <Search className="w-3.5 h-3.5 text-[#86868b] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onNavigateToShop();
                    }
                  }}
                  placeholder="Search 18K, rings..."
                  className="bg-transparent text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-[#86868b] hover:text-[#1d1d1f] p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                id="nav-wishlist-btn"
                onClick={onOpenWishlist}
                className="flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors shrink-0 py-1"
                aria-label="Wishlist"
                title="View Saved Pieces"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden xl:inline text-xs">Wishlist</span>
                {wishlistCount > 0 && (
                  <span 
                    id="wishlist-count-badge"
                    className="bg-[#1d1d1f] text-white px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs font-sans font-medium"
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                id="nav-cart-btn"
                onClick={onOpenCart}
                className="flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors shrink-0 py-1"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Bag</span>
                {cartCount > 0 && (
                  <span 
                    id="nav-cart-badge"
                    className="bg-[#1d1d1f] text-white px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs font-sans font-medium"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Account Button (Rightmost Corner) */}
              <button
                id="nav-account-btn"
                onClick={onOpenAccount}
                className="flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors shrink-0 py-1"
                aria-label={user.isLoggedIn ? 'Account' : 'Login'}
                title={user.isLoggedIn ? `Account (${user.name})` : 'Login'}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{user.isLoggedIn ? 'Account' : 'Login'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Inline Search Bar Row */}
          {isInlineSearchOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-[#e5e5ea] flex items-center gap-2 bg-[#f5f5f7] rounded-md px-3 py-2 animate-fadeIn">
              <Search className="w-4 h-4 text-[#86868b] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onNavigateToShop();
                  }
                }}
                placeholder="Search rings, necklaces, 18K..."
                className="bg-transparent text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none w-full"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-[#86868b] hover:text-[#1d1d1f] p-0.5"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsInlineSearchOpen(false)}
                className="text-xs text-[#6e6e73] hover:text-[#1d1d1f] font-medium pl-1.5 border-l border-[#d2d2d7]"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Mobile Flyout Navigation */}
        {mobileMenuOpen && (
          <div 
            id="mobile-drawer-menu"
            className="lg:hidden border-t border-[#eeeae4] bg-[#fdfcfb] px-6 py-6 space-y-4 shadow-lg animate-fadeIn font-sans"
          >
            <div className="grid grid-cols-2 gap-3 text-sm font-normal text-[#2d2a26]">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => {
                    link.action();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2.5 px-3 border-b border-[#eeeae4] hover:text-[#c5a059] transition-colors ${
                    activeCategory === link.id ? 'font-semibold text-[#1a1816] border-[#1a1816]' : 'text-[#5a544b]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#eeeae4] flex items-center justify-between text-xs text-[#736c64]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                Milan & Antwerp Atelier
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onOpenAccount();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#1a1816] font-medium underline underline-offset-4"
                >
                  {user.isLoggedIn ? 'Account' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
