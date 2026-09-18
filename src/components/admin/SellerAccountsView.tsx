import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Plus, 
  ShieldCheck, 
  Award, 
  Star, 
  ShoppingBag, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  Edit3, 
  FileText,
  Building2,
  Lock,
  UserCheck,
  UserX
} from 'lucide-react';
import { SellerAccount, Product } from '../../types';

interface SellerAccountsViewProps {
  sellers: SellerAccount[];
  products: Product[];
  onAddSeller: (sellerData: Partial<SellerAccount>) => void;
  onUpdateSeller: (sellerId: string, updates: Partial<SellerAccount>) => void;
  currencySymbol: string;
}

export const SellerAccountsView: React.FC<SellerAccountsViewProps> = ({
  sellers,
  products,
  onAddSeller,
  onUpdateSeller,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeller, setSelectedSeller] = useState<SellerAccount | null>(null);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Seller Form State
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Bowbazar, Kolkata');
  const [newCommission, setNewCommission] = useState(8.0);
  const [newGst, setNewGst] = useState('');
  const [newWorkshopAddress, setNewWorkshopAddress] = useState('');

  // Seller detail edit state
  const [editCommission, setEditCommission] = useState<number>(8.0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredSellers = sellers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      s.storeName.toLowerCase().includes(q) ||
      s.ownerName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      (s.gstNumber && s.gstNumber.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (s: SellerAccount) => {
    setSelectedSeller(s);
    setEditCommission(s.commissionRate);
  };

  const handleSaveCommission = () => {
    if (!selectedSeller) return;
    onUpdateSeller(selectedSeller.id, { commissionRate: editCommission });
    setSelectedSeller(prev => prev ? { ...prev, commissionRate: editCommission } : null);
    showToast(`Commission rate updated to ${editCommission}%`);
  };

  const handleToggleSellerStatus = () => {
    if (!selectedSeller) return;
    const newStatus = selectedSeller.status === 'suspended' ? 'verified' : 'suspended';
    onUpdateSeller(selectedSeller.id, { status: newStatus });
    setSelectedSeller(prev => prev ? { ...prev, status: newStatus } : null);
    showToast(`Seller status changed to ${newStatus}`);
  };

  const handleCreateSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newEmail) {
      alert('Please fill workshop store name and seller email.');
      return;
    }

    onAddSeller({
      storeName: newStoreName,
      ownerName: newOwnerName || 'Master Artisan',
      email: newEmail,
      phone: newPhone || '+91 98300 00000',
      city: newCity,
      commissionRate: newCommission,
      gstNumber: newGst || '19AABCS' + Math.floor(1000 + Math.random() * 9000) + 'R1Z1',
      workshopAddress: newWorkshopAddress || 'Heritage Goldsmith Quarter, West Bengal'
    });

    setIsOnboardModalOpen(false);
    showToast(`Artisan Guild "${newStoreName}" onboarded successfully!`);

    // Reset inputs
    setNewStoreName('');
    setNewOwnerName('');
    setNewEmail('');
    setNewPhone('');
    setNewGst('');
    setNewWorkshopAddress('');
  };

  // Aggregated totals
  const totalSellerRevenue = sellers.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
  const totalOrdersCount = sellers.reduce((sum, s) => sum + (s.totalOrdersFulfilled || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner & Executive Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Certified Seller &amp; Artisan Guilds</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {sellers.length} Guild Partners
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master directory of authorized artisan workshops, trade licenses, commission structures, and catalogue volumes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOnboardModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>Onboard New Seller Guild</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Verified Guilds</span>
          <p className="text-2xl font-bold text-slate-900">{sellers.filter(s => s.status === 'verified').length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% KYC Verified
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Fulfilled</span>
          <p className="text-2xl font-bold text-slate-900">{totalOrdersCount}</p>
          <p className="text-[11px] text-sky-600 font-semibold">Across Bengal Artisans</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Guild Revenue</span>
          <p className="text-2xl font-bold text-slate-900 font-mono">
            {currencySymbol}{(totalSellerRevenue / 100000).toFixed(1)}L
          </p>
          <p className="text-[11px] text-slate-500">Cumulative sales volume</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Platform Fee</span>
          <p className="text-2xl font-bold text-[#b45309]">
            {(sellers.reduce((acc, s) => acc + s.commissionRate, 0) / (sellers.length || 1)).toFixed(1)}%
          </p>
          <p className="text-[11px] text-amber-600 font-semibold">Fair artisan margin rate</p>
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
            placeholder="Search by workshop store name, artisan owner, city, GSTIN, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
        >
          <option value="all">All Verification Statuses</option>
          <option value="verified">Verified Only</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Artisan Workshop / Guild</th>
                <th className="py-3 px-4">Master Artisan / Owner</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-center">Listings</th>
                <th className="py-3 px-4 text-right">Fulfilled &amp; Revenue</th>
                <th className="py-3 px-4 text-center">Platform Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Store className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No seller accounts found matching criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((s) => {
                  const isSuspended = s.status === 'suspended';
                  return (
                    <tr 
                      key={s.id}
                      onClick={() => handleOpenDetail(s)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Store Name & City */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            <Store className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-slate-950 text-sm">
                                {s.storeName}
                              </span>
                              {s.status === 'verified' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {s.city}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-amber-800 font-medium">{s.badge}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner & Contact */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{s.ownerName}</p>
                        <p className="text-slate-500 text-[11px] font-mono">{s.email}</p>
                        <p className="text-slate-400 text-[10px]">{s.phone}</p>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          <span>{s.rating.toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Listings Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 text-sm">{s.totalProducts}</span>
                        <span className="text-[10px] text-slate-400 block">pieces</span>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {currencySymbol}{s.totalRevenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {s.totalOrdersFulfilled} orders dispatched
                        </span>
                      </td>

                      {/* Commission */}
                      <td className="py-3.5 px-4 text-center font-bold text-amber-700 font-mono">
                        {s.commissionRate}%
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isSuspended
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {isSuspended ? 'Suspended' : 'Verified'}
                        </span>
                      </td>

                      {/* Inspect Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(s);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
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

      {/* Seller Management Detail Modal */}
      {selectedSeller && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSeller(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-slate-900" />

            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center border border-amber-300">
                  <Store className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedSeller.storeName}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {selectedSeller.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">GSTIN: {selectedSeller.gstNumber || 'Unregistered'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeller(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Financial Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Dispatched</span>
                  <span className="text-base font-bold text-slate-900 font-mono">
                    {currencySymbol}{selectedSeller.totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Orders Fulfilled</span>
                  <span className="text-base font-bold text-slate-900">
                    {selectedSeller.totalOrdersFulfilled}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Listings</span>
                  <span className="text-base font-bold text-amber-700">
                    {selectedSeller.totalProducts} pieces
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Artisan Rating</span>
                  <span className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    {selectedSeller.rating.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Master Workshop Details */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Workshop Identity &amp; Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Owner / Lead Goldsmith: <strong className="text-slate-900">{selectedSeller.ownerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact: <strong className="text-slate-900 font-mono">{selectedSeller.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone: <strong className="text-slate-900">{selectedSeller.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Joined Atelier: <strong className="text-slate-900">{selectedSeller.joinedDate}</strong></span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-600 flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Workshop Facility: <strong className="text-slate-900">{selectedSeller.workshopAddress || selectedSeller.city}</strong></span>
                </div>
              </div>

              {/* Commission & Settlement Settings */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-700" />
                  <span>Platform Commission &amp; Settlement Governance</span>
                </h3>
                <p className="text-slate-600 text-xs">
                  Configure fair platform take-rate for this seller. Standard Bengal goldsmith guild tier is 7.5% - 8.5%.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="font-semibold text-slate-700">Commission Rate (%):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="25"
                      value={editCommission}
                      onChange={(e) => setEditCommission(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCommission}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded cursor-pointer transition-colors"
                  >
                    Save Rate
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleToggleSellerStatus}
                  className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border ${
                    selectedSeller.status === 'suspended'
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300'
                  }`}
                >
                  {selectedSeller.status === 'suspended' ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Re-activate Guild Verification</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Suspend Seller Access</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSeller(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New Seller Modal */}
      {isOnboardModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOnboardModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#f59e0b] to-[#b45309]" />

            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">Onboard New Artisan Seller Guild</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSellerSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Workshop / Store Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sreemaa Gold Filigree Karigar Samity"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lead Artisan / Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. Tarun Das"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seller Login Email*</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tarun@naxtto.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98300 XXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / District</label>
                  <input
                    type="text"
                    placeholder="Bowbazar, Kolkata"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={newCommission}
                    onChange={(e) => setNewCommission(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="19AABCU9603R1ZM"
                    value={newGst}
                    onChange={(e) => setNewGst(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Workshop Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 84 College Street, Gold Karigar Lane, Kolkata 700073"
                  value={newWorkshopAddress}
                  onChange={(e) => setNewWorkshopAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Register &amp; Approve Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
