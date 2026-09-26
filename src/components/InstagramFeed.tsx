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
import imgSakhaPolaStack from '../assets/images/sakha_pola_stack_1790249812700.jpg';
import imgGoldBadhanoPola from '../assets/images/gold_badhano_pola_1790249832633.jpg';
import imgMayurMukhiShankha from '../assets/images/mayur_mukhi_shankha_1790249854136.jpg';
import imgLohaBadhanoGold from '../assets/images/loha_badhano_gold_1790249869592.jpg';
import imgBengaliBridalWrist from '../assets/images/bengali_bridal_wrist_1790249886691.jpg';
import imgShankhaPolaSet from '../assets/images/shankha_pola_set_1790249913718.jpg';

const SAKHA_POLA_FEED_ITEMS: InstagramPost[] = [
  {
    id: 'ig-sp-01',
    username: 'debolina.banerjee',
    handle: '@debolina_b',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: imgSakhaPolaStack,
    caption: 'Pure white Mayur Mukhi Shankha & 22K gold-bound Pola stack on my wedding morning with traditional red alta. The conch feels so cool and sacred on the wrist! #SakhaPola #BengaliBride #NaxtTo',
    likes: 2450,
    commentsCount: 68,
    timestamp: '2 hours ago',
    taggedProductIds: ['sp-001', 'sp-003'],
    location: 'Kolkata, West Bengal'
  },
  {
    id: 'ig-sp-02',
    username: 'subhasree.weddings',
    handle: '@subhasree_weddings',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    image: imgGoldBadhanoPola,
    caption: 'Macro beauty: 22K BIS hallmarked solid gold Borkhi wire work meticulously wrapped around deep crimson Pola. Heirloom craftsmanship by Bowbazar goldsmiths. #GoldBadhano #Pola #22kGold',
    likes: 3820,
    commentsCount: 112,
    timestamp: '1 day ago',
    taggedProductIds: ['sp-003'],
    location: 'Bowbazar, Kolkata'
  },
  {
    id: 'ig-sp-03',
    username: 'ananya.ghosh',
    handle: '@ananya_ghosh_',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: imgMayurMukhiShankha,
    caption: 'Authentic conch shell hand-carved in Nabadwip. The Mayur Mukhi peacock terminals and chiseled plumage have that sacred natural conch acoustic resonance. #PureShankha #NabadwipCraft',
    likes: 1940,
    commentsCount: 45,
    timestamp: '2 days ago',
    taggedProductIds: ['sp-001'],
    location: 'Nabadwip, West Bengal'
  },
  {
    id: 'ig-sp-04',
    username: 'rituparna_roy',
    handle: '@rituparna_roy',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    image: imgLohaBadhanoGold,
    caption: 'Makara Mukhi 22K Gold Loha Badhano: Solid wrought iron encased in certified 22K gold with dual sea-dragon terminal heads. The timeless protective shield of Bengali married women. #LohaBadhano',
    likes: 4120,
    commentsCount: 129,
    timestamp: '4 days ago',
    taggedProductIds: ['sp-005'],
    location: 'Salt Lake, Kolkata'
  },
  {
    id: 'ig-sp-05',
    username: 'poulomi_sen',
    handle: '@poulomi_sen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    image: imgBengaliBridalWrist,
    caption: 'Saat Paake Ghora ready! Stacked my NaxtTo Shakha, Pola, and 22K gold badhano bangles with my heirloom red Banarasi saree. Received endless compliments on the intricate carving! #BengaliBou #ShakhaPolaStack',
    likes: 2890,
    commentsCount: 73,
    timestamp: '5 days ago',
    taggedProductIds: ['sp-006', 'sp-001', 'sp-002'],
    location: 'Ballygunge, Kolkata'
  },
  {
    id: 'ig-sp-06',
    username: 'madhumita_pal',
    handle: '@madhumita_pal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    image: imgShankhaPolaSet,
    caption: 'The complete Sampurna Bou bridal hamper arrived in a red silk trunk with brass vermilion thali. Certified BIS hallmarked 22K gold, genuine conch shell, and lustrous crimson pola. #AuspiciousBlessing #NaxtToAtelier',
    likes: 3100,
    commentsCount: 88,
    timestamp: '1 week ago',
    taggedProductIds: ['sp-006'],
    location: 'Burdwan, West Bengal'
  }
];

interface InstagramFeedProps {
  posts?: InstagramPost[];
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
  const displayPosts = SAKHA_POLA_FEED_ITEMS;
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
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#8C271E]">
              <Instagram className="w-4 h-4 text-[#8C271E]" />
              <span>The NaxtTo Sakha Pola Circle</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1d1d1f] font-normal leading-tight">
              Worn with bridal pride, <br />
              <span className="italic text-[#86868b]">cherished across generations.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] font-light">
              Explore how Bengali brides, modern patrons, and heirloom connoisseurs stack, style, and celebrate in our certified conch shell Shankha, 22K gold-bound Pola, and protective Loha. Tag <strong>@naxtto.sakhapola</strong> to be featured in our bridal gallery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white hover:bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] text-xs font-medium tracking-[0.14em] uppercase rounded-full shadow-xs transition-all flex items-center gap-2"
            >
              <Instagram className="w-3.5 h-3.5 text-[#8C271E]" />
              <span>Follow @naxtto.sakhapola</span>
              <ExternalLink className="w-3 h-3 text-[#86868b]" />
            </a>
          </div>
        </div>

        {/* Interactive Shoppable Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayPosts.map((post) => {
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
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== imgSakhaPolaStack) {
                      target.src = imgSakhaPolaStack;
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
            <span className="font-serif text-base sm:text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">ANANDABAZAR PATRIKA</span>
            <p className="text-[11px] text-[#7A7065] italic">"Reviving 1,500 years of Bengali conch shell & 22K gold badhano mastery."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-base sm:text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">SANANDA BRIDAL</span>
            <p className="text-[11px] text-[#7A7065] italic">"The definitive heirloom standard for the contemporary Bengali bride."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-base sm:text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">FEMINA BENGAL</span>
            <p className="text-[11px] text-[#7A7065] italic">"Natural conch shell resonance paired seamlessly with BIS hallmarked gold."</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-base sm:text-lg tracking-widest text-[#1A1816] uppercase block font-semibold">THE TELEGRAPH METRO</span>
            <p className="text-[11px] text-[#7A7065] italic">"Bridging centuries-old Nabadwip craft with modern certified purity."</p>
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
                  if (target.src !== imgSakhaPolaStack) {
                    target.src = imgSakhaPolaStack;
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
