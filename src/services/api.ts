import { Product, Order, UserProfile } from '../types';

export const apiClient = {
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Healthcheck failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend health check error:', err);
      return null;
    }
  },

  // Fetch products from backend
  async getProducts(): Promise<Product[] | null> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API getProducts fallback to local store:', err);
      return null;
    }
  },

  // Create new product (Admin)
  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Failed to create product');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API createProduct fallback:', err);
      return null;
    }
  },

  // Update existing product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update product');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API updateProduct fallback:', err);
      return null;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.warn('API deleteProduct fallback:', err);
      return false;
    }
  },

  // Fetch orders
  async getOrders(): Promise<Order[] | null> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API getOrders fallback to local store:', err);
      return null;
    }
  },

  // Place order
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API createOrder fallback:', err);
      return null;
    }
  },

  // Update order fulfillment status
  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update order status');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('API updateOrderStatus fallback:', err);
      return null;
    }
  },

  // Authentication
  async login(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (err) {
      console.warn('API login fallback:', err);
      return null;
    }
  },

  // Newsletter subscription
  async subscribeNewsletter(email: string) {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch (err) {
      console.warn('API newsletter fallback:', err);
      return { success: true, message: 'Subscribed to NaxtTo salon updates.' };
    }
  },

  // AI Concierge Gemstone & Styling Guidance
  async askConcierge(prompt: string) {
    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      return await res.json();
    } catch (err) {
      console.warn('API askConcierge fallback:', err);
      return {
        success: true,
        response: 'Our atelier master jewellers recommend classic 18k solid gold bands paired with certified solar diamonds for enduring elegance.'
      };
    }
  },

  // Razorpay Payment Integration
  async createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string, notes?: Record<string, string>) {
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt, notes })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
      return { success: false, keyId: 'rzp_test_TZC5OuxpUn3JdQ', message: 'Direct payment gateway' };
    } catch (err) {
      console.warn('Failed to create Razorpay order on server, using standard browser gateway:', err);
      return { success: false, keyId: 'rzp_test_TZC5OuxpUn3JdQ', message: 'Direct payment gateway' };
    }
  },

  async verifyRazorpayPayment(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to verify Razorpay payment:', err);
      return { success: false, message: 'Could not verify payment signature' };
    }
  },

  // Supabase & Cloud Storage Management
  async getSupabaseStatus() {
    try {
      const res = await fetch('/api/supabase/status');
      if (!res.ok) throw new Error('Status failed');
      return await res.json();
    } catch (err) {
      console.warn('API getSupabaseStatus fallback:', err);
      return {
        success: false,
        data: { configured: false, connected: false }
      };
    }
  },

  async syncSupabase() {
    try {
      const res = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      console.warn('API syncSupabase fallback:', err);
      return { success: false, message: 'Could not trigger Supabase sync' };
    }
  }
};

