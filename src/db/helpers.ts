import { db } from './index';
import { products, orders, newsletterSubscribers, users } from './schema';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Product, Order } from '../types';

export async function seedProductsIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(products).limit(1);
    if (existing.length === 0) {
      console.log('Seeding initial products into PostgreSQL...');
      for (const prod of INITIAL_PRODUCTS) {
        await db.insert(products).values({
          id: prod.id,
          name: prod.name,
          subtitle: prod.subtitle,
          price: prod.price,
          originalPrice: prod.originalPrice,
          category: prod.category,
          metal: prod.metal,
          metalName: prod.metalName,
          style: prod.style,
          styleName: prod.styleName,
          images: prod.images,
          description: prod.description,
          story: prod.story,
          features: prod.features,
          dimensions: prod.dimensions,
          karatPurity: prod.karatPurity,
          origin: prod.origin,
          inStock: prod.inStock,
          stockCount: prod.stockCount,
          isBestSeller: prod.isBestSeller,
          isNewArrival: prod.isNewArrival,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          availableSizes: prod.availableSizes,
          availableFinishes: prod.availableFinishes,
          reviews: prod.reviews || []
        }).onConflictDoNothing();
      }
      console.log('Products seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    await seedProductsIfEmpty();
    const rows = await db.select().from(products).orderBy(desc(products.createdAt));
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      subtitle: r.subtitle || undefined,
      price: r.price,
      originalPrice: r.originalPrice || undefined,
      category: r.category as any,
      metal: r.metal as any,
      metalName: r.metalName || undefined,
      style: r.style as any,
      styleName: r.styleName || undefined,
      images: (r.images as string[]) || [],
      description: r.description,
      story: r.story || undefined,
      features: (r.features as string[]) || [],
      dimensions: r.dimensions || undefined,
      karatPurity: r.karatPurity || undefined,
      origin: r.origin || undefined,
      inStock: r.inStock,
      stockCount: r.stockCount,
      isBestSeller: r.isBestSeller || false,
      isNewArrival: r.isNewArrival || false,
      rating: r.rating || 5,
      reviewsCount: r.reviewsCount || 0,
      availableSizes: (r.availableSizes as string[]) || [],
      availableFinishes: (r.availableFinishes as any[]) || [],
      reviews: (r.reviews as any[]) || []
    }));
  } catch (error) {
    console.error('Failed to get products from database:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const rows = await db.select().from(products).where(eq(products.id, id));
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      subtitle: r.subtitle || undefined,
      price: r.price,
      originalPrice: r.originalPrice || undefined,
      category: r.category as any,
      metal: r.metal as any,
      metalName: r.metalName || undefined,
      style: r.style as any,
      styleName: r.styleName || undefined,
      images: (r.images as string[]) || [],
      description: r.description,
      story: r.story || undefined,
      features: (r.features as string[]) || [],
      dimensions: r.dimensions || undefined,
      karatPurity: r.karatPurity || undefined,
      origin: r.origin || undefined,
      inStock: r.inStock,
      stockCount: r.stockCount,
      isBestSeller: r.isBestSeller || false,
      isNewArrival: r.isNewArrival || false,
      rating: r.rating || 5,
      reviewsCount: r.reviewsCount || 0,
      availableSizes: (r.availableSizes as string[]) || [],
      availableFinishes: (r.availableFinishes as any[]) || [],
      reviews: (r.reviews as any[]) || []
    };
  } catch (error) {
    console.error('Failed to get product by ID:', error);
    return null;
  }
}

export async function createProduct(prod: Product): Promise<Product> {
  await db.insert(products).values({
    id: prod.id,
    name: prod.name,
    subtitle: prod.subtitle,
    price: prod.price,
    originalPrice: prod.originalPrice,
    category: prod.category,
    metal: prod.metal,
    metalName: prod.metalName,
    style: prod.style,
    styleName: prod.styleName,
    images: prod.images,
    description: prod.description,
    story: prod.story,
    features: prod.features,
    dimensions: prod.dimensions,
    karatPurity: prod.karatPurity,
    origin: prod.origin,
    inStock: prod.inStock,
    stockCount: prod.stockCount,
    isBestSeller: prod.isBestSeller,
    isNewArrival: prod.isNewArrival,
    rating: prod.rating,
    reviewsCount: prod.reviewsCount,
    availableSizes: prod.availableSizes,
    availableFinishes: prod.availableFinishes,
    reviews: prod.reviews || []
  });
  return prod;
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<Product | null> {
  const updatePayload: any = {};
  if (updates.name !== undefined) updatePayload.name = updates.name;
  if (updates.subtitle !== undefined) updatePayload.subtitle = updates.subtitle;
  if (updates.price !== undefined) updatePayload.price = updates.price;
  if (updates.originalPrice !== undefined) updatePayload.originalPrice = updates.originalPrice;
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.metal !== undefined) updatePayload.metal = updates.metal;
  if (updates.metalName !== undefined) updatePayload.metalName = updates.metalName;
  if (updates.style !== undefined) updatePayload.style = updates.style;
  if (updates.styleName !== undefined) updatePayload.styleName = updates.styleName;
  if (updates.images !== undefined) updatePayload.images = updates.images;
  if (updates.description !== undefined) updatePayload.description = updates.description;
  if (updates.story !== undefined) updatePayload.story = updates.story;
  if (updates.features !== undefined) updatePayload.features = updates.features;
  if (updates.dimensions !== undefined) updatePayload.dimensions = updates.dimensions;
  if (updates.karatPurity !== undefined) updatePayload.karatPurity = updates.karatPurity;
  if (updates.origin !== undefined) updatePayload.origin = updates.origin;
  if (updates.inStock !== undefined) updatePayload.inStock = updates.inStock;
  if (updates.stockCount !== undefined) updatePayload.stockCount = updates.stockCount;
  if (updates.isBestSeller !== undefined) updatePayload.isBestSeller = updates.isBestSeller;
  if (updates.isNewArrival !== undefined) updatePayload.isNewArrival = updates.isNewArrival;
  if (updates.availableSizes !== undefined) updatePayload.availableSizes = updates.availableSizes;
  if (updates.availableFinishes !== undefined) updatePayload.availableFinishes = updates.availableFinishes;
  if (updates.reviews !== undefined) updatePayload.reviews = updates.reviews;

  await db.update(products).set(updatePayload).where(eq(products.id, id));
  return getProductById(id);
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  const res = await db.delete(products).where(eq(products.id, id));
  return true;
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return rows.map(r => ({
      id: r.id,
      orderNumber: r.orderNumber,
      date: r.date,
      status: r.status as any,
      items: (r.items as any[]) || [],
      subtotal: r.subtotal,
      shippingFee: r.shippingFee || 0,
      discount: r.discount || 0,
      tax: r.tax || 0,
      total: r.total,
      shippingAddress: r.shippingAddress as any,
      trackingNumber: r.trackingNumber || undefined,
      paymentMethod: r.paymentMethod || undefined,
      estimatedDelivery: r.estimatedDelivery || undefined
    }));
  } catch (error) {
    console.error('Failed to get orders from DB:', error);
    return [];
  }
}

export async function createOrderInDb(order: Order): Promise<Order> {
  await db.insert(orders).values({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.date,
    status: order.status,
    items: order.items,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    tax: order.tax,
    total: order.total,
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    paymentMethod: order.paymentMethod,
    estimatedDelivery: order.estimatedDelivery
  });
  return order;
}

export async function updateOrderStatusInDb(id: string, status: string): Promise<boolean> {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  return true;
}

export async function subscribeNewsletterInDb(email: string): Promise<boolean> {
  await db.insert(newsletterSubscribers).values({
    id: `sub-${Date.now()}`,
    email: email.toLowerCase()
  }).onConflictDoNothing();
  return true;
}

export async function upsertUserInDb(userData: { id: string; name: string; email: string; memberTier?: string; avatar?: string }): Promise<any> {
  const result = await db.insert(users).values({
    id: userData.id,
    name: userData.name,
    email: userData.email.toLowerCase(),
    memberTier: userData.memberTier || 'NaxtTo Circle',
    avatar: userData.avatar
  }).onConflictDoUpdate({
    target: users.email,
    set: {
      name: userData.name,
      avatar: userData.avatar
    }
  }).returning();
  return result[0];
}
