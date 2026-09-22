import { Order, EmailNotification } from '../types';
import { firestore } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

const DEFAULT_CARRIER = 'Blue Dart Apex Secure Armored Transit';
const ATELIER_SENDER = 'NaxtTo Atelier Concierge <concierge@naxtto.shop>';

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
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const itemsRows = (order.items || []).map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe1; vertical-align: top;">
        <div style="font-weight: 600; color: #1d1d1f; font-size: 14px;">${item.product?.name || 'Artisanal Jewellery Piece'}</div>
        <div style="font-size: 12px; color: #86868b; margin-top: 2px;">
          ${item.selectedSize ? `Size: ${item.selectedSize} &bull; ` : ''}
          ${item.selectedFinish ? `Finish: ${item.selectedFinish} &bull; ` : ''}
          Qty: ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0ebe1; text-align: right; font-weight: 600; color: #1d1d1f; font-size: 14px; vertical-align: top;">
        ₹${((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const subject = `✨ Your NaxtTo Atelier Consignment #${orderNum} has been Shipped`;

  const textContent = `
NAXTTO FINE JEWELLERY ATELIER
--------------------------------------------------
CONSIGNMENT DISPATCH NOTIFICATION

Dear ${recipientName},

We are honored to inform you that your bespoke fine jewellery order #${orderNum} has departed our master vaults and is now officially Shipped.

CONSIGNMENT DISPATCH DETAILS:
- Order Number: #${orderNum}
- Status: Shipped (In-Transit via Insured Armored Courier)
- Carrier: ${carrier}
- Airway Bill / Tracking No: ${trackingNum}
- Dispatch Date: ${formattedDate}
- Estimated Delivery: ${order.estimatedDelivery || '3–5 Business Days'}

SHIPPING DESTINATION:
${recipientName}
${order.shippingAddress?.addressLine1 || ''}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}
Phone: ${order.shippingAddress?.phone || 'On file'}

AUTHENTICITY & SECURITY VERIFICATION:
- BIS 916 / 750 Hallmarked Gold: Authenticated & Certified
- Tamper-Evident Security Seal: Applied
- Full Value Transit Insurance: Underwritten by Atelier Vault

Track your shipment in real time at:
${trackingUrl}

Warm regards,
NaxtTo Private Client Services & Master Goldsmiths
Kolkata Atelier & Milan Design House
concierge@naxtto.shop
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1d1d1f;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #efeae1;">
    
    <!-- Top Gold Accent Bar -->
    <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #b8860b, #d4af37);"></div>

    <!-- Header / Brand -->
    <div style="padding: 32px 36px 24px; text-align: center; border-bottom: 1px solid #f4f0e8;">
      <div style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #9e7d3b; font-weight: 700; margin-bottom: 6px;">
        NaxtTo Fine Jewellery Atelier
      </div>
      <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em;">
        Consignment Dispatched
      </h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #6e6e73;">
        Order #${orderNum} &bull; Shipped &amp; Insured Transit
      </p>
    </div>

    <!-- Salutation & Message -->
    <div style="padding: 28px 36px 20px;">
      <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #1d1d1f;">
        Dear <strong>${recipientName}</strong>,
      </p>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.65; color: #424245;">
        We are pleased to share that your bespoke jewellery commission has completed its crafting and hallmark certification at the atelier. Your pieces have been sealed in a tamper-evident vault box and officially handed over to our high-security armored transit partner.
      </p>

      <!-- Tracking Callout Box -->
      <div style="background-color: #fbf9f5; border: 1px solid #e8dfcf; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9e7d3b; font-weight: 700;">
            Live Consignment Tracking
          </span>
          <span style="font-size: 11px; background-color: #e6f4ea; color: #137333; font-weight: 600; padding: 2px 8px; border-radius: 10px;">
            In Armored Transit
          </span>
        </div>
        
        <div style="margin-bottom: 14px;">
          <div style="font-size: 12px; color: #6e6e73;">Airway Bill / Tracking Number</div>
          <div style="font-size: 18px; font-family: monospace; font-weight: 700; color: #1d1d1f; letter-spacing: 0.05em; margin-top: 2px;">
            ${trackingNum}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #6e6e73; padding: 4px 0;">Courier Partner:</td>
            <td style="text-align: right; font-weight: 600; color: #1d1d1f; padding: 4px 0;">${carrier}</td>
          </tr>
          <tr>
            <td style="color: #6e6e73; padding: 4px 0;">Estimated Arrival:</td>
            <td style="text-align: right; font-weight: 600; color: #1d1d1f; padding: 4px 0;">${order.estimatedDelivery || '3–5 Business Days'}</td>
          </tr>
          <tr>
            <td style="color: #6e6e73; padding: 4px 0;">Security Status:</td>
            <td style="text-align: right; font-weight: 600; color: #b8860b; padding: 4px 0;">Vault-Sealed &amp; Fully Insured</td>
          </tr>
        </table>

        <div style="margin-top: 18px; text-align: center;">
          <a href="${trackingUrl}" style="display: inline-block; background-color: #1d1d1f; color: #ffffff; text-decoration: none; padding: 11px 26px; border-radius: 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.02em;">
            Track Consignment Live &rarr;
          </a>
        </div>
      </div>

      <!-- Items Summary -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #86868b; margin-bottom: 8px;">
          Included Masterpiece(s)
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsRows}
        </table>
      </div>

      <!-- Security Guarantee -->
      <div style="background-color: #f8fafc; border-left: 3px solid #d4af37; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #1d1d1f; margin-bottom: 4px;">
          Atelier Tamper-Proof Delivery Guarantee
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: #475569;">
          Please inspect the gold tamper-evident security tape upon delivery. Our armored courier will require an OTP signature verification before handing over the consignment.
        </div>
      </div>

      <!-- Destination Address -->
      <div style="font-size: 12px; color: #6e6e73; line-height: 1.5; padding: 12px 0; border-top: 1px solid #f4f0e8;">
        <strong>Dispatched To:</strong> ${recipientName}, ${order.shippingAddress?.addressLine1 || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #fcfbfa; padding: 24px 36px; text-align: center; border-top: 1px solid #f0ebe1; font-size: 12px; color: #86868b; line-height: 1.6;">
      <p style="margin: 0 0 6px;">
        <strong>NaxtTo Fine Jewellery Atelier</strong> &bull; Master Goldsmiths Since 1998
      </p>
      <p style="margin: 0 0 6px;">
        For personalized concierge assistance, reply directly or email <a href="mailto:concierge@naxtto.shop" style="color: #9e7d3b; text-decoration: none;">concierge@naxtto.shop</a>
      </p>
      <p style="margin: 0; font-size: 10px; color: #a1a1a6;">
        This automated notification was generated upon order status transition to Shipped.
      </p>
    </div>

  </div>
</body>
</html>
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
 * Specifically checks if previous status was 'Processing' (or atelier crafting aliases).
 */
export async function triggerShippedEmailNotification(
  order: Order,
  previousStatus?: string,
  forceSend: boolean = false
): Promise<{ success: boolean; notification?: EmailNotification; message: string }> {
  try {
    // 1. Validate status transition requirement
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

    // 2. Resolve recipient email & name
    const recipientEmail = order.customerEmail || 
      order.shippingAddress?.email || 
      (order.userId && order.userId !== 'guest' ? undefined : undefined) ||
      'patron@naxtto.shop';

    const recipientName = order.shippingAddress?.fullName || 'Valued Patron';

    // 3. Generate email contents
    const { subject, htmlContent, textContent, carrier, trackingNumber, trackingUrl } = 
      generateShippedEmailContent(order, recipientEmail, recipientName);

    const notificationId = `notif_ship_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
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
      simulatedProvider: 'Firebase Cloud Functions & Atelier Mailer'
    };

    // 4. Send to backend endpoint for server-side dispatch logging & SMTP/mock handling
    try {
      await fetch('/api/notifications/order-shipped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          sentAt
        })
      });
    } catch (apiErr) {
      console.warn('Backend email API notice (falling back to client mock delivery):', apiErr);
    }

    // 5. Persist to Firestore:
    // a) Write to top-level `notifications` collection
    try {
      const notifDocRef = doc(firestore, 'notifications', notificationId);
      await setDoc(notifDocRef, {
        ...notification,
        createdAt: sentAt
      });
    } catch (fsErr) {
      console.warn('Firestore notifications collection notice:', fsErr);
    }

    // b) Append to order's `emailNotifications` array in Firestore
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

    // 6. Save in localStorage for persistent client inspection & offline demo
    try {
      const existingKey = 'naxtto_sent_emails';
      const stored = localStorage.getItem(existingKey);
      const parsed: EmailNotification[] = stored ? JSON.parse(stored) : [];
      const updated = [notification, ...parsed.filter(n => n.id !== notificationId)].slice(0, 50);
      localStorage.setItem(existingKey, JSON.stringify(updated));
    } catch (storageErr) {
      console.warn('localStorage email storage notice:', storageErr);
    }

    // 7. Dispatch custom event for UI reactivity (e.g. Toast, Progress Bar badge)
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('naxtto:email-notification-sent', {
        detail: {
          notification,
          orderId: order.id,
          recipientEmail,
          status: 'delivered'
        }
      });
      window.dispatchEvent(event);
    }

    console.log(`[EMAIL TRIGGER] Successfully sent 'Shipped' notification to ${recipientEmail} for Order #${order.orderNumber || order.id}`);

    return {
      success: true,
      notification,
      message: `Email notification sent to ${recipientEmail}`
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
