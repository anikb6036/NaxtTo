import { CartItem, WishlistItem, UserProfile, Address, Order, Product } from '../types';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, orderBy, getDocs, deleteDoc, where } from 'firebase/firestore';
import { firestore, handleFirestoreError, OperationType } from '../lib/firebase';

/**
 * Ensures product payload in orders or cart items is clean and compact
 * while preserving actual images, names, prices, and descriptions.
 */
export function sanitizeProductForStorage(product: Partial<Product> | undefined): Product {
  const p = product || {};
  const images = Array.isArray(p.images) && p.images.length > 0 
    ? p.images 
    : (p.images ? [p.images as unknown as string] : ['/src/assets/images/shankha_pola_set_1790249913718.jpg']);

  return {
    id: p.id || '',
    name: p.name || 'Fine Jewellery Piece',
    subtitle: p.subtitle || '',
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    category: p.category || 'all',
    metal: p.metal || '18k-yellow-gold',
    metalName: p.metalName || '18k Solid Gold',
    style: p.style || 'everyday-luxe',
    styleName: p.styleName || 'Everyday Luxe',
    sku: p.sku || '',
    karatPurity: p.karatPurity || '18K (750)',
    origin: p.origin || 'Mumbai Atelier',
    dimensions: p.dimensions || '',
    inStock: p.inStock ?? true,
    stockCount: p.stockCount ?? 1,
    rating: Number(p.rating) || 5.0,
    reviewsCount: Number(p.reviewsCount) || 0,
    images: images,
    description: p.description || '',
    story: p.story || '',
    features: Array.isArray(p.features) ? p.features : [],
    availableSizes: Array.isArray(p.availableSizes) ? p.availableSizes : [],
    sizeVariations: Array.isArray(p.sizeVariations) ? p.sizeVariations : [],
    reviews: []
  } as unknown as Product;
}

/**
 * Downscales an image (especially large data URIs) to a compact thumbnail (~15-30KB)
 * to guarantee that Firestore documents remain far below the 1,048,576 bytes limit
 * while strictly preserving the user's authentic submitted picture.
 */
export async function createCompactThumbnail(imgSrc: string | undefined, maxDim = 320, quality = 0.75): Promise<string> {
  if (!imgSrc || typeof imgSrc !== 'string') return '';

  // Web URLs and relative assets are already very compact (< 200 bytes)
  if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('/') || imgSrc.startsWith('./')) {
    return imgSrc;
  }

  // Small data URIs (< 40KB) are already safe for storage
  if (imgSrc.startsWith('data:') && imgSrc.length <= 40000) {
    return imgSrc;
  }

  // If in browser and is a large data URI, downscale via canvas to keep the user's exact photo
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && imgSrc.startsWith('data:')) {
    try {
      const downscaled = await new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const timeout = setTimeout(() => resolve(imgSrc), 1500);
        img.onload = () => {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement('canvas');
            let w = img.width || maxDim;
            let h = img.height || maxDim;
            if (w > h) {
              h = Math.round((h * maxDim) / Math.max(1, w));
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / Math.max(1, h));
              h = maxDim;
            }
            canvas.width = Math.max(1, w);
            canvas.height = Math.max(1, h);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressed = canvas.toDataURL('image/jpeg', quality);
              resolve(compressed);
              return;
            }
          } catch {
            // fallback to original
          }
          resolve(imgSrc);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          resolve(imgSrc);
        };
        img.src = imgSrc;
      });
      return downscaled;
    } catch {
      return imgSrc;
    }
  }

  return imgSrc;
}

/**
 * Creates a lightweight, compact clone of an order suitable for localStorage and cloud storage
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
          product: sanitizeProductForStorage(item.product)
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
    
    // Sanitize cart and wishlist to ensure no multi-megabyte base64 strings inflate user document
    const safeCart = Array.isArray(cartItems)
      ? cartItems.map(item => ({
          ...item,
          product: sanitizeProductForStorage(item.product)
        }))
      : [];

    const safeWishlist = Array.isArray(wishlistItems)
      ? wishlistItems.map(item => ({
          ...item,
          product: sanitizeProductForStorage(item.product)
        }))
      : [];

    const updatePayload: Record<string, any> = {
      cartItems: safeCart,
      wishlistItems: safeWishlist,
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

/**
 * Persist an order to Firestore permanent cloud storage with full metadata and timeline.
 * Guaranteed to stay far below Firestore's 1MB (1,048,576 bytes) document size limit.
 */
export async function saveOrderToFirestore(order: Order, userId?: string, patronEmail?: string): Promise<void> {
  if (!order || !order.id) return;
  try {
    const orderDocRef = doc(firestore, 'orders', order.id);

    // Asynchronously create compact, high-performance thumbnails for any uploaded item images
    const sanitizedItems = await Promise.all(
      (order.items || []).map(async (item) => {
        const rawProd = item.product || ({} as Product);
        const rawImg = rawProd.images?.[0];
        const compactImg = await createCompactThumbnail(rawImg);
        const cleanProd = sanitizeProductForStorage(rawProd);
        cleanProd.images = [compactImg];

        return {
          quantity: item.quantity || 1,
          selectedSize: item.selectedSize,
          selectedFinish: item.selectedFinish,
          product: cleanProd
        };
      })
    );

    const orderPayload = {
      ...order,
      items: sanitizedItems,
      userId: userId || order.userId || 'guest',
      customerEmail: patronEmail || order.customerEmail || '',
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusUpdates: order.statusUpdates || [
        {
          status: order.status || 'Confirmed',
          timestamp: new Date().toISOString(),
          note: 'Order successfully placed by patron and acknowledged in atelier ledger.'
        }
      ]
    };

    // Absolute safety check: If document payload approaches 900KB, fall back to CDN placeholder
    try {
      const payloadString = JSON.stringify(orderPayload);
      if (payloadString.length > 900000) {
        orderPayload.items = orderPayload.items.map(it => ({
          ...it,
          product: {
            ...it.product,
            images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80']
          }
        }));
      }
    } catch {
      // ignore
    }

    await setDoc(orderDocRef, orderPayload, { merge: true });

    // Also link to user's private orderHistory in Firestore if userId is present
    if (userId && userId !== 'guest') {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const existingHistory: Order[] = Array.isArray(userData.orderHistory) ? userData.orderHistory : [];
          const updatedHistory = [
            orderPayload,
            ...existingHistory.filter(o => o.id !== order.id)
          ].slice(0, 15);
          await setDoc(userDocRef, { orderHistory: updatedHistory }, { merge: true });
        }
      } catch (userErr) {
        console.warn('Notice updating user order history in Firestore:', userErr);
      }
    }
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
  }
}

/**
 * Update an order's lifecycle status in Firestore and record chronological event log
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  newStatus: Order['status'], 
  note?: string
): Promise<void> {
  if (!orderId) return;
  try {
    const orderDocRef = doc(firestore, 'orders', orderId);
    const snap = await getDoc(orderDocRef);
    const now = new Date().toISOString();
    
    let existingUpdates: any[] = [];
    let userId: string | undefined = undefined;

    if (snap.exists()) {
      const data = snap.data();
      existingUpdates = Array.isArray(data.statusUpdates) ? data.statusUpdates : [];
      userId = data.userId;
    }

    const defaultNotes: Record<string, string> = {
      Confirmed: 'Order confirmed and registered in ledger.',
      Processing: 'Master goldsmiths handcrafting, setting stones, and applying certified hallmarks.',
      Accepted: 'Order accepted by Atelier master artisans.',
      Crafting: 'Jewellery is being handcrafted, set, and hallmarked in the atelier.',
      Shipped: 'Vault-sealed in tamper-evident packaging and dispatched via insured courier.',
      Dispatched: 'Package inspected, sealed in tamper-evident vault box, and handed to courier.',
      'Out for Delivery': 'Courier out for final secure delivery to patron destination.',
      Delivered: 'Package successfully delivered and signed for by patron.',
      Cancelled: 'Order cancelled by atelier.'
    };

    const newUpdateEntry = {
      status: newStatus,
      timestamp: now,
      note: note || defaultNotes[newStatus] || `Status updated to ${newStatus}`
    };

    const updatedTimeline = [...existingUpdates, newUpdateEntry];

    await setDoc(orderDocRef, {
      status: newStatus,
      updatedAt: now,
      statusUpdates: updatedTimeline
    }, { merge: true });

    // Sync back to user's orderHistory if linked
    if (userId && userId !== 'guest') {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const existingHistory: Order[] = Array.isArray(userData.orderHistory) ? userData.orderHistory : [];
          const updatedHistory = existingHistory.map(o => {
            if (o.id === orderId) {
              return { ...o, status: newStatus, statusUpdates: updatedTimeline };
            }
            return o;
          });
          await setDoc(userDocRef, { orderHistory: updatedHistory }, { merge: true });
        }
      } catch (err) {
        console.warn('Notice updating user doc with new status:', err);
      }
    }
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
  }
}

// Identifiers of demo/dummy orders that must be excluded across the entire application
export const DUMMY_ORDER_IDENTIFIERS = new Set<string>([
  'NXT-2026-78951',
  'NXT-2026-37994',
  'NXT-2026-90586',
  'NXT-2026-63621',
  'NXT-2026-88392'
]);

const DELETED_ORDERS_KEY = 'naxtto_deleted_order_ids';

export function getDeletedOrderIds(): Set<string> {
  const deleted = new Set<string>(DUMMY_ORDER_IDENTIFIERS);
  try {
    const raw = localStorage.getItem(DELETED_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => deleted.add(id));
      }
    }
  } catch {}
  return deleted;
}

export function recordOrderDeletion(orderId: string): void {
  if (!orderId) return;
  try {
    const raw = localStorage.getItem(DELETED_ORDERS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(orderId)) {
      list.push(orderId);
      safeSetItem(DELETED_ORDERS_KEY, JSON.stringify(list));
    }

    // Also remove from naxtto_all_orders in localStorage
    const saved = localStorage.getItem('naxtto_all_orders');
    if (saved) {
      const parsed: Order[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(o => o && o.id !== orderId && o.orderNumber !== orderId);
        safeSetItem('naxtto_all_orders', JSON.stringify(cleaned));
      }
    }
  } catch (err) {
    console.warn('Error recording order deletion:', err);
  }
}

export function clearAllOrderRecords(): void {
  try {
    safeSetItem('naxtto_all_orders', JSON.stringify([]));
  } catch {}
}

/**
 * Real-time subscription to all orders in Firestore for Admin Panel / Seller Hub
 */
export function subscribeToAllOrders(callback: (orders: Order[]) => void): () => void {
  try {
    const ordersCol = collection(firestore, 'orders');
    return onSnapshot(ordersCol, (snapshot) => {
      const ordersList: Order[] = [];
      const deletedIds = getDeletedOrderIds();

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d && (d.id || d.orderNumber)) {
          const id = d.id || docSnap.id;
          const orderNum = d.orderNumber || d.id || docSnap.id;
          if (deletedIds.has(id) || deletedIds.has(orderNum) || DUMMY_ORDER_IDENTIFIERS.has(id) || DUMMY_ORDER_IDENTIFIERS.has(orderNum)) {
            return;
          }

          ordersList.push({
            id,
            orderNumber: orderNum,
            date: d.date || new Date().toISOString().split('T')[0],
            status: d.status || 'Confirmed',
            items: Array.isArray(d.items) ? d.items : [],
            subtotal: Number(d.subtotal) || 0,
            shippingFee: Number(d.shippingFee) || 0,
            discount: Number(d.discount) || 0,
            tax: Number(d.tax) || 0,
            total: Number(d.total) || 0,
            shippingAddress: d.shippingAddress || {
              fullName: 'Valued Patron',
              addressLine1: 'Atelier Destination',
              city: 'Mumbai',
              state: 'MH',
              postalCode: '400001',
              country: 'India',
              phone: ''
            },
            trackingNumber: d.trackingNumber || `TRACK-NXT-${docSnap.id.slice(-6).toUpperCase()}`,
            paymentMethod: d.paymentMethod || 'Razorpay Online',
            estimatedDelivery: d.estimatedDelivery || '3–5 Business Days',
            userId: d.userId,
            customerEmail: d.customerEmail,
            createdAt: d.createdAt,
            statusUpdates: d.statusUpdates || []
          });
        }
      });

      // Sort by creation time descending (newest first)
      ordersList.sort((a, b) => {
        const timeA = new Date((a as any).createdAt || a.date || 0).getTime();
        const timeB = new Date((b as any).createdAt || b.date || 0).getTime();
        return timeB - timeA;
      });

      callback(ordersList);
    }, (error) => {
      console.warn('Firestore orders subscription notice:', error);
      try {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      } catch (e) {
        // Log formatted error info
      }
    });
  } catch (err) {
    console.warn('Firestore orders onSnapshot failed to initialize:', err);
    return () => {};
  }
}

/**
 * Real-time subscription to a single order by ID or orderNumber from Firestore
 */
export function subscribeToSingleOrder(
  orderIdentifier: string,
  callback: (order: Order | null) => void,
  onError?: (err: unknown) => void
): () => void {
  if (!orderIdentifier) {
    callback(null);
    return () => {};
  }
  const cleanId = orderIdentifier.trim();
  try {
    const orderDocRef = doc(firestore, 'orders', cleanId);
    return onSnapshot(
      orderDocRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          callback(null);
          return;
        }
        const d = docSnap.data();
        const parsedOrder: Order = {
          id: d.id || docSnap.id,
          orderNumber: d.orderNumber || d.id || docSnap.id,
          date: d.date || new Date().toISOString().split('T')[0],
          status: d.status || 'Confirmed',
          items: Array.isArray(d.items) ? d.items : [],
          subtotal: Number(d.subtotal) || 0,
          shippingFee: Number(d.shippingFee) || 0,
          discount: Number(d.discount) || 0,
          tax: Number(d.tax) || 0,
          total: Number(d.total) || 0,
          shippingAddress: d.shippingAddress || {
            fullName: 'Valued Patron',
            addressLine1: 'Atelier Destination',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'India',
            phone: ''
          },
          trackingNumber: d.trackingNumber || `TRACK-NXT-${docSnap.id.slice(-6).toUpperCase()}`,
          paymentMethod: d.paymentMethod || 'Razorpay Online',
          estimatedDelivery: d.estimatedDelivery || '3–5 Business Days',
          userId: d.userId,
          customerEmail: d.customerEmail,
          createdAt: d.createdAt,
          statusUpdates: d.statusUpdates || []
        };
        callback(parsedOrder);
      },
      (error) => {
        console.warn(`Firestore single order listener notice (${cleanId}):`, error);
        if (onError) {
          onError(error);
        } else {
          try {
            handleFirestoreError(error, OperationType.GET, `orders/${cleanId}`);
          } catch (e) {
            // caught
          }
        }
      }
    );
  } catch (err) {
    console.warn(`Failed to attach Firestore single order listener for ${cleanId}:`, err);
    return () => {};
  }
}

/**
 * Real-time subscription to a patron's specific orders in Firestore
 */
export function subscribeToUserOrders(
  userId: string | undefined,
  userEmail: string | undefined,
  callback: (orders: Order[]) => void,
  knownOrderIds?: string[]
): () => void {
  try {
    const ordersCol = collection(firestore, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        const matchingOrders: Order[] = [];
        const normalizedEmail = userEmail?.toLowerCase().trim();
        const cleanUserId = userId?.trim();

        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          if (!d) return;

          const orderUserId = d.userId;
          const orderEmail = d.customerEmail?.toLowerCase().trim();
          const shippingEmail = d.shippingAddress?.email?.toLowerCase().trim();
          const docId = docSnap.id;
          const orderId = d.id || docId;

          const isKnownId = Array.isArray(knownOrderIds) && (knownOrderIds.includes(docId) || knownOrderIds.includes(orderId));

          const isMatch =
            isKnownId ||
            (cleanUserId && cleanUserId !== 'guest' && orderUserId === cleanUserId) ||
            (normalizedEmail && (orderEmail === normalizedEmail || shippingEmail === normalizedEmail));

          if (isMatch || (!cleanUserId && !normalizedEmail)) {
            matchingOrders.push({
              id: d.id || docSnap.id,
              orderNumber: d.orderNumber || d.id || docSnap.id,
              date: d.date || new Date().toISOString().split('T')[0],
              status: d.status || 'Confirmed',
              items: Array.isArray(d.items) ? d.items : [],
              subtotal: Number(d.subtotal) || 0,
              shippingFee: Number(d.shippingFee) || 0,
              discount: Number(d.discount) || 0,
              tax: Number(d.tax) || 0,
              total: Number(d.total) || 0,
              shippingAddress: d.shippingAddress || {
                fullName: 'Valued Patron',
                addressLine1: 'Atelier Destination',
                city: 'Mumbai',
                state: 'MH',
                postalCode: '400001',
                country: 'India',
                phone: ''
              },
              trackingNumber: d.trackingNumber || `TRACK-NXT-${docSnap.id.slice(-6).toUpperCase()}`,
              paymentMethod: d.paymentMethod || 'Razorpay Online',
              estimatedDelivery: d.estimatedDelivery || '3–5 Business Days',
              userId: d.userId,
              customerEmail: d.customerEmail,
              createdAt: d.createdAt,
              statusUpdates: d.statusUpdates || []
            });
          }
        });

        matchingOrders.sort((a, b) => {
          const timeA = new Date((a as any).createdAt || a.date || 0).getTime();
          const timeB = new Date((b as any).createdAt || b.date || 0).getTime();
          return timeB - timeA;
        });

        callback(matchingOrders);
      },
      (error) => {
        console.warn('Firestore user orders subscription notice:', error);
        try {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        } catch (e) {
          // caught
        }
      }
    );
  } catch (err) {
    console.warn('Firestore subscribeToUserOrders failed to initialize:', err);
    return () => {};
  }
}

/**
 * Fetch all orders once from Firestore directly
 */
export async function fetchAllOrdersFromFirestore(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(firestore, 'orders'));
    const ordersList: Order[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d && (d.id || d.orderNumber)) {
        ordersList.push({
          id: d.id || docSnap.id,
          orderNumber: d.orderNumber || d.id || docSnap.id,
          date: d.date || new Date().toISOString().split('T')[0],
          status: d.status || 'Confirmed',
          items: Array.isArray(d.items) ? d.items : [],
          subtotal: Number(d.subtotal) || 0,
          shippingFee: Number(d.shippingFee) || 0,
          discount: Number(d.discount) || 0,
          tax: Number(d.tax) || 0,
          total: Number(d.total) || 0,
          shippingAddress: d.shippingAddress || {
            fullName: 'Valued Patron',
            addressLine1: 'Atelier Destination',
            city: 'Mumbai',
            state: 'MH',
            postalCode: '400001',
            country: 'India',
            phone: ''
          },
          trackingNumber: d.trackingNumber || `TRACK-NXT-${docSnap.id.slice(-6).toUpperCase()}`,
          paymentMethod: d.paymentMethod || 'Razorpay Online',
          estimatedDelivery: d.estimatedDelivery || '3–5 Business Days',
          userId: d.userId,
          customerEmail: d.customerEmail,
          createdAt: d.createdAt,
          statusUpdates: d.statusUpdates || []
        });
      }
    });

    ordersList.sort((a, b) => {
      const timeA = new Date((a as any).createdAt || a.date || 0).getTime();
      const timeB = new Date((b as any).createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });

    return ordersList;
  } catch (err) {
    console.warn('Fetch all orders from Firestore notice:', err);
    return [];
  }
}

/**
 * Permanently delete an individual order from Firestore and local cache
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  if (!orderId) return false;
  recordOrderDeletion(orderId);
  try {
    const orderDocRef = doc(firestore, 'orders', orderId);
    await deleteDoc(orderDocRef).catch(() => {});

    // Also look up and delete any doc matching orderNumber or id
    const snap = await getDocs(collection(firestore, 'orders')).catch(() => null);
    if (snap) {
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        if (docSnap.id === orderId || d.id === orderId || d.orderNumber === orderId) {
          await deleteDoc(docSnap.ref).catch(() => {});
        }
      }
    }
    return true;
  } catch (err) {
    console.warn(`Failed to delete order ${orderId} from Firestore:`, err);
    return false;
  }
}

/**
 * Permanently purge all orders from Firestore cloud storage and local caches
 */
export async function clearAllOrdersFromFirestore(): Promise<number> {
  try {
    clearAllOrderRecords();
    const snap = await getDocs(collection(firestore, 'orders')).catch(() => null);
    let count = 0;
    if (snap) {
      for (const docSnap of snap.docs) {
        await deleteDoc(docSnap.ref).catch(() => {});
        count++;
      }
    }
    return count;
  } catch (err) {
    console.warn('Failed to clear all orders from Firestore:', err);
    return 0;
  }
}

/**
 * Cleanly serializes a catalog product for Firestore cloud storage.
 * Preserves user-uploaded images, descriptions, size variations, and all supplier portal specifications.
 * Ensures no undefined values are sent to Firestore (which causes setDoc to crash).
 */
export function serializeProductForFirestore(product: Product): Record<string, any> {
  if (!product) return {};
  
  const clean: Record<string, any> = {};
  const assignIfPresent = (key: string, val: any) => {
    if (val !== undefined) {
      clean[key] = val;
    }
  };

  assignIfPresent('id', product.id);
  assignIfPresent('name', product.name);
  assignIfPresent('subtitle', product.subtitle || '');
  assignIfPresent('price', Number(product.price) || 0);
  assignIfPresent('originalPrice', product.originalPrice ? Number(product.originalPrice) : null);
  assignIfPresent('category', product.category && product.category !== 'all' ? product.category : 'shakha');
  assignIfPresent('metal', product.metal || '18k-yellow-gold');
  assignIfPresent('metalName', product.metalName || '');
  assignIfPresent('style', product.style || 'traditional-bengali');
  assignIfPresent('styleName', product.styleName || '');

  // Preserve all images exactly as submitted
  const safeImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.images ? [product.images as unknown as string] : ['/src/assets/images/shankha_pola_set_1790249913718.jpg']);
  assignIfPresent('images', safeImages);

  assignIfPresent('description', product.description || '');
  assignIfPresent('story', product.story || '');
  assignIfPresent('features', Array.isArray(product.features) ? product.features : []);
  assignIfPresent('dimensions', product.dimensions || '');
  assignIfPresent('karatPurity', product.karatPurity || '');
  assignIfPresent('origin', product.origin || '');
  assignIfPresent('sku', product.sku || '');
  assignIfPresent('inStock', product.inStock ?? true);
  assignIfPresent('stockCount', Number(product.stockCount) ?? 1);
  assignIfPresent('isActive', product.isActive ?? true);
  assignIfPresent('isBestSeller', product.isBestSeller ?? false);
  assignIfPresent('isNewArrival', product.isNewArrival ?? false);
  assignIfPresent('rating', Number(product.rating) || 5.0);
  assignIfPresent('reviewsCount', Number(product.reviewsCount) || 0);
  assignIfPresent('availableSizes', Array.isArray(product.availableSizes) ? product.availableSizes : []);
  assignIfPresent('sizeVariations', Array.isArray(product.sizeVariations) ? product.sizeVariations : []);
  assignIfPresent('availableFinishes', Array.isArray(product.availableFinishes) ? product.availableFinishes : []);
  assignIfPresent('reviews', Array.isArray(product.reviews) ? product.reviews : []);

  // Supplier Portal Single Catalog specifications - strictly preserved
  assignIfPresent('netWeightGrams', product.netWeightGrams ?? '');
  assignIfPresent('productId', product.productId ?? '');
  assignIfPresent('size', product.size ?? '');
  assignIfPresent('closure', product.closure ?? '');
  assignIfPresent('color', product.color ?? '');
  assignIfPresent('genericName', product.genericName ?? '');
  assignIfPresent('netQuantity', product.netQuantity ?? '');
  assignIfPresent('occasion', product.occasion ?? '');
  assignIfPresent('plating', product.plating ?? '');
  assignIfPresent('diameter', product.diameter ?? '');
  assignIfPresent('dimensionMm', product.dimensionMm ?? '');
  assignIfPresent('sizing', product.sizing ?? '');
  assignIfPresent('stoneType', product.stoneType ?? '');
  assignIfPresent('trend', product.trend ?? '');
  assignIfPresent('productType', product.productType ?? '');
  assignIfPresent('countryOfOrigin', product.countryOfOrigin ?? '');
  assignIfPresent('manufacturerName', product.manufacturerName ?? '');
  assignIfPresent('manufacturerAddress', product.manufacturerAddress ?? '');
  assignIfPresent('manufacturerPincode', product.manufacturerPincode ?? '');
  assignIfPresent('packerName', product.packerName ?? '');
  assignIfPresent('packerAddress', product.packerAddress ?? '');
  assignIfPresent('packerPincode', product.packerPincode ?? '');
  assignIfPresent('importerName', product.importerName ?? '');
  assignIfPresent('importerAddress', product.importerAddress ?? '');
  assignIfPresent('importerPincode', product.importerPincode ?? '');
  assignIfPresent('baseMetal', product.baseMetal ?? '');
  assignIfPresent('brand', product.brand ?? '');

  return clean;
}

/**
 * Persist a product piece to Firestore permanent cloud storage.
 * Preserves user images, description, size variations, and all catalog details without data loss.
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  if (!product || !product.id) return;
  try {
    const prodDocRef = doc(firestore, 'products', product.id);
    const clean = serializeProductForFirestore(product);
    await setDoc(prodDocRef, {
      ...clean,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save product to Firestore:', err);
  }
}

const DELETED_PRODUCTS_KEY = 'naxtto_deleted_product_ids';

/**
 * Retrieve the set of permanently deleted product IDs from local storage.
 */
export function getDeletedProductIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Permanently purge a product everywhere across local storage, shopping bags, wishlists, and cloud records.
 */
export function recordProductDeletion(productId: string): void {
  if (!productId) return;
  try {
    // 1. Add to tombstone array in localStorage
    const current = getDeletedProductIds();
    if (!current.includes(productId)) {
      current.push(productId);
      safeSetItem(DELETED_PRODUCTS_KEY, JSON.stringify(current));
    }

    // 2. Remove from naxtto_products in localStorage
    const savedProds = localStorage.getItem('naxtto_products');
    if (savedProds) {
      try {
        const parsed: Product[] = JSON.parse(savedProds);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(p => p.id !== productId);
          safeSetItem('naxtto_products', JSON.stringify(filtered));
        }
      } catch {}
    }

    // 3. Remove from all user carts in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('naxtto_user_cart_') || key === 'naxtto_cart' || key === 'naxtto_cart_v2')) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const items: CartItem[] = JSON.parse(raw);
            if (Array.isArray(items)) {
              const filtered = items.filter(item => item.product?.id !== productId);
              safeSetItem(key, JSON.stringify(filtered));
            }
          }
        } catch {}
      }
    }

    // 4. Remove from all user wishlists in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('naxtto_user_wishlist_') || key === 'naxtto_wishlist' || key === 'naxtto_wishlist_v2')) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const items: WishlistItem[] = JSON.parse(raw);
            if (Array.isArray(items)) {
              const filtered = items.filter(item => item.product?.id !== productId);
              safeSetItem(key, JSON.stringify(filtered));
            }
          }
        } catch {}
      }
    }

    // 5. Dispatch cross-component deletion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('naxtto_product_deleted', { detail: { productId } }));
    }
  } catch (err) {
    console.warn('Error recording product deletion locally:', err);
  }
}

/**
 * Remove a product piece from Firestore permanent cloud storage and record tombstone.
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  if (!productId) return;
  try {
    const prodDocRef = doc(firestore, 'products', productId);
    await deleteDoc(prodDocRef);

    // Also record tombstone so real-time listeners across clients know this item was permanently purged
    const tombstoneRef = doc(firestore, 'deleted_products', productId);
    await setDoc(tombstoneRef, {
      id: productId,
      deletedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Failed to delete product from Firestore:', err);
  }
}

/**
 * Real-time subscription to custom catalog products in Firestore.
 */
export function subscribeToAllProducts(callback: (products: Product[]) => void): () => void {
  try {
    const prodsCol = collection(firestore, 'products');
    return onSnapshot(prodsCol, (snapshot) => {
      const deletedSet = new Set(getDeletedProductIds());
      const prodsList: Product[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const pId = d.id || docSnap.id;
        if (d && d.name && d.price && !deletedSet.has(pId)) {
          const rawImages = Array.isArray(d.images) && d.images.length > 0 
            ? d.images 
            : (d.images ? [d.images] : []);

          prodsList.push({
            id: pId,
            name: d.name,
            subtitle: d.subtitle || undefined,
            price: Number(d.price) || 0,
            originalPrice: d.originalPrice ? Number(d.originalPrice) : undefined,
            category: d.category && d.category !== 'all' ? d.category : 'shakha',
            metal: d.metal || '18k-yellow-gold',
            metalName: d.metalName || undefined,
            style: d.style || 'traditional-bengali',
            styleName: d.styleName || undefined,
            images: rawImages,
            description: d.description || '',
            story: d.story || undefined,
            features: Array.isArray(d.features) ? d.features : [],
            dimensions: d.dimensions || undefined,
            karatPurity: d.karatPurity || undefined,
            origin: d.origin || undefined,
            sku: d.sku || undefined,
            inStock: d.inStock ?? true,
            stockCount: Number(d.stockCount) ?? 1,
            isBestSeller: d.isBestSeller ?? false,
            isNewArrival: d.isNewArrival ?? false,
            rating: Number(d.rating) || 5,
            reviewsCount: Number(d.reviewsCount) || 0,
            availableSizes: Array.isArray(d.availableSizes) ? d.availableSizes : [],
            sizeVariations: Array.isArray(d.sizeVariations) ? d.sizeVariations : [],
            availableFinishes: Array.isArray(d.availableFinishes) ? d.availableFinishes : [],
            reviews: Array.isArray(d.reviews) ? d.reviews : [],
            isActive: d.isActive !== undefined ? d.isActive : true,
            // Single Catalog Supplier Portal fields
            netWeightGrams: d.netWeightGrams || undefined,
            productId: d.productId || undefined,
            size: d.size || undefined,
            closure: d.closure || undefined,
            color: d.color || undefined,
            genericName: d.genericName || undefined,
            netQuantity: d.netQuantity || undefined,
            occasion: d.occasion || undefined,
            plating: d.plating || undefined,
            diameter: d.diameter || undefined,
            dimensionMm: d.dimensionMm || undefined,
            sizing: d.sizing || undefined,
            stoneType: d.stoneType || undefined,
            trend: d.trend || undefined,
            productType: d.productType || undefined,
            countryOfOrigin: d.countryOfOrigin || undefined,
            manufacturerName: d.manufacturerName || undefined,
            manufacturerAddress: d.manufacturerAddress || undefined,
            manufacturerPincode: d.manufacturerPincode || undefined,
            packerName: d.packerName || undefined,
            packerAddress: d.packerAddress || undefined,
            packerPincode: d.packerPincode || undefined,
            importerName: d.importerName || undefined,
            importerAddress: d.importerAddress || undefined,
            importerPincode: d.importerPincode || undefined,
            baseMetal: d.baseMetal || undefined,
            brand: d.brand || undefined
          });
        }
      });

      if (prodsList.length > 0) {
        callback(prodsList);
      }
    }, (error) => {
      console.warn('Firestore products onSnapshot notice:', error);
    });
  } catch (err) {
    console.warn('Firestore products subscription init failed:', err);
    return () => {};
  }
}

/**
 * Real-time subscription to cloud-level deleted product tombstones.
 */
export function subscribeToDeletedProducts(callback: (deletedIds: string[]) => void): () => void {
  try {
    const colRef = collection(firestore, 'deleted_products');
    return onSnapshot(colRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach(docSnap => {
        ids.push(docSnap.id);
      });
      if (ids.length > 0) {
        const current = getDeletedProductIds();
        const combined = Array.from(new Set([...current, ...ids]));
        safeSetItem(DELETED_PRODUCTS_KEY, JSON.stringify(combined));
        callback(combined);
      }
    }, (error) => {
      console.warn('Deleted products snapshot notice:', error);
    });
  } catch {
    return () => {};
  }
}



