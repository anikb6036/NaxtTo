import { pgTable, text, integer, boolean, timestamp, jsonb, doublePrecision, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  price: doublePrecision('price').notNull(),
  originalPrice: doublePrecision('original_price'),
  category: text('category').notNull(),
  metal: text('metal'),
  metalName: text('metal_name'),
  style: text('style'),
  styleName: text('style_name'),
  images: jsonb('images').$type<string[]>().notNull(),
  description: text('description').notNull(),
  story: text('story'),
  features: jsonb('features').$type<string[]>(),
  dimensions: text('dimensions'),
  karatPurity: text('karat_purity'),
  origin: text('origin'),
  inStock: boolean('in_stock').default(true).notNull(),
  stockCount: integer('stock_count').default(10).notNull(),
  isBestSeller: boolean('is_best_seller').default(false),
  isNewArrival: boolean('is_new_arrival').default(false),
  rating: doublePrecision('rating').default(5.0),
  reviewsCount: integer('reviews_count').default(0),
  availableSizes: jsonb('available_sizes').$type<string[]>(),
  availableFinishes: jsonb('available_finishes').$type<any[]>(),
  reviews: jsonb('reviews').$type<any[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull(),
  date: text('date').notNull(),
  status: text('status').notNull().default('Confirmed'),
  items: jsonb('items').$type<any[]>().notNull(),
  subtotal: doublePrecision('subtotal').notNull(),
  shippingFee: doublePrecision('shipping_fee').default(0),
  discount: doublePrecision('discount').default(0),
  tax: doublePrecision('tax').default(0),
  total: doublePrecision('total').notNull(),
  shippingAddress: jsonb('shipping_address').$type<any>().notNull(),
  trackingNumber: text('tracking_number'),
  paymentMethod: text('payment_method'),
  estimatedDelivery: text('estimated_delivery'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull()
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('customer').notNull(),
  memberTier: text('member_tier').default('NaxtTo Circle'),
  avatar: text('avatar'),
  preferences: jsonb('preferences').$type<any>(),
  savedAddresses: jsonb('saved_addresses').$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
