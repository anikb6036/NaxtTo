import { Product } from '../../src/types';
import { INITIAL_PRODUCTS } from '../../src/data/mockData';

let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];

export function getStoredProducts(): Product[] {
  return inMemoryProducts;
}

export function getProductById(id: string): Product | undefined {
  return inMemoryProducts.find(p => p.id === id);
}

export function addProduct(product: Omit<Product, 'id'> & { id?: string }): Product {
  const newProduct: Product = {
    ...product,
    id: product.id || `naxtto-${Date.now()}`
  };
  inMemoryProducts = [newProduct, ...inMemoryProducts];
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const index = inMemoryProducts.findIndex(p => p.id === id);
  if (index === -1) return null;
  inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
  return inMemoryProducts[index];
}

export function deleteProduct(id: string): boolean {
  const beforeLen = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  return inMemoryProducts.length < beforeLen;
}
