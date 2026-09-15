import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquarePlus,
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
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  Info,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Product, MetalType, ProductReview, ProductCategory, UserProfile } from '../types';
import { StarRating, OrangeStar } from './StarRating';
import { BrandLogo } from './BrandLogo';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: MetalType, quantity?: number) => boolean | void;
  onBuyNow: (product: Product, selectedSize?: string, selectedFinish?: MetalType) => void;
  isWishlisted: boolean;
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

  // Gallery sliding carousel state & refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const scrollToImage = (index: number) => {
    if (index < 0 || index >= product.images.length) return;
    setActiveImageIndex(index);
    if (carouselRef.current) {
      isProgrammaticScrollRef.current = true;
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    }
  };

  const handleCarouselScroll = () => {
    if (isProgrammaticScrollRef.current || !carouselRef.current) return;
    const container = carouselRef.current;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex >= 0 && newIndex < product.images.length && newIndex !== activeImageIndex) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex < product.images.length - 1) {
      scrollToImage(activeImageIndex + 1);
    } else {
      scrollToImage(0);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeImageIndex > 0) {
      scrollToImage(activeImageIndex - 1);
    } else {
      scrollToImage(product.images.length - 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !carouselRef.current) return;
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    scrollStartRef.current = carouselRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !carouselRef.current) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 6) {
      hasDraggedRef.current = true;
      carouselRef.current.scrollLeft = scrollStartRef.current - delta;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    if (hasDraggedRef.current && carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      const targetIndex = Math.round(carouselRef.current.scrollLeft / width);
      scrollToImage(targetIndex);
    }
  };

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedFinish(product.availableFinishes?.[0]?.type || product.metal);
    setSelectedSize(product.availableSizes?.[0] || 'Standard');
    setQuantity(1);
    window.scrollTo(0, 0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [product.id]);

  // Keep carousel aligned on screen resize or device orientation change
  useEffect(() => {
    if (!carouselRef.current) return;
    const observer = new ResizeObserver(() => {
      if (carouselRef.current) {
        const width = carouselRef.current.clientWidth;
        carouselRef.current.scrollTo({
          left: activeImageIndex * width,
          behavior: 'auto'
        });
      }
    });
    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, [activeImageIndex]);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.metal === product.metal))
    .slice(0, 4);

  return (
    <div id="product-detail-page" className="w-full bg-white text-[#1d1d1f] min-h-screen font-sans">
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="border-b border-[#e5e5ea] bg-white sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm text-[#6e6e73]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <BrandLogo layout="horizontal" size="xs" variant="bronze" onClick={onBack} className="cursor-pointer" />
            <span className="text-[#d2d2d7] hidden sm:inline">/</span>
            <button 
              onClick={() => { onSelectCategory('all'); onBack(); }}
              className="hover:text-[#1d1d1f] hidden sm:inline"
            >
              Shop
            </button>
            <span className="text-[#d2d2d7] hidden sm:inline">/</span>
            <button 
              onClick={() => { onSelectCategory(product.category); onBack(); }}
              className="capitalize hover:text-[#1d1d1f] font-medium text-[#1d1d1f]"
            >
              {product.category}
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#86868b] truncate max-w-[150px] sm:max-w-[250px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] transition-all text-sm flex items-center gap-1.5"
              title="Share piece link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-600 font-medium hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-sm font-medium ${
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

              {/* Main Image Display Box */}
              <div className="relative flex-1 aspect-square bg-white rounded-lg border border-[#e7e7e7] overflow-hidden flex items-center justify-center select-none group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Floating Top-Right Buttons: Share & Wishlist */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center justify-center text-[#565959] hover:text-[#0F1111] transition-all cursor-pointer"
                    title="Share this product"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product)}
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
                  onClick={() => setShowLightbox(true)}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center justify-center text-[#565959] hover:text-[#0F1111] transition-all text-xs cursor-pointer"
                  title="Zoom Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Floating "Ask Rufus" AI Pill (Bottom Left, matching professional design in image 2) */}
                <button
                  type="button"
                  onClick={() => setShowRufusModal(true)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-[#d5d9d9] shadow-xs flex items-center gap-1.5 text-xs text-[#0F1111] font-medium transition-all hover:border-[#007185] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#de7921]" />
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
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews-section" className="mt-16 pt-10 border-t border-[#e5e5ea] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6000]">
                <OrangeStar sizeClass="w-3.5 h-3.5" color="#FF6000" />
                <span>Customer Reviews</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mt-1">
                Reviews & Ratings
              </h2>
            </div>

            <button
              id="write-review-btn"
              onClick={handleOpenWriteReview}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/50 text-xs font-semibold transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs active:scale-[0.99]"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Overview Dashboard */}
          <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center md:text-left space-y-1 md:border-r border-[#e5e5ea] md:pr-6">
              <span className="text-4xl sm:text-5xl font-bold text-[#1d1d1f]">
                {product.rating.toFixed(1)}
              </span>
              <div className="flex items-center justify-center md:justify-start my-1.5">
                <StarRating rating={product.rating} count={product.reviewsCount} size="md" countFormat="number" />
              </div>
              <p className="text-xs text-[#6e6e73]">
                Based on {product.reviewsCount} verified purchases
              </p>
            </div>

            <div className="md:col-span-8 space-y-2 text-xs text-[#6e6e73]">
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">5 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-[#e5e5ea] overflow-hidden">
                  <div className="h-full bg-[#FF6000] rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="w-8">92%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">4 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-[#e5e5ea] overflow-hidden">
                  <div className="h-full bg-[#FF6000] rounded-full" style={{ width: '8%' }}></div>
                </div>
                <span className="w-8">8%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right">3 Stars</span>
                <div className="flex-1 h-2 rounded-full bg-[#e5e5ea] overflow-hidden">
                  <div className="h-full bg-[#FF6000] rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="w-8">0%</span>
              </div>
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
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">Write a Review</h3>
                  <p className="text-xs text-[#6e6e73]">Share your experience with {product.name}</p>
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
                      className="w-full py-3 px-5 rounded-xl bg-[#E56A85] hover:bg-[#D45974] text-white font-semibold text-xs tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
                    <h4 className="text-base font-semibold text-[#1d1d1f]">Review Submitted</h4>
                    <p className="text-xs text-[#6e6e73]">Thank you for sharing your feedback.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Your Rating</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <OrangeStar
                              sizeClass="w-6 h-6"
                              fillPercent={star <= newReviewRating ? 100 : 0}
                              color="#FF6000"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">City / Country</label>
                        <input
                          type="text"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          placeholder="e.g. London, UK"
                          className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="e.g. Excellent quality and weight"
                        className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe the feel, finish, packaging, and everyday wear..."
                        className="w-full bg-transparent border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-[0.99]"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* List of Reviews */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-2.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1d1d1f]">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          <Check className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                      <span className="text-xs text-[#86868b]">• {rev.location}</span>
                    </div>

                    <div>
                      <StarRating rating={rev.rating} size="xs" showCount={false} />
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="text-sm font-semibold text-[#1d1d1f]">{rev.title}</h4>
                  )}

                  <p className="text-xs sm:text-sm text-[#48484a] leading-relaxed font-normal">{rev.comment}</p>

                  <div className="flex items-center justify-between text-xs text-[#86868b] pt-1">
                    <span>Purchased: {rev.itemPurchased || product.name}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#86868b]">No reviews yet for this design.</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#e5e5ea] space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs font-semibold text-[#86868b]">
                  <span>You May Also Like</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mt-1">
                  Similar Pieces
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className="group bg-white rounded-2xl border border-[#e5e5ea] overflow-hidden p-3 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f5f7] relative">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded-full">
                      {item.karatPurity}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 flex-1">
                    <p className="text-xs text-[#86868b] font-medium">{item.styleName}</p>
                    <h3 className="text-sm font-semibold text-[#1d1d1f] line-clamp-1 group-hover:text-[#0071e3] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#1d1d1f] pt-1">
                      {currencySymbol}{item.price}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#1A1816]" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#de7921] to-[#ffb84d] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
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
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          />

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
