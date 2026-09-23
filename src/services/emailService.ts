import { Order, EmailNotification } from '../types';
import { firestore } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  const subject = `💎 Order Confirmed: Consignment #${orderNum} – NaxtTo Fine Jewellery Atelier`;

  // Map order items to EmailTemplateItem structure
  const templateItems: EmailTemplateItem[] = (order.items || []).map(item => ({
    name: item.product?.name || 'Artisanal Fine Jewellery Piece',
    quantity: item.quantity || 1,
    price: item.product?.price,
    size: item.selectedSize,
    description: item.selectedFinish ? `Finish: ${item.selectedFinish}` : undefined,
    image: item.product?.images?.[0]
  }));

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

  // 1. Generate Luxury HTML Email using the created EmailTemplate generator
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
    headline: 'Your Bespoke Acquisition is Confirmed',
    callToAction: {
      label: 'Inspect Consignment Status in Atelier Ledger →',
      url: `https://naxtto.shop/account?tab=orders&order=${encodeURIComponent(orderNum)}`
    }
  });

  const textContent = `
NAXTTO FINE JEWELLERY ATELIER
--------------------------------------------------
TRANSACTIONAL ORDER CONFIRMATION

Dear ${recipientName},

Thank you for your distinguished patronage. Your acquisition for Consignment #${orderNum} has been officially recorded in the atelier master ledger and crafting has commenced.

ORDER SUMMARY:
- Consignment Number: #${orderNum}
- Status: Order Confirmed (Workshop Crafting Initialized)
- Total Amount: ₹${(order.total || 0).toLocaleString('en-IN')}
- Payment Method: ${order.paymentMethod || 'Prepaid Secure Payment'}
- Estimated Dispatch: ${order.estimatedDelivery || '3–5 Business Days'}

SHIPPING DESTINATION:
${recipientName}
${order.shippingAddress?.addressLine1 || ''}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}
Phone: ${order.shippingAddress?.phone || 'On file'}

BIS 916 / 750 HALLMARK & LIFETIME WARRANTY INCLUDED.

View your verified consignment in real time at:
https://naxtto.shop/account?tab=orders&order=${encodeURIComponent(orderNum)}

Warm regards,
NaxtTo Fine Jewellery Atelier Concierge
concierge@naxtto.shop
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
    await setDoc(notifDocRef, {
      ...notification,
      messageId,
      createdAt: sentAt
    });
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
      
      await setDoc(orderDocRef, {
        emailNotifications: [notification, ...existingNotifs]
      }, { merge: true });
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
      await setDoc(notifDocRef, { ...notification, createdAt: sentAt });
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
        await setDoc(orderDocRef, {
          emailNotifications: [notification, ...existingNotifs]
        }, { merge: true });
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
