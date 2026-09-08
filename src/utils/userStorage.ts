import { CartItem, WishlistItem, UserProfile, Address, Order, Product } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

/**
 * Creates a lightweight, compact clone of an order suitable for localStorage
 * without duplicating heavy review arrays, descriptions, or redundant metadata.
 */
export function sanitizeOrderForStorage(order: Order): Order {
  if (!order) return order;
  return {
    ...order,
    items: Array.isArray(order.items)
      ? order.items.map(item => ({
          quantity: item.quantity || 1,
          selectedSize: item.selectedSize,
          selectedFinish: item.selectedFinish,
          product: {
            ...(item.product || {}),
            description: '',
            details: '',
            craftsmanship: '',
            reviews: [],
            images: [item.product?.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80']
          } as Product
        }))
      : []
  };
}

/**
 * Strips heavy duplicate arrays and limits history length to fit safely within
 * browser localStorage quota limits.
 */
export function sanitizeUserForStorage(user: UserProfile): UserProfile {
  if (!user) return user;
  const history = Array.isArray(user.orderHistory) ? user.orderHistory : [];
  // Keep up to 10 latest orders with slimmed items
  const compactHistory = history.slice(0, 10).map(sanitizeOrderForStorage);

  return {
    ...user,
    orderHistory: compactHistory,
    savedAddresses: Array.isArray(user.savedAddresses) ? user.savedAddresses : []
  };
}

/**
 * Emergency cleanup for localStorage when browser quota is approached or exceeded.
 */
export function cleanupStorageQuota(): void {
  try {
    // 1. Remove non-essential transient caches
    const purgeKeys = [
      'naxtto_cart_v2',
      'naxtto_wishlist_v2',
      'naxtto_cart',
      'naxtto_wishlist',
      'naxtto_guest_addresses',
      'naxtto_address_draft_guest',
      'naxtto_completed_order',
      'naxtto_last_order'
    ];
    purgeKeys.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });

    // 2. Compact naxtto_all_orders down to last 5 orders
    try {
      const allOrders = localStorage.getItem('naxtto_all_orders');
      if (allOrders) {
        const parsed = JSON.parse(allOrders);
        if (Array.isArray(parsed) && parsed.length > 5) {
          const trimmed = parsed.slice(0, 5).map(sanitizeOrderForStorage);
          localStorage.setItem('naxtto_all_orders', JSON.stringify(trimmed));
        }
      }
    } catch {
      // ignore
    }

    // 3. Compact naxtto_user profile orders
    try {
      const rawUser = localStorage.getItem('naxtto_user');
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        if (parsedUser) {
          const sanitized = sanitizeUserForStorage(parsedUser);
          sanitized.orderHistory = (sanitized.orderHistory || []).slice(0, 3);
          localStorage.setItem('naxtto_user', JSON.stringify(sanitized));
        }
      }
    } catch {
      // ignore
    }
  } catch (e) {
    console.warn('Quota cleanup notice:', e);
  }
}

/**
 * Safely persists an item to localStorage with automatic quota recovery.
 * Never throws unhandled exceptions to callers.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014 ||
      (typeof err?.message === 'string' && err.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      console.warn(`LocalStorage quota exceeded while setting "${key}". Triggering quota cleanup.`);
      cleanupStorageQuota();

      // Retry once after cleanup
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        console.warn(`LocalStorage quota still exceeded for "${key}". Degrading gracefully.`, retryErr);
        return false;
      }
    }

    console.warn(`LocalStorage setItem error for "${key}":`, err);
    return false;
  }
}

/**
 * Safely persists patron profile into naxtto_user with quota protection.
 */
export function saveUserProfile(user: UserProfile | null): void {
  if (!user || !user.isLoggedIn) {
    try {
      localStorage.removeItem('naxtto_user');
    } catch {
      // ignore
    }
    return;
  }

  try {
    const sanitized = sanitizeUserForStorage(user);
    const success = safeSetItem('naxtto_user', JSON.stringify(sanitized));
    if (!success) {
      // Minimal fallback without orderHistory to ensure patron session remains saved
      const minimal = {
        ...sanitized,
        orderHistory: []
      };
      safeSetItem('naxtto_user', JSON.stringify(minimal));
    }
  } catch (e) {
    console.warn('Could not persist naxtto_user:', e);
  }
}

/**
 * Returns a stable unique identifier string for a logged-in user.
 * Returns null if user is not logged in.
 */
export function getUserStorageKey(user?: Partial<UserProfile> | null): string | null {
  if (!user || !user.isLoggedIn) {
    return null;
  }
  return user.id || (user.email ? user.email.toLowerCase().trim() : null);
}

/**
 * Clears any generic or anonymous session keys so logged-out patrons see zero items.
 */
export function clearLoggedOutSession(): void {
  try {
    localStorage.removeItem('naxtto_cart_v2');
    localStorage.removeItem('naxtto_wishlist_v2');
    localStorage.removeItem('naxtto_cart');
    localStorage.removeItem('naxtto_wishlist');
  } catch (e) {
    console.warn('Could not clear anonymous storage:', e);
  }
}

/**
 * Load cart items for a specific user.
 * If userKey is null (logged out), returns empty array [].
 */
export function loadUserCart(userKey: string | null): CartItem[] {
  if (!userKey) {
    return [];
  }
  try {
    const userCartData = localStorage.getItem(`naxtto_user_cart_${userKey}`);
    if (userCartData) {
      const parsed = JSON.parse(userCartData);
      if (Array.isArray(parsed)) return parsed;
    }

    // Migrate from legacy generic key on first user load if present
    const legacyCart = localStorage.getItem('naxtto_cart_v2');
    if (legacyCart) {
      const parsed = JSON.parse(legacyCart);
      localStorage.removeItem('naxtto_cart_v2');
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveUserCart(userKey, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load user cart:', err);
  }
  return [];
}

/**
 * Save cart items for a specific user.
 */
export function saveUserCart(userKey: string | null, items: CartItem[]): void {
  if (!userKey) {
    clearLoggedOutSession();
    return;
  }
  try {
    safeSetItem(`naxtto_user_cart_${userKey}`, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save user cart:', err);
  }
}

/**
 * Load wishlist items for a specific user.
 * If userKey is null (logged out), returns empty array [].
 */
export function loadUserWishlist(userKey: string | null): WishlistItem[] {
  if (!userKey) {
    return [];
  }
  try {
    const userWishlistData = localStorage.getItem(`naxtto_user_wishlist_${userKey}`);
    if (userWishlistData) {
      const parsed = JSON.parse(userWishlistData);
      if (Array.isArray(parsed)) return parsed;
    }

    // Migrate from legacy generic key on first user load if present
    const legacyWishlist = localStorage.getItem('naxtto_wishlist_v2');
    if (legacyWishlist) {
      const parsed = JSON.parse(legacyWishlist);
      localStorage.removeItem('naxtto_wishlist_v2');
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveUserWishlist(userKey, parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load user wishlist:', err);
  }
  return [];
}

/**
 * Save wishlist items for a specific user.
 */
export function saveUserWishlist(userKey: string | null, items: WishlistItem[]): void {
  if (!userKey) {
    clearLoggedOutSession();
    return;
  }
  try {
    safeSetItem(`naxtto_user_wishlist_${userKey}`, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save user wishlist:', err);
  }
}

/**
 * Load saved addresses for a specific user.
 */
export function loadUserAddresses(userKey: string | null): Address[] {
  if (!userKey) {
    // For non-logged in or guest sessions, check local guest addresses
    try {
      const guestAddr = localStorage.getItem('naxtto_guest_addresses');
      if (guestAddr) {
        const parsed = JSON.parse(guestAddr);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }

  try {
    const data = localStorage.getItem(`naxtto_user_addresses_${userKey}`);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Check user profile cached in naxtto_user
    const savedUser = localStorage.getItem('naxtto_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (Array.isArray(parsedUser.savedAddresses) && parsedUser.savedAddresses.length > 0) {
        try {
          safeSetItem(`naxtto_user_addresses_${userKey}`, JSON.stringify(parsedUser.savedAddresses));
        } catch {
          // ignore
        }
        return parsedUser.savedAddresses;
      }
    }
  } catch (err) {
    console.warn('Failed to load user addresses:', err);
  }
  return [];
}

/**
 * Save addresses for a specific user.
 */
export function saveUserAddresses(userKey: string | null, addresses: Address[]): void {
  try {
    const key = userKey ? `naxtto_user_addresses_${userKey}` : 'naxtto_guest_addresses';
    safeSetItem(key, JSON.stringify(addresses));

    // Also update naxtto_user object in localStorage if available
    const savedUser = localStorage.getItem('naxtto_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        parsed.savedAddresses = addresses;
        safeSetItem('naxtto_user', JSON.stringify(sanitizeUserForStorage(parsed)));
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.warn('Failed to save user addresses:', err);
  }
}

/**
 * Load draft checkout address (to avoid losing input on refresh or navigation)
 */
export function loadCheckoutAddressDraft(userKey: string | null): Partial<Address> | null {
  try {
    const key = userKey ? `naxtto_address_draft_${userKey}` : 'naxtto_address_draft_guest';
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Save draft checkout address
 */
export function saveCheckoutAddressDraft(userKey: string | null, draft: Partial<Address>): void {
  try {
    const key = userKey ? `naxtto_address_draft_${userKey}` : 'naxtto_address_draft_guest';
    safeSetItem(key, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

/**
 * Sync user's cart, wishlist, and saved addresses to Firestore for permanent cloud persistence.
 */
export async function syncUserDataToFirestore(
  userKey: string | null,
  cartItems: CartItem[],
  wishlistItems: WishlistItem[],
  savedAddresses?: Address[],
  userProfile?: Partial<UserProfile>
): Promise<void> {
  if (!userKey) return;
  try {
    const userDocRef = doc(firestore, 'users', userKey);
    const updatePayload: Record<string, any> = {
      cartItems,
      wishlistItems,
      lastActiveAt: new Date().toISOString()
    };

    if (savedAddresses && Array.isArray(savedAddresses)) {
      updatePayload.savedAddresses = savedAddresses;
    }
    if (userProfile) {
      if (userProfile.name) updatePayload.name = userProfile.name;
      if (userProfile.email) updatePayload.email = userProfile.email;
      if (userProfile.phone) updatePayload.phone = userProfile.phone;
    }

    await setDoc(userDocRef, updatePayload, { merge: true });
  } catch (err) {
    // Graceful offline/silent fallback so local operations never stall
    console.debug('Firestore sync notice (local backup active):', err);
  }
}

/**
 * Fetch user's cart, wishlist, and saved addresses from Firestore.
 */
export async function fetchUserDataFromFirestore(
  userKey: string | null
): Promise<{
  cartItems?: CartItem[];
  wishlistItems?: WishlistItem[];
  savedAddresses?: Address[];
  profile?: Partial<UserProfile>;
} | null> {
  if (!userKey) return null;
  try {
    const userDocRef = doc(firestore, 'users', userKey);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        cartItems: Array.isArray(data.cartItems) ? data.cartItems : undefined,
        wishlistItems: Array.isArray(data.wishlistItems) ? data.wishlistItems : undefined,
        savedAddresses: Array.isArray(data.savedAddresses) ? data.savedAddresses : undefined,
        profile: {
          name: data.name,
          email: data.email,
          phone: data.phone
        }
      };
    }
  } catch (err) {
    console.debug('Firestore fetch notice (local backup active):', err);
  }
  return null;
}

