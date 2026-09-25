import { SeoSettings, DEFAULT_SEO_SETTINGS } from '../types';

export const SEO_STORAGE_KEY = 'naxtto_seo_settings';

export interface SeoPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  settings: Partial<SeoSettings>;
}

export const SEO_PRESETS: SeoPreset[] = [
  {
    id: 'bengali-bridal-sakha-pola',
    name: 'Bengali Bridal & Sakha Pola (Authentic Heritage)',
    badge: 'Popular • High Intent',
    description: 'Optimized for Bowbazar craftsmanship, hand-carved pure Shankha, 22K gold badhano, and bridal heirlooms.',
    settings: {
      siteTitle: 'NaxtTo Fine Jewellery | Bengali Sakha Pola & Bridal Heirlooms',
      metaDescription: 'Authentic Bengali Sakha Pola & bridal jewellery atelier featuring hand-carved pure conch Shankha, coral Pola, 22K gold badhano, and auspicious loha bangles.',
      metaKeywords: 'Sakha Pola, Shankha Pola, Sakha Pola gold badhano, Bengali bridal bangles, Conch shell bangles, Coral pola bangles, Loha badhano, Bowbazar gold jewellery, authentic sakha pola',
      author: 'Sakha Pola Atelier Bowbazar',
      canonicalUrl: 'https://naxtto.shop/',
      robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      ogTitle: 'Authentic Handcrafted Bengali Sakha Pola & Bridal Heirlooms | NaxtTo',
      ogDescription: 'Preserving Bengali wedding traditions with certified 22K gold badhano, pure conch shell Shankha, and natural coral Pola. Crafted in Bowbazar.',
      ogImage: '/src/assets/images/sakha_pola_stack_1790249812700.jpg',
      ogImageAlt: 'Handcrafted Sakha Pola with 22K Gold Badhano',
      ogType: 'website',
      ogSiteName: 'NaxtTo Bengali Heirlooms',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Authentic Bengali Sakha Pola & Bridal Heirlooms | NaxtTo',
      twitterDescription: 'Handcrafted pure conch Shankha, coral Pola, and 22K gold badhano with BIS hallmark certificate.',
      twitterImage: '/src/assets/images/sakha_pola_stack_1790249812700.jpg',
      twitterSite: '@naxtto',
      twitterCreator: '@naxtto',
      structuredDataType: 'JewelryStore',
      businessName: 'NaxtTo Sakha Pola & Bridal Jewellery Atelier',
      businessAddress: 'Bowbazar, Kolkata, West Bengal, India',
      currencyAccepted: 'INR, USD, EUR, GBP',
      priceRange: '₹₹ - ₹₹₹₹'
    }
  },
  {
    id: 'minimalist-18k-gold-diamonds',
    name: 'Modern Minimalist 18K Solid Gold & Ethical Diamonds',
    badge: 'Luxury • Contemporary',
    description: 'Designed for everyday luxury, stackable solid gold rings, ethical lab-grown diamonds, and Italian craftsmanship.',
    settings: {
      siteTitle: 'NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms',
      metaDescription: 'Discover NaxtTo: Handcrafted minimalist fine jewellery made with certified 18k solid gold, ethical diamonds, and recycled precious metals at naxtto.shop.',
      metaKeywords: '18k solid gold jewellery, minimalist diamond rings, recycled gold, ethical diamonds, everyday fine jewellery, luxury modern heirlooms, stackable bangles',
      author: 'NaxtTo Atelier Design Studio',
      canonicalUrl: 'https://naxtto.shop/',
      robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      ogTitle: 'NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms',
      ogDescription: 'Handcrafted minimalist fine jewellery forged in certified 18k solid gold and ethical diamonds. Designed for modern life.',
      ogImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      ogImageAlt: 'NaxtTo Minimalist Gold Ring and Diamond Collection',
      ogType: 'website',
      ogSiteName: 'NaxtTo Fine Jewellery',
      twitterCard: 'summary_large_image',
      twitterTitle: 'NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms',
      twitterDescription: 'Certified 18k solid gold, ethical diamonds, and recycled precious metals.',
      twitterImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      twitterSite: '@naxtto',
      twitterCreator: '@naxtto',
      structuredDataType: 'JewelryStore',
      businessName: 'NaxtTo Modern Jewellery Atelier',
      businessAddress: 'Milan & Kolkata',
      currencyAccepted: 'USD, EUR, GBP, INR',
      priceRange: '$$$$'
    }
  },
  {
    id: 'festive-wedding-season',
    name: 'Durga Puja & Wedding Season Celebration',
    badge: 'Festive Promo • Seasonal',
    description: 'High conversion festival showcase with exclusive bridal savings, gift boxes, and fast express dispatch.',
    settings: {
      siteTitle: 'Wedding & Festive Jewellery Season | NaxtTo Atelier Deals',
      metaDescription: 'Celebrate Durga Puja and Bengali weddings with exclusive bridal Shankha Pola sets, hallmarked 22K gold badhano, and complimentary insured worldwide delivery.',
      metaKeywords: 'Durga puja jewellery sale, wedding season sakha pola, bridal jewellery discounts, gold badhano offers, Bengali wedding bangles offer, NaxtTo festival collection',
      author: 'NaxtTo Festive Curation Team',
      canonicalUrl: 'https://naxtto.shop/?promo=festive',
      robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      ogTitle: 'Durga Puja & Bengali Wedding Season Jewellery | NaxtTo Atelier',
      ogDescription: 'Celebrate auspicious beginnings with pure 22K gold badhano Shankha Pola and bridal heirlooms. Extra 10% festive privilege.',
      ogImage: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg',
      ogImageAlt: 'Bengali Bridal Bangles and Pola Festive Set',
      ogType: 'website',
      ogSiteName: 'NaxtTo Festive Atelier',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Festive Season Jewellery Collection | NaxtTo',
      twitterDescription: 'Handcrafted Bengali bridal jewellery, certified 22K hallmarked gold badhano, and luxury gifting boxes.',
      twitterImage: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg',
      twitterSite: '@naxtto',
      twitterCreator: '@naxtto',
      structuredDataType: 'JewelryStore',
      businessName: 'NaxtTo Fine Jewellery - Festive Edition',
      businessAddress: 'Kolkata, West Bengal, India',
      currencyAccepted: 'INR, USD, EUR',
      priceRange: '₹₹₹'
    }
  }
];

/**
 * Updates or creates a <meta> tag in document.head
 */
function setMetaTag(selector: string, attrName: string, attrVal: string, content: string) {
  if (typeof document === 'undefined') return;
  try {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  } catch (err) {
    console.warn(`[SEO Manager] Failed to set meta tag for ${attrVal}:`, err);
  }
}

/**
 * Updates or creates a <link rel="..."> tag in document.head
 */
function setLinkTag(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  try {
    let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  } catch (err) {
    console.warn(`[SEO Manager] Failed to set link rel="${rel}":`, err);
  }
}

/**
 * Injects or updates Schema.org Structured Data (JSON-LD)
 */
function updateStructuredData(settings: SeoSettings) {
  if (typeof document === 'undefined') return;
  try {
    const scriptId = 'dynamic-seo-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!settings.structuredDataEnabled) {
      if (script) script.remove();
      return;
    }

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const canonicalUrl = settings.canonicalUrl || (window.location.origin + window.location.pathname);
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${canonicalUrl}#website`,
          "url": canonicalUrl,
          "name": settings.ogSiteName || "NaxtTo",
          "description": settings.metaDescription,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${canonicalUrl}?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": settings.structuredDataType || "JewelryStore",
          "@id": `${canonicalUrl}#organization`,
          "name": settings.businessName || "NaxtTo Fine Jewellery Atelier",
          "url": canonicalUrl,
          "image": settings.ogImage,
          "description": settings.metaDescription,
          "priceRange": settings.priceRange || "$$$$",
          "currenciesAccepted": settings.currencyAccepted || "INR, USD, EUR, GBP",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": settings.businessAddress || "Kolkata & Milan"
          },
          "sameAs": [
            "https://instagram.com/naxtto.jewels",
            canonicalUrl
          ]
        }
      ]
    };

    script.textContent = JSON.stringify(jsonLdData, null, 2);
  } catch (err) {
    console.warn('[SEO Manager] Failed to update JSON-LD structured data:', err);
  }
}

/**
 * Dynamically updates all page metadata, canonical link, OpenGraph tags,
 * Twitter cards, and Schema.org structured data directly in the browser DOM.
 * Works seamlessly without reloading the page or touching index.html.
 */
export function applyDynamicSeo(settings: Partial<SeoSettings>): void {
  if (typeof document === 'undefined') return;

  const fullSettings: SeoSettings = {
    ...DEFAULT_SEO_SETTINGS,
    ...settings
  };

  try {
    // 1. Page Title (<title>)
    if (fullSettings.siteTitle) {
      document.title = fullSettings.siteTitle;
    }

    // 2. Standard Search Metadata
    if (fullSettings.metaDescription) {
      setMetaTag('meta[name="description"]', 'name', 'description', fullSettings.metaDescription);
    }
    if (fullSettings.metaKeywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', fullSettings.metaKeywords);
    }
    if (fullSettings.author) {
      setMetaTag('meta[name="author"]', 'name', 'author', fullSettings.author);
    }
    if (fullSettings.robots) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', fullSettings.robots);
      setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', fullSettings.robots);
      setMetaTag('meta[name="bingbot"]', 'name', 'bingbot', fullSettings.robots);
    }

    // 3. Canonical URL (<link rel="canonical">)
    const activeCanonical = fullSettings.canonicalUrl || (window.location.origin + window.location.pathname);
    setLinkTag('canonical', activeCanonical);

    // 4. OpenGraph Tags (Facebook, WhatsApp, LinkedIn, iMessage)
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullSettings.ogTitle || fullSettings.siteTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', fullSettings.ogDescription || fullSettings.metaDescription);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', activeCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', fullSettings.ogType || 'website');
    if (fullSettings.ogSiteName) {
      setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', fullSettings.ogSiteName);
    }
    if (fullSettings.ogImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullSettings.ogImage);
    }
    if (fullSettings.ogImageAlt) {
      setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', fullSettings.ogImageAlt);
    }

    // 5. Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', fullSettings.twitterCard || 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullSettings.twitterTitle || fullSettings.ogTitle || fullSettings.siteTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', fullSettings.twitterDescription || fullSettings.ogDescription || fullSettings.metaDescription);
    if (fullSettings.twitterImage || fullSettings.ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullSettings.twitterImage || fullSettings.ogImage);
    }
    if (fullSettings.twitterSite) {
      setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', fullSettings.twitterSite);
    }
    if (fullSettings.twitterCreator) {
      setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', fullSettings.twitterCreator);
    }

    // 6. Schema.org JSON-LD
    updateStructuredData(fullSettings);

    // Dispatch notification event for live inspectors & UI
    window.dispatchEvent(new CustomEvent('naxtto_seo_applied', { detail: fullSettings }));
  } catch (err) {
    console.error('[SEO Manager] Error applying dynamic SEO settings:', err);
  }
}

/**
 * Inspects live DOM <head> tags and returns all values for verification
 */
export function getLiveHeadTags(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const head = document.head;
  const tags: Record<string, string> = {
    'title': document.title || '',
    'canonical': head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute('href') || '',
    'meta[name="description"]': head.querySelector<HTMLMetaElement>('meta[name="description"]')?.getAttribute('content') || '',
    'meta[name="keywords"]': head.querySelector<HTMLMetaElement>('meta[name="keywords"]')?.getAttribute('content') || '',
    'meta[name="author"]': head.querySelector<HTMLMetaElement>('meta[name="author"]')?.getAttribute('content') || '',
    'meta[name="robots"]': head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.getAttribute('content') || '',
    'meta[property="og:title"]': head.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.getAttribute('content') || '',
    'meta[property="og:description"]': head.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.getAttribute('content') || '',
    'meta[property="og:image"]': head.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.getAttribute('content') || '',
    'meta[property="og:url"]': head.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.getAttribute('content') || '',
    'meta[property="og:site_name"]': head.querySelector<HTMLMetaElement>('meta[property="og:site_name"]')?.getAttribute('content') || '',
    'meta[name="twitter:card"]': head.querySelector<HTMLMetaElement>('meta[name="twitter:card"]')?.getAttribute('content') || '',
    'meta[name="twitter:title"]': head.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.getAttribute('content') || '',
    'meta[name="twitter:image"]': head.querySelector<HTMLMetaElement>('meta[name="twitter:image"]')?.getAttribute('content') || '',
    'jsonld:structured-data': document.getElementById('dynamic-seo-jsonld') ? 'Injected & Active' : 'Not injected'
  };

  return tags;
}

/**
 * Loads cached SEO settings from localStorage
 */
export function loadCachedSeoSettings(): SeoSettings {
  if (typeof window === 'undefined') return DEFAULT_SEO_SETTINGS;
  try {
    const raw = localStorage.getItem(SEO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SEO_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('[SEO Manager] Failed to load cached SEO settings:', err);
  }
  return DEFAULT_SEO_SETTINGS;
}

/**
 * Saves SEO settings to localStorage and applies immediately to DOM
 */
export function saveCachedSeoSettings(settings: SeoSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(settings));
    applyDynamicSeo(settings);
  } catch (err) {
    console.warn('[SEO Manager] Failed to save cached SEO settings:', err);
  }
}
