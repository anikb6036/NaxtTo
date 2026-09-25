import { Router, Request, Response } from 'express';
import { SeoSettings, DEFAULT_SEO_SETTINGS } from '../../src/types';

export const seoRouter = Router();

let seoSettingsStore: SeoSettings = { ...DEFAULT_SEO_SETTINGS };

// GET /api/seo - Fetch current dynamic SEO settings
seoRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: seoSettingsStore,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/seo - Update dynamic SEO settings
seoRouter.put('/', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload: settings object expected' });
    }

    seoSettingsStore = {
      ...seoSettingsStore,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'SEO settings updated successfully on server',
      data: seoSettingsStore
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update SEO settings'
    });
  }
});

// POST /api/seo/reset - Reset SEO settings to Atelier defaults
seoRouter.post('/reset', (req: Request, res: Response) => {
  try {
    seoSettingsStore = {
      ...DEFAULT_SEO_SETTINGS,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'SEO settings reset to default Atelier configuration',
      data: seoSettingsStore
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to reset SEO settings'
    });
  }
});
