import { Resend } from 'resend';

let resendClient: Resend | null = null;

/**
 * Lazy initialization of Resend client to avoid startup crashes if key is missing.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey.trim());
  }
  return resendClient;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
}

export function getResendFromEmail(): string {
  // Default to onboarding@resend.dev (Resend's default free testing sender) or user-configured custom domain
  let raw = (process.env.RESEND_FROM_EMAIL || '').trim();
  // Strip leading and trailing quotes if passed from .env
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }
  if (raw && raw.includes('@')) {
    return raw;
  }
  return 'NaxtTo Atelier <onboarding@resend.dev>';
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: 'resend' | 'resend-simulated';
  error?: string;
  warning?: string;
  deliveredTo?: string;
  timestamp: string;
}

/**
 * Common dispatch wrapper for all Resend transactional emails
 */
export async function sendEmailWithResend({
  to,
  subject,
  html,
  text,
  from,
  apiKey
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  apiKey?: string;
}): Promise<SendEmailResult> {
  const timestamp = new Date().toISOString();
  const recipientList = Array.isArray(to) ? to : [to];
  const targetRecipient = recipientList[0] || 'patron@naxtto.shop';
  const sender = from || getResendFromEmail();

  const keyToUse = apiKey?.trim() || process.env.RESEND_API_KEY?.trim();
  const client = keyToUse ? new Resend(keyToUse) : getResendClient();

  if (!client) {
    const simulatedId = `sim_resend_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log(`[RESEND SIMULATED] (${targetRecipient}) "${subject}" - RESEND_API_KEY not set. Message ID: ${simulatedId}`);
    return {
      success: true,
      provider: 'resend-simulated',
      messageId: simulatedId,
      deliveredTo: targetRecipient,
      timestamp,
      warning: 'RESEND_API_KEY is not configured in environment variables. Email logged in simulation mode.'
    };
  }

  try {
    const response = await client.emails.send({
      from: sender,
      to: recipientList,
      subject,
      html,
      text: text || ''
    });

    if (response.error) {
      // If custom domain is not verified, attempt fallback to Resend's free verified test sender
      if (!sender.includes('onboarding@resend.dev') && 
          (response.error.message?.toLowerCase().includes('domain') || 
           response.error.message?.toLowerCase().includes('from') || 
           response.error.message?.toLowerCase().includes('verify'))) {
        console.log('[RESEND RETRY] Custom domain not verified, attempting fallback via onboarding@resend.dev...');
        try {
          const fallbackResp = await client.emails.send({
            from: 'onboarding@resend.dev',
            to: recipientList,
            subject,
            html,
            text: text || ''
          });
          if (!fallbackResp.error) {
            const fbMessageId = fallbackResp.data?.id || `resend_${Date.now()}`;
            console.log(`[RESEND SENT]: Delivered via fallback onboarding@resend.dev to ${targetRecipient} (ID: ${fbMessageId})`);
            return {
              success: true,
              provider: 'resend',
              messageId: fbMessageId,
              deliveredTo: targetRecipient,
              timestamp,
              warning: 'Custom domain not yet verified in Resend. Delivered using onboarding@resend.dev'
            };
          }
        } catch {
          // ignore fallback error and report primary
        }
      }

      // If in Resend testing mode and recipient is unverified, route to developer's registered test inbox
      if (response.error.message?.includes('You can only send testing emails to your own email address')) {
        const match = response.error.message.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          const authorizedEmail = match[1];
          console.log(`[RESEND TEST ROUTING] Customer address (${targetRecipient}) requires domain verification. Forwarding to authorized test owner: ${authorizedEmail}`);
          try {
            const devResp = await client.emails.send({
              from: 'onboarding@resend.dev',
              to: authorizedEmail,
              subject: `[Order Confirmed for ${targetRecipient}] ${subject}`,
              html,
              text: text || ''
            });
            if (!devResp.error) {
              const devMessageId = devResp.data?.id || `resend_${Date.now()}`;
              console.log(`[RESEND SENT]: Successfully forwarded to registered test inbox ${authorizedEmail} (ID: ${devMessageId})`);
              return {
                success: true,
                provider: 'resend',
                messageId: devMessageId,
                deliveredTo: `${authorizedEmail} (forwarded from ${targetRecipient})`,
                timestamp,
                warning: `Delivered to verified Resend address (${authorizedEmail}). To send directly to ${targetRecipient}, verify a custom domain at resend.com/domains.`
              };
            }
          } catch {
            // continue to error
          }
        }
      }

      console.error('[RESEND API ERROR]:', response.error);
      return {
        success: false,
        provider: 'resend',
        error: response.error.message || 'Resend API returned an error',
        deliveredTo: targetRecipient,
        timestamp
      };
    }

    const messageId = response.data?.id || `resend_${Date.now()}`;
    console.log(`[RESEND SENT]: Successfully delivered to ${targetRecipient} (ID: ${messageId}) via ${sender}`);

    return {
      success: true,
      provider: 'resend',
      messageId,
      deliveredTo: targetRecipient,
      timestamp
    };
  } catch (err: any) {
    console.error('[RESEND DISPATCH EXCEPTION]:', err);
    return {
      success: false,
      provider: 'resend',
      error: err?.message || 'Unexpected exception during Resend email dispatch',
      deliveredTo: targetRecipient,
      timestamp
    };
  }
}

/**
 * Shipped Consignment Luxury Email Template
 */
export function buildShippedEmailHtml(data: {
  orderNumber: string;
  recipientName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  items?: Array<{ name: string; quantity: number; price?: number; size?: string }>;
  total?: number;
  currencySymbol?: string;
  shippingAddress?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}): string {
  const {
    orderNumber,
    recipientName,
    carrier,
    trackingNumber,
    trackingUrl,
    items = [],
    total,
    currencySymbol = '₹',
    shippingAddress
  } = data;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe1; vertical-align: top;">
        <div style="font-weight: 600; color: #1d1d1f; font-size: 14px;">${item.name}</div>
        <div style="font-size: 12px; color: #86868b; margin-top: 2px;">
          ${item.size ? `Size: ${item.size} &bull; ` : ''}Qty: ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe1; text-align: right; font-weight: 600; color: #1d1d1f; font-size: 14px; vertical-align: top;">
        ${item.price ? `${currencySymbol}${Number(item.price * item.quantity).toLocaleString('en-IN')}` : ''}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your NaxtTo Atelier Consignment #${orderNumber} has Shipped</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #efeae1;">
    
    <!-- Top Gold Accent -->
    <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #b8860b, #d4af37);"></div>

    <!-- Header -->
    <div style="padding: 32px 36px 20px; text-align: center; border-bottom: 1px solid #f4f0e8;">
      <div style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
        NaxtTo Fine Jewellery Atelier
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.02em;">
        Consignment Dispatched
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #86868b;">
        Order #${orderNumber} &bull; Insured High-Value Armored Transit
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px 36px;">
      <p style="font-size: 15px; line-height: 1.6; color: #333336; margin: 0 0 20px;">
        Dear <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #515154; margin: 0 0 24px;">
        We take great pride in informing you that your handcrafted jewellery piece has completed final quality authentication, received official BIS hallmark sealing, and departed our master vaults.
      </p>

      <!-- Tracking Callout Box -->
      <div style="background-color: #faf8f3; border: 1px solid #e8dec8; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
          Courier Tracking & Waybill
        </div>
        <div style="font-size: 18px; font-weight: 700; font-family: monospace; color: #1d1d1f; margin-bottom: 8px;">
          ${trackingNumber}
        </div>
        <div style="font-size: 13px; color: #515154; margin-bottom: 16px;">
          <strong>Carrier:</strong> ${carrier}
        </div>
        <a href="${trackingUrl}" style="display: inline-block; background-color: #1d1d1f; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 6px; letter-spacing: 0.02em;">
          Track Consignment Live &rarr;
        </a>
      </div>

      <!-- Items Section -->
      ${items.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86868b; margin-bottom: 8px;">
          Consignment Contents
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
        ${total ? `
        <div style="text-align: right; padding-top: 12px; font-size: 15px; font-weight: 700; color: #1d1d1f;">
          Total: ${currencySymbol}${Number(total).toLocaleString('en-IN')}
        </div>` : ''}
      </div>` : ''}

      <!-- Shipping Destination -->
      ${shippingAddress ? `
      <div style="background-color: #fbfbfd; border: 1px solid #f0f0f4; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #515154; line-height: 1.5;">
        <strong style="color: #1d1d1f; display: block; margin-bottom: 4px;">Delivery Destination:</strong>
        ${shippingAddress.addressLine1 || ''}<br/>
        ${shippingAddress.city ? `${shippingAddress.city}, ` : ''}${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}<br/>
        ${shippingAddress.country || 'India'}
      </div>` : ''}

      <!-- Security Notice -->
      <div style="border-left: 3px solid #d4af37; padding-left: 14px; font-size: 12px; color: #737373; line-height: 1.5; margin-bottom: 20px;">
        <strong>Atelier Assurance:</strong> Every NaxtTo package travels inside a tamper-evident, sealed high-security vault box insured for full replacement value. Please verify the gold seal before signing.
      </div>

      <p style="font-size: 13px; color: #86868b; line-height: 1.5; margin: 0;">
        Warm regards,<br/>
        <strong>NaxtTo Private Concierge & Master Goldsmiths</strong><br/>
        Kolkata Atelier &bull; Milan Design House
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f7f6f2; padding: 18px 36px; text-align: center; border-top: 1px solid #efeae1; font-size: 11px; color: #86868b;">
      Powered by Resend Mail Service &bull; &copy; ${new Date().getFullYear()} NaxtTo Fine Jewellery Atelier. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Order Confirmation Luxury Email Template
 */
export function buildOrderConfirmationEmailHtml(data: {
  orderNumber: string;
  recipientName: string;
  total: number;
  currencySymbol?: string;
  items?: Array<{ name: string; quantity: number; price?: number; size?: string }>;
  paymentMethod?: string;
  estimatedDelivery?: string;
  shippingAddress?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}): string {
  const {
    orderNumber,
    recipientName,
    total,
    currencySymbol = '₹',
    items = [],
    paymentMethod = 'Secure Online Payment',
    estimatedDelivery = '3–5 Business Days',
    shippingAddress
  } = data;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe1;">
        <div style="font-weight: 600; color: #1d1d1f; font-size: 14px;">${item.name}</div>
        <div style="font-size: 12px; color: #86868b;">Qty: ${item.quantity} ${item.size ? `&bull; Size: ${item.size}` : ''}</div>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe1; text-align: right; font-weight: 600; font-size: 14px; color: #1d1d1f;">
        ${item.price ? `${currencySymbol}${Number(item.price * item.quantity).toLocaleString('en-IN')}` : ''}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Order Confirmation #${orderNumber} – NaxtTo Fine Jewellery</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #efeae1;">
    
    <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #b8860b, #d4af37);"></div>

    <div style="padding: 32px 36px 20px; text-align: center; border-bottom: 1px solid #f4f0e8;">
      <div style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
        NaxtTo Fine Jewellery Atelier
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.02em;">
        Acquisition Confirmed
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #86868b;">
        Order #${orderNumber} &bull; Registered in Atelier Master Ledger
      </p>
    </div>

    <div style="padding: 28px 36px;">
      <p style="font-size: 15px; line-height: 1.6; color: #333336; margin: 0 0 16px;">
        Dear <strong>${recipientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #515154; margin: 0 0 24px;">
        Thank you for choosing NaxtTo. Your bespoke fine jewellery order has been authenticated and entered into our artisan workshop queue.
      </p>

      <!-- Order Summary Card -->
      <div style="background-color: #faf8f3; border: 1px solid #e8dec8; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #86868b; padding-bottom: 6px;">Order Number:</td>
            <td style="text-align: right; font-weight: 700; color: #1d1d1f; padding-bottom: 6px;">#${orderNumber}</td>
          </tr>
          <tr>
            <td style="color: #86868b; padding-bottom: 6px;">Payment Method:</td>
            <td style="text-align: right; font-weight: 600; color: #1d1d1f; padding-bottom: 6px;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="color: #86868b; padding-bottom: 6px;">Estimated Delivery:</td>
            <td style="text-align: right; font-weight: 600; color: #1d1d1f; padding-bottom: 6px;">${estimatedDelivery}</td>
          </tr>
          <tr style="border-top: 1px solid #e8dec8;">
            <td style="color: #1d1d1f; font-weight: 700; padding-top: 10px; font-size: 15px;">Total Amount:</td>
            <td style="text-align: right; font-weight: 700; color: #9e7d3b; padding-top: 10px; font-size: 16px;">${currencySymbol}${Number(total).toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      ${items.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86868b; margin-bottom: 8px;">
          Commissioned Pieces
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
      </div>` : ''}

      ${shippingAddress ? `
      <div style="background-color: #fbfbfd; border: 1px solid #f0f0f4; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #515154;">
        <strong style="color: #1d1d1f; display: block; margin-bottom: 4px;">Delivery Address:</strong>
        ${shippingAddress.addressLine1 || ''}<br/>
        ${shippingAddress.city ? `${shippingAddress.city}, ` : ''}${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}<br/>
        ${shippingAddress.country || 'India'}
      </div>` : ''}

      <p style="font-size: 13px; color: #86868b; line-height: 1.5; margin: 0;">
        Warm regards,<br/>
        <strong>NaxtTo Private Concierge & Master Goldsmiths</strong>
      </p>
    </div>

    <div style="background-color: #f7f6f2; padding: 18px 36px; text-align: center; border-top: 1px solid #efeae1; font-size: 11px; color: #86868b;">
      Powered by Resend Mail Service &bull; &copy; ${new Date().getFullYear()} NaxtTo Fine Jewellery Atelier.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Newsletter Welcome Luxury Email Template
 */
export function buildNewsletterWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to NaxtTo Atelier Privé</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1d1d1f;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #efeae1;">
    
    <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #b8860b, #d4af37);"></div>

    <div style="padding: 36px 36px 20px; text-align: center; border-bottom: 1px solid #f4f0e8;">
      <div style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
        NaxtTo Fine Jewellery Atelier
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #1d1d1f;">
        Welcome to the Atelier Privé
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: #86868b;">
        Your complimentary subscription is active
      </p>
    </div>

    <div style="padding: 28px 36px;">
      <p style="font-size: 15px; line-height: 1.6; color: #333336; margin: 0 0 16px;">
        Welcome to the NaxtTo circle.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #515154; margin: 0 0 20px;">
        As a privileged subscriber, you will receive private previews of archival Shankha-Pola commissions, 22K Gold Badhano heritage drops, and bespoke artisan releases before they appear on the public atelier salon floor.
      </p>

      <div style="background-color: #faf8f3; border: 1px solid #e8dec8; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px; font-size: 13px; color: #515154; line-height: 1.6;">
        <strong style="color: #1d1d1f; display: block; margin-bottom: 6px;">What you will enjoy:</strong>
        &bull; <strong>First Access:</strong> 48-hour advance notice on limited heritage bridal sets.<br/>
        &bull; <strong>Artisan Chronicles:</strong> Behind-the-scenes stories from master conch-carvers & filigree smiths.<br/>
        &bull; <strong>Privé Salon Offers:</strong> Exclusive seasonal perks and complimentary vault insurance.
      </div>

      <p style="font-size: 13px; color: #86868b; line-height: 1.5; margin: 0;">
        Warm regards,<br/>
        <strong>NaxtTo Private Client Services</strong><br/>
        concierge@naxtto.shop
      </p>
    </div>

    <div style="background-color: #f7f6f2; padding: 18px 36px; text-align: center; border-top: 1px solid #efeae1; font-size: 11px; color: #86868b;">
      Powered by Resend Mail Service &bull; &copy; ${new Date().getFullYear()} NaxtTo Fine Jewellery. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}
