import { Product } from '../types';

export const RECENTLY_VIEWED_STORAGE_KEY = 'naxtto_recently_viewed_ids';
export const MAX_RECENTLY_VIEWED = 5;

/**
 * Retrieve the list of recently visited product IDs from localStorage.
 */
export function getRecentlyViewedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) 
      ? parsed.filter((id): id is string => typeof id === 'string' && id.trim().length > 0) 
      : [];
  } catch (err) {
    console.warn('Error reading recently viewed product IDs:', err);
    return [];
  }
}

/**
 * Record a visit to a product. Moves the product to the front of the list,
 * removes duplicates, and maintains the last 5 visited products.
 */
export function trackProductVisit(productId: string): string[] {
  if (!productId || typeof window === 'undefined') return getRecentlyViewedIds();
  try {
    const current = getRecentlyViewedIds();
    // Remove if already present so it moves to index 0 (most recently visited)
    const filtered = current.filter(id => id !== productId);
    // Keep up to MAX_RECENTLY_VIEWED (5) items
    const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
    
    localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(updated));
    
    // Notify any active components about the update
    window.dispatchEvent(new CustomEvent('naxtto_recently_viewed_updated', { 
      detail: { ids: updated, lastVisitedId: productId } 
    }));
    
    return updated;
  } catch (err) {
    console.warn('Error saving recently viewed product ID:', err);
    return [];
  }
}

/**
 * Clear the recently viewed history from storage.
 */
export function clearRecentlyViewedHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('naxtto_recently_viewed_updated', { 
      detail: { ids: [] } 
    }));
  } catch (err) {
    console.warn('Error clearing recently viewed history:', err);
  }
}

/**
 * Maps a list of product IDs to Product objects from allProducts,
 * preserving the exact order of visit and filtering out deleted/missing pieces.
 */
export function resolveRecentlyViewedProducts(
  ids: string[], 
  allProducts: Product[],
  excludeCurrentId?: string
): Product[] {
  if (!Array.isArray(ids) || !Array.isArray(allProducts)) return [];
  
  const productMap = new Map<string, Product>();
  for (const p of allProducts) {
    if (p && p.id) {
      productMap.set(p.id, p);
    }
  }

  const results: Product[] = [];
  for (const id of ids) {
    if (excludeCurrentId && id === excludeCurrentId) {
      continue;
    }
    const prod = productMap.get(id);
    if (prod) {
      results.push(prod);
    }
  }

  return results.slice(0, MAX_RECENTLY_VIEWED);
}
