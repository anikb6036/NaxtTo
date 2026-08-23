import { Router, Request, Response } from 'express';
import { subscribeNewsletterInDb } from '../../src/db/helpers';
import { db } from '../../src/db';
import { newsletterSubscribers } from '../../src/db/schema';
import { desc } from 'drizzle-orm';

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
    const list = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch subscribers' });
  }
});
