import { CartItem, WishlistItem, UserProfile } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

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
    localStorage.setItem(`naxtto_user_cart_${userKey}`, JSON.stringify(items));
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
    localStorage.setItem(`naxtto_user_wishlist_${userKey}`, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to save user wishlist:', err);
  }
}

/**
 * Sync user's cart and wishlist to Firestore for cloud persistence.
 */
export async function syncUserDataToFirestore(
  userKey: string | null,
  cartItems: CartItem[],
  wishlistItems: WishlistItem[]
): Promise<void> {
  if (!userKey) return;
  try {
    const userDocRef = doc(firestore, 'users', userKey);
    await setDoc(
      userDocRef,
      {
        cartItems,
        wishlistItems,
        lastActiveAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    // Graceful offline/silent fallback so local operations never stall
    console.debug('Firestore sync notice (local backup active):', err);
  }
}

/**
 * Fetch user's cart and wishlist from Firestore.
 */
export async function fetchUserDataFromFirestore(
  userKey: string | null
): Promise<{ cartItems?: CartItem[]; wishlistItems?: WishlistItem[] } | null> {
  if (!userKey) return null;
  try {
    const userDocRef = doc(firestore, 'users', userKey);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        cartItems: Array.isArray(data.cartItems) ? data.cartItems : undefined,
        wishlistItems: Array.isArray(data.wishlistItems) ? data.wishlistItems : undefined
      };
    }
  } catch (err) {
    console.debug('Firestore fetch notice (local backup active):', err);
  }
  return null;
}
