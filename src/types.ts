export type ProductCategory = 
  | 'all' 
  | 'shakha'
  | 'pola'
  | 'gold-badhano'
  | 'loha-badhano'
  | 'bridal-combos'
  | 'rings' 
  | 'necklaces' 
  | 'earrings' 
  | 'bracelets' 
  | 'fine-collections' 
  | 'bespoke';

export type MetalType = 
  | 'pure-conch-shell'
  | 'crimson-coral-acrylic'
  | '22k-yellow-gold'
  | '18k-yellow-gold'
  | 'iron-gold'
  | '18k-white-gold'
  | '18k-rose-gold'
  | '925-sterling-silver'
  | 'platinum'
  | 'gold-vermeil';

export type JewelleryStyle = 
  | 'traditional-bengali'
  | 'bridal-heritage'
  | 'hand-carved'
  | 'mukhi-design'
  | 'filigree-badhano'
  | 'daily-wear'
  | 'minimalist' 
  | 'statement' 
  | 'sculptural' 
  | 'bridal' 
  | 'everyday-luxe' 
  | 'vintage-modern';

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  itemPurchased?: string;
  helpfulCount: number;
}

export interface ProductSizeVariation {
  size: string;
  price: number;
  returnPrice?: number;
  mrp?: number;
  stockCount?: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  metal: MetalType;
  metalName: string;
  style: JewelleryStyle;
  styleName: string;
  images: string[];
  description: string;
  story: string;
  features: string[];
  dimensions: string;
  caratWeight?: string;
  weightGrams?: number | string;
  gemstone?: string;
  sku?: string;
  karatPurity: string;
  origin: string;
  inStock: boolean;
  stockCount: number;
  isActive?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  availableSizes?: string[];
  sizeVariations?: ProductSizeVariation[];
  availableFinishes?: {
    name: string;
    type: MetalType;
    colorHex: string;
  }[];
  // Single Catalog Fields (Supplier Portal)
  netWeightGrams?: string | number;
  productId?: string;
  size?: string;
  closure?: string;
  color?: string;
  genericName?: string;
  netQuantity?: string | number;
  occasion?: string;
  plating?: string;
  diameter?: string;
  dimensionMm?: string;
  sizing?: string;
  stoneType?: string;
  trend?: string;
  productType?: string;
  countryOfOrigin?: string;
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturerPincode?: string;
  packerName?: string;
  packerAddress?: string;
  packerPincode?: string;
  importerName?: string;
  importerAddress?: string;
  importerPincode?: string;
  baseMetal?: string;
  brand?: string;
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  selectedFinish?: MetalType;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface InstagramPost {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timestamp: string;
  taggedProductIds: string[];
  location?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: 'Craft & Atelier' | 'Care Guides' | 'Style & Stacking' | 'Gemology' | 'Sustainability' | 'Heritage & Rituals' | 'Sizing & Fit' | 'Care & Maintenance';
  readTime: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tableOfContents: { id: string; title: string }[];
  contentSections: {
    heading: string;
    body: string[];
    quote?: string;
    image?: string;
    imageCaption?: string;
  }[];
  seoKeywords: string[];
  metaDescription: string;
  relatedProductIds: string[];
}

export interface Address {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Accepted' | 'Crafting' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber: string;
  estimatedDelivery: string;
  userId?: string;
  customerEmail?: string;
  createdAt?: string;
  statusUpdates?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  emailNotifications?: EmailNotification[];
}

export interface EmailNotification {
  id: string;
  orderId: string;
  orderNumber: string;
  type: 'order_shipped' | 'order_confirmed' | 'order_delivered';
  recipientEmail: string;
  recipientName: string;
  sentAt: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: 'sent' | 'delivered' | 'pending';
  simulatedProvider?: string;
  provider?: 'resend' | 'resend-simulated' | string;
  resendId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isLoggedIn: boolean;
  memberTier: 'NaxtTo Circle' | 'Atelier Connoisseur' | 'VIP Privé';
  memberSince: string;
  savedAddresses: Address[];
  orderHistory: Order[];
  preferences: {
    metalPreferences: string[];
    metalPreference?: string;
    ringSize?: string;
    newsletterSubscribed: boolean;
  };
  rewardPoints?: number;
}

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  memberTier: string;
  status: 'active' | 'verified' | 'vip' | 'suspended';
  createdAt: string;
  lastActiveAt?: string;
  ordersCount: number;
  totalSpent: number;
  savedAddressesCount: number;
  cartItemsCount?: number;
  wishlistItemsCount?: number;
  savedAddresses?: Address[];
  notes?: string;
}

export interface SellerAccount {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: 'verified' | 'active' | 'pending_kyc' | 'suspended';
  badge: 'Master Artisan Guild' | 'Certified Seller' | 'Heritage Workshop' | 'Direct Artisan';
  city: string;
  rating: number;
  totalProducts: number;
  totalOrdersFulfilled: number;
  totalRevenue: number;
  commissionRate: number;
  gstNumber?: string;
  joinedDate: string;
  workshopAddress?: string;
  bankAccountLast4?: string;
}

export interface FilterOptions {
  category: ProductCategory;
  metals: MetalType[];
  styles: JewelleryStyle[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
  searchQuery: string;
}

export interface WowDealItem {
  id: string;
  category: ProductCategory;
  title: string;
  brand: string;
  discount: string;
  tagline?: string;
  image: string;
  priceNotice: string;
  badgeColor?: string;
  active?: boolean;
}

export interface TopRatedItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  category: ProductCategory;
  image: string;
  badge: string;
  badgeColor?: string;
  active?: boolean;
}

export interface HeroBannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  buttonText: string;
  targetCategory?: ProductCategory;
  couponCode?: string;
  note?: string;
  bgGradient?: string;
  accentColor?: string;
  type?: 'payday' | 'sakha-pola' | 'bridal-combos' | 'loha-badhano' | 'custom';
  active?: boolean;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  author: string;
  canonicalUrl: string;
  robots: string;
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogType: string;
  ogSiteName: string;
  // Twitter Card
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  // Structured Data (JSON-LD)
  structuredDataEnabled: boolean;
  structuredDataType: 'JewelryStore' | 'Organization' | 'WebSite' | 'Product';
  businessName: string;
  businessAddress: string;
  currencyAccepted: string;
  priceRange: string;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'NaxtTo Fine Jewellery | Bengali Sakha Pola & Bridal Heirlooms',
  metaDescription: 'Authentic Bengali Sakha Pola & bridal jewellery atelier featuring hand-carved pure conch Shankha, coral Pola, 22K gold badhano, and auspicious loha bangles.',
  metaKeywords: 'Sakha Pola, Shankha Pola, Sakha Pola gold badhano, Bengali bridal bangles, Conch shell bangles, Coral pola bangles, Loha badhano, Bowbazar gold jewellery, authentic sakha pola',
  author: 'Sakha Pola Atelier',
  canonicalUrl: 'https://naxtto.shop/',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  ogTitle: 'NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms',
  ogDescription: 'Discover NaxtTo: Handcrafted minimalist fine jewellery made with certified 18k solid gold, ethical diamonds, and recycled precious metals at naxtto.shop.',
  ogImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  ogImageAlt: 'NaxtTo Fine Jewellery Heirloom Collection',
  ogType: 'website',
  ogSiteName: 'NaxtTo Fine Jewellery',
  twitterCard: 'summary_large_image',
  twitterTitle: 'NaxtTo | Minimalist Fine Jewellery & Modern Heirlooms',
  twitterDescription: 'Official NaxtTo online boutique. Discover handcrafted minimalist fine jewellery forged in certified 18k solid gold at naxtto.shop.',
  twitterImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
  twitterSite: '@naxtto',
  twitterCreator: '@naxtto',
  structuredDataEnabled: true,
  structuredDataType: 'JewelryStore',
  businessName: 'NaxtTo Fine Jewellery Atelier',
  businessAddress: 'Kolkata & Milan',
  currencyAccepted: 'INR, USD, EUR, GBP',
  priceRange: '₹₹₹ - Luxury'
};
