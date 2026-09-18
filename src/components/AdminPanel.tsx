import React, { useState, useMemo, useEffect } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  TrendingUp, 
  CreditCard, 
  Megaphone, 
  FileText, 
  Users,
  HelpCircle,
  Clock,
  Truck,
  Printer,
  CheckCircle2,
  Crown,
  Store,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { 
  Product, 
  Order, 
  ProductCategory, 
  MetalType, 
  JewelleryStyle,
  AdminUserAccount,
  SellerAccount
} from '../types';

// Seller Hub Components
import { SellerHeader } from './seller-hub/SellerHeader';
import { SellerSidebar, SellerNavTab } from './seller-hub/SellerSidebar';
import { SellerHomeDashboard } from './seller-hub/SellerHomeDashboard';
import { ListingsTable } from './seller-hub/ListingsTable';
import { SellerOrdersTable } from './seller-hub/SellerOrdersTable';
import { ProductFormView } from './seller-hub/ProductFormView';
import { ShippingLabelModal } from './seller-hub/ShippingLabelModal';
import { CloudStorageManager } from './seller-hub/CloudStorageManager';
import { InventoryManager } from './seller-hub/InventoryManager';

// Master Executive Admin Components
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { UserAccountsView } from './admin/UserAccountsView';
import { SellerAccountsView } from './admin/SellerAccountsView';
import { ExecutiveDashboardView } from './admin/ExecutiveDashboardView';
import { AdminOrdersView } from './admin/AdminOrdersView';
import { MasterCatalogView } from './admin/MasterCatalogView';
import { SecurityAuditView } from './admin/SecurityAuditView';
import { apiClient } from '../services/api';

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
  onRefreshOrders?: () => void;
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
  staffInfo,
  onRefreshOrders
}) => {
  // Determine if logged-in staff member is Administrator
  const isAdmin = useMemo(() => {
    const role = (staffInfo?.role || '').toLowerCase();
    const email = (staffInfo?.email || '').toLowerCase();
    return (
      role.includes('admin') || 
      role.includes('administrator') || 
      email.includes('anik') || 
      email.includes('admin') ||
      email.includes('baidyaanik18@gmail.com')
    );
  }, [staffInfo]);

  // Mode: 'admin' (Executive Admin Suite) or 'seller_hub' (Seller/Supplier Hub)
  // Administrators land directly in the Master Executive Admin Suite!
  const [activeConsoleMode, setActiveConsoleMode] = useState<'admin' | 'seller_hub'>(
    isAdmin ? 'admin' : 'seller_hub'
  );

  // Tab inside Executive Admin Suite
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Tab inside Seller Hub
  const [activeNavTab, setActiveNavTab] = useState<SellerNavTab>('home');
  const [globalSearch, setGlobalSearch] = useState('');

  // Form mode for product creation/editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Selected order for detailed modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State for Users and Sellers accounts
  const [usersList, setUsersList] = useState<AdminUserAccount[]>([]);
  const [sellersList, setSellersList] = useState<SellerAccount[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load of users and sellers data from backend
  const loadPlatformData = async () => {
    setIsRefreshing(true);
    try {
      const [usersRes, sellersRes] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getSellers()
      ]);

      if (usersRes?.success && Array.isArray(usersRes.users)) {
        setUsersList(usersRes.users);
      }
      if (sellersRes?.success && Array.isArray(sellersRes.sellers)) {
        setSellersList(sellersRes.sellers);
      }
    } catch (err) {
      console.warn('Could not fetch accounts:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Handlers for User Accounts
  const handleUpdateUser = async (userId: string, updates: Partial<AdminUserAccount>) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    try {
      await apiClient.updateUser(userId, updates);
      showToast('Patron account updated');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Seller Accounts
  const handleAddSeller = async (sellerData: Partial<SellerAccount>) => {
    try {
      const res = await apiClient.createSeller(sellerData);
      if (res?.success && res.seller) {
        setSellersList(prev => [res.seller, ...prev]);
        showToast(`Artisan Guild "${res.seller.storeName}" onboarded!`);
      } else {
        // Fallback in-memory
        const fallbackSeller: SellerAccount = {
          id: `seller-${Date.now()}`,
          storeName: sellerData.storeName || 'New Artisan Guild',
          ownerName: sellerData.ownerName || 'Master Karigar',
          email: sellerData.email || 'partner@naxtto.com',
          phone: sellerData.phone || '+91 98300 00000',
          city: sellerData.city || 'Kolkata, WB',
          status: 'verified',
          badge: 'Certified Seller',
          rating: 5.0,
          totalProducts: 0,
          totalOrdersFulfilled: 0,
          totalRevenue: 0,
          commissionRate: sellerData.commissionRate || 8.0,
          gstNumber: sellerData.gstNumber || 'Pending GSTIN',
          joinedDate: new Date().toISOString().split('T')[0],
          workshopAddress: sellerData.workshopAddress || 'Registered Workshop, West Bengal'
        };
        setSellersList(prev => [fallbackSeller, ...prev]);
        showToast(`Artisan Guild "${fallbackSeller.storeName}" onboarded!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSeller = async (sellerId: string, updates: Partial<SellerAccount>) => {
    setSellersList(prev => prev.map(s => s.id === sellerId ? { ...s, ...updates } : s));
    try {
      await apiClient.updateSeller(sellerId, updates);
      showToast('Artisan Guild details updated');
    } catch (err) {
      console.error(err);
    }
  };

  // Product saving logic
  const handleSaveProduct = (formData: any) => {
    const metalNameMap: Record<MetalType, string> = {
      'pure-conch-shell': '100% Pure Conch Shell (Natural Shankha)',
      'crimson-coral-acrylic': 'Auspicious Coral Red Pola',
      '22k-yellow-gold': '22K Solid Gold (BIS 916 Hallmarked)',
      'iron-gold': 'Pure Iron & 22K Solid Gold (Loha Badhano)',
      '18k-yellow-gold': '18K Recycled Yellow Gold',
      '18k-white-gold': '18K Recycled White Gold',
      '18k-rose-gold': '18K Recycled Rose Gold',
      '925-sterling-silver': '925 Sterling Silver',
      'platinum': 'Platinum 950',
      'gold-vermeil': '18K Heavy Gold Vermeil'
    };

    const styleNameMap: Record<JewelleryStyle, string> = {
      'traditional-bengali': 'Traditional Bengali Craft',
      'bridal-heritage': 'Bridal Heritage Ceremony',
      'hand-carved': 'Master Artisan Hand-Carved',
      'mukhi-design': 'Mukhi Carved Animal/Floral Motif',
      'filigree-badhano': 'Fine Gold Filigree Wirework (Jal Badhano)',
      'daily-wear': 'Comfortable Daily Auspicious Wear',
      'minimalist': 'Minimalist Architecture',
      'statement': 'Statement Sculpture',
      'sculptural': 'Sculptural Fluidity',
      'bridal': 'Atelier Bridal & Ceremony',
      'everyday-luxe': 'Everyday Modern Luxe',
      'vintage-modern': 'Vintage Modern Heritage'
    };

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        metalName: metalNameMap[formData.metal as MetalType] || formData.metalName,
        styleName: styleNameMap[formData.style as JewelleryStyle] || formData.styleName,
        inStock: formData.stockCount > 0,
        isActive: editingProduct.isActive !== undefined ? editingProduct.isActive : true
      };
      onUpdateProduct(updatedProduct);
      showToast(`Listing "${updatedProduct.name}" updated successfully!`);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...formData,
        metalName: metalNameMap[formData.metal as MetalType] || '18K Solid Gold',
        styleName: styleNameMap[formData.style as JewelleryStyle] || 'Sculptural Art',
        rating: 4.8,
        reviewsCount: 0,
        reviews: [],
        inStock: formData.stockCount > 0,
        isActive: true
      };
      onAddProduct(newProduct);
      showToast(`New piece "${newProduct.name}" published to catalog!`);
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    setActiveNavTab('listings');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleAddNewListing = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Financial & Inventory KPIs
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.total, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== 'Delivered').length;
  }, [orders]);

  // ==========================================
  // BRANCH 1: MASTER EXECUTIVE ADMIN CONSOLE
  // When activeConsoleMode === 'admin' and isAdmin
  // ==========================================
  if (isAdmin && activeConsoleMode === 'admin') {
    return (
      <div id="executive-admin-suite" className="w-full bg-[#f8fafc] text-slate-900 min-h-screen font-sans flex flex-col">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 border border-slate-700 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Master Executive Admin Header */}
        <AdminHeader
          adminName={staffInfo?.name || 'Anik Baidya'}
          adminEmail={staffInfo?.email || 'baidyaanik18@gmail.com'}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          activeView={activeConsoleMode}
          onToggleView={setActiveConsoleMode}
          onExitToStorefront={onBackToShop}
          onSignOut={onSignOut}
          totalUsersCount={usersList.length}
          totalSellersCount={sellersList.length}
          onRefreshData={loadPlatformData}
          isRefreshing={isRefreshing}
        />

        {/* Executive Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Executive Left Sidebar */}
          <AdminSidebar
            activeTab={adminTab}
            onTabChange={setAdminTab}
            usersCount={usersList.length}
            sellersCount={sellersList.length}
            ordersCount={orders.length}
            productsCount={products.length}
            onExitToStorefront={onBackToShop}
          />

          {/* Main Executive Dynamic Container */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto space-y-6">
              {adminTab === 'overview' && (
                <ExecutiveDashboardView
                  users={usersList}
                  sellers={sellersList}
                  orders={orders}
                  products={products}
                  onNavigateTab={setAdminTab}
                  currencySymbol={currencySymbol}
                />
              )}

              {adminTab === 'users' && (
                <UserAccountsView
                  users={usersList}
                  orders={orders}
                  onUpdateUser={handleUpdateUser}
                  currencySymbol={currencySymbol}
                />
              )}

              {adminTab === 'sellers' && (
                <SellerAccountsView
                  sellers={sellersList}
                  products={products}
                  onAddSeller={handleAddSeller}
                  onUpdateSeller={handleUpdateSeller}
                  currencySymbol={currencySymbol}
                />
              )}

              {adminTab === 'products' && (
                <MasterCatalogView
                  products={products}
                  onAddProduct={onAddProduct}
                  onUpdateProduct={onUpdateProduct}
                  onDeleteProduct={onDeleteProduct}
                  currencySymbol={currencySymbol}
                />
              )}

              {adminTab === 'orders' && (
                <AdminOrdersView
                  orders={orders}
                  onUpdateOrderStatus={onUpdateOrderStatus}
                  currencySymbol={currencySymbol}
                />
              )}

              {adminTab === 'security' && (
                <SecurityAuditView />
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // BRANCH 2: SELLER HUB INTERFACE
  // When activeConsoleMode === 'seller_hub' OR non-admin seller
  // ==========================================
  return (
    <div id="seller-hub-admin" className="w-full bg-[#f5f5f7] text-[#212121] min-h-screen font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#212121] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Quick Switcher Banner (if user is Administrator previewing Seller Hub) */}
      {isAdmin && (
        <div className="bg-[#0f172a] text-white px-4 py-2 flex items-center justify-between text-xs border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#fbbf24]" />
            <span className="font-semibold text-slate-200">
              Administrator Preview Mode: <span className="text-amber-400">Seller Hub View</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveConsoleMode('admin')}
            className="px-3 py-1 bg-[#d4af37] hover:bg-[#b45309] text-slate-950 font-bold text-xs rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Master Admin Suite</span>
          </button>
        </div>
      )}

      {/* 1. Flipkart Seller Hub Top Header */}
      <SellerHeader
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onExitToStorefront={onBackToShop}
        onSignOut={onSignOut}
        sellerName={staffInfo?.name || 'NaxtTo'}
        activeOrdersCount={activeOrdersCount}
        onOpenStorageTab={() => setActiveNavTab('storage')}
      />

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left Sidebar Navigation (Dark Meesho-style theme) */}
        <SellerSidebar
          activeTab={activeNavTab}
          onTabChange={(tab) => {
            setActiveNavTab(tab);
            setIsFormOpen(false);
          }}
          ordersCount={activeOrdersCount}
          listingsCount={products.length}
          sellerName={staffInfo?.name || 'NaxtTo'}
          onExitToStorefront={onBackToShop}
        />

        {/* 3. Main Dynamic Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] bg-[#f5f6fa]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* View A: Add / Edit Product Form */}
            {isFormOpen ? (
              <ProductFormView
                editingProduct={editingProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
                currencySymbol={currencySymbol}
              />
            ) : activeNavTab === 'home' ? (
              <SellerHomeDashboard
                products={products}
                orders={orders}
                onNavigateTab={(tab) => {
                  setActiveNavTab(tab);
                  setIsFormOpen(false);
                }}
                onAddNewListing={handleAddNewListing}
                currencySymbol={currencySymbol}
                sellerName={staffInfo?.name || 'NaxtTo'}
              />
            ) : activeNavTab === 'listings' ? (
              <ListingsTable
                products={products}
                onAddNewListing={handleAddNewListing}
                onEditProduct={handleStartEdit}
                onDeleteProduct={(id) => {
                  if (confirm('Are you sure you want to remove this listing?')) {
                    onDeleteProduct(id);
                    showToast('Listing removed successfully');
                  }
                }}
                currencySymbol={currencySymbol}
              />
            ) : activeNavTab === 'orders' ? (
              <SellerOrdersTable
                orders={orders}
                onSelectOrder={setSelectedOrder}
                onUpdateOrderStatus={(id, status) => {
                  onUpdateOrderStatus(id, status);
                  showToast(`Order status updated to "${status}"`);
                }}
                currencySymbol={currencySymbol}
                onRefreshOrders={onRefreshOrders}
              />
            ) : activeNavTab === 'returns' ? (
              <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
                  <div>
                    <h2 className="text-xl font-bold text-[#1f242e]">Customer Returns &amp; Courier RTOs</h2>
                    <p className="text-xs text-[#6b7280]">Track return shipments, unboxing video audits, and replacement dispatches.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-xs font-bold rounded-full">
                    0.0% Low Return Rate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] space-y-1">
                    <span className="text-xs font-semibold text-[#6b7280]">In-Transit Returns</span>
                    <p className="text-2xl font-bold text-[#111827]">0 shipments</p>
                    <p className="text-[10px] text-[#6b7280]">No reverse logistics active</p>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] space-y-1">
                    <span className="text-xs font-semibold text-[#6b7280]">Delivered to Bowbazar Hub</span>
                    <p className="text-2xl font-bold text-[#16a34a]">0 items</p>
                    <p className="text-[10px] text-[#16a34a]">100% customer delivery satisfaction</p>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] space-y-1">
                    <span className="text-xs font-semibold text-[#6b7280]">Return Claims Approved</span>
                    <p className="text-2xl font-bold text-[#4f46e5]">₹0.00</p>
                    <p className="text-[10px] text-[#4f46e5]">Zero freight or damaged item deductions</p>
                  </div>
                </div>
              </div>
            ) : activeNavTab === 'pricing' ? (
              <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
                  <div>
                    <h2 className="text-xl font-bold text-[#1f242e]">Atelier Pricing &amp; Live Gold Rate Card</h2>
                    <p className="text-xs text-[#6b7280]">Real-time daily Kolkata Bullion Association 22K (916) benchmark rates.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#fef3c7] border border-[#fde68a] text-[#b45309] text-xs font-bold rounded-full">
                    Live Kolkata Bullion: ₹6,940/g (22K)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#fffbeb] rounded-xl border border-[#fde68a] space-y-1">
                    <span className="text-xs font-semibold text-[#b45309]">22K Gold Badhano Shankha</span>
                    <p className="text-2xl font-bold text-[#92400e]">₹3,499 – ₹7,999</p>
                    <p className="text-[10px] text-[#b45309]">Hallmarked 916 wire filigree</p>
                  </div>
                  <div className="p-4 bg-[#fef2f2] rounded-xl border border-[#fecaca] space-y-1">
                    <span className="text-xs font-semibold text-[#b91c1c]">Handcrafted Coral Pola</span>
                    <p className="text-2xl font-bold text-[#991b1b]">₹1,899 – ₹4,299</p>
                    <p className="text-[10px] text-[#b91c1c]">Austrian acrylic &amp; Italian coral</p>
                  </div>
                  <div className="p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd] space-y-1">
                    <span className="text-xs font-semibold text-[#0369a1]">22K Gold Loha Badhano</span>
                    <p className="text-2xl font-bold text-[#075985]">₹4,199 – ₹9,499</p>
                    <p className="text-[10px] text-[#0369a1]">Iron core with floral cap</p>
                  </div>
                  <div className="p-4 bg-[#fdf4ff] rounded-xl border border-[#f5d0fe] space-y-1">
                    <span className="text-xs font-semibold text-[#a21caf]">Bridal Combo Sets</span>
                    <p className="text-2xl font-bold text-[#86198f]">₹8,999 – ₹18,499</p>
                    <p className="text-[10px] text-[#a21caf]">Complete conch, coral &amp; loha pair</p>
                  </div>
                </div>
              </div>
            ) : activeNavTab === 'inventory' ? (
              <InventoryManager
                products={products}
                onUpdateProduct={onUpdateProduct}
                onEditProduct={(prod) => {
                  setEditingProduct(prod);
                  setIsFormOpen(true);
                }}
                currencySymbol={currencySymbol}
              />
            ) : activeNavTab === 'payments' ? (
              <div className="bg-white rounded-xl border border-[#e5e5ea] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h2 className="text-xl font-bold text-[#212121]">Bank Settlement &amp; Payments Ledger</h2>
                    <p className="text-xs text-[#717478]">Overview of settled transactions and courier remittances.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#137333]">{currencySymbol}{totalRevenue.toFixed(2)}</span>
                    <p className="text-[11px] text-[#717478]">Gross Sales Settled</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Next Settlement Batch</span>
                    <p className="text-2xl font-bold text-[#212121]">Tuesday (Weekly)</p>
                    <p className="text-[10px] text-[#137333]">Direct NEFT/RTGS to Guild Account</p>
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Outstanding Invoices</span>
                    <p className="text-2xl font-bold text-[#212121]">0 Pending</p>
                    <p className="text-[10px] text-[#137333]">All artisan accounts current</p>
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Commission Rate</span>
                    <p className="text-2xl font-bold text-[#212121]">0% Intro</p>
                    <p className="text-[10px] text-[#717478]">0% marketplace fee for registered workshops</p>
                  </div>
                </div>
              </div>
            ) : activeNavTab === 'storage' ? (
              <CloudStorageManager
                products={products}
                orders={orders}
                onShowToast={showToast}
              />
            ) : (
              <div className="p-12 text-center text-[#717478]">
                <h3 className="text-base font-bold text-[#212121]">Atelier Settings</h3>
                <p className="text-xs mt-1">Configure Bengal artisan hub addresses and GST credentials.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Selected Order Detailed Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e5e5ea] overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-[#e5e5ea] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#212121] text-sm">Order #{selectedOrder.orderNumber}</h3>
                <span className="text-[10px] text-[#717478]">{new Date(selectedOrder.date).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#717478] hover:text-[#212121] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="p-3.5 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                <span className="font-semibold text-[#212121] block">Fulfillment Details</span>
                <p className="text-[#717478]">Tracking ID: <strong className="text-[#212121]">{selectedOrder.trackingNumber}</strong></p>
                <p className="text-[#717478]">Payment Mode: <strong className="text-[#212121]">{selectedOrder.paymentMethod}</strong></p>
              </div>

              <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                <span className="font-semibold text-[#212121] block">Shipping Destination</span>
                <p className="text-[#212121] font-medium">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-[#717478]">
                  {selectedOrder.shippingAddress.addressLine1}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                  {selectedOrder.shippingAddress.country}
                </p>
                <p className="text-[#717478] pt-1">{selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                <span className="font-semibold text-[#212121] block">Financial Settlement</span>
                <div className="space-y-1 text-[#717478]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'Complimentary' : `${currencySymbol}${selectedOrder.shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#212121] pt-1 border-t border-[#e5e5ea]">
                    <span>Total Settled</span>
                    <span>{currencySymbol}{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#2874f0] hover:bg-[#1a64dc] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Label Modal */}
      {labelOrder && (
        <ShippingLabelModal
          order={labelOrder}
          onClose={() => setLabelOrder(null)}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};
