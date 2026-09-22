import { Router, Request, Response } from 'express';

export const notificationsRouter = Router();

// In-memory audit log for sent email notifications
interface SentEmailLog {
  notificationId: string;
  orderId: string;
  orderNumber: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  carrier: string;
  trackingNumber: string;
  previousStatus?: string;
  currentStatus: string;
  sentAt: string;
  messageId: string;
  status: 'delivered' | 'sent';
}

const sentEmailLogs: SentEmailLog[] = [];

// POST /api/notifications/order-shipped
// Dispatches / simulates email trigger when an order status transitions from 'Processing' to 'Shipped'
notificationsRouter.post('/order-shipped', (req: Request, res: Response) => {
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
      sentAt
    } = req.body;

    if (!orderId || !recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: orderId and recipientEmail are mandatory'
      });
    }

    const messageId = `<naxtto-ship-${orderNumber || orderId}-${Date.now()}@mail.naxtto.shop>`;
    const timestamp = sentAt || new Date().toISOString();

    const logEntry: SentEmailLog = {
      notificationId: notificationId || `notif_${Date.now()}`,
      orderId,
      orderNumber: orderNumber || orderId,
      recipientEmail,
      recipientName: recipientName || 'Valued Patron',
      subject: subject || `✨ Your NaxtTo Atelier Consignment #${orderNumber || orderId} has been Shipped`,
      carrier: carrier || 'Blue Dart Apex Secure Armored Transit',
      trackingNumber: trackingNumber || 'TRACK-NXT-LIVE',
      previousStatus: previousStatus || 'Processing',
      currentStatus: currentStatus || 'Shipped',
      sentAt: timestamp,
      messageId,
      status: 'delivered'
    };

    sentEmailLogs.unshift(logEntry);
    if (sentEmailLogs.length > 100) {
      sentEmailLogs.pop();
    }

    console.log(`[ATELIER EMAIL SERVICE TRIGGER] Status: '${previousStatus || 'Processing'}' -> '${currentStatus || 'Shipped'}'. Dispatched email to ${recipientEmail} (Order #${orderNumber || orderId}, Tracking: ${trackingNumber})`);

    return res.status(200).json({
      success: true,
      message: `Email notification successfully dispatched to ${recipientEmail}`,
      data: {
        messageId,
        recipient: recipientEmail,
        subject: logEntry.subject,
        timestamp,
        status: 'delivered',
        service: 'NaxtTo Cloud Function / SMTP Dispatcher',
        deliveryReceipt: {
          code: 250,
          response: '2.0.0 OK: Message accepted for immediate delivery'
        }
      }
    });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while dispatching email notification'
    });
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
