import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Product, 
  CartItem, 
  WishlistItem, 
  ProductCategory, 
  FilterOptions, 
  ProductReview, 
  UserProfile, 
  Order, 
  BlogPost 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INSTAGRAM_FEED, 
  BLOG_POSTS, 
  DEMO_USER 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductFilter } from './components/ProductFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AccountPage } from './components/AccountPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartDrawer } from './components/CartDrawer';
import { InstagramFeed } from './components/InstagramFeed';
import { NewsletterSignup } from './components/NewsletterSignup';
import { WishlistDrawer } from './components/WishlistDrawer';
import { BlogSection } from './components/BlogSection';
import { AtelierEthos } from './components/AtelierEthos';
import { Footer } from './components/Footer';
import { PdfCatalogueViewer } from './components/PdfCatalogueViewer';
import { AdminPanel } from './components/AdminPanel';
import { Check, Heart, ShoppingBag, ArrowUp } from 'lucide-react';
import { apiClient } from './services/api';

export default function App() {
  // 1. Core State & Local Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('naxtto_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('naxtto_cart');
    return saved ? JSON.parse(saved) : [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'US 6',
        selectedFinish: '18k-yellow-gold',
        quantity: 1
      }
    ];
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('naxtto_wishlist');
    return saved ? JSON.parse(saved) : [
      {
        product: INITIAL_PRODUCTS[1],
        addedAt: '2026-08-18'
      },
      {
        product: INITIAL_PRODUCTS[2],
        addedAt: '2026-08-17'
      }
    ];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('naxtto_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.email !== 'sophia.montgomery@atelier.com') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEMO_USER;
  });

  // Global store orders (for admin order management and patron sync)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_all_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Real Firebase Auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    import('./lib/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: firebaseUser.displayName || prev.name || firebaseUser.email?.split('@')[0] || 'Patron',
              email: firebaseUser.email || prev.email || '',
              avatar: firebaseUser.photoURL || prev.avatar || undefined,
              isLoggedIn: true,
              memberTier: prev.memberTier || 'NaxtTo Circle',
              memberSince: prev.memberSince || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }));
          }
        });
      });
    }).catch(err => {
      console.warn('Firebase auth listener notice:', err);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('naxtto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('naxtto_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('naxtto_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem('naxtto_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('naxtto_all_orders', JSON.stringify(orders));
  }, [orders]);

  // 2. Currency State
  const [currency, setCurrency] = useState('USD');
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    JPY: '¥'
  };
  const currencySymbol = currencySymbols[currency] || '$';

  // 3. Navigation View State: 'shop' | 'product-detail' | 'account' | 'checkout' | 'admin'
  const [currentView, setCurrentView] = useState<'shop' | 'product-detail' | 'account' | 'checkout' | 'admin'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Drawers & Overlays Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPdfCatalogueOpen, setIsPdfCatalogueOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 4. Checkout Promo & Gift Options
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>({
    code: 'NAXTTO10',
    discountPercent: 10,
    discountAmount: 0
  });
  const [giftWrapIncluded, setGiftWrapIncluded] = useState(true);
  const [giftMessage, setGiftMessage] = useState('With timeless love and gratitude.');

  // 5. Filter State
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    metals: [],
    styles: [],
    priceRange: [0, 3000],
    inStockOnly: false,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Section Refs for smooth scrolling
  const catalogRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const ethosRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToJournal = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      journalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToEthos = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      ethosRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 6. Filtering & Sorting Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (filterOptions.category !== 'all' && product.category !== filterOptions.category) {
        return false;
      }
      // Metal match
      if (filterOptions.metals.length > 0 && !filterOptions.metals.includes(product.metal)) {
        return false;
      }
      // Style match
      if (filterOptions.styles.length > 0 && !filterOptions.styles.includes(product.style)) {
        return false;
      }
      // Price range
      if (product.price > filterOptions.priceRange[1]) {
        return false;
      }
      // In-stock
      if (filterOptions.inStockOnly && !product.inStock) {
        return false;
      }
      // Search query
      if (filterOptions.searchQuery) {
        const q = filterOptions.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSub = product.subtitle.toLowerCase().includes(q);
        const matchesMetal = product.metalName.toLowerCase().includes(q);
        const matchesStyle = product.styleName.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesMetal && !matchesStyle) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filterOptions.sortBy === 'price-low') return a.price - b.price;
      if (filterOptions.sortBy === 'price-high') return b.price - a.price;
      if (filterOptions.sortBy === 'rating') return b.rating - a.rating;
      if (filterOptions.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // featured default
    });
  }, [products, filterOptions]);

  // 7. Cart Actions
  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedFinish?: any,
    quantity: number = 1
  ) => {
    const size = selectedSize || product.availableSizes?.[0] || 'Standard';
    const finish = selectedFinish || product.availableFinishes?.[0]?.type || product.metal;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedFinish === finish
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, selectedFinish: finish, quantity }];
      }
    });

    showToast(`Added "${product.name}" to your Atelier Bag`);
  };

  // Navigates directly to Checkout Page without popup
  const handleBuyNow = (product: Product, selectedSize?: string, selectedFinish?: any) => {
    handleAddToCart(product, selectedSize, selectedFinish, 1);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAccount = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateQuantity = (productId: string, newQty: number, size?: string, finish?: any) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId, size, finish);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedFinish === finish) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string, size?: string, finish?: any) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedSize === size && item.selectedFinish === finish)
    ));
    showToast('Item removed from Atelier Bag');
  };

  // 8. Wishlist Actions
  const isWishlisted = (productId: string) => {
    return wishlistItems.some(w => w.product.id === productId);
  };

  const handleToggleWishlist = (product: Product) => {
    if (isWishlisted(product.id)) {
      setWishlistItems(prev => prev.filter(w => w.product.id !== product.id));
      showToast(`Removed "${product.name}" from your Wishlist`);
    } else {
      setWishlistItems(prev => [...prev, { product, addedAt: new Date().toISOString() }]);
      showToast(`Saved "${product.name}" to your Personalized Wishlist`);
    }
  };

  const handleRemoveWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(w => w.product.id !== productId));
    showToast('Piece removed from Wishlist');
  };

  const handleMoveAllWishlistToCart = () => {
    wishlistItems.forEach(w => {
      handleAddToCart(w.product);
    });
    setWishlistItems([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast('All saved pieces moved to your Atelier Bag');
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
    showToast('Wishlist cleared');
  };

  // 9. Promo Actions
  const handleApplyPromo = (code: string): boolean => {
    const clean = code.toUpperCase().trim();
    if (clean === 'NAXTTO10') {
      setAppliedPromo({ code: 'NAXTTO10', discountPercent: 10, discountAmount: 0 });
      showToast('10% Atelier Welcome Discount Applied');
      return true;
    }
    if (clean === 'PRIVÉ50') {
      setAppliedPromo({ code: 'PRIVÉ50', discountPercent: 0, discountAmount: 50 });
      showToast('$50 Privé Salon Credit Applied');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Promotional code removed');
  };

  // 10. Reviews Action
  const handleAddReview = (productId: string, newRev: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => {
    const fullReview: ProductReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      helpfulCount: 0
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [fullReview, ...p.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: p.reviewsCount + 1,
          rating: avg
        };
      }
      return p;
    }));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        reviews: [fullReview, ...prev.reviews],
        reviewsCount: prev.reviewsCount + 1
      } : null);
    }

    showToast('Thank you. Your review has been recorded in the Atelier ledger.');
  };

  // 11. Order Completed Handler
  const handleOrderCompleted = (newOrder: Order) => {
    // Add to user order history and all store orders, then empty cart
    setUser(prev => ({
      ...prev,
      orderHistory: [newOrder, ...prev.orderHistory]
    }));
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    apiClient.createOrder(newOrder);
  };

  // 12. Admin CRUD Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    apiClient.createProduct(newProd);
    showToast(`Piece "${newProd.name}" successfully catalogued.`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    if (selectedProduct && selectedProduct.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
    apiClient.updateProduct(updatedProd.id, updatedProd);
    showToast(`Piece "${updatedProd.name}" updated successfully.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
      setCurrentView('shop');
    }
    apiClient.deleteProduct(productId);
    showToast('Piece removed from Atelier collection.');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUser(prev => ({
      ...prev,
      orderHistory: prev.orderHistory.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    }));
    apiClient.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId.slice(-6)} status updated to ${newStatus}.`);
  };

  const handleAdminSignOut = () => {
    localStorage.removeItem('naxtto_admin_auth');
    sessionStorage.removeItem('naxtto_admin_auth');
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setSelectedProduct(null);
    setCurrentView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Signed out of Administrator session.');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-white text-[#1d1d1f]">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-60 bg-[#1d1d1f] text-white px-4 py-3 rounded-sm shadow-2xl text-xs font-medium tracking-wide flex items-center gap-2.5 border border-[#e5e5ea]/20 animate-slideUp"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeCategory={filterOptions.category}
        onSelectCategory={(cat) => {
          setSelectedProduct(null);
          setCurrentView('shop');
          setFilterOptions({ ...filterOptions, category: cat });
          scrollToCatalog();
        }}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={handleOpenAccount}
        onNavigateToAdmin={() => {
          setSelectedProduct(null);
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPdfCatalogue={() => setIsPdfCatalogueOpen(true)}
        onNavigateToJournal={() => {
          setSelectedProduct(null);
          setCurrentView('shop');
          scrollToJournal();
        }}
        onNavigateToAtelier={() => {
          setSelectedProduct(null);
          setCurrentView('shop');
          scrollToEthos();
        }}
        onNavigateToShop={() => {
          setSelectedProduct(null);
          setCurrentView('shop');
          scrollToCatalog();
        }}
        currentCurrency={currency}
        onChangeCurrency={setCurrency}
        user={user}
        searchQuery={filterOptions.searchQuery}
        onSearchChange={(query) => {
          setFilterOptions(prev => ({ ...prev, searchQuery: query }));
        }}
      />

      {/* Dynamic Page Views: Dedicated Account Page, Admin Panel, Dedicated Checkout Page, Product Detail Page, or Home Catalog */}
      {currentView === 'admin' ? (
        <AdminPanel
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onBackToShop={() => {
            setCurrentView('shop');
            setSelectedProduct(null);
            scrollToCatalog();
          }}
          onSignOut={handleAdminSignOut}
          currencySymbol={currencySymbol}
        />
      ) : currentView === 'account' ? (
        <AccountPage
          user={user}
          onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
          onBackToShop={() => {
            setCurrentView('shop');
            setSelectedProduct(null);
            scrollToCatalog();
          }}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onNavigateToAdmin={() => {
            setSelectedProduct(null);
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currencySymbol={currencySymbol}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutPage
          cartItems={cartItems}
          currencySymbol={currencySymbol}
          appliedPromo={appliedPromo}
          giftWrapIncluded={giftWrapIncluded}
          giftMessage={giftMessage}
          onOrderCompleted={handleOrderCompleted}
          onBackToShop={() => {
            setCurrentView('shop');
            setSelectedProduct(null);
            scrollToCatalog();
          }}
          savedAddresses={user.savedAddresses}
          user={user}
          onApplyPromo={handleApplyPromo}
          onRemovePromo={handleRemovePromo}
        />
      ) : currentView === 'product-detail' && selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          onBack={() => {
            setSelectedProduct(null);
            setCurrentView('shop');
            scrollToCatalog();
          }}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setCurrentView('product-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={isWishlisted(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          currencySymbol={currencySymbol}
          onAddReview={handleAddReview}
          onSelectCategory={(cat) => {
            setSelectedProduct(null);
            setCurrentView('shop');
            setFilterOptions(prev => ({ ...prev, category: cat }));
            scrollToCatalog();
          }}
        />
      ) : (
        <>
          {/* Hero Banner Section */}
          <HeroSection
            onExploreCatalog={scrollToCatalog}
            onSelectCategory={(cat) => {
              setFilterOptions({ ...filterOptions, category: cat });
              scrollToCatalog();
            }}
            onExploreJournal={scrollToJournal}
            onOpenPdfCatalogue={() => setIsPdfCatalogueOpen(true)}
          />

          {/* Main Catalog & Filter Section */}
          <main ref={catalogRef} id="product-catalog-section" className="flex-1 scroll-mt-20 bg-white">
            <ProductFilter
              filterOptions={filterOptions}
              onChangeFilter={setFilterOptions}
              totalResults={filteredProducts.length}
            />

            {/* Product Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-white">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#f5f5f7] rounded-lg border border-[#e5e5ea] space-y-4 max-w-lg mx-auto shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#6e6e73]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">No creations match your current criteria</h3>
                  <p className="text-xs text-[#6e6e73]">
                    Try adjusting your precious metal, style archetype, or price filter to view available pieces.
                  </p>
                  <button
                    onClick={() => setFilterOptions({
                      category: 'all',
                      metals: [],
                      styles: [],
                      priceRange: [0, 3000],
                      inStockOnly: false,
                      sortBy: 'featured',
                      searchQuery: ''
                    })}
                    className="px-5 py-2.5 bg-[#1d1d1f] text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-black transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => {
                        setSelectedProduct(p);
                        setCurrentView('product-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onAddToCart={handleAddToCart}
                      isWishlisted={isWishlisted(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      currencySymbol={currencySymbol}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Shoppable Instagram Feed for Social Proof */}
          <InstagramFeed
            posts={INSTAGRAM_FEED}
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentView('product-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            currencySymbol={currencySymbol}
          />

          {/* Atelier Craftsmanship & 15-Page PDF Lookbook Catalogue Section */}
          <div ref={ethosRef} className="scroll-mt-16">
            <AtelierEthos onOpenFullscreenCatalogue={() => setIsPdfCatalogueOpen(true)} />
          </div>

          {/* Comprehensive SEO-Friendly Blog Section */}
          <div ref={journalRef} className="scroll-mt-16">
            <BlogSection
              posts={BLOG_POSTS}
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setCurrentView('product-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCart={handleAddToCart}
              currencySymbol={currencySymbol}
            />
          </div>

          {/* Email Signup Form for Newsletters */}
          <NewsletterSignup
            onSubscribed={(email) => {
              showToast(`Welcome to the Circle! Invitation sent to ${email}`);
              setUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, newsletterSubscribed: true }
              }));
            }}
          />
        </>
      )}

      {/* Comprehensive Luxury Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedProduct(null);
          setCurrentView('shop');
          setFilterOptions({ ...filterOptions, category: cat });
          scrollToCatalog();
        }}
        onNavigateToJournal={() => {
          setSelectedProduct(null);
          setCurrentView('shop');
          scrollToJournal();
        }}
        onNavigateToAtelier={() => {
          setSelectedProduct(null);
          setCurrentView('shop');
          scrollToEthos();
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigateToAdmin={() => {
          setSelectedProduct(null);
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Drawers and Overlays */}
      {/* 1. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleOpenCheckout}
        currencySymbol={currencySymbol}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        giftWrapIncluded={giftWrapIncluded}
        onToggleGiftWrap={setGiftWrapIncluded}
        giftMessage={giftMessage}
        onChangeGiftMessage={setGiftMessage}
      />

      {/* 2. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
        onClearWishlist={handleClearWishlist}
        currencySymbol={currencySymbol}
        user={user}
        onOpenAccount={handleOpenAccount}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setCurrentView('product-detail');
          setIsWishlistOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 3. Exact 15-Page PDF Lookbook Catalogue Viewer */}
      <PdfCatalogueViewer
        isOpen={isPdfCatalogueOpen}
        onClose={() => setIsPdfCatalogueOpen(false)}
      />
    </div>
  );
}
