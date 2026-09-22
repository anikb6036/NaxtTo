import { Router, Request, Response } from 'express';
import { subscribeNewsletterInDb, getNewsletterSubscribersFromDb } from '../../src/db/helpers';
import { sendEmailWithResend, buildNewsletterWelcomeEmailHtml } from '../services/resend';

export const newsletterRouter = Router();

// POST /api/newsletter/subscribe - subscribe
newsletterRouter.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    await subscribeNewsletterInDb(cleanEmail);

    // Send luxury welcome email via Resend
    try {
      const welcomeHtml = buildNewsletterWelcomeEmailHtml(cleanEmail);
      sendEmailWithResend({
        to: cleanEmail,
        subject: '⚜️ Welcome to NaxtTo Atelier Privé – Fine Jewellery Digest',
        html: welcomeHtml,
        text: `Welcome to NaxtTo Atelier Privé. Your subscription is active. Receive exclusive previews on handcrafted heritage jewellery.`
      }).catch(err => console.warn('Newsletter welcome dispatch notice:', err));
    } catch (mailErr) {
      console.warn('Newsletter welcome email error:', mailErr);
    }

    res.json({
      success: true,
      message: 'Thank you for subscribing to the NaxtTo private salon digest and archival releases.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Subscription failed' });
  }
});

// GET /api/newsletter/subscribers - for admin
newsletterRouter.get('/subscribers', async (req: Request, res: Response) => {
  try {
    const list = await getNewsletterSubscribersFromDb();
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch subscribers' });
  }
});
