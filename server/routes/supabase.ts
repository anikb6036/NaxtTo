import { Router, Request, Response } from 'express';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  saveProductToSupabase,
  saveOrderToSupabase,
  SUPABASE_SQL_SCHEMA
} from '../db/supabase';
import { getAllProducts, getAllOrders, getNewsletterSubscribersFromDb } from '../../src/db/helpers';
import { INITIAL_PRODUCTS } from '../../src/data/mockData';

export const supabaseRouter = Router();

// GET /api/supabase/status - Test connection & get schema instructions
supabaseRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const configured = isSupabaseConfigured();
    const connection = await testSupabaseConnection();

    res.json({
      success: true,
      data: {
        configured,
        connected: connection.connected,
        url: connection.url || null,
        tables: connection.tables || { products: false, orders: false, newsletter: false },
        error: connection.error || null,
        schemaSql: SUPABASE_SQL_SCHEMA
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check Supabase status'
    });
  }
});

// POST /api/supabase/sync - Seed or sync existing products and orders into Supabase
supabaseRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Supabase is not configured. Please define SUPABASE_URL and SUPABASE_ANON_KEY in Settings.'
      });
    }

    const currentProducts = await getAllProducts();
    const productsToSync = currentProducts.length > 0 ? currentProducts : INITIAL_PRODUCTS;
    const currentOrders = await getAllOrders();

    let syncedProductsCount = 0;
    for (const p of productsToSync) {
      const ok = await saveProductToSupabase(p);
      if (ok) syncedProductsCount++;
    }

    let syncedOrdersCount = 0;
    for (const o of currentOrders) {
      const ok = await saveOrderToSupabase(o);
      if (ok) syncedOrdersCount++;
    }

    res.json({
      success: true,
      message: `Successfully synchronized ${syncedProductsCount} products and ${syncedOrdersCount} orders to Supabase cloud storage.`,
      syncedProductsCount,
      syncedOrdersCount
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync to Supabase'
    });
  }
});

// GET /api/supabase/backup - Download complete JSON backup
supabaseRouter.get('/backup', async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    const orders = await getAllOrders();
    const subscribers = await getNewsletterSubscribersFromDb();

    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      atelier: 'NaxtTo Fine Jewellery',
      counts: {
        products: products.length,
        orders: orders.length,
        subscribers: subscribers.length
      },
      data: {
        products,
        orders,
        subscribers
      }
    };

    res.setHeader('Content-Disposition', `attachment; filename="naxtto-backup-${Date.now()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.json(backup);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export backup'
    });
  }
});
