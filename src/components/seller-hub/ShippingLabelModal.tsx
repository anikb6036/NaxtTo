import React from 'react';
import { Order } from '../../types';
import { Printer, X, ShieldCheck, Truck, Package, CheckCircle2 } from 'lucide-react';

interface ShippingLabelModalProps {
  order: Order | null;
  onClose: () => void;
  currencySymbol?: string;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  order,
  onClose,
  currencySymbol = '₹'
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const trackingCode = order.trackingNumber || `TRACK-NXT-${order.id.slice(-6).toUpperCase()}`;

  // Fake barcode SVG pattern from string seed
  const generateBarcodeLines = (seed: string) => {
    const bars: { width: number; isBlack: boolean }[] = [];
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Start guard
    bars.push({ width: 3, isBlack: true });
    bars.push({ width: 2, isBlack: false });
    bars.push({ width: 3, isBlack: true });
    
    for (let i = 0; i < 35; i++) {
      const bit = ((hash * (i + 13)) % 10) > 4;
      const width = ((hash * (i + 7)) % 3) + 1.5;
      bars.push({ width, isBlack: bit });
    }
    
    // Stop guard
    bars.push({ width: 3, isBlack: true });
    bars.push({ width: 2, isBlack: false });
    bars.push({ width: 3, isBlack: true });
    
    return bars;
  };

  const barcodeBars = generateBarcodeLines(trackingCode + order.orderNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {/* Print-specific stylesheet injected */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-shipping-label, #printable-shipping-label * {
            visibility: visible;
          }
          #printable-shipping-label {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl border border-[#e5e5ea] max-w-xl w-full shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea] bg-[#fbfbfe] no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Official Shipping Airway Bill</h3>
              <p className="text-xs text-[#717478]">Order #{order.orderNumber} • Courier Label</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#f1f3f4] text-[#717478] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Shipping Label Container */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] bg-[#f5f5f7]">
          <div 
            id="printable-shipping-label"
            className="bg-white border-2 border-black rounded-lg p-5 font-mono text-[#000] text-xs space-y-4 shadow-sm"
          >
            {/* Header / Courier Branding */}
            <div className="flex items-start justify-between border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#555]">
                  PREMIUM VALUABLES AIRWAY BILL
                </span>
                <h2 className="text-xl font-black tracking-tight font-sans text-black">
                  NAXTTO SECURE LOGISTICS
                </h2>
                <p className="text-[10px] text-[#444] font-sans">
                  Armored Courier & Insured High-Jewellery Transit
                </p>
              </div>
              <div className="text-right border-2 border-black px-2.5 py-1 rounded bg-[#fafafa]">
                <span className="text-[9px] uppercase font-bold block">PRIORITY</span>
                <span className="text-sm font-black text-black">EXPRESS</span>
              </div>
            </div>

            {/* Barcode Strip */}
            <div className="text-center py-2 bg-[#fafafa] border border-black rounded px-2 space-y-1">
              <div className="flex items-center justify-center gap-0.5 h-12 overflow-hidden mx-auto">
                {barcodeBars.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${b.width}px`,
                      backgroundColor: b.isBlack ? '#000' : 'transparent',
                      height: '100%'
                    }}
                  />
                ))}
              </div>
              <div className="text-[11px] font-bold tracking-widest text-black">
                {trackingCode}
              </div>
            </div>

            {/* Shipper & Consignee Grid */}
            <div className="grid grid-cols-2 gap-3 border-y-2 border-black py-3 text-[11px]">
              {/* Shipper (FROM) */}
              <div className="border-r border-black pr-3 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#666] block">
                  FROM (SHIPPER):
                </span>
                <p className="font-bold text-black font-sans">NaxtTo Fine Jewellery Atelier</p>
                <p className="text-[#333] leading-tight">
                  Bandra Kurla Complex (BKC), G Block<br />
                  Mumbai, Maharashtra 400051<br />
                  India<br />
                  Ph: +91 98765 43210
                </p>
                <span className="text-[9px] text-[#555] block pt-1">
                  GSTIN: 27AABCN1234F1Z8
                </span>
              </div>

              {/* Consignee (TO) */}
              <div className="pl-1 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#666] block">
                  SHIP TO (CONSIGNEE):
                </span>
                <p className="font-bold text-base text-black font-sans leading-tight">
                  {order.shippingAddress?.fullName || 'Valued Patron'}
                </p>
                <p className="text-[#111] leading-tight font-medium">
                  {order.shippingAddress?.addressLine1}
                  {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="text-[#111] font-bold">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-[#333] uppercase">{order.shippingAddress?.country || 'India'}</p>
                <p className="text-[#222] font-bold pt-0.5">
                  Tel: {order.shippingAddress?.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Meta Attributes */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] border-b-2 border-black pb-3">
              <div className="border-r border-black pr-1">
                <span className="text-[#666] block text-[9px]">ORDER NO.</span>
                <span className="font-bold text-black">{order.orderNumber}</span>
              </div>
              <div className="border-r border-black pr-1">
                <span className="text-[#666] block text-[9px]">ORDER DATE</span>
                <span className="font-bold text-black">{order.date}</span>
              </div>
              <div className="border-r border-black pr-1">
                <span className="text-[#666] block text-[9px]">WEIGHT</span>
                <span className="font-bold text-black">0.450 KG</span>
              </div>
              <div>
                <span className="text-[#666] block text-[9px]">PAYMENT</span>
                <span className="font-bold text-[#137333]">PAID ({order.paymentMethod || 'PREPAID'})</span>
              </div>
            </div>

            {/* Package Contents / Declaration */}
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#333]">DECLARED CONTENT:</span>
                <span className="font-bold text-black">
                  {order.items?.length || 1} Jewellery Item(s) • Solid 18K Gold
                </span>
              </div>
              <div className="bg-[#fafafa] border border-[#ddd] p-2 rounded text-[10px] space-y-0.5">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#333]">
                    <span className="truncate max-w-[280px]">
                      • {item.product?.name || 'High Jewelry Creation'} (Size: {item.selectedSize || 'Std'})
                    </span>
                    <span className="font-bold">Qty: {item.quantity || 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guarantee Strip */}
            <div className="border-t-2 border-black pt-2 flex items-center justify-between text-[9px] text-[#444]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span className="font-bold">TAMPER-EVIDENT VAULT SEALED • 100% INSURED</span>
              </div>
              <span className="font-mono font-bold">VAL-{order.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-white border-t border-[#e5e5ea] flex items-center justify-between text-xs text-[#717478] no-print">
          <span>Ready for courier handoff & dispatch.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#1d1d1f] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
