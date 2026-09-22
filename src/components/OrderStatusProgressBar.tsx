import React, { useState } from 'react';
import { 
  PackageCheck, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  Check, 
  Clock, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Radio,
  XCircle,
  Home,
  Download,
  FileText,
  Printer,
  Loader2,
  Package,
  Phone,
  Calendar,
  CreditCard,
  Maximize2
} from 'lucide-react';
import { Order, UserProfile } from '../types';
import { updateOrderStatusInFirestore } from '../utils/userStorage';
import { generateOrderInvoicePDF } from '../utils/invoiceGenerator';

export interface OrderStatusProgressBarProps {
  order: Order;
  user?: Partial<UserProfile> | null;
  currencySymbol?: string;
  isHighlighted?: boolean;
  onStatusUpdated?: (newStatus: Order['status']) => void;
  showAdminControls?: boolean;
  isInitiallyExpanded?: boolean;
  onOpenDetailModal?: (order: Order) => void;
}

export type OrderStage = 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';

interface StageDefinition {
  id: OrderStage;
  label: string;
  shortLabel: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGES: StageDefinition[] = [
  {
    id: 'Confirmed',
    label: 'Confirmed',
    shortLabel: 'Confirmed',
    subLabel: 'Verified & Logged',
    icon: PackageCheck,
    description: 'Your bespoke commission has been acknowledged and recorded in the atelier ledger.'
  },
  {
    id: 'Processing',
    label: 'Processing',
    shortLabel: 'Processing',
    subLabel: 'Artisan Crafting',
    icon: Sparkles,
    description: 'Master goldsmiths are handcrafting, stone-setting, polishing, and applying official BIS hallmarks.'
  },
  {
    id: 'Shipped',
    label: 'Shipped',
    shortLabel: 'Shipped',
    subLabel: 'Insured Armored Transit',
    icon: Truck,
    description: 'Vault-sealed in a tamper-evident package and dispatched via insured high-security courier.'
  },
  {
    id: 'Delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    subLabel: 'Signed by Patron',
    icon: Home,
    description: 'Consignment safely handed over to patron. Certificate of authenticity enclosed.'
  }
];

export const OrderStatusProgressBar: React.FC<OrderStatusProgressBarProps> = ({
  order,
  user,
  currencySymbol = '£',
  isHighlighted = false,
  onStatusUpdated,
  showAdminControls = true,
  isInitiallyExpanded = false,
  onOpenDetailModal
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(isInitiallyExpanded);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isCancelled = order.status === 'Cancelled';
  const isOutForDelivery = order.status === 'Out for Delivery';
  const isDelivered = order.status === 'Delivered';

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
      console.error('Invoice download error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Map any order status string to one of the 4 canonical stages
  const getStageInfo = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return { index: 0, stage: 'Confirmed' as OrderStage, percent: 12.5 };
      case 'Processing':
      case 'Accepted':
      case 'Crafting':
        return { index: 1, stage: 'Processing' as OrderStage, percent: 37.5 };
      case 'Shipped':
      case 'Dispatched':
        return { index: 2, stage: 'Shipped' as OrderStage, percent: 62.5 };
      case 'Out for Delivery':
        return { index: 2, stage: 'Shipped' as OrderStage, percent: 80 };
      case 'Delivered':
        return { index: 3, stage: 'Delivered' as OrderStage, percent: 100 };
      case 'Cancelled':
        return { index: -1, stage: 'Confirmed' as OrderStage, percent: 0 };
      default:
        return { index: 0, stage: 'Confirmed' as OrderStage, percent: 12.5 };
    }
  };

  const { index: currentStageIndex, stage: currentStage, percent: progressPercent } = getStageInfo(order.status);

  const handleCopyAWB = () => {
    if (!order.trackingNumber) return;
    try {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    } catch {
      // ignore
    }
  };

  // Allows real-time live simulation and Firestore status updates directly from User Account Page
  const handleLiveStatusChange = async (targetStatus: Order['status']) => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    setUpdateFeedback(`Updating to "${targetStatus}" in Firestore...`);

    try {
      await updateOrderStatusInFirestore(order.id, targetStatus);
      if (onStatusUpdated) {
        onStatusUpdated(targetStatus);
      }
      setUpdateFeedback(`Synced! Status is now "${targetStatus}".`);
      setTimeout(() => setUpdateFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update order status:', err);
      setUpdateFeedback('Failed to update status in Firestore.');
      setTimeout(() => setUpdateFeedback(null), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Find chronological timestamp for a given stage if present in statusUpdates
  const getStageTimestamp = (stageId: OrderStage) => {
    if (!order.statusUpdates || order.statusUpdates.length === 0) return null;
    
    // Map stage to matching status updates
    const matching = order.statusUpdates.filter(u => {
      if (stageId === 'Confirmed') return u.status === 'Confirmed';
      if (stageId === 'Processing') return u.status === 'Processing' || u.status === 'Accepted' || u.status === 'Crafting';
      if (stageId === 'Shipped') return u.status === 'Shipped' || u.status === 'Dispatched' || u.status === 'Out for Delivery';
      if (stageId === 'Delivered') return u.status === 'Delivered';
      return false;
    });

    if (matching.length > 0) {
      const latest = matching[matching.length - 1];
      try {
        const d = new Date(latest.timestamp);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <div 
      id={`order-tracker-${order.id}`}
      className={`p-6 sm:p-7 rounded-2xl border bg-white space-y-6 shadow-xs transition-all ${
        isHighlighted 
          ? 'border-[#0071e3]/50 ring-2 ring-[#0071e3]/10 bg-gradient-to-b from-blue-50/20 to-white' 
          : 'border-[#e5e5ea] hover:shadow-md'
      }`}
    >
      {/* 1. Header: Consignment ID, Date, Real-time Status Badge & Live Sync indicator */}
      <div 
        onClick={() => setIsDetailExpanded(!isDetailExpanded)}
        className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e5e5ea] cursor-pointer group hover:bg-[#fafafc] -mx-6 sm:-mx-7 px-6 sm:px-7 -mt-6 sm:-mt-7 pt-6 sm:pt-7 rounded-t-2xl transition-colors select-none"
        title="Click row to view expanded order details"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b]">
              Atelier Consignment
            </span>
            {/* Live Firestore indicator */}
            <span 
              title="Connected to Firestore realtime stream"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
              </span>
              <span>Live Firestore Sync</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-base sm:text-lg text-[#1d1d1f]">
              {order.orderNumber || order.id}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyAWB();
              }}
              className="text-[#86868b] hover:text-[#1d1d1f] p-1 transition-colors rounded hover:bg-gray-100 cursor-pointer"
              title="Copy Order Reference"
            >
              {copiedTracking ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#86868b] hidden md:inline">Placed: {order.date}</span>
          
          {/* Main Stage Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
            isCancelled
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : currentStage === 'Delivered'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isOutForDelivery
              ? 'bg-indigo-50 text-indigo-900 border-indigo-300 ring-2 ring-indigo-200 shadow-2xs'
              : currentStage === 'Shipped'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : currentStage === 'Processing'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            {isOutForDelivery ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
              </span>
            ) : currentStage === 'Delivered' ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : currentStage === 'Shipped' ? (
              <Truck className="w-3 h-3 text-blue-600" />
            ) : currentStage === 'Processing' ? (
              <Sparkles className="w-3 h-3 text-amber-600" />
            ) : (
              <PackageCheck className="w-3 h-3 text-slate-600" />
            )}
            <span>{isOutForDelivery ? 'Out for Delivery' : order.status}</span>
          </span>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailExpanded(!isDetailExpanded);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isDetailExpanded
                ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                : 'bg-white text-[#1d1d1f] border-[#d2d2d7] group-hover:border-[#1d1d1f]'
            }`}
            title="Click to view full products and shipping details"
          >
            <span>{isDetailExpanded ? 'Close Details' : 'Order Details'}</span>
            {isDetailExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 2. CANCELLED STATE BANNER (If applicable) */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="font-bold text-rose-950">Consignment Cancelled</h4>
            <p className="text-rose-800 leading-relaxed">
              This order has been cancelled in the atelier ledger. Any pre-authorized charges or payments have been reversed. For questions regarding bespoke commissions, please reach out to our private concierge.
            </p>
          </div>
        </div>
      )}

      {/* 3. 4-STAGE VISUAL PROGRESS BAR (Confirmed -> Processing -> Shipped -> Delivered) */}
      {!isCancelled && (
        <div className="py-3 px-1 sm:px-3">
          <div className="relative">
            {/* Background connecting line */}
            <div className="absolute top-4 sm:top-5 left-6 right-6 h-1 bg-[#e5e5ea] rounded-full z-0" />
            
            {/* Filled active progress bar */}
            <div 
              className="absolute top-4 sm:top-5 left-6 h-1 bg-gradient-to-r from-[#1d1d1f] via-[#c5a059] to-emerald-600 rounded-full transition-all duration-700 ease-out z-0"
              style={{ width: `calc(${Math.min(100, Math.max(0, progressPercent))}% - 12px)` }}
            />

            {/* 4 Stage Nodes */}
            <div className="grid grid-cols-4 relative z-10 text-center">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isCompleted = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const timestamp = getStageTimestamp(stage.id);

                return (
                  <div key={stage.id} className="flex flex-col items-center group px-1">
                    {/* Circle Node Icon */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#1d1d1f] text-white ring-4 ring-white shadow-xs'
                        : isCurrent
                        ? isOutForDelivery && stage.id === 'Shipped'
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md animate-pulse'
                          : 'bg-[#1d1d1f] text-white ring-4 ring-amber-100/90 shadow-md'
                        : 'bg-white border-2 border-[#e5e5ea] text-[#86868b]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span className={`mt-2.5 text-xs sm:text-sm font-semibold leading-tight ${
                      isCurrent
                        ? isOutForDelivery && stage.id === 'Shipped'
                          ? 'text-indigo-950 font-bold'
                          : 'text-[#1d1d1f] font-bold'
                        : isCompleted
                        ? 'text-[#1d1d1f]'
                        : 'text-[#86868b]'
                    }`}>
                      {stage.label}
                    </span>

                    {/* Subtext description */}
                    <span className="text-[10px] text-[#86868b] hidden sm:block mt-0.5 font-medium">
                      {stage.subLabel}
                    </span>

                    {/* Completion Timestamp badge if recorded */}
                    {timestamp && (
                      <span className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-[#555] font-mono">
                        {timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Milestone Explanatory Callout Banner */}
      {!isCancelled && (
        <div className={`p-4 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
          isOutForDelivery
            ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950'
            : currentStage === 'Delivered'
            ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-950'
            : currentStage === 'Shipped'
            ? 'bg-blue-50/90 border border-blue-200 text-blue-950'
            : currentStage === 'Processing'
            ? 'bg-amber-50/90 border border-amber-200 text-amber-950'
            : 'bg-[#f5f5f7] border border-[#e5e5ea] text-[#333]'
        }`}>
          <div className="space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-sm">
              {isOutForDelivery ? (
                <>
                  <Truck className="w-4 h-4 text-indigo-700 animate-bounce" />
                  <span>Out for Delivery Today</span>
                </>
              ) : currentStage === 'Delivered' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Consignment Delivered & Signed</span>
                </>
              ) : currentStage === 'Shipped' ? (
                <>
                  <Truck className="w-4 h-4 text-blue-700" />
                  <span>In Transit with Armored Priority Courier</span>
                </>
              ) : currentStage === 'Processing' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Atelier Artisans Handcrafting & Hallmarking</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-slate-700" />
                  <span>Order Confirmed & Logged in Atelier Ledger</span>
                </>
              )}
            </div>

            <p className="text-xs opacity-90 leading-relaxed max-w-xl">
              {isOutForDelivery
                ? 'Your armored courier van has departed the local security hub. Official signature is required upon handover.'
                : currentStage === 'Delivered'
                ? 'Package has been successfully handed over to patron destination. Certificate of hallmarked gold authenticity enclosed.'
                : currentStage === 'Shipped'
                ? 'Your order has cleared the atelier vault and is in insured express transit with door-to-door tracking.'
                : currentStage === 'Processing'
                ? 'Master jewelers are currently setting, polishing, and stamping your solid gold pieces with certified hallmarks.'
                : 'Your order was successfully recorded. The atelier will allocate materials and begin crafting shortly.'}
            </p>
          </div>

          {order.estimatedDelivery && (
            <div className="shrink-0 text-left sm:text-right bg-white/85 px-3.5 py-2 rounded-lg border border-black/5 shadow-2xs">
              <span className="text-[10px] text-[#86868b] block uppercase font-bold tracking-wider">
                Estimated Delivery
              </span>
              <span className="font-bold text-[#1d1d1f] text-sm">{order.estimatedDelivery}</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Courier Airway Bill & Destination Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea] space-y-1.5">
          <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#86868b]" />
            Consignment Tracking & Courier
          </span>
          {order.trackingNumber ? (
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-xs font-bold text-[#1d1d1f] bg-white px-2.5 py-1 rounded border border-[#dadce0]">
                {order.trackingNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyAWB}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#1d1d1f] rounded border border-[#dadce0] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedTracking ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy AWB</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-[#86868b] text-[11px] pt-1">
              Airway bill generated upon courier dispatch from atelier vault.
            </p>
          )}
        </div>

        <div className="p-3.5 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea] space-y-1.5">
          <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
            Delivery Destination
          </span>
          <p className="text-[#555] text-[11px] truncate pt-1">
            {order.shippingAddress?.fullName} • {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
          </p>
        </div>
      </div>

      {/* 6. Real-Time Interactive Stage Simulator & Quick Update Toolbar */}
      {showAdminControls && (
        <div className="p-3.5 bg-[#fcfcfd] rounded-xl border border-dashed border-[#d2d2d7] space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#6e6e73]">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="font-semibold text-[#1d1d1f]">Real-time Firestore Status Controller</span>
              <span className="text-[11px] text-[#86868b]">(Click to update live across all devices)</span>
            </div>

            {updateFeedback && (
              <span className="text-[11px] text-emerald-700 font-semibold animate-fadeIn">
                {updateFeedback}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleLiveStatusChange('Confirmed')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                order.status === 'Confirmed'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <PackageCheck className="w-3 h-3" />
              <span>1. Confirmed</span>
            </button>

            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleLiveStatusChange('Processing')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                order.status === 'Processing' || order.status === 'Crafting' || order.status === 'Accepted'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>2. Processing</span>
            </button>

            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleLiveStatusChange('Shipped')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                order.status === 'Shipped' || order.status === 'Dispatched' || order.status === 'Out for Delivery'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>3. Shipped</span>
            </button>

            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => handleLiveStatusChange('Delivered')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                order.status === 'Delivered'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>4. Delivered</span>
            </button>
          </div>
        </div>
      )}

      {/* EXPANDED ORDER DETAIL VIEW (Triggered by clicking on the order row or 'Order Details' button) */}
      {isDetailExpanded && (
        <div 
          id={`expanded-order-detail-${order.id}`}
          className="p-5 sm:p-6 rounded-2xl bg-[#fafafc] border border-[#e5e5ea] space-y-5 animate-fadeIn shadow-inner"
        >
          {/* Detail View Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e5e5ea]">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#c5a059]" />
                <span>Consignment Manifest & Order Details</span>
              </h4>
              <p className="text-xs text-[#6e6e73]">
                Full breakdown of purchased creations, individual pricing, destination shipping, and armored transit.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenDetailModal && (
                <button
                  type="button"
                  onClick={() => onOpenDetailModal(order)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-[#1d1d1f] border border-[#d2d2d7] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Open in expanded modal dialog"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>Modal View</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsDetailExpanded(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                Hide Details
              </button>
            </div>
          </div>

          {/* 1. Full List of Products Purchased within this specific order */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#86868b] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-[#1d1d1f]" />
                <span>Purchased Creations ({order.items?.length || 0})</span>
              </span>
              <span className="text-[#86868b]">All prices shown in {currencySymbol}</span>
            </div>

            <div className="divide-y divide-[#ececef] border border-[#e5e5ea] rounded-xl bg-white overflow-hidden shadow-2xs">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => {
                  const unitPrice = item.product?.price || 0;
                  const qty = item.quantity || 1;
                  const lineTotal = unitPrice * qty;
                  const img = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80';

                  return (
                    <div 
                      key={idx} 
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 hover:bg-[#fafafc] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <img 
                          src={img} 
                          alt={item.product?.name || 'Jewellery piece'} 
                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-[#e5e5ea] shrink-0 bg-[#f9f9fa]" 
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="font-bold text-sm text-[#1d1d1f] line-clamp-1">
                            {item.product?.name || 'Handcrafted Haute Joaillerie Creation'}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-[#555] bg-[#f5f5f7] px-2 py-0.5 rounded text-[11px] font-medium">
                              <Sparkles className="w-3 h-3 text-[#c5a059]" />
                              <span>{item.selectedFinish ? item.selectedFinish.replace(/-/g, ' ') : '18k Solid Yellow Gold'}</span>
                            </span>

                            {item.selectedSize && (
                              <span className="text-[#555] bg-[#f5f5f7] px-2 py-0.5 rounded text-[11px] font-medium">
                                Size: {item.selectedSize}
                              </span>
                            )}

                            <span className="text-[#86868b] text-[11px]">
                              SKU: NXT-{item.product?.id?.slice(0, 5).toUpperCase() || 'BESPOKE'}
                            </span>
                          </div>

                          {/* Explicit Individual Item Price */}
                          <div className="pt-0.5 text-xs text-[#6e6e73] flex flex-wrap items-center gap-2">
                            <span>Individual Price: <strong className="text-[#1d1d1f] font-semibold">{currencySymbol}{unitPrice.toLocaleString()}</strong> each</span>
                            <span>•</span>
                            <span>Qty: <strong className="text-[#1d1d1f] font-semibold">{qty}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Calculated Line Item Total */}
                      <div className="sm:text-right shrink-0 self-end sm:self-center">
                        <span className="block text-[10px] text-[#86868b] uppercase tracking-wider font-semibold">Line Total</span>
                        <span className="text-sm sm:text-base font-bold text-[#1d1d1f]">
                          {currencySymbol}{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-xs text-[#86868b]">
                  Custom atelier bespoke order line items recorded in vault archive.
                </div>
              )}
            </div>
          </div>

          {/* 2. Comprehensive Shipping Details */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#e5e5ea] bg-white space-y-3.5 shadow-2xs">
            <h5 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0071e3]" />
              <span>Consignment Shipping & Delivery Details</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Delivery Address Details */}
              <div className="p-4 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea] space-y-2">
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
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

              {/* Armored Courier & Airway Bill Details */}
              <div className="p-4 bg-[#fbfbfd] rounded-xl border border-[#e5e5ea] space-y-2.5">
                <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
                  Logistics & Armored Transit
                </span>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#86868b] block">Courier Service Provider</span>
                  <p className="font-semibold text-[#1d1d1f]">
                    Insured Armored Express Courier (Lloyd's Underwritten)
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#86868b] block">Airway Bill (AWB) Consignment ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1d1d1f] bg-white px-2.5 py-1 rounded border border-[#e5e5ea] text-xs">
                      {order.trackingNumber || `TRACK-NXT-${order.id.slice(-6).toUpperCase()}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAWB}
                      className="p-1 text-[#86868b] hover:text-[#1d1d1f] rounded hover:bg-gray-100 transition-colors cursor-pointer"
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

                <div className="pt-1.5 border-t border-[#e5e5ea] flex items-center justify-between">
                  <span className="text-[#86868b]">Estimated / Final Delivery</span>
                  <span className="font-semibold text-[#1d1d1f] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>{order.estimatedDelivery || 'Within 3 - 5 business days'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Armored Delivery Protocol:</strong> Tamper-proof reinforced packaging. Handover requires recipient signature & government photo identification.
              </p>
            </div>
          </div>

          {/* 3. Payment Settlement Summary inside expanded view */}
          <div className="p-4 rounded-xl border border-[#e5e5ea] bg-white text-xs space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider block">
              Payment & Settlement Ledger
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-[#fbfbfd] rounded-lg border border-[#f0f0f2]">
                <span className="text-[#86868b] block text-[10px]">Payment Method</span>
                <span className="font-semibold text-[#1d1d1f] truncate block">{order.paymentMethod || 'Razorpay Online'}</span>
              </div>
              <div className="p-2.5 bg-[#fbfbfd] rounded-lg border border-[#f0f0f2]">
                <span className="text-[#86868b] block text-[10px]">Items Subtotal</span>
                <span className="font-semibold text-[#1d1d1f]">{currencySymbol}{(order.subtotal || order.total || 0).toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-[#fbfbfd] rounded-lg border border-[#f0f0f2]">
                <span className="text-[#86868b] block text-[10px]">Insured Courier</span>
                <span className="font-semibold text-emerald-700">
                  {order.shippingFee && order.shippingFee > 0 ? `${currencySymbol}${order.shippingFee.toLocaleString()}` : 'Complimentary'}
                </span>
              </div>
              <div className="p-2.5 bg-[#fbfbfd] rounded-lg border border-[#f0f0f2]">
                <span className="text-[#86868b] block text-[10px]">Net Total Paid</span>
                <span className="font-bold text-[#1d1d1f]">{currencySymbol}{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tax Invoice & Transaction Details Summary (Download Invoice) */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-xs transition-all ${
        isDelivered
          ? 'bg-gradient-to-r from-[#fdfcf9] to-[#f9f7f2] border-[#e6dcce] shadow-2xs'
          : 'bg-[#fbfbfd] border-[#e5e5ea]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className={`w-4 h-4 ${isDelivered ? 'text-[#c5a059]' : 'text-[#6e6e73]'}`} />
            <span className="font-bold text-[#1d1d1f] text-sm">
              {isDelivered 
                ? 'Official Tax Invoice & Certificate of Authenticity' 
                : 'Consignment Receipt & Tax Invoice'}
            </span>
            {isDelivered && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c5a059]/15 text-[#8c6d23] border border-[#c5a059]/30">
                Completed Consignment
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {isDelivered
              ? 'Complete transaction ledger, BIS gold hallmarking guarantee, and settled payment breakdown.'
              : 'Download complete PDF summary of order specifications, consignment tracking, and payment receipt.'}
          </p>
          {downloadSuccess && (
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5 animate-fadeIn pt-0.5">
              <Check className="w-3.5 h-3.5" />
              <span>Invoice PDF generated and downloaded successfully.</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            id={`print-invoice-btn-${order.id}`}
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7] rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs text-xs"
            title="Print invoice directly"
          >
            <Printer className="w-3.5 h-3.5 text-[#6e6e73]" />
            <span>Print</span>
          </button>

          <button
            type="button"
            id={`download-invoice-btn-${order.id}`}
            onClick={handleDownloadInvoice}
            disabled={isGeneratingPdf}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs text-xs ${
              isDelivered
                ? 'bg-[#1d1d1f] hover:bg-black text-white hover:shadow-md'
                : 'bg-[#1d1d1f] hover:bg-black text-white'
            }`}
            title="Download Invoice as PDF"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className={`w-3.5 h-3.5 ${isDelivered ? 'text-[#c5a059]' : 'text-white'}`} />
                <span>Download Invoice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8. Collapsible Event Log & Order Items Preview */}
      <div className="pt-2 border-t border-[#e5e5ea] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-[#0071e3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          {showTimeline ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide Detailed Milestone History</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>View Milestone History ({order.statusUpdates?.length || 1} events)</span>
            </>
          )}
        </button>

        <span className="text-[#86868b]">
          Total: <strong className="text-[#1d1d1f] font-semibold">{currencySymbol}{order.total?.toLocaleString() || 0}</strong> ({order.items?.length || 0} pieces)
        </span>
      </div>

      {/* Expanded Chronological Event Log */}
      {showTimeline && (
        <div className="pt-2 space-y-3 animate-fadeIn">
          <h5 className="font-semibold text-xs text-[#1d1d1f] uppercase tracking-wider">
            Chronological Consignment Ledger
          </h5>

          <div className="space-y-2.5 border-l-2 border-[#e5e5ea] ml-2 pl-3 py-1">
            {order.statusUpdates && order.statusUpdates.length > 0 ? (
              order.statusUpdates.map((update, idx) => (
                <div key={idx} className="relative text-xs space-y-0.5">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#1d1d1f] ring-2 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1d1d1f]">{update.status}</span>
                    <span className="text-[10px] text-[#86868b]">
                      {new Date(update.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {update.note && (
                    <p className="text-[11px] text-[#555]">{update.note}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="relative text-xs space-y-0.5">
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#1d1d1f] ring-2 ring-white" />
                <span className="font-bold text-[#1d1d1f]">{order.status}</span>
                <p className="text-[11px] text-[#555]">Order initialized and recorded in atelier system.</p>
              </div>
            )}
          </div>

          {/* Items Summary in Consignment */}
          {order.items && order.items.length > 0 && (
            <div className="pt-3 border-t border-[#f0f0f0] space-y-2">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                Consignment Items
              </span>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#f9f9fa] rounded-lg">
                    <div className="flex items-center gap-2.5">
                      {item.product?.images?.[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-9 h-9 object-cover rounded border border-[#e5e5ea]" 
                        />
                      )}
                      <div>
                        <p className="font-medium text-[#1d1d1f]">{item.product?.name}</p>
                        <p className="text-[10px] text-[#86868b]">
                          Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1d1d1f]">
                      {currencySymbol}{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
