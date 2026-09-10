import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { authRouter } from './routes/auth';
import { newsletterRouter } from './routes/newsletter';
import { aiRouter } from './routes/ai';
import { paymentRouter } from './routes/payment';
import { supabaseRouter } from './routes/supabase';

export function createExpressApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Healthcheck & Metadata endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      brand: 'NaxtTo Fine Jewellery Atelier',
      platform: 'Vercel / Cloud Run Fullstack Server',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // SEO & Crawler Directives
  app.get('/robots.txt', (req: Request, res: Response) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nHost: https://naxtto.shop\nSitemap: https://naxtto.shop/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://naxtto.shop/</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?category=rings</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?category=necklaces</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?category=earrings</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?category=bracelets</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?view=story</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?view=materials</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://naxtto.shop/?view=journal</loc>
    <lastmod>2026-09-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
  });

  // Mount API routers
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/supabase', supabaseRouter);

  // Global API 404 handler
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found on NaxtTo Backend API',
      path: req.originalUrl
    });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Atelier Server Error'
    });
  });

  return app;
}

export const app = createExpressApp();
