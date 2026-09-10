import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order } from '../../src/types';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization for Supabase client.
 * Does not throw if credentials are not yet defined.
 */
export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return supabaseClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  configured: boolean;
  url?: string;
  tables?: { products: boolean; orders: boolean; newsletter: boolean };
  error?: string;
}> {
  const configured = isSupabaseConfigured();
  if (!configured) {
    return {
      connected: false,
      configured: false,
      error: 'SUPABASE_URL or SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY not configured in environment variables.'
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      configured: true,
      error: 'Supabase client initialization failed.'
    };
  }

  try {
    // Check if products table exists
    const { error: prodErr } = await client.from('products').select('id').limit(1);
    const { error: ordErr } = await client.from('orders').select('id').limit(1);
    const { error: newsErr } = await client.from('newsletter_subscribers').select('id').limit(1);

    const tables = {
      products: !prodErr,
      orders: !ordErr,
      newsletter: !newsErr
    };

    return {
      connected: !prodErr || !ordErr,
      configured: true,
      url: process.env.SUPABASE_URL,
      tables,
      error: prodErr ? prodErr.message : undefined
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      url: process.env.SUPABASE_URL,
      error: err.message || 'Error connecting to Supabase'
    };
  }
}

// ---------------- PRODUCTS ----------------

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts warning:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      subtitle: r.subtitle || undefined,
      price: Number(r.price),
      originalPrice: r.original_price ? Number(r.original_price) : undefined,
      category: r.category,
      metal: r.metal,
      metalName: r.metal_name || undefined,
      style: r.style,
      styleName: r.style_name || undefined,
      images: Array.isArray(r.images) ? r.images : [],
      description: r.description || '',
      story: r.story || undefined,
      features: Array.isArray(r.features) ? r.features : [],
      dimensions: r.dimensions || undefined,
      karatPurity: r.karat_purity || undefined,
      origin: r.origin || undefined,
      inStock: r.in_stock ?? true,
      stockCount: r.stock_count ?? 1,
      isBestSeller: r.is_best_seller ?? false,
      isNewArrival: r.is_new_arrival ?? false,
      rating: Number(r.rating) || 5,
      reviewsCount: Number(r.reviews_count) || 0,
      availableSizes: Array.isArray(r.available_sizes) ? r.available_sizes : [],
      availableFinishes: Array.isArray(r.available_finishes) ? r.available_finishes : [],
      reviews: Array.isArray(r.reviews) ? r.reviews : []
    }));
  } catch (err) {
    console.warn('Supabase fetchProducts error:', err);
    return null;
  }
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const row = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle || null,
      price: product.price,
      original_price: product.originalPrice || null,
      category: product.category,
      metal: product.metal,
      metal_name: product.metalName || null,
      style: product.style,
      style_name: product.styleName || null,
      images: product.images || [],
      description: product.description || '',
      story: product.story || null,
      features: product.features || [],
      dimensions: product.dimensions || null,
      karat_purity: product.karatPurity || null,
      origin: product.origin || null,
      in_stock: product.inStock ?? true,
      stock_count: product.stockCount ?? 1,
      is_best_seller: product.isBestSeller ?? false,
      is_new_arrival: product.isNewArrival ?? false,
      rating: product.rating || 5,
      reviews_count: product.reviewsCount || 0,
      available_sizes: product.availableSizes || [],
      available_finishes: product.availableFinishes || [],
      reviews: product.reviews || [],
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('products').upsert(row);
    if (error) {
      console.warn('Supabase saveProduct warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveProduct error:', err);
    return false;
  }
}

export async function updateProductInSupabase(id: string, updates: Partial<Product>): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.metal !== undefined) payload.metal = updates.metal;
    if (updates.metalName !== undefined) payload.metal_name = updates.metalName;
    if (updates.style !== undefined) payload.style = updates.style;
    if (updates.styleName !== undefined) payload.style_name = updates.styleName;
    if (updates.images !== undefined) payload.images = updates.images;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.story !== undefined) payload.story = updates.story;
    if (updates.features !== undefined) payload.features = updates.features;
    if (updates.dimensions !== undefined) payload.dimensions = updates.dimensions;
    if (updates.karatPurity !== undefined) payload.karat_purity = updates.karatPurity;
    if (updates.origin !== undefined) payload.origin = updates.origin;
    if (updates.inStock !== undefined) payload.in_stock = updates.inStock;
    if (updates.stockCount !== undefined) payload.stock_count = updates.stockCount;
    if (updates.isBestSeller !== undefined) payload.is_best_seller = updates.isBestSeller;
    if (updates.isNewArrival !== undefined) payload.is_new_arrival = updates.isNewArrival;
    if (updates.availableSizes !== undefined) payload.available_sizes = updates.availableSizes;
    if (updates.availableFinishes !== undefined) payload.available_finishes = updates.availableFinishes;
    if (updates.reviews !== undefined) payload.reviews = updates.reviews;

    const { error } = await client.from('products').update(payload).eq('id', id);
    if (error) {
      console.warn('Supabase updateProduct warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase updateProduct error:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('products').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ---------------- ORDERS ----------------

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders warning:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((r: any) => ({
      id: r.id,
      orderNumber: r.order_number,
      date: r.date,
      status: r.status,
      items: Array.isArray(r.items) ? r.items : [],
      subtotal: Number(r.subtotal) || 0,
      shippingFee: Number(r.shipping_fee) || 0,
      discount: Number(r.discount) || 0,
      tax: Number(r.tax) || 0,
      total: Number(r.total) || 0,
      shippingAddress: r.shipping_address || {},
      trackingNumber: r.tracking_number || undefined,
      paymentMethod: r.payment_method || undefined,
      estimatedDelivery: r.estimated_delivery || undefined
    }));
  } catch (err) {
    console.warn('Supabase fetchOrders error:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const row = {
      id: order.id,
      order_number: order.orderNumber,
      date: order.date,
      status: order.status,
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shipping_fee: order.shippingFee || 0,
      discount: order.discount || 0,
      tax: order.tax || 0,
      total: order.total || 0,
      shipping_address: order.shippingAddress || {},
      tracking_number: order.trackingNumber || null,
      payment_method: order.paymentMethod || null,
      estimated_delivery: order.estimatedDelivery || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('orders').upsert(row);
    if (error) {
      console.warn('Supabase saveOrder warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveOrder error:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(id: string, status: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ---------------- NEWSLETTER ----------------

export async function saveNewsletterSubscriberToSupabase(email: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const clean = email.trim().toLowerCase();
    const { error } = await client.from('newsletter_subscribers').upsert({
      id: `sub-${Date.now()}`,
      email: clean,
      subscribed_at: new Date().toISOString()
    }, { onConflict: 'email' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * SQL Schema migration string that users can run in Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- NaxtTo Fine Jewellery Atelier - Supabase Cloud Database Schema
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  metal TEXT,
  metal_name TEXT,
  style TEXT,
  style_name TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  story TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  dimensions TEXT,
  karat_purity TEXT,
  origin TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_count INTEGER DEFAULT 1,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  available_sizes JSONB DEFAULT '[]'::jsonb,
  available_finishes JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  payment_method TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (Optional: public read/write or authenticated)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous / Public Policy for NaxtTo Boutique Storefront
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Allow public insert on newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
`;
