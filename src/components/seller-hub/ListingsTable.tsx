import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Video, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Edit3, 
  ExternalLink, 
  MoreVertical, 
  Check, 
  Play, 
  Truck, 
  Sparkles,
  HelpCircle,
  Download,
  Upload,
  Layers,
  CheckCircle2,
  Trash2,
  Eye,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Product } from '../../types';

interface ListingsTableProps {
  products: Product[];
  onAddNewListing: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  currencySymbol: string;
}

export const ListingsTable: React.FC<ListingsTableProps> = ({
  products,
  onAddNewListing,
  onEditProduct,
  onDeleteProduct,
  currencySymbol
}) => {
  // Status tab filter
  const [listingStatusTab, setListingStatusTab] = useState<'all' | 'active' | 'low_stock' | 'out_of_stock'>('all');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'stock'>('name');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Dynamic unique categories and metals from actual products
  const uniqueCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return Array.from(set);
  }, [products]);

  const uniqueMetals = useMemo(() => {
    const set = new Set(products.map(p => p.metal));
    return Array.from(set);
  }, [products]);

  // Dynamic counts
  const activeProducts = useMemo(() => products.filter(p => p.inStock !== false && (p.stockCount ?? 0) > 0), [products]);
  const lowStockProducts = useMemo(() => products.filter(p => p.inStock !== false && (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 3), [products]);
  const outOfStockProducts = useMemo(() => products.filter(p => !p.inStock || (p.stockCount ?? 0) === 0), [products]);

  const currentDisplayList = useMemo(() => {
    let list = products;
    if (listingStatusTab === 'active') {
      list = activeProducts;
    } else if (listingStatusTab === 'low_stock') {
      list = lowStockProducts;
    } else if (listingStatusTab === 'out_of_stock') {
      list = outOfStockProducts;
    }

    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter);
    }
    if (metalFilter !== 'all') {
      list = list.filter(p => p.metal === metalFilter);
    }
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.metalName?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock') return (b.stockCount ?? 0) - (a.stockCount ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [products, listingStatusTab, categoryFilter, metalFilter, tableSearch, sortBy, activeProducts, lowStockProducts, outOfStockProducts]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(currentDisplayList.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(i => i !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  return (
    <div className="space-y-4 font-sans text-[#212121]">
      
      {/* Top Header Row: "All Listings" + Filter Pills + Add Listing Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-t-xl border-b border-[#e5e5ea]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-[#212121]">All Listings</h1>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                setMetalFilter('all');
                setListingStatusTab('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                listingStatusTab === 'all' && categoryFilter === 'all' && metalFilter === 'all'
                  ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]'
                  : 'bg-white text-[#666] border border-[#dadce0] hover:bg-[#f8f9fa]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>All ({products.length})</span>
            </button>

            {uniqueCategories.slice(0, 3).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]'
                    : 'bg-white text-[#666] border border-[#dadce0] hover:bg-[#f8f9fa]'
                }`}
              >
                <span>{cat.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Search & Add Listing Button */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search by title, SKU, metal..."
              className="w-48 sm:w-60 bg-[#f5f5f7] border border-transparent focus:border-[#2874f0] focus:bg-white text-xs rounded-lg pl-9 pr-3 py-2 outline-none"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="bg-[#2874f0] hover:bg-[#1a64dc] text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
            >
              <span>+ Add Listing</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#e5e5ea] rounded-xl shadow-xl z-50 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    onAddNewListing();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#f5f5f7] flex items-center gap-2 text-[#212121]"
                >
                  <Plus className="w-4 h-4 text-[#2874f0]" />
                  <span>Add Single Listing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Status Tabs Navigation (All, In Stock, Low Stock, Out of Stock) */}
      <div className="flex items-center gap-6 border-b border-[#e5e5ea] bg-white px-5 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setListingStatusTab('all')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            listingStatusTab === 'all'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span>All Items</span>
          <span className="text-[11px] font-normal text-[#878787]">{products.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setListingStatusTab('active')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            listingStatusTab === 'active'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span>In Stock</span>
          <span className="text-[11px] font-normal text-[#878787]">{activeProducts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setListingStatusTab('low_stock')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            listingStatusTab === 'low_stock'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span>Low Stock (≤ 3)</span>
          <span className="text-[11px] font-normal text-[#878787]">{lowStockProducts.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setListingStatusTab('out_of_stock')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
            listingStatusTab === 'out_of_stock'
              ? 'border-[#2874f0] text-[#2874f0] font-bold'
              : 'border-transparent text-[#717478] hover:text-[#212121]'
          }`}
        >
          <span>Out of Stock</span>
          <span className="text-[11px] font-normal text-[#878787]">{outOfStockProducts.length}</span>
        </button>
      </div>

      {/* Filter Toolbar Row */}
      <div className="bg-white p-3.5 rounded-xl border border-[#e5e5ea] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-[#f0f5ff] text-[#2874f0] font-semibold border border-[#d6e4ff]">
            Showing {currentDisplayList.length} of {products.length}
          </span>

          <div className="h-4 w-px bg-[#e5e5ea] mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#717478]" />
            
            {/* Dynamic Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs text-[#212121] bg-white outline-none hover:border-[#2874f0] capitalize"
            >
              <option value="all">All Categories ▾</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ')}
                </option>
              ))}
            </select>

            {/* Dynamic Metal Filter */}
            <select
              value={metalFilter}
              onChange={(e) => setMetalFilter(e.target.value)}
              className="border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs text-[#212121] bg-white outline-none hover:border-[#2874f0] capitalize"
            >
              <option value="all">All Metals & Alloys ▾</option>
              {uniqueMetals.map(m => (
                <option key={m} value={m}>
                  {m.replace(/-/g, ' ')}
                </option>
              ))}
            </select>

            {(categoryFilter !== 'all' || metalFilter !== 'all' || tableSearch) && (
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setMetalFilter('all');
                  setTableSearch('');
                }}
                className="text-[#2874f0] font-semibold text-xs px-2.5 py-1.5 hover:bg-[#f0f5ff] rounded-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[#717478]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-[#dadce0] rounded-lg px-2.5 py-1.5 text-xs text-[#212121] bg-white outline-none hover:border-[#2874f0]"
            >
              <option value="name">Title (A-Z)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="stock">Stock Units</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Flipkart-Style Listings Table */}
      <div className="bg-white rounded-xl border border-[#e5e5ea] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e5ea] bg-[#fafafa] text-[11px] font-semibold text-[#717478]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={currentDisplayList.length > 0 && selectedProductIds.length === currentDisplayList.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#2874f0] accent-[#2874f0] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[240px]">Product Details</th>
                <th className="py-3 px-4 min-w-[150px]">
                  <div className="flex items-center gap-1">
                    <span>Price & Settlement</span>
                    <ArrowUpDown className="w-3 h-3 text-[#717478]" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[120px]">
                  <div className="flex items-center gap-1">
                    <span>Stock Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#717478]" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[110px]">Specifications</th>
                <th className="py-3 px-4 min-w-[130px]">Rating & Reviews</th>
                <th className="py-3 px-4 min-w-[100px]">Certifications</th>
                <th className="py-3 px-4 min-w-[90px] text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5e5ea] text-xs">
              {currentDisplayList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#878787]">
                    <p className="font-medium text-sm text-[#212121]">No listings match your search or filter</p>
                    <p className="text-xs text-[#878787] mt-1">Try resetting your search query or status tab.</p>
                    <button
                      type="button"
                      onClick={onAddNewListing}
                      className="mt-3 px-4 py-2 bg-[#2874f0] text-white rounded-lg font-semibold text-xs hover:bg-[#1a64dc]"
                    >
                      + Add New Listing
                    </button>
                  </td>
                </tr>
              ) : (
                currentDisplayList.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  const netSettlement = Math.round(prod.price * 0.90);
                  const skuCode = `SKU-${prod.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;
                  const stockQty = prod.stockCount ?? 0;
                  const isLowStock = prod.inStock !== false && stockQty > 0 && stockQty <= 3;
                  const isOutOfStock = !prod.inStock || stockQty === 0;

                  return (
                    <tr key={prod.id} className={`hover:bg-[#f8f9fa] transition-colors ${isChecked ? 'bg-[#f0f5ff]' : ''}`}>
                      {/* 1. Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(prod.id)}
                          className="w-4 h-4 rounded text-[#2874f0] accent-[#2874f0] cursor-pointer"
                        />
                      </td>

                      {/* 2. Product Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg bg-[#f5f5f7] overflow-hidden border border-[#e5e5ea] shrink-0">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] text-[#717478] font-medium capitalize">
                              {prod.category.replace('-', ' ')}
                            </p>
                            <p 
                              className="text-xs font-semibold text-[#212121] line-clamp-1 hover:text-[#2874f0] cursor-pointer" 
                              onClick={() => onEditProduct(prod)}
                            >
                              {prod.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => onEditProduct(prod)}
                              className="text-[11px] font-semibold text-[#2874f0] hover:underline block font-mono"
                            >
                              {skuCode}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 3. Price & Settlement */}
                      <td className="py-3 px-4">
                        <div className="bg-transparent border border-[#e5e5ea] rounded-xl p-2 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#717478]">Price:</span>
                            <span className="font-semibold text-[#212121]">{currencySymbol}{prod.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#e5e5ea]">
                            <span className="text-[#717478]">Net Payout:</span>
                            <span className="text-[11px] text-[#0f9d58] font-bold">
                              {currencySymbol}{netSettlement}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Stock Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-block bg-transparent ${
                            isOutOfStock
                              ? 'text-rose-600 border border-rose-200'
                              : isLowStock
                              ? 'text-amber-700 border border-amber-200'
                              : 'text-emerald-700 border border-emerald-300'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : `${stockQty} available`}
                          </span>
                          {prod.availableSizes && prod.availableSizes.length > 0 && (
                            <p className="text-[10px] text-[#717478]">
                              Sizes: {prod.availableSizes.join(', ')}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 5. Specifications */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="text-xs text-[#212121] font-medium truncate max-w-[130px]">
                            {prod.metalName || prod.metal.replace(/-/g, ' ')}
                          </p>
                          {prod.karatPurity && (
                            <p className="text-[11px] text-[#717478]">
                              {prod.karatPurity}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 6. Rating & Reviews */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#212121]">
                            <span>⭐</span>
                            <span>{prod.rating ? prod.rating.toFixed(1) : '5.0'}</span>
                          </div>
                          <p className="text-[11px] text-[#717478]">
                            {prod.reviewsCount ? `${prod.reviewsCount} customer review(s)` : 'Direct atelier piece'}
                          </p>
                        </div>
                      </td>

                      {/* 7. Certifications */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#2874f0] bg-transparent border border-[#d2e3fc] px-1.5 py-0.5 rounded-md" title="Hallmarked Piece">
                            Hallmarked
                          </span>
                          {prod.isBestSeller && (
                            <span className="text-[10px] font-bold text-amber-700 bg-transparent border border-amber-300 px-1.5 py-0.5 rounded-md">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 8. Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditProduct(prod)}
                            className="p-1.5 rounded-lg hover:bg-[#f5f5f7] text-[#2874f0] hover:text-[#1a64dc] transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors"
                            title="Remove Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
