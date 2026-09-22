import { Router, Request, Response } from 'express';
import { 
  sendEmailWithResend, 
  buildShippedEmailHtml, 
  buildOrderConfirmationEmailHtml, 
  isResendConfigured, 
  getResendFromEmail 
} from '../services/resend';

export const notificationsRouter = Router();

// In-memory audit log for sent email notifications
export interface SentEmailLog {
  notificationId: string;
  orderId?: string;
  orderNumber?: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  carrier?: string;
  trackingNumber?: string;
  previousStatus?: string;
  currentStatus?: string;
  sentAt: string;
  messageId: string;
  status: 'delivered' | 'sent' | 'failed';
  provider: 'resend' | 'resend-simulated';
  error?: string;
}

const sentEmailLogs: SentEmailLog[] = [];

// GET /api/notifications/resend-status
// Checks if Resend is configured with an active API key
notificationsRouter.get('/resend-status', (req: Request, res: Response) => {
  const configured = isResendConfigured();
  const fromEmail = getResendFromEmail();

  res.json({
    success: true,
    service: 'Resend.com Email Delivery Service',
    configured,
    provider: configured ? 'resend' : 'resend-simulated',
    fromEmail,
    documentation: 'https://resend.com/docs',
    message: configured 
      ? 'Resend API key is active and ready for live mail delivery.' 
      : 'RESEND_API_KEY environment variable is not set. Resend is operating in simulated audit mode.'
  });
});

// POST /api/notifications/order-shipped
// Dispatches luxury consignment dispatched email via Resend when order transitions to Shipped
notificationsRouter.post('/order-shipped', async (req: Request, res: Response) => {
  try {
    const {
      notificationId,
      orderId,
      orderNumber,
      recipientEmail,
      recipientName,
      subject,
      carrier,
      trackingNumber,
      previousStatus,
      currentStatus,
      items,
      total,
      currencySymbol,
      shippingAddress,
      sentAt
    } = req.body;

    if (!orderId || !recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: orderId and recipientEmail are mandatory'
      });
    }

    const orderNum = orderNumber || orderId;
    const resolvedRecipientName = recipientName || 'Valued Patron';
    const resolvedCarrier = carrier || 'Blue Dart Apex Secure Armored Transit';
    const resolvedTracking = trackingNumber || `TRACK-NXT-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingUrl = `https://naxtto.shop/account?tab=orders&tracking=${encodeURIComponent(resolvedTracking)}`;
    const emailSubject = subject || `✨ Your NaxtTo Atelier Consignment #${orderNum} has been Shipped`;

    // 1. Generate Luxury HTML Template
    const html = buildShippedEmailHtml({
      orderNumber: orderNum,
      recipientName: resolvedRecipientName,
      carrier: resolvedCarrier,
      trackingNumber: resolvedTracking,
      trackingUrl,
      items: items || [],
      total,
      currencySymbol: currencySymbol || '₹',
      shippingAddress
    });

    const text = `
NaxtTo Fine Jewellery Atelier - Consignment Dispatch Notification
Order #${orderNum} has been officially shipped via ${resolvedCarrier}.
Airway Bill / Tracking: ${resolvedTracking}
Delivery destination: ${resolvedRecipientName}
Track live at: ${trackingUrl}
    `.trim();

    // 2. Dispatch with Resend.com
    const resendResult = await sendEmailWithResend({
      to: recipientEmail,
      subject: emailSubject,
      html,
      text
    });

    const timestamp = sentAt || resendResult.timestamp;
    const finalNotificationId = notificationId || `notif_${Date.now()}`;
    const messageId = resendResult.messageId || `<naxtto-ship-${orderNum}-${Date.now()}@resend.dev>`;

    const logEntry: SentEmailLog = {
      notificationId: finalNotificationId,
      orderId,
      orderNumber: orderNum,
      recipientEmail,
      recipientName: resolvedRecipientName,
      subject: emailSubject,
      carrier: resolvedCarrier,
      trackingNumber: resolvedTracking,
      previousStatus: previousStatus || 'Processing',
      currentStatus: currentStatus || 'Shipped',
      sentAt: timestamp,
      messageId,
      status: resendResult.success ? 'delivered' : 'failed',
      provider: resendResult.provider,
      error: resendResult.error
    };

    sentEmailLogs.unshift(logEntry);
    if (sentEmailLogs.length > 100) {
      sentEmailLogs.pop();
    }

    console.log(`[RESEND TRIGGER] Shipped email for #${orderNum} to ${recipientEmail} (${resendResult.provider}, id: ${messageId})`);

    return res.status(200).json({
      success: resendResult.success,
      message: resendResult.success 
        ? `Consignment email successfully dispatched to ${recipientEmail} via Resend` 
        : `Email delivery failed: ${resendResult.error}`,
      data: {
        messageId,
        provider: resendResult.provider,
        recipient: recipientEmail,
        subject: emailSubject,
        timestamp,
        status: logEntry.status,
        warning: resendResult.warning,
        error: resendResult.error
      }
    });
  } catch (error: any) {
    console.error('Email dispatch error in /api/notifications/order-shipped:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while dispatching email notification'
    });
  }
});

// POST /api/notifications/order-confirmed
// Dispatches order acquisition confirmation invoice via Resend
notificationsRouter.post('/order-confirmed', async (req: Request, res: Response) => {
  try {
    const {
      orderId,
      orderNumber,
      recipientEmail,
      recipientName,
      items,
      total,
      currencySymbol,
      paymentMethod,
      estimatedDelivery,
      shippingAddress
    } = req.body;

    if (!orderId || !recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: orderId and recipientEmail are required'
      });
    }

    const orderNum = orderNumber || orderId;
    const subject = `💎 Order Confirmation: Consignment #${orderNum} – NaxtTo Fine Jewellery`;

    const html = buildOrderConfirmationEmailHtml({
      orderNumber: orderNum,
      recipientName: recipientName || 'Valued Patron',
      total: total || 0,
      currencySymbol: currencySymbol || '₹',
      items: items || [],
      paymentMethod: paymentMethod || 'Secure Online Payment',
      estimatedDelivery: estimatedDelivery || '3–5 Business Days',
      shippingAddress
    });

    const resendResult = await sendEmailWithResend({
      to: recipientEmail,
      subject,
      html,
      text: `NaxtTo Fine Jewellery Atelier - Order Confirmation #${orderNum}. Total: ${total}. Thank you for your patronage.`
    });

    const logEntry: SentEmailLog = {
      notificationId: `notif_conf_${Date.now()}`,
      orderId,
      orderNumber: orderNum,
      recipientEmail,
      recipientName: recipientName || 'Valued Patron',
      subject,
      sentAt: resendResult.timestamp,
      messageId: resendResult.messageId || `conf_${Date.now()}`,
      status: resendResult.success ? 'delivered' : 'failed',
      provider: resendResult.provider,
      error: resendResult.error
    };

    sentEmailLogs.unshift(logEntry);

    return res.json({
      success: resendResult.success,
      message: `Confirmation email dispatched to ${recipientEmail}`,
      data: logEntry
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notifications/test-email
// Dispatches a diagnostic test email via Resend to verify connectivity
notificationsRouter.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { to, customMessage } = req.body;
    const recipient = to || 'baidyaanik18@gmail.com';
    const configured = isResendConfigured();
    const from = getResendFromEmail();

    const subject = `⚜️ Resend Mail Service Test – NaxtTo Fine Jewellery Atelier (${new Date().toLocaleTimeString()})`;
    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #faf8f5; padding: 24px; color: #1d1d1f;">
  <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; border: 1px solid #efeae1;">
    <div style="height: 3px; background: #d4af37; margin-bottom: 24px;"></div>
    <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #9e7d3b; font-weight: 700; margin-bottom: 8px;">
      NaxtTo Atelier Mail Service
    </div>
    <h2 style="margin: 0 0 16px; font-size: 20px;">Resend.com Service Connectivity Test</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
      This email verifies that your <strong>Resend.com</strong> integration on the NaxtTo Atelier platform is correctly configured and operational.
    </p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 13px;">
      <div><strong>Status:</strong> <span style="color: ${configured ? '#16a34a' : '#ea580c'}; font-weight: bold;">${configured ? 'Live Resend API Active' : 'Simulation Mode (Key Pending)'}</span></div>
      <div><strong>Sender:</strong> <span style="font-family: monospace;">${from}</span></div>
      <div><strong>Recipient:</strong> <span style="font-family: monospace;">${recipient}</span></div>
      <div><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
      ${customMessage ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;"><strong>Note:</strong> ${customMessage}</div>` : ''}
    </div>
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      Sent via Resend SDK &bull; NaxtTo Fine Jewellery Cloud Run Server
    </p>
  </div>
</body>
</html>
    `.trim();

    const result = await sendEmailWithResend({
      to: recipient,
      subject,
      html,
      text: `Resend.com Connectivity Test for NaxtTo Atelier. Sent to ${recipient} at ${new Date().toISOString()}`
    });

    const logEntry: SentEmailLog = {
      notificationId: `test_${Date.now()}`,
      recipientEmail: recipient,
      recipientName: 'Administrator / Patron',
      subject,
      sentAt: result.timestamp,
      messageId: result.messageId || `test_${Date.now()}`,
      status: result.success ? 'delivered' : 'failed',
      provider: result.provider,
      error: result.error
    };
    sentEmailLogs.unshift(logEntry);

    return res.json({
      success: result.success,
      message: result.success
        ? `Test email processed successfully for ${recipient} via ${result.provider}`
        : `Test email dispatch encountered an error: ${result.error}`,
      details: {
        configured,
        provider: result.provider,
        from,
        recipient,
        messageId: result.messageId,
        warning: result.warning,
        error: result.error
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/notifications/logs
// Retrieve audit logs of sent emails
notificationsRouter.get('/logs', (req: Request, res: Response) => {
  const { orderId } = req.query;
  if (orderId) {
    const filtered = sentEmailLogs.filter(l => l.orderId === orderId || l.orderNumber === orderId);
    return res.json({ success: true, count: filtered.length, data: filtered });
  }
  return res.json({ success: true, count: sentEmailLogs.length, data: sentEmailLogs });
});
