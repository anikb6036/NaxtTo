import React, { useState } from 'react';
import { 
  ArrowLeft,
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Gift, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles as UnusedSparkles
} from 'lucide-react';
import { CartItem, Address, Order, UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';

interface CheckoutPageProps {
  cartItems: CartItem[];
  currencySymbol: string;
  appliedPromo: { code: string; discountPercent: number; discountAmount: number } | null;
  giftWrapIncluded: boolean;
  giftMessage: string;
  onOrderCompleted: (order: Order) => void;
  onBackToShop: () => void;
  savedAddresses?: Address[];
  user?: UserProfile;
  onApplyPromo?: (code: string) => boolean;
  onRemovePromo?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  currencySymbol,
  appliedPromo,
  giftWrapIncluded: initialGiftWrap,
  giftMessage: initialGiftMessage,
  onOrderCompleted,
  onBackToShop,
  savedAddresses = [],
  user,
  onApplyPromo,
  onRemovePromo
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Form State initialized from real authenticated user or blank
  const defaultAddr = user?.savedAddresses?.find(a => a.isDefault) || user?.savedAddresses?.[0];
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.name || defaultAddr?.fullName || '');
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddr?.addressLine2 || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || '');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '');
  const [country, setCountry] = useState(defaultAddr?.country || 'United Kingdom');
  const [phone, setPhone] = useState(defaultAddr?.phone || user?.phone || '');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'express' | 'priority'>('express');

  // Gift options state
  const [giftWrap, setGiftWrap] = useState(initialGiftWrap);
  const [giftMsg, setGiftMsg] = useState(initialGiftMessage);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'apple-pay' | 'klarna' | 'wire'>('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Financial Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountAmount > 0) {
      discount = appliedPromo.discountAmount;
    }
  }
  const shippingFee = shippingMethod === 'priority' ? 45 : (subtotal >= 250 ? 0 : 25);
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  const handleApplySavedAddress = (addr: Address) => {
    setFullName(addr.fullName);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
    setPhone(addr.phone || '');
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (onApplyPromo) {
      const ok = onApplyPromo(promoInput.trim());
      if (!ok) {
        setPromoError('Invalid promotional code. Try "NAXTTO10" for 10% off.');
      } else {
        setPromoError(null);
        setPromoInput('');
      }
    }
  };

  const handlePlaceOrder = () => {
    const generatedOrderNumber = `NXT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedTracking = `DHL-EXP-${Math.floor(100000000 + Math.random() * 900000000)}GB`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generatedOrderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subtotal,
      shippingFee,
      discount,
      tax,
      total: Math.round(total * 100) / 100,
      status: 'Confirmed',
      paymentMethod: paymentMethod === 'apple-pay' ? 'Apple Pay' : paymentMethod === 'card' ? 'Credit Card' : 'Bank Wire',
      trackingNumber: generatedTracking,
      estimatedDelivery: '3–5 Business Days (Insured)',
      shippingAddress: {
        fullName: fullName || 'Valued Client',
        addressLine1: addressLine1 || '100 Luxury Way',
        addressLine2: addressLine2,
        city: city || 'New York',
        state: state || 'NY',
        postalCode: postalCode || '10001',
        country: country || 'United States',
        phone: phone || '+1 555 019 2831',
        isDefault: true
      },
      items: [...cartItems]
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep(4);
    window.scrollTo(0, 0);
  };

  const handleCopyTracking = () => {
    if (completedOrder?.trackingNumber) {
      navigator.clipboard.writeText(completedOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div id="checkout-page" className="w-full bg-white text-[#1d1d1f] min-h-screen font-sans">
      {/* Top Header / Breadcrumbs */}
      <div className="border-b border-[#e5e5ea] bg-white sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[#6e6e73]">
            <button
              onClick={onBackToShop}
              className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0071e3] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span className="text-[#d2d2d7]">/</span>
            <BrandLogo layout="horizontal" size="xs" variant="dark" onClick={onBackToShop} />
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] font-medium">Checkout</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Main Form (7.5 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4 text-[11px] sm:text-xs font-semibold overflow-x-auto scrollbar-none gap-2 sm:gap-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 ${
                    step >= 1 ? 'text-[#1d1d1f]' : 'text-[#86868b]'
                  }`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                    step >= 1 ? 'bg-[#1d1d1f] text-white' : 'bg-[#e5e5ea] text-[#86868b]'
                  }`}>1</span>
                  <span>Address</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d2d2d7] shrink-0" />

                <button
                  type="button"
                  onClick={() => { if (step > 2) setStep(2); }}
                  className={`flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 ${
                    step >= 2 ? 'text-[#1d1d1f]' : 'text-[#86868b]'
                  }`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                    step >= 2 ? 'bg-[#1d1d1f] text-white' : 'bg-[#e5e5ea] text-[#86868b]'
                  }`}>2</span>
                  <span>Delivery & Gift</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d2d2d7] shrink-0" />

                <button
                  type="button"
                  onClick={() => { if (step > 3) setStep(3); }}
                  className={`flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 ${
                    step >= 3 ? 'text-[#1d1d1f]' : 'text-[#86868b]'
                  }`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                    step >= 3 ? 'bg-[#1d1d1f] text-white' : 'bg-[#e5e5ea] text-[#86868b]'
                  }`}>3</span>
                  <span>Payment</span>
                </button>
              </div>

              {/* STEP 1: Shipping Address & Contact */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      1. Contact & Shipping Address
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Where would you like your insured courier parcel delivered?
                    </p>
                  </div>

                  {/* Saved Address Quick Selector */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#1d1d1f]">
                        Choose from Saved Addresses:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map(addr => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleApplySavedAddress(addr)}
                            className="p-3.5 rounded-xl border border-[#e5e5ea] hover:border-[#1d1d1f] text-left text-xs space-y-1 bg-[#f5f5f7] transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#1d1d1f]">{addr.recipientName}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Default</span>
                              )}
                            </div>
                            <p className="text-[#6e6e73] text-[11px] truncate">{addr.street}, {addr.city}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Address Inputs Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[#1d1d1f] font-medium mb-1">Email Address (for tracking alerts)</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#1d1d1f] font-medium mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Enter recipient's full name"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#1d1d1f] font-medium mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={e => setAddressLine1(e.target.value)}
                        placeholder="Street address and apartment, suite, or unit"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">State / Province / County</label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="State / Province"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">Postal / ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        placeholder="e.g. W1K 7TH"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1d1d1f] font-medium mb-1">Country</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        placeholder="e.g. United Kingdom"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#1d1d1f] font-medium mb-1">Mobile Phone (for Armored Courier Access)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+44 20 7946 0912"
                        className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-[#1d1d1f] hover:bg-black text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Continue to Delivery & Gift Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Delivery Speed & Gift Options */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      2. Delivery Speed & Packaging
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Select courier service and personalized gift packaging
                    </p>
                  </div>

                  {/* Shipping Options */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#1d1d1f]">Courier Method</label>

                    <div
                      onClick={() => setShippingMethod('express')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        shippingMethod === 'express' 
                          ? 'border-[#1d1d1f] bg-[#1d1d1f]/5 ring-1 ring-[#1d1d1f]' 
                          : 'border-[#e5e5ea] bg-white hover:border-[#86868b]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-[#1d1d1f] mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-[#1d1d1f]">Insured Courier Delivery</p>
                          <p className="text-[11px] text-[#6e6e73]">Dispatched in 24–48 hours • Signature required</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">
                        {subtotal >= 250 ? 'FREE' : `${currencySymbol}25`}
                      </span>
                    </div>

                    <div
                      onClick={() => setShippingMethod('priority')}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        shippingMethod === 'priority' 
                          ? 'border-[#1d1d1f] bg-[#1d1d1f]/5 ring-1 ring-[#1d1d1f]' 
                          : 'border-[#e5e5ea] bg-white hover:border-[#86868b]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#1d1d1f] mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-[#1d1d1f]">Armored Express Priority</p>
                          <p className="text-[11px] text-[#6e6e73]">Overnight armored van dispatch • Personal courier handoff</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#1d1d1f]">
                        {currencySymbol}45
                      </span>
                    </div>
                  </div>

                  {/* Gift Packaging Options */}
                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-[#f5f5f7] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gift className="w-4 h-4 text-[#1d1d1f]" />
                        <span className="text-xs font-semibold text-[#1d1d1f]">Complimentary Gift Box & Calligraphy</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={e => setGiftWrap(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1d1d1f] accent-[#1d1d1f]"
                      />
                    </div>

                    {giftWrap && (
                      <div className="space-y-2 pt-2 border-t border-[#e5e5ea]">
                        <label className="block text-xs font-medium text-[#1d1d1f]">
                          Personalized Wax-Sealed Note
                        </label>
                        <textarea
                          rows={2}
                          value={giftMsg}
                          onChange={e => setGiftMsg(e.target.value)}
                          placeholder="Write a message to accompany this piece..."
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 border border-[#e5e5ea] text-xs font-semibold rounded-xl hover:bg-[#f5f5f7] transition-all text-[#1d1d1f]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 bg-[#1d1d1f] hover:bg-black text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment & Order Review */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                      3. Payment Method & Review
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                      Encrypted financial settlement with full buyer protection
                    </p>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'credit-card'
                          ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-xs'
                          : 'border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#86868b]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple-pay')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'apple-pay'
                          ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-xs'
                          : 'border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#86868b]'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Apple Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('klarna')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'klarna'
                          ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-xs'
                          : 'border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#86868b]'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Klarna (4x)</span>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'credit-card' && (
                    <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-[#f5f5f7] space-y-3.5 text-xs">
                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Sophia Montgomery"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1d1d1f] font-medium mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#1d1d1f] font-medium mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1d1d1f] font-medium mb-1">CVC / CVV</label>
                          <input
                            type="text"
                            required
                            value={cardCVC}
                            onChange={e => setCardCVC(e.target.value)}
                            placeholder="CVC"
                            className="w-full bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple-pay' && (
                    <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-[#f5f5f7] text-center space-y-2">
                      <p className="text-xs font-semibold text-[#1d1d1f]">Apple Pay Express Checkout</p>
                      <p className="text-xs text-[#6e6e73]">
                        Clicking place order will prompt biometric Face ID / Touch ID verification.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'klarna' && (
                    <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-[#f5f5f7] space-y-2 text-xs">
                      <p className="font-semibold text-[#1d1d1f]">4 Interest-Free Installments</p>
                      <p className="text-[#6e6e73]">
                        Pay 4 payments of <strong>{currencySymbol}{(total / 4).toFixed(2)}</strong> every 2 weeks with 0% APR.
                      </p>
                    </div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-[#6e6e73] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1d1d1f] accent-[#1d1d1f] mt-0.5"
                    />
                    <span>
                      I acknowledge the 30-day effortless return guarantee and understand this piece is crafted from certified 100% recycled 18k solid gold.
                    </span>
                  </label>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-4 border border-[#e5e5ea] text-xs font-semibold rounded-xl hover:bg-[#f5f5f7] transition-all text-[#1d1d1f]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!agreeTerms}
                      onClick={handlePlaceOrder}
                      className="flex-1 py-4 bg-[#1d1d1f] hover:bg-black disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Place Order • {currencySymbol}{Math.round(total)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Order Summary (4.5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-[#f5f5f7] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Order Summary</h3>
                  <span className="text-xs text-[#6e6e73]">{cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'}</span>
                </div>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#e5e5ea] shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-[#1d1d1f] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-semibold text-[#1d1d1f] truncate">{item.product.name}</h4>
                        <p className="text-[#6e6e73] text-[11px] truncate">
                          {item.selectedSize} • {item.selectedFinish?.replace(/-/g, ' ')}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-[#1d1d1f] text-right">
                        {currencySymbol}{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handlePromoSubmit} className="pt-2 border-t border-[#e5e5ea]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Promo code (try NAXTTO10)"
                      className="flex-1 bg-white border border-[#e5e5ea] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1d1d1f] text-white text-xs font-semibold rounded-xl hover:bg-black transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg mt-2">
                      <span>Promo <strong>{appliedPromo.code}</strong> applied</span>
                      {onRemovePromo && (
                        <button type="button" onClick={onRemovePromo} className="text-xs underline hover:text-rose-600">
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#e5e5ea] text-xs text-[#6e6e73]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1d1d1f]">{currencySymbol}{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promotional Discount</span>
                      <span>-{currencySymbol}{Math.round(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Insured Delivery</span>
                    <span>{shippingFee === 0 ? 'Complimentary' : `${currencySymbol}${shippingFee}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>{currencySymbol}{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-[#e5e5ea] text-base font-semibold text-[#1d1d1f]">
                    <span>Total</span>
                    <span>{currencySymbol}{Math.round(total)}</span>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="p-4 rounded-2xl bg-white border border-[#e5e5ea] space-y-2 text-xs text-[#6e6e73]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Risk-Free Returns & Free Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#1d1d1f]" />
                  <span>Insured Transport via Armored Courier</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 4: Order Confirmation & Receipt */
          <div className="max-w-2xl mx-auto text-center space-y-8 py-6 animate-scaleIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f]">
                Thank you for your order
              </h1>
              <p className="text-xs sm:text-sm text-[#6e6e73] max-w-md mx-auto">
                Your heirloom creation is now entered into the atelier ledger. Master goldsmiths are preparing your piece for insured dispatch.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#f5f5f7] border border-[#e5e5ea] text-left space-y-5 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                <BrandLogo layout="horizontal" size="sm" showSubtitle subtitleText="Authenticated Certificate" />
                <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Official Atelier Receipt
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e5e5ea]">
                <div>
                  <span className="text-[#86868b] block">Order Identifier</span>
                  <span className="font-semibold text-sm text-[#1d1d1f] font-mono">{completedOrder?.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#86868b] block">Order Date</span>
                  <span className="font-semibold text-[#1d1d1f]">{completedOrder?.date}</span>
                </div>
              </div>

              {/* Tracking Code */}
              <div className="p-3 bg-white rounded-xl border border-[#e5e5ea] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Armored Courier Tracking</span>
                  <span className="font-mono text-xs font-semibold text-[#1d1d1f]">{completedOrder?.trackingNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="px-3 py-1 bg-[#f5f5f7] hover:bg-[#e5e5ea] rounded-lg text-xs font-medium text-[#1d1d1f] flex items-center gap-1 transition-all"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Items Purchased */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[#86868b] font-medium block">Creations in Shipment:</span>
                {completedOrder?.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1d1d1f]">
                      {item.product.name} ({item.selectedSize}) x {item.quantity}
                    </span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {currencySymbol}{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Destination */}
              <div className="pt-3 border-t border-[#e5e5ea] text-xs text-[#6e6e73]">
                <p><strong>Shipping To:</strong> {completedOrder?.shippingAddress.recipientName}, {completedOrder?.shippingAddress.street}, {completedOrder?.shippingAddress.city}, {completedOrder?.shippingAddress.postalCode}</p>
                <p className="mt-1"><strong>Total Settled:</strong> {currencySymbol}{completedOrder?.totalAmount}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 border border-[#1d1d1f] text-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={onBackToShop}
                className="w-full sm:w-auto px-8 py-3 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Return to Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
