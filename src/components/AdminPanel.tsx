import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  ArrowLeft, 
  Filter, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  ExternalLink,
  ChevronDown,
  UploadCloud,
  Tag,
  Sliders,
  MoreVertical,
  Lock,
  Unlock,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  UserCheck,
  User
} from 'lucide-react';
import { 
  Product, 
  Order, 
  ProductCategory, 
  MetalType, 
  JewelleryStyle 
} from '../types';
import { BrandLogo } from './BrandLogo';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onBackToShop: () => void;
  onSignOut: () => void;
  currencySymbol: string;
  staffInfo?: { email: string; role: string; name: string } | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onBackToShop,
  onSignOut,
  currencySymbol,
  staffInfo
}) => {
  // Navigation tabs in Admin
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add-product'>('products');

  // Search & Filter state for Products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Selected Order for viewing details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Success / Alert notification
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // ---------------- FORM STATE (For Add / Edit Product) ----------------
  const initialFormState: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'> = {
    name: '',
    subtitle: '',
    price: 450,
    originalPrice: 500,
    category: 'rings',
    metal: '18k-yellow-gold',
    metalName: '18K Recycled Yellow Gold',
    style: 'minimalist',
    styleName: 'Minimalist Architecture',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: '',
    story: '',
    features: ['100% Certified Recycled Precious Metal', 'Handcrafted Milanese finishing', 'Hypoallergenic signature alloy'],
    dimensions: 'Standard Atelier Fit',
    karatPurity: '18K Solid Gold (750 Hallmark)',
    origin: 'Milan & Antwerp Atelier',
    inStock: true,
    stockCount: 10,
    isBestSeller: false,
    isNewArrival: true,
    availableSizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    availableFinishes: [
      { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' },
      { name: '18K White Gold', type: '18k-white-gold', colorHex: '#E5E4E2' },
      { name: '18K Rose Gold', type: '18k-rose-gold', colorHex: '#E0A899' }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formImageInputs, setFormImageInputs] = useState<string[]>([
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
  ]);
  const [formFeaturesText, setFormFeaturesText] = useState(
    '100% Certified Recycled Precious Metal\nHandcrafted Milanese finishing\nHypoallergenic signature alloy'
  );
  const [formSizesText, setFormSizesText] = useState('US 5, US 6, US 7, US 8');

  // When editing product is triggered
  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      subtitle: prod.subtitle,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
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
      isBestSeller: Boolean(prod.isBestSeller),
      isNewArrival: Boolean(prod.isNewArrival),
      availableSizes: prod.availableSizes || ['US 6', 'US 7', 'US 8'],
      availableFinishes: prod.availableFinishes || [
        { name: '18K Yellow Gold', type: '18k-yellow-gold', colorHex: '#D4AF37' }
      ]
    });
    setFormImageInputs(prod.images.length > 0 ? prod.images : ['']);
    setFormFeaturesText(prod.features.join('\n'));
    setFormSizesText(prod.availableSizes?.join(', ') || 'US 6, US 7, US 8');
  };

  // Reset form
  const handleResetForm = () => {
    setFormData(initialFormState);
    setFormImageInputs([
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
    ]);
    setFormFeaturesText('100% Certified Recycled Precious Metal\nHandcrafted Milanese finishing\nHypoallergenic signature alloy');
    setFormSizesText('US 5, US 6, US 7, US 8');
    setEditingProduct(null);
  };

  // Handle Submit (Add or Update)
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a product title.');
      return;
    }

    const cleanedImages = formImageInputs.map(url => url.trim()).filter(Boolean);
    const cleanedFeatures = formFeaturesText.split('\n').map(f => f.trim()).filter(Boolean);
    const cleanedSizes = formSizesText.split(',').map(s => s.trim()).filter(Boolean);

    const metalNameMap: Record<MetalType, string> = {
      '18k-yellow-gold': '18K Recycled Yellow Gold',
      '18k-white-gold': '18K Recycled White Gold',
      '18k-rose-gold': '18K Recycled Rose Gold',
      '925-sterling-silver': '925 Sterling Silver',
      'platinum': 'Platinum 950',
      'gold-vermeil': '18K Heavy Gold Vermeil'
    };

    const styleNameMap: Record<JewelleryStyle, string> = {
      'minimalist': 'Minimalist Architecture',
      'statement': 'Statement Sculpture',
      'sculptural': 'Sculptural Fluidity',
      'bridal': 'Atelier Bridal & Ceremony',
      'everyday-luxe': 'Everyday Modern Luxe',
      'vintage-modern': 'Vintage Modern Heritage'
    };

    if (editingProduct) {
      // Update existing
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        metalName: metalNameMap[formData.metal] || formData.metalName,
        styleName: styleNameMap[formData.style] || formData.styleName,
        images: cleanedImages.length > 0 ? cleanedImages : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'],
        features: cleanedFeatures,
        availableSizes: cleanedSizes,
        inStock: formData.stockCount > 0
      };
      onUpdateProduct(updatedProduct);
      showAdminToast(`Product "${updatedProduct.name}" updated successfully!`);
      setEditingProduct(null);
      setActiveTab('products');
    } else {
      // Create new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        metalName: metalNameMap[formData.metal] || '18K Recycled Solid Gold',
        styleName: styleNameMap[formData.style] || 'Sculptural Art',
        images: cleanedImages.length > 0 ? cleanedImages : [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
        ],
        features: cleanedFeatures,
        availableSizes: cleanedSizes,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        inStock: formData.stockCount > 0
      };
      onAddProduct(newProduct);
      showAdminToast(`New piece "${newProduct.name}" added to collection!`);
      handleResetForm();
      setActiveTab('products');
    }
  };

  // ---------------- FILTERED DATA ----------------
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // search
      if (productSearch) {
        const q = productSearch.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) || 
                        p.subtitle.toLowerCase().includes(q) || 
                        p.category.toLowerCase().includes(q) ||
                        p.metalName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // category
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
        return false;
      }
      // stock
      if (stockStatusFilter === 'inStock' && (!p.inStock || p.stockCount <= 3)) return false;
      if (stockStatusFilter === 'lowStock' && (p.stockCount <= 0 || p.stockCount > 3)) return false;
      if (stockStatusFilter === 'outOfStock' && (p.inStock && p.stockCount > 0)) return false;

      return true;
    });
  }, [products, productSearch, selectedCategoryFilter, stockStatusFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // search
      if (orderSearch) {
        const q = orderSearch.toLowerCase();
        const matches = o.orderNumber.toLowerCase().includes(q) ||
                        o.shippingAddress.fullName.toLowerCase().includes(q) ||
                        o.trackingNumber.toLowerCase().includes(q) ||
                        o.items.some(item => item.product.name.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // status
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Key KPI stats
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.total, 0);
  }, [orders]);

  const totalUnitsInStock = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  }, [products]);

  const totalActiveOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Delivered').length;
  }, [orders]);

  return (
    <div id="admin-panel" className="w-full bg-[#f8f8fa] text-[#1d1d1f] min-h-screen font-sans">
      
      {/* Toast Notification */}
      {adminToast && (
        <div 
          id="admin-toast"
          className="fixed bottom-6 right-6 z-60 bg-[#1d1d1f] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium tracking-wide flex items-center gap-2.5 border border-[#e5e5ea]/20 animate-slideUp"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-[#e5e5ea] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand / Back */}
            <div className="flex items-center gap-4">
              <button
                id="admin-back-to-shop-btn"
                onClick={onBackToShop}
                className="flex items-center gap-2 text-xs font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#f5f5f7] border border-[#e5e5ea]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Storefront</span>
              </button>

              <div className="h-5 w-px bg-[#e5e5ea]" />

              <div className="flex items-center gap-3">
                <BrandLogo layout="horizontal" size="sm" variant="dark" />
                <span className="bg-[#1d1d1f] text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full">
                  {staffInfo?.role || 'Admin: Anik'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Active Session: {staffInfo?.name || 'Anik'}</span>
              </div>

              <button
                id="admin-quick-add-btn"
                onClick={() => {
                  handleResetForm();
                  setActiveTab('add-product');
                }}
                className="flex items-center gap-1.5 bg-[#1d1d1f] hover:bg-black text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piece</span>
              </button>

              <button
                id="admin-logout-btn"
                onClick={onSignOut}
                className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Sign out of Administrator Console and return to login"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-8 -mb-px overflow-x-auto text-xs font-medium">
            <button
              id="admin-tab-products"
              onClick={() => setActiveTab('products')}
              className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold'
                  : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Manage Products ({products.length})</span>
            </button>

            <button
              id="admin-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold'
                  : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Orders ({orders.length})</span>
              {totalActiveOrders > 0 && (
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {totalActiveOrders} active
                </span>
              )}
            </button>

            <button
              id="admin-tab-add-product"
              onClick={() => {
                if (activeTab !== 'add-product') {
                  handleResetForm();
                }
                setActiveTab('add-product');
              }}
              className={`py-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'add-product'
                  ? 'border-[#1d1d1f] text-[#1d1d1f] font-semibold'
                  : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProduct ? 'Edit Piece' : 'Add New Product'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-xs font-medium">Total Products</span>
              <Package className="w-4 h-4 text-[#1d1d1f]" />
            </div>
            <p className="text-2xl font-light text-[#1d1d1f]">{products.length}</p>
            <p className="text-[11px] text-[#6e6e73]">
              Across 6 curated fine categories
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-xs font-medium">Active Orders</span>
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-light text-[#1d1d1f]">{totalActiveOrders}</p>
            <p className="text-[11px] text-amber-700 font-medium">
              Awaiting crafting or courier dispatch
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-xs font-medium">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-light text-[#1d1d1f]">
              {currencySymbol}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              From {orders.length} authenticated patron orders
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#86868b]">
              <span className="text-xs font-medium">Vault Inventory</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-light text-[#1d1d1f]">{totalUnitsInStock} units</p>
            <p className="text-[11px] text-[#6e6e73]">
              100% Solid 18K & certified ethical stock
            </p>
          </div>
        </div>

        {/* TAB 1: PRODUCT LISTING & MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header / Filter Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search piece by name, metal, category..."
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-2.5 text-[#86868b] hover:text-[#1d1d1f]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedCategoryFilter}
                  onChange={e => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                >
                  <option value="all">All Categories</option>
                  <option value="rings">Continuous Rings</option>
                  <option value="necklaces">Liquid Pendants</option>
                  <option value="earrings">Sculpted Hoops</option>
                  <option value="bracelets">Articulated Cuffs</option>
                  <option value="fine-collections">Fine Collections</option>
                  <option value="bespoke">Bespoke Commissions</option>
                </select>

                <select
                  value={stockStatusFilter}
                  onChange={e => setStockStatusFilter(e.target.value as any)}
                  className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="inStock">In Stock (&gt;3)</option>
                  <option value="lowStock">Low Stock (1–3)</option>
                  <option value="outOfStock">Out of Stock (0)</option>
                </select>

                <button
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('add-product');
                  }}
                  className="bg-[#1d1d1f] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#e5e5ea] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e5ea] bg-[#fbfbfa] text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                      <th className="py-3.5 px-4 sm:px-6">Piece / Image</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Precious Metal</th>
                      <th className="py-3.5 px-4">Retail Price</th>
                      <th className="py-3.5 px-4">Vault Stock</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5ea] text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#86868b]">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="font-medium">No products found matching criteria</p>
                          <button
                            onClick={() => {
                              setProductSearch('');
                              setSelectedCategoryFilter('all');
                              setStockStatusFilter('all');
                            }}
                            className="mt-2 text-[#0071e3] text-xs hover:underline"
                          >
                            Reset filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#fbfbfa] transition-colors group">
                          {/* Title & Image */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] overflow-hidden border border-[#e5e5ea] shrink-0">
                                <img
                                  src={prod.images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80'}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1d1d1f] truncate max-w-[200px] sm:max-w-xs">
                                  {prod.name}
                                </p>
                                <p className="text-[11px] text-[#86868b] truncate max-w-[200px] sm:max-w-xs">
                                  {prod.subtitle}
                                </p>
                                {prod.isBestSeller && (
                                  <span className="inline-block mt-1 bg-amber-50 text-amber-800 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                                    Best Seller
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 capitalize text-[#48484a]">
                            <span className="bg-[#f5f5f7] px-2 py-1 rounded-md text-[11px] font-medium text-[#1d1d1f]">
                              {prod.category.replace(/-/g, ' ')}
                            </span>
                          </td>

                          {/* Metal */}
                          <td className="py-3.5 px-4 text-[#48484a]">
                            <span className="text-[11px]">{prod.metalName}</span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                            <div>
                              <span>{currencySymbol}{prod.price}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="block text-[10px] text-[#86868b] line-through font-normal">
                                  {currencySymbol}{prod.originalPrice}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Vault Stock */}
                          <td className="py-3.5 px-4">
                            {prod.stockCount <= 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                                Out of Stock
                              </span>
                            ) : prod.stockCount <= 3 ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                                Low: {prod.stockCount} left
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                {prod.stockCount} in Vault
                              </span>
                            )}
                          </td>

                          {/* Rating */}
                          <td className="py-3.5 px-4 text-[#48484a]">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-[#1d1d1f]">{prod.rating.toFixed(1)}</span>
                              <span className="text-[#86868b] text-[10px]">({prod.reviewsCount})</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  handleStartEdit(prod);
                                  setActiveTab('add-product');
                                }}
                                title="Edit Product"
                                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors border border-[#e5e5ea]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you wish to delete "${prod.name}" from the catalogue?`)) {
                                    onDeleteProduct(prod.id);
                                    showAdminToast(`"${prod.name}" removed from catalogue.`);
                                  }
                                }}
                                title="Delete Product"
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors border border-[#e5e5ea] hover:border-rose-200"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#fbfbfa] border-t border-[#e5e5ea] flex items-center justify-between text-xs text-[#86868b]">
                <span>Showing {filteredProducts.length} of {products.length} registered creations</span>
                <span className="text-[11px]">All creations synchronized with local vault memory</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search by Order #, Patron Name, Tracking #..."
                  className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                />
                {orderSearch && (
                  <button
                    onClick={() => setOrderSearch('')}
                    className="absolute right-3 top-2.5 text-[#86868b] hover:text-[#1d1d1f]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Crafting">Crafting</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#e5e5ea] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e5ea] bg-[#fbfbfa] text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                      <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                      <th className="py-3.5 px-4">Patron / Recipient</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Delivery Status</th>
                      <th className="py-3.5 px-4">Tracking Code</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Manage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5ea] text-xs">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#86868b]">
                          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="font-medium">No customer orders matching query</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-[#fbfbfa] transition-colors">
                          {/* Order ID & Date */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="font-semibold text-[#1d1d1f] hover:text-[#0071e3] text-left block"
                            >
                              {ord.orderNumber}
                            </button>
                            <span className="text-[11px] text-[#86868b]">{ord.date}</span>
                          </td>

                          {/* Patron */}
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-[#1d1d1f]">{ord.shippingAddress.fullName}</p>
                            <p className="text-[11px] text-[#86868b]">{ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                          </td>

                          {/* Items Count & Preview */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-[#1d1d1f]">
                                {ord.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                              </span>
                            </div>
                            <span className="text-[11px] text-[#86868b] truncate max-w-[150px] block">
                              {ord.items[0]?.product.name || 'Fine creation'}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                            {currencySymbol}{ord.total}
                            <span className="block text-[10px] text-[#86868b] font-normal">
                              {ord.paymentMethod}
                            </span>
                          </td>

                          {/* Delivery Status Badge */}
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] border ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ord.status === 'Dispatched'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : ord.status === 'Crafting'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {ord.status}
                            </span>
                          </td>

                          {/* Tracking */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#48484a]">
                            {ord.trackingNumber}
                          </td>

                          {/* Manage Status Dropdown */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={ord.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as Order['status'];
                                  onUpdateOrderStatus(ord.id, newStatus);
                                  showAdminToast(`Order ${ord.orderNumber} status updated to "${newStatus}"`);
                                }}
                                className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-lg px-2.5 py-1 text-xs text-[#1d1d1f] font-medium focus:outline-none focus:border-[#1d1d1f]"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Crafting">Crafting</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]"
                                title="View Complete Order"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#fbfbfa] border-t border-[#e5e5ea] text-xs text-[#86868b]">
                <span>Showing {filteredOrders.length} customer transactions</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ADD OR EDIT PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6 sm:p-8 shadow-2xs space-y-8 max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-light text-[#1d1d1f]">
                  {editingProduct ? `Edit Piece: ${editingProduct.name}` : 'Curate New Fine Jewellery Creation'}
                </h2>
                <p className="text-xs text-[#6e6e73]">
                  Publish fine solid bullion creations directly to the storefront catalog.
                </p>
              </div>

              {editingProduct && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] px-3 py-1.5 rounded-lg border border-[#e5e5ea]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-6">
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aethel Continuous Band"
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Subtitle & Architecture Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. 18K Solid Gold Minimalist Sculptural Ring"
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  >
                    <option value="rings">Continuous Rings</option>
                    <option value="necklaces">Liquid Pendants & Collars</option>
                    <option value="earrings">Sculpted Hoops</option>
                    <option value="bracelets">Articulated Cuffs</option>
                    <option value="fine-collections">Fine Collections</option>
                    <option value="bespoke">Bespoke Commissions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Precious Metal Alloy *
                  </label>
                  <select
                    value={formData.metal}
                    onChange={e => setFormData({ ...formData, metal: e.target.value as MetalType })}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  >
                    <option value="18k-yellow-gold">18K Recycled Yellow Gold</option>
                    <option value="18k-white-gold">18K Recycled White Gold</option>
                    <option value="18k-rose-gold">18K Recycled Rose Gold</option>
                    <option value="925-sterling-silver">925 Sterling Silver</option>
                    <option value="platinum">Platinum 950</option>
                    <option value="gold-vermeil">18K Gold Vermeil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Style Archetype
                  </label>
                  <select
                    value={formData.style}
                    onChange={e => setFormData({ ...formData, style: e.target.value as JewelleryStyle })}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  >
                    <option value="minimalist">Minimalist Architecture</option>
                    <option value="statement">Statement Sculpture</option>
                    <option value="sculptural">Sculptural Art</option>
                    <option value="bridal">Bridal & Ceremony</option>
                    <option value="everyday-luxe">Everyday Modern Luxe</option>
                    <option value="vintage-modern">Vintage Modern Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Karat Purity & Hallmark
                  </label>
                  <input
                    type="text"
                    value={formData.karatPurity}
                    onChange={e => setFormData({ ...formData, karatPurity: e.target.value })}
                    placeholder="750/1000 (18K Solid Gold)"
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Retail Price ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Original / Comparative Price ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="Optional original price"
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Stock Units in Vault *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockCount}
                    onChange={e => setFormData({ ...formData, stockCount: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Dimensions & Thickness
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g. Band width: 3.8mm | Thickness: 1.9mm"
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#1d1d1f]">
                    High-Resolution Gallery Image URLs
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormImageInputs([...formImageInputs, ''])}
                    className="text-xs text-[#0071e3] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Image URL</span>
                  </button>
                </div>

                {formImageInputs.map((imgUrl, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={imgUrl}
                      onChange={e => {
                        const next = [...formImageInputs];
                        next[index] = e.target.value;
                        setFormImageInputs(next);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                    />
                    {formImageInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormImageInputs(formImageInputs.filter((_, i) => i !== index));
                        }}
                        className="p-2 text-[#86868b] hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Descriptions & Story */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Piece Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the aesthetic and tactile experience of the piece..."
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                    Atelier Story & Origin
                  </label>
                  <textarea
                    rows={2}
                    value={formData.story}
                    onChange={e => setFormData({ ...formData, story: e.target.value })}
                    placeholder="The goldsmith craftsmanship story behind the creation..."
                    className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3.5 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                      Key Highlights & Features (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formFeaturesText}
                      onChange={e => setFormFeaturesText(e.target.value)}
                      placeholder="100% Recycled Gold&#10;Comfort-fit domed interior"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1d1d1f] mb-1.5">
                      Available Sizes (Comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={formSizesText}
                      onChange={e => setFormSizesText(e.target.value)}
                      placeholder="US 5, US 6, US 7, US 8, US 9"
                      className="w-full bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl p-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
                    />
                  </div>
                </div>
              </div>

              {/* Flags: Best Seller / New Arrival */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1d1d1f]">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded border-[#d2d2d7] text-[#1d1d1f] focus:ring-0"
                  />
                  <span>Mark as Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1d1d1f]">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-[#d2d2d7] text-[#1d1d1f] focus:ring-0"
                  />
                  <span>Mark as New Atelier Arrival</span>
                </label>
              </div>

              {/* Form Submission Buttons */}
              <div className="pt-4 border-t border-[#e5e5ea] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('products');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#e5e5ea] hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="admin-save-product-submit"
                  className="px-6 py-2.5 bg-[#1d1d1f] hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Storefront'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#e5e5ea] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#86868b]">
                  Order Ledger Details
                </span>
                <h3 className="text-xl font-semibold text-[#1d1d1f] flex items-center gap-2">
                  <span>{selectedOrder.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedOrder.status === 'Dispatched'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="p-4 bg-[#fbfbfa] rounded-xl border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#1d1d1f]">Update Delivery Status:</span>
                <p className="text-[11px] text-[#6e6e73]">Synchronizes instantly with the customer's account portal.</p>
              </div>

              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as Order['status'];
                  onUpdateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                  showAdminToast(`Status updated to "${newStatus}"`);
                }}
                className="bg-white border border-[#e5e5ea] rounded-lg px-3 py-1.5 text-xs text-[#1d1d1f] font-semibold shadow-2xs"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Crafting">Crafting in Atelier</option>
                <option value="Dispatched">Dispatched via Insured Courier</option>
                <option value="Delivered">Delivered & Signed</option>
              </select>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
                Crafted Pieces ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-[#e5e5ea] border border-[#e5e5ea] rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#f5f5f7] overflow-hidden shrink-0 border border-[#e5e5ea]">
                        <img
                          src={item.product.images[0] || ''}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1d1d1f]">{item.product.name}</p>
                        <p className="text-[11px] text-[#6e6e73]">
                          Size: {item.selectedSize || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1d1d1f]">
                      {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#fbfbfa] rounded-xl border border-[#e5e5ea] space-y-1">
                <span className="font-semibold text-[#1d1d1f] block">Recipient Address</span>
                <p className="text-[#48484a]">
                  {selectedOrder.shippingAddress.fullName}<br />
                  {selectedOrder.shippingAddress.addressLine1}{selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                  {selectedOrder.shippingAddress.country}
                </p>
                <p className="text-[#86868b] pt-1">{selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="p-4 bg-[#fbfbfa] rounded-xl border border-[#e5e5ea] space-y-1.5">
                <span className="font-semibold text-[#1d1d1f] block">Financial Breakdown</span>
                <div className="space-y-1 text-[#6e6e73]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>-{currencySymbol}{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Delivery</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'Complimentary' : `${currencySymbol}${selectedOrder.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#1d1d1f] pt-1 border-t border-[#e5e5ea]">
                    <span>Total Paid</span>
                    <span>{currencySymbol}{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
