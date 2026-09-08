export type ProductCategory = 
  | 'all' 
  | 'rings' 
  | 'necklaces' 
  | 'earrings' 
  | 'bracelets' 
  | 'fine-collections' 
  | 'bespoke';

export type MetalType = 
  | '18k-yellow-gold'
  | '18k-white-gold'
  | '18k-rose-gold'
  | '925-sterling-silver'
  | 'platinum'
  | 'gold-vermeil';

export type JewelleryStyle = 
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
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  availableSizes?: string[];
  availableFinishes?: {
    name: string;
    type: MetalType;
    colorHex: string;
  }[];
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
  category: 'Craft & Atelier' | 'Care Guides' | 'Style & Stacking' | 'Gemology' | 'Sustainability';
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
  status: 'Confirmed' | 'Accepted' | 'Crafting' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
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
