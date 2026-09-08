import { Router, Request, Response } from 'express';
import { getAllOrders, createOrderInDb, updateOrderStatusInDb } from '../../src/db/helpers';
import { Order } from '../../src/types';

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
      estimatedDelivery
    } = req.body;

    const orderItems = items || [];
    const finalTotal = total ?? totalAmount ?? 0;
    const orderId = id || `NXT-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNumber || orderId,
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Confirmed',
      items: orderItems,
      subtotal: subtotal ?? finalTotal,
      shippingFee: shippingFee ?? 0,
      discount: discount ?? 0,
      tax: tax ?? 0,
      total: finalTotal,
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
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required' });
    }

    await updateOrderStatusInDb(req.params.id, status);

    res.json({
      success: true,
      message: `Order #${req.params.id} updated to ${status}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
  }
});
