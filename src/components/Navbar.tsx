import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Package,
  Store,
  LogOut,
  Gift,
  PhoneCall,
  SlidersHorizontal,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Product, ProductCategory, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { SearchSuggestionsDropdown, CategorySuggestion } from './SearchSuggestionsDropdown';
import { VoiceSearchButton } from './VoiceSearchButton';
import { parseVoiceSearch, VoiceParseResult } from '../utils/voiceSearchParser';

const HERITAGE_CATEGORIES: { id: ProductCategory; name: string; description: string; aliases: string[] }[] = [
  { id: 'shakha', name: 'Shankha (Pure Conch Shell)', description: 'Hand-carved authentic Bengali conch bangles', aliases: ['shakha', 'shankha', 'sakha', 'conch', 'white', 'shell', 'bangles'] },
  { id: 'pola', name: 'Pola (Crimson Coral)', description: 'Vibrant red coral & acrylic bridal bangles', aliases: ['pola', 'coral', 'red', 'acrylic', 'bridal bangles'] },
  { id: 'gold-badhano', name: '22K Gold Badhano', description: 'Heritage gold encased Shankha & Pola', aliases: ['gold', 'badhano', 'bandhano', '22k', 'gold plated', 'gold crafted', 'encased'] },
  { id: 'loha-badhano', name: 'Loha Badhano (Iron & Gold)', description: 'Traditional iron bangles with pure gold wire wrap', aliases: ['loha', 'iron', 'loha badhano', 'protective bangle'] },
  { id: 'bridal-combos', name: 'Bridal Combos & Sets', description: 'Complete traditional wedding Shankha-Pola sets', aliases: ['bridal', 'combo', 'wedding', 'set', 'marriage', 'biye', 'pair'] },
  { id: 'rings', name: 'Rings & Bands', description: 'Handcrafted gold & diamond rings', aliases: ['ring', 'finger ring', 'band', 'solitaire'] },
  { id: 'necklaces', name: 'Necklaces & Chains', description: 'Fine jewellery choker & chain designs', aliases: ['necklace', 'chain', 'choker', 'haar', 'pendant'] },
  { id: 'earrings', name: 'Earrings & Jhumkas', description: 'Traditional and contemporary earrings', aliases: ['earring', 'jhumka', 'stud', 'tops', 'kaan'] },
  { id: 'bracelets', name: 'Bracelets & Kadas', description: 'Gold & gemstone cuffs and bracelets', aliases: ['bracelet', 'kada', 'bangle', 'cuff'] },
  { id: 'fine-collections', name: 'Fine Collections', description: 'Curated royal heritage masterpieces', aliases: ['fine', 'collection', 'masterpiece', 'royal'] },
  { id: 'bespoke', name: 'Bespoke Atelier', description: 'Custom-crafted made-to-order heirlooms', aliases: ['bespoke', 'custom', 'customized', 'personalized'] }
];

const POPULAR_SEARCHES = [
  'Mayur Mukhi Shankha',
  '22K Gold Badhano',
  'Floral Crimson Pola',
  'Loha Badhano Band',
  'Complete Bridal Set',
  'Diamond Solitaire Ring',
  'Filigree Choker'
];

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
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  currencySymbol?: string;
  onApplyVoiceFilter?: (result: VoiceParseResult) => void;
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
  currentCurrency,
  products = INITIAL_PRODUCTS,
  onSelectProduct,
  currencySymbol = '₹',
  onApplyVoiceFilter
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [desktopSuggestionsOpen, setDesktopSuggestionsOpen] = useState(false);
  const [mobileSuggestionsOpen, setMobileSuggestionsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  // Recent searches persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 6);
      }
    } catch {
      // ignore
    }
    return ['Mayur Mukhi Shankha', '22K Gold Badhano', 'Bridal Combos'];
  });

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('naxtto_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== term);
      try {
        localStorage.setItem('naxtto_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('naxtto_recent_searches');
    } catch {}
  };

  // Safe catalogue of products
  const availableProducts = useMemo(() => {
    return Array.isArray(products) && products.length > 0 ? products : INITIAL_PRODUCTS;
  }, [products]);

  // Real-time matched categories
  const trimmed = searchQuery.trim().toLowerCase();
  const matchedCategories = useMemo<CategorySuggestion[]>(() => {
    if (!trimmed) return [];
    return HERITAGE_CATEGORIES.filter(cat => {
      return (
        cat.name.toLowerCase().includes(trimmed) ||
        cat.id.toLowerCase().includes(trimmed) ||
        cat.description.toLowerCase().includes(trimmed) ||
        cat.aliases.some(alias => alias.toLowerCase().includes(trimmed) || trimmed.includes(alias.toLowerCase()))
      );
    }).map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      itemCount: availableProducts.filter(p => p.category === cat.id).length
    })).slice(0, 3);
  }, [trimmed, availableProducts]);

  // Real-time matched products
  const matchedProducts = useMemo<Product[]>(() => {
    if (!trimmed) return [];
    const matches = availableProducts.filter(p => {
      return (
        p.name.toLowerCase().includes(trimmed) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(trimmed)) ||
        (p.metalName && p.metalName.toLowerCase().includes(trimmed)) ||
        (p.styleName && p.styleName.toLowerCase().includes(trimmed)) ||
        p.category.toLowerCase().includes(trimmed) ||
        (p.description && p.description.toLowerCase().includes(trimmed))
      );
    });

    matches.sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(trimmed);
      const bNameStarts = b.name.toLowerCase().startsWith(trimmed);
      if (aNameStarts && !bNameStarts) return -1;
      if (!aNameStarts && bNameStarts) return 1;

      const aNameIncludes = a.name.toLowerCase().includes(trimmed);
      const bNameIncludes = b.name.toLowerCase().includes(trimmed);
      if (aNameIncludes && !bNameIncludes) return -1;
      if (!aNameIncludes && bNameIncludes) return 1;

      return 0;
    });

    return matches;
  }, [trimmed, availableProducts]);

  const displayedProducts = useMemo(() => {
    return matchedProducts.slice(0, 5);
  }, [matchedProducts]);

  // Action handlers
  const handleSelectCategory = (categoryId: ProductCategory) => {
    const matched = HERITAGE_CATEGORIES.find(c => c.id === categoryId);
    if (matched) saveRecentSearch(matched.name.split(' (')[0]);
    onSelectCategory(categoryId);
    onNavigateToShop();
    setDesktopSuggestionsOpen(false);
    setMobileSuggestionsOpen(false);
    setSelectedIndex(-1);
  };

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.name);
    setDesktopSuggestionsOpen(false);
    setMobileSuggestionsOpen(false);
    setSelectedIndex(-1);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onSearchChange(product.name);
      onNavigateToShop();
    }
  };

  const handleSearchSubmit = (term: string) => {
    const clean = term.trim();
    if (clean) saveRecentSearch(clean);
    onSearchChange(clean);
    onNavigateToShop();
    setDesktopSuggestionsOpen(false);
    setMobileSuggestionsOpen(false);
    setSelectedIndex(-1);
  };

  const handleVoiceTranscript = (text: string) => {
    const clean = text.trim();
    if (clean) {
      saveRecentSearch(clean);
      
      // Execute Keyword-to-Category and Filter Mapping logic
      const parsed = parseVoiceSearch(clean);

      if (onApplyVoiceFilter) {
        onApplyVoiceFilter(parsed);
      } else {
        if (parsed.category) {
          onSelectCategory(parsed.category);
        }
        onSearchChange(parsed.cleanedQuery || clean);
        onNavigateToShop();
      }

      setDesktopSuggestionsOpen(false);
      setMobileSuggestionsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Keyboard navigation
  const totalSelectableItems = matchedCategories.length + displayedProducts.length + (trimmed ? 1 : 0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!desktopSuggestionsOpen && !mobileSuggestionsOpen) {
        setDesktopSuggestionsOpen(true);
        setSelectedIndex(0);
        return;
      }
      setSelectedIndex(prev => (prev + 1 < totalSelectableItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : totalSelectableItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < matchedCategories.length) {
        const cat = matchedCategories[selectedIndex];
        handleSelectCategory(cat.id);
      } else if (
        selectedIndex >= matchedCategories.length &&
        selectedIndex < matchedCategories.length + displayedProducts.length
      ) {
        const prod = displayedProducts[selectedIndex - matchedCategories.length];
        handleSelectProduct(prod);
      } else {
        handleSearchSubmit(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setDesktopSuggestionsOpen(false);
      setMobileSuggestionsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Close profile dropdown and suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (desktopSearchContainerRef.current && !desktopSearchContainerRef.current.contains(target)) {
        setDesktopSuggestionsOpen(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target)) {
        setMobileSuggestionsOpen(false);
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
    { 
      label: 'ALL SAKHA POLA', 
      shortLabel: 'ALL',
      action: () => { onSelectCategory('all'); onNavigateToShop(); } 
    },
    { 
      label: 'SHANKHA', 
      shortLabel: 'SHANKHA',
      action: () => { onSelectCategory('shakha'); onNavigateToShop(); } 
    },
    { 
      label: 'POLA', 
      shortLabel: 'POLA',
      action: () => { onSelectCategory('pola'); onNavigateToShop(); } 
    },
    { 
      label: '22K GOLD BADHANO', 
      shortLabel: 'GOLD BADHANO',
      isNew: true, 
      action: () => { onSelectCategory('gold-badhano'); onNavigateToShop(); } 
    },
    { 
      label: 'LOHA BADHANO', 
      shortLabel: 'LOHA',
      action: () => { onSelectCategory('loha-badhano'); onNavigateToShop(); } 
    },
    { 
      label: 'BRIDAL COMBOS', 
      shortLabel: 'BRIDAL',
      action: () => { onSelectCategory('bridal-combos'); onNavigateToShop(); } 
    },
    { 
      label: 'ATELIER', 
      shortLabel: 'ATELIER',
      action: () => { onNavigateToAtelier(); } 
    },
    { 
      label: 'JOURNAL', 
      shortLabel: 'JOURNAL',
      action: () => { onNavigateToJournal(); } 
    },
  ];

  return (
    <header id="myntra-main-header" className={`sticky top-0 ${mobileMenuOpen ? 'z-[100]' : 'z-50'} w-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-b border-[#f5f5f6] font-sans overflow-x-clip`}>
      <div className="w-full max-w-[1600px] mx-auto px-2.5 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 xl:gap-4 2xl:gap-6 h-14 sm:h-18 2xl:h-20">
          
          {/* LEFT: MYNTRA-STYLE FASHION LOGO & MAIN NAVIGATION */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 2xl:gap-8 shrink-0">
            
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
              className="cursor-pointer flex items-center group select-none shrink-0"
            >
              {/* Brand Typography */}
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-[#282c3f] transition-transform group-hover:scale-[1.02] duration-200">
                  Naxt<span className="text-[#FF3F6C]">To</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#696e79] font-bold hidden xs:block">
                  SAKHA POLA ATELIER
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Adaptive labels and spacing for seamless fit across 1280px to 4K) */}
            <nav className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-5 h-full shrink-0">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="relative text-[11px] xl:text-[11.5px] 2xl:text-[13px] font-extrabold tracking-tight 2xl:tracking-wider text-[#282c3f] hover:text-[#ff3e6c] transition-colors py-5 2xl:py-6 select-none flex items-center gap-1 group whitespace-nowrap"
                >
                  <span className="hidden 2xl:inline">{link.label}</span>
                  <span className="2xl:hidden">{link.shortLabel}</span>
                  {link.isNew && (
                    <span className="text-[8.5px] 2xl:text-[9px] font-black uppercase text-[#ff3e6c] -top-1 relative animate-pulse tracking-normal">
                      NEW
                    </span>
                  )}
                  {/* Myntra hover bottom border line */}
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff3e6c] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </button>
              ))}
            </nav>

          </div>

          {/* CENTER: DESKTOP ROUNDED SEARCH BAR (Flexible width, perfectly responsive without squeezing buttons) */}
          <div ref={desktopSearchContainerRef} className="hidden sm:flex flex-1 min-w-[140px] xl:min-w-[180px] max-w-sm xl:max-w-md 2xl:max-w-xl mx-2 xl:mx-4 relative">
            <div className="w-full relative flex items-center bg-[#f5f5f6] hover:bg-[#eaeaec] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d4d5d9] rounded-sm transition-all px-3 sm:px-3.5 2xl:px-4 py-2 sm:py-2.5">
              <Search className="w-4 h-4 text-[#696e79] shrink-0 mr-2 xl:mr-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setDesktopSuggestionsOpen(true);
                  setSelectedIndex(-1);
                }}
                onFocus={() => {
                  setDesktopSuggestionsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search Shankha, Pola, Gold Badhano, Loha..."
                className="w-full text-xs sm:text-[13px] text-[#282c3f] placeholder:text-[#696e79] focus:outline-none bg-transparent"
              />
              <div className="flex items-center gap-1 shrink-0 ml-1.5">
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearchChange('');
                      setSelectedIndex(-1);
                      searchInputRef.current?.focus();
                    }}
                    className="text-[#696e79] hover:text-[#282c3f] p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <VoiceSearchButton
                  onTranscript={handleVoiceTranscript}
                  size="md"
                />
              </div>
            </div>

            <SearchSuggestionsDropdown
              isOpen={desktopSuggestionsOpen}
              query={searchQuery}
              matchedCategories={matchedCategories}
              matchedProducts={displayedProducts}
              totalProductMatches={matchedProducts.length}
              recentSearches={recentSearches}
              popularSearches={POPULAR_SEARCHES}
              selectedIndex={selectedIndex}
              currencySymbol={currencySymbol || (currentCurrency === 'INR' ? '₹' : currentCurrency)}
              onSelectCategory={handleSelectCategory}
              onSelectProduct={handleSelectProduct}
              onSearchSubmit={handleSearchSubmit}
              onSelectRecentSearch={(term) => {
                onSearchChange(term);
                handleSearchSubmit(term);
              }}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              onClearAllRecentSearches={handleClearAllRecentSearches}
              onClose={() => setDesktopSuggestionsOpen(false)}
            />
          </div>

          {/* RIGHT: ICON + TEXT BUTTONS (Profile, Wishlist, Bag - Fully protected from clipping) */}
          <div className="flex items-center gap-1.5 sm:gap-3 xl:gap-4 2xl:gap-6 shrink-0">
            
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
                className="flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[36px] sm:min-w-[42px] 2xl:min-w-[48px] shrink-0"
                aria-label="Profile"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#282c3f] group-hover:text-[#ff3e6c] stroke-[1.8]" />
                <span className="text-[10px] 2xl:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                  {user.isLoggedIn ? (user.name ? user.name.split(' ')[0] : 'Profile') : 'Login'}
                </span>
              </button>

              {/* Myntra Profile Hover Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full pt-1 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-md shadow-2xl border border-[#eaeaec] py-3 text-[#282c3f]">
                    
                    {/* Welcome Box */}
                    <div className="px-4 pb-3 border-b border-[#f5f5f6]">
                      {user.isLoggedIn ? (
                        <>
                          <p className="text-xs font-bold text-[#282c3f]">
                            Welcome, {user.name ? user.name.split(' ')[0] : 'Patron'}
                          </p>
                          <p className="text-[11px] text-[#696e79] mt-0.5">
                            {user.email || 'Patron Account'}
                          </p>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenAccount();
                            }}
                            className="mt-2.5 w-full py-1.5 bg-white border border-[#eaeaec] hover:border-[#ff3e6c] hover:text-[#ff3e6c] text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                          >
                            MANAGE ACCOUNT
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-[#282c3f]">
                            Welcome Patron
                          </p>
                          <p className="text-[11px] text-[#696e79] mt-0.5">
                            To access orders, wishlist &amp; bag
                          </p>
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenAccount();
                            }}
                            className="mt-2.5 w-full py-2 bg-[#ff3f6c] hover:bg-[#e0355d] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-sm text-center"
                          >
                            LOGIN / SIGNUP
                          </button>
                        </>
                      )}
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
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[36px] sm:min-w-[42px] 2xl:min-w-[48px] shrink-0"
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
              <span className="text-[10px] 2xl:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                Wishlist
              </span>
            </button>

            {/* BAG / CART (Stacked Icon + Text with Count Badge) */}
            <button
              onClick={onOpenCart}
              className="relative flex flex-col items-center justify-center text-[#282c3f] hover:text-[#ff3e6c] group p-1 sm:p-1.5 transition-colors min-w-[36px] sm:min-w-[42px] 2xl:min-w-[48px] shrink-0"
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
              <span className="text-[10px] 2xl:text-[11px] font-bold mt-0.5 sm:mt-1 text-[#282c3f] group-hover:text-[#ff3e6c] leading-none whitespace-nowrap">
                Bag
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE FULL-WIDTH SEARCH BAR (Cleanly placed below top bar so icons never overflow) */}
      <div ref={mobileSearchContainerRef} className="sm:hidden px-3 pb-2 pt-0.5 border-t border-gray-100 relative">
        <div className="relative flex items-center bg-[#f5f5f6] hover:bg-[#eaeaec] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#ff3e6c] rounded-md transition-all px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#696e79] shrink-0 mr-2" />
          <input
            ref={mobileSearchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setMobileSuggestionsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setMobileSuggestionsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for jewellery, rings, gold..."
            className="w-full text-xs text-[#282c3f] placeholder:text-[#696e79] focus:outline-none bg-transparent"
          />
          <div className="flex items-center gap-1 shrink-0 ml-1.5">
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setSelectedIndex(-1);
                  mobileSearchInputRef.current?.focus();
                }}
                className="text-[#696e79] hover:text-[#282c3f] p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <VoiceSearchButton
              onTranscript={handleVoiceTranscript}
              size="sm"
            />
          </div>
        </div>

        <SearchSuggestionsDropdown
          isOpen={mobileSuggestionsOpen}
          query={searchQuery}
          matchedCategories={matchedCategories}
          matchedProducts={displayedProducts}
          totalProductMatches={matchedProducts.length}
          recentSearches={recentSearches}
          popularSearches={POPULAR_SEARCHES}
          selectedIndex={selectedIndex}
          currencySymbol={currencySymbol || (currentCurrency === 'INR' ? '₹' : currentCurrency)}
          onSelectCategory={handleSelectCategory}
          onSelectProduct={handleSelectProduct}
          onSearchSubmit={handleSearchSubmit}
          onSelectRecentSearch={(term) => {
            onSearchChange(term);
            handleSearchSubmit(term);
          }}
          onRemoveRecentSearch={handleRemoveRecentSearch}
          onClearAllRecentSearches={handleClearAllRecentSearches}
          onClose={() => setMobileSuggestionsOpen(false)}
        />
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
            className="cursor-pointer flex items-center select-none"
          >
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg tracking-tighter text-[#282c3f]">
                Naxt<span className="text-[#FF3F6C]">To</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#696e79] font-bold">
                SAKHA POLA ATELIER
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
          <div className="font-bold text-[#282c3f]">
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
