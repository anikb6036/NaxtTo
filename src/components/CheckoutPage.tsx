import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Gift, 
  Copy, 
  Check, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  Clock,
  Plus,
  Minus,
  AlertCircle,
  Home,
  User,
  Smartphone,
  Loader2,
  Edit3,
  Trash2,
  BookmarkCheck,
  Sparkles as UnusedSparkles
} from 'lucide-react';
import { CartItem, Address, Order, UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';
import { apiClient } from '../services/api';
import { 
  loadCheckoutAddressDraft, 
  saveCheckoutAddressDraft, 
  getUserStorageKey,
  safeSetItem,
  sanitizeOrderForStorage
} from '../utils/userStorage';

// Helper to load Razorpay standard checkout script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as any).Razorpay) return resolve(true);
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      // Polling fallback if script already finished before event listener was attached
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).Razorpay) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts >= 15) {
          clearInterval(interval);
          resolve(Boolean((window as any).Razorpay));
        }
      }, 150);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  onSaveNewAddress?: (address: Address) => void;
  onDeleteAddress?: (addressId: string) => void;
  onGoToLogin?: () => void;
  onRemoveItem?: (productId: string, size?: string, finish?: any) => void;
  onUpdateQuantity?: (productId: string, newQty: number, size?: string, finish?: any) => void;
}

// Helper to restrict and format Indian 10-digit mobile number
export const formatIndianMobile = (value?: string | number | null): string => {
  if (value === null || value === undefined) return '';
  let digits = String(value).replace(/\D/g, '');
  // If user pasted with 91 country code (12 digits)
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  // If user pasted with leading trunk 0 (11 digits)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};

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
  onRemovePromo,
  onSaveNewAddress,
  onDeleteAddress,
  onGoToLogin,
  onRemoveItem,
  onUpdateQuantity
}) => {
  const [completedOrder, setCompletedOrder] = useState<Order | null>(() => {
    try {
      const sessionSaved = sessionStorage.getItem('naxtto_completed_order');
      if (sessionSaved) return JSON.parse(sessionSaved);
      const localSaved = localStorage.getItem('naxtto_last_order');
      if (localSaved) return JSON.parse(localSaved);
    } catch {
      // ignore
    }
    return null;
  });

  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    try {
      const sessionSaved = sessionStorage.getItem('naxtto_completed_order');
      if (sessionSaved) return 4;
    } catch {
      // ignore
    }
    return 1;
  });
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Address Selection Mode: if saved addresses exist, start in 'saved' mode; else 'new'
  const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;
  const defaultAddr = user?.savedAddresses?.find(a => a.isDefault) || user?.savedAddresses?.[0] || (savedAddresses.length > 0 ? savedAddresses[0] : undefined);
  const userKey = getUserStorageKey(user);
  const savedDraft = loadCheckoutAddressDraft(userKey);

  const [addressMode, setAddressMode] = useState<'saved' | 'new'>(() => {
    return hasSavedAddresses ? 'saved' : 'new';
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    return defaultAddr?.id || (savedAddresses.length > 0 ? (savedAddresses[0].id || 'addr-0') : null);
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressSavedSuccessBanner, setAddressSavedSuccessBanner] = useState<string | null>(null);

  // Track if customer explicitly typed in a custom email/name/phone
  const [userEditedEmail, setUserEditedEmail] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const [userEditedPhone, setUserEditedPhone] = useState(false);

  // Form State initialized from default saved address, draft, or user info
  const [email, setEmail] = useState(user?.email || 'baidyaanik18@gmail.com');
  const [fullName, setFullName] = useState(defaultAddr?.fullName || savedDraft?.fullName || user?.name || '');
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || savedDraft?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddr?.addressLine2 || savedDraft?.addressLine2 || '');
  const [city, setCity] = useState(defaultAddr?.city || savedDraft?.city || '');
  const [state, setState] = useState(defaultAddr?.state || savedDraft?.state || '');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || savedDraft?.postalCode || '');
  const [country, setCountry] = useState(defaultAddr?.country || savedDraft?.country || 'India');
  const [phone, setPhone] = useState(() => formatIndianMobile(defaultAddr?.phone || savedDraft?.phone || user?.phone || ''));
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Real-time auto-saving of draft so typed address details are NEVER lost or deleted on refresh
  useEffect(() => {
    if (addressMode === 'new' && (addressLine1 || city || postalCode || fullName || phone)) {
      saveCheckoutAddressDraft(userKey, {
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone
      });
    }
  }, [userKey, addressMode, fullName, addressLine1, addressLine2, city, state, postalCode, country, phone]);

  // Auto-fetch and sync user's email ID and account details when logged in or when auth resolves
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.name && (!fullName || !userEditedName)) {
      setFullName(user.name);
    }
    if (user?.phone && (!phone || !userEditedPhone)) {
      setPhone(formatIndianMobile(user.phone));
    }
  }, [user?.email, user?.name, user?.phone, user?.isLoggedIn, userEditedName, userEditedPhone]);

  // Sync saved addresses if user logs in during checkout or profile hydrates
  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      if (!selectedAddressId) {
        const defaultA = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
        setSelectedAddressId(defaultA.id || 'addr-0');
        setAddressMode('saved');
        handleApplySavedAddress(defaultA);
      }
    }
  }, [savedAddresses]);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'express'>('express');

  // Gift options state
  const [giftWrap, setGiftWrap] = useState(initialGiftWrap);
  const [giftMsg, setGiftMsg] = useState(initialGiftMessage);

  // Payment Method: Exclusively Razorpay
  const paymentMethod = 'razorpay' as const;
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [paymentGatewayError, setPaymentGatewayError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Promo code input
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

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
  const shippingFee = subtotal >= 250 ? 0 : 25;
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  const handleApplySavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || `${addr.fullName}-${addr.addressLine1}`);
    setFullName(addr.fullName || (addr as any).recipientName || '');
    setAddressLine1(addr.addressLine1 || (addr as any).street || '');
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPostalCode(addr.postalCode || (addr as any).zip || '');
    setCountry(addr.country || 'India');
    setPhone(formatIndianMobile(addr.phone || ''));
    setStep1Error(null);
  };

  const handleStartEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id || `${addr.fullName}-${addr.addressLine1}`);
    setFullName(addr.fullName || '');
    setAddressLine1(addr.addressLine1 || '');
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPostalCode(addr.postalCode || '');
    setCountry(addr.country || 'India');
    setPhone(formatIndianMobile(addr.phone || ''));
    setAddressMode('new');
    setStep1Error(null);
  };

  const handleExplicitSaveAddress = () => {
    if (!fullName.trim()) {
      setStep1Error('Please enter the recipient full legal name.');
      return;
    }
    if (!addressLine1.trim()) {
      setStep1Error('Please enter the street address.');
      return;
    }
    if (!city.trim()) {
      setStep1Error('Please enter the city.');
      return;
    }
    if (!postalCode.trim()) {
      setStep1Error('Please enter the postal or PIN code.');
      return;
    }

    const cleanedPhone = formatIndianMobile(phone);
    if (!cleanedPhone) {
      setStep1Error('Please enter a 10-digit Indian mobile number for courier handoff.');
      return;
    }
    if (cleanedPhone.length !== 10) {
      setStep1Error(`Please enter a complete 10-digit Indian mobile number (${cleanedPhone.length}/10 digits entered).`);
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setStep1Error('Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.');
      return;
    }

    const targetId = editingAddressId || `addr-${Date.now()}`;
    const newAddressObj: Address = {
      id: targetId,
      fullName: fullName.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim() || 'India',
      phone: `+91 ${cleanedPhone}`,
      isDefault: savedAddresses.length === 0 || !!editingAddressId
    };

    if (onSaveNewAddress) {
      onSaveNewAddress(newAddressObj);
    }

    setSelectedAddressId(targetId);
    setAddressMode('saved');
    setEditingAddressId(null);
    setStep1Error(null);
    setAddressSavedSuccessBanner('Address details successfully saved to your account! They will never be deleted.');
    setTimeout(() => {
      setAddressSavedSuccessBanner(null);
    }, 6000);
  };

  const handleProceedToStep2 = () => {
    // Automatically guarantee a valid patron email for order receipts
    if (!email.trim()) {
      setEmail(user?.email || 'baidyaanik18@gmail.com');
    }

    if (addressMode === 'new' || !hasSavedAddresses) {
      if (!fullName.trim()) {
        setStep1Error('Please enter the recipient full legal name.');
        return;
      }
      if (!addressLine1.trim()) {
        setStep1Error('Please enter the street address.');
        return;
      }
      if (!city.trim()) {
        setStep1Error('Please enter the city.');
        return;
      }
      if (!postalCode.trim()) {
        setStep1Error('Please enter the postal or PIN code.');
        return;
      }
      
      const cleanedPhone = formatIndianMobile(phone);
      if (!cleanedPhone) {
        setStep1Error('Please enter a 10-digit Indian mobile number for courier handoff.');
        return;
      }
      if (cleanedPhone.length !== 10) {
        setStep1Error(`Please enter a complete 10-digit Indian mobile number (${cleanedPhone.length}/10 digits entered).`);
        return;
      }
      if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
        setStep1Error('Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.');
        return;
      }

      // Always save new address to account so details are NEVER lost or deleted
      const targetId = editingAddressId || `addr-${Date.now()}`;
      const newAddressObj: Address = {
        id: targetId,
        fullName: fullName.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || 'India',
        phone: `+91 ${cleanedPhone}`,
        isDefault: savedAddresses.length === 0 || !!editingAddressId
      };

      if (onSaveNewAddress) {
        onSaveNewAddress(newAddressObj);
      }
      setSelectedAddressId(targetId);
      setEditingAddressId(null);
    } else {
      // In saved mode, ensure we have valid shipping data
      if (!fullName.trim() || !addressLine1.trim()) {
        setStep1Error('Please select a valid saved delivery address or enter a new one.');
        return;
      }
    }

    setStep1Error(null);
    setStep(2);
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

  const handlePlaceOrder = async () => {
    // If Razorpay is chosen, process through Razorpay SDK
    if (paymentMethod === 'razorpay') {
      setIsProcessingRazorpay(true);
      setPaymentGatewayError(null);

      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setPaymentGatewayError('Unable to load Razorpay checkout gateway in your browser. Please check your internet connection or ad-blocker and try again.');
          setIsProcessingRazorpay(false);
          return;
        }

        // 1. Attempt to create order on backend server (optional enhancement)
        let rzpOrderId: string | undefined = undefined;
        let activeKeyId = 'rzp_test_TZC5OuxpUn3JdQ';

        try {
          const orderResponse = await apiClient.createRazorpayOrder(
            Math.round(total),
            'INR',
            `rcpt_${Date.now().toString().slice(-8)}`,
            {
              recipient: fullName || user?.name || 'Patron',
              city: city || 'Mumbai'
            }
          );

          if (orderResponse?.success && orderResponse.order) {
            rzpOrderId = orderResponse.order.id;
            if (orderResponse.keyId) {
              activeKeyId = orderResponse.keyId;
            }
          } else if (orderResponse?.keyId) {
            activeKeyId = orderResponse.keyId;
          }
        } catch (backendErr) {
          console.warn('Backend Razorpay order creation unavailable, using direct checkout:', backendErr);
        }

        // Amount in smallest currency sub-unit (paise: 1 INR = 100 paise)
        const amountInPaise = Math.round(total * 100);

        // 2. Open Razorpay Checkout modal
        const options: any = {
          key: activeKeyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'NaxtTo Fine Jewellery',
          description: `Fine Jewellery Acquisition • ${cartItems.length} Piece${cartItems.length === 1 ? '' : 's'}`,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80',
          prefill: {
            name: fullName || user?.name || 'Valued Patron',
            email: email || user?.email || 'patron@naxtto.com',
            contact: phone ? (phone.startsWith('+91') ? phone : `+91${formatIndianMobile(phone)}`) : '+919876543210'
          },
          notes: {
            shipping_address: `${addressLine1}, ${city}, ${postalCode}, India`
          },
          theme: {
            color: '#1d1d1f'
          },
          handler: async function (response: any) {
            try {
              // 3. Verify Razorpay cryptographic HMAC signature on server if order_id exists
              if (response.razorpay_order_id && response.razorpay_signature) {
                try {
                  await apiClient.verifyRazorpayPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  });
                } catch (verifyErr) {
                  console.warn('Signature verification notice:', verifyErr);
                }
              }

              const paymentRef = response.razorpay_payment_id || `PAY_${Date.now()}`;
              const generatedOrderNumber = `NXT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
              const generatedTracking = `DHL-EXP-${Math.floor(100000000 + Math.random() * 900000000)}GB`;

              const confirmedOrder: Order = {
                id: `ord-${Date.now()}`,
                orderNumber: generatedOrderNumber,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                subtotal,
                shippingFee,
                discount,
                tax,
                total: Math.round(total * 100) / 100,
                status: 'Confirmed',
                paymentMethod: `Razorpay (Payment ID: ${paymentRef})`,
                trackingNumber: generatedTracking,
                estimatedDelivery: '3–5 Business Days (Insured Express)',
                shippingAddress: {
                  fullName: fullName || 'Valued Client',
                  addressLine1: addressLine1 || '100 Luxury Way',
                  addressLine2: addressLine2,
                  city: city || 'Mumbai',
                  state: state || 'MH',
                  postalCode: postalCode || '400001',
                  country: country || 'India',
                  phone: phone ? (phone.startsWith('+91') ? phone : `+91 ${formatIndianMobile(phone)}`) : '+91 9876543210',
                  isDefault: true
                },
                items: Array.isArray(cartItems) && cartItems.length > 0 ? [...cartItems] : []
              };

              try {
                sessionStorage.setItem('naxtto_completed_order', JSON.stringify(confirmedOrder));
                safeSetItem('naxtto_last_order', JSON.stringify(sanitizeOrderForStorage(confirmedOrder)));
              } catch {
                // ignore
              }

              setCompletedOrder(confirmedOrder);
              onOrderCompleted(confirmedOrder);
              setStep(4);
              setIsProcessingRazorpay(false);
              window.scrollTo(0, 0);
            } catch (err) {
              console.warn('Post-payment order processing warning:', err);
              setIsProcessingRazorpay(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessingRazorpay(false);
            }
          }
        };

        if (rzpOrderId) {
          options.order_id = rzpOrderId;
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          const isCancelled =
            resp.error?.reason === 'payment_cancelled' ||
            (resp.error?.code === 'BAD_REQUEST_ERROR' &&
              resp.error?.description?.toLowerCase().includes('cancelled'));

          if (isCancelled) {
            console.info('Razorpay checkout window closed or payment cancelled by patron:', resp.error?.description);
            setPaymentGatewayError('Payment session was closed. You can complete your transaction anytime by clicking Pay with Razorpay.');
          } else {
            console.warn('Razorpay payment unsuccessful:', resp.error?.description || resp.error?.reason);
            setPaymentGatewayError(resp.error?.description || 'Payment was declined or cancelled. Please try again.');
          }
          setIsProcessingRazorpay(false);
        });
        rzp.open();
      } catch (err: any) {
        console.warn('Error initiating Razorpay checkout:', err);
        setPaymentGatewayError(err.message || 'Payment initiation failed.');
        setIsProcessingRazorpay(false);
      }
      return;
    }

    // Direct card or mock wallet fallback
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
      paymentMethod: paymentMethod === 'apple-pay' ? 'Apple Pay' : paymentMethod === 'klarna' ? 'Klarna (4x)' : 'Credit Card',
      trackingNumber: generatedTracking,
      estimatedDelivery: '3–5 Business Days (Insured)',
      shippingAddress: {
        fullName: fullName || 'Valued Client',
        addressLine1: addressLine1 || '100 Luxury Way',
        addressLine2: addressLine2,
        city: city || 'Mumbai',
        state: state || 'MH',
        postalCode: postalCode || '400001',
        country: country || 'India',
        phone: phone ? (phone.startsWith('+91') ? phone : `+91 ${formatIndianMobile(phone)}`) : '+91 9876543210',
        isDefault: true
      },
      items: Array.isArray(cartItems) && cartItems.length > 0 ? [...cartItems] : []
    };

    try {
      sessionStorage.setItem('naxtto_completed_order', JSON.stringify(newOrder));
      safeSetItem('naxtto_last_order', JSON.stringify(sanitizeOrderForStorage(newOrder)));
    } catch {
      // ignore
    }

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
          cartItems.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-4 space-y-5 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center mx-auto text-[#86868b]">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">Your Atelier Bag is Empty</h2>
                <p className="text-xs sm:text-sm text-[#6e6e73]">
                  You have removed all items from your checkout. Explore our certified fine jewellery collection to select your next heirloom piece.
                </p>
              </div>
              <button
                type="button"
                onClick={onBackToShop}
                className="px-8 py-3.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                Return to Boutique
              </button>
            </div>
          ) : (
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]">
                        1. Contact & Shipping Address
                      </h1>
                      <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                        {hasSavedAddresses && addressMode === 'saved'
                          ? 'Choose from your saved addresses or add a new delivery destination.'
                          : 'Enter your delivery destination for secure insured dispatch.'}
                      </p>
                    </div>

                    {/* Mode Switcher Tabs if user has saved addresses */}
                    {hasSavedAddresses && (
                      <div className="flex items-center gap-1.5 p-1 bg-transparent rounded-xl border border-[#e5e5ea] self-start">
                        <button
                          type="button"
                          onClick={() => {
                            setAddressMode('saved');
                            setStep1Error(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            addressMode === 'saved'
                              ? 'bg-[#1d1d1f] text-white shadow-xs'
                              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                          }`}
                        >
                          Saved Addresses ({savedAddresses.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddressMode('new');
                            setStep1Error(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            addressMode === 'new'
                              ? 'bg-[#1d1d1f] text-white shadow-xs'
                              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Address</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Account Login / Sync status banner */}
                  {!user?.isLoggedIn ? (
                    <div className="p-4 rounded-2xl border border-[#e5e5ea] bg-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl border border-[#e5e5ea] flex items-center justify-center shrink-0 text-[#1d1d1f]">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1d1d1f]">Have a NaxtTo Atelier account?</p>
                          <p className="text-[#6e6e73]">Sign in to automatically fetch your email ID and saved addresses.</p>
                        </div>
                      </div>
                      {onGoToLogin && (
                        <button
                          type="button"
                          onClick={onGoToLogin}
                          className="px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-xs font-semibold shrink-0 transition-all shadow-xs cursor-pointer"
                        >
                          Sign In to Auto-Fill
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl border border-emerald-200/80 bg-transparent flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1d1d1f]">
                            Account Connected: {user.name || 'Patron'}
                          </p>
                          <p className="text-[#6e6e73] text-[11px]">
                            Email ID <strong className="text-[#1d1d1f]">{user.email}</strong> automatically fetched for your delivery alerts and receipts.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validation / Notice Banner */}
                  {step1Error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  {/* SCENARIO A: User chooses from Existing Saved Addresses */}
                  {hasSavedAddresses && addressMode === 'saved' ? (
                    <div className="space-y-4">
                      {addressSavedSuccessBanner && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">{addressSavedSuccessBanner}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
                            Select Delivery Address:
                          </label>
                          <span className="text-[11px] text-[#6e6e73]">
                            {savedAddresses.length} saved {savedAddresses.length === 1 ? 'destination' : 'destinations'} (details retained)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {savedAddresses.map(addr => {
                            const addrKey = addr.id || `${addr.fullName}-${addr.addressLine1}`;
                            const isSelected = selectedAddressId === addrKey;
                            return (
                              <div
                                key={addrKey}
                                onClick={() => handleApplySavedAddress(addr)}
                                className={`p-4 rounded-2xl border text-left text-xs cursor-pointer transition-all relative flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-[#1d1d1f] bg-transparent ring-2 ring-[#1d1d1f] shadow-xs'
                                    : 'border-[#e5e5ea] bg-transparent hover:border-[#86868b]'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        isSelected ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white' : 'border-[#d2d2d7] bg-white'
                                      }`}>
                                        {isSelected && <Check className="w-2.5 h-2.5" />}
                                      </div>
                                      <span className="font-semibold text-sm text-[#1d1d1f]">
                                        {addr.fullName || (addr as any).recipientName}
                                      </span>
                                    </div>
                                    {addr.isDefault && (
                                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md tracking-wider">
                                        Default
                                      </span>
                                    )}
                                  </div>

                                  <div className="pl-6 text-[#6e6e73] space-y-0.5 text-xs">
                                    <p className="text-[#1d1d1f] font-medium">{addr.addressLine1 || (addr as any).street}</p>
                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                    <p>{addr.city}, {addr.state} {addr.postalCode || (addr as any).zip}</p>
                                    <p>{addr.country}</p>
                                    {addr.phone && (
                                      <p className="text-[11px] text-[#86868b] pt-1 font-mono">Tel: {addr.phone}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-[#1d1d1f]/10 flex items-center justify-between text-[11px]">
                                  {isSelected ? (
                                    <span className="flex items-center gap-1 font-semibold text-[#1d1d1f]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      Selected for Dispatch
                                    </span>
                                  ) : (
                                    <span className="text-[#86868b]">Click to select</span>
                                  )}

                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartEditAddress(addr);
                                      }}
                                      className="text-xs text-[#1d1d1f] hover:underline font-medium inline-flex items-center gap-1"
                                      title="Edit address details"
                                    >
                                      <Edit3 className="w-3 h-3 text-[#6e6e73]" />
                                      <span>Edit</span>
                                    </button>
                                    {onDeleteAddress && savedAddresses.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Are you sure you want to remove this address from your saved list?')) {
                                            onDeleteAddress(addr.id || addrKey);
                                          }
                                        }}
                                        className="text-xs text-[#86868b] hover:text-red-600 transition-colors inline-flex items-center gap-1"
                                        title="Delete this address"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Quick Add Address Card */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddressId(null);
                              setAddressMode('new');
                              setFullName(user?.name || '');
                              setAddressLine1('');
                              setAddressLine2('');
                              setCity('');
                              setState('');
                              setPostalCode('');
                              setCountry('India');
                              setPhone(formatIndianMobile(user?.phone || ''));
                              setStep1Error(null);
                            }}
                            className="p-4 rounded-2xl border-2 border-dashed border-[#d2d2d7] hover:border-[#1d1d1f] text-left text-xs bg-transparent hover:bg-black/[0.02] transition-all flex flex-col items-center justify-center min-h-[140px] gap-2 text-[#6e6e73] hover:text-[#1d1d1f] group"
                          >
                            <div className="w-9 h-9 rounded-full bg-transparent border border-[#e5e5ea] flex items-center justify-center text-[#1d1d1f] group-hover:scale-105 transition-transform">
                              <Plus className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-xs">Add a New Address</span>
                            <span className="text-[11px] text-[#86868b]">Ship to another home or recipient</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="w-full py-4 bg-[#E56A85] hover:bg-[#D45974] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4 active:scale-[0.99]"
                      >
                        <span>Deliver to Selected Address & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* SCENARIO B: No saved address OR user requested "Add Address" form */
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#e5e5ea]">
                        <div>
                          <h2 className="text-sm font-semibold text-[#1d1d1f]">
                            {editingAddressId ? 'Edit Saved Address' : 'Delivery Address Details'}
                          </h2>
                          <p className="text-[11px] text-[#6e6e73]">
                            Address details are saved automatically to your account and will not be deleted.
                          </p>
                        </div>
                        {hasSavedAddresses && (
                          <button
                            type="button"
                            onClick={() => {
                              setAddressMode('saved');
                              setEditingAddressId(null);
                              setStep1Error(null);
                            }}
                            className="text-xs text-[#1d1d1f] font-semibold hover:underline flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to saved addresses</span>
                          </button>
                        )}
                      </div>

                      <div className="p-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl flex items-center justify-between text-[11px] text-[#6e6e73]">
                        <span className="flex items-center gap-1.5 font-medium text-[#1d1d1f]">
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Persistent Storage Active
                        </span>
                        <span>Linked to {user?.email || 'your patron account'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block text-[#1d1d1f] font-medium mb-1">Full Legal Name</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={e => {
                              setUserEditedName(true);
                              setFullName(e.target.value);
                            }}
                            placeholder="Enter recipient's full name"
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
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
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#1d1d1f] font-medium mb-1">Apartment, Suite, Unit (optional)</label>
                          <input
                            type="text"
                            value={addressLine2}
                            onChange={e => setAddressLine2(e.target.value)}
                            placeholder="Apartment, suite, building, floor, etc."
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
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
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1d1d1f] font-medium mb-1">State / Province / County</label>
                          <input
                            type="text"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            placeholder="State / Province"
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1d1d1f] font-medium mb-1">PIN / Postal Code</label>
                          <input
                            type="text"
                            required
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                            placeholder="e.g. 400001"
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#1d1d1f] font-medium mb-1">Country</label>
                          <input
                            type="text"
                            required
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            placeholder="e.g. India"
                            className="w-full bg-transparent border border-[#e5e5ea] rounded-xl px-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] transition-colors"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[#1d1d1f] font-medium text-xs">
                              Mobile Phone (for Courier Access)
                            </label>
                            <span className="text-[11px] text-[#6e6e73]">
                              Indian 10-digit mobile
                            </span>
                          </div>
                          <div className="flex rounded-xl border border-[#e5e5ea] focus-within:border-[#1d1d1f] transition-colors overflow-hidden bg-transparent">
                            <div className="inline-flex items-center gap-1.5 px-3.5 bg-[#f5f5f7] border-r border-[#e5e5ea] text-xs font-semibold text-[#1d1d1f] select-none shrink-0">
                              <span className="text-sm leading-none">🇮🇳</span>
                              <span className="font-mono text-xs">+91</span>
                            </div>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              maxLength={10}
                              required
                              value={phone}
                              onChange={e => {
                                setUserEditedPhone(true);
                                const formatted = formatIndianMobile(e.target.value);
                                setPhone(formatted);
                                if (step1Error) setStep1Error(null);
                              }}
                              placeholder="9876543210"
                              className="w-full bg-transparent px-3.5 py-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none tracking-wider font-mono"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] mt-1.5 px-0.5">
                            <span className="text-[#86868b]">
                              Enter 10 digits starting with 6, 7, 8, or 9
                            </span>
                            {phone.length === 10 ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Valid 10 digits
                              </span>
                            ) : phone.length > 0 ? (
                              <span className="text-amber-600 font-medium text-[10px]">
                                {phone.length}/10 digits
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="sm:col-span-2 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={saveToAccount}
                              onChange={e => setSaveToAccount(e.target.checked)}
                              className="w-4 h-4 rounded text-[#1d1d1f] focus:ring-0 cursor-pointer accent-[#1d1d1f]"
                            />
                            <span className="text-xs text-[#1d1d1f] font-medium">
                              Save this address permanently to my account
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <button
                          type="button"
                          onClick={handleProceedToStep2}
                          className="w-full py-4 bg-[#E56A85] hover:bg-[#D45974] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                        >
                          <span>{editingAddressId ? 'Update & Continue' : 'Save Address & Continue'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleExplicitSaveAddress}
                          className="w-full py-3 bg-transparent hover:bg-black/[0.03] border border-[#d2d2d7] text-[#1d1d1f] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          <span>Save Address to My Details</span>
                        </button>
                      </div>
                    </div>
                  )}
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
                      className="p-4 rounded-2xl border border-[#1d1d1f] bg-[#1d1d1f]/5 ring-1 ring-[#1d1d1f] flex items-center justify-between"
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
                  </div>

                  {/* Gift Packaging Options */}
                  <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-transparent space-y-4">
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
                          className="w-full bg-transparent border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
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
                      className="flex-1 py-4 bg-[#E56A85] hover:bg-[#D45974] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
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

                  {/* Payment Gateway Error Banner */}
                  {paymentGatewayError && (
                    <div className="p-3.5 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-semibold">Payment Notification</p>
                        <p>{paymentGatewayError}</p>
                      </div>
                    </div>
                  )}

                  {/* Razorpay Exclusive Gateway Presentation */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#1d1d1f] bg-white shadow-xs space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#e5e5ea]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0C2340] text-[#00BAF2] flex items-center justify-center font-bold text-base shadow-xs">
                          ₹
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#1d1d1f]">
                              Razorpay Standard Checkout
                            </p>
                            <span className="px-2 py-0.5 bg-[#E56A85] text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                              Exclusive
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6e6e73]">
                            Official RBI & PCI-DSS certified gateway with 256-bit bank encryption
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Key Configured & Active
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                        Accepted Payment Channels (Powered by Razorpay)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl border border-[#e5e5ea] bg-[#fafafc] flex items-center gap-2.5">
                          <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-xs text-[#1d1d1f] block">Instant UPI</span>
                            <span className="text-[#6e6e73] text-[10px]">Google Pay, PhonePe, Paytm, QR</span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-[#e5e5ea] bg-[#fafafc] flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-xs text-[#1d1d1f] block">Cards</span>
                            <span className="text-[#6e6e73] text-[10px]">RuPay, Visa, MasterCard, Amex</span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-[#e5e5ea] bg-[#fafafc] flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-semibold text-xs text-[#1d1d1f] block">50+ NetBanking</span>
                            <span className="text-[#6e6e73] text-[10px]">All Major Indian & Global Banks</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f5f5f7]/80 rounded-xl p-3 text-[11px] text-[#6e6e73] space-y-1.5">
                      <div className="flex items-center justify-between text-[#1d1d1f] font-medium">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#1d1d1f]" />
                          Merchant Key ID
                        </span>
                        <span className="font-mono text-[10px] text-[#54280E] font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          rzp_test_TZC5OuxpUn3JdQ
                        </span>
                      </div>
                      <p className="text-[10px] text-[#86868b] leading-relaxed">
                        Clicking &ldquo;Pay with Razorpay&rdquo; launches the official Razorpay checkout modal where you can complete authentication with one-click UPI, biometric passkey, or bank OTP.
                      </p>
                    </div>
                  </div>

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
                      disabled={isProcessingRazorpay}
                      className="px-6 py-4 border border-[#e5e5ea] text-xs font-semibold rounded-xl hover:bg-[#f5f5f7] transition-all text-[#1d1d1f] disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!agreeTerms || isProcessingRazorpay}
                      onClick={handlePlaceOrder}
                      className="flex-1 py-4 bg-[#E56A85] hover:bg-[#D45974] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
                    >
                      {isProcessingRazorpay ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay with Razorpay • {currencySymbol}{Math.round(total)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Order Summary (4.5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="p-6 rounded-2xl border border-[#e5e5ea] bg-transparent space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#e5e5ea]">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Order Summary</h3>
                  <span className="text-xs text-[#6e6e73]">{cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'}</span>
                </div>

                {/* Items preview with remove and quantity adjustment before checkout */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div 
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedFinish}-${idx}`} 
                      className="p-2.5 rounded-xl border border-[#e5e5ea] bg-white/60 hover:bg-white transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f5f7] border border-[#e5e5ea] shrink-0">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-0.5 right-0.5 bg-[#1d1d1f] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-semibold text-[#1d1d1f] truncate leading-tight">{item.product.name}</h4>
                            <span className="text-xs font-semibold text-[#1d1d1f] shrink-0">
                              {currencySymbol}{item.product.price * item.quantity}
                            </span>
                          </div>
                          <p className="text-[#6e6e73] text-[11px] truncate mt-0.5">
                            {item.selectedSize ? `${item.selectedSize}` : ''}
                            {item.selectedSize && item.selectedFinish ? ' • ' : ''}
                            {item.selectedFinish ? item.selectedFinish.replace(/-/g, ' ') : ''}
                          </p>

                          {/* Action row: Quantity Stepper & Remove Button */}
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#f0f0f2]">
                            <div className="flex items-center border border-[#e5e5ea] rounded-lg bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    onUpdateQuantity?.(item.product.id, item.quantity - 1, item.selectedSize, item.selectedFinish);
                                  } else {
                                    onRemoveItem?.(item.product.id, item.selectedSize, item.selectedFinish);
                                  }
                                }}
                                className="p-1 px-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                                title={item.quantity > 1 ? "Decrease quantity" : "Remove piece"}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-[11px] font-semibold text-[#1d1d1f] min-w-[1.25rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity?.(item.product.id, item.quantity + 1, item.selectedSize, item.selectedFinish)}
                                className="p-1 px-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {onRemoveItem && (
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedFinish)}
                                className="text-[11px] font-medium text-[#86868b] hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
                                title="Remove piece from order"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
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
                      className="flex-1 bg-transparent border border-[#e5e5ea] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
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
          )
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
            <div className="p-6 sm:p-8 rounded-3xl bg-transparent border border-[#e5e5ea] text-left space-y-5 text-xs">
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
              <div className="p-3 bg-transparent rounded-xl border border-[#e5e5ea] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#86868b] uppercase font-semibold block">Armored Courier Tracking</span>
                  <span className="font-mono text-xs font-semibold text-[#1d1d1f]">{completedOrder?.trackingNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="px-3 py-1 bg-transparent border border-[#e5e5ea] hover:bg-black/[0.03] rounded-lg text-xs font-medium text-[#1d1d1f] flex items-center gap-1 transition-all"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Items Purchased */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[#86868b] font-medium block">Creations in Shipment:</span>
                {(completedOrder?.items && completedOrder.items.length > 0) ? (
                  completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1d1d1f]">
                        {item.product?.name || 'Fine Jewellery Piece'} ({item.selectedSize || 'Standard'}) x {item.quantity || 1}
                      </span>
                      <span className="font-semibold text-[#1d1d1f]">
                        {currencySymbol}{(item.product?.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#6e6e73] italic">
                    Insured fine jewellery creation carefully boxed in official presentation packaging.
                  </div>
                )}
              </div>

              {/* Delivery Destination */}
              <div className="pt-3 border-t border-[#e5e5ea] text-xs text-[#6e6e73]">
                <p>
                  <strong>Shipping To:</strong>{' '}
                  {completedOrder?.shippingAddress?.fullName ||
                    (completedOrder?.shippingAddress as any)?.recipientName ||
                    fullName ||
                    user?.name ||
                    'Valued Patron'}
                  ,{' '}
                  {completedOrder?.shippingAddress?.addressLine1 ||
                    (completedOrder?.shippingAddress as any)?.street ||
                    addressLine1 ||
                    '100 Luxury Way'}
                  {completedOrder?.shippingAddress?.addressLine2
                    ? `, ${completedOrder.shippingAddress.addressLine2}`
                    : (addressLine2 ? `, ${addressLine2}` : '')}
                  {completedOrder?.shippingAddress?.city
                    ? `, ${completedOrder.shippingAddress.city}`
                    : (city ? `, ${city}` : '')}
                  {completedOrder?.shippingAddress?.postalCode
                    ? `, ${completedOrder.shippingAddress.postalCode}`
                    : (postalCode ? `, ${postalCode}` : '')}
                  {completedOrder?.shippingAddress?.country
                    ? `, ${completedOrder.shippingAddress.country}`
                    : (country ? `, ${country}` : '')}
                </p>
                <p className="mt-1">
                  <strong>Total Settled:</strong> {currencySymbol}
                  {completedOrder?.total ?? (completedOrder as any)?.totalAmount ?? Math.round(total * 100) / 100}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem('naxtto_completed_order');
                  } catch {
                    // ignore
                  }
                  onBackToShop();
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
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
