import React, { useState } from 'react';
import { 
  PackageCheck, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  Truck, 
  Printer, 
  AlertCircle,
  X,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';
import { Order } from '../../types';
import { apiClient } from '../../services/api';

interface AdminOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  currencySymbol: string;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [mailFeedback, setMailFeedback] = useState<string | null>(null);

  const handleSendResendShipped = async (order: Order) => {
    setIsSendingMail(true);
    setMailFeedback(null);
    try {
      const recipient = order.customerEmail || (order.shippingAddress as any)?.email || 'patron@naxtto.shop';
      const res = await apiClient.sendOrderShippedNotification({
        orderId: order.id,
        orderNumber: order.orderNumber || order.id,
        recipientEmail: recipient,
        recipientName: order.shippingAddress?.fullName || 'Valued Patron',
        carrier: 'Blue Dart Apex Secure Armored Transit',
        trackingNumber: order.trackingNumber || `TRACK-NXT-${order.id}`,
        items: (order.items || []).map(i => ({
          name: i.product?.name || 'Artisanal Jewellery Piece',
          quantity: i.quantity || 1,
          price: i.product?.price,
          size: i.selectedSize
        })),
        total: order.total,
        currencySymbol,
        shippingAddress: order.shippingAddress
      });

      if (res.success) {
        setMailFeedback(`Consignment Shipped email successfully dispatched to ${recipient} via Resend!`);
      } else {
        setMailFeedback(`Email dispatch notice: ${res.error || 'Failed to dispatch'}`);
      }
    } catch (err: any) {
      setMailFeedback(`Error: ${err.message}`);
    } finally {
      setIsSendingMail(false);
    }
  };

  const handleSendResendConfirmation = async (order: Order) => {
    setIsSendingMail(true);
    setMailFeedback(null);
    try {
      const recipient = order.customerEmail || (order.shippingAddress as any)?.email || 'patron@naxtto.shop';
      const res = await apiClient.sendOrderConfirmedNotification({
        orderId: order.id,
        orderNumber: order.orderNumber || order.id,
        recipientEmail: recipient,
        recipientName: order.shippingAddress?.fullName || 'Valued Patron',
        items: (order.items || []).map(i => ({
          name: i.product?.name || 'Artisanal Jewellery Piece',
          quantity: i.quantity || 1,
          price: i.product?.price,
          size: i.selectedSize
        })),
        total: order.total,
        currencySymbol,
        paymentMethod: order.paymentMethod,
        estimatedDelivery: order.estimatedDelivery,
        shippingAddress: order.shippingAddress
      });

      if (res.success) {
        setMailFeedback(`Order Confirmation invoice dispatched to ${recipient} via Resend!`);
      } else {
        setMailFeedback(`Email notice: ${res.error || 'Failed'}`);
      }
    } catch (err: any) {
      setMailFeedback(`Error: ${err.message}`);
    } finally {
      setIsSendingMail(false);
    }
  };

  const statuses: Order['status'][] = [
    'Confirmed',
    'Accepted',
    'Crafting',
    'Dispatched',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      o.orderNumber.toLowerCase().includes(q) ||
      (o.shippingAddress?.fullName && o.shippingAddress.fullName.toLowerCase().includes(q)) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.customerEmail && o.customerEmail.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (st: Order['status']) => {
    switch (st) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Dispatched':
      case 'Out for Delivery':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Crafting':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Global Platform Order Ledger</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end dispatch monitoring, BIS hallmark certificates, and client courier tracking numbers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, patron name, email, or tracking AWB..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
        >
          <option value="all">All Fulfillment Stages</option>
          {statuses.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Order Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Patron / Shipping To</th>
                <th className="py-3 px-4">Jewellery Items</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <PackageCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No orders found matching filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr 
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 font-mono text-sm block">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ord.date).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{ord.shippingAddress?.fullName || 'Valued Client'}</p>
                      <p className="text-slate-500 text-[11px]">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-xs truncate text-slate-700 font-medium">
                        {ord.items.map(i => i.product.name).join(', ')}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{ord.items.length} piece(s)</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {currencySymbol}{ord.total.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{ord.paymentMethod}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(ord);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp text-xs">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-900">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-[11px] text-slate-500">Tracking: {selectedOrder.trackingNumber || 'Pending AWB'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Status Updater */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Change Fulfillment Stage:</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                        selectedOrder.status === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider">Ordered Pieces</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-10 h-10 object-cover rounded border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.product.name}</p>
                          <p className="text-slate-500 text-[10px]">Qty: {item.quantity} • {item.product.metalName}</p>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-slate-900">
                        {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2">Delivery Destination</h3>
                <p className="font-bold text-slate-900">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress?.addressLine1}</p>
                <p className="text-slate-700 font-semibold">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-slate-500">Contact: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              {/* Resend Email Dispatch Actions */}
              <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resend.com Email Notifications</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    To: {selectedOrder.customerEmail || (selectedOrder.shippingAddress as any)?.email || 'patron@naxtto.shop'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendResendShipped(selectedOrder)}
                    disabled={isSendingMail}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3 text-amber-400" />
                    <span>Send Shipped Consignment Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendResendConfirmation(selectedOrder)}
                    disabled={isSendingMail}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>Send Order Receipt Email</span>
                  </button>
                </div>

                {mailFeedback && (
                  <p className="text-[11px] text-emerald-800 font-medium pt-1 animate-fadeIn">
                    {mailFeedback}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(null);
                    setMailFeedback(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
