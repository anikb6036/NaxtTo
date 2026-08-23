import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { authRouter } from './routes/auth';
import { newsletterRouter } from './routes/newsletter';
import { aiRouter } from './routes/ai';

export function createExpressApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Mount API routers
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/ai', aiRouter);

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
