import { Router, Request, Response } from 'express';
import { WowDealItem } from '../../src/types';

export const dealsRouter = Router();

export const INITIAL_WOW_DEALS: WowDealItem[] = [
  {
    id: 'rings',
    category: 'rings',
    title: 'Solitaire Rings',
    brand: 'NAXTTO DIAMONDS',
    discount: '40-60% OFF',
    tagline: 'Certified 18K Gold',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    priceNotice: 'Starting ₹4,990',
    badgeColor: '#ff3e6c',
    active: true
  },
  {
    id: 'necklaces',
    category: 'necklaces',
    title: 'Chokers & Pendants',
    brand: 'HERITAGE ATELIER',
    discount: 'MIN. 50% OFF',
    tagline: 'Handcrafted Perfection',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    priceNotice: 'Starting ₹8,490',
    badgeColor: '#ff3e6c',
    active: true
  },
  {
    id: 'earrings',
    category: 'earrings',
    title: 'Diamond Studs & Jhumkas',
    brand: 'MIA LUXE',
    discount: 'UNDER ₹9,999',
    tagline: 'Daily Sparkle',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    priceNotice: 'Best Seller',
    badgeColor: '#ff3e6c',
    active: true
  },
  {
    id: 'bracelets',
    category: 'bracelets',
    title: 'Tennis Bracelets & Bangles',
    brand: 'CARAT COUTURE',
    discount: 'FLAT 45% OFF',
    tagline: 'Hallmarked 916',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    priceNotice: 'Starting ₹12,990',
    badgeColor: '#ff3e6c',
    active: true
  },
  {
    id: 'bridal',
    category: 'bridal-combos',
    title: 'Grand Bridal Trousseau',
    brand: 'ROYAL HEIRLOOM',
    discount: '50-70% OFF',
    tagline: 'Kundan & Polki Sets',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    priceNotice: 'VIP Making Charges Free',
    badgeColor: '#ff3e6c',
    active: true
  },
  {
    id: 'coins',
    category: 'gold-badhano',
    title: '24K 999 Pure Gold Coins',
    brand: 'NAXTTO BULLION',
    discount: 'ZERO MAKING CHARGES',
    tagline: 'Tamper-Proof Certi-Card',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
    priceNotice: '1g, 5g, 10g, 50g',
    badgeColor: '#ff3e6c',
    active: true
  }
];

let wowDealsStore: WowDealItem[] = [...INITIAL_WOW_DEALS];

// GET /api/deals
dealsRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: wowDealsStore.length,
    data: wowDealsStore
  });
});

// PUT /api/deals - bulk replace deals list
dealsRouter.put('/', (req: Request, res: Response) => {
  try {
    const { deals } = req.body;
    if (!Array.isArray(deals)) {
      return res.status(400).json({ success: false, message: 'Expected an array of deals' });
    }
    wowDealsStore = deals;
    res.json({
      success: true,
      message: 'WOW deals updated successfully',
      data: wowDealsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update deals' });
  }
});

// POST /api/deals - add or update single deal
dealsRouter.post('/', (req: Request, res: Response) => {
  try {
    const deal: WowDealItem = req.body;
    if (!deal || !deal.title || !deal.discount) {
      return res.status(400).json({ success: false, message: 'Missing title or discount' });
    }
    const id = deal.id || `deal-${Date.now()}`;
    const newDeal: WowDealItem = { ...deal, id, active: deal.active !== false };
    
    const existingIndex = wowDealsStore.findIndex(d => d.id === id);
    if (existingIndex >= 0) {
      wowDealsStore[existingIndex] = newDeal;
    } else {
      wowDealsStore.push(newDeal);
    }

    res.json({
      success: true,
      data: wowDealsStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to save deal' });
  }
});

// DELETE /api/deals/:id
dealsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  wowDealsStore = wowDealsStore.filter(d => d.id !== id);
  res.json({
    success: true,
    data: wowDealsStore
  });
});

// POST /api/deals/reset
dealsRouter.post('/reset', (req: Request, res: Response) => {
  wowDealsStore = [...INITIAL_WOW_DEALS];
  res.json({
    success: true,
    message: 'Reset to default WOW deals',
    data: wowDealsStore
  });
});
