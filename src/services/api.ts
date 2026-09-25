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

  // Delete single order
  async deleteOrder(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('API deleteOrder error:', err);
      return false;
    }
  },

  // Clear all orders (remove test/dummy orders)
  async clearAllOrders(): Promise<boolean> {
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      console.warn('API clearAllOrders error:', err);
      return false;
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

  // Secure Staff & Seller Hub Authentication
  async staffLogin(identifier: string, passkey: string, portalRole?: 'admin' | 'seller') {
    try {
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passkey, portalRole })
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, ...data };
    } catch (err) {
      console.warn('API staff login fallback:', err);
      return null;
    }
  },

  // Admin User Directory endpoints
  async getUsers() {
    try {
      const res = await fetch('/api/auth/users');
      return await res.json();
    } catch (err) {
      console.warn('API getUsers fallback:', err);
      return { success: false, users: [] };
    }
  },

  async updateUser(id: string, updates: any) {
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateUser fallback:', err);
      return { success: false, message: 'Update failed' };
    }
  },

  // Admin Seller Directory endpoints
  async getSellers() {
    try {
      const res = await fetch('/api/auth/sellers');
      return await res.json();
    } catch (err) {
      console.warn('API getSellers fallback:', err);
      return { success: false, sellers: [] };
    }
  },

  async createSeller(sellerData: any) {
    try {
      const res = await fetch('/api/auth/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellerData)
      });
      return await res.json();
    } catch (err) {
      console.warn('API createSeller fallback:', err);
      return { success: false, message: 'Creation failed' };
    }
  },

  async updateSeller(id: string, updates: any) {
    try {
      const res = await fetch(`/api/auth/sellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateSeller fallback:', err);
      return { success: false, message: 'Update failed' };
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
  },

  // WOW Deals Management
  async getWowDeals(): Promise<any> {
    try {
      const res = await fetch('/api/deals');
      if (!res.ok) throw new Error('Failed to fetch WOW deals');
      return await res.json();
    } catch (err) {
      console.warn('API getWowDeals fallback:', err);
      return null;
    }
  },

  async updateWowDeals(deals: any[]): Promise<any> {
    try {
      const res = await fetch('/api/deals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deals })
      });
      if (!res.ok) throw new Error('Failed to update WOW deals');
      return await res.json();
    } catch (err) {
      console.warn('API updateWowDeals fallback:', err);
      return null;
    }
  },

  async resetWowDeals(): Promise<any> {
    try {
      const res = await fetch('/api/deals/reset', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to reset WOW deals');
      return await res.json();
    } catch (err) {
      console.warn('API resetWowDeals fallback:', err);
      return null;
    }
  },

  // Top Rated in Fine Jewellery Management
  async getTopRated(): Promise<any> {
    try {
      const res = await fetch('/api/top-rated');
      if (!res.ok) throw new Error('Failed to fetch Top Rated collection');
      return await res.json();
    } catch (err) {
      console.warn('API getTopRated fallback:', err);
      return null;
    }
  },

  async updateTopRated(items: any[], header?: any): Promise<any> {
    try {
      const res = await fetch('/api/top-rated', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, header })
      });
      if (!res.ok) throw new Error('Failed to update Top Rated collection');
      return await res.json();
    } catch (err) {
      console.warn('API updateTopRated fallback:', err);
      return null;
    }
  },

  async resetTopRated(): Promise<any> {
    try {
      const res = await fetch('/api/top-rated/reset', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to reset Top Rated collection');
      return await res.json();
    } catch (err) {
      console.warn('API resetTopRated fallback:', err);
      return null;
    }
  },

  // Hero Banners & Slider Merchandising Management
  async getHeroBanners(): Promise<any> {
    try {
      const res = await fetch('/api/hero-banners');
      if (!res.ok) throw new Error('Failed to fetch Hero Banners');
      return await res.json();
    } catch (err) {
      console.warn('API getHeroBanners fallback:', err);
      return null;
    }
  },

  async updateHeroBanners(slides: any[]): Promise<any> {
    try {
      const res = await fetch('/api/hero-banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides })
      });
      if (!res.ok) throw new Error('Failed to update Hero Banners');
      return await res.json();
    } catch (err) {
      console.warn('API updateHeroBanners fallback:', err);
      return null;
    }
  },

  async resetHeroBanners(): Promise<any> {
    try {
      const res = await fetch('/api/hero-banners/reset', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to reset Hero Banners');
      return await res.json();
    } catch (err) {
      console.warn('API resetHeroBanners fallback:', err);
      return null;
    }
  },

  // Resend.com Mail Service Integration
  async getResendStatus(): Promise<{
    success: boolean;
    service: string;
    configured: boolean;
    provider: 'resend' | 'resend-simulated';
    fromEmail: string;
    documentation: string;
    message: string;
  } | null> {
    try {
      const res = await fetch('/api/notifications/resend-status');
      if (!res.ok) throw new Error('Failed to query Resend status');
      return await res.json();
    } catch (err) {
      console.warn('API getResendStatus fallback:', err);
      return null;
    }
  },

  async sendTestEmail(to: string, customMessage?: string): Promise<any> {
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, customMessage })
      });
      return await res.json();
    } catch (err: any) {
      console.warn('API sendTestEmail error:', err);
      return { success: false, error: err.message };
    }
  },

  async sendOrderShippedNotification(payload: any): Promise<any> {
    try {
      const res = await fetch('/api/notifications/order-shipped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      console.warn('API sendOrderShippedNotification error:', err);
      return { success: false, error: err.message };
    }
  },

  async sendOrderConfirmedNotification(payload: any): Promise<any> {
    try {
      const res = await fetch('/api/notifications/order-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      console.warn('API sendOrderConfirmedNotification error:', err);
      return { success: false, error: err.message };
    }
  },

  async getEmailLogs(orderId?: string): Promise<any[]> {
    try {
      const url = orderId 
        ? `/api/notifications/logs?orderId=${encodeURIComponent(orderId)}` 
        : '/api/notifications/logs';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch email logs');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('API getEmailLogs error:', err);
      return [];
    }
  },

  // Dynamic SEO Settings Management
  async getSeoSettings(): Promise<any> {
    try {
      const res = await fetch('/api/seo');
      if (!res.ok) throw new Error('Failed to fetch SEO settings');
      return await res.json();
    } catch (err) {
      console.warn('API getSeoSettings fallback:', err);
      return null;
    }
  },

  async updateSeoSettings(settings: any): Promise<any> {
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update SEO settings');
      return await res.json();
    } catch (err) {
      console.warn('API updateSeoSettings fallback:', err);
      return null;
    }
  },

  async resetSeoSettings(): Promise<any> {
    try {
      const res = await fetch('/api/seo/reset', {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to reset SEO settings');
      return await res.json();
    } catch (err) {
      console.warn('API resetSeoSettings fallback:', err);
      return null;
    }
  }
};

