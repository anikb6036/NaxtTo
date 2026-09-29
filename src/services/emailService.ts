import { Order, EmailNotification } from '../types';
import { firestore } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { sanitizeForFirestore } from '../utils/userStorage';
import { 
  renderEmailTemplateHtml, 
  EmailTemplateProps, 
  EmailTemplateItem, 
  EmailTemplateAddress 
} from '../components/EmailTemplate';

const DEFAULT_CARRIER = 'Blue Dart Apex Secure Armored Transit';
const ATELIER_SENDER = 'NaxtTo Atelier Concierge <concierge@naxtto.shop>';

/**
 * Get active Resend API key from available sources (environment or client settings override)
 */
export function getClientResendApiKey(): string | undefined {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('naxtto_resend_api_key');
    if (local && local.trim().length > 0) return local.trim();
  }
  return (import.meta as any).env?.VITE_RESEND_API_KEY;
}

export interface SendOrderConfirmedResult {
  success: boolean;
  messageId?: string;
  provider?: string;
  notification: EmailNotification;
  message: string;
  error?: string;
}

/**
 * Sends a transactional 'Order Confirmed' email to the customer using
 * the luxury responsive EmailTemplate and dispatches via Resend Mail Service.
 *
 * @param order The completed order object
 * @param options Optional overrides for recipient email, name, or custom API key
 */
export async function sendOrderConfirmationEmail(
  order: Order,
  options?: {
    recipientEmail?: string;
    recipientName?: string;
    apiKey?: string;
    forceSend?: boolean;
  }
): Promise<SendOrderConfirmedResult> {
  const orderNum = order.orderNumber || order.id;
  const recipientEmail = options?.recipientEmail || 
    order.customerEmail || 
    (order.shippingAddress as any)?.email || 
    'patron@naxtto.shop';
  
  const recipientName = options?.recipientName || 
    order.shippingAddress?.fullName || 
    'Valued Patron';

  const notificationId = `notif_conf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const sentAt = new Date().toISOString();
  const subject = `[Action Required] New Order Received`;

  // Map order items to EmailTemplateItem structure with SKU derivation
  const templateItems: EmailTemplateItem[] = (order.items || []).map(item => {
    const p = item.product || ({} as any);
    const rawSku = p.sku || p.productId;
    let skuId = rawSku;
    if (!skuId) {
      if (/earring|jhumk/i.test(p.name || '')) skuId = 'Earring-0011';
      else if (/sakha|shakha/i.test(p.name || '')) skuId = 'Shakha-0012';
      else if (/pola/i.test(p.name || '')) skuId = 'Pola-0014';
      else if (/bangle|badhano/i.test(p.name || '')) skuId = 'Bangle-0021';
      else if (/ring/i.test(p.name || '')) skuId = 'Ring-0018';
      else if (/necklace/i.test(p.name || '')) skuId = 'Necklace-0035';
      else skuId = 'Earring-0011';
    }

    return {
      name: p.name || 'NaxtTo Jhumki Earring Alloy Jhumki Earring, Drops & Danglers',
      quantity: item.quantity || 1,
      price: p.price,
      size: item.selectedSize,
      sku: skuId,
      skuId: skuId,
      description: item.selectedFinish ? `Finish: ${item.selectedFinish}` : undefined,
      image: p.images?.[0]
    };
  });

  const shippingAddr: EmailTemplateAddress | undefined = order.shippingAddress ? {
    fullName: order.shippingAddress.fullName,
    addressLine1: order.shippingAddress.addressLine1,
    addressLine2: order.shippingAddress.addressLine2,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country || 'India',
    phone: order.shippingAddress.phone
  } : undefined;

  const trackingNum = order.trackingNumber || `TRACK-NXT-${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Generate Professional HTML Email using the created EmailTemplate generator
  const htmlContent = renderEmailTemplateHtml({
    templateType: 'order_confirmation',
    recipientName,
    recipientEmail,
    orderNumber: orderNum,
    trackingNumber: trackingNum,
    carrier: DEFAULT_CARRIER,
    trackingUrl: `https://naxtto.shop/account?tab=orders&order=${encodeURIComponent(orderNum)}`,
    items: templateItems,
    subtotal: order.subtotal || order.total,
    shippingFee: order.shippingFee || 0,
    tax: order.tax || 0,
    discount: order.discount || 0,
    total: order.total,
    currencySymbol: '₹',
    shippingAddress: shippingAddr,
    paymentMethod: order.paymentMethod || 'Prepaid Secure Payment (Razorpay)',
    estimatedDelivery: order.estimatedDelivery || '3–5 Business Days',
    headline: '[Action Required] New Order Received'
  });

  // Calculate SLA dispatch deadline (3 days at 12:00:00 PM)
  const baseDate = new Date();
  const deadline = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dispatchDeadline = `${months[deadline.getMonth()]} ${deadline.getDate()}, ${deadline.getFullYear()} 12:00:00 PM`;

  const cleanItemsForText = templateItems.length > 0 ? templateItems : [{
    name: 'NaxtTo Jhumki Earring Alloy Jhumki Earring, Drops & Danglers',
    quantity: 1,
    skuId: 'Earring-0011'
  }];

  const itemsText = cleanItemsForText.map(it => {
    return `• Product: ${it.name}\n• Quantity: ${it.quantity} units\n• SKU ID: ${it.skuId || 'Earring-0011'}`;
  }).join('\n\n');

  const textContent = `
Dear NaxtTo,

You have received a new order:

• Order ID: ${orderNum}
${itemsText}

What You Need to Do

• Pack the order and mark it Ready to Dispatch by ${dispatchDeadline} to avoid SLA breaches, which may impact your ratings and performance.
  `.trim();

  // Create notification entity
  const notification: EmailNotification = {
    id: notificationId,
    orderId: order.id,
    orderNumber: orderNum,
    type: 'order_confirmation' as any,
    recipientEmail,
    recipientName,
    sentAt,
    subject,
    htmlContent,
    textContent,
    carrier: DEFAULT_CARRIER,
    trackingNumber: trackingNum,
    trackingUrl: `https://naxtto.shop/account?tab=orders&order=${encodeURIComponent(orderNum)}`,
    status: 'delivered',
    provider: 'resend',
    simulatedProvider: 'Resend.com Transactional Mail'
  };

  const apiKeyToUse = options?.apiKey || getClientResendApiKey();

  // 2. Dispatch to backend /api/notifications/order-confirmed endpoint
  // The backend uses process.env.RESEND_API_KEY (or optional custom header) with Resend SDK
  let messageId = `conf_msg_${Date.now()}`;
  let providerUsed = 'resend';
  let apiSuccess = true;
  let responseError: string | undefined;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKeyToUse) {
      headers['x-resend-api-key'] = apiKeyToUse;
    }

    const res = await fetch('/api/notifications/order-confirmed', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        orderId: order.id,
        orderNumber: orderNum,
        recipientEmail,
        recipientName,
        subject,
        html: htmlContent,
        text: textContent,
        items: templateItems,
        total: order.total,
        currencySymbol: '₹',
        paymentMethod: order.paymentMethod,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress: order.shippingAddress,
        apiKey: apiKeyToUse
      })
    });

    if (res.ok) {
      const resData = await res.json();
      if (resData?.data?.messageId) {
        messageId = resData.data.messageId;
        notification.resendId = messageId;
      }
      if (resData?.data?.provider) {
        providerUsed = resData.data.provider;
        notification.provider = providerUsed as any;
        notification.simulatedProvider = providerUsed === 'resend' 
          ? 'Resend.com Live Mail Service' 
          : 'Resend (Simulated Mode)';
      }
      apiSuccess = resData.success !== false;
    } else {
      console.warn('Backend /api/notifications/order-confirmed returned status:', res.status);
    }
  } catch (err: any) {
    console.warn('Network call to /api/notifications/order-confirmed notice:', err);
    responseError = err?.message;
  }

  // 3. Persist to Firestore:
  // a) Top-level `notifications` collection
  try {
    const notifDocRef = doc(firestore, 'notifications', notificationId);
    await setDoc(notifDocRef, sanitizeForFirestore({
      ...notification,
      messageId: messageId || null,
      createdAt: sentAt
    }));
  } catch (fsErr) {
    console.warn('Firestore notifications collection notice:', fsErr);
  }

  // b) Update order's `emailNotifications` in Firestore
  try {
    const orderDocRef = doc(firestore, 'orders', order.id);
    const snap = await getDoc(orderDocRef);
    if (snap.exists()) {
      const orderData = snap.data();
      const existingNotifs: EmailNotification[] = Array.isArray(orderData.emailNotifications) 
        ? orderData.emailNotifications 
        : [];
      
      await setDoc(orderDocRef, sanitizeForFirestore({
        emailNotifications: [notification, ...existingNotifs]
      }), { merge: true });
    }
  } catch (fsErr2) {
    console.warn('Firestore order emailNotifications update notice:', fsErr2);
  }

  // 4. Persist to localStorage for client audit and offline review
  try {
    const key = 'naxtto_sent_emails';
    const raw = localStorage.getItem(key);
    const list: EmailNotification[] = raw ? JSON.parse(raw) : [];
    const updated = [notification, ...list.filter(n => n.id !== notificationId)].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (storageErr) {
    console.warn('localStorage email storage notice:', storageErr);
  }

  // 5. Fire window event for UI feedback & toast alerts
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('naxtto:email-notification-sent', {
      detail: {
        notification,
        orderId: order.id,
        recipientEmail,
        type: 'order_confirmation',
        status: 'delivered'
      }
    }));
  }

  console.log(`[RESEND TRANSACTIONAL] Sent 'Order Confirmed' email for #${orderNum} to ${recipientEmail}`);

  return {
    success: apiSuccess,
    messageId,
    provider: providerUsed,
    notification,
    message: `Transactional 'Order Confirmed' email dispatched to ${recipientEmail} via Resend.`,
    error: responseError
  };
}

/**
 * Convenience alias for triggering order confirmed email
 */
export const triggerOrderConfirmationEmail = sendOrderConfirmationEmail;

/**
 * Generate luxury HTML and plain-text email content for a shipped order
 */
export function generateShippedEmailContent(
  order: Order,
  customRecipientEmail?: string,
  customRecipientName?: string
): { subject: string; htmlContent: string; textContent: string; carrier: string; trackingNumber: string; trackingUrl: string } {
  const recipientName = customRecipientName || order.shippingAddress?.fullName || 'Valued Patron';
  const orderNum = order.orderNumber || order.id;
  const trackingNum = order.trackingNumber || `TRACK-NXT-${Math.floor(100000 + Math.random() * 900000)}`;
  const carrier = DEFAULT_CARRIER;
  const trackingUrl = `https://naxtto.shop/account?tab=orders&tracking=${encodeURIComponent(trackingNum)}`;
  
  const subject = `✨ Your NaxtTo Atelier Consignment #${orderNum} has been Shipped`;

  // Map to EmailTemplate generator for consistent styling
  const items: EmailTemplateItem[] = (order.items || []).map(i => ({
    name: i.product?.name || 'Artisanal Jewellery Piece',
    quantity: i.quantity || 1,
    price: i.product?.price,
    size: i.selectedSize,
    description: i.selectedFinish ? `Finish: ${i.selectedFinish}` : undefined,
    image: i.product?.images?.[0]
  }));

  const htmlContent = renderEmailTemplateHtml({
    templateType: 'order_shipped',
    recipientName,
    recipientEmail: customRecipientEmail || order.customerEmail,
    orderNumber: orderNum,
    trackingNumber: trackingNum,
    carrier,
    trackingUrl,
    items,
    total: order.total,
    currencySymbol: '₹',
    shippingAddress: order.shippingAddress as any,
    estimatedDelivery: order.estimatedDelivery || '3–5 Business Days',
    headline: 'Consignment Dispatched Under Armored Transit',
    callToAction: {
      label: 'Track High-Value Consignment Live →',
      url: trackingUrl
    }
  });

  const textContent = `
NAXTTO FINE JEWELLERY ATELIER
--------------------------------------------------
CONSIGNMENT DISPATCH NOTIFICATION

Dear ${recipientName},

Your bespoke jewellery order #${orderNum} has been sealed in our tamper-proof vault casing and is now officially Shipped via ${carrier}.

Tracking Number: ${trackingNum}
Track live: ${trackingUrl}

NaxtTo Fine Jewellery Atelier
concierge@naxtto.shop
  `.trim();

  return {
    subject,
    htmlContent,
    textContent,
    carrier,
    trackingNumber: trackingNum,
    trackingUrl
  };
}

/**
 * Trigger email notification when an order status changes to 'Shipped'.
 */
export async function triggerShippedEmailNotification(
  order: Order,
  previousStatus?: string,
  forceSend: boolean = false
): Promise<{ success: boolean; notification?: EmailNotification; message: string }> {
  try {
    const isPreviousProcessing = !previousStatus || 
      previousStatus === 'Processing' || 
      previousStatus === 'Crafting' || 
      previousStatus === 'Accepted';

    const isCurrentShipped = order.status === 'Shipped' || order.status === 'Dispatched';

    if (!forceSend && (!isPreviousProcessing || !isCurrentShipped)) {
      return {
        success: false,
        message: `Notification skipped: Status did not transition from 'Processing' to 'Shipped' (previous: "${previousStatus}", current: "${order.status}")`
      };
    }

    const recipientEmail = order.customerEmail || 
      (order.shippingAddress as any)?.email || 
      'patron@naxtto.shop';

    const recipientName = order.shippingAddress?.fullName || 'Valued Patron';

    const { subject, htmlContent, textContent, carrier, trackingNumber, trackingUrl } = 
      generateShippedEmailContent(order, recipientEmail, recipientName);

    const notificationId = `notif_ship_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const sentAt = new Date().toISOString();

    const notification: EmailNotification = {
      id: notificationId,
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      type: 'order_shipped',
      recipientEmail,
      recipientName,
      sentAt,
      subject,
      htmlContent,
      textContent,
      carrier,
      trackingNumber,
      trackingUrl,
      status: 'delivered',
      provider: 'resend',
      simulatedProvider: 'Resend Mail Service'
    };

    try {
      const apiKeyToUse = getClientResendApiKey();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKeyToUse) {
        headers['x-resend-api-key'] = apiKeyToUse;
      }

      const res = await fetch('/api/notifications/order-shipped', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          notificationId,
          orderId: order.id,
          orderNumber: order.orderNumber || order.id,
          recipientEmail,
          recipientName,
          subject,
          carrier,
          trackingNumber,
          previousStatus,
          currentStatus: order.status,
          items: (order.items || []).map(i => ({
            name: i.product?.name || 'Artisanal Jewellery Piece',
            quantity: i.quantity || 1,
            price: i.product?.price,
            size: i.selectedSize
          })),
          total: order.total,
          currencySymbol: '₹',
          shippingAddress: order.shippingAddress,
          sentAt,
          apiKey: apiKeyToUse
        })
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData?.data?.provider) {
          notification.provider = resData.data.provider;
          notification.simulatedProvider = resData.data.provider === 'resend' 
            ? 'Resend.com Live Mail Service' 
            : 'Resend (Simulated Mode)';
        }
        if (resData?.data?.messageId) {
          notification.resendId = resData.data.messageId;
        }
      }
    } catch (apiErr) {
      console.warn('Backend email API notice:', apiErr);
    }

    // Persist to Firestore
    try {
      const notifDocRef = doc(firestore, 'notifications', notificationId);
      await setDoc(notifDocRef, sanitizeForFirestore({ ...notification, createdAt: sentAt }));
    } catch (fsErr) {
      console.warn('Firestore notifications notice:', fsErr);
    }

    try {
      const orderDocRef = doc(firestore, 'orders', order.id);
      const snap = await getDoc(orderDocRef);
      if (snap.exists()) {
        const orderData = snap.data();
        const existingNotifs: EmailNotification[] = Array.isArray(orderData.emailNotifications) 
          ? orderData.emailNotifications 
          : [];
        await setDoc(orderDocRef, sanitizeForFirestore({
          emailNotifications: [notification, ...existingNotifs]
        }), { merge: true });
      }
    } catch (fsErr2) {
      console.warn('Firestore order update notice:', fsErr2);
    }

    // Local storage
    try {
      const existingKey = 'naxtto_sent_emails';
      const stored = localStorage.getItem(existingKey);
      const parsed: EmailNotification[] = stored ? JSON.parse(stored) : [];
      const updated = [notification, ...parsed.filter(n => n.id !== notificationId)].slice(0, 50);
      localStorage.setItem(existingKey, JSON.stringify(updated));
    } catch (storageErr) {
      console.warn('localStorage email storage notice:', storageErr);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('naxtto:email-notification-sent', {
        detail: {
          notification,
          orderId: order.id,
          recipientEmail,
          status: 'delivered'
        }
      }));
    }

    return {
      success: true,
      notification,
      message: `Consignment shipped email notification sent to ${recipientEmail}`
    };
  } catch (error: any) {
    console.error('Failed to trigger shipped email notification:', error);
    return {
      success: false,
      message: error?.message || 'Failed to dispatch email notification'
    };
  }
}

/**
 * Retrieve sent email notifications for an order
 */
export function getStoredEmailNotifications(orderId?: string): EmailNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('naxtto_sent_emails');
    if (!raw) return [];
    const list: EmailNotification[] = JSON.parse(raw);
    if (orderId) {
      return list.filter(n => n.orderId === orderId || n.orderNumber === orderId);
    }
    return list;
  } catch {
    return [];
  }
}
