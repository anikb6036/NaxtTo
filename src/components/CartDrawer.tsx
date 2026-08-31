import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  Tag, 
  Check, 
  Lock,
  Truck
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number, size?: string, finish?: any) => void;
  onRemoveItem: (productId: string, size?: string, finish?: any) => void;
  onProceedToCheckout: () => void;
  currencySymbol: string;
  appliedPromo: { code: string; discountPercent: number; discountAmount: number } | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  giftWrapIncluded: boolean;
  onToggleGiftWrap: (val: boolean) => void;
  giftMessage: string;
  onChangeGiftMessage: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currencySymbol,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  giftWrapIncluded,
  onToggleGiftWrap,
  giftMessage,
  onChangeGiftMessage
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showGiftNoteInput, setShowGiftNoteInput] = useState(giftWrapIncluded);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 250;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountAmount > 0) {
      discount = appliedPromo.discountAmount;
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;
  const estimatedTax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + shippingFee + estimatedTax);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try NAXTTO10 for 10% off.');
    }
  };

  return (
    <div 
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FAF9F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft border-l border-[#E8DFD1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8DFD1] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#8C5D3B]" />
            <h2 className="font-serif text-xl font-medium text-[#1A1816]">Atelier Bag</h2>
            <span className="text-xs text-[#8C7E70] font-sans">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE9DF] text-[#1A1816] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#F2EDE5] px-6 py-3 border-b border-[#E8DFD1] text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium text-[#4A443D]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8C5D3B]" />
              {amountToFreeShipping === 0 ? (
                <span className="text-emerald-800 font-semibold">You have unlocked Complimentary Insured Shipping!</span>
              ) : (
                <span>Add <strong>{currencySymbol}{amountToFreeShipping.toFixed(0)}</strong> for Complimentary Express Shipping</span>
              )}
            </div>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#D8CEBF] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1A1816] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#F2EDE5] flex items-center justify-center text-[#8C7E70]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#1A1816]">Your bag is currently empty</h3>
                <p className="text-xs text-[#7A7065] mt-1 max-w-xs">
                  Discover our minimal solid 18k gold bands, diamond studs, and organic pearl heirlooms.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1A1816] text-[#FAF9F5] text-xs uppercase tracking-[0.16em] font-semibold rounded-xs hover:bg-[#2E2B27]"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedFinish}-${idx}`}
                  className="flex gap-4 p-3 bg-[#FAF9F5] border border-[#E8DFD1] rounded-sm hover:border-[#D8CEBF] transition-all"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xs bg-[#ECE5DA] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-medium text-[#1A1816] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedFinish)}
                          className="text-[#A89F91] hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#8C7E70] mt-0.5 space-x-2">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedFinish && <span>• Finish: {item.selectedFinish.replace(/-/g, ' ')}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2EDE5]">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D8CEBF] rounded-xs bg-[#FAF9F5]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedFinish)}
                          className="p-1 px-2 text-[#1A1816] hover:bg-[#EFE9DF] text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold font-sans">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedFinish)}
                          className="p-1 px-2 text-[#1A1816] hover:bg-[#EFE9DF] text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-medium text-[#1A1816]">
                        {currencySymbol}{(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bespoke Gift Wrapping Option */}
              <div className="p-3.5 bg-[#F4EFE7] border border-[#E0D7C9] rounded-sm space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={giftWrapIncluded}
                    onChange={(e) => {
                      onToggleGiftWrap(e.target.checked);
                      setShowGiftNoteInput(e.target.checked);
                    }}
                    className="rounded accent-[#1A1816]"
                  />
                  <span className="font-medium text-[#1A1816] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#8C5D3B]" />
                    Complimentary Atelier Gift Packaging & Calligraphy Card
                  </span>
                </label>

                {showGiftNoteInput && (
                  <div className="pt-2 animate-fadeIn">
                    <textarea
                      rows={2}
                      value={giftMessage}
                      onChange={(e) => onChangeGiftMessage(e.target.value)}
                      placeholder="Write your bespoke handwritten message here..."
                      className="w-full bg-[#FAF9F5] border border-[#D8CEBF] p-2 text-xs rounded-xs placeholder:text-[#A89F91]"
                    />
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-[#EFE9DF] p-2.5 rounded-sm text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code "{appliedPromo.code}" Applied ({appliedPromo.discountPercent}% OFF)</span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-[#8C7E70] hover:text-red-700 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promotional code (e.g. NAXTTO10)"
                        className="w-full bg-[#F2EDE5] border border-[#D8CEBF] rounded-xs px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-[#1A1816]"
                      />
                      <Tag className="w-3.5 h-3.5 text-[#8C7E70] absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#EFE9DF] text-[#1A1816] border border-[#D8CEBF] text-xs font-semibold uppercase tracking-wider rounded-xs"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#E8DFD1] bg-[#FAF9F5] space-y-3">
            <div className="space-y-1.5 text-xs text-[#5A524A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#1A1816]">{currencySymbol}{subtotal.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Atelier Privilege Discount</span>
                  <span>-{currencySymbol}{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-800 uppercase text-[10px]">Complimentary</strong> : `${currencySymbol}${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Value Tax (8%)</span>
                <span>{currencySymbol}{estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1A1816] pt-2 border-t border-[#E8DFD1]">
                <span>Total Investment</span>
                <span className="font-serif text-lg">{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-[#1A1816] hover:bg-[#2E2B27] text-[#FAF9F5] text-xs tracking-[0.18em] uppercase font-semibold rounded-sm transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Proceed To Secure Checkout</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-[#8C7E70] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                256-Bit Encrypted Checkout
              </span>
              <span>•</span>
              <span>Apple Pay / ShopPay / Visa / Klarna</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
