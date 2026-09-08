import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const paymentRouter = Router();

// Lazy or safe getter for Razorpay instance
function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TZC5OuxpUn3JdQ';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'JinFw1XBEzP5Tc92gElwP7do';
  return {
    client: new Razorpay({ key_id, key_secret }),
    key_id,
    key_secret
  };
}

// GET /api/payment/config - returns the public Razorpay Key ID
paymentRouter.get('/config', (req: Request, res: Response) => {
  const { key_id } = getRazorpayClient();
  res.json({
    success: true,
    keyId: key_id
  });
});

// POST /api/payment/create-order - creates an official order on Razorpay servers
paymentRouter.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount for Razorpay order'
      });
    }

    const { client, key_id } = getRazorpayClient();

    // Razorpay requires amount in the smallest currency sub-unit (paise for INR, cents for USD)
    // 1 INR = 100 paise
    const amountInSubunits = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInSubunits,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
      notes: notes || {
        store: 'NaxtTo Fine Jewellery Atelier',
        platform: 'Web Checkout'
      }
    };

    const razorpayOrder = await client.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      keyId: key_id
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({
      success: false,
      message: error.error?.description || error.message || 'Failed to initialize Razorpay order'
    });
  }
});

// POST /api/payment/verify - cryptographically verifies the payment signature
paymentRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay verification parameters'
      });
    }

    const { key_secret } = getRazorpayClient();

    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Razorpay signature verification failed. Transaction was not authenticated.'
      });
    }

    res.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Payment verified successfully by NaxtTo Atelier gateway'
    });
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error occurred during payment verification'
    });
  }
});
