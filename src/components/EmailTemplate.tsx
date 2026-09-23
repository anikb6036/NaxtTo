import React, { useState, useMemo } from 'react';
import { Copy, Check, Eye, Code, Smartphone, Monitor, ExternalLink } from 'lucide-react';

export type EmailTemplateType = 
  | 'order_confirmation' 
  | 'order_shipped' 
  | 'order_delivered' 
  | 'newsletter_welcome' 
  | 'custom';

export interface EmailTemplateItem {
  name: string;
  quantity: number;
  price?: number;
  size?: string;
  image?: string;
  description?: string;
}

export interface EmailTemplateAddress {
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export interface EmailTemplateProps {
  templateType: EmailTemplateType;
  recipientName: string;
  recipientEmail?: string;
  orderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  items?: EmailTemplateItem[];
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  total?: number;
  currencySymbol?: string;
  shippingAddress?: EmailTemplateAddress;
  paymentMethod?: string;
  estimatedDelivery?: string;
  headline?: string;
  customMessage?: string;
  callToAction?: {
    label: string;
    url: string;
  };
  // React UI controls (optional)
  showControls?: boolean;
  className?: string;
}

/**
 * Pure generator function to build production-grade, client-compatible
 * responsive HTML for NaxtTo Fine Jewellery transactional emails.
 */
export function renderEmailTemplateHtml(props: EmailTemplateProps): string {
  const {
    templateType,
    recipientName = 'Valued Patron',
    orderNumber = 'NXT-884920',
    trackingNumber = 'TRACK-NXT-908123',
    carrier = 'Blue Dart Apex Armored Transit',
    trackingUrl = 'https://naxtto.shop/account?tab=orders',
    items = [],
    total,
    currencySymbol = '₹',
    shippingAddress,
    paymentMethod = 'Secure Online Payment (Razorpay)',
    estimatedDelivery = '3–5 Business Days',
    headline,
    customMessage,
    callToAction
  } = props;

  // Header Title & Tagline depending on type
  let categoryTag = 'NaxtTo Fine Jewellery Atelier';
  let title = headline || 'Consignment Update';
  let subtitle = `Order #${orderNumber} • Registered in Atelier Master Ledger`;

  switch (templateType) {
    case 'order_confirmation':
      title = headline || 'Order Acquisition Confirmed';
      subtitle = `Consignment #${orderNumber} • Handcrafting in Artisan Workshop`;
      break;
    case 'order_shipped':
      title = headline || 'Consignment Dispatched';
      subtitle = `Order #${orderNumber} • Armored High-Value Transit`;
      break;
    case 'order_delivered':
      title = headline || 'Consignment Handed Over';
      subtitle = `Order #${orderNumber} • Successfully Delivered to Patron`;
      break;
    case 'newsletter_welcome':
      categoryTag = 'NaxtTo Atelier Privé';
      title = headline || 'Welcome to the Atelier Salon';
      subtitle = 'Exclusive Previews & Archival Fine Jewellery Releases';
      break;
    case 'custom':
      title = headline || 'Notice from the Atelier Master';
      subtitle = subtitle || 'NaxtTo Fine Jewellery Concierge';
      break;
  }

  // Items rows
  const itemsHtml = items.length > 0 ? items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f2ede4; vertical-align: top;">
        <div style="font-weight: 600; color: #1a1a1a; font-size: 14px; letter-spacing: -0.01em;">${item.name}</div>
        <div style="font-size: 12px; color: #78716c; margin-top: 3px;">
          ${item.size ? `Size: ${item.size} &bull; ` : ''}Qty: ${item.quantity}
          ${item.description ? ` &bull; ${item.description}` : ''}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f2ede4; text-align: right; font-weight: 600; color: #1a1a1a; font-size: 14px; vertical-align: top; white-space: nowrap;">
        ${item.price ? `${currencySymbol}${Number(item.price * item.quantity).toLocaleString('en-IN')}` : ''}
      </td>
    </tr>
  `).join('') : '';

  // Return bulletproof email template with responsive media queries
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title} – NaxtTo Fine Jewellery</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset & Base */
    body, p, h1, h2, h3, h4, table, td { margin: 0; padding: 0; }
    body { background-color: #faf8f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    
    /* Responsive breakpoints */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-hide { display: none !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f;">

  <!-- Outer Canvas Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f5;">
    <tr>
      <td align="center" style="padding: 12px;">

        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #ede8df;">
          
          <!-- Top Atelier Gold Ribbon Accent -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #d4af37 0%, #f3e5ab 50%, #b8860b 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid #f5f1ea;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Brand Eyebrow -->
                    <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #a17a2e; font-weight: 700; margin-bottom: 8px;">
                      ${categoryTag}
                    </div>
                    <!-- Main Subject Header -->
                    <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1c1917; letter-spacing: -0.02em; line-height: 1.3;">
                      ${title}
                    </h1>
                    <!-- Subtitle / Order Details -->
                    <p style="margin: 6px 0 0; font-size: 13px; color: #78716c; letter-spacing: 0.01em;">
                      ${subtitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Section -->
          <tr>
            <td style="padding: 32px 36px;" class="mobile-padding">
              
              <!-- Salutation -->
              <p style="font-size: 15px; line-height: 1.6; color: #292524; margin: 0 0 16px;">
                Dear <strong>${recipientName}</strong>,
              </p>

              <!-- Body Message -->
              ${customMessage ? `
              <p style="font-size: 14px; line-height: 1.65; color: #44403c; margin: 0 0 24px;">
                ${customMessage}
              </p>` : templateType === 'order_shipped' ? `
              <p style="font-size: 14px; line-height: 1.65; color: #44403c; margin: 0 0 24px;">
                We are delighted to inform you that your handcrafted jewellery piece has completed final quality authentication, received official BIS hallmark sealing, and departed our master vaults in an armored, tamper-evident security consignment.
              </p>` : templateType === 'order_confirmation' ? `
              <p style="font-size: 14px; line-height: 1.65; color: #44403c; margin: 0 0 24px;">
                Thank you for commissioning NaxtTo Fine Jewellery. Your bespoke acquisition has been authenticated and entered into our artisan workshop schedule.
              </p>` : templateType === 'newsletter_welcome' ? `
              <p style="font-size: 14px; line-height: 1.65; color: #44403c; margin: 0 0 24px;">
                Welcome to the NaxtTo circle. As a privileged subscriber, you will receive advance previews of archival Shankha-Pola commissions, 22K Gold Badhano heritage drops, and bespoke artisan releases before they appear on the salon floor.
              </p>` : `
              <p style="font-size: 14px; line-height: 1.65; color: #44403c; margin: 0 0 24px;">
                Thank you for your valued patronage of the NaxtTo Atelier.
              </p>`}

              <!-- Tracking Box (For Shipped Orders) -->
              ${templateType === 'order_shipped' ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f3; border: 1px solid #e8dec8; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
                      Airway Bill & Live Tracking
                    </div>
                    <div style="font-size: 18px; font-weight: 700; font-family: monospace; color: #1c1917; margin-bottom: 8px;">
                      ${trackingNumber}
                    </div>
                    <div style="font-size: 13px; color: #57534e; margin-bottom: 16px;">
                      <strong>Armored Carrier:</strong> ${carrier}
                    </div>
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #1c1917; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 11px 24px; border-radius: 6px; letter-spacing: 0.02em;">
                      Track Consignment Live &rarr;
                    </a>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Items Table -->
              ${items.length > 0 ? `
              <div style="margin-bottom: 28px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a8a29e; margin-bottom: 10px;">
                  Consignment Pieces
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${itemsHtml}
                </table>
                ${total ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 14px;">
                  <tr>
                    <td style="font-size: 14px; font-weight: 700; color: #1c1917;">Total Acquisition Amount:</td>
                    <td style="text-align: right; font-size: 16px; font-weight: 700; color: #9e7d3b; font-family: -apple-system, sans-serif;">
                      ${currencySymbol}${Number(total).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </table>` : ''}
              </div>` : ''}

              <!-- Order Summary Block (Confirmation Mode) -->
              ${templateType === 'order_confirmation' ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f3; border: 1px solid #e8dec8; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td style="color: #78716c; padding-bottom: 6px;">Payment Method:</td>
                        <td style="text-align: right; font-weight: 600; color: #1c1917; padding-bottom: 6px;">${paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="color: #78716c; padding-bottom: 6px;">Estimated Completion:</td>
                        <td style="text-align: right; font-weight: 600; color: #1c1917; padding-bottom: 6px;">${estimatedDelivery}</td>
                      </tr>
                      ${total ? `
                      <tr style="border-top: 1px solid #e8dec8;">
                        <td style="color: #1c1917; font-weight: 700; padding-top: 10px; font-size: 14px;">Total Value:</td>
                        <td style="text-align: right; font-weight: 700; color: #9e7d3b; padding-top: 10px; font-size: 15px;">
                          ${currencySymbol}${Number(total).toLocaleString('en-IN')}
                        </td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Delivery Destination Box -->
              ${shippingAddress?.addressLine1 ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbfbf9; border: 1px solid #ede8df; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; color: #57534e; line-height: 1.55;">
                    <strong style="color: #1c1917; display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
                      Delivery Destination
                    </strong>
                    ${shippingAddress.fullName ? `<strong>${shippingAddress.fullName}</strong><br/>` : ''}
                    ${shippingAddress.addressLine1}<br/>
                    ${shippingAddress.addressLine2 ? `${shippingAddress.addressLine2}<br/>` : ''}
                    ${shippingAddress.city ? `${shippingAddress.city}, ` : ''}${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}<br/>
                    ${shippingAddress.country || 'India'}
                    ${shippingAddress.phone ? `<br/><span style="color: #78716c;">Contact: ${shippingAddress.phone}</span>` : ''}
                  </td>
                </tr>
              </table>` : ''}

              <!-- Call to Action Button (Optional) -->
              ${callToAction ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${callToAction.url}" target="_blank" style="display: inline-block; background-color: #d4af37; color: #1c1917; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.03em; text-transform: uppercase;">
                      ${callToAction.label} &rarr;
                    </a>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Atelier Security & Hallmark Assurance -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-left: 3px solid #d4af37; background-color: #fcfbf9; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; color: #57534e; line-height: 1.5;">
                    <strong style="color: #1c1917;">Atelier Hallmark Assurance:</strong> Every piece is certified BIS Hallmarked, forged by master karigars in Kolkata and Milan, and travels under full replacement-value insurance. Please verify the tamper-evident golden seal upon delivery.
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="font-size: 13px; color: #78716c; line-height: 1.6; margin: 0;">
                Warm regards,<br/>
                <strong style="color: #1c1917;">NaxtTo Private Concierge & Master Goldsmiths</strong><br/>
                Kolkata Atelier &bull; Milan Design Studio
              </p>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #f7f5f0; padding: 22px 36px; text-align: center; border-top: 1px solid #ede8df; font-size: 11px; color: #78716c; line-height: 1.5;" class="mobile-padding">
              <div style="margin-bottom: 6px;">
                <strong>NaxtTo Fine Jewellery Atelier</strong> &bull; Crafted with Heritage & Modern Luxury
              </div>
              <div style="color: #a8a29e;">
                Powered by Resend Mail Service &bull; &copy; ${new Date().getFullYear()} NaxtTo. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

/**
 * Interactive React component to preview and inspect the email template
 * in various viewports (Desktop / Mobile), with raw HTML export and copy-to-clipboard.
 */
export const EmailTemplate: React.FC<EmailTemplateProps> = (props) => {
  const { showControls = true, className = '' } = props;
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute final HTML
  const compiledHtml = useMemo(() => renderEmailTemplateHtml(props), [props]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(compiledHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className={`flex flex-col bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      {/* Top Header / Viewport Toolbar */}
      {showControls && (
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Template</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {props.templateType.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Preview vs HTML */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('html')}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'html' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>

            {/* Viewport Toggle (when in preview mode) */}
            {viewMode === 'preview' && (
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  title="Desktop Viewport (600px)"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewport === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  title="Mobile Viewport (375px)"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewport === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Copy HTML Button */}
            <button
              type="button"
              onClick={handleCopyHtml}
              className="px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 flex justify-center items-start min-h-[500px] overflow-x-auto bg-[#faf8f5]">
        {viewMode === 'preview' ? (
          <div 
            className="transition-all duration-300 shadow-lg rounded-xl overflow-hidden border border-slate-200 bg-white"
            style={{ 
              width: viewport === 'mobile' ? '375px' : '600px',
              maxWidth: '100%'
            }}
          >
            <iframe
              title="NaxtTo Transactional Email Preview"
              srcDoc={compiledHtml}
              className="w-full border-0 min-h-[620px]"
              style={{ display: 'block' }}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[620px]">
            <pre className="whitespace-pre-wrap">{compiledHtml}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTemplate;
