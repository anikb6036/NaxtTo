import { db } from './index';
import { products, orders, newsletterSubscribers, users } from './schema';
import { eq, desc } from 'drizzle-orm';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { Product, Order } from '../types';

let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];
const inMemoryOrders: Order[] = [];
const inMemorySubscribers: { id: string; email: string; subscribedAt: Date }[] = [];

export async function seedProductsIfEmpty(): Promise<void> {
  if (!db) return;
  try {
    const existing = await db.select().from(products).limit(1);
    if (existing.length === 0) {
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
    }
  } catch {
    // Database unconfigured or unavailable, fallback safely
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    if (!db) return INITIAL_PRODUCTS;
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
    if (!db) return INITIAL_PRODUCTS.find(p => p.id === id) || null;
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
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function createProduct(prod: Product): Promise<Product> {
  if (db) {
    try {
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
    } catch (err) {
      console.warn('DB createProduct fallback:', err);
    }
  }
  return prod;
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (db) {
    try {
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
    } catch (err) {
      console.warn('DB updateProduct fallback:', err);
    }
  }
  return null;
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  if (db) {
    try {
      await db.delete(products).where(eq(products.id, id));
      return true;
    } catch (err) {
      console.warn('DB deleteProduct fallback:', err);
    }
  }
  return true;
}

export async function getAllOrders(): Promise<Order[]> {
  if (db) {
    try {
      const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
      if (rows && rows.length > 0) {
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
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return inMemoryOrders;
}

export async function createOrderInDb(order: Order): Promise<Order> {
  const existingIdx = inMemoryOrders.findIndex(o => o.id === order.id);
  if (existingIdx >= 0) {
    inMemoryOrders[existingIdx] = order;
  } else {
    inMemoryOrders.unshift(order);
  }

  if (db) {
    try {
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
    } catch {
      // In-memory store safely registered order
    }
  }
  return order;
}

export async function updateOrderStatusInDb(id: string, status: string): Promise<boolean> {
  const existing = inMemoryOrders.find(o => o.id === id);
  if (existing) {
    existing.status = status as any;
  }

  if (db) {
    try {
      await db.update(orders).set({ status }).where(eq(orders.id, id));
    } catch {
      // In-memory store updated
    }
  }
  return true;
}

export async function subscribeNewsletterInDb(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const existing = inMemorySubscribers.find(s => s.email === cleanEmail);
  if (!existing) {
    inMemorySubscribers.unshift({
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date()
    });
  }

  if (db) {
    try {
      await db.insert(newsletterSubscribers).values({
        id: `sub-${Date.now()}`,
        email: cleanEmail
      }).onConflictDoNothing();
    } catch {
      // In-memory store updated
    }
  }
  return true;
}

export async function getNewsletterSubscribersFromDb(): Promise<{ id: string; email: string; subscribedAt: Date }[]> {
  if (db) {
    try {
      const list = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
      if (list && list.length > 0) {
        return list;
      }
    } catch {
      // Fallback
    }
  }
  return inMemorySubscribers;
}

export async function upsertUserInDb(userData: { id: string; name: string; email: string; memberTier?: string; avatar?: string }): Promise<any> {
  if (db) {
    try {
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
    } catch {
      // Fallback to memory record
    }
  }
  return { id: userData.id, name: userData.name, email: userData.email, memberTier: userData.memberTier || 'NaxtTo Circle' };
}
