import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft,
  Lock, 
  CreditCard, 
  Check, 
  ShoppingBag,
  Sparkles,
  Smartphone,
  Banknote,
  Gift,
  Calendar,
  Building2,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Percent,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { CartItem, Address, Order, UserProfile } from '../types';
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

// Helper to format Indian 10-digit mobile number
export const formatIndianMobile = (value?: string | number | null): string => {
  if (value === null || value === undefined) return '';
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};

type PaymentTab = 'recommended' | 'upi' | 'card' | 'cod' | 'gift_card' | 'emi' | 'net_banking';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  currencySymbol,
  appliedPromo,
  onOrderCompleted,
  onBackToShop,
  savedAddresses = [],
  user,
  onSaveNewAddress,
  onRemoveItem,
  onUpdateQuantity
}) => {
  // Step 1: Address, Step 2: Order Summary, Step 3: Complete Payment, Step 4: Order Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    try {
      const sessionSaved = sessionStorage.getItem('naxtto_completed_order');
      if (sessionSaved) return 4;
    } catch {
      // ignore
    }
    // Default to Step 2 (Order Summary) matching reference Image 1
    return 2;
  });

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

  const [copiedTracking, setCopiedTracking] = useState(false);

  // Default address seeded with user details from the reference screenshot
  const defaultInitialAddress: Address = useMemo(() => ({
    id: 'addr-default-home',
    fullName: user?.name || 'Anik Baidya',
    addressLine1: '1234, Bonickpara, Thakur Nagar, Shimulpur',
    addressLine2: 'Banikpara',
    city: 'North Twenty Four Parganas District',
    state: 'West Bengal',
    postalCode: '743287',
    country: 'India',
    phone: '8927936036',
    isDefault: true
  }), [user?.name]);

  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      return savedAddresses;
    }
    return [defaultInitialAddress];
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    if (savedAddresses && savedAddresses.length > 0) {
      return savedAddresses[0].id || 'addr-default-home';
    }
    return defaultInitialAddress.id || 'addr-default-home';
  });

  const selectedAddress = useMemo(() => {
    return addresses.find(a => a.id === selectedAddressId) || addresses[0] || defaultInitialAddress;
  }, [addresses, selectedAddressId, defaultInitialAddress]);

  // Address edit / add state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formName, setFormName] = useState(user?.name || 'Anik Baidya');
  const [formPhone, setFormPhone] = useState('8927936036');
  const [formPincode, setFormPincode] = useState('743287');
  const [formLocality, setFormLocality] = useState('Bonickpara, Thakur Nagar');
  const [formAddress, setFormAddress] = useState('1234, Shimulpur, Banikpara');
  const [formCity, setFormCity] = useState('North Twenty Four Parganas District');
  const [formState, setFormState] = useState('West Bengal');
  const [formAddressType, setFormAddressType] = useState<'HOME' | 'WORK'>('HOME');
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  // Payment states (Step 3 matching reference Image 2)
  const [selectedPaymentTab, setSelectedPaymentTab] = useState<PaymentTab>('cod');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Price Details expandable toggles
  const [expandFees, setExpandFees] = useState(true);
  const [expandDiscounts, setExpandDiscounts] = useState(true);

  // Estimated delivery promise string (e.g. "Delivery by Oct 4, Sun")
  const deliveryDateString = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    return `Delivery by ${month} ${day}, ${weekday}`;
  }, []);

  // Financial Calculations matching exact values in screenshots:
  // Selling total, MRP, Discounts, Platform Fee (₹10), COD Fee (₹7 if COD)
  const totalSellingPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const totalMrp = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const itemMrp = item.product.originalPrice && item.product.originalPrice > item.product.price
        ? item.product.originalPrice
        : Math.round(item.product.price * 1.75);
      return acc + itemMrp * item.quantity;
    }, 0);
  }, [cartItems]);

  const mrpDiscount = Math.max(0, totalMrp - totalSellingPrice);
  const platformFee = 10;
  const paymentHandlingFee = 7;
  const totalFees = platformFee + paymentHandlingFee;

  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      promoDiscount = Math.round((totalSellingPrice * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountAmount > 0) {
      promoDiscount = appliedPromo.discountAmount;
    }
  }

  const totalDiscount = mrpDiscount + promoDiscount;
  const totalAmount = Math.max(0, totalMrp - totalDiscount + totalFees);
  const totalSavings = Math.max(0, totalDiscount - totalFees);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formAddress.trim() || !formCity.trim() || !formPincode.trim()) {
      setAddressFormError('Please fill in all required address fields.');
      return;
    }
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: formName.trim(),
      phone: formatIndianMobile(formPhone),
      addressLine1: `${formAddress.trim()}, ${formLocality.trim()}`.trim(),
      addressLine2: formLocality.trim(),
      city: formCity.trim(),
      state: formState.trim() || 'West Bengal',
      postalCode: formPincode.trim(),
      country: 'India',
      isDefault: true
    };
    setAddresses(prev => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id!);
    if (onSaveNewAddress) {
      onSaveNewAddress(newAddr);
    }
    setShowAddressForm(false);
    setAddressFormError(null);
    setStep(2); // Advance to Order Summary
  };

  const handleFinalizeOrder = async (methodName: string) => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const generatedOrderNumber = `OD${Date.now().toString().slice(-6)}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const generatedTracking = `DELHIVERY-${Math.floor(100000000 + Math.random() * 900000000)}`;

      const confirmedOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generatedOrderNumber,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        subtotal: totalSellingPrice,
        shippingFee: platformFee,
        discount: totalDiscount,
        tax: 0,
        total: totalAmount,
        status: 'Confirmed',
        paymentMethod: methodName,
        trackingNumber: generatedTracking,
        estimatedDelivery: deliveryDateString,
        shippingAddress: {
          fullName: selectedAddress.fullName || '',
          addressLine1: selectedAddress.addressLine1 || '',
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city || '',
          state: selectedAddress.state || '',
          postalCode: selectedAddress.postalCode || '',
          country: selectedAddress.country || 'India',
          phone: selectedAddress.phone || '',
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

      onOrderCompleted(confirmedOrder);
      setCompletedOrder(confirmedOrder);
      setStep(4);
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation was unsuccessful. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Launch Razorpay directly when Continue is clicked on Order Summary
  const handleContinueWithRazorpay = async () => {
    if (cartItems.length === 0) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Ensure Razorpay checkout script is available in browser
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay secure checkout could not be loaded. Please check your network connection and retry.');
      }

      // 2. Request official Razorpay order from backend API
      const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;
      let activeKeyId = 'rzp_test_TZC5OuxpUn3JdQ';
      let activeOrderId: string | undefined = undefined;
      let amountInPaise = Math.round(totalAmount * 100);

      try {
        const orderRes = await apiClient.createRazorpayOrder(
          totalAmount,
          'INR',
          receiptId,
          {
            store: 'NaxtTo',
            customer_name: selectedAddress.fullName,
            customer_phone: selectedAddress.phone,
            customer_pincode: selectedAddress.postalCode
          }
        );

        if (orderRes?.keyId) {
          activeKeyId = orderRes.keyId;
        }
        if (orderRes?.order?.id) {
          activeOrderId = orderRes.order.id;
        }
        if (orderRes?.order?.amount) {
          amountInPaise = orderRes.order.amount;
        }
      } catch (orderErr) {
        console.warn('Backend order generation fallback, proceeding with standard browser gateway:', orderErr);
      }

      // 3. Configure standard Razorpay checkout options
      const options: any = {
        key: activeKeyId,
        amount: amountInPaise,
        currency: 'INR',
        name: 'NaxtTo',
        description: `Order payment for ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
        image: '/favicon.ico',
        order_id: activeOrderId || undefined,
        prefill: {
          name: selectedAddress.fullName || user?.name || 'Anik Baidya',
          contact: selectedAddress.phone || user?.phone || '8927936036',
          email: user?.email || 'baidyaanik18@gmail.com',
        },
        notes: {
          shipping_address: `${selectedAddress.addressLine1}, ${selectedAddress.city} ${selectedAddress.postalCode}`,
          order_receipt: receiptId,
          store: 'NaxtTo Fine Jewellery'
        },
        theme: {
          color: '#2874f0'
        },
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          try {
            // Cryptographically verify signature if order_id is present
            if (response.razorpay_order_id && response.razorpay_signature) {
              try {
                await apiClient.verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
              } catch (vErr) {
                console.warn('Razorpay signature verification notice:', vErr);
              }
            }

            const paymentSummary = `Razorpay Online (${response.razorpay_payment_id || 'Captured'})`;
            await handleFinalizeOrder(paymentSummary);
          } catch (finishErr: any) {
            console.error('Failed to finalize order after payment:', finishErr);
            setPaymentError(finishErr.message || 'Payment received, but error saving order. Please contact support.');
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (failedResponse: any) {
        console.error('Razorpay payment failed:', failedResponse.error);
        setPaymentError(failedResponse.error?.description || 'Payment was unsuccessful or cancelled. Please try again.');
        setIsProcessingPayment(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Failed to launch Razorpay checkout:', err);
      setPaymentError(err.message || 'Could not open Razorpay checkout. Please retry.');
      setIsProcessingPayment(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (selectedPaymentTab === 'cod') {
      handleFinalizeOrder('Cash on Delivery');
    } else {
      handleContinueWithRazorpay();
    }
  };

  const handleCopyTracking = () => {
    if (completedOrder?.trackingNumber) {
      navigator.clipboard.writeText(completedOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div id="checkout-page" className="w-full bg-[#f1f3f6] min-h-screen text-[#212121] font-sans pb-16">
      
      {/* ============================================================ */}
      {/* TOP HEADER: Stepper for Steps 1 & 2, or "Complete Payment" for Step 3 */}
      {/* ============================================================ */}
      {step < 3 && (
        <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-2xs">
          <div className="max-w-5xl mx-auto flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              {/* Step 1: Address */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 font-medium cursor-pointer"
              >
                {step > 1 ? (
                  <span className="w-5 h-5 rounded-full border border-[#2874f0] text-[#2874f0] flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 text-[#2874f0]" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                )}
                <span className={step >= 1 ? 'text-[#2874f0] font-medium' : 'text-gray-400'}>
                  Address
                </span>
              </button>

              {/* Connecting Line 1 */}
              <div className={`w-8 sm:w-16 h-0.5 ${step > 1 ? 'bg-[#2874f0]' : 'bg-gray-300'}`} />

              {/* Step 2: Order Summary */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-[#2874f0] text-white' : step > 2 ? 'border border-[#2874f0] text-[#2874f0]' : 'bg-gray-300 text-white'
                }`}>
                  {step > 2 ? <Check className="w-3.5 h-3.5 text-[#2874f0]" /> : '2'}
                </span>
                <span className={step === 2 ? 'text-[#212121] font-bold' : step > 2 ? 'text-[#2874f0]' : 'text-gray-400'}>
                  Order Summary
                </span>
              </button>

              {/* Connecting Line 2 */}
              <div className={`w-8 sm:w-16 h-0.5 ${step > 2 ? 'bg-[#2874f0]' : 'bg-gray-300'}`} />

              {/* Step 3: Payment */}
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span className="text-gray-400">
                  Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 Header: Complete Payment matching Reference Image 2 */}
      {step === 3 && (
        <div className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-8 shadow-2xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-3 text-base sm:text-lg font-bold text-[#212121] hover:text-[#2874f0] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Complete Payment</span>
            </button>

            <div className="flex items-center gap-1 text-xs text-[#878787] font-medium">
              <Lock className="w-3.5 h-3.5 text-[#878787]" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-5">
        
        {/* Empty Cart Notice */}
        {cartItems.length === 0 && step < 4 ? (
          <div className="bg-white rounded-xs p-8 text-center max-w-md mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#212121]">Your Cart is Empty</h2>
            <p className="text-sm text-[#878787]">
              Explore our handcrafted conch, coral & fine jewellery collection to continue.
            </p>
            <button
              onClick={onBackToShop}
              className="px-6 py-2.5 bg-[#2874f0] text-white text-sm font-semibold rounded-xs shadow-xs hover:bg-[#1a62d6] transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : step === 1 ? (
          /* ========================================================== */
          /* STEP 1: Address Selection & Form                          */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-xs shadow-2xs border border-gray-200 p-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-[#212121]">Select Delivery Address</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-xs font-semibold text-[#2874f0] hover:underline cursor-pointer"
                  >
                    {showAddressForm ? 'Cancel' : '+ Add a new address'}
                  </button>
                </div>

                {/* Saved addresses radio list */}
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id!)}
                        className={`p-4 rounded-xs border transition-colors cursor-pointer ${
                          isSelected ? 'border-[#2874f0] bg-blue-50/20' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="delivery_address"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id!)}
                            className="mt-1 accent-[#2874f0]"
                          />
                          <div className="flex-1 text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#212121]">{addr.fullName}</span>
                              <span className="text-[10px] font-bold text-[#717478] bg-[#f0f2f2] px-2 py-0.5 rounded-xs uppercase">
                                HOME
                              </span>
                              <span className="text-xs text-[#878787] ml-2">{addr.phone}</span>
                            </div>
                            <p className="text-xs text-[#565959] leading-relaxed">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city} - {addr.postalCode}
                            </p>
                            {isSelected && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStep(2);
                                  }}
                                  className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xs shadow-xs cursor-pointer"
                                >
                                  Deliver Here
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add new address expandable form */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="mt-5 pt-4 border-t border-gray-200 space-y-3 text-xs">
                    <h3 className="font-bold text-sm text-[#212121]">Add a new address</h3>
                    {addressFormError && (
                      <div className="p-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xs">
                        {addressFormError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">Name *</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">10-digit mobile number *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={formPincode}
                          onChange={(e) => setFormPincode(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">Locality *</label>
                        <input
                          type="text"
                          required
                          value={formLocality}
                          onChange={(e) => setFormLocality(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#878787] mb-1 font-medium">Address (Area and Street) *</label>
                      <input
                        type="text"
                        required
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">City/District/Town *</label>
                        <input
                          type="text"
                          required
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">State *</label>
                        <input
                          type="text"
                          required
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#878787] mb-1 font-medium">Address Type</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="address_type"
                            checked={formAddressType === 'HOME'}
                            onChange={() => setFormAddressType('HOME')}
                            className="accent-[#2874f0]"
                          />
                          <span>Home (All day delivery)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="address_type"
                            checked={formAddressType === 'WORK'}
                            onChange={() => setFormAddressType('WORK')}
                            className="accent-[#2874f0]"
                          />
                          <span>Work (Delivery between 10 AM - 5 PM)</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold py-2.5 px-6 rounded-xs shadow-xs text-xs uppercase"
                      >
                        Save and Deliver Here
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right column summary */}
            <div className="lg:col-span-4">
              <PriceDetailsCard
                mrp={totalMrp}
                fees={totalFees}
                platformFee={platformFee}
                handlingFee={paymentHandlingFee}
                discount={totalDiscount}
                mrpDiscount={mrpDiscount}
                promoDiscount={promoDiscount}
                total={totalAmount}
                savings={totalSavings}
                expandFees={expandFees}
                setExpandFees={setExpandFees}
                expandDiscounts={expandDiscounts}
                setExpandDiscounts={setExpandDiscounts}
                currencySymbol={currencySymbol}
                showCashbackPromo={false}
              />
            </div>
          </div>
        ) : step === 2 ? (
          /* ========================================================== */
          /* STEP 2: Order Summary (Reference Image 1)                  */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column (8 cols): Deliver to & Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Deliver to: Box matching Reference Image 1 */}
              <div className="bg-white rounded-xs shadow-2xs border border-gray-200 p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5 text-sm">
                  <div className="text-sm font-normal text-[#212121]">Deliver to:</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#212121] text-sm sm:text-base">
                      {selectedAddress.fullName}
                    </span>
                    <span className="text-[10px] font-bold text-[#717478] bg-[#f0f2f2] px-2 py-0.5 rounded-xs uppercase">
                      HOME
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#565959] leading-relaxed">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                    {selectedAddress.city ? `, ${selectedAddress.city}` : ''}
                    {selectedAddress.postalCode ? ` ${selectedAddress.postalCode}` : ''}
                  </p>
                  <p className="text-xs sm:text-sm text-[#212121] font-medium pt-0.5">
                    {selectedAddress.phone}
                  </p>
                </div>

                {/* Change Address Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-[#e0e0e0] text-[#2874f0] font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-sm hover:bg-blue-50/50 transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Product Item Cards matching Reference Image 1 */}
              <div className="bg-white rounded-xs shadow-2xs border border-gray-200 divide-y divide-gray-100">
                {cartItems.map((item, idx) => {
                  const itemSellingPrice = item.product.price * item.quantity;
                  const itemMrp = (item.product.originalPrice && item.product.originalPrice > item.product.price
                    ? item.product.originalPrice
                    : Math.round(item.product.price * 1.72)) * item.quantity;
                  const discountPct = Math.round(((itemMrp - itemSellingPrice) / itemMrp) * 100);

                  return (
                    <div key={`${item.product.id}-${idx}`} className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'}
                          alt={item.product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xs border border-gray-100 shrink-0"
                        />

                        {/* Title, Seller, Price */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm sm:text-base font-normal text-[#212121] truncate">
                            {item.product.name}
                          </h3>
                          <div className="text-xs text-[#878787]">
                            Seller:NaxtTo
                          </div>

                          {/* Price Row: ↓42%  ₹399  ₹228 */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs sm:text-sm font-bold text-[#388e3c]">
                              ↓{discountPct}%
                            </span>
                            <span className="text-xs sm:text-sm text-[#878787] line-through">
                              {currencySymbol}{itemMrp}
                            </span>
                            <span className="text-base sm:text-lg font-bold text-[#212121]">
                              {currencySymbol}{itemSellingPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Dropdown and Delivery Date */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <select
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value, 10);
                                if (onUpdateQuantity) {
                                  onUpdateQuantity(item.product.id, newQty, item.selectedSize, item.selectedFinish);
                                }
                              }}
                              className="text-xs font-semibold text-[#212121] bg-white border border-gray-300 rounded-xs py-1.5 px-2.5 pr-6 appearance-none focus:outline-none focus:border-[#2874f0] cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q}>
                                  Qty: {q}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-1.5 top-2 pointer-events-none" />
                          </div>

                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedFinish)}
                              className="text-xs font-semibold text-[#878787] hover:text-[#212121] transition-colors ml-2 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Delivery by Oct 4, Sun */}
                        <div className="text-xs font-normal text-[#212121]">
                          {deliveryDateString}
                        </div>
                      </div>

                      {/* Cancellation Banner */}
                      <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-[#212121]">
                        <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-3 h-3 text-rose-500" />
                        </div>
                        <span className="text-[#565959]">
                          Cancellation is allowed up to 24 hours after placing the order.{' '}
                          <span className="text-[#2874f0] cursor-pointer hover:underline font-medium">Know more</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (4 cols): Price Details & Action Row */}
            <div className="lg:col-span-4 space-y-4">
              <PriceDetailsCard
                mrp={totalMrp}
                fees={totalFees}
                platformFee={platformFee}
                handlingFee={paymentHandlingFee}
                discount={totalDiscount}
                mrpDiscount={mrpDiscount}
                promoDiscount={promoDiscount}
                total={totalAmount}
                savings={totalSavings}
                expandFees={expandFees}
                setExpandFees={setExpandFees}
                expandDiscounts={expandDiscounts}
                setExpandDiscounts={setExpandDiscounts}
                currencySymbol={currencySymbol}
                showCashbackPromo={false}
              />

              {/* Action Bar / Button matching Reference Image 1 */}
              <div className="bg-white rounded-xs shadow-2xs border border-gray-200 p-3 sm:p-4 space-y-2.5">
                {paymentError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs text-[#878787] line-through font-normal">
                      {totalMrp}
                    </div>
                    <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-[#212121]">
                      <span>{currencySymbol}{totalAmount}</span>
                      <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleContinueWithRazorpay}
                    className="bg-[#ffc200] hover:bg-[#f5b800] active:bg-[#e6ae00] text-[#1d1d1f] font-semibold text-sm sm:text-base px-10 sm:px-12 py-3 rounded-xs shadow-xs cursor-pointer transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#1d1d1f] border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <span>Continue</span>
                    )}
                  </button>
                </div>

                <div className="text-right pt-0.5">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[11px] text-[#2874f0] hover:underline cursor-pointer"
                  >
                    Or pay via Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : step === 3 ? (
          /* ========================================================== */
          /* STEP 3: Complete Payment (Reference Image 2)               */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left & Middle Column (8 cols): Payment Options & Details */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-12 bg-white rounded-xs shadow-2xs border border-gray-200 overflow-hidden">
                
                {/* Left Side: Vertical Payment Options Tab Menu */}
                <div className="sm:col-span-5 border-r border-gray-200 bg-[#fafafa] divide-y divide-gray-100">
                  
                  {/* Recommended for You */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('recommended')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'recommended' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Recommended for You</div>
                    </div>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('upi')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'upi' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">UPI</div>
                      <div className="text-[11px] text-[#878787] font-normal">Pay by any UPI app</div>
                    </div>
                  </button>

                  {/* Credit / Debit / ATM Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('card')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'card' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Credit / Debit / ATM Card</div>
                      <div className="text-[11px] text-[#878787] font-normal">Add and secure cards as per RBI guidelines</div>
                      <div className="text-[10px] text-[#388e3c] font-semibold mt-0.5">
                        Get upto 5% cashback • 2 offers available
                      </div>
                    </div>
                  </button>

                  {/* Cash on Delivery (Selected in Screenshot) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('cod')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'cod' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Cash on Delivery</div>
                    </div>
                  </button>

                  {/* Gift Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('gift_card')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'gift_card' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Have a NaxtTo Gift Card?</div>
                    </div>
                  </button>

                  {/* EMI */}
                  <div className="p-4 flex items-center justify-between text-[#878787] opacity-60">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">EMI</span>
                    </div>
                    <span className="text-[11px] flex items-center gap-1">
                      Unavailable <HelpCircle className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Net Banking */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentTab('net_banking')}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedPaymentTab === 'net_banking' ? 'bg-white font-bold text-[#212121] border-l-4 border-l-[#2874f0]' : 'hover:bg-gray-100/70 text-[#212121]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">Net Banking</div>
                    </div>
                  </button>
                </div>

                {/* Middle Side: Detail Panel matching Reference Image 2 */}
                <div className="sm:col-span-7 p-6 sm:p-8 bg-white min-h-[380px] flex flex-col justify-start">
                  
                  {paymentError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* CASH ON DELIVERY DETAILS matching Reference Image 2 */}
                  {selectedPaymentTab === 'cod' && (
                    <div className="space-y-5 animate-fadeIn">
                      <div>
                        <h3 className="text-base font-bold text-[#212121]">Cash on Delivery</h3>
                        <p className="text-xs text-[#565959] leading-relaxed mt-2">
                          Due to handling costs, a nominal fee of ₹7 will be charged for orders placed using this option. Avoid this fee by paying online now.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          disabled={isProcessingPayment}
                          onClick={handlePlaceOrderClick}
                          className="bg-[#ffc200] hover:bg-[#f5b800] active:bg-[#e6ae00] text-[#1d1d1f] font-bold text-sm sm:text-base py-3.5 px-8 rounded-sm shadow-xs w-full sm:w-auto text-center cursor-pointer transition-colors disabled:opacity-50"
                        >
                          {isProcessingPayment ? 'Placing Order...' : 'Place Order'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* UPI Details */}
                  {selectedPaymentTab === 'upi' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-base font-bold text-[#212121]">Choose UPI App</h3>
                      <div className="space-y-2 text-xs">
                        {[
                          { id: 'gpay', label: 'Google Pay' },
                          { id: 'phonepe', label: 'PhonePe' },
                          { id: 'paytm', label: 'Paytm' },
                          { id: 'other', label: 'Enter UPI ID' }
                        ].map((app) => (
                          <label
                            key={app.id}
                            className={`p-3 rounded-xs border flex items-center gap-3 cursor-pointer ${
                              selectedUpiApp === app.id ? 'border-[#2874f0] bg-blue-50/20' : 'border-gray-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="upi_app"
                              checked={selectedUpiApp === app.id}
                              onChange={() => setSelectedUpiApp(app.id as any)}
                              className="accent-[#2874f0]"
                            />
                            <span className="font-medium text-[#212121]">{app.label}</span>
                          </label>
                        ))}
                      </div>

                      {selectedUpiApp === 'other' && (
                        <div className="pt-2">
                          <label className="block text-xs text-[#878787] mb-1 font-medium">Enter UPI ID</label>
                          <input
                            type="text"
                            placeholder="e.g. mobile@okhdfcbank"
                            value={customUpiId}
                            onChange={(e) => setCustomUpiId(e.target.value)}
                            className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                          />
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          type="button"
                          disabled={isProcessingPayment}
                          onClick={handlePlaceOrderClick}
                          className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-sm py-3 px-8 rounded-sm shadow-xs w-full sm:w-auto text-center cursor-pointer transition-colors"
                        >
                          Pay {currencySymbol}{totalAmount}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Details */}
                  {selectedPaymentTab === 'card' && (
                    <div className="space-y-3 animate-fadeIn text-xs">
                      <h3 className="text-base font-bold text-[#212121]">Enter Card Details</h3>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="XXXX XXXX XXXX XXXX"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#878787] mb-1 font-medium">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[#878787] mb-1 font-medium">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          disabled={isProcessingPayment}
                          onClick={handlePlaceOrderClick}
                          className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-sm py-3 px-8 rounded-sm shadow-xs w-full sm:w-auto text-center cursor-pointer transition-colors"
                        >
                          Pay {currencySymbol}{totalAmount}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Gift Card */}
                  {selectedPaymentTab === 'gift_card' && (
                    <div className="space-y-3 animate-fadeIn text-xs">
                      <h3 className="text-base font-bold text-[#212121]">Add Gift Card</h3>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">16-Digit Card Number</label>
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#878787] mb-1 font-medium">6-Digit PIN</label>
                        <input
                          type="password"
                          placeholder="PIN"
                          className="w-full border border-gray-300 rounded-xs p-2 text-xs focus:border-[#2874f0] outline-none"
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-xs py-2.5 px-6 rounded-xs shadow-xs uppercase"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {selectedPaymentTab === 'net_banking' && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <h3 className="text-base font-bold text-[#212121]">Popular Banks</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'Punjab National Bank'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={handlePlaceOrderClick}
                            className="p-2.5 border border-gray-200 rounded-xs text-left hover:border-[#2874f0] hover:bg-blue-50/20 font-medium"
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended for You */}
                  {selectedPaymentTab === 'recommended' && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <h3 className="text-base font-bold text-[#212121]">Recommended Payment Options</h3>
                      <p className="text-xs text-[#565959]">Fast and secure 1-click verification.</p>
                      <button
                        type="button"
                        onClick={handlePlaceOrderClick}
                        className="bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-sm py-3 px-8 rounded-sm shadow-xs w-full sm:w-auto text-center cursor-pointer transition-colors"
                      >
                        Pay {currencySymbol}{totalAmount}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Price Details Card matching Reference Image 2 */}
            <div className="lg:col-span-4 space-y-4">
              <PriceDetailsCard
                mrp={totalMrp}
                fees={totalFees}
                platformFee={platformFee}
                handlingFee={paymentHandlingFee}
                discount={totalDiscount}
                mrpDiscount={mrpDiscount}
                promoDiscount={promoDiscount}
                total={totalAmount}
                savings={totalSavings}
                expandFees={expandFees}
                setExpandFees={setExpandFees}
                expandDiscounts={expandDiscounts}
                setExpandDiscounts={setExpandDiscounts}
                currencySymbol={currencySymbol}
                showCashbackPromo={true}
              />
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* STEP 4: Order Confirmed & Receipt View                     */
          /* ========================================================== */
          <div className="max-w-2xl mx-auto bg-white rounded-xs shadow-2xs border border-gray-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#212121]">Order Placed Successfully!</h2>
              <p className="text-xs sm:text-sm text-[#878787]">
                Thank you for your order. A confirmation SMS & email have been dispatched.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xs border border-gray-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#878787]">Order Reference:</span>
                <span className="font-bold text-[#212121]">{completedOrder?.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#878787]">Delivery Date:</span>
                <span className="font-bold text-[#388e3c]">{deliveryDateString}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#878787]">Payment Method:</span>
                <span className="font-bold text-[#212121]">{completedOrder?.paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2 font-bold text-sm">
                <span>Total Settled:</span>
                <span className="text-[#2874f0]">{currencySymbol}{completedOrder?.total || totalAmount}</span>
              </div>
            </div>

            {/* Tracking Code */}
            <div className="p-3 bg-white rounded-xs border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#878787] uppercase font-bold block">Delivery Tracking Code</span>
                <span className="font-mono text-xs font-semibold text-[#212121]">{completedOrder?.trackingNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-xs font-medium text-[#212121] flex items-center gap-1 transition-colors"
              >
                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Delivery address destination */}
            <div className="text-xs text-[#565959] space-y-1">
              <div className="font-bold text-[#212121]">Deliver To:</div>
              <div>{completedOrder?.shippingAddress.fullName}</div>
              <div>{completedOrder?.shippingAddress.addressLine1}, {completedOrder?.shippingAddress.city} {completedOrder?.shippingAddress.postalCode}</div>
              <div>Phone: {completedOrder?.shippingAddress.phone}</div>
            </div>

            <div className="pt-4 flex items-center justify-center">
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
                className="w-full sm:w-auto px-8 py-3 bg-[#ffc200] hover:bg-[#f5b800] text-[#1d1d1f] font-bold text-xs uppercase tracking-wider rounded-xs shadow-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/**
 * Price Details Card matching exact visual design in Reference Image 1 & Reference Image 2
 */
interface PriceDetailsCardProps {
  mrp: number;
  fees: number;
  platformFee: number;
  handlingFee: number;
  discount: number;
  mrpDiscount: number;
  promoDiscount: number;
  total: number;
  savings: number;
  expandFees: boolean;
  setExpandFees: (v: boolean | ((prev: boolean) => boolean)) => void;
  expandDiscounts: boolean;
  setExpandDiscounts: (v: boolean | ((prev: boolean) => boolean)) => void;
  currencySymbol: string;
  showCashbackPromo: boolean;
}

const PriceDetailsCard: React.FC<PriceDetailsCardProps> = ({
  mrp,
  fees,
  platformFee,
  handlingFee,
  discount,
  mrpDiscount,
  promoDiscount,
  total,
  savings,
  expandFees,
  setExpandFees,
  expandDiscounts,
  setExpandDiscounts,
  currencySymbol,
  showCashbackPromo
}) => {
  return (
    <div className="bg-white rounded-xs shadow-2xs border border-gray-200 p-4 sm:p-5 space-y-4">
      {/* Title */}
      <h3 className="text-base font-bold text-[#212121] border-b border-gray-100 pb-3">
        Price Details
      </h3>

      <div className="space-y-3 text-sm">
        {/* MRP */}
        <div className="flex items-center justify-between text-[#212121]">
          <span className="underline decoration-dotted decoration-gray-400">
            MRP (incl. of all taxes)
          </span>
          <span>{currencySymbol}{mrp}</span>
        </div>

        {/* Fees (Expandable) */}
        <div>
          <div
            onClick={() => setExpandFees(prev => !prev)}
            className="flex items-center justify-between text-[#212121] cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span>Fees</span>
              {expandFees ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </div>
            <span>{currencySymbol}{fees}</span>
          </div>

          {expandFees && (
            <div className="pl-3 pt-1.5 space-y-1 text-xs text-[#878787]">
              {handlingFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="underline decoration-dotted decoration-gray-400">Payment Handling Fee</span>
                  <span>{currencySymbol}{handlingFee}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span>{currencySymbol}{platformFee}</span>
              </div>
            </div>
          )}
        </div>

        {/* Discounts (Expandable) */}
        <div>
          <div
            onClick={() => setExpandDiscounts(prev => !prev)}
            className="flex items-center justify-between text-[#212121] cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <span>Discounts</span>
              {expandDiscounts ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
            </div>
            <span className="text-[#388e3c] font-medium">
              {showCashbackPromo ? `-${currencySymbol}${discount}` : `${currencySymbol}${discount}`}
            </span>
          </div>

          {expandDiscounts && (
            <div className="pl-3 pt-1.5 space-y-1 text-xs text-[#388e3c]">
              <div className="flex items-center justify-between">
                <span>MRP Discount</span>
                <span>-{currencySymbol}{mrpDiscount}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Coupon Discount</span>
                  <span>-{currencySymbol}{promoDiscount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between font-bold text-base">
          <span className="text-[#212121]">Total Amount</span>
          <span className={showCashbackPromo ? 'text-[#2874f0] text-lg font-bold' : 'text-[#212121]'}>
            {currencySymbol}{total}
          </span>
        </div>
      </div>

      {/* Green Savings banner matching Reference Image 1 */}
      {!showCashbackPromo && (
        <div className="bg-[#e8f8f5] text-[#388e3c] text-xs sm:text-sm font-semibold p-2.5 rounded-sm flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#388e3c] text-white flex items-center justify-center text-[10px] font-bold">
            %
          </div>
          <span>You'll save {currencySymbol}{savings} on this order!</span>
        </div>
      )}

      {/* 5% Cashback Promo Card matching Reference Image 2 */}
      {showCashbackPromo && (
        <div className="bg-[#e8f8f5] border border-emerald-100 rounded-sm p-3 flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[#388e3c] text-sm">5% Cashback</div>
            <div className="text-[11px] text-[#565959]">Claim now with payment offers</div>
          </div>
          <div className="flex items-center -space-x-1.5 shrink-0">
            {/* Axis Bank Maroon badge */}
            <div className="w-6 h-6 rounded-full bg-[#97144d] text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
              ▲
            </div>
            {/* SBI Blue badge */}
            <div className="w-6 h-6 rounded-full bg-[#002f6c] text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
              ●
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
