import { Router, Request, Response } from 'express';
import { HeroBannerSlide } from '../../src/types';

export const heroBannerRouter = Router();

export const INITIAL_HERO_SLIDES: HeroBannerSlide[] = [
  {
    id: 'slide-payday',
    image: '/src/assets/images/payday_hero_model_1788375869668.jpg',
    title: 'FLAT 20% OFF',
    subtitle: 'Additional 5% Cashback on Silver Jewellery',
    badge: 'SALE',
    couponCode: 'PAYDAY',
    buttonText: 'SHOP NOW',
    note: '*T&C APPLY',
    bgGradient: 'from-[#eb2377] via-[#e61d72] to-[#c7135e]',
    accentColor: '#FFFFFF',
    type: 'payday',
    targetCategory: 'all',
    active: true
  },
  {
    id: 'slide-sakha-pola',
    image: '/src/assets/images/sakha_pola_banner_1789477939234.jpg',
    title: '22K GOLD BADHANO',
    subtitle: 'Handcrafted Shankha & Coral Pola with Certified Hallmark Gold',
    badge: 'Royal Bengali Heritage',
    buttonText: 'SHOP GOLD BADHANO',
    note: '*100% BIS HALLMARK CERTIFIED',
    bgGradient: 'from-[#320612] via-[#24030d] to-[#1a0108]',
    accentColor: '#FFD700',
    type: 'sakha-pola',
    targetCategory: 'gold-badhano',
    active: true
  },
  {
    id: 'slide-bridal-combos',
    image: '/src/assets/images/bengali_bridal_bangles_1789477964190.jpg',
    title: 'Bridal Shankha Pola',
    subtitle: 'The sacred tradition of Bengali matrimony crafted with pure conch shell, coral & 22K gold',
    badge: 'Bengali Wedding Special',
    buttonText: 'EXPLORE BRIDAL COMBOS',
    note: 'Certified Artisan Craft',
    bgGradient: 'from-[#2e0510] via-[#20020a] to-[#180107]',
    accentColor: '#FFFFFF',
    type: 'bridal-combos',
    targetCategory: 'bridal-combos',
    active: true
  },
  {
    id: 'slide-loha-badhano',
    image: '/src/assets/images/loha_badhano_banner_1789477986635.jpg',
    title: 'Artisan Loha Badhano',
    subtitle: 'Pure iron core bound in 22K hallmarked gold filigree with matching handcrafted Pola',
    badge: 'Auspicious Protection',
    buttonText: 'SHOP LOHA BADHANO',
    note: 'Pure 22K Hallmarked Filigree',
    bgGradient: 'from-[#340715] via-[#23030d] to-[#190208]',
    accentColor: '#FFAEC0',
    type: 'loha-badhano',
    targetCategory: 'loha-badhano',
    active: true
  }
];

let heroSlidesStore: HeroBannerSlide[] = [...INITIAL_HERO_SLIDES];

// GET /api/hero-banners
heroBannerRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: heroSlidesStore.length,
    data: heroSlidesStore
  });
});

// PUT /api/hero-banners
heroBannerRouter.put('/', (req: Request, res: Response) => {
  try {
    const { slides } = req.body;
    if (Array.isArray(slides)) {
      heroSlidesStore = slides;
    }
    res.json({
      success: true,
      message: 'Hero banners updated successfully',
      data: heroSlidesStore
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update hero banners' });
  }
});

// POST /api/hero-banners/reset
heroBannerRouter.post('/reset', (req: Request, res: Response) => {
  heroSlidesStore = [...INITIAL_HERO_SLIDES];
  res.json({
    success: true,
    message: 'Hero banners reset to Atelier default collection',
    data: heroSlidesStore
  });
});
