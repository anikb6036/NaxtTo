import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { Product, MetalType, ProductReview, ProductCategory } from '../types';
import { StarRating, OrangeStar } from './StarRating';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: MetalType, quantity?: number) => void;
  onBuyNow: (product: Product, selectedSize?: string, selectedFinish?: MetalType) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol: string;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onSelectCategory: (category: ProductCategory) => void;
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
  onSelectCategory
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

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
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
    onAddToCart(product, selectedSize, selectedFinish, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
          <div className="flex items-center gap-2 text-sm text-[#6e6e73]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Multi-Angle Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Primary Display */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f5f5f7] border border-[#e5e5ea] group shadow-xs">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} angle ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Karat purity watermark badge */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#1d1d1f] text-xs font-medium rounded-full border border-[#e5e5ea] shadow-xs">
                {product.karatPurity}
              </div>

              {/* Lightbox Expand Trigger */}
              <button
                id="open-image-lightbox"
                onClick={() => setShowLightbox(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#1d1d1f] shadow-md transition-all text-xs flex items-center gap-1.5 border border-[#e5e5ea] hover:scale-105"
                title="Expand Full View"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="font-medium">Zoom</span>
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  id={`thumb-img-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#1d1d1f] ring-2 ring-[#1d1d1f]/15 scale-98 shadow-sm'
                      : 'border-[#e5e5ea] opacity-70 hover:opacity-100 hover:border-[#86868b]'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Verification Strip */}
            <div className="p-4 rounded-xl bg-[#f5f5f7] border border-[#e5e5ea] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6e6e73]">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-[#c5a059]" />
                <span><strong>Origin:</strong> {product.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Hallmarked & Certified Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>Conflict-Free Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header: Category, Title, Subtitle, Ratings */}
            <div className="space-y-3 pb-5 border-b border-[#e5e5ea]">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-block px-3 py-1 bg-[#1d1d1f]/5 text-[#1d1d1f] rounded-full font-medium">
                  {product.styleName} • {product.category}
                </span>

                <a href="#reviews-section" className="flex items-center hover:opacity-85 transition-opacity">
                  <StarRating rating={product.rating} count={product.reviewsCount} size="sm" countFormat="number" />
                </a>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] leading-snug">
                {product.name}
              </h1>
              
              <p className="text-sm text-[#6e6e73] font-normal leading-relaxed">
                {product.subtitle}
              </p>

              {/* Price & Shipping */}
              <div className="pt-2 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f]">
                  {currencySymbol}{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#86868b] line-through">
                    {currencySymbol}{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-medium">
                  Free Insured Courier Shipping
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#48484a] leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Metal Finish Selector */}
            {product.availableFinishes && product.availableFinishes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#1d1d1f]">
                    Precious Metal Finish
                  </label>
                  <span className="text-[#6e6e73]">
                    {product.availableFinishes.find(f => f.type === selectedFinish)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.availableFinishes.map(f => (
                    <button
                      key={f.type}
                      id={`pdp-finish-${f.type}`}
                      onClick={() => setSelectedFinish(f.type)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedFinish === f.type
                          ? 'border-[#1d1d1f] bg-[#1d1d1f]/5 text-[#1d1d1f] font-semibold shadow-xs ring-1 ring-[#1d1d1f]'
                          : 'border-[#e5e5ea] bg-white text-[#6e6e73] hover:border-[#86868b] hover:bg-[#f5f5f7]'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" 
                        style={{ backgroundColor: f.colorHex }}
                      />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector & Ring Size Guide */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#1d1d1f]">
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map(size => (
                    <button
                      key={size}
                      id={`pdp-size-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-3.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white font-semibold shadow-xs'
                          : 'border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#1d1d1f]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Collapsible Size Guide */}
                {showSizeGuide && (
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex justify-between items-center font-semibold text-[#1d1d1f]">
                      <span>International Sizing Matrix</span>
                      <span className="text-[#86868b] font-normal text-xs">Diameter (mm)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs text-[#6e6e73]">
                      <div className="p-2 bg-white rounded border border-[#e5e5ea]"><strong>US 5</strong> (15.7mm)</div>
                      <div className="p-2 bg-white rounded border border-[#e5e5ea]"><strong>US 6</strong> (16.5mm)</div>
                      <div className="p-2 bg-white rounded border border-[#e5e5ea]"><strong>US 7</strong> (17.3mm)</div>
                      <div className="p-2 bg-white rounded border border-[#e5e5ea]"><strong>US 8</strong> (18.1mm)</div>
                    </div>
                    <p className="text-xs text-[#86868b]">
                      Complimentary bespoke resizing provided within 60 days of purchase.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-semibold text-[#1d1d1f]">
                Quantity
              </label>
              <div className="flex items-center border border-[#e5e5ea] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
                >
                  -
                </button>
                <span className="px-3.5 py-1.5 text-xs font-semibold text-[#1d1d1f] min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1.5 text-sm text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCartClick}
                className={`w-full py-3.5 px-6 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40 hover:shadow-md active:scale-[0.99]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#1A1816]" />
                    <span>Add to Bag • {currencySymbol}{product.price * quantity}</span>
                  </>
                )}
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={() => onBuyNow(product, selectedSize, selectedFinish)}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold bg-[#E56A85] hover:bg-[#D45974] text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Trust Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e5e5ea]">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f5f5f7]">
                <Truck className="w-4 h-4 text-[#1d1d1f] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#1d1d1f]">Insured Courier Delivery</p>
                  <p className="text-[#6e6e73]">Dispatched in 24–48h</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f5f5f7]">
                <RefreshCw className="w-4 h-4 text-[#1d1d1f] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#1d1d1f]">30-Day Returns</p>
                  <p className="text-[#6e6e73]">Free pickup & exchange</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f5f5f7]">
                <ShieldCheck className="w-4 h-4 text-[#1d1d1f] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#1d1d1f]">Lifetime Guarantee</p>
                  <p className="text-[#6e6e73]">Annual complimentary cleaning</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f5f5f7]">
                <Gift className="w-4 h-4 text-[#1d1d1f] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-[#1d1d1f]">Gift Packaging</p>
                  <p className="text-[#6e6e73]">Signature box included</p>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-[#e5e5ea] border-t border-b border-[#e5e5ea] pt-1">
              {/* Accordion 1: Craftsmanship & Origin */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'craft' ? null : 'craft')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-[#1d1d1f]"
                >
                  <span>Craftsmanship & Materials</span>
                  <ChevronRight className={`w-4 h-4 text-[#86868b] transition-transform ${activeAccordion === 'craft' ? 'rotate-90' : ''}`} />
                </button>
                {activeAccordion === 'craft' && (
                  <div className="mt-3 text-xs sm:text-sm text-[#6e6e73] space-y-2 leading-relaxed animate-fadeIn">
                    <p>
                      Meticulously crafted using 100% recycled 18 Karat solid gold. Every prong, curve, and bezel is mirror-polished by master artisans to provide smooth, comfortable daily wear.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div><strong>Karat Purity:</strong> {product.karatPurity}</div>
                      <div><strong>Weight:</strong> {product.weightGrams} grams</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Dimensions & Gemstone */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-[#1d1d1f]"
                >
                  <span>Dimensions & Gemstone Details</span>
                  <ChevronRight className={`w-4 h-4 text-[#86868b] transition-transform ${activeAccordion === 'specs' ? 'rotate-90' : ''}`} />
                </button>
                {activeAccordion === 'specs' && (
                  <div className="mt-3 text-xs sm:text-sm text-[#6e6e73] space-y-2 leading-relaxed animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>Dimensions:</strong> {product.dimensions}</div>
                      <div><strong>Gemstone:</strong> {product.gemstone || 'Solid Gold Metal'}</div>
                      <div><strong>Finish:</strong> Hand Mirror-Polished</div>
                      <div><strong>Hallmark:</strong> Stamped 750 / Au</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Ethical Sourcing */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'ethical' ? null : 'ethical')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-[#1d1d1f]"
                >
                  <span>Ethical Sourcing & Sustainability</span>
                  <ChevronRight className={`w-4 h-4 text-[#86868b] transition-transform ${activeAccordion === 'ethical' ? 'rotate-90' : ''}`} />
                </button>
                {activeAccordion === 'ethical' && (
                  <div className="mt-3 text-xs sm:text-sm text-[#6e6e73] space-y-2 leading-relaxed animate-fadeIn">
                    <p>
                      Our diamonds and precious gemstones conform strictly to the Kimberley Process and RJC (Responsible Jewellery Council) ethical protocols. Recycled gold diminishes refining carbon footprints by 95%.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between text-sm font-semibold text-[#1d1d1f]"
                >
                  <span>Shipping & Returns</span>
                  <ChevronRight className={`w-4 h-4 text-[#86868b] transition-transform ${activeAccordion === 'shipping' ? 'rotate-90' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="mt-3 text-xs sm:text-sm text-[#6e6e73] space-y-2 leading-relaxed animate-fadeIn">
                    <p>
                      All international shipments are dispatched via insured armored courier. Includes 30 days of risk-free returns and complimentary pickup.
                    </p>
                  </div>
                )}
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
              onClick={() => setShowReviewForm(true)}
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

                {reviewSubmitted ? (
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
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">City / Country</label>
                        <input
                          type="text"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          placeholder="e.g. London, UK"
                          className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
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
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
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
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
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

      {/* Lightbox Zoom Dialog */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
