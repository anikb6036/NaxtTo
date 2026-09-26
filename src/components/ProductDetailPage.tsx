import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Check, 
  Ruler, 
  Maximize2,
  RefreshCw,
  Gem,
  Share2,
  ChevronRight,
  ChevronLeft,
  X,
  Lock,
  LogIn,
  MapPin,
  Percent,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronDown,
  Info,
  TrendingDown,
  ArrowRight,
  Star,
  Eye
} from 'lucide-react';
import { Product, MetalType, ProductReview, ProductCategory, UserProfile } from '../types';
import { StarRating, OrangeStar } from './StarRating';
import { BrandLogo } from './BrandLogo';
import { RecentlyViewedCarousel } from './RecentlyViewedCarousel';
import { ChatbotRobotIcon } from './ChatbotRobotIcon';

export const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: MetalType, quantity?: number) => boolean | void;
  onBuyNow: (product: Product, selectedSize?: string, selectedFinish?: MetalType) => void;
  isWishlisted: boolean;
  isProductWishlisted?: (productId: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol: string;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onSelectCategory: (category: ProductCategory) => void;
  user?: UserProfile;
  onOpenAccount?: () => void;
  onRequireLogin?: (productName?: string, actionType?: 'bag' | 'wishlist' | 'review') => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  isProductWishlisted,
  onToggleWishlist,
  currencySymbol,
  onAddReview,
  onSelectCategory,
  user,
  onOpenAccount,
  onRequireLogin
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<MetalType>(
    product.availableFinishes?.[0]?.type || product.metal
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes?.[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<'craft' | 'specs' | 'ethical' | 'shipping' | null>('craft');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
  const [activeOfferModal, setActiveOfferModal] = useState<string | null>(null);
  const [showRufusModal, setShowRufusModal] = useState(false);
  const [rufusQuestion, setRufusQuestion] = useState('');
  const [rufusConversation, setRufusConversation] = useState<Array<{ sender: 'user' | 'rufus'; text: string }>>([
    { sender: 'rufus', text: `Hello! I'm Rufus, your NaxtTo assistant. How can I help you with this ${product.name}?` }
  ]);

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showRatingsHelp, setShowRatingsHelp] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? 0) + 1
    }));
  };

  const globalRatingsCount = typeof product.reviewsCount === 'number' && product.reviewsCount > 0 
    ? product.reviewsCount 
    : (product.reviews?.length || 0);

  const effectiveRating = typeof product.rating === 'number' && !isNaN(product.rating) && product.rating > 0 
    ? product.rating 
    : 4.3;

  // Rating percentage breakdown computation (5 down to 1)
  const ratingBreakdown = useMemo(() => {
    const reviews = product.reviews || [];
    if (reviews.length > 0) {
      const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(r => {
        const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
        counts[star] = (counts[star] || 0) + 1;
      });
      const total = reviews.length;
      return {
        5: Math.round((counts[5] / total) * 100),
        4: Math.round((counts[4] / total) * 100),
        3: Math.round((counts[3] / total) * 100),
        2: Math.round((counts[2] / total) * 100),
        1: Math.round((counts[1] / total) * 100),
      };
    }

    // Default distribution matching the reference image (4.3 out of 5 -> 84% 5-star, 16% 1-star)
    if (Math.abs(effectiveRating - 4.3) < 0.15) {
      return { 5: 84, 4: 0, 3: 0, 2: 0, 1: 16 };
    }
    if (effectiveRating >= 4.7) {
      return { 5: 88, 4: 9, 3: 3, 2: 0, 1: 0 };
    }
    if (effectiveRating >= 4.4) {
      return { 5: 78, 4: 16, 3: 4, 2: 2, 1: 0 };
    }
    if (effectiveRating >= 4.0) {
      return { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
    }
    return { 5: 50, 4: 25, 3: 15, 2: 5, 1: 5 };
  }, [product.reviews, effectiveRating]);

  // Filtered reviews based on selected rating filter
  const filteredReviews = useMemo(() => {
    const list = product.reviews || [];
    if (selectedRatingFilter === null) return list;
    return list.filter(r => Math.round(r.rating) === selectedRatingFilter);
  }, [product.reviews, selectedRatingFilter]);

  // Auto-fill author name from logged in user
  useEffect(() => {
    if (user?.isLoggedIn && user.name) {
      setNewReviewAuthor(user.name);
    }
  }, [user]);

  const handleOpenWriteReview = () => {
    if (!user?.isLoggedIn) {
      if (onRequireLogin) {
        onRequireLogin(product.name, 'review');
      } else if (onOpenAccount) {
        onOpenAccount();
      } else {
        setShowReviewForm(true);
      }
      return;
    }
    if (user.name && !newReviewAuthor) {
      setNewReviewAuthor(user.name);
    }
    setShowReviewForm(true);
  };

  // Gallery Swipe State & Gesture Handlers
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const currentDragOffsetRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const isPointerDownRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const hasPointerDraggedRef = useRef(false);

  const imagesCount = product.images?.length || 0;

  const scrollToImage = (index: number) => {
    if (index < 0 || index >= imagesCount) return;
    setActiveImageIndex(index);
    setDragOffset(0);
    currentDragOffsetRef.current = 0;
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imagesCount <= 1) return;
    setActiveImageIndex(prev => (prev < imagesCount - 1 ? prev + 1 : 0));
    setDragOffset(0);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imagesCount <= 1) return;
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : imagesCount - 1));
    setDragOffset(0);
  };

  // Touch Handlers for Mobile & Tablet Swiping
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (imagesCount <= 1) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    currentDragOffsetRef.current = 0;
    isHorizontalSwipeRef.current = null;
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping || isHorizontalSwipeRef.current === false) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartXRef.current;
    const diffY = touch.clientY - touchStartYRef.current;

    // Detect gesture direction on first significant movement
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(diffX) > 7 || Math.abs(diffY) > 7) {
        if (Math.abs(diffX) >= Math.abs(diffY)) {
          isHorizontalSwipeRef.current = true;
        } else {
          isHorizontalSwipeRef.current = false;
          setIsSwiping(false);
          setDragOffset(0);
          return;
        }
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Elastic resistance at boundary edges
      let resistance = 1;
      if ((activeImageIndex === 0 && diffX > 0) || (activeImageIndex === imagesCount - 1 && diffX < 0)) {
        resistance = 0.3;
      }
      const adjustedOffset = diffX * resistance;
      currentDragOffsetRef.current = adjustedOffset;
      setDragOffset(adjustedOffset);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    const offset = currentDragOffsetRef.current;
    const threshold = 40;

    if (offset < -threshold) {
      // Swiped Left -> Next Image
      if (activeImageIndex < imagesCount - 1) {
        setActiveImageIndex(prev => prev + 1);
      } else {
        setActiveImageIndex(0);
      }
    } else if (offset > threshold) {
      // Swiped Right -> Previous Image
      if (activeImageIndex > 0) {
        setActiveImageIndex(prev => prev - 1);
      } else {
        setActiveImageIndex(imagesCount - 1);
      }
    }
    setDragOffset(0);
    currentDragOffsetRef.current = 0;
    isHorizontalSwipeRef.current = null;
  };

  // Pointer / Mouse Drag Handlers for Desktop Swiping
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || imagesCount <= 1) return;
    if ((e.target as HTMLElement).closest('button, a')) return;

    isPointerDownRef.current = true;
    hasPointerDraggedRef.current = false;
    pointerStartXRef.current = e.clientX;
    currentDragOffsetRef.current = 0;
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const diffX = e.clientX - pointerStartXRef.current;
    if (Math.abs(diffX) > 6) {
      hasPointerDraggedRef.current = true;
      let resistance = 1;
      if ((activeImageIndex === 0 && diffX > 0) || (activeImageIndex === imagesCount - 1 && diffX < 0)) {
        resistance = 0.3;
      }
      const adjustedOffset = diffX * resistance;
      currentDragOffsetRef.current = adjustedOffset;
      setDragOffset(adjustedOffset);
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsSwiping(false);
    const offset = currentDragOffsetRef.current;
    const threshold = 40;

    if (hasPointerDraggedRef.current) {
      if (offset < -threshold) {
        if (activeImageIndex < imagesCount - 1) {
          setActiveImageIndex(prev => prev + 1);
        } else {
          setActiveImageIndex(0);
        }
      } else if (offset > threshold) {
        if (activeImageIndex > 0) {
          setActiveImageIndex(prev => prev - 1);
        } else {
          setActiveImageIndex(imagesCount - 1);
        }
      }
    }
    setDragOffset(0);
    currentDragOffsetRef.current = 0;
  };

  const handlePointerCancel = () => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      setIsSwiping(false);
      setDragOffset(0);
      currentDragOffsetRef.current = 0;
    }
  };

  // Auto-scroll active thumbnail into view when image changes
  useEffect(() => {
    const activeThumb = document.getElementById(`thumb-img-${activeImageIndex}`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeImageIndex]);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setDragOffset(0);
    setSelectedFinish(product.availableFinishes?.[0]?.type || product.metal);
    setSelectedSize(product.availableSizes?.[0] || 'Standard');
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product.id]);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    onAddReview(product.id, {
      author: newReviewAuthor,
      location: newReviewLocation || 'Verified Patron',
      rating: newReviewRating,
      title: newReviewTitle || 'Exquisite Heirloom',
      comment: newReviewComment,
      verified: true,
      itemPurchased: `${product.name} - ${selectedSize}`
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setNewReviewAuthor('');
      setNewReviewLocation('');
      setNewReviewComment('');
      setNewReviewTitle('');
    }, 1800);
  };

  const handleAddToCartClick = () => {
    const result = onAddToCart(product, selectedSize, selectedFinish, quantity);
    if (result !== false) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  // Pre-filled WhatsApp Social Sharing Link with current product's name and canonical URL
  const productShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.id}`
    : `https://naxtto.shop/product/${product.id}`;

  const whatsappShareText = `Check out *${product.name}* on NaxtTo Fine Jewellery:\n${productShareUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;

  const handleShare = (e?: React.MouseEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productShareUrl).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    // Open pre-filled WhatsApp share link directly
    window.open(whatsappShareUrl, '_blank', 'noopener,noreferrer');
  };

  // Delivery date calculation (matching Amazon e.g. "Thursday, 17 September")
  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    return `${weekday}, ${day} ${month}`;
  };

  const formatSizeLabel = (s: string) => {
    if (s === '24' || s === '2.4') return '2.4 Inches (standard)';
    if (s === '26' || s === '2.6') return '2.6 Inches';
    if (s === '28' || s === '2.8') return '2.8 Inches';
    if (s === '22' || s === '2.2') return '2.2 Inches (petite)';
    if (s === '210' || s === '2.10') return '2.10 Inches';
    return s.includes('Inch') ? s : `${s} Inches`;
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 67;
  const originalMrp = product.originalPrice || Math.round(product.price * 3.03);

  const userName = user?.name ? user.name.split(' ')[0] : 'Anik';
  const userCity = user?.savedAddresses?.[0]?.city || 'Takurnagar';
  const userZip = user?.savedAddresses?.[0]?.postalCode || '743287';

  const handleSendRufusQuestion = (qText?: string) => {
    const query = qText || rufusQuestion;
    if (!query.trim()) return;

    const newMsgs = [...rufusConversation, { sender: 'user' as const, text: query }];
    setRufusConversation(newMsgs);
    setRufusQuestion('');

    setTimeout(() => {
      let reply = `This ${product.name} is handcrafted in genuine ${product.karatPurity || '22K/18K Gold'} with hallmarked authenticity. The current standard size is ${formatSizeLabel(selectedSize)}.`;
      const lower = query.toLowerCase();
      if (lower.includes('size') || lower.includes('fit') || lower.includes('measure')) {
        reply = `For Bengali Shakha and Pola bangles, standard 2.4 inches corresponds to 57mm inner diameter. If you wear 2.6 inches, it is 60mm. We provide 10-day free size exchanges!`;
      } else if (lower.includes('gold') || lower.includes('karat') || lower.includes('purity') || lower.includes('real')) {
        reply = `Yes, all NaxtTo precious jewellery features 100% certified hallmarked bullion stamped with standard BIS purity hallmarks (stamped 750 or 916).`;
      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('delivery')) {
        reply = `We provide Free Insured Express Courier delivery arriving by ${getDeliveryDate()}, along with a 10-day hassle-free Return & Exchange guarantee.`;
      }
      setRufusConversation(prev => [...prev, { sender: 'rufus' as const, text: reply }]);
    }, 600);
  };

  // Recommendation state & logic for "You Might Also Like" section
  const [recommendationFilter, setRecommendationFilter] = useState<'all' | 'category' | 'complementary'>('all');
  const [hoveredRelatedId, setHoveredRelatedId] = useState<string | null>(null);
  const [addedRelatedId, setAddedRelatedId] = useState<string | null>(null);

  // Friendly display label for product categories
  const getCategoryLabel = (cat: ProductCategory): string => {
    switch (cat) {
      case 'shakha':
        return 'Conch Shell Shakha';
      case 'pola':
        return 'Coral Pola';
      case 'gold-badhano':
        return '22K Gold Badhano';
      case 'loha-badhano':
        return 'Sacred Loha Badhano';
      case 'bridal-combos':
        return 'Bridal Combos';
      default:
        return typeof cat === 'string' ? cat.replace(/-/g, ' ') : 'Fine Jewellery';
    }
  };

  // 1. Primary: Products strictly from the current product's category (excluding current item)
  const sameCategoryProducts = allProducts.filter(
    p => p.id !== product.id && p.category === product.category
  );

  // 2. Secondary: Complementary pieces matching metal purity or traditional Bengali bridal pairings
  const complementaryProducts = allProducts.filter(
    p => p.id !== product.id && p.category !== product.category && (
      p.metal === product.metal ||
      (product.category === 'shakha' && p.category === 'pola') ||
      (product.category === 'pola' && p.category === 'shakha') ||
      (product.category === 'bridal-combos' && (p.category === 'shakha' || p.category === 'pola' || p.category === 'gold-badhano')) ||
      (product.category === 'gold-badhano' && (p.category === 'shakha' || p.category === 'pola')) ||
      p.isBestSeller
    )
  );

  // 3. Combined suggestions: same category items prioritized first
  const allSuggestedProducts = [...sameCategoryProducts, ...complementaryProducts];

  // 4. Current active suggestions based on selected filter tab
  const displayedRelatedProducts = recommendationFilter === 'category'
    ? sameCategoryProducts
    : recommendationFilter === 'complementary'
    ? complementaryProducts
    : (sameCategoryProducts.length > 0 ? allSuggestedProducts : allProducts.filter(p => p.id !== product.id)).slice(0, 8);

  // Reset filter when selected product changes
  useEffect(() => {
    setRecommendationFilter('all');
  }, [product.id]);

  // Handler for adding a suggested product to bag with immediate feedback
  const handleQuickAddRelated = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    const result = onAddToCart(item, item.availableSizes?.[0] || 'Standard', item.metal);
    if (result !== false) {
      setAddedRelatedId(item.id);
      setTimeout(() => setAddedRelatedId(null), 1500);
    }
  };

  // Handler for toggling wishlist for a suggested product
  const handleToggleRelatedWishlist = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    onToggleWishlist(item);
  };

  return (
    <div id="product-detail-page" className="w-full bg-white text-[#1d1d1f] min-h-screen font-sans">
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="border-b border-[#e5e5ea] bg-white sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm text-[#6e6e73]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <button 
              onClick={() => { onSelectCategory('all'); onBack(); }}
              className="hover:text-[#1d1d1f] hidden sm:inline cursor-pointer"
            >
              Shop
            </button>
            <span className="text-[#d2d2d7] hidden sm:inline">/</span>
            <button 
              onClick={() => { onSelectCategory(product.category); onBack(); }}
              className="capitalize hover:text-[#1d1d1f] font-medium text-[#1d1d1f] cursor-pointer"
            >
              {product.category}
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#86868b] truncate max-w-[150px] sm:max-w-[250px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="top-breadcrumb-share-whatsapp-btn"
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(productShareUrl).catch(() => {});
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }
              }}
              className="p-2 rounded-full hover:bg-[#25D366]/10 text-[#6e6e73] hover:text-[#075e54] transition-all text-sm flex items-center gap-1.5 cursor-pointer"
              title="Share piece on WhatsApp"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium hidden sm:inline">Shared</span>
                </>
              ) : (
                <>
                  <WhatsAppLogo className="w-4 h-4 text-[#25D366]" />
                  <span className="text-xs font-medium hidden sm:inline text-[#1d1d1f]">Share</span>
                </>
              )}
            </a>

            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-sm font-medium cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'hover:bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          
          {/* Left Column: Image Gallery with Vertical Thumbnails (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sticky top-24">
              {/* Vertical Thumbnails Stack (Desktop & Tablet) */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[500px] scrollbar-none py-1 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-img-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-md overflow-hidden border transition-all shrink-0 bg-white cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-2 border-[#007185] shadow-xs'
                        : 'border-[#d5d9d9] hover:border-[#007185] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>

              {/* Main Image Display Box with Real-time Touch Swiping & Mouse Dragging */}
              <div 
                id="product-image-swipe-box"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') handlePrevImage();
                  if (e.key === 'ArrowRight') handleNextImage();
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className="relative flex-1 aspect-square bg-white rounded-lg border border-[#e7e7e7] overflow-hidden flex items-center justify-center select-none group touch-pan-y cursor-grab active:cursor-grabbing focus:outline-none focus:ring-1 focus:ring-[#007185]/40"
              >
                {/* Sliding Strip Track containing all product images */}
                <div 
                  className={`w-full h-full flex items-center ${
                    isSwiping ? 'transition-none' : 'transition-transform duration-300 ease-out'
                  }`}
                  style={{
                    transform: `translateX(calc(-${activeImageIndex * 100}% + ${dragOffset}px))`,
                  }}
                >
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="w-full h-full shrink-0 flex items-center justify-center p-4 relative"
                    >
                      <img
                        src={img}
                        alt={`${product.name} - view ${idx + 1}`}
                        draggable={false}
                        className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>

                {/* Left & Right Chevron Arrows for quick switching */}
                {imagesCount > 1 && (
                  <>
                    <button
                      type="button"
                      id="gallery-swipe-prev-btn"
                      onClick={handlePrevImage}
                      aria-label="Previous product image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#d5d9d9] shadow-md flex items-center justify-center text-[#0F1111] hover:text-[#007185] opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5 -ml-0.5" />
                    </button>
                    <button
                      type="button"
                      id="gallery-swipe-next-btn"
                      onClick={handleNextImage}
                      aria-label="Next product image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#d5d9d9] shadow-md flex items-center justify-center text-[#0F1111] hover:text-[#007185] opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5 -mr-0.5" />
                    </button>
                  </>
                )}

                {/* Swipe Pagination Dots on Mobile / Tablet */}
                {imagesCount > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-xs z-10 pointer-events-none sm:hidden">
                    {product.images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeImageIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Floating Top-Left "Swipe" Indicator badge / counter */}
                {imagesCount > 1 && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200 text-[10px] font-medium text-gray-600 shadow-2xs z-10 flex items-center gap-1 pointer-events-none">
                    <span>{activeImageIndex + 1} / {imagesCount}</span>
                  </div>
                )}

                {/* Floating Top-Right Buttons: Share & Wishlist */}
                <div 
                  className="absolute top-3 right-3 flex flex-col gap-2 z-10"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <a
                    id="floating-image-share-whatsapp-btn"
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(productShareUrl).catch(() => {});
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center justify-center text-[#25D366] hover:scale-105 transition-all cursor-pointer"
                    title={`Share ${product.name} on WhatsApp`}
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <WhatsAppLogo className="w-4 h-4 text-[#25D366]" />}
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center justify-center transition-all cursor-pointer ${
                      isWishlisted ? 'text-rose-600' : 'text-[#565959] hover:text-[#0F1111]'
                    }`}
                    title={isWishlisted ? 'Saved in Wish List' : 'Add to Wish List'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Floating Zoom Button (Bottom Right) */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLightbox(true);
                  }}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center justify-center text-[#565959] hover:text-[#0F1111] transition-all text-xs cursor-pointer z-10"
                  title="Zoom Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Floating "Ask Rufus" AI Pill (Bottom Left) */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRufusModal(true);
                  }}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center gap-1.5 text-xs text-[#0F1111] font-medium transition-all hover:border-[#007185] cursor-pointer z-10"
                >
                  <ChatbotRobotIcon className="w-4 h-4 shrink-0" />
                  <span>Ask Rufus</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Center Column: Product Details, Offers, Guarantees, Sizes (lg:col-span-4 xl:col-span-4) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 text-[#0F1111]">
            {/* Brand Store Link */}
            <div>
              <button 
                onClick={() => { onSelectCategory('all'); onBack(); }}
                className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline transition-colors font-medium text-left cursor-pointer"
              >
                Brand: NaxtTO
              </button>
              <h1 className="text-xl sm:text-2xl font-medium text-[#0F1111] leading-snug mt-0.5">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#565959] mt-0.5">
                {product.subtitle || 'Original Sakha'}
              </p>
            </div>

            {/* Ratings & Search This Page Link */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <a href="#reviews-section" className="flex items-center gap-1 hover:text-[#C7511F] transition-colors">
                <span className="font-semibold text-[#0F1111]">{product.rating.toFixed(1)}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <OrangeStar 
                      key={i} 
                      sizeClass="w-3.5 h-3.5" 
                      color={i < Math.round(product.rating) ? '#FFA41C' : '#e7e7e7'} 
                    />
                  ))}
                </div>
                <span className="text-[#007185] hover:underline ml-1">
                  {product.reviewsCount} ratings
                </span>
              </a>
              <span className="text-[#d5d9d9]">|</span>
              <button 
                onClick={() => setShowRufusModal(true)}
                className="text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3 h-3" />
                <span>Search this page</span>
              </button>
            </div>

            {/* Thin Divider */}
            <div className="border-b border-[#e7e7e7]" />

            {/* Price Block (Image 2 style) */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-light text-[#CC0C39]">
                  -{discountPercent}%
                </span>
                <div className="flex items-start text-[#0F1111]">
                  <span className="text-sm font-normal mt-0.5">₹</span>
                  <span className="text-2xl sm:text-3xl font-semibold leading-none">{product.price}</span>
                  <span className="text-xs font-normal mt-0.5">00</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceHistoryModal(true)}
                  className="ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-normal text-[#007185] bg-[#eef6ff] border border-[#c8e1fe] hover:bg-[#d8ecff] transition-colors cursor-pointer"
                >
                  <TrendingDown className="w-3 h-3" />
                  <span>Price history</span>
                </button>
              </div>

              <div className="text-xs text-[#565959] flex items-center gap-1.5">
                <span>M.R.P.:</span>
                <span className="line-through">₹{originalMrp.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-[#0F1111]">Inclusive of all taxes</p>
            </div>

            {/* Offers Box (matching Image 2) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#0F1111]">
                <div className="w-4 h-4 rounded-full bg-[#0F1111] text-white flex items-center justify-center text-[9px] font-bold">
                  %
                </div>
                <span>Offers</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {/* Offer 1: Cashback */}
                <div 
                  onClick={() => setActiveOfferModal('Cashback')}
                  className="w-44 shrink-0 p-3 rounded-lg border border-[#d5d9d9] bg-white hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#0F1111]">Cashback</p>
                    <p className="text-[11px] text-[#565959] line-clamp-2 leading-tight">
                      Upto ₹29.00 cashback as Amazon Pay / NaxtTo Balance when...
                    </p>
                  </div>
                  <p className="text-xs text-[#007185] font-normal hover:underline mt-2">
                    5 offers &gt;
                  </p>
                </div>

                {/* Offer 2: Bank Offer */}
                <div 
                  onClick={() => setActiveOfferModal('Bank Offer')}
                  className="w-44 shrink-0 p-3 rounded-lg border border-[#d5d9d9] bg-white hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#0F1111]">Bank Offer</p>
                    <p className="text-[11px] text-[#565959] line-clamp-2 leading-tight">
                      Upto ₹2,500.00 discount on select Credit Cards, HDFC, SBI...
                    </p>
                  </div>
                  <p className="text-xs text-[#007185] font-normal hover:underline mt-2">
                    25 offers &gt;
                  </p>
                </div>

                {/* Offer 3: Partner Offers */}
                <div 
                  onClick={() => setActiveOfferModal('Partner Offers')}
                  className="w-44 shrink-0 p-3 rounded-lg border border-[#d5d9d9] bg-white hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#0F1111]">Partner Offers</p>
                    <p className="text-[11px] text-[#565959] line-clamp-2 leading-tight">
                      Get GST invoice and save up to 28% on business purchases
                    </p>
                  </div>
                  <p className="text-xs text-[#007185] font-normal hover:underline mt-2">
                    1 offer &gt;
                  </p>
                </div>
              </div>
            </div>

            {/* Service Icons Row (4 Guarantees matching Image 2) */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs text-[#007185]">
              <div 
                onClick={() => setActiveOfferModal('Free Delivery')}
                className="flex flex-col items-center gap-1 p-1 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f7fafa] border border-[#d5d9d9] flex items-center justify-center text-[#0F1111] group-hover:bg-[#eef6ff]">
                  <Truck className="w-4 h-4 text-[#007185]" />
                </div>
                <span className="text-[11px] leading-tight hover:underline">Free Delivery</span>
              </div>

              <div 
                onClick={() => setActiveOfferModal('10 days Return & Exchange')}
                className="flex flex-col items-center gap-1 p-1 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f7fafa] border border-[#d5d9d9] flex items-center justify-center text-[#0F1111] group-hover:bg-[#eef6ff]">
                  <RotateCcw className="w-4 h-4 text-[#007185]" />
                </div>
                <span className="text-[11px] leading-tight hover:underline">10 days Return & Exchange</span>
              </div>

              <div 
                onClick={() => setActiveOfferModal('NaxtTo Delivered')}
                className="flex flex-col items-center gap-1 p-1 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f7fafa] border border-[#d5d9d9] flex items-center justify-center text-[#0F1111] group-hover:bg-[#eef6ff]">
                  <ShieldCheck className="w-4 h-4 text-[#007185]" />
                </div>
                <span className="text-[11px] leading-tight hover:underline">NaxtTo Delivered</span>
              </div>

              <div 
                onClick={() => setActiveOfferModal('Secure transaction')}
                className="flex flex-col items-center gap-1 p-1 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f7fafa] border border-[#d5d9d9] flex items-center justify-center text-[#0F1111] group-hover:bg-[#eef6ff]">
                  <Lock className="w-4 h-4 text-[#007185]" />
                </div>
                <span className="text-[11px] leading-tight hover:underline">Secure transaction</span>
              </div>
            </div>

            {/* Thin Divider */}
            <div className="border-b border-[#e7e7e7]" />

            {/* Size Selector (Image 2 style) */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-sm">
                    <span className="text-[#565959]">Size: </span>
                    <span className="font-bold text-[#0F1111]">{formatSizeLabel(selectedSize)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}</span>
                  </button>
                </div>

                {/* Sizing Option Cards matching Image 2 */}
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map(size => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        id={`pdp-size-${size}`}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#007185] bg-[#eef6ff]/40 ring-1 ring-[#007185]'
                            : 'border-[#d5d9d9] bg-white hover:border-[#0F1111]'
                        }`}
                      >
                        <p className={`text-xs ${isSelected ? 'font-bold text-[#0F1111]' : 'font-medium text-[#0F1111]'}`}>
                          {formatSizeLabel(size)}
                        </p>
                        <p className="text-[11px] text-[#565959] mt-0.5">
                          ₹{product.price}.00
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Collapsible Size Guide Drawer */}
                {showSizeGuide && (
                  <div className="p-3.5 bg-[#f7fafa] rounded-lg border border-[#d5d9d9] text-xs space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center font-bold text-[#0F1111]">
                      <span>Indian Bangle Sizing Chart</span>
                      <span className="text-[#565959] font-normal text-xs">Inner Diameter</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-xs text-[#0F1111]">
                      <div className="p-1.5 bg-white rounded border border-[#d5d9d9]"><strong>2.2</strong><br/><span className="text-[10px] text-[#565959]">54 mm</span></div>
                      <div className="p-1.5 bg-white rounded border border-[#d5d9d9]"><strong>2.4</strong><br/><span className="text-[10px] text-[#565959]">57 mm</span></div>
                      <div className="p-1.5 bg-white rounded border border-[#d5d9d9]"><strong>2.6</strong><br/><span className="text-[10px] text-[#565959]">60 mm</span></div>
                      <div className="p-1.5 bg-white rounded border border-[#d5d9d9]"><strong>2.8</strong><br/><span className="text-[10px] text-[#565959]">63 mm</span></div>
                      <div className="p-1.5 bg-white rounded border border-[#d5d9d9]"><strong>2.10</strong><br/><span className="text-[10px] text-[#565959]">66 mm</span></div>
                    </div>
                    <p className="text-[11px] text-[#565959]">
                      100% Free size exchange within 10 days if your bangles do not fit comfortably over knuckles.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Precious Metal Finishes (if exists) */}
            {product.availableFinishes && product.availableFinishes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs">
                  <span className="text-[#565959]">Metal Finish: </span>
                  <span className="font-bold text-[#0F1111]">
                    {product.availableFinishes.find(f => f.type === selectedFinish)?.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableFinishes.map(f => (
                    <button
                      key={f.type}
                      id={`pdp-finish-${f.type}`}
                      onClick={() => setSelectedFinish(f.type)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs cursor-pointer transition-all ${
                        selectedFinish === f.type
                          ? 'border-[#007185] bg-[#eef6ff]/40 ring-1 ring-[#007185] font-semibold text-[#0F1111]'
                          : 'border-[#d5d9d9] bg-white text-[#0F1111] hover:border-[#0F1111]'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0" 
                        style={{ backgroundColor: f.colorHex }}
                      />
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Details Table */}
            <div className="pt-2 text-xs text-[#0F1111] space-y-2 border-t border-[#e7e7e7]">
              <p className="font-bold text-sm">Product Specifications</p>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                <span className="text-[#565959]">Material</span>
                <span className="font-medium text-[#0F1111]">{product.metal || 'Solid 18K/22K Gold'}</span>
                <span className="text-[#565959]">Purity</span>
                <span className="font-medium text-[#0F1111]">{product.karatPurity || '750 Hallmarked'}</span>
                <span className="text-[#565959]">Net Weight</span>
                <span className="font-medium text-[#0F1111]">{product.weightGrams} grams</span>
                <span className="text-[#565959]">Origin</span>
                <span className="font-medium text-[#0F1111]">{product.origin || 'Bengal Handcrafted'}</span>
              </div>
            </div>

            {/* Accordions: Craftsmanship, Dimensions, Ethical, Shipping */}
            <div className="divide-y divide-[#e7e7e7] border-t border-b border-[#e7e7e7] pt-1">
              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'craft' ? null : 'craft')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#0F1111] hover:text-[#007185] transition-colors cursor-pointer"
                >
                  <span>Craftsmanship & Materials</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-[#565959] transition-transform ${activeAccordion === 'craft' ? 'rotate-90 text-[#007185]' : ''}`} />
                </button>
                {activeAccordion === 'craft' && (
                  <div className="mt-2 text-xs text-[#565959] space-y-1.5 leading-relaxed animate-fadeIn">
                    <p>
                      Meticulously crafted using 100% certified authentic gold and traditional artisan hand-carving. Every curve and bezel is mirror-polished by master artisans to provide smooth, comfortable daily wear.
                    </p>
                  </div>
                )}
              </div>

              <div className="py-2.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#0F1111] hover:text-[#007185] transition-colors cursor-pointer"
                >
                  <span>Shipping & Returns</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-[#565959] transition-transform ${activeAccordion === 'shipping' ? 'rotate-90 text-[#007185]' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="mt-2 text-xs text-[#565959] space-y-1.5 leading-relaxed animate-fadeIn">
                    <p>
                      Dispatched via insured armored courier. Includes 10 days of risk-free return & exchange with complimentary pickup.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Amazon Buy Box Card (lg:col-span-3 xl:col-span-3) */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="border border-[#d5d9d9] rounded-lg p-4 bg-white shadow-xs space-y-3.5 sticky top-24">
              
              {/* Buy Box Price */}
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-[#0F1111]">
                  ₹{product.price}.00
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceHistoryModal(true)}
                  className="text-[11px] text-[#007185] hover:underline cursor-pointer"
                >
                  Price history
                </button>
              </div>

              {/* Delivery info (matching Image 2) */}
              <div className="text-xs text-[#0F1111] space-y-1 leading-snug">
                <p>
                  <span className="text-[#007185] font-semibold">FREE delivery </span>
                  <strong>{getDeliveryDate()}</strong>.
                  <button onClick={() => setActiveOfferModal('Delivery')} className="text-[#007185] hover:underline ml-1 cursor-pointer">Details</button>
                </p>
              </div>

              {/* Deliver to Location (matching Image 2) */}
              <div className="flex items-start gap-1.5 text-xs text-[#007185] pt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#007185]" />
                <span className="leading-tight hover:underline cursor-pointer">
                  Deliver to {userName} - {userCity} {userZip}
                </span>
              </div>

              {/* Stock Status (matching Image 2) */}
              <div className="text-lg font-medium text-[#007600]">
                In stock
              </div>

              {/* Quantity Dropdown (matching Image 2) */}
              <div className="pt-1">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full sm:w-auto bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] rounded-lg px-3 py-1.5 text-xs text-[#0F1111] shadow-xs cursor-pointer focus:ring-1 focus:ring-[#007185] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>Quantity: {n}</option>
                  ))}
                </select>
              </div>

              {/* CTA Action Buttons (matching Image 2) */}
              <div className="space-y-2.5 pt-1">
                {/* Add to Cart button (Amazon Yellow) */}
                <button
                  id="pdp-add-to-cart-btn"
                  type="button"
                  onClick={handleAddToCartClick}
                  className={`w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-normal text-[#0F1111] shadow-xs border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    addedAnimation
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border-[#FCD200]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span className="font-semibold text-white">Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to cart</span>
                  )}
                </button>

                {/* Buy Now button (Amazon Orange) */}
                <button
                  id="pdp-buy-now-btn"
                  type="button"
                  onClick={() => onBuyNow(product, selectedSize, selectedFinish)}
                  className="w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-normal text-[#0F1111] bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07b00] border border-[#FF8F00] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Security & Seller Breakdown Table (matching Image 2) */}
              <div className="pt-2 border-t border-[#e7e7e7] space-y-1.5 text-xs">
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className="text-[#565959]">Delivered by</span>
                  <span className="text-[#0F1111] font-medium">NaxtTo Courier</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className="text-[#565959]">Sold by</span>
                  <span className="text-[#007185] hover:underline cursor-pointer">NaxtTO Atelier</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className="text-[#565959]">Payment</span>
                  <span className="text-[#007185] hover:underline cursor-pointer">Secure transaction</span>
                </div>
              </div>

              {/* Add to Wishlist Dropdown Button (matching Image 2) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="w-full py-2 px-3 bg-[#f0f2f2] hover:bg-[#e3e6e6] text-[#0F1111] text-xs font-normal rounded-md border border-[#d5d9d9] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate">
                    {isWishlisted ? 'Saved in Wish List' : 'Add to Wish List'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#565959] shrink-0" />
                </button>
              </div>

              {/* Share on WhatsApp Button */}
              <div className="pt-2">
                <a
                  id="pdp-share-whatsapp-btn"
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(productShareUrl).catch(() => {});
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/15 active:bg-[#25D366]/20 text-[#075e54] hover:text-[#054c43] text-xs font-medium rounded-md border border-[#25D366]/40 flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer"
                  title="Share this product on WhatsApp"
                >
                  <WhatsAppLogo className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-[#075e54]">
                    {copiedLink ? 'Link Copied & Opening WhatsApp...' : 'Share on WhatsApp'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section (Amazon Reference Design) */}
        <div id="reviews-section" className="mt-16 pt-10 border-t border-[#e5e5ea]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Rating breakdown and "Review this product" */}
            <div className="md:col-span-5 lg:col-span-4 space-y-4">
              {/* Header */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1111]">
                Customer reviews
              </h2>

              {/* Star Rating and Score */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const diff = effectiveRating - (s - 1);
                    const fillPercent = Math.max(0, Math.min(100, Math.round(diff * 100)));
                    return (
                      <OrangeStar
                        key={s}
                        sizeClass="w-5 h-5"
                        fillPercent={fillPercent}
                        color="#ff7a00"
                      />
                    );
                  })}
                </div>
                <span className="text-base sm:text-lg font-bold text-[#0F1111]">
                  {effectiveRating.toFixed(1)} out of 5
                </span>
              </div>

              {/* Global ratings count */}
              <p className="text-sm text-[#565959] -mt-1 pb-1">
                {globalRatingsCount} global ratings
              </p>

              {/* Star breakdown progress bars */}
              <div className="space-y-2.5 pt-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = ratingBreakdown[star as 5 | 4 | 3 | 2 | 1] ?? 0;
                  const isSelected = selectedRatingFilter === star;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setSelectedRatingFilter(isSelected ? null : star)}
                        className={`min-w-[42px] text-left text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'font-bold text-[#C7511F] underline'
                            : 'text-[#007185] hover:text-[#C7511F] hover:underline'
                        }`}
                      >
                        {star} star
                      </button>

                      {/* Progress bar with thin grey border and orange fill */}
                      <button
                        type="button"
                        onClick={() => setSelectedRatingFilter(isSelected ? null : star)}
                        className="flex-1 h-5 rounded-[4px] border border-[#888c8c] bg-white overflow-hidden p-0 relative block cursor-pointer"
                        title={`${star} star: ${pct}%`}
                      >
                        {pct > 0 && (
                          <div
                            className="h-full bg-[#ff7a00] rounded-l-[3px] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRatingFilter(isSelected ? null : star)}
                        className={`min-w-[36px] text-right text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'font-bold text-[#C7511F] underline'
                            : 'text-[#007185] hover:text-[#C7511F] hover:underline'
                        }`}
                      >
                        {pct}%
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* How are ratings calculated? Expandable */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowRatingsHelp(!showRatingsHelp)}
                  className="inline-flex items-center gap-1.5 text-sm text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer group"
                >
                  <span>How are ratings calculated?</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showRatingsHelp ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showRatingsHelp && (
                  <div className="mt-2.5 p-3 rounded-md bg-[#f7fafa] border border-[#d5d9d9] text-xs text-[#565959] leading-relaxed animate-fadeIn">
                    To calculate the overall star rating and percentage breakdown by star, we don’t use a simple average. Instead, our system considers things like how recent a review is and if the reviewer bought the item on our store. It also analyzes reviews to verify trustworthiness.
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="my-6 border-t border-[#e7e7e7]" />

              {/* Review this product */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0F1111]">
                  Review this product
                </h3>
                <p className="text-sm text-[#0F1111] pb-3">
                  Share your thoughts with other customers
                </p>

                <button
                  id="write-review-btn"
                  onClick={handleOpenWriteReview}
                  className="w-full py-2 px-4 rounded-full border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-sm text-[#0F1111] shadow-2xs font-normal text-center cursor-pointer transition-colors active:bg-[#f0f2f2]"
                >
                  Write a product review
                </button>
              </div>
            </div>

            {/* Right Column: Reviews or Empty State */}
            <div className="md:col-span-7 lg:col-span-8 space-y-4">
              {/* Active filter badge if filtering by star */}
              {selectedRatingFilter !== null && (
                <div className="flex items-center justify-between p-3 rounded-md bg-[#f0f2f2] text-sm text-[#0F1111]">
                  <span>Showing <strong>{selectedRatingFilter} star</strong> reviews</span>
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline font-medium cursor-pointer"
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {/* Empty state matching the user's screenshot */}
              {filteredReviews.length === 0 ? (
                <div className="rounded-lg bg-[#f0f2f2] p-3.5 px-4 text-sm text-[#0F1111]">
                  There are 0 customer reviews.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-sm font-semibold text-[#0F1111] border-b border-[#e7e7e7] pb-3">
                    Top customer reviews
                  </div>

                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="space-y-2 border-b border-[#e7e7e7] pb-6">
                      {/* Author */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-[#565959] flex items-center justify-center text-xs font-bold uppercase">
                          {rev.author.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-[#0F1111] font-medium">{rev.author}</span>
                      </div>

                      {/* Stars & Headline */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <OrangeStar
                              key={s}
                              sizeClass="w-3.5 h-3.5"
                              fillPercent={s <= rev.rating ? 100 : 0}
                              color="#ff7a00"
                            />
                          ))}
                        </div>
                        {rev.title && (
                          <span className="text-sm font-bold text-[#0F1111]">
                            {rev.title}
                          </span>
                        )}
                      </div>

                      {/* Date & Location */}
                      <div className="text-xs text-[#565959]">
                        Reviewed in {rev.location || 'India'} on {rev.date}
                      </div>

                      {/* Verified Purchase badge */}
                      {rev.verified && (
                        <div className="text-xs font-bold text-[#c45500]">
                          Verified Purchase
                        </div>
                      )}

                      {/* Review Comment */}
                      <p className="text-sm text-[#0F1111] leading-relaxed pt-1">
                        {rev.comment}
                      </p>

                      {/* Helpful Button */}
                      <div className="flex items-center gap-4 pt-2 text-xs text-[#565959]">
                        <button
                          type="button"
                          onClick={() => handleHelpfulClick(rev.id)}
                          className="px-3.5 py-1 rounded-full border border-[#d5d9d9] bg-white hover:bg-[#f7fafa] text-[#0F1111] shadow-2xs cursor-pointer transition-colors active:bg-[#f0f2f2]"
                        >
                          Helpful
                        </button>
                        <span>
                          {helpfulCounts[rev.id] ?? rev.helpfulCount ?? 0} people found this helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Write a Review Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#e5e5ea] shadow-2xl relative animate-scaleIn">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="absolute top-4 right-4 p-2 text-[#86868b] hover:text-[#1d1d1f]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#0F1111]">Write a product review</h3>
                  <p className="text-xs text-[#565959]">Share your experience with {product.name}</p>
                </div>

                {!user?.isLoggedIn ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#FFAEC0]/40 text-[#E56A85] flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-[#1d1d1f]">Account Login Required</h4>
                      <p className="text-xs text-[#6e6e73] max-w-sm mx-auto">
                        Only authenticated patrons can leave a review. Please sign in to your account to share your feedback.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        if (onRequireLogin) {
                          onRequireLogin(product.name, 'review');
                        } else if (onOpenAccount) {
                          onOpenAccount();
                        }
                      }}
                      className="w-full py-3 px-5 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0F1111] border border-[#fcd200] font-semibold text-xs tracking-wide shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Please Login Your Account</span>
                    </button>
                  </div>
                ) : reviewSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-[#0F1111]">Review Submitted</h4>
                    <p className="text-xs text-[#565959]">Thank you for sharing your feedback.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1.5">Overall rating</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <OrangeStar
                              sizeClass="w-7 h-7"
                              fillPercent={star <= newReviewRating ? 100 : 0}
                              color="#ff7a00"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0F1111] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full bg-white border border-[#d5d9d9] rounded-lg px-3.5 py-2 text-xs text-[#0F1111] focus:outline-none focus:border-[#007185]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F1111] mb-1">City / Region</label>
                        <input
                          type="text"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          placeholder="e.g. Kolkata, West Bengal"
                          className="w-full bg-white border border-[#d5d9d9] rounded-lg px-3.5 py-2 text-xs text-[#0F1111] focus:outline-none focus:border-[#007185]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1">Add a headline</label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="What's most important to know?"
                        className="w-full bg-white border border-[#d5d9d9] rounded-lg px-3.5 py-2 text-xs text-[#0F1111] focus:outline-none focus:border-[#007185]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1">Add a written review</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="What did you like or dislike? How was the finish, fit, and craftsmanship?"
                        className="w-full bg-white border border-[#d5d9d9] rounded-lg p-3 text-xs text-[#0F1111] focus:outline-none focus:border-[#007185]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0F1111] border border-[#fcd200] text-xs font-medium rounded-full transition-all shadow-2xs active:bg-[#f0f2f2] cursor-pointer"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* You Might Also Like Section (Category-Driven Suggestions) */}
        {/* ========================================================= */}
        <section id="you-might-also-like-section" className="mt-16 pt-10 border-t border-[#e5e5ea] space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdf2f4] text-[#ff3e6c] border border-[#fbcfe8]/60">
                  {getCategoryLabel(product.category)}
                </span>
                <span className="text-xs text-[#86868b] font-medium hidden sm:inline">
                  • Curated for You
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight mt-1.5">
                You Might Also Like
              </h2>
              <p className="text-xs sm:text-sm text-[#696e79] mt-0.5 max-w-2xl">
                Explore more handcrafted pieces from our <span className="font-semibold text-[#282c3f]">{getCategoryLabel(product.category)}</span> atelier and complementary heritage designs.
              </p>
            </div>

            {/* Quick Link to View Full Category */}
            <button
              type="button"
              onClick={() => onSelectCategory(product.category)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ff3e6c] hover:text-[#d02551] transition-colors self-start sm:self-end group cursor-pointer pb-1"
            >
              <span>Explore all in {getCategoryLabel(product.category)}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Filter Pills / Tabs */}
          {(sameCategoryProducts.length > 0 && complementaryProducts.length > 0) && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setRecommendationFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  recommendationFilter === 'all'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-[#f5f5f7] text-[#535766] hover:bg-[#eaeaec] hover:text-[#282c3f]'
                }`}
              >
                All Recommendations ({allSuggestedProducts.length})
              </button>

              <button
                type="button"
                onClick={() => setRecommendationFilter('category')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  recommendationFilter === 'category'
                    ? 'bg-[#ff3e6c] text-white shadow-xs'
                    : 'bg-[#f5f5f7] text-[#535766] hover:bg-[#eaeaec] hover:text-[#282c3f]'
                }`}
              >
                In {getCategoryLabel(product.category)} ({sameCategoryProducts.length})
              </button>

              <button
                type="button"
                onClick={() => setRecommendationFilter('complementary')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  recommendationFilter === 'complementary'
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-[#f5f5f7] text-[#535766] hover:bg-[#eaeaec] hover:text-[#282c3f]'
                }`}
              >
                Complementary Pieces ({complementaryProducts.length})
              </button>
            </div>
          )}

          {/* Product Grid */}
          {displayedRelatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {displayedRelatedProducts.map(item => {
                const itemOriginal = item.originalPrice || Math.round(item.price * 1.5);
                const itemDiscount = Math.max(10, Math.round(((itemOriginal - item.price) / itemOriginal) * 100));
                const isItemWishlisted = isProductWishlisted 
                  ? isProductWishlisted(item.id) 
                  : (isWishlisted && item.id === product.id);
                const isItemHovered = hoveredRelatedId === item.id;
                const displayImg = isItemHovered && item.images.length > 1 ? item.images[1] : item.images[0];
                const isAdded = addedRelatedId === item.id;

                return (
                  <div
                    key={item.id}
                    id={`suggested-product-${item.id}`}
                    onClick={() => {
                      onSelectProduct(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onMouseEnter={() => setHoveredRelatedId(item.id)}
                    onMouseLeave={() => setHoveredRelatedId(null)}
                    className="group bg-white rounded-xl border border-[#eaeaec] hover:border-[#d5d9d9] hover:shadow-md transition-all duration-300 p-2.5 sm:p-3 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none"
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/5] sm:aspect-square rounded-lg overflow-hidden bg-[#fafafa] relative w-full">
                      <img
                        src={displayImg}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {item.category === product.category && (
                          <span className="px-2 py-0.5 bg-[#1d1d1f]/85 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider rounded shadow-xs">
                            Same Category
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[#282c3f] text-[9px] font-bold rounded shadow-xs">
                          {item.karatPurity || '22K Gold'}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        id={`wishlist-suggested-${item.id}`}
                        onClick={(e) => handleToggleRelatedWishlist(e, item)}
                        className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full transition-all duration-200 z-10 shadow-xs cursor-pointer ${
                          isItemWishlisted
                            ? 'bg-[#ff3e6c] text-white'
                            : 'bg-white/90 text-[#696e79] hover:text-[#ff3e6c] hover:bg-white'
                        }`}
                        title={isItemWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isItemWishlisted ? 'fill-white' : ''}`} />
                      </button>

                      {/* Rating Pill */}
                      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded shadow-xs flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#282c3f] z-10">
                        <span>{item.rating.toFixed(1)}</span>
                        <Star className="w-3 h-3 text-[#14958f] fill-[#14958f]" />
                        <span className="text-[#94969f] font-normal text-[9px] sm:text-[10px] border-l border-gray-300 pl-1 ml-0.5">
                          {item.reviewsCount}
                        </span>
                      </div>
                    </div>

                    {/* Content / Details */}
                    <div className="mt-2.5 sm:mt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#86868b] font-medium">
                          <span className="truncate">{getCategoryLabel(item.category)}</span>
                          <span className="text-emerald-700 font-semibold">{itemDiscount}% OFF</span>
                        </div>

                        <h3 className="text-xs sm:text-sm font-semibold text-[#1d1d1f] line-clamp-1 mt-0.5 group-hover:text-[#ff3e6c] transition-colors">
                          {item.name}
                        </h3>

                        {/* Price Row */}
                        <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-[#1d1d1f]">
                            {currencySymbol}{item.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] sm:text-xs text-[#86868b] line-through font-normal">
                            {currencySymbol}{itemOriginal.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <button
                        type="button"
                        id={`add-bag-suggested-${item.id}`}
                        onClick={(e) => handleQuickAddRelated(e, item)}
                        className={`mt-2.5 w-full py-2 px-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer ${
                          isAdded
                            ? 'bg-[#03a685] text-white'
                            : 'bg-[#f5f5f7] hover:bg-[#ff3e6c] text-[#282c3f] hover:text-white border border-[#eaeaec] hover:border-[#ff3e6c]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>ADDED</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO BAG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#fbfbfd] border border-[#e5e5ea] text-center space-y-3">
              <p className="text-sm text-[#86868b]">
                No other pieces currently found in the {getCategoryLabel(product.category)} category.
              </p>
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="px-4 py-2 rounded-lg bg-[#1d1d1f] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Browse Complete Atelier Collection
              </button>
            </div>
          )}
        </section>

        {/* Recently Viewed Carousel Section (Tracks last 5 products visited) */}
        <RecentlyViewedCarousel
          currentProductId={product.id}
          allProducts={allProducts}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
          isProductWishlisted={isProductWishlisted}
          onToggleWishlist={onToggleWishlist}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* ========================================================= */}
      {/* Price History Modal */}
      {/* ========================================================= */}
      {showPriceHistoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowPriceHistoryModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#d5d9d9] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e7e7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#eef6ff] flex items-center justify-center text-[#007185]">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1111]">Price History</h3>
                  <p className="text-xs text-[#565959]">{product.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPriceHistoryModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f0f2f2] flex items-center justify-center text-[#565959] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-[#f7fafa] border border-[#d5d9d9]">
                <p className="text-[11px] text-[#565959]">Current</p>
                <p className="text-sm sm:text-base font-bold text-[#007600]">₹{product.price}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#f7fafa] border border-[#d5d9d9]">
                <p className="text-[11px] text-[#565959]">Lowest</p>
                <p className="text-sm sm:text-base font-bold text-[#007185]">₹{Math.max(499, product.price - 200)}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#f7fafa] border border-[#d5d9d9]">
                <p className="text-[11px] text-[#565959]">M.R.P.</p>
                <p className="text-sm sm:text-base font-bold text-[#565959] line-through">₹{originalMrp}</p>
              </div>
            </div>

            {/* Price Trend Chart Simulation */}
            <div className="p-4 rounded-lg bg-[#f7fafa] border border-[#d5d9d9] space-y-2">
              <div className="flex justify-between items-center text-xs text-[#565959]">
                <span>Last 90 Days Trend</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Great Time to Buy
                </span>
              </div>
              
              <div className="h-32 w-full flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { month: 'Jun', price: originalMrp },
                  { month: 'Jul', price: Math.round(originalMrp * 0.85) },
                  { month: 'Aug', price: Math.round(originalMrp * 0.75) },
                  { month: 'Sep', price: product.price },
                ].map((item, idx) => {
                  const maxP = originalMrp;
                  const heightPercent = Math.max(25, Math.round((item.price / maxP) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] text-[#565959]">₹{item.price}</span>
                      <div 
                        className={`w-full rounded-t-md transition-all ${
                          idx === 3 ? 'bg-[#007185]' : 'bg-[#d5d9d9]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] font-medium text-[#0F1111]">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-[#565959] leading-relaxed">
              Price dropped by <strong>{discountPercent}%</strong> from the original launch price. Insured delivery and 10 days risk-free replacement included.
            </p>

            <button
              type="button"
              onClick={() => setShowPriceHistoryModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-semibold text-[#0F1111] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Offers & Policies Detail Modal */}
      {/* ========================================================= */}
      {activeOfferModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveOfferModal(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#d5d9d9] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e7e7]">
              <h3 className="text-base font-bold text-[#0F1111]">{activeOfferModal}</h3>
              <button 
                onClick={() => setActiveOfferModal(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f0f2f2] flex items-center justify-center text-[#565959] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#0F1111] space-y-3 leading-relaxed">
              {activeOfferModal === 'Cashback' && (
                <>
                  <p className="font-semibold text-sm text-[#007600]">Up to ₹29.00 Cashback on Purchase</p>
                  <p>Pay via Amazon Pay UPI, Net Banking, or NaxtTo Wallet to instantly credit ₹29.00 back to your balance upon courier dispatch.</p>
                  <ul className="list-disc pl-4 space-y-1 text-[#565959]">
                    <li>Valid on all orders above ₹400.</li>
                    <li>No coupon code required; applied automatically at checkout.</li>
                  </ul>
                </>
              )}

              {activeOfferModal === 'Bank Offer' && (
                <>
                  <p className="font-semibold text-sm text-[#007185]">Instant Bank Card Discounts</p>
                  <ul className="space-y-2 text-[#565959]">
                    <li className="p-2 rounded bg-[#f7fafa] border border-[#d5d9d9]">
                      <strong className="text-[#0F1111]">HDFC Bank Credit Cards:</strong> 10% Instant Discount up to ₹1,500 on minimum purchase of ₹5,000.
                    </li>
                    <li className="p-2 rounded bg-[#f7fafa] border border-[#d5d9d9]">
                      <strong className="text-[#0F1111]">SBI Card:</strong> 10% Instant Discount up to ₹1,250 on Credit Card EMI transactions.
                    </li>
                    <li className="p-2 rounded bg-[#f7fafa] border border-[#d5d9d9]">
                      <strong className="text-[#0F1111]">ICICI Bank:</strong> 5% unlimited cashback with Amazon Pay ICICI credit card.
                    </li>
                  </ul>
                </>
              )}

              {activeOfferModal === 'Partner Offers' && (
                <>
                  <p className="font-semibold text-sm text-[#0F1111]">Business & Partner Benefits</p>
                  <p>Register with your GSTIN during checkout to save up to 28% through input tax credit invoices.</p>
                </>
              )}

              {activeOfferModal === 'Free Delivery' && (
                <>
                  <p className="font-semibold text-sm text-[#007600]">100% Free Insured Expedited Shipping</p>
                  <p>All jewelry orders are sealed in tamper-evident armored packaging and delivered via courier with OTP verification upon doorstep delivery.</p>
                  <p className="text-[#565959]">Estimated delivery: <strong>{getDeliveryDate()}</strong> to your destination.</p>
                </>
              )}

              {activeOfferModal === '10 days Return & Exchange' && (
                <>
                  <p className="font-semibold text-sm text-[#0F1111]">Hassle-Free 10-Day Return & Size Exchange</p>
                  <p>If the bangle size does not fit comfortably or if you would like a different finish, initiate a replacement in 1 click from your Order History.</p>
                  <p className="text-[#565959]">Our courier partner will pick it up from your doorstep with 0 return fees.</p>
                </>
              )}

              {activeOfferModal === 'NaxtTo Delivered' && (
                <>
                  <p className="font-semibold text-sm text-[#007185]">NaxtTO Fulfillment Guarantee</p>
                  <p>Items shipped directly from certified ateliers with rigorous hallmark testing, tamper-proof security tags, and insured tracking.</p>
                </>
              )}

              {activeOfferModal === 'Secure transaction' && (
                <>
                  <p className="font-semibold text-sm text-[#0F1111]">Bank-Grade Security</p>
                  <p>Your payment information is encrypted end-to-end with 256-bit TLS encryption. We do not store your raw credit card numbers or banking passwords.</p>
                </>
              )}

              {activeOfferModal === 'Delivery' && (
                <>
                  <p className="font-semibold text-sm text-[#007185]">Delivery Details</p>
                  <p>Your order will be dispatched from our master workshop within 24 hours. Transit typically takes 2–3 business days with continuous SMS updates.</p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveOfferModal(null)}
              className="w-full py-2.5 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-semibold text-[#0F1111] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Ask Rufus - AI Shopping Assistant Modal */}
      {/* ========================================================= */}
      {showRufusModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowRufusModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-lg w-full h-[520px] shadow-2xl border border-[#d5d9d9] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rufus Header */}
            <div className="p-3.5 bg-[#f7fafa] border-b border-[#e7e7e7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-2xs overflow-hidden shrink-0">
                  <ChatbotRobotIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1111] flex items-center gap-1.5">
                    <span>Rufus</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-[#eef6ff] text-[#007185] border border-[#c8e1fe]">Beta</span>
                  </h3>
                  <p className="text-[11px] text-[#565959]">AI Assistant for {product.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRufusModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#e7e7e7] flex items-center justify-center text-[#565959] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fafafa]">
              {rufusConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-2'}`}
                >
                  {msg.sender === 'rufus' && (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden mt-0.5 shadow-2xs">
                      <ChatbotRobotIcon className="w-5.5 h-5.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#007185] text-white rounded-tr-none'
                        : 'bg-white text-[#0F1111] border border-[#d5d9d9] shadow-2xs rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts Pills */}
            <div className="p-2 border-t border-[#e7e7e7] bg-white flex gap-1.5 overflow-x-auto scrollbar-none">
              {[
                'Is this suitable for daily wear?',
                'How do I measure my size?',
                'Is the gold hallmarked?',
                'What is the return policy?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendRufusQuestion(q)}
                  className="px-2.5 py-1 rounded-full bg-[#f7fafa] hover:bg-[#eef6ff] text-[11px] text-[#007185] border border-[#d5d9d9] whitespace-nowrap cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendRufusQuestion();
              }}
              className="p-3 border-t border-[#e7e7e7] bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={rufusQuestion}
                onChange={(e) => setRufusQuestion(e.target.value)}
                placeholder="Ask Rufus about fit, materials, care..."
                className="flex-1 bg-[#f7fafa] border border-[#d5d9d9] rounded-full px-4 py-2 text-xs text-[#0F1111] focus:outline-none focus:border-[#007185]"
              />
              <button
                type="submit"
                disabled={!rufusQuestion.trim()}
                className="w-8 h-8 rounded-full bg-[#007185] disabled:bg-gray-300 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none touch-pan-y"
          onClick={() => setShowLightbox(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div 
            className="max-w-full max-h-[90vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              draggable={false}
              className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-none select-none ${
                isSwiping ? 'transition-none' : 'transition-transform duration-300 ease-out'
              }`}
              style={{
                transform: `translateX(${dragOffset}px)`
              }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium z-20">
              <span>{activeImageIndex + 1} / {product.images.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
