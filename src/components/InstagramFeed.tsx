import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  ShoppingBag, 
  Instagram, 
  ExternalLink, 
  X, 
  Check,
  ShieldCheck,
  Award
} from 'lucide-react';
import { InstagramPost, Product } from '../types';

interface InstagramFeedProps {
  posts: InstagramPost[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, finish?: any) => void;
  currencySymbol: string;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  posts,
  products,
  onSelectProduct,
  onAddToCart,
  currencySymbol
}) => {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const toggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleQuickAddTagged = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  // Find tagged products for active post
  const activeTaggedProducts = selectedPost 
    ? products.filter(p => selectedPost.taggedProductIds.includes(p.id))
    : [];

  return (
    <section id="instagram-social-proof" className="w-full bg-white border-t border-b border-[#e5e5ea] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#1d1d1f]">
              <Instagram className="w-4 h-4" />
              <span>The NaxtTo Collective</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1d1d1f] font-normal leading-tight">
              Worn in modern life, <br />
              <span className="italic text-[#86868b]">documented worldwide.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] font-light">
              Explore how patrons around the globe stack, style, and live in our minimalist solid gold and diamond heirlooms. Tag <strong>@naxtto.jewels</strong> to be curated.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white hover:bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] text-xs font-medium tracking-[0.14em] uppercase rounded-full shadow-xs transition-all flex items-center gap-2"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Follow @naxtto.jewels</span>
              <ExternalLink className="w-3 h-3 text-[#86868b]" />
            </a>
          </div>
        </div>

        {/* Interactive Shoppable Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const likeCount = post.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                id={`ig-card-${post.id}`}
                onClick={() => setSelectedPost(post)}
                className="group relative aspect-square rounded-sm overflow-hidden bg-[#ECE5DA] cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85') {
                      target.src = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85';
                    }
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#1A1816]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-[#FAF9F5]">
                  <div className="flex justify-between items-center text-[11px] text-[#E8DFD1]">
                    <span className="truncate max-w-[90px] font-medium">{post.username}</span>
                    <span className="text-[10px] bg-[#FAF9F5]/20 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                      Shop Look
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <ShoppingBag className="w-6 h-6 mx-auto text-[#D4AF37] animate-bounce" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold block">
                      Tap To View Pieces
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#E8DFD1]">
                    <div className="flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Tagged Icon Indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#1A1816]/80 backdrop-blur-xs text-[#FAF9F5] flex items-center justify-center group-hover:hidden">
                  <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Press Accolades & Social Proof Quotes */}
        <div className="pt-8 border-t border-[#E0D7C9] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">VOGUE</span>
            <p className="text-[11px] text-[#7A7065] italic">"The gold standard for the modern minimalist."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">HARPER'S BAZAAR</span>
            <p className="text-[11px] text-[#7A7065] italic">"Heirlooms designed for effortless daily rotation."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">ELLE ATELIER</span>
            <p className="text-[11px] text-[#7A7065] italic">"Pioneering closed-loop 100% recycled gold."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">FINANCIAL TIMES</span>
            <p className="text-[11px] text-[#7A7065] italic">"Subtle, substantial, and mathematically pure."</p>
          </div>
        </div>
      </div>

      {/* Shoppable Instagram Post Modal */}
      {selectedPost && (
        <div
          id="instagram-post-modal"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF9F5] rounded-sm shadow-2xl overflow-hidden border border-[#E8DFD1] grid grid-cols-1 md:grid-cols-12 max-h-[85vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-ig-modal-btn"
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-[#FAF9F5]/90 hover:bg-[#FAF9F5] text-[#1A1816] shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image View (7 cols) */}
            <div className="md:col-span-7 bg-[#1A1816] flex items-center justify-center">
              <img
                src={selectedPost.image}
                alt={selectedPost.caption}
                className="w-full h-full max-h-[480px] object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85') {
                    target.src = 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85';
                  }
                }}
              />
            </div>

            {/* Right Feed Interaction & Tagged Products (5 cols) */}
            <div className="md:col-span-5 p-5 flex flex-col justify-between overflow-y-auto max-h-[480px]">
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedPost.avatar}
                      alt={selectedPost.username}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D8CEBF]"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-[#1A1816]">{selectedPost.username}</h4>
                      {selectedPost.location && (
                        <p className="text-[10px] text-[#8C7E70]">{selectedPost.location}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A89F91]">{selectedPost.timestamp}</span>
                </div>

                {/* Caption */}
                <p className="text-xs text-[#4A443D] leading-relaxed pt-3 font-light">
                  {selectedPost.caption}
                </p>

                {/* Likes Action */}
                <div className="flex items-center gap-4 pt-3 text-xs text-[#5A524A] border-b border-[#E8DFD1] pb-3">
                  <button
                    onClick={() => toggleLike(selectedPost.id)}
                    className="flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${likedPosts[selectedPost.id] ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{selectedPost.likes + (likedPosts[selectedPost.id] ? 1 : 0)} likes</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedPost.commentsCount} comments</span>
                  </div>
                </div>

                {/* Tagged Featured Pieces Section */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Pieces Tagged in this Look</span>
                  </div>

                  <div className="space-y-2">
                    {activeTaggedProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setSelectedPost(null);
                          onSelectProduct(prod);
                        }}
                        className="p-2.5 bg-[#F2EDE5] hover:bg-[#EAE2D7] border border-[#D8CEBF] rounded-xs flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xs object-cover bg-white"
                          />
                          <div>
                            <h5 className="font-serif text-xs font-semibold text-[#1A1816] line-clamp-1">{prod.name}</h5>
                            <p className="text-[10px] text-[#8C7E70]">{currencySymbol}{prod.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleQuickAddTagged(prod, e)}
                          className={`p-1.5 rounded-lg transition-all shadow-2xs active:scale-95 ${
                            addedAnimationId === prod.id
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40'
                          }`}
                          title="Quick Add to Cart"
                        >
                          {addedAnimationId === prod.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5 text-[#1A1816]" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Catalog */}
              <div className="pt-4 border-t border-[#E8DFD1] text-center">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-xs uppercase tracking-wider font-semibold text-[#8C5D3B] hover:text-[#1A1816]"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
