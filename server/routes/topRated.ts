import { Router, Request, Response } from 'express';
import { TopRatedItem } from '../../src/types';

export const topRatedRouter = Router();

export const INITIAL_TOP_RATED: TopRatedItem[] = [
  {
    id: 'gold-chains',
    title: 'Solid Gold Chains',
    subtitle: "Don't Miss",
    price: 'From ₹4,990',
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    badge: 'Bestseller',
    badgeColor: '#388e3c',
    active: true
  },
  {
    id: 'solitaire-studs',
    title: 'Solitaire Studs',
    subtitle: 'Flat 35% Off',
    price: 'From ₹7,490',
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    badge: 'Top Pick',
    badgeColor: '#388e3c',
    active: true
  },
  {
    id: 'tennis-bracelets',
    title: 'Tennis Bracelets',
    subtitle: 'Popular',
    price: 'From ₹12,990',
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80',
    badge: 'Trending',
    badgeColor: '#388e3c',
    active: true
  },
  {
    id: 'bridal-chokers',
    title: 'Bridal Chokers',
    subtitle: 'Milan Atelier',
    price: 'From ₹18,990',
    category: 'fine-collections',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    badge: 'Heritage',
    badgeColor: '#388e3c',
    active: true
  }
];

let topRatedStore: TopRatedItem[] = [...INITIAL_TOP_RATED];
let topRatedHeaderStore = {
  title: 'Top Rated in Fine Jewellery',
  subtitle: 'Certified 18K Hallmarked pieces trusted by 10,000+ patrons',
  buttonText: 'VIEW ALL'
};

// GET /api/top-rated
topRatedRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: topRatedStore.length,
    data: topRatedStore,
    header: topRatedHeaderStore
  });
});

// PUT /api/top-rated
topRatedRouter.put('/', (req: Request, res: Response) => {
  try {
    const { items, header } = req.body;
    if (Array.isArray(items)) {
      topRatedStore = items;
    }
    if (header && typeof header === 'object') {
      topRatedHeaderStore = {
        ...topRatedHeaderStore,
        ...header
      };
    }
    res.json({
      success: true,
      message: 'Top Rated collection updated successfully',
      data: topRatedStore,
      header: topRatedHeaderStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update top rated collection' });
  }
});

// POST /api/top-rated/reset
topRatedRouter.post('/reset', (req: Request, res: Response) => {
  topRatedStore = [...INITIAL_TOP_RATED];
  topRatedHeaderStore = {
    title: 'Top Rated in Fine Jewellery',
    subtitle: 'Certified 18K Hallmarked pieces trusted by 10,000+ patrons',
    buttonText: 'VIEW ALL'
  };
  res.json({
    success: true,
    message: 'Reset to default top rated collection',
    data: topRatedStore,
    header: topRatedHeaderStore
  });
});
