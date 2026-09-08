import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowUpDown,
  ShoppingBag,
  Filter,
  Download,
  RefreshCw,
  Printer,
  PackageCheck,
  Sparkles
} from 'lucide-react';
import { Order } from '../../types';
import { ShippingLabelModal } from './ShippingLabelModal';

interface SellerOrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  currencySymbol: string;
  onRefreshOrders?: () => void;
}

export const SellerOrdersTable: React.FC<SellerOrdersTableProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  currencySymbol,
  onRefreshOrders
}) => {
  const [orderStatusTab, setOrderStatusTab] = useState<'all' | 'pending' | 'accepted' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);

  const handleRefreshClick = () => {
    if (onRefreshOrders) {
      setIsRefreshing(true);
      onRefreshOrders();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (o.orderNumber || '').toLowerCase().includes(q) ||
                    (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                    (o.trackingNumber || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (orderStatusTab === 'pending' && o.status !== 'Confirmed') return false;
    if (orderStatusTab === 'accepted' && (o.status !== 'Accepted' && o.status !== 'Crafting')) return false;
    if (orderStatusTab === 'shipped' && (o.status !== 'Dispatched' && o.status !== 'Out for Delivery')) return false;
    if (orderStatusTab === 'delivered' && o.status !== 'Delivered') return false;
    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]';
      case 'Out for Delivery':
        return 'bg-[#e8f0fe] text-[#1a73e8] border-[#c2e7ff]';
      case 'Dispatched':
        return 'bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc]';
      case 'Accepted':
        return 'bg-[#f3e8fd] text-[#7627bb] border-[#e9d2fd]';
      case 'Crafting':
        return 'bg-[#fef7e0] text-[#b06000] border-[#feefc3]';
      case 'Cancelled':
        return 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]';
      case 'Confirmed':
      default:
        return 'bg-[#fff0d4] text-[#b25e02] border-[#ffdca8]';
    }
  };

  return (
    <div className="space-y-4 font-sans text-[#212121]">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-t-xl border-b border-[#e5e5ea]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#212121]">Manage Orders</h1>
          <span className="bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold px-2.5 py-1 rounded-full">
            {orders.length} total orders
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Patron..."
              className="w-48 sm:w-64 bg-[#f5f5f7] border border-transparent focus:border-[#2874f0] focus:bg-white text-xs rounded-lg pl-9 pr-3 py-2 outline-none"
            />
          </div>
          {onRefreshOrders && (
            <button
              type="button"
              onClick={handleRefreshClick}
              title="Refresh orders from live ledger"
              className="border border-[#dadce0] rounded-lg px-3 py-2 text-xs font-medium text-[#212121] hover:bg-[#f5f5f7] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#717478] ${isRefreshing ? 'animate-spin text-[#2874f0]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
          <button
            type="button"
            className="border border-[#dadce0] rounded-lg px-3 py-2 text-xs font-medium text-[#212121] hover:bg-[#f5f5f7] flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-[#717478]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-6 border-b border-[#e5e5ea] bg-white px-5 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setOrderStatusTab('all')}
          className={`py-3.5 border-b-2 transition-all ${
            orderStatusTab === 'all'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setOrderStatusTab('pending')}
          className={`py-3.5 border-b-2 transition-all ${
            orderStatusTab === 'pending'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          New ({orders.filter(o => o.status === 'Confirmed').length})
        </button>

        <button
          type="button"
          onClick={() => setOrderStatusTab('accepted')}
          className={`py-3.5 border-b-2 transition-all ${
            orderStatusTab === 'accepted'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          Accepted & Crafting ({orders.filter(o => o.status === 'Accepted' || o.status === 'Crafting').length})
        </button>

        <button
          type="button"
          onClick={() => setOrderStatusTab('shipped')}
          className={`py-3.5 border-b-2 transition-all ${
            orderStatusTab === 'shipped'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          In Transit / Out for Delivery ({orders.filter(o => o.status === 'Dispatched' || o.status === 'Out for Delivery').length})
        </button>

        <button
          type="button"
          onClick={() => setOrderStatusTab('delivered')}
          className={`py-3.5 border-b-2 transition-all ${
            orderStatusTab === 'delivered'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          Completed ({orders.filter(o => o.status === 'Delivered').length})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#e5e5ea] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e5ea] bg-[#fafafa] text-[11px] font-semibold text-[#717478]">
                <th className="py-3 px-4 min-w-[150px]">Order ID & Date</th>
                <th className="py-3 px-4 min-w-[170px]">Patron / Recipient</th>
                <th className="py-3 px-4 min-w-[180px]">Items</th>
                <th className="py-3 px-4 min-w-[110px]">Total Amount</th>
                <th className="py-3 px-4 min-w-[130px]">Delivery Status</th>
                <th className="py-3 px-4 min-w-[140px]">Tracking Code</th>
                <th className="py-3 px-4 min-w-[150px]">Accept & Manage</th>
                <th className="py-3 px-4 min-w-[100px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5ea] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#878787]">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#2874f0]" />
                    <p className="font-semibold text-sm text-[#212121]">No orders in this queue</p>
                    <p className="text-xs text-[#717478] mt-1">Orders placed by customers will automatically stream here in real time.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-xs text-[#212121]">{ord.orderNumber}</p>
                      <p className="text-[11px] text-[#717478]">{ord.date}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-xs text-[#212121]">{ord.shippingAddress?.fullName || 'Patron of Atelier'}</p>
                      <p className="text-[11px] text-[#717478] truncate max-w-[160px]">
                        {ord.shippingAddress?.city || 'Bespoke'}, {ord.shippingAddress?.country || 'India'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-xs text-[#212121]">
                        {(ord.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0)} item(s)
                      </p>
                      <p className="text-[11px] text-[#717478] truncate max-w-[180px]">
                        {ord.items?.[0]?.product?.name || (ord.items?.[0] as any)?.name || 'Atelier Fine Jewellery'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-xs text-[#212121]">{currencySymbol}{(Number(ord.total) || 0).toFixed(2)}</p>
                      <p className="text-[10px] text-[#717478] capitalize">{(ord.paymentMethod || 'Razorpay').replace('-', ' ')}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(ord.status)}`}>
                        {ord.status || 'Confirmed'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-[#717478] block truncate max-w-[130px]">
                        {ord.trackingNumber || 'N/A'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1.5">
                        {ord.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(ord.id, 'Accepted')}
                            className="bg-[#e6f4ea] hover:bg-[#ceead6] text-[#137333] border border-[#ceead6] px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            title="Accept this order to begin crafting"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Order</span>
                          </button>
                        )}
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                          className="bg-[#f5f5f7] border border-[#dadce0] rounded-md px-2 py-1 text-xs text-[#212121] font-medium outline-none focus:border-[#2874f0] cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed (New)</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Crafting">Crafting</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setLabelOrder(ord)}
                          className="p-1.5 rounded-md hover:bg-[#e8f0fe] text-[#717478] hover:text-[#1a73e8] transition-colors cursor-pointer"
                          title="Print Shipping Label / Airway Bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectOrder(ord)}
                          className="p-1.5 rounded-md hover:bg-[#e8f0fe] text-[#717478] hover:text-[#2874f0] transition-colors cursor-pointer"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

