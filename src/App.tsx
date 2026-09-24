import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  WishlistItem, 
  ProductCategory, 
  FilterOptions, 
  ProductReview, 
  UserProfile, 
  Order, 
  BlogPost,
  Address,
  WowDealItem,
  TopRatedItem,
  HeroBannerSlide
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INSTAGRAM_FEED, 
  BLOG_POSTS, 
  DEMO_USER 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { MyntraCouponStrip } from './components/MyntraCouponStrip';
import { MyntraHeroBanner } from './components/MyntraHeroBanner';
import { DEFAULT_WOW_DEALS } from './components/MyntraWowDeals';
import { MyntraSideRibbon } from './components/MyntraSideRibbon';
import { MyntraNotificationFab } from './components/MyntraNotificationFab';
import { CategoryNavStrip } from './components/CategoryNavStrip';
import { DealsCarousel } from './components/DealsCarousel';
import { DEFAULT_TOP_RATED_ITEMS } from './components/TopRatedSection';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { QuickServicesStrip } from './components/QuickServicesStrip';
import { HeroSection, DEFAULT_HERO_SLIDES } from './components/HeroSection';
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
import { ChannelPartners } from './components/ChannelPartners';
import { Footer } from './components/Footer';
import { PdfCatalogueViewer } from './components/PdfCatalogueViewer';
import { AdminPanel } from './components/AdminPanel';
import { StaffAuthModal } from './components/StaffAuthModal';
import { LoginPromptModal } from './components/LoginPromptModal';
import { Check, Heart, ShoppingBag, ArrowUp } from 'lucide-react';
import { apiClient } from './services/api';
import { sendOrderConfirmationEmail } from './services/emailService';
import {
  getUserStorageKey,
  loadUserCart,
  saveUserCart,
  loadUserWishlist,
  saveUserWishlist,
  loadUserAddresses,
  saveUserAddresses,
  clearLoggedOutSession,
  syncUserDataToFirestore,
  fetchUserDataFromFirestore,
  safeSetItem,
  saveUserProfile,
  sanitizeOrderForStorage,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  clearAllOrdersFromFirestore,
  subscribeToAllOrders,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeToAllProducts,
  getDeletedProductIds,
  recordProductDeletion,
  subscribeToDeletedProducts,
  getDeletedOrderIds,
  recordOrderDeletion,
  clearAllOrderRecords,
  DUMMY_ORDER_IDENTIFIERS
} from './utils/userStorage';
import { parseRouteFromLocation, syncBrowserUrl, AppView } from './utils/routes';
import { VoiceParseResult } from './utils/voiceSearchParser';

export default function App() {
  // 1. Core State & Local Persistence (Filtered by deleted product tombstones)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const deletedIds = getDeletedProductIds();
      const deletedSet = new Set(deletedIds);
      const saved = localStorage.getItem('naxtto_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: Product) => !deletedSet.has(p.id));
        }
      }
      return INITIAL_PRODUCTS.filter(p => !deletedSet.has(p.id));
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('naxtto_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn && parsed.email && parsed.email !== 'sophia.montgomery@atelier.com') {
          const key = getUserStorageKey(parsed);
          const loadedAddresses = loadUserAddresses(key);
          return {
            ...parsed,
            savedAddresses: loadedAddresses.length > 0 ? loadedAddresses : (parsed.savedAddresses || [])
          };
        }
      }
    } catch {
      // ignore
    }
    return DEMO_USER;
  });

  // Bag / Cart state (strictly user-scoped; empty when logged out)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedUser = localStorage.getItem('naxtto_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.isLoggedIn) {
          const key = getUserStorageKey(parsed);
          return loadUserCart(key);
        }
      }
    } catch {
      // ignore
    }
    clearLoggedOutSession();
    return [];
  });

  // Wishlist state (strictly user-scoped; empty when logged out)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const savedUser = localStorage.getItem('naxtto_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.isLoggedIn) {
          const key = getUserStorageKey(parsed);
          return loadUserWishlist(key);
        }
      }
    } catch {
      // ignore
    }
    clearLoggedOutSession();
    return [];
  });

  // Active state references to prevent stale closures during login/logout cycles
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  const wishlistItemsRef = useRef(wishlistItems);
  wishlistItemsRef.current = wishlistItems;

  const userRef = useRef(user);
  userRef.current = user;

  const prevUserKeyRef = useRef<string | null>(getUserStorageKey(user));

  // Global store orders (for admin order management and patron sync)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_all_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const deleted = getDeletedOrderIds();
          const clean = parsed.filter(o => 
            o && 
            !deleted.has(o.id) && 
            !deleted.has(o.orderNumber) && 
            !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
            !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
          );
          if (clean.length !== parsed.length) {
            safeSetItem('naxtto_all_orders', JSON.stringify(clean));
          }
          return clean;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Storefront WOW DEALS Merchandising State
  const [wowDeals, setWowDeals] = useState<WowDealItem[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_wow_deals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved wow deals', e);
    }
    return DEFAULT_WOW_DEALS;
  });

  const [wowDealsHeader, setWowDealsHeader] = useState<{ headline: string; subheadline: string; emoji: string }>(() => {
    try {
      const saved = localStorage.getItem('naxtto_wow_deals_header');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { headline: 'WOW DEALS', subheadline: 'Big Brands, Even Bigger Savings', emoji: '🤩' };
  });

  // Fetch backend wow deals on initial mount
  useEffect(() => {
    apiClient.getWowDeals().then(res => {
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setWowDeals(res.data);
      }
    }).catch(() => {});
  }, []);

  const handleUpdateWowDeals = async (newDeals: WowDealItem[]) => {
    setWowDeals(newDeals);
    safeSetItem('naxtto_wow_deals', JSON.stringify(newDeals));
    try {
      await apiClient.updateWowDeals(newDeals);
    } catch (err) {
      console.warn('Failed to sync wow deals to backend', err);
    }
  };

  const handleUpdateWowDealsHeader = (headline: string, subheadline: string, emoji: string) => {
    const updated = { headline, subheadline, emoji };
    setWowDealsHeader(updated);
    safeSetItem('naxtto_wow_deals_header', JSON.stringify(updated));
  };

  // Storefront Top Rated in Fine Jewellery Merchandising State
  const [topRatedItems, setTopRatedItems] = useState<TopRatedItem[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_top_rated_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved top rated items', e);
    }
    return DEFAULT_TOP_RATED_ITEMS;
  });

  const [topRatedHeader, setTopRatedHeader] = useState<{ headline: string; subheadline: string; buttonText: string }>(() => {
    try {
      const saved = localStorage.getItem('naxtto_top_rated_header');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      headline: 'Top Rated in Fine Jewellery',
      subheadline: 'Certified 18K Hallmarked pieces trusted by 10,000+ patrons',
      buttonText: 'VIEW ALL'
    };
  });

  // Fetch backend top rated on initial mount
  useEffect(() => {
    apiClient.getTopRated().then(res => {
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setTopRatedItems(res.data);
      }
      if (res?.header) {
        setTopRatedHeader(prev => ({
          headline: res.header.title || prev.headline,
          subheadline: res.header.subtitle || prev.subheadline,
          buttonText: res.header.buttonText || prev.buttonText
        }));
      }
    }).catch(() => {});
  }, []);

  const handleUpdateTopRatedItems = async (newItems: TopRatedItem[]) => {
    setTopRatedItems(newItems);
    safeSetItem('naxtto_top_rated_items', JSON.stringify(newItems));
    try {
      await apiClient.updateTopRated(newItems);
    } catch (err) {
      console.warn('Failed to sync top rated to backend', err);
    }
  };

  const handleUpdateTopRatedHeader = async (headline: string, subheadline: string, buttonText: string) => {
    const updated = { headline, subheadline, buttonText };
    setTopRatedHeader(updated);
    safeSetItem('naxtto_top_rated_header', JSON.stringify(updated));
    try {
      await apiClient.updateTopRated(topRatedItems, {
        title: headline,
        subtitle: subheadline,
        buttonText: buttonText
      });
    } catch (err) {
      console.warn('Failed to sync top rated header to backend', err);
    }
  };

  // Storefront Hero Banner Carousel State (managed via admin panel)
  const [heroBanners, setHeroBanners] = useState<HeroBannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('naxtto_hero_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved hero banners', e);
    }
    return DEFAULT_HERO_SLIDES;
  });

  // Fetch backend hero banners on initial mount
  useEffect(() => {
    apiClient.getHeroBanners().then(res => {
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setHeroBanners(res.data);
      }
    }).catch(() => {});
  }, []);

  const handleUpdateHeroBanners = async (newSlides: HeroBannerSlide[]) => {
    setHeroBanners(newSlides);
    safeSetItem('naxtto_hero_banners', JSON.stringify(newSlides));
    try {
      await apiClient.updateHeroBanners(newSlides);
    } catch (err) {
      console.warn('Failed to sync hero banners to backend', err);
    }
  };

  // Fetch orders from backend API and sync with local state & storage
  const refreshOrders = useCallback(async () => {
    try {
      const serverOrders = await apiClient.getOrders();
      if (Array.isArray(serverOrders)) {
        const deleted = getDeletedOrderIds();
        const valid = serverOrders.filter(o => 
          o && 
          !deleted.has(o.id) && 
          !deleted.has(o.orderNumber) && 
          !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
          !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
        );
        const sorted = [...valid].sort((a, b) => {
          const timeA = new Date(a.date || (a as any).createdAt || 0).getTime();
          const timeB = new Date(b.date || (b as any).createdAt || 0).getTime();
          return timeB - timeA;
        });
        setOrders(sorted);
        safeSetItem('naxtto_all_orders', JSON.stringify(sorted.slice(0, 50).map(sanitizeOrderForStorage)));
      }
    } catch (err) {
      console.warn('Orders sync notice:', err);
    }
  }, []);

  // Fetch initial orders on app load
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // Real-time Firestore cloud orders listener for Admin Panel & Patron tracking
  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((remoteOrders) => {
      const deleted = getDeletedOrderIds();
      const valid = (remoteOrders || []).filter(o => 
        o && 
        !deleted.has(o.id) && 
        !deleted.has(o.orderNumber) && 
        !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
        !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
      );

      const sorted = [...valid].sort((a, b) => {
        const timeA = new Date((a as any).createdAt || a.date || 0).getTime();
        const timeB = new Date((b as any).createdAt || b.date || 0).getTime();
        return timeB - timeA;
      });

      setOrders(sorted);
      safeSetItem('naxtto_all_orders', JSON.stringify(sorted.slice(0, 50).map(sanitizeOrderForStorage)));

      // Sync order status updates to current patron user.orderHistory in real time
      setUser(prev => {
        if (!prev || !prev.orderHistory || prev.orderHistory.length === 0) return prev;
        const cleanedHistory = prev.orderHistory.filter(o => 
          !deleted.has(o.id) && 
          !deleted.has(o.orderNumber) && 
          !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
          !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
        );
        return { ...prev, orderHistory: cleanedHistory };
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Synchronize catalog products with Supabase / Postgres and Firestore
  useEffect(() => {
    // 1. Fetch initial products from backend (Supabase / Postgres)
    apiClient.getProducts().then((serverProds) => {
      if (Array.isArray(serverProds)) {
        const deletedSet = new Set(getDeletedProductIds());
        const validServerProds = serverProds.filter(p => !deletedSet.has(p.id));
        setProducts(prev => {
          const currentDeleted = new Set(getDeletedProductIds());
          const map = new Map<string, Product>();
          prev.filter(p => !currentDeleted.has(p.id)).forEach(p => map.set(p.id, p));
          validServerProds.filter(p => !currentDeleted.has(p.id)).forEach(p => map.set(p.id, p));
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('naxtto_products', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    }).catch(err => console.warn('Backend products initial sync notice:', err));

    // 2. Real-time Firestore cloud products listener
    const unsubProds = subscribeToAllProducts((remoteProds) => {
      if (remoteProds) {
        const deletedSet = new Set(getDeletedProductIds());
        const validRemoteProds = remoteProds.filter(p => !deletedSet.has(p.id));
        setProducts(prev => {
          const currentDeleted = new Set(getDeletedProductIds());
          const map = new Map<string, Product>();
          prev.filter(p => !currentDeleted.has(p.id)).forEach(p => map.set(p.id, p));
          validRemoteProds.filter(p => !currentDeleted.has(p.id)).forEach(p => map.set(p.id, p));
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('naxtto_products', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    });

    // 3. Real-time Firestore deletion tombstone listener (cross-client sync)
    const unsubDeleted = subscribeToDeletedProducts((deletedIds) => {
      if (deletedIds && deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);
        setProducts(prev => prev.filter(p => !deletedSet.has(p.id)));
        setCartItems(prev => prev.filter(item => !deletedSet.has(item.product?.id)));
        setWishlistItems(prev => prev.filter(item => !deletedSet.has(item.product?.id)));
        setSelectedProduct(prev => (prev && deletedSet.has(prev.id) ? null : prev));
      }
    });

    // 4. In-window local deletion custom event listener
    const handleLocalProductDeleted = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId: string }>;
      const pId = customEvent.detail?.productId;
      if (!pId) return;
      setProducts(prev => prev.filter(p => p.id !== pId));
      setCartItems(prev => prev.filter(item => item.product?.id !== pId));
      setWishlistItems(prev => prev.filter(item => item.product?.id !== pId));
      setSelectedProduct(prev => (prev?.id === pId ? null : prev));
    };
    window.addEventListener('naxtto_product_deleted', handleLocalProductDeleted);

    return () => {
      unsubProds();
      unsubDeleted();
      window.removeEventListener('naxtto_product_deleted', handleLocalProductDeleted);
    };
  }, []);

  // One-time startup purge to guarantee no dummy orders linger in storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('naxtto_all_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const deleted = getDeletedOrderIds();
          const clean = parsed.filter(o => 
            o && 
            !deleted.has(o.id) && 
            !deleted.has(o.orderNumber) && 
            !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
            !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
          );
          safeSetItem('naxtto_all_orders', JSON.stringify(clean));
          setOrders(clean);
        }
      }
    } catch {}
  }, []);

  // Listen to cross-window storage updates and local dispatch events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'naxtto_all_orders') {
        if (!e.newValue) {
          setOrders([]);
          return;
        }
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            const deleted = getDeletedOrderIds();
            const clean = parsed.filter(o => 
              o && 
              !deleted.has(o.id) && 
              !deleted.has(o.orderNumber) && 
              !DUMMY_ORDER_IDENTIFIERS.has(o.id) && 
              !DUMMY_ORDER_IDENTIFIERS.has(o.orderNumber)
            );
            setOrders(clean);
          }
        } catch {}
      }
    };
    const handleCustomOrder = (e: Event) => {
      const customEvent = e as CustomEvent<Order>;
      if (customEvent.detail) {
        setOrders(prev => {
          const exists = (prev || []).some(o => o.id === customEvent.detail.id);
          if (!exists) {
            return [customEvent.detail, ...(prev || [])];
          }
          return prev;
        });
      }
      refreshOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('naxtto:order_placed', handleCustomOrder);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('naxtto:order_placed', handleCustomOrder);
    };
  }, [refreshOrders]);

  // Synchronize cart and wishlist whenever user login state changes
  useEffect(() => {
    const prevKey = prevUserKeyRef.current;
    const currentKey = getUserStorageKey(user);

    // Case 1: User is logged out -> clear bag and wishlist completely
    if (!user.isLoggedIn || !currentKey) {
      if (prevKey) {
        saveUserCart(prevKey, cartItemsRef.current);
        saveUserWishlist(prevKey, wishlistItemsRef.current);
      }
      clearLoggedOutSession();
      setCartItems([]);
      setWishlistItems([]);
      prevUserKeyRef.current = null;
      return;
    }

    // Case 2: User logged in or switched account -> restore that user's bag, wishlist, and addresses
    if (currentKey !== prevKey) {
      if (prevKey) {
        saveUserCart(prevKey, cartItemsRef.current);
        saveUserWishlist(prevKey, wishlistItemsRef.current);
      }

      // 1. Immediately restore patron's items from local storage
      const userCart = loadUserCart(currentKey);
      const userWishlist = loadUserWishlist(currentKey);
      const userAddresses = loadUserAddresses(currentKey);
      setCartItems(userCart);
      setWishlistItems(userWishlist);
      if (userAddresses.length > 0) {
        setUser(prev => ({
          ...prev,
          savedAddresses: userAddresses
        }));
      }
      prevUserKeyRef.current = currentKey;

      // 2. Concurrently check Firestore for cloud backups and restore
      fetchUserDataFromFirestore(currentKey).then(remote => {
        if (!remote) return;
        if (remote.cartItems && remote.cartItems.length > 0 && userCart.length === 0) {
          setCartItems(remote.cartItems);
          saveUserCart(currentKey, remote.cartItems);
        }
        if (remote.wishlistItems && remote.wishlistItems.length > 0 && userWishlist.length === 0) {
          setWishlistItems(remote.wishlistItems);
          saveUserWishlist(currentKey, remote.wishlistItems);
        }
        if (remote.savedAddresses && remote.savedAddresses.length > 0) {
          setUser(prev => {
            const currentSaved = prev.savedAddresses || [];
            const merged = [...currentSaved];
            remote.savedAddresses!.forEach(r => {
              const exists = merged.some(
                m => m.id === r.id ||
                     (m.addressLine1.toLowerCase().trim() === r.addressLine1.toLowerCase().trim() &&
                      m.postalCode.trim() === r.postalCode.trim())
              );
              if (!exists) {
                merged.push(r);
              }
            });
            saveUserAddresses(currentKey, merged);
            return {
              ...prev,
              savedAddresses: merged
            };
          });
        }
      });
    }
  }, [user.isLoggedIn, user.id, user.email]);

  // Persist cart items to user's storage when changed while logged in
  useEffect(() => {
    const key = getUserStorageKey(user);
    if (user.isLoggedIn && key) {
      saveUserCart(key, cartItems);
      syncUserDataToFirestore(key, cartItems, wishlistItemsRef.current, user.savedAddresses, user);
    }
  }, [cartItems, user.isLoggedIn, user.id, user.email]);

  // Persist wishlist items to user's storage when changed while logged in
  useEffect(() => {
    const key = getUserStorageKey(user);
    if (user.isLoggedIn && key) {
      saveUserWishlist(key, wishlistItems);
      syncUserDataToFirestore(key, cartItemsRef.current, wishlistItems, user.savedAddresses, user);
    }
  }, [wishlistItems, user.isLoggedIn, user.id, user.email]);

  // Persist savedAddresses to user's storage and Firestore whenever changed
  useEffect(() => {
    const key = getUserStorageKey(user);
    if (user.savedAddresses && user.savedAddresses.length > 0) {
      saveUserAddresses(key, user.savedAddresses);
      if (user.isLoggedIn && key) {
        syncUserDataToFirestore(key, cartItemsRef.current, wishlistItemsRef.current, user.savedAddresses, user);
      }
    }
  }, [user.savedAddresses, user.isLoggedIn, user.id, user.email]);

  // Redirect tracking when logging in from checkout or shop
  const postLoginRedirectRef = useRef<'shop' | 'checkout'>('shop');

  // Real Firebase Auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    import('./lib/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const uid = firebaseUser.uid;
            const userKey = uid || (firebaseUser.email ? firebaseUser.email.toLowerCase().trim() : null);
            const localAddresses = loadUserAddresses(userKey);

            setUser(prev => {
              const wasLoggedOut = !prev.isLoggedIn;
              if (wasLoggedOut) {
                const target = postLoginRedirectRef.current === 'checkout' ? 'checkout' : 'shop';
                postLoginRedirectRef.current = 'shop';
                setCurrentView(curr => {
                  if (curr === 'account') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return target;
                  }
                  return curr;
                });
              }
              return {
                ...prev,
                id: firebaseUser.uid,
                name: firebaseUser.displayName || prev.name || firebaseUser.email?.split('@')[0] || 'Patron',
                email: firebaseUser.email || prev.email || '',
                avatar: firebaseUser.photoURL || prev.avatar || undefined,
                isLoggedIn: true,
                memberTier: prev.memberTier || 'NaxtTo Circle',
                memberSince: prev.memberSince || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                savedAddresses: localAddresses.length > 0 ? localAddresses : (prev.savedAddresses || [])
              };
            });
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

  // Save to LocalStorage on updates with quota safety
  useEffect(() => {
    safeSetItem('naxtto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    saveUserProfile(user.isLoggedIn ? user : null);
  }, [user]);

  useEffect(() => {
    if (Array.isArray(orders) && orders.length > 0) {
      const compactOrders = orders.slice(0, 50).map(sanitizeOrderForStorage);
      safeSetItem('naxtto_all_orders', JSON.stringify(compactOrders));
    }
  }, [orders]);

  // 2. Currency State (Default: INR)
  const [currency, setCurrency] = useState('INR');
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    JPY: '¥'
  };
  const currencySymbol = currencySymbols[currency] || '₹';

  // 3. Navigation View State with URL mapping & refresh persistence
  // Direct support for: /login (stays on login after refresh), /account, /checkout, /admin, /product/:id, and /
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const initialRoute = parseRouteFromLocation(products, user.isLoggedIn);
    return initialRoute.view;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const initialRoute = parseRouteFromLocation(products, user.isLoggedIn);
    return initialRoute.product;
  });

  // Synchronize browser address bar and history stack whenever view, login status, or selected product changes
  useEffect(() => {
    syncBrowserUrl(currentView, user.isLoggedIn, selectedProduct);
  }, [currentView, user.isLoggedIn, selectedProduct]);

  // Initial URL synchronization without creating duplicate back-history entry
  useEffect(() => {
    syncBrowserUrl(currentView, user.isLoggedIn, selectedProduct, { replace: true });
  }, []);

  // Listen to browser Back / Forward buttons (popstate events)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation(products, user.isLoggedIn);
      setCurrentView(route.view);
      setSelectedProduct(route.product);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, user.isLoggedIn]);

  // If products arrive from API and we were on /product/:id route without matching product initially
  useEffect(() => {
    if (currentView === 'product-detail' && !selectedProduct && products.length > 0) {
      const route = parseRouteFromLocation(products, user.isLoggedIn);
      if (route.product) {
        setSelectedProduct(route.product);
      }
    }
  }, [products, currentView, selectedProduct, user.isLoggedIn]);

  // Sync orders periodically when viewing the Admin Panel so live orders reflect immediately
  useEffect(() => {
    if (currentView === 'admin') {
      refreshOrders();
      const timer = setInterval(refreshOrders, 4000);
      return () => clearInterval(timer);
    }
  }, [currentView, refreshOrders]);

  // Staff / Admin Authentication State (Credential Verification Required)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('naxtto_staff_auth') === 'true' || 
           localStorage.getItem('naxtto_admin_auth') === 'true';
  });
  const [isStaffAuthModalOpen, setIsStaffAuthModalOpen] = useState(false);
  const [staffUser, setStaffUser] = useState<{ email: string; role: string; name: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('naxtto_staff_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dedicated Admin / Seller Hub view flag
  const isAdminMode = currentView === 'admin' && isStaffAuthenticated;

  // Drawers & Overlays Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isPdfCatalogueOpen, setIsPdfCatalogueOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loginPromptProductName, setLoginPromptProductName] = useState<string | undefined>(undefined);
  const [loginPromptActionType, setLoginPromptActionType] = useState<'bag' | 'wishlist' | 'review'>('bag');

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

  // Section Refs for direct navigation
  const catalogRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const ethosRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 10);
  };

  const scrollToJournal = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      journalRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 10);
  };

  const scrollToEthos = () => {
    setCurrentView('shop');
    setSelectedProduct(null);
    setTimeout(() => {
      ethosRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 10);
  };

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Voice Command Filter Application: maps spoken keywords to category & attributes
  const handleApplyVoiceFilter = (parsed: VoiceParseResult) => {
    setSelectedProduct(null);
    setCurrentView('shop');

    setFilterOptions(prev => {
      // 1. Determine next category
      const nextCategory = parsed.category || prev.category;

      // 2. Determine next metals
      const nextMetals = parsed.metals.length > 0 
        ? parsed.metals 
        : (parsed.category && parsed.category !== prev.category ? [] : prev.metals);

      // 3. Determine next styles
      const nextStyles = parsed.styles.length > 0 
        ? parsed.styles 
        : (parsed.category && parsed.category !== prev.category ? [] : prev.styles);

      // 4. Determine next price range
      const nextPriceRange: [number, number] = parsed.maxPrice 
        ? [0, parsed.maxPrice] 
        : prev.priceRange;

      // 5. Determine next search query
      const nextSearchQuery = parsed.category || parsed.metals.length > 0 || parsed.styles.length > 0
        ? parsed.cleanedQuery
        : (parsed.cleanedQuery || parsed.rawTranscript);

      return {
        ...prev,
        category: nextCategory,
        metals: nextMetals,
        styles: nextStyles,
        priceRange: nextPriceRange,
        searchQuery: nextSearchQuery
      };
    });

    showToast(`🎙️ ${parsed.feedbackText}`);
    scrollToCatalog();
  };

  // User Sign-Out Handler: saves items to user account, then completely clears in-memory bag & wishlist
  const handleUserSignOut = async () => {
    const key = getUserStorageKey(user);
    if (key) {
      saveUserCart(key, cartItemsRef.current);
      saveUserWishlist(key, wishlistItemsRef.current);
    }
    // Instantly wipe in-memory state so no products show in bag or wishlist
    setCartItems([]);
    setWishlistItems([]);
    clearLoggedOutSession();
    localStorage.removeItem('naxtto_user');
    setUser(DEMO_USER);
    prevUserKeyRef.current = null;
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    if (currentView === 'checkout') {
      setCurrentView('shop');
    }

    try {
      const { auth } = await import('./lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign out notice:', err);
    }
    showToast('Signed out of your patron account');
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
        const q = filterOptions.searchQuery.toLowerCase().trim();
        const searchable = `${product.name} ${product.subtitle} ${product.metalName} ${product.styleName} ${product.category} ${product.description || ''}`.toLowerCase();
        
        // Exact substring match
        if (searchable.includes(q)) {
          return true;
        }

        // Multi-word token match with plural/singular tolerance
        const tokens = q.split(/\s+/).filter(Boolean);
        const matchesAllTokens = tokens.length > 0 && tokens.every(token => {
          if (searchable.includes(token)) return true;
          // Plural / singular tolerance (e.g. "rings" -> "ring", "bangles" -> "bangle")
          if (token.endsWith('s') && token.length > 3 && searchable.includes(token.slice(0, -1))) return true;
          if (searchable.includes(token + 's')) return true;
          return false;
        });

        if (!matchesAllTokens) {
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
  ): boolean => {
    // If account is not logged in, prompt login modal
    if (!user.isLoggedIn) {
      setLoginPromptProductName(product.name);
      setLoginPromptActionType('bag');
      setIsLoginPromptOpen(true);
      return false;
    }

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
    return true;
  };

  // Navigates directly to Checkout Page without popup (also gates for login)
  const handleBuyNow = (product: Product, selectedSize?: string, selectedFinish?: any) => {
    if (!user.isLoggedIn) {
      setLoginPromptProductName(product.name);
      setLoginPromptActionType('bag');
      setIsLoginPromptOpen(true);
      return;
    }
    handleAddToCart(product, selectedSize, selectedFinish, 1);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleGoToLogin = () => {
    setIsLoginPromptOpen(false);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('account');
    window.scrollTo(0, 0);
  };

  const handleCheckoutLogin = () => {
    postLoginRedirectRef.current = 'checkout';
    setIsLoginPromptOpen(false);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('account');
    window.scrollTo(0, 0);
  };

  const handleOpenAccount = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('account');
    window.scrollTo(0, 0);
  };

  const handleOpenWishlist = () => {
    if (!user.isLoggedIn) {
      setLoginPromptProductName(undefined);
      setLoginPromptActionType('wishlist');
      setIsLoginPromptOpen(true);
      return;
    }
    setIsWishlistOpen(true);
  };

  const handleOpenCheckout = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
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
    if (!user.isLoggedIn) {
      setLoginPromptProductName(product.name);
      setLoginPromptActionType('wishlist');
      setIsLoginPromptOpen(true);
      return;
    }
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
    if (clean.startsWith('NAXTTO-REWARD-') || clean.startsWith('REWARDS-') || clean.startsWith('NAXTTO-REWARDS-')) {
      const match = clean.match(/\d+/);
      const amount = match ? parseInt(match[0], 10) : 500;
      setAppliedPromo({ code: clean, discountPercent: 0, discountAmount: amount });
      showToast(`₹${amount.toLocaleString('en-IN')} NaxtTo Rewards Voucher Applied`);
      return true;
    }
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
    try {
      const key = getUserStorageKey(user);
      // Add to user order history, store orders, and ensure delivery address is retained
      setUser(prev => {
        const existingAddresses = Array.isArray(prev?.savedAddresses) ? prev.savedAddresses : [];
        const orderAddr = newOrder?.shippingAddress;
        const alreadyExists = orderAddr ? existingAddresses.some(
          a => (a.addressLine1 || '').toLowerCase().trim() === (orderAddr.addressLine1 || '').toLowerCase().trim() &&
               (a.postalCode || '').trim() === (orderAddr.postalCode || '').trim()
        ) : false;
        const updatedAddresses = orderAddr && !alreadyExists ? [
          ...existingAddresses,
          { ...orderAddr, id: orderAddr.id || `addr-${Date.now()}`, isDefault: existingAddresses.length === 0 }
        ] : existingAddresses;
        
        try {
          saveUserAddresses(key, updatedAddresses);
        } catch {
          // ignore
        }
        
        if (user.isLoggedIn && key) {
          try {
            syncUserDataToFirestore(key, [], wishlistItemsRef.current, updatedAddresses, prev);
          } catch {
            // ignore
          }
        }
        
        const existingHistory = Array.isArray(prev?.orderHistory) ? prev.orderHistory : [];
        return {
          ...prev,
          savedAddresses: updatedAddresses,
          orderHistory: [newOrder, ...existingHistory]
        };
      });

      setOrders(prev => {
        const filtered = (Array.isArray(prev) ? prev : []).filter(o => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber);
        const updated = [newOrder, ...filtered];
        safeSetItem('naxtto_all_orders', JSON.stringify(updated.slice(0, 50).map(sanitizeOrderForStorage)));
        return updated;
      });
      setCartItems([]);
      
      try {
        if (key) {
          localStorage.removeItem(`naxtto_user_cart_${key}`);
        }
        sessionStorage.setItem('naxtto_completed_order', JSON.stringify(newOrder));
        safeSetItem('naxtto_last_order', JSON.stringify(sanitizeOrderForStorage(newOrder)));
        window.dispatchEvent(new CustomEvent('naxtto:order_placed', { detail: newOrder }));
      } catch {
        // ignore
      }

      // Persist directly to Firestore permanent database so all devices and admin see it immediately
      saveOrderToFirestore(newOrder, key || undefined, user.email || undefined);

      // Dispatch transactional 'Order Confirmed' email to customer via Resend using EmailTemplate
      sendOrderConfirmationEmail(newOrder).then(result => {
        if (result.success) {
          console.log(`[EMAIL CONFIRMATION] Successfully sent Order Confirmed email for #${newOrder.orderNumber || newOrder.id} to ${newOrder.customerEmail || 'customer'}`);
        } else {
          console.warn('[EMAIL CONFIRMATION] Notice on Order Confirmed email dispatch:', result.message);
        }
      }).catch(err => {
        console.warn('Failed to send Order Confirmed transactional email:', err);
      });

      apiClient.createOrder(newOrder).then(() => {
        refreshOrders();
      }).catch(err => {
        console.warn('Backend order recording notice:', err);
      });
    } catch (err) {
      console.error('Error handling completed order in App:', err);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    const key = getUserStorageKey(user);
    setUser(prev => {
      const existing = prev.savedAddresses || [];
      const updated = existing.filter(a => a.id !== addressId && `${a.fullName}-${a.addressLine1}` !== addressId);
      saveUserAddresses(key, updated);
      if (user.isLoggedIn && key) {
        syncUserDataToFirestore(key, cartItemsRef.current, wishlistItemsRef.current, updated, prev);
      }
      return {
        ...prev,
        savedAddresses: updated
      };
    });
    showToast('Address removed from your address book.');
  };

  const handleSaveNewAddress = (newAddr: Address) => {
    const key = getUserStorageKey(user);
    setUser(prev => {
      const existing = prev.savedAddresses || [];
      const withId = { ...newAddr, id: newAddr.id || `addr-${Date.now()}` };
      const existingIndex = existing.findIndex(
        a => a.id === withId.id ||
             (a.addressLine1.toLowerCase().trim() === withId.addressLine1.toLowerCase().trim() &&
              a.postalCode.trim() === withId.postalCode.trim())
      );
      let updated: Address[];
      if (existingIndex >= 0) {
        updated = existing.map((a, i) => i === existingIndex ? withId : (newAddr.isDefault ? { ...a, isDefault: false } : a));
      } else {
        updated = newAddr.isDefault
          ? [...existing.map(a => ({ ...a, isDefault: false })), withId]
          : [...existing, withId];
      }
      saveUserAddresses(key, updated);
      if (user.isLoggedIn && key) {
        syncUserDataToFirestore(key, cartItemsRef.current, wishlistItemsRef.current, updated, prev);
      }
      return {
        ...prev,
        savedAddresses: updated
      };
    });
    showToast('Delivery address saved to your account.');
  };

  // 12. Admin CRUD Handlers (Multi-Layer Cloud & Local Persistence)
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => {
      const updated = [newProd, ...prev];
      try { localStorage.setItem('naxtto_products', JSON.stringify(updated)); } catch {}
      return updated;
    });
    // Multi-tier persistence: Firestore + Supabase + Postgres
    saveProductToFirestore(newProd);
    apiClient.createProduct(newProd);
    showToast(`Piece "${newProd.name}" successfully catalogued.`);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProd.id ? updatedProd : p);
      try { localStorage.setItem('naxtto_products', JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (selectedProduct && selectedProduct.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
    // Multi-tier persistence: Firestore + Supabase + Postgres
    saveProductToFirestore(updatedProd);
    apiClient.updateProduct(updatedProd.id, updatedProd);
    showToast(`Piece "${updatedProd.name}" updated successfully.`);
  };

  const handleDeleteProduct = (productId: string) => {
    // 1. Record deletion tombstone in local storage and scrub all saved carts/wishlists
    recordProductDeletion(productId);

    // 2. Remove product from products state
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      try { localStorage.setItem('naxtto_products', JSON.stringify(updated)); } catch {}
      return updated;
    });

    // 3. Remove product from current Cart / Shopping Bag
    setCartItems(prev => {
      const updated = prev.filter(item => item.product?.id !== productId);
      const key = getUserStorageKey(user);
      if (user?.isLoggedIn && key) {
        saveUserCart(key, updated);
        syncUserDataToFirestore(key, updated, wishlistItemsRef.current, user.savedAddresses, user);
      }
      return updated;
    });

    // 4. Remove product from current Wishlist
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.product?.id !== productId);
      const key = getUserStorageKey(user);
      if (user?.isLoggedIn && key) {
        saveUserWishlist(key, updated);
        syncUserDataToFirestore(key, cartItemsRef.current, updated, user.savedAddresses, user);
      }
      return updated;
    });

    // 5. Close Product Detail Page if viewing this piece
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
      setCurrentView('shop');
    }

    // 6. Clean up WOW Deals / Top Rated showcases if they reference this product
    setWowDeals(prev => {
      const updated = prev.filter(deal => deal.id !== productId && (deal as any).productId !== productId);
      try { localStorage.setItem('naxtto_wow_deals', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setTopRatedItems(prev => {
      const updated = prev.filter(item => item.id !== productId && (item as any).productId !== productId);
      try { localStorage.setItem('naxtto_top_rated_items', JSON.stringify(updated)); } catch {}
      return updated;
    });

    // 7. Multi-tier persistence: Firestore cloud tombstone + Supabase + Postgres + backend memory
    deleteProductFromFirestore(productId);
    apiClient.deleteProduct(productId);
    showToast('Piece permanently removed from catalog, shopping bag, and wishlist.');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUser(prev => ({
      ...prev,
      orderHistory: prev.orderHistory.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    }));
    // Persist real-time update in Firestore cloud storage
    updateOrderStatusInFirestore(orderId, newStatus);
    apiClient.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId.slice(-6)} status updated to "${newStatus}".`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId);
      safeSetItem('naxtto_all_orders', JSON.stringify(updated.slice(0, 50).map(sanitizeOrderForStorage)));
      return updated;
    });
    setUser(prev => ({
      ...prev,
      orderHistory: (prev.orderHistory || []).filter(o => o.id !== orderId)
    }));
    deleteOrderFromFirestore(orderId);
    apiClient.deleteOrder(orderId);
    showToast(`Order #${orderId.slice(-6)} removed.`);
  };

  const handleClearAllOrders = async () => {
    setOrders([]);
    localStorage.removeItem('naxtto_all_orders');
    setUser(prev => ({
      ...prev,
      orderHistory: []
    }));
    await clearAllOrdersFromFirestore();
    await apiClient.clearAllOrders();
    showToast('All dummy / test orders have been purged from the seller panel.');
  };

  const handleAdminSignOut = () => {
    setIsStaffAuthenticated(false);
    setStaffUser(null);
    sessionStorage.removeItem('naxtto_staff_auth');
    sessionStorage.removeItem('naxtto_staff_info');
    localStorage.removeItem('naxtto_admin_auth');
    setSelectedProduct(null);
    setCurrentView('shop');
    window.scrollTo(0, 0);
    showToast('Signed out of Administrator session.');
  };

  const handleRequestStaffAccess = () => {
    if (isStaffAuthenticated) {
      setSelectedProduct(null);
      setCurrentView('admin');
      window.scrollTo(0, 0);
    } else {
      setIsStaffAuthModalOpen(true);
    }
  };

  const handleStaffAuthSuccess = (staff?: { email: string; role: string; name: string }) => {
    setIsStaffAuthenticated(true);
    setIsStaffAuthModalOpen(false);
    sessionStorage.setItem('naxtto_staff_auth', 'true');
    if (staff) {
      setStaffUser(staff);
      sessionStorage.setItem('naxtto_staff_info', JSON.stringify(staff));
    }
    setSelectedProduct(null);
    setCurrentView('admin');
    window.scrollTo(0, 0);
    showToast(`Staff credentials verified. Welcome${staff?.name ? `, ${staff.name}` : ''}.`);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-white text-[#1d1d1f]">
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

      {/* Main Navbar & Coupon Strip (Hidden in Admin/Seller Hub mode) */}
      {!isAdminMode && (
        <>
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
            onOpenWishlist={handleOpenWishlist}
            onOpenAccount={handleOpenAccount}
            onNavigateToAdmin={handleRequestStaffAccess}
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
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentView('product-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currencySymbol={currencySymbol}
            searchQuery={filterOptions.searchQuery}
            onSearchChange={(query) => {
              setFilterOptions(prev => ({ ...prev, searchQuery: query }));
            }}
            onApplyVoiceFilter={handleApplyVoiceFilter}
            cartTotal={cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}
            onSelectGender={(gender) => {
              setSelectedProduct(null);
              setCurrentView('shop');
              if (gender === 'men') {
                setFilterOptions(prev => ({ ...prev, searchQuery: 'men' }));
              } else {
                setFilterOptions(prev => ({ ...prev, searchQuery: '' }));
              }
              scrollToCatalog();
            }}
          />

          {/* Myntra Orange Coupon Voucher Strip (FLAT ₹300 OFF on 1st purchase) */}
          <MyntraCouponStrip 
            onApplyCoupon={(code) => showToast(`Voucher code "${code}" claimed! Extra ₹300 discount active.`)} 
          />
        </>
      )}

      {/* Dynamic Page Views: Dedicated Account Page, Admin Panel, Dedicated Checkout Page, Product Detail Page, or Home Catalog */}
      {currentView === 'admin' && isStaffAuthenticated ? (
        <AdminPanel
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onDeleteOrder={handleDeleteOrder}
          onClearAllOrders={handleClearAllOrders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onBackToShop={() => {
            setCurrentView('shop');
            setSelectedProduct(null);
            scrollToCatalog();
          }}
          onSignOut={handleAdminSignOut}
          currencySymbol={currencySymbol}
          staffInfo={staffUser}
          onRefreshOrders={refreshOrders}
          wowDeals={wowDeals}
          onUpdateWowDeals={handleUpdateWowDeals}
          wowDealsHeadline={wowDealsHeader.headline}
          wowDealsSubheadline={wowDealsHeader.subheadline}
          wowDealsEmoji={wowDealsHeader.emoji}
          onUpdateWowDealsHeader={handleUpdateWowDealsHeader}
          topRatedItems={topRatedItems}
          onUpdateTopRatedItems={handleUpdateTopRatedItems}
          topRatedHeadline={topRatedHeader.headline}
          topRatedSubheadline={topRatedHeader.subheadline}
          topRatedButtonText={topRatedHeader.buttonText}
          onUpdateTopRatedHeader={handleUpdateTopRatedHeader}
          heroBanners={heroBanners}
          onUpdateHeroBanners={handleUpdateHeroBanners}
        />
      ) : currentView === 'account' ? (
        <AccountPage
          user={user}
          allOrders={orders}
          onUpdateUser={(updated) => {
            if (updated.isLoggedIn === false) {
              handleUserSignOut();
            } else {
              const wasLoggedOut = !user.isLoggedIn;
              const targetKey = updated.id || (updated.email ? updated.email.toLowerCase().trim() : null);
              const loadedAddresses = targetKey ? loadUserAddresses(targetKey) : [];
              setUser(prev => {
                const finalAddresses = updated.savedAddresses || (loadedAddresses.length > 0 ? loadedAddresses : prev.savedAddresses);
                const nextUser = {
                  ...prev,
                  ...updated,
                  savedAddresses: finalAddresses
                };
                if (targetKey && finalAddresses.length > 0) {
                  saveUserAddresses(targetKey, finalAddresses);
                }
                return nextUser;
              });
              if (wasLoggedOut && updated.isLoggedIn) {
                const target = postLoginRedirectRef.current === 'checkout' ? 'checkout' : 'shop';
                postLoginRedirectRef.current = 'shop';
                setCurrentView(target);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (target === 'checkout') {
                  showToast(`Signed in! Fetched email (${updated.email}) for your order.`);
                } else {
                  showToast(`Welcome back, ${updated.name || 'Patron'}!`);
                }
              }
            }
          }}
          onLoginSuccess={() => {
            const target = postLoginRedirectRef.current === 'checkout' ? 'checkout' : 'shop';
            postLoginRedirectRef.current = 'shop';
            setCurrentView(target);
            setSelectedProduct(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (target === 'checkout') {
              showToast(`Signed in! Fetched email (${user.email}) for your order.`);
            }
          }}
          onSignOut={handleUserSignOut}
          onBackToShop={() => {
            setCurrentView('shop');
            setSelectedProduct(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenWishlist={handleOpenWishlist}
          onNavigateToAdmin={handleRequestStaffAccess}
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
          onSaveNewAddress={handleSaveNewAddress}
          onDeleteAddress={handleDeleteAddress}
          onGoToLogin={handleCheckoutLogin}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
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
            window.scrollTo(0, 0);
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={isWishlisted(selectedProduct.id)}
          isProductWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
          currencySymbol={currencySymbol}
          onAddReview={handleAddReview}
          user={user}
          onOpenAccount={handleOpenAccount}
          onRequireLogin={(productName, actionType) => {
            setLoginPromptProductName(productName);
            setLoginPromptActionType(actionType || 'review');
            setIsLoginPromptOpen(true);
          }}
          onSelectCategory={(cat) => {
            setSelectedProduct(null);
            setCurrentView('shop');
            setFilterOptions(prev => ({ ...prev, category: cat }));
            scrollToCatalog();
          }}
        />
      ) : (
        <>
          {/* Hero Banner: FLAT 20% OFF PAY DAY SALE (Exact Screenshot Match) */}
          <HeroSection
            slides={heroBanners}
            onExploreCatalog={scrollToCatalog}
            onSelectCategory={(cat) => {
              setSelectedProduct(null);
              setCurrentView('shop');
              setFilterOptions(prev => ({ ...prev, category: cat }));
              scrollToCatalog();
            }}
          />

          {/* Flash Sale Banner Strip with Live Countdown */}
          <FlashSaleBanner onShopNow={scrollToCatalog} />

          {/* Main Catalog & Filter Section */}
          <main ref={catalogRef} id="product-catalog-section" className="flex-1 scroll-mt-20 bg-[#f5f5f6] pb-12">
            {/* Filter & Sort Bar */}
            <ProductFilter
              filterOptions={filterOptions}
              onChangeFilter={setFilterOptions}
              totalResults={filteredProducts.length}
              currencySymbol={currencySymbol}
            />

            {/* Suggested / All Creations Header & Product Catalog Grid */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4">
              <div className="bg-white rounded-md border border-[#eaeaec] p-4 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#f5f5f6] mb-4">
                  <div>
                    <h3 className="text-base sm:text-xl font-extrabold text-[#282c3f]">
                      Curated Fine Jewellery
                    </h3>
                    <p className="text-xs text-[#696e79]">
                      18K solid gold, certified diamonds, and verified customer ratings
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#ff3e6c] bg-[#ff3e6c]/10 px-2.5 py-1 rounded-full">
                    {filteredProducts.length} Verified Pieces
                  </span>
                </div>

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
                      className="px-5 py-2.5 bg-[#2874f0] text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-[#1259c7] transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={(p) => {
                          setSelectedProduct(p);
                          setCurrentView('product-detail');
                          window.scrollTo(0, 0);
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
            </div>
          </main>

          {/* Shoppable Instagram Feed for Social Proof */}
          <InstagramFeed
            posts={INSTAGRAM_FEED}
            products={products}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentView('product-detail');
              window.scrollTo(0, 0);
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
                window.scrollTo(0, 0);
              }}
              onAddToCart={handleAddToCart}
              currencySymbol={currencySymbol}
            />
          </div>

          {/* Email Signup Form for Newsletters */}
          <NewsletterSignup
            userEmail={user.isLoggedIn ? user.email : undefined}
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

      {/* Official Channel Partners Strip & Luxury Footer (Hidden in Admin/Seller Hub mode) */}
      {!isAdminMode && (
        <>
          <ChannelPartners />

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
            onOpenWishlist={handleOpenWishlist}
            onNavigateToAdmin={handleRequestStaffAccess}
          />
        </>
      )}

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
        user={user}
        onOpenAccount={handleOpenAccount}
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
          window.scrollTo(0, 0);
        }}
      />

      {/* 3. Exact 15-Page PDF Lookbook Catalogue Viewer */}
      <PdfCatalogueViewer
        isOpen={isPdfCatalogueOpen}
        onClose={() => setIsPdfCatalogueOpen(false)}
      />

      {/* 4. Staff & Admin Authentication Gate Modal */}
      <StaffAuthModal
        isOpen={isStaffAuthModalOpen}
        onClose={() => setIsStaffAuthModalOpen(false)}
        onSuccess={handleStaffAuthSuccess}
      />

      {/* 5. Login Prompt Modal when attempting to add to bag or wishlist while unauthenticated */}
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        onGoToLogin={handleGoToLogin}
        productName={loginPromptProductName}
        actionType={loginPromptActionType}
      />

      {/* 6. Myntra Vertical Side Ribbon Tab (▲ UPTO ₹300 OFF on right edge) */}
      <MyntraSideRibbon onApplyCoupon={(code) => showToast(`Coupon "${code}" applied to checkout!`)} />

      {/* 8. Myntra Circular Blue Notification Bell FAB (Bottom-Right) */}
      <MyntraNotificationFab onOpenOffers={scrollToCatalog} />
    </div>
  );
}
