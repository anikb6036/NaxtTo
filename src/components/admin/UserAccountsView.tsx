import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  Crown, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  X, 
  Check, 
  Clock, 
  DollarSign, 
  Download,
  Edit3,
  UserCheck,
  UserX
} from 'lucide-react';
import { AdminUserAccount, Order } from '../../types';

interface UserAccountsViewProps {
  users: AdminUserAccount[];
  orders: Order[];
  onUpdateUser: (userId: string, updates: Partial<AdminUserAccount>) => void;
  currencySymbol: string;
}

export const UserAccountsView: React.FC<UserAccountsViewProps> = ({
  users,
  orders,
  onUpdateUser,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserAccount | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Filter users based on search and dropdowns
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      (u.phone && u.phone.includes(q)) ||
      (u.savedAddresses && u.savedAddresses.some(a => a.city.toLowerCase().includes(q)));

    const matchesTier = selectedTier === 'all' || u.memberTier.toLowerCase().includes(selectedTier.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleOpenUserDetail = (u: AdminUserAccount) => {
    setSelectedUser(u);
    setAdminNoteInput(u.notes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedUser) return;
    onUpdateUser(selectedUser.id, { notes: adminNoteInput });
    setSelectedUser(prev => prev ? { ...prev, notes: adminNoteInput } : null);
    setSaveSuccessMsg('Admin remarks updated successfully');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleToggleVip = () => {
    if (!selectedUser) return;
    const isCurrentlyVip = selectedUser.status === 'vip' || selectedUser.memberTier.includes('VIP');
    const newTier = isCurrentlyVip ? 'Atelier Connoisseur' : 'VIP Privé';
    const newStatus = isCurrentlyVip ? 'active' : 'vip';
    
    onUpdateUser(selectedUser.id, { memberTier: newTier, status: newStatus });
    setSelectedUser(prev => prev ? { ...prev, memberTier: newTier, status: newStatus } : null);
  };

  const handleToggleStatus = () => {
    if (!selectedUser) return;
    const nextStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
    onUpdateUser(selectedUser.id, { status: nextStatus });
    setSelectedUser(prev => prev ? { ...prev, status: nextStatus } : null);
  };

  // Find orders placed by selected user
  const userOrders = selectedUser 
    ? orders.filter(o => 
        (o.userId && o.userId === selectedUser.id) || 
        (o.customerEmail && o.customerEmail.toLowerCase() === selectedUser.email.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Summary KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Registered Patron Accounts</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              {users.length} Total Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of client accounts, membership privileges, lifetime spending, and addresses.
          </p>
        </div>

        {/* Quick statistics */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">VIP Patrons</span>
            <span className="text-sm font-bold text-amber-600">
              {users.filter(u => u.status === 'vip' || u.memberTier.includes('VIP')).length}
            </span>
          </div>
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Buyers</span>
            <span className="text-sm font-bold text-emerald-600">
              {users.filter(u => u.ordersCount > 0).length}
            </span>
          </div>
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
            placeholder="Search by patron name, email address, phone, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Member Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Membership Tiers</option>
            <option value="VIP">VIP Privé</option>
            <option value="Connoisseur">Atelier Connoisseur</option>
            <option value="Circle">NaxtTo Circle</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Account Status</option>
            <option value="vip">VIP Only</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Patron / Identity</th>
                <th className="py-3 px-4">Membership Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Joined / Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No patron accounts found matching your query.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isVip = u.status === 'vip' || u.memberTier.includes('VIP');
                  const isSuspended = u.status === 'suspended';
                  const initials = u.name
                    .split(' ')
                    .map(part => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr 
                      key={u.id} 
                      onClick={() => handleOpenUserDetail(u)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                            isVip 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-slate-950 text-sm">
                                {u.name}
                              </span>
                              {isVip && (
                                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <span className="text-slate-500 text-[11px] block font-mono">
                              {u.email}
                            </span>
                            {u.phone && (
                              <span className="text-slate-400 text-[10px]">
                                {u.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          isVip
                            ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-900 border border-amber-300'
                            : u.memberTier.includes('Connoisseur')
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {isVip && <Crown className="w-3 h-3 text-amber-600" />}
                          {u.memberTier}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isSuspended
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isVip
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {isSuspended ? 'Suspended' : isVip ? 'VIP Patron' : 'Active'}
                        </span>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 text-sm">
                          {u.ordersCount}
                        </span>
                        <span className="text-[10px] text-slate-400 block">placed</span>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {currencySymbol}{u.totalSpent.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {u.savedAddressesCount} saved {u.savedAddressesCount === 1 ? 'addr' : 'addrs'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div>
                          {new Date(u.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {u.lastActiveAt ? 'Active recently' : 'Registered'}
                        </span>
                      </td>

                      {/* Action Detail Trigger */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUserDetail(u);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspection Modal / Detailed Profile Drawer */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedUser(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
            {/* Modal Top Color Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#ff3f6c] to-slate-900" />

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0f172a] text-[#d4af37] font-bold text-sm flex items-center justify-center border border-amber-400/40 shadow-sm">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedUser.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {selectedUser.memberTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Alert message if saved */}
              {saveSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Financial & Activity KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spend</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {currencySymbol}{selectedUser.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Orders Placed</span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedUser.ordersCount}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cart Items</span>
                  <span className="text-base font-bold text-sky-700">
                    {selectedUser.cartItemsCount || 0}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Wishlist Items</span>
                  <span className="text-base font-bold text-[#ff3f6c]">
                    {selectedUser.wishlistItemsCount || 0}
                  </span>
                </div>
              </div>

              {/* Contact & Account Security Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Account Credentials &amp; Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email: <strong className="text-slate-900">{selectedUser.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone: <strong className="text-slate-900">{selectedUser.phone || 'Not provided'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Member Since: <strong className="text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Status: <strong className="text-slate-900 uppercase">{selectedUser.status}</strong></span>
                  </div>
                </div>
              </div>

              {/* Saved Delivery Addresses */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>Saved Delivery Address Book ({selectedUser.savedAddresses?.length || 0})</span>
                </h3>
                {selectedUser.savedAddresses && selectedUser.savedAddresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedUser.savedAddresses.map((addr, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-slate-600">{addr.addressLine2}</p>}
                        <p className="text-slate-700 font-semibold">{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="text-slate-500">Contact: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">No saved delivery addresses on file.</p>
                )}
              </div>

              {/* Order History Timeline */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                  <span>Orders Placed by Patron ({userOrders.length})</span>
                </h3>
                {userOrders.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userOrders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">#{ord.orderNumber}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(ord.date).toLocaleDateString()} • {ord.items.length} item(s)
                          </p>
                        </div>
                        <span className="font-bold font-mono text-slate-900 text-xs">
                          {currencySymbol}{ord.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">No orders recorded for this user yet.</p>
                )}
              </div>

              {/* Admin Internal Remarks / Notes */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Administrative Remarks &amp; Connoisseur Notes</span>
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Private administrative notes regarding customer jewelry preferences, ring size, or dispatch requirements..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Save Internal Remarks
                </button>
              </div>

              {/* Administrative Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVip}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedUser.status === 'vip' ? 'Demote from VIP' : 'Promote to VIP Privé'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border ${
                      selectedUser.status === 'suspended'
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    {selectedUser.status === 'suspended' ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reactivate Account</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3.5 h-3.5 text-rose-600" />
                        <span>Suspend Access</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
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
