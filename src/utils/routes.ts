import { Product } from '../types';
import { loadCachedSeoSettings } from './seoManager';

export type AppView = 'shop' | 'product-detail' | 'account' | 'checkout' | 'admin';

export interface RouteInfo {
  view: AppView;
  product: Product | null;
  targetPath: string;
}

/**
 * Parses the current URL location (pathname, search params, and hash)
 * to determine the initial or updated application view.
 */
export function parseRouteFromLocation(
  availableProducts: Product[],
  isLoggedIn: boolean = false
): RouteInfo {
  if (typeof window === 'undefined') {
    return { view: 'shop', product: null, targetPath: '/' };
  }

  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase().replace(/^#/, '').replace(/\/+$/, '');

  // Check if hash has a route (e.g. #/login)
  const effectivePath = hash.startsWith('/') ? hash : rawPath;
  const viewParam = searchParams.get('view')?.toLowerCase();
  const productParam = searchParams.get('product') || searchParams.get('productId');

  // 1. Login & Sign-in Routes
  if (
    effectivePath === '/login' ||
    effectivePath === '/signin' ||
    effectivePath === '/sign-in' ||
    effectivePath === '/signup' ||
    effectivePath === '/sign-up' ||
    viewParam === 'login' ||
    viewParam === 'signin' ||
    viewParam === 'signup'
  ) {
    return {
      view: 'account',
      product: null,
      targetPath: isLoggedIn ? '/account' : '/login'
    };
  }

  // 2. Account & Orders Routes
  if (
    effectivePath === '/account' ||
    effectivePath === '/profile' ||
    effectivePath === '/orders' ||
    effectivePath === '/my-orders' ||
    viewParam === 'account' ||
    viewParam === 'orders'
  ) {
    return {
      view: 'account',
      product: null,
      targetPath: isLoggedIn ? '/account' : '/login'
    };
  }

  // 3. Checkout & Bag Routes
  if (
    effectivePath === '/checkout' ||
    effectivePath === '/cart' ||
    effectivePath === '/bag' ||
    viewParam === 'checkout' ||
    viewParam === 'cart'
  ) {
    return {
      view: 'checkout',
      product: null,
      targetPath: '/checkout'
    };
  }

  // 4. Admin & Seller Hub Routes
  if (
    effectivePath === '/admin' ||
    effectivePath === '/seller-hub' ||
    effectivePath === '/seller' ||
    viewParam === 'admin' ||
    viewParam === 'seller'
  ) {
    return {
      view: 'admin',
      product: null,
      targetPath: '/admin'
    };
  }

  // 5. Product Detail Routes (/product/:id or /products/:id or ?product=...)
  if (
    effectivePath.startsWith('/product/') ||
    effectivePath.startsWith('/products/') ||
    productParam
  ) {
    let prodIdentifier = productParam;
    if (!prodIdentifier) {
      const parts = effectivePath.split('/');
      prodIdentifier = parts[parts.length - 1];
    }

    if (prodIdentifier) {
      const decodedId = decodeURIComponent(prodIdentifier).toLowerCase();
      const matched = availableProducts.find(p => 
        p.id.toLowerCase() === decodedId ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedId
      );
      if (matched) {
        return {
          view: 'product-detail',
          product: matched,
          targetPath: `/product/${matched.id}`
        };
      }
    }
  }

  // 6. Session Storage Recovery Layer (for seamless page refresh if URL was modified)
  try {
    const savedView = sessionStorage.getItem('naxtto_current_view');
    const savedProdId = sessionStorage.getItem('naxtto_selected_product_id');

    if (effectivePath === '/' && savedView) {
      if (savedView === 'login') {
        return { view: 'account', product: null, targetPath: '/login' };
      }
      if (savedView === 'account') {
        return { view: 'account', product: null, targetPath: isLoggedIn ? '/account' : '/login' };
      }
      if (savedView === 'checkout') {
        return { view: 'checkout', product: null, targetPath: '/checkout' };
      }
      if (savedView === 'admin') {
        return { view: 'admin', product: null, targetPath: '/admin' };
      }
      if (savedView === 'product-detail' && savedProdId) {
        const matched = availableProducts.find(p => p.id === savedProdId);
        if (matched) {
          return { view: 'product-detail', product: matched, targetPath: `/product/${matched.id}` };
        }
      }
    }
  } catch {}

  // Default: Shop catalog
  return {
    view: 'shop',
    product: null,
    targetPath: '/'
  };
}

/**
 * Returns the canonical URL path for a given view, login status, and product.
 */
export function getCanonicalPath(
  view: AppView,
  isLoggedIn: boolean,
  product: Product | null
): string {
  switch (view) {
    case 'account':
      return isLoggedIn ? '/account' : '/login';
    case 'checkout':
      return '/checkout';
    case 'admin':
      return '/admin';
    case 'product-detail':
      return product ? `/product/${product.id}` : '/';
    case 'shop':
    default:
      return '/';
  }
}

/**
 * Synchronizes the browser's address bar and history stack to reflect
 * the current active view, ensuring direct links and page refreshes work reliably.
 */
export function syncBrowserUrl(
  view: AppView,
  isLoggedIn: boolean,
  product: Product | null,
  options: { replace?: boolean } = {}
): void {
  if (typeof window === 'undefined') return;

  const targetPath = getCanonicalPath(view, isLoggedIn, product);
  const currentPath = window.location.pathname;

  // Set appropriate page titles
  const customSeo = loadCachedSeoSettings();
  let title = customSeo.siteTitle || 'NaxtTo Fine Jewellery Atelier | 22K Solid Gold & Conch Shell Creations';
  if (view === 'account') {
    title = isLoggedIn 
      ? `My Account & Consignments | ${customSeo.ogSiteName || 'NaxtTo Atelier'}` 
      : `Login or Signup | ${customSeo.ogSiteName || 'NaxtTo Atelier'}`;
  } else if (view === 'checkout') {
    title = `Secure Atelier Checkout | ${customSeo.ogSiteName || 'NaxtTo Fine Jewellery'}`;
  } else if (view === 'admin') {
    title = `Executive Admin & SEO Console | ${customSeo.ogSiteName || 'NaxtTo Fine Jewellery'}`;
  } else if (view === 'product-detail' && product) {
    title = `${product.name} | ${customSeo.ogSiteName || 'NaxtTo Fine Jewellery Atelier'}`;
  }

  // Persist to session storage for refresh persistence
  try {
    sessionStorage.setItem('naxtto_current_view', view === 'account' && !isLoggedIn ? 'login' : view);
    if (product?.id) {
      sessionStorage.setItem('naxtto_selected_product_id', product.id);
    } else {
      sessionStorage.removeItem('naxtto_selected_product_id');
    }
  } catch {}

  // Update HTML Document Title
  document.title = title;

  // Only update history if path is different or if forced replace
  if (currentPath !== targetPath) {
    if (options.replace) {
      window.history.replaceState({ view, productId: product?.id, path: targetPath }, title, targetPath);
    } else {
      window.history.pushState({ view, productId: product?.id, path: targetPath }, title, targetPath);
    }
  } else if (options.replace) {
    window.history.replaceState({ view, productId: product?.id, path: targetPath }, title, targetPath);
  }
}
