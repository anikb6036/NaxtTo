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
  if (raw) {
    if (raw.includes('@')) {
      return raw;
    }
    // If user provided a domain like "naxtto.shop", format it with a mailbox
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(raw)) {
      return `NaxtTo Atelier <orders@${raw}>`;
    }
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

let cachedAuthorizedTestEmail: string = 'anikb7960@gmail.com';

async function dispatchResendPayload(
  apiKey: string,
  payload: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }
): Promise<{ data: any; error: any }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const resJson = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        data: null,
        error: resJson || { message: `Resend API returned status ${res.status}` }
      };
    }
    return { data: resJson, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err?.message || 'Network error dispatching to Resend' } };
  }
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
  const rawList = Array.isArray(to) ? to : [to];
  const recipientList = rawList
    .map(e => (typeof e === 'string' ? e.trim() : ''))
    .filter(e => e.includes('@'));
  
  const targetRecipient = recipientList[0] || cachedAuthorizedTestEmail;
  const sender = from || getResendFromEmail();

  const keyToUse = apiKey?.trim() || process.env.RESEND_API_KEY?.trim();

  if (!keyToUse) {
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
    const payload: any = {
      from: sender,
      to: recipientList.length === 1 ? recipientList[0] : recipientList,
      subject,
      html
    };
    if (text && text.trim().length > 0) {
      payload.text = text.trim();
    }

    const response = await dispatchResendPayload(keyToUse, payload);

    if (response.error) {
      const errObj = response.error.error || response.error;
      const errMsg = (errObj.message || response.error.message || '').toString();

      // Check for Resend test account constraint (e.g. unverified domain or unverified recipient)
      const isTestRestriction = 
        errMsg.toLowerCase().includes('only send testing emails') ||
        errMsg.toLowerCase().includes('testing email address') ||
        errMsg.toLowerCase().includes('example.com') ||
        response.error.statusCode === 403 || 
        errObj.statusCode === 403;

      if (isTestRestriction) {
        const match = errMsg.match(/\(([^)]+)\)/);
        const authorizedEmail = match?.[1] || cachedAuthorizedTestEmail;
        cachedAuthorizedTestEmail = authorizedEmail;

        console.log(`[RESEND TEST ROUTING] Resend test tier active. Forwarding message for ${targetRecipient} to registered account inbox: ${authorizedEmail}`);

        const testPayload: any = {
          from: 'onboarding@resend.dev',
          to: authorizedEmail,
          subject: `[Order Confirmed for ${targetRecipient}] ${subject}`,
          html
        };
        if (text && text.trim().length > 0) {
          testPayload.text = text.trim();
        }

        const devResp = await dispatchResendPayload(keyToUse, testPayload);
        if (!devResp.error && devResp.data?.id) {
          const devMessageId = devResp.data.id;
          console.log(`[RESEND SENT]: Successfully delivered to registered test inbox ${authorizedEmail} (ID: ${devMessageId})`);
          return {
            success: true,
            provider: 'resend',
            messageId: devMessageId,
            deliveredTo: `${authorizedEmail} (forwarded from ${targetRecipient})`,
            timestamp,
            warning: `Delivered to verified Resend address (${authorizedEmail}). To send directly to patrons, verify a custom domain at resend.com/domains.`
          };
        }
      }

      // If custom domain is not verified, attempt fallback to Resend's free verified test sender
      if (!sender.includes('onboarding@resend.dev') && 
          (errMsg.toLowerCase().includes('domain') || 
           errMsg.toLowerCase().includes('from') || 
           errMsg.toLowerCase().includes('verify') ||
           errMsg.toLowerCase().includes('validation_error'))) {
        console.log('[RESEND RETRY] Custom domain not verified, attempting fallback via onboarding@resend.dev...');
        const fallbackPayload: any = {
          from: 'onboarding@resend.dev',
          to: payload.to,
          subject,
          html
        };
        if (text && text.trim().length > 0) {
          fallbackPayload.text = text.trim();
        }
        const fallbackResp = await dispatchResendPayload(keyToUse, fallbackPayload);
        if (!fallbackResp.error && fallbackResp.data?.id) {
          const fbMessageId = fallbackResp.data.id;
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
      }

      console.warn('[RESEND DISPATCH NOTICE]:', errMsg || response.error);
      return {
        success: false,
        provider: 'resend',
        error: errMsg || 'Resend API returned an error',
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
    console.warn('[RESEND DISPATCH EXCEPTION]:', err?.message || err);
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
 * Order Confirmation Professional Email Template
 */
export function buildOrderConfirmationEmailHtml(data: {
  orderNumber: string;
  recipientName?: string;
  total: number;
  currencySymbol?: string;
  items?: Array<{ name: string; quantity: number; price?: number; size?: string; skuId?: string; sku?: string }>;
  paymentMethod?: string;
  estimatedDelivery?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}): string {
  const {
    orderNumber,
    recipientName = 'NaxtTo',
    total,
    currencySymbol = '₹',
    items = [],
    paymentMethod = 'Prepaid Secure Payment (Razorpay)',
    shippingAddress
  } = data;

  const baseDate = new Date();
  const deadline = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dispatchDeadline = `${months[deadline.getMonth()]} ${deadline.getDate()}, ${deadline.getFullYear()} 12:00:00 PM`;

  const cleanItems = items.length > 0 ? items : [{
    name: 'NaxtTo Jhumki Earring Alloy Jhumki Earring, Drops & Danglers',
    quantity: 1,
    skuId: 'Earring-0011'
  }];

  const itemsHtmlList = cleanItems.map(it => {
    let skuId = it.skuId || it.sku;
    if (!skuId) {
      if (/earring|jhumk/i.test(it.name)) skuId = 'Earring-0011';
      else if (/sakha|shakha/i.test(it.name)) skuId = 'Shakha-0012';
      else if (/pola/i.test(it.name)) skuId = 'Pola-0014';
      else if (/bangle|badhano/i.test(it.name)) skuId = 'Bangle-0021';
      else if (/ring/i.test(it.name)) skuId = 'Ring-0018';
      else if (/necklace/i.test(it.name)) skuId = 'Necklace-0035';
      else skuId = 'Earring-0011';
    }

    return `
    <li style="margin-bottom: 8px;"><strong>Product:</strong> ${it.name}</li>
    <li style="margin-bottom: 8px;"><strong>Quantity:</strong> ${it.quantity} units</li>
    <li style="margin-bottom: 12px;"><strong>SKU ID:</strong> ${skuId}</li>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Action Required] New Order Received</title>
  <style type="text/css">
    body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202124; background-color: #ffffff; }
    p { margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #202124; }
    ul { margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #202124; }
    li { margin-bottom: 6px; }
    h3 { font-size: 16px; font-weight: bold; color: #202124; margin: 24px 0 12px 0; }
  </style>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #202124; background-color: #ffffff; font-size: 14px; line-height: 1.6;">
  <div style="max-width: 650px; margin: 0 auto; text-align: left;">
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #202124;">Dear NaxtTo,</p>

    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #202124;">You have received a new order:</p>

    <ul style="list-style-type: disc; margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #202124;">
      <li style="margin-bottom: 8px;"><strong>Order ID:</strong> ${orderNumber}</li>
      ${itemsHtmlList}
    </ul>

    <h3 style="font-size: 16px; font-weight: bold; color: #202124; margin: 24px 0 12px 0;">What You Need to Do</h3>

    <ul style="list-style-type: disc; margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #202124;">
      <li>Pack the order and mark it <strong>Ready to Dispatch</strong> by ${dispatchDeadline} to avoid SLA breaches, which may impact your ratings and performance.</li>
    </ul>

    ${shippingAddress ? `
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 13px; color: #5f6368; line-height: 1.6;">
      <div><strong>Customer:</strong> ${shippingAddress.fullName || recipientName}${shippingAddress.phone ? ` &bull; <strong>Phone:</strong> ${shippingAddress.phone}` : ''}</div>
      <div><strong>Delivery Address:</strong> ${shippingAddress.addressLine1 || ''}${shippingAddress.city ? `, ${shippingAddress.city}` : ''}${shippingAddress.postalCode ? ` - ${shippingAddress.postalCode}` : ''}</div>
      ${total ? `<div style="margin-top: 4px;"><strong>Order Value:</strong> ${currencySymbol}${Number(total).toLocaleString('en-IN')} &bull; <strong>Payment Method:</strong> ${paymentMethod}</div>` : ''}
    </div>` : ''}
  </div>
</body>
</html>`;
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
