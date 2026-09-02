import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingBag, 
  Share2, 
  Check, 
  ArrowRight, 
  UserCheck
} from 'lucide-react';
import { Product, WishlistItem, UserProfile } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: WishlistItem[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string, finish?: any) => void;
  onMoveAllToCart: () => void;
  onClearWishlist: () => void;
  currencySymbol: string;
  user: UserProfile;
  onOpenAccount: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart,
  onMoveAllToCart,
  onClearWishlist,
  currencySymbol,
  user,
  onOpenAccount,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const handleShareWishlist = () => {
    const shareUrl = `${window.location.origin}?wishlist=${wishlistItems.map(w => w.product.id).join(',')}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSingleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div 
      id="wishlist-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-[#FAF9F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft border-l border-[#E8DFD1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8DFD1] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#8C5D3B] text-[#8C5D3B]" />
            <div>
              <h2 className="font-serif text-xl font-medium text-[#1A1816]">
                {user.isLoggedIn ? `${user.name.split(' ')[0]}'s Saved Curations` : 'Personalized Wishlist'}
              </h2>
              <span className="text-xs text-[#8C7E70] font-sans">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'saved piece' : 'saved pieces'}
              </span>
            </div>
          </div>
          <button
            id="close-wishlist-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE9DF] text-[#1A1816] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="bg-[#F2EDE5] px-6 py-3 border-b border-[#E8DFD1] text-xs flex items-center justify-between">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Synced with your NaxtTo Circle Account</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[#5A524A]">Please log in to your account</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenAccount();
                }}
                className="text-[#1A1816] font-semibold underline underline-offset-2 hover:text-[#8C5D3B]"
              >
                Sign in
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#F2EDE5] flex items-center justify-center text-[#8C7E70]">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#1A1816]">No pieces saved yet</h3>
                <p className="text-xs text-[#7A7065] mt-1 max-w-xs">
                  {user.isLoggedIn
                    ? 'Click the heart icon on any band, necklace, or earring to curate your private wishlist.'
                    : 'Please log in to your account to curate, save, and sync your private wishlist.'}
                </p>
              </div>

              {!user.isLoggedIn ? (
                <div className="flex flex-col items-center gap-2.5 w-full max-w-xs">
                  <button
                    id="wishlist-login-btn"
                    onClick={() => {
                      onClose();
                      onOpenAccount();
                    }}
                    className="w-full px-6 py-3 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-xl transition-all shadow-xs active:scale-[0.99]"
                  >
                    Please Login Your Account
                  </button>
                  <button
                    onClick={onClose}
                    className="text-xs text-[#7A7065] underline underline-offset-4 hover:text-[#1A1816] transition-colors"
                  >
                    Discover Creations
                  </button>
                </div>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40 text-xs uppercase tracking-[0.14em] font-semibold rounded-xl shadow-2xs"
                >
                  Discover Creations
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Share and Clear actions header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#EFE9DF] text-xs">
                <button
                  id="share-wishlist-btn"
                  onClick={handleShareWishlist}
                  className="flex items-center gap-1.5 text-[#5A524A] hover:text-[#1A1816] font-medium transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Wishlist Link Copied!' : 'Share Wishlist'}</span>
                </button>

                <button
                  onClick={onClearWishlist}
                  className="text-[#8C7E70] hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {wishlistItems.map((item) => (
                <div
                  key={item.product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(item.product);
                  }}
                  className="flex gap-4 p-3 bg-[#FAF9F5] border border-[#E8DFD1] rounded-sm hover:border-[#D8CEBF] transition-all cursor-pointer group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xs bg-[#ECE5DA] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-medium text-[#1A1816] group-hover:text-[#8C5D3B] transition-colors line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveWishlist(item.product.id);
                          }}
                          className="text-[#A89F91] hover:text-red-700 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#8C7E70] mt-0.5">
                        <span>{item.product.metalName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2EDE5]">
                      <span className="font-serif text-sm font-medium text-[#1A1816]">
                        {currencySymbol}{item.product.price}
                      </span>

                      <button
                        onClick={(e) => handleSingleAddToCart(item.product, e)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs active:scale-[0.99] ${
                          addedItemMap[item.product.id]
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40'
                        }`}
                      >
                        {addedItemMap[item.product.id] ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>In Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3 text-[#1A1816]" />
                            <span>Add To Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {wishlistItems.length > 0 && (
          <div className="p-6 border-t border-[#E8DFD1] bg-[#FAF9F5] space-y-3">
            <button
              id="move-all-wishlist-to-cart-btn"
              onClick={onMoveAllToCart}
              className="w-full py-3.5 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs tracking-[0.16em] uppercase font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Move All ({wishlistItems.length}) To Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
