import React, { useState } from 'react';
import { X, ShieldCheck, Tag, Info, Check, ExternalLink } from 'lucide-react';

export interface OfficialBank {
  id: string;
  name: string;
  fullName: string;
  logoUrl: string;
  logoHeightClass: string;
  offerHeadline: string;
  offerDetails: string;
  minSpend: string;
  code: string;
  validTill: string;
}

export const OFFICIAL_BANKS: OfficialBank[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    fullName: 'HDFC Bank Limited',
    logoUrl: '/banks/hdfc.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: '10% Instant Discount up to ₹2,500',
    offerDetails: 'Valid on HDFC Bank Credit & Debit Cards and EasyEMI transactions.',
    minSpend: 'Min purchase ₹7,500',
    code: 'HDFCJWL10',
    validTill: 'Limited Time Offer',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    fullName: 'ICICI Bank Limited',
    logoUrl: '/banks/icici.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: '10% Instant Discount up to ₹2,000',
    offerDetails: 'Valid on ICICI Bank Credit Cards and Net Banking on fine jewellery purchases.',
    minSpend: 'Min purchase ₹6,000',
    code: 'ICICIJEWEL',
    validTill: 'Valid this week',
  },
  {
    id: 'sbi',
    name: 'SBI',
    fullName: 'State Bank of India',
    logoUrl: '/banks/sbi.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: 'Flat ₹1,500 Instant Discount',
    offerDetails: 'Applicable on SBI Credit Cards and SBI YONO Card EMI options.',
    minSpend: 'Min purchase ₹10,000',
    code: 'SBINAXT1500',
    validTill: 'Pay Day Special',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    fullName: 'Axis Bank Limited',
    logoUrl: '/banks/axis.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: '10% Instant Cashback up to ₹2,000',
    offerDetails: 'Valid on Axis Bank Credit Cards, Flipkart Axis Bank Card, and Debit Cards.',
    minSpend: 'Min purchase ₹5,000',
    code: 'AXISJEWEL10',
    validTill: 'Limited Time Offer',
  },
  {
    id: 'kotak',
    name: 'Kotak',
    fullName: 'Kotak Mahindra Bank',
    logoUrl: '/banks/kotak.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: 'Up to ₹2,000 Instant Off + 6M No-Cost EMI',
    offerDetails: 'Applicable across all 925 Sterling Silver & Solitaire collections.',
    minSpend: 'Min purchase ₹5,000',
    code: 'KOTAKFINE',
    validTill: 'Seasonal Offer',
  },
  {
    id: 'hsbc',
    name: 'HSBC',
    fullName: 'HSBC Bank',
    logoUrl: '/banks/hsbc.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: '10% Instant Discount up to ₹2,500',
    offerDetails: 'Exclusive privilege for HSBC Credit Cardholders on certified jewellery.',
    minSpend: 'Min purchase ₹8,000',
    code: 'HSBCEXCLUSIVE',
    validTill: 'Festival Special',
  },
  {
    id: 'rbl',
    name: 'RBL Bank',
    fullName: 'RBL Bank Limited',
    logoUrl: '/banks/rbl.svg',
    logoHeightClass: 'h-4 sm:h-4.5',
    offerHeadline: '10% Instant Savings up to ₹1,500',
    offerDetails: 'Valid on RBL Bank Credit Card transactions & SuperCards.',
    minSpend: 'Min purchase ₹5,000',
    code: 'RBLSPARKLE',
    validTill: 'Weekly Special',
  },
];

export const BankOfferLogos: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [selectedBank, setSelectedBank] = useState<OfficialBank | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <>
      <div className={`flex items-center gap-2 sm:gap-2.5 flex-wrap ${className}`}>
        {OFFICIAL_BANKS.map((bank) => (
          <button
            key={bank.id}
            type="button"
            onClick={() => setSelectedBank(bank)}
            title={`View ${bank.name} 10% Instant Discount Offer Details`}
            className="flex items-center justify-center bg-white hover:bg-gray-50/90 active:scale-95 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border border-gray-200 shadow-2xs hover:border-gray-400 hover:shadow-xs transition-all duration-150 cursor-pointer group"
          >
            <img
              src={bank.logoUrl}
              alt={`${bank.name} Official Logo`}
              className={`${bank.logoHeightClass} w-auto max-w-[85px] sm:max-w-[105px] object-contain transition-transform group-hover:scale-105`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Interactive Bank Offer Details Modal */}
      {selectedBank && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBank(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center">
                  <img
                    src={selectedBank.logoUrl}
                    alt={selectedBank.name}
                    className="h-5 sm:h-6 w-auto max-w-[110px] object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                    {selectedBank.fullName} Offer
                  </h3>
                  <span className="text-[11px] text-green-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner Bank
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs sm:text-sm text-gray-600">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-3 text-amber-900">
                <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5 mb-1">
                  <Tag className="w-4 h-4 text-amber-700" />
                  {selectedBank.offerHeadline}
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {selectedBank.offerDetails}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-amber-900 pt-2 border-t border-amber-200/60">
                  <span>{selectedBank.minSpend}</span>
                  <span className="text-amber-700">{selectedBank.validTill}</span>
                </div>
              </div>

              {/* Coupon / Promo Code */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Promo / Card Code
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {selectedBank.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedBank.code)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    copiedCode === selectedBank.code
                      ? 'bg-green-600 text-white'
                      : 'bg-[#282c3f] hover:bg-black text-white'
                  }`}
                >
                  {copiedCode === selectedBank.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    'Copy Code'
                  )}
                </button>
              </div>

              {/* Terms bullet points */}
              <div className="space-y-1.5 text-[11px] text-gray-500 pt-1">
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <span>Discount is applied automatically at checkout or when paying via eligible cards.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <span>Applicable across all 925 Sterling Silver, Diamond &amp; Gold fine jewellery.</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#e0144c] hover:bg-[#c00e3e] text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
              >
                Shop With This Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
