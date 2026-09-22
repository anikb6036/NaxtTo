import { Router, Request, Response } from 'express';
import { getAllOrders, createOrderInDb, updateOrderStatusInDb } from '../../src/db/helpers';
import { Order } from '../../src/types';
import { 
  sendEmailWithResend, 
  buildOrderConfirmationEmailHtml, 
  buildShippedEmailHtml 
} from '../services/resend';

export const ordersRouter = Router();

// GET /api/orders - list all orders
ordersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
});

// POST /api/orders - create new order
ordersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      id,
      orderNumber,
      date,
      status,
      items, 
      total, 
      totalAmount, 
      subtotal, 
      shippingFee, 
      tax, 
      discount, 
      shippingAddress, 
      trackingNumber,
      paymentMethod,
      estimatedDelivery,
      customerEmail
    } = req.body;

    const orderItems = items || [];
    const finalTotal = total ?? totalAmount ?? 0;
    const orderId = id || `NXT-${Date.now().toString().slice(-6)}`;
    const resolvedOrderNumber = orderNumber || orderId;

    const newOrder: Order = {
      id: orderId,
      orderNumber: resolvedOrderNumber,
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Confirmed',
      items: orderItems,
      subtotal: subtotal ?? finalTotal,
      shippingFee: shippingFee ?? 0,
      discount: discount ?? 0,
      tax: tax ?? 0,
      total: finalTotal,
      customerEmail: customerEmail || (shippingAddress as any)?.email,
      shippingAddress: shippingAddress || {
        fullName: 'Patron of the Atelier',
        addressLine1: 'Via Montenapoleone 8',
        city: 'Milan',
        state: 'Lombardy',
        postalCode: '20121',
        country: 'Italy',
        phone: '+39 02 8765 4321'
      },
      trackingNumber: trackingNumber || `TRACK-NXT-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: paymentMethod || 'Razorpay Online',
      estimatedDelivery: estimatedDelivery || '3-5 Business Days'
    };

    const saved = await createOrderInDb(newOrder);

    // Send Order Confirmation Receipt via Resend.com
    const recipientEmail = customerEmail || (newOrder.shippingAddress as any)?.email;
    if (recipientEmail && recipientEmail.includes('@')) {
      try {
        const confirmHtml = buildOrderConfirmationEmailHtml({
          orderNumber: resolvedOrderNumber,
          recipientName: newOrder.shippingAddress?.fullName || 'Valued Patron',
          total: finalTotal,
          items: (orderItems || []).map((i: any) => ({
            name: i.product?.name || 'Artisanal Jewellery Piece',
            quantity: i.quantity || 1,
            price: i.product?.price,
            size: i.selectedSize
          })),
          paymentMethod: newOrder.paymentMethod,
          estimatedDelivery: newOrder.estimatedDelivery,
          shippingAddress: newOrder.shippingAddress
        });

        sendEmailWithResend({
          to: recipientEmail,
          subject: `💎 Order Confirmation: Consignment #${resolvedOrderNumber} – NaxtTo Fine Jewellery`,
          html: confirmHtml,
          text: `Thank you for your order #${resolvedOrderNumber}. Total: ₹${finalTotal.toLocaleString('en-IN')}. We are preparing your jewellery piece.`
        }).catch(err => console.warn('Resend order confirmation dispatch warning:', err));
      } catch (mailErr) {
        console.warn('Error constructing order confirmation email:', mailErr);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully and registered in atelier ledger',
      data: saved
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
  }
});

// PATCH /api/orders/:id/status - update status
ordersRouter.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, carrier, trackingNumber, customerEmail } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required' });
    }

    const all = await getAllOrders();
    const existing = all.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    const previousStatus = existing?.status || 'Processing';

    await updateOrderStatusInDb(req.params.id, status);

    let emailDispatched = false;
    let emailNotice = undefined;

    // Check email notification trigger: Processing -> Shipped
    const isFromProcessing = previousStatus === 'Processing' || previousStatus === 'Crafting' || previousStatus === 'Accepted';
    const isToShipped = status === 'Shipped' || status === 'Dispatched';

    if (isFromProcessing && isToShipped) {
      const recipient = customerEmail || existing?.customerEmail || (existing?.shippingAddress as any)?.email || 'patron@naxtto.shop';
      const orderNum = existing?.orderNumber || req.params.id;
      const resolvedCarrier = carrier || 'Blue Dart Apex Secure Armored Transit';
      const resolvedTracking = trackingNumber || existing?.trackingNumber || `TRACK-NXT-${req.params.id}`;
      const trackingUrl = `https://naxtto.shop/account?tab=orders&tracking=${encodeURIComponent(resolvedTracking)}`;

      console.log(`[BACKEND RESEND TRIGGER] Order #${req.params.id} transitioned from '${previousStatus}' to '${status}'. Triggering Shipped email via Resend to ${recipient}`);

      try {
        const shippedHtml = buildShippedEmailHtml({
          orderNumber: orderNum,
          recipientName: existing?.shippingAddress?.fullName || 'Valued Patron',
          carrier: resolvedCarrier,
          trackingNumber: resolvedTracking,
          trackingUrl,
          items: (existing?.items || []).map((i: any) => ({
            name: i.product?.name || 'Artisanal Jewellery Piece',
            quantity: i.quantity || 1,
            price: i.product?.price,
            size: i.selectedSize
          })),
          total: existing?.total,
          currencySymbol: '₹',
          shippingAddress: existing?.shippingAddress
        });

        const resendRes = await sendEmailWithResend({
          to: recipient,
          subject: `✨ Your NaxtTo Atelier Consignment #${orderNum} has been Shipped`,
          html: shippedHtml,
          text: `Your NaxtTo consignment #${orderNum} has been shipped via ${resolvedCarrier}. Tracking: ${resolvedTracking}. Track at ${trackingUrl}`
        });

        emailDispatched = resendRes.success;
        emailNotice = {
          recipient,
          subject: `✨ Your NaxtTo Atelier Consignment #${orderNum} has been Shipped`,
          carrier: resolvedCarrier,
          trackingNumber: resolvedTracking,
          provider: resendRes.provider,
          messageId: resendRes.messageId,
          error: resendRes.error
        };
      } catch (err: any) {
        console.warn('Resend consignment dispatch warning:', err);
      }
    }

    res.json({
      success: true,
      message: `Order #${req.params.id} updated to ${status}`,
      previousStatus,
      newStatus: status,
      emailNotificationDispatched: emailDispatched,
      emailNotification: emailNotice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
  }
});
