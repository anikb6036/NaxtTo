import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  CreditCard, 
  Phone, 
  ExternalLink,
  Loader2,
  Clock
} from 'lucide-react';
import { Order, UserProfile } from '../types';
import { generateOrderInvoicePDF } from '../utils/invoiceGenerator';

export interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  user?: Partial<UserProfile> | null;
  currencySymbol?: string;
  onProductClick?: (productId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  user,
  currencySymbol = '£',
  onProductClick
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyTracking = () => {
    if (!order.trackingNumber) return;
    try {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadInvoice = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);
    try {
      await generateOrderInvoicePDF({
        order,
        user,
        currencySymbol
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Invoice PDF error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e5e5ea] overflow-hidden flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#e5e5ea] flex items-center justify-between bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b]">
                Atelier Consignment Details
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                isDelivered
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isCancelled
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}>
                {isDelivered && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                <span>{order.status}</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] font-mono">
              {order.orderNumber || order.id}
            </h2>
            <p className="text-xs text-[#6e6e73]">
              Placed on {order.date} • {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'creation' : 'creations'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#1d1d1f]">

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tax Invoice PDF successfully downloaded to your downloads folder.</span>
            </div>
          )}

          {/* 1. Purchased Products List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#c5a059]" />
                <span>Purchased Creations ({order.items?.length || 0})</span>
              </h3>
              <span className="text-xs text-[#86868b]">All prices in {currencySymbol}</span>
            </div>

            <div className="divide-y divide-[#f0f0f2] border border-[#e5e5ea] rounded-2xl overflow-hidden bg-white">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  const unitPrice = item.product?.price || 0;
                  const qty = item.quantity || 1;
                  const lineTotal = unitPrice * qty;
                  const imageUrl = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80';

                  return (
                    <div 
                      key={index} 
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#fafafc] transition-colors"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <img 
                          src={imageUrl} 
                          alt={item.product?.name || 'Jewellery piece'} 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#e5e5ea] shrink-0 bg-[#fbfbfd]"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 
                            className="font-bold text-sm text-[#1d1d1f] hover:text-[#0071e3] transition-colors line-clamp-2 cursor-pointer"
                            onClick={() => onProductClick && item.product?.id && onProductClick(item.product.id)}
                          >
                            {item.product?.name || 'Handcrafted Haute Joaillerie Piece'}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#555] font-medium">
                              <Sparkles className="w-3 h-3 text-[#c5a059]" />
                              <span>{item.selectedFinish ? item.selectedFinish.replace(/-/g, ' ') : '18K Solid Yellow Gold'}</span>
                            </span>

                            {item.selectedSize && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f5f5f7] text-[#555] font-medium">
                                Size: {item.selectedSize}
                              </span>
                            )}

                            <span className="text-[11px] text-[#86868b]">
                              SKU: NXT-{item.product?.id?.slice(0, 6).toUpperCase() || 'BESPOKE'}
                            </span>
                          </div>

                          <p className="text-xs text-[#6e6e73] pt-0.5">
                            Unit Price: <strong className="text-[#1d1d1f] font-semibold">{currencySymbol}{unitPrice.toLocaleString()}</strong> × {qty} {qty === 1 ? 'unit' : 'units'}
                          </p>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="sm:text-right shrink-0 self-end sm:self-center">
                        <span className="block text-xs text-[#86868b] uppercase tracking-wider font-medium">Item Total</span>
                        <span className="text-base sm:text-lg font-bold text-[#1d1d1f]">
                          {currencySymbol}{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#86868b]">
                  Bespoke commission line items registered in atelier archive.
                </div>
              )}
            </div>
          </div>

          {/* 2. Shipping & Delivery Details */}
          <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-[#fafafc] space-y-4">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0071e3]" />
              <span>Consignment Shipping & Destination Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Recipient & Destination Address */}
              <div className="p-4 bg-white rounded-xl border border-[#e5e5ea] space-y-2">
                <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <p className="font-bold text-sm text-[#1d1d1f]">
                  {order.shippingAddress?.fullName || user?.name || 'Valued Patron'}
                </p>
                <div className="text-[#555] space-y-0.5 leading-relaxed">
                  <p>{order.shippingAddress?.addressLine1 || 'Atelier Vault Priority Destination'}</p>
                  {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress?.city || 'Mumbai'}, {order.shippingAddress?.state || 'Maharashtra'} {order.shippingAddress?.postalCode || '400001'}
                  </p>
                  <p className="font-semibold text-[#1d1d1f]">{order.shippingAddress?.country || 'India'}</p>
                </div>
                {order.shippingAddress?.phone && (
                  <p className="text-xs text-[#6e6e73] pt-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#86868b]" />
                    <span>Contact: {order.shippingAddress.phone}</span>
                  </p>
                )}
              </div>

              {/* Courier Logistics & Airway Bill Tracking */}
              <div className="p-4 bg-white rounded-xl border border-[#e5e5ea] space-y-2.5">
                <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider block">
                  Logistics & Armored Transit
                </span>
                
                <div className="space-y-1">
                  <span className="text-[11px] text-[#86868b] block">Courier Service Provider</span>
                  <p className="font-semibold text-[#1d1d1f]">
                    Insured Armored Express Courier (Lloyd's Underwritten)
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-[#86868b] block">Airway Bill (AWB) Consignment ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-1 rounded-md text-xs">
                      {order.trackingNumber || `TRACK-NXT-${order.id.slice(-6).toUpperCase()}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTracking}
                      className="p-1 text-[#86868b] hover:text-[#1d1d1f] rounded hover:bg-gray-100 transition-colors"
                      title="Copy AWB number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#f0f0f0]">
                  <span className="text-[11px] text-[#86868b] block">Estimated / Final Delivery</span>
                  <p className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>{order.estimatedDelivery || 'Within 3 - 5 business days'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>High-Value Security Protocol:</strong> Consignments are transported in tamper-evident armored boxes. Recipient photo ID and one-time delivery verification are required upon handover.
              </p>
            </div>
          </div>

          {/* 3. Financial Settlement Breakdown */}
          <div className="p-5 rounded-2xl border border-[#e5e5ea] bg-white space-y-3">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-700" />
              <span>Payment & Settlement Ledger</span>
            </h3>

            <div className="space-y-2 text-xs divide-y divide-[#f5f5f7]">
              <div className="flex justify-between py-1 text-[#6e6e73]">
                <span>Payment Method</span>
                <span className="font-semibold text-[#1d1d1f]">{order.paymentMethod || 'Razorpay Secure Online Settlement'}</span>
              </div>

              <div className="flex justify-between py-1 text-[#6e6e73]">
                <span>Payment Authorization</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Settled / Paid in Full</span>
                </span>
              </div>

              <div className="flex justify-between py-1 text-[#6e6e73]">
                <span>Creations Subtotal</span>
                <span className="font-semibold text-[#1d1d1f]">{currencySymbol}{(order.subtotal || order.total || 0).toLocaleString()}</span>
              </div>

              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between py-1 text-emerald-700">
                  <span>Atelier Privilege Discount</span>
                  <span className="font-semibold">-{currencySymbol}{order.discount.toLocaleString()}</span>
                </div>
              ) : null}

              <div className="flex justify-between py-1 text-[#6e6e73]">
                <span>Armored Express Courier</span>
                <span className="font-semibold text-emerald-700">
                  {order.shippingFee && order.shippingFee > 0 ? `${currencySymbol}${order.shippingFee.toLocaleString()}` : 'Complimentary (Patron Privilege)'}
                </span>
              </div>

              <div className="flex justify-between py-1 text-[#6e6e73]">
                <span>Precious Jewellery Tax (GST 3%)</span>
                <span className="font-semibold text-[#1d1d1f]">{order.tax ? `${currencySymbol}${order.tax.toLocaleString()}` : 'Included'}</span>
              </div>

              <div className="flex justify-between pt-2.5 text-sm sm:text-base font-bold text-[#1d1d1f]">
                <span>Total Amount Paid</span>
                <span className="text-[#c5a059]">{currencySymbol}{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 4. Hallmark & Authenticity Guarantee */}
          <div className="p-4 bg-gradient-to-r from-[#fdfcf9] to-[#f9f7f2] border border-[#e6dcce] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                Bureau of Indian Standards (BIS) Hallmarked Solid Gold
              </span>
              <p className="text-[#6e6e73] leading-relaxed text-[11px]">
                Lifetime authenticity, complimentary ultrasonic restoration, and prong inspection warranty underwritten by Naxtto Goldsmiths.
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-[#c5a059]/40 text-[#8c6d23] font-bold rounded-lg text-[10px] shrink-0 uppercase tracking-wider">
              Guaranteed Authentic
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#e5e5ea] bg-[#fbfbfd] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 text-[#1d1d1f] border border-[#d2d2d7] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#6e6e73]" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Download Invoice (PDF)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
