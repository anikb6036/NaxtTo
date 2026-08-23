import { Router, Request, Response } from 'express';
import { getAllProducts, getProductById, createProduct, updateProductInDb, deleteProductFromDb } from '../../src/db/helpers';
import { Product } from '../../src/types';

export const productsRouter = Router();

// GET /api/products - list all products with optional filters
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    let products = await getAllProducts();
    const { category, search, style, metal } = req.query;

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (style && style !== 'all') {
      products = products.filter(p => p.style === style);
    }
    if (metal && metal !== 'all') {
      products = products.filter(p => p.metal === metal);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch products' });
  }
});

// GET /api/products/:id - single product
productsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch product' });
  }
});

// POST /api/products - add product (Admin)
productsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({ success: false, message: 'Missing required product attributes (name, price, category)' });
    }

    const newProd: Product = {
      ...productData,
      id: productData.id || `naxtto-${Date.now()}`
    };

    const created = await createProduct(newProd);
    res.status(201).json({ success: true, message: 'Product created successfully in database', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id - update product
productsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await updateProductInDb(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id - delete product
productsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await deleteProductFromDb(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete product' });
  }
});
