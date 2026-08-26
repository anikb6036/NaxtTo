import React, { useState, useMemo } from 'react';
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
  Truck
} from 'lucide-react';
import { 
  Product, 
  Order, 
  ProductCategory, 
  MetalType, 
  JewelleryStyle 
} from '../types';
import { SellerHeader } from './seller-hub/SellerHeader';
import { SellerSidebar, SellerNavTab } from './seller-hub/SellerSidebar';
import { ListingsTable } from './seller-hub/ListingsTable';
import { SellerOrdersTable } from './seller-hub/SellerOrdersTable';
import { ProductFormView } from './seller-hub/ProductFormView';

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
  // Navigation active tab in Seller Hub
  const [activeNavTab, setActiveNavTab] = useState<SellerNavTab>('listings');
  const [globalSearch, setGlobalSearch] = useState('');

  // Form mode (Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Selected order for detailed modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Save Product (from ProductFormView)
  const handleSaveProduct = (formData: any) => {
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
      const updatedProduct: Product = {
        ...editingProduct,
        ...formData,
        metalName: metalNameMap[formData.metal as MetalType] || formData.metalName,
        styleName: styleNameMap[formData.style as JewelleryStyle] || formData.styleName,
        inStock: formData.stockCount > 0
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
        inStock: formData.stockCount > 0
      };
      onAddProduct(newProduct);
      showToast(`New piece "${newProduct.name}" published to Seller Hub!`);
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

  const totalVaultUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  }, [products]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== 'Delivered').length;
  }, [orders]);

  return (
    <div id="seller-hub-admin" className="w-full bg-[#f5f5f7] text-[#212121] min-h-screen font-sans flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-[#212121] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>{toastMessage}</span>
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
      />

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. Left Sidebar Navigation */}
        <SellerSidebar
          activeTab={activeNavTab}
          onTabChange={(tab) => {
            setActiveNavTab(tab);
            setIsFormOpen(false);
          }}
          ordersCount={activeOrdersCount}
          listingsCount={products.length}
        />

        {/* 3. Main Dynamic Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
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
            ) : activeNavTab === 'listings' || activeNavTab === 'home' ? (
              /* View B: Flipkart Seller Hub Listings View (Exact Match to Image) */
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
              /* View C: Seller Hub Orders View */
              <SellerOrdersTable
                orders={orders}
                onSelectOrder={setSelectedOrder}
                onUpdateOrderStatus={(id, status) => {
                  onUpdateOrderStatus(id, status);
                  showToast(`Order status updated to "${status}"`);
                }}
                currencySymbol={currencySymbol}
              />
            ) : activeNavTab === 'inventory' ? (
              /* View D: Inventory Management */
              <div className="bg-white rounded-xl border border-[#e5e5ea] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h2 className="text-xl font-bold text-[#212121]">Inventory Health & Vault Stocks</h2>
                    <p className="text-xs text-[#717478]">Monitor stock thresholds and re-order schedules.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#2874f0]">{totalVaultUnits}</span>
                    <p className="text-[11px] text-[#717478]">Total units in stock</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Healthy Stock (&gt;3 units)</span>
                    <p className="text-2xl font-bold text-[#137333]">{products.filter(p => (p.stockCount ?? 0) > 3).length} listings</p>
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Low Stock Alerts (1–3 units)</span>
                    <p className="text-2xl font-bold text-[#b06000]">{products.filter(p => (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 3).length} listings</p>
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Out of Stock</span>
                    <p className="text-2xl font-bold text-[#c5221f]">{products.filter(p => (p.stockCount ?? 0) === 0).length} listings</p>
                  </div>
                </div>
              </div>
            ) : activeNavTab === 'payments' ? (
              /* View E: Payments & Settlements */
              <div className="bg-white rounded-xl border border-[#e5e5ea] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
                  <div>
                    <h2 className="text-xl font-bold text-[#212121]">Bank Settlement & Payments Ledger</h2>
                    <p className="text-xs text-[#717478]">Overview of settled transactions and courier remittances.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#137333]">{currencySymbol}{totalRevenue.toFixed(2)}</span>
                    <p className="text-[11px] text-[#717478]">Gross Sales Settled</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#e6f4ea] rounded-xl border border-[#ceead6] space-y-1">
                    <span className="text-xs font-semibold text-[#137333]">Net Dispatched Payout</span>
                    <p className="text-2xl font-bold text-[#137333]">{currencySymbol}{(totalRevenue * 0.88).toFixed(2)}</p>
                    <p className="text-[10px] text-[#137333]">Direct Bank Wire to Registered IFSC</p>
                  </div>
                  <div className="p-4 bg-[#e8f0fe] rounded-xl border border-[#d2e3fc] space-y-1">
                    <span className="text-xs font-semibold text-[#1a73e8]">Atelier Platform Fee (12%)</span>
                    <p className="text-2xl font-bold text-[#1a73e8]">{currencySymbol}{(totalRevenue * 0.12).toFixed(2)}</p>
                    <p className="text-[10px] text-[#1a73e8]">Includes armored transit insurance</p>
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                    <span className="text-xs font-semibold text-[#717478]">Total Orders Processed</span>
                    <p className="text-2xl font-bold text-[#212121]">{orders.length}</p>
                    <p className="text-[10px] text-[#717478]">0 chargebacks / disputes</p>
                  </div>
                </div>
              </div>
            ) : (
              /* View F: Generic Growth / Ads / Reports Placeholder */
              <div className="bg-white rounded-xl border border-[#e5e5ea] p-12 text-center shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#f0f5ff] text-[#2874f0] mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#212121] capitalize">{activeNavTab} Hub</h3>
                <p className="text-xs text-[#717478] max-w-md mx-auto">
                  Manage listing promotions, advertising campaigns, and performance reports directly in your Seller Hub console.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveNavTab('listings')}
                  className="px-4 py-2 bg-[#2874f0] text-white text-xs font-semibold rounded-lg hover:bg-[#1a64dc]"
                >
                  Back to All Listings
                </button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* 4. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5e5ea] p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5ea]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#717478]">
                  Order Ledger
                </span>
                <h3 className="text-xl font-bold text-[#212121] flex items-center gap-2">
                  <span>{selectedOrder.orderNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] border ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                      : selectedOrder.status === 'Dispatched'
                      ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]'
                      : 'bg-[#fef7e0] text-[#b06000] border-[#feefc3]'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#717478] hover:text-[#212121]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#212121]">Update Delivery Status:</span>
                <p className="text-[11px] text-[#717478]">Synchronizes with patron dispatch alerts.</p>
              </div>

              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as Order['status'];
                  onUpdateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                  showToast(`Status updated to "${newStatus}"`);
                }}
                className="bg-white border border-[#dadce0] rounded-lg px-3 py-1.5 text-xs text-[#212121] font-semibold"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Crafting">Crafting</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#212121] uppercase tracking-wider">
                Ordered Creations ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-[#e5e5ea] border border-[#e5e5ea] rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4 bg-white">
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
                        <p className="text-xs font-semibold text-[#212121]">{item.product.name}</p>
                        <p className="text-[11px] text-[#717478]">
                          Size: {item.selectedSize || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#212121]">
                      {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Recipient Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] space-y-1">
                <span className="font-semibold text-[#212121] block">Delivery Destination</span>
                <p className="text-[#555]">
                  {selectedOrder.shippingAddress.fullName}<br />
                  {selectedOrder.shippingAddress.addressLine1}{selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}<br />
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

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#2874f0] hover:bg-[#1a64dc] text-white text-xs font-semibold rounded-lg transition-all"
              >
                Close Ledger
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
