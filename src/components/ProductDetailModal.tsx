import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Ruler, 
  Maximize2,
  Lock,
  ThumbsUp,
  MessageSquarePlus,
  RefreshCw,
  Gem
} from 'lucide-react';
import { Product, MetalType, ProductReview } from '../types';
import { BrandLogo } from './BrandLogo';
import { StarRating, OrangeStar } from './StarRating';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, selectedFinish?: MetalType, quantity?: number) => boolean | void;
  onBuyNow: (product: Product, selectedSize?: string, selectedFinish?: MetalType) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  currencySymbol: string;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  currencySymbol,
  onAddReview
}) => {
  if (!product) return null;

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

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    onAddReview(product.id, {
      author: newReviewAuthor,
      location: newReviewLocation || 'Verified Patron',
      rating: newReviewRating,
      title: newReviewTitle || 'Magnificent piece',
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

  const handleAddToCart = () => {
    const result = onAddToCart(product, selectedSize, selectedFinish, quantity);
    if (result !== false) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  return (
    <div 
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="product-detail-modal-container"
        className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden border border-[#e5e5ea] my-8 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#1d1d1f] shadow-md transition-all hover:rotate-90 duration-300"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Gallery Column (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 bg-[#f5f5f7] border-b lg:border-b-0 lg:border-r border-[#e5e5ea] flex flex-col justify-between">
            <div>
              {/* Main Featured Image with Zoom & Lightbox action */}
              <div className="relative aspect-square w-full rounded-md overflow-hidden bg-white shadow-inner group">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={`${product.name} angle ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Lightbox trigger */}
                <button
                  id="open-image-lightbox"
                  onClick={() => setShowLightbox(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#1d1d1f] shadow-md transition-all text-xs flex items-center gap-1.5 backdrop-blur-xs"
                  title="Expand High-Resolution View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] tracking-wider uppercase font-medium">Expand</span>
                </button>

                {/* Karat purity hallmark watermark */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1A1816]/80 backdrop-blur-xs text-[#FAF9F5] text-[10px] tracking-[0.15em] uppercase font-medium rounded-xs">
                  {product.karatPurity}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-img-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#1A1816] ring-2 ring-[#1A1816]/10 scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Atelier Verification Strip */}
            <div className="mt-6 pt-4 border-t border-[#E0D7C9] flex items-center justify-between text-[11px] text-[#7A7065]">
              <span className="flex items-center gap-1.5 font-medium">
                <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                {product.origin}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Hallmarked & Certified Authentic
              </span>
            </div>
          </div>

          {/* Right Product Details & Buy Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Official Atelier Brand Emblem */}
              <div className="mb-3">
                <BrandLogo layout="horizontal" size="xs" variant="bronze" showSubtitle subtitleText="CERTIFIED ATELIER" />
              </div>

              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#8C7E70] mb-2">
                <span className="tracking-[0.16em] uppercase font-semibold text-[#8C5D3B]">
                  {product.styleName}
                </span>
                <StarRating rating={product.rating} count={product.reviewsCount} size="sm" countFormat="number" />
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1816] leading-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7065] mt-1 font-light">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1816]">
                  {currencySymbol}{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#A89F91] line-through">
                    {currencySymbol}{product.originalPrice}
                  </span>
                )}
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  Complimentary Shipping Included
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A443D] mt-4 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Metal Finish Selector */}
              {product.availableFinishes && product.availableFinishes.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#E8DFD1]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-[#4A443D]">
                      Select Precious Metal
                    </label>
                    <span className="text-xs text-[#8C7E70]">
                      {product.availableFinishes.find(f => f.type === selectedFinish)?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.availableFinishes.map(f => (
                      <button
                        key={f.type}
                        id={`modal-finish-${f.type}`}
                        onClick={() => setSelectedFinish(f.type)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-medium transition-all ${
                          selectedFinish === f.type
                            ? 'border-[#1A1816] bg-[#EFE9DF] text-[#1A1816] shadow-xs'
                            : 'border-[#D8CEBF] bg-[#FAF9F5] text-[#5A524A] hover:bg-[#F2ECE3]'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-black/20" 
                          style={{ backgroundColor: f.colorHex }} 
                        />
                        <span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-[#4A443D]">
                      Dimensions / Sizing
                    </label>
                    <button
                      id="open-size-guide-btn"
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-[#8C5D3B] hover:text-[#1A1816] flex items-center gap-1 font-medium underline underline-offset-2 transition-colors"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide & Printable Scale</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map(size => (
                      <button
                        key={size}
                        id={`modal-size-${size}`}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 text-xs font-medium rounded-sm border transition-all ${
                          selectedSize === size
                            ? 'bg-[#1A1816] text-[#FAF9F5] border-[#1A1816] shadow-sm'
                            : 'bg-[#FAF9F5] text-[#4A443D] border-[#D8CEBF] hover:bg-[#F2ECE3]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Action Buttons */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-[#D8CEBF] rounded-sm bg-[#FAF9F5]">
                    <button
                      id="decrease-qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2.5 text-xs text-[#1A1816] hover:bg-[#EFE9DF] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#1A1816] min-w-[24px] text-center font-sans">
                      {quantity}
                    </span>
                    <button
                      id="increase-qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2.5 text-xs text-[#1A1816] hover:bg-[#EFE9DF] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs tracking-[0.12em] uppercase font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] ${
                      addedAnimation
                        ? 'bg-emerald-700 text-white'
                        : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Atelier Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#1A1816]" />
                        <span>Add To Bag</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    id="modal-wishlist-toggle-btn"
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-all ${
                      isWishlisted
                        ? 'bg-[#E56A85] text-white border-[#E56A85]'
                        : 'bg-[#FAF9F5] text-[#4A443D] border-[#D8CEBF] hover:bg-[#F2ECE3]'
                    }`}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Instant Express Checkout */}
                <button
                  id="modal-instant-buy-btn"
                  onClick={() => onBuyNow(product, selectedSize, selectedFinish)}
                  className="w-full py-3.5 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs tracking-[0.14em] uppercase font-semibold rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Instant Secure Checkout</span>
                </button>
              </div>

              {/* Guarantees List */}
              <div className="mt-6 pt-5 border-t border-[#E8DFD1] grid grid-cols-2 gap-3 text-[11px] text-[#5A524A]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8C5D3B]" />
                  <span>Complimentary Insured Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#8C5D3B]" />
                  <span>Atelier Gift Box & Velvet Pouch</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#8C5D3B]" />
                  <span>30-Day Effortless Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C5D3B]" />
                  <span>Lifetime Guarantee & Polish</span>
                </div>
              </div>

              {/* NaxtTo Provenance Certificate Banner */}
              <div className="mt-4 p-3 rounded-sm bg-[#FAF7F0] border border-[#E8DFD1] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-[11px] font-medium text-[#4A443D]">
                    NaxtTo Certificate of Authenticity & Provenance Included
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#8C5D3B] font-bold">100% Certified</span>
              </div>

              {/* Collapsible Accordion Tabs */}
              <div className="mt-6 pt-5 border-t border-[#E8DFD1] space-y-2 text-xs">
                {/* Accordion 1: Craftsmanship */}
                <div className="border border-[#E8DFD1] rounded-sm bg-[#FAF9F5] overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'craft' ? null : 'craft')}
                    className="w-full p-3 text-left font-medium text-[#1A1816] flex items-center justify-between hover:bg-[#F2ECE3] transition-colors"
                  >
                    <span className="tracking-wider uppercase text-[11px]">Craftsmanship & Metallurgy</span>
                    <ChevronRight className={`w-4 h-4 transform transition-transform ${activeAccordion === 'craft' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeAccordion === 'craft' && (
                    <div className="p-3.5 pt-0 text-[#5A524A] text-xs leading-relaxed space-y-2 border-t border-[#E8DFD1]/50 bg-[#FAF9F5]">
                      <p>{product.story}</p>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-[#4A443D] pt-1">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Specs */}
                <div className="border border-[#E8DFD1] rounded-sm bg-[#FAF9F5] overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')}
                    className="w-full p-3 text-left font-medium text-[#1A1816] flex items-center justify-between hover:bg-[#F2ECE3] transition-colors"
                  >
                    <span className="tracking-wider uppercase text-[11px]">Specifications & Dimensions</span>
                    <ChevronRight className={`w-4 h-4 transform transition-transform ${activeAccordion === 'specs' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeAccordion === 'specs' && (
                    <div className="p-3.5 pt-0 text-[#5A524A] text-xs leading-relaxed space-y-1.5 border-t border-[#E8DFD1]/50 bg-[#FAF9F5]">
                      <div><strong>Dimensions:</strong> {product.dimensions}</div>
                      <div><strong>Karat Purity:</strong> {product.karatPurity}</div>
                      {product.caratWeight && <div><strong>Gemstone Weight:</strong> {product.caratWeight}</div>}
                      <div><strong>Atelier Origin:</strong> {product.origin}</div>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Ethical Sourcing */}
                <div className="border border-[#E8DFD1] rounded-sm bg-[#FAF9F5] overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'ethical' ? null : 'ethical')}
                    className="w-full p-3 text-left font-medium text-[#1A1816] flex items-center justify-between hover:bg-[#F2ECE3] transition-colors"
                  >
                    <span className="tracking-wider uppercase text-[11px]">Ethical Sourcing & Sustainability</span>
                    <ChevronRight className={`w-4 h-4 transform transition-transform ${activeAccordion === 'ethical' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeAccordion === 'ethical' && (
                    <div className="p-3.5 pt-0 text-[#5A524A] text-xs leading-relaxed space-y-2 border-t border-[#E8DFD1]/50 bg-[#FAF9F5]">
                      <p>All gold used in NaxtTo creations is 100% certified recycled bullion, refining pre-existing materials to eliminate mining devastation. Diamonds are grown via zero-emission solar crystallization and graded under strict European gemological standards.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-8 pt-6 border-t border-[#E8DFD1]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#1A1816]">Client Experiences</h3>
                    <p className="text-[11px] text-[#8C7E70]">Verified patrons & connoisseurs</p>
                  </div>
                  <button
                    id="open-review-form-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-semibold tracking-wider uppercase text-[#8C5D3B] hover:text-[#1A1816] flex items-center gap-1 transition-colors"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write A Review</span>
                  </button>
                </div>

                {/* Review Form Drawer */}
                {showReviewForm && (
                  <form 
                    onSubmit={handleAddReviewSubmit} 
                    className="mb-6 p-4 rounded-sm bg-[#F2EDE5] border border-[#D8CEBF] space-y-3 animate-fadeIn"
                  >
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-[#1A1816]">Share Your Atelier Review</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#5A524A] mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Charlotte H."
                          className="w-full bg-[#FAF9F5] border border-[#D8CEBF] p-2 text-xs rounded-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-[#5A524A] mb-1">Location</label>
                        <input
                          type="text"
                          value={newReviewLocation}
                          onChange={(e) => setNewReviewLocation(e.target.value)}
                          placeholder="e.g. London, UK"
                          className="w-full bg-[#FAF9F5] border border-[#D8CEBF] p-2 text-xs rounded-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#5A524A] mb-1">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <OrangeStar
                              sizeClass="w-5 h-5"
                              fillPercent={star <= newReviewRating ? 100 : 0}
                              color="#FF6000"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#5A524A] mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="e.g. Sublime weight and finish"
                        className="w-full bg-[#FAF9F5] border border-[#D8CEBF] p-2 text-xs rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-[#5A524A] mb-1">Your Comments</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe the craftsmanship, tactile feel, and fit..."
                        className="w-full bg-[#FAF9F5] border border-[#D8CEBF] p-2 text-xs rounded-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-3 py-1.5 text-xs text-[#5A524A] hover:bg-[#EAE2D7] rounded-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={reviewSubmitted}
                        className="px-4 py-2 bg-[#E56A85] text-white text-xs uppercase font-semibold tracking-wider rounded-xl hover:bg-[#D45974] transition-all shadow-xs"
                      >
                        {reviewSubmitted ? 'Submitted!' : 'Publish Review'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Review Items List */}
                <div className="space-y-4">
                  {product.reviews.length > 0 ? (
                    product.reviews.map(rev => (
                      <div key={rev.id} className="p-3.5 bg-[#FAF9F5] border border-[#E8DFD1] rounded-sm space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1A1816]">{rev.author}</span>
                            <span className="text-[10px] text-[#8C7E70]">({rev.location})</span>
                            {rev.verified && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                                Verified Patron
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#A89F91]">{rev.date}</span>
                        </div>
                        <div>
                          <StarRating rating={rev.rating} size="xs" showCount={false} />
                        </div>
                        <h5 className="text-xs font-semibold text-[#1A1816]">{rev.title}</h5>
                        <p className="text-xs text-[#4A443D] leading-relaxed font-light">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-[#8C7E70] bg-[#FAF9F5] border border-dashed border-[#D8CEBF] rounded-sm">
                      Be the first connoisseur to review the {product.name}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide Modal */}
        {showSizeGuide && (
          <div 
            id="size-guide-modal"
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowSizeGuide(false)}
          >
            <div 
              className="bg-[#FAF9F5] max-w-lg w-full p-6 rounded-sm shadow-2xl border border-[#E8DFD1] space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#8C5D3B]" />
                  <h3 className="font-serif text-lg font-semibold text-[#1A1816]">Atelier Sizing Guide</h3>
                </div>
                <button onClick={() => setShowSizeGuide(false)} className="p-1 hover:bg-[#EFE9DF] rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#5A524A] leading-relaxed">
                Our rings and bracelets are engineered with comfort-fit geometry. To find your exact measurement, wrap a strip of paper around your knuckle, mark the overlap, and measure against a millimeter ruler.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-[#E8DFD1]">
                  <thead className="bg-[#EFE9DF] text-[#1A1816] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-2 border-b border-[#E8DFD1]">US Size</th>
                      <th className="p-2 border-b border-[#E8DFD1]">Inside Diameter</th>
                      <th className="p-2 border-b border-[#E8DFD1]">Circumference</th>
                      <th className="p-2 border-b border-[#E8DFD1]">UK / EU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD1] text-[#4A443D]">
                    <tr><td className="p-2 font-semibold">US 5</td><td className="p-2">15.7 mm</td><td className="p-2">49.3 mm</td><td className="p-2">J 1/2 (49)</td></tr>
                    <tr><td className="p-2 font-semibold">US 6</td><td className="p-2">16.5 mm</td><td className="p-2">51.9 mm</td><td className="p-2">L 1/2 (52)</td></tr>
                    <tr><td className="p-2 font-semibold">US 7</td><td className="p-2">17.3 mm</td><td className="p-2">54.4 mm</td><td className="p-2">N 1/2 (54)</td></tr>
                    <tr><td className="p-2 font-semibold">US 8</td><td className="p-2">18.1 mm</td><td className="p-2">57.0 mm</td><td className="p-2">P 1/2 (57)</td></tr>
                    <tr><td className="p-2 font-semibold">US 9</td><td className="p-2">18.9 mm</td><td className="p-2">59.5 mm</td><td className="p-2">R 1/2 (60)</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="px-4 py-2 bg-[#1A1816] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold rounded-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Lightbox */}
        {showLightbox && (
          <div 
            id="fullscreen-image-lightbox"
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-6 right-6 p-3 text-white hover:text-[#D4AF37] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
