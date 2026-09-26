import React, { useState, useMemo } from 'react';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PauseCircle, 
  PlayCircle, 
  Search, 
  Plus, 
  Minus, 
  Edit2, 
  Eye, 
  Download, 
  Layers, 
  Warehouse, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowUpDown,
  Tag,
  Check,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory, MetalType } from '../../types';

interface InventoryManagerProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  currencySymbol: string;
}

export type InventoryTab = 'all' | 'active' | 'deactive' | 'out_of_stock' | 'low_stock';
export type InventoryLayoutMode = 'sections' | 'tabs';

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  onUpdateProduct,
  onEditProduct,
  currencySymbol
}) => {
  // Navigation & view states
  const [layoutMode, setLayoutMode] = useState<InventoryLayoutMode>('sections');
  const [activeTab, setActiveTab] = useState<InventoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stock_desc' | 'stock_asc' | 'price_desc' | 'price_asc' | 'name'>('stock_desc');
  
  // Collapsible section state for "sections" view
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    active: false,
    deactive: false,
    out_of_stock: false
  });

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Quick restock modal
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  // Quick detail preview modal
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // Helper to categorize any product
  // 1. Deactive: isActive === false
  // 2. Out of stock: isActive !== false && (stockCount <= 0 || !inStock)
  // 3. Active: isActive !== false && stockCount > 0 && inStock !== false
  const categorizedProducts = useMemo(() => {
    const activeList: Product[] = [];
    const deactiveList: Product[] = [];
    const outOfStockList: Product[] = [];
    const lowStockList: Product[] = [];

    products.forEach((p) => {
      const stock = p.stockCount ?? 0;
      const isDeactivated = p.isActive === false;
      const isZeroStock = stock <= 0 || p.inStock === false;

      if (isDeactivated) {
        deactiveList.push(p);
      } else if (isZeroStock) {
        outOfStockList.push(p);
      } else {
        activeList.push(p);
        if (stock <= 3) {
          lowStockList.push(p);
        }
      }
    });

    return {
      active: activeList,
      deactive: deactiveList,
      outOfStock: outOfStockList,
      lowStock: lowStockList
    };
  }, [products]);

  // Overall Inventory Metrics
  const totalUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stockCount ?? 0), 0);
  }, [products]);

  const totalVaultValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * (p.stockCount ?? 0)), 0);
  }, [products]);

  const activeVaultValue = useMemo(() => {
    return categorizedProducts.active.reduce((acc, p) => acc + (p.price * (p.stockCount ?? 0)), 0);
  }, [categorizedProducts.active]);

  // Unique categories and metals for filtering
  const availableCategories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const availableMetals = useMemo(() => {
    return Array.from(new Set(products.map(p => p.metal)));
  }, [products]);

  // Filter and sort a given list of products
  const filterAndSortList = (list: Product[]) => {
    return list.filter((p) => {
      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      // Metal filter
      if (metalFilter !== 'all' && p.metal !== metalFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const sku = (p.sku || `SKU-${p.id.slice(-6)}`).toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = (p.subtitle || '').toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchMetal = (p.metalName || p.metal || '').toLowerCase().includes(q);
        const matchSku = sku.includes(q);
        if (!matchName && !matchSub && !matchCategory && !matchMetal && !matchSku) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const stockA = a.stockCount ?? 0;
      const stockB = b.stockCount ?? 0;
      if (sortBy === 'stock_desc') return stockB - stockA;
      if (sortBy === 'stock_asc') return stockA - stockB;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  };

  // Status toggle handler (Activate / Deactivate)
  const handleToggleActiveStatus = (product: Product) => {
    const willBeActive = product.isActive === false; // If currently false, switch to true
    const updated: Product = {
      ...product,
      isActive: willBeActive,
      // If activating and stock was 0, restore default buffer or leave stock as is
      inStock: willBeActive ? (product.stockCount ?? 0) > 0 : false
    };
    onUpdateProduct(updated);
  };

  // Stock quick adjustment (+ or -)
  const handleAdjustStock = (product: Product, delta: number) => {
    const current = product.stockCount ?? 0;
    const next = Math.max(0, current + delta);
    const updated: Product = {
      ...product,
      stockCount: next,
      inStock: next > 0,
      // If stock increases above 0 and was previously active, ensure inStock is true
      isActive: product.isActive !== false
    };
    onUpdateProduct(updated);
  };

  // Quick Restock submit
  const handleApplyRestock = () => {
    if (!restockProduct) return;
    const current = restockProduct.stockCount ?? 0;
    const next = current + Math.max(1, restockAmount);
    const updated: Product = {
      ...restockProduct,
      stockCount: next,
      inStock: true,
      isActive: true // Restocking automatically activates piece
    };
    onUpdateProduct(updated);
    setRestockProduct(null);
  };

  // Bulk Actions
  const handleBulkToggle = (activeStatus: boolean) => {
    selectedIds.forEach((id) => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        onUpdateProduct({
          ...prod,
          isActive: activeStatus,
          inStock: activeStatus ? (prod.stockCount ?? 0) > 0 : false
        });
      }
    });
    setSelectedIds([]);
  };

  const handleBulkRestock = (amount: number) => {
    selectedIds.forEach((id) => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        const next = (prod.stockCount ?? 0) + amount;
        onUpdateProduct({
          ...prod,
          stockCount: next,
          inStock: true,
          isActive: true
        });
      }
    });
    setSelectedIds([]);
  };

  // CSV Export for Stock Sheet
  const handleExportStockSheet = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'Metal', 'Status', 'Stock Count', 'Price (INR)', 'Vault Value (INR)'];
    const rows = products.map(p => {
      const isDeactive = p.isActive === false;
      const isOos = (p.stockCount ?? 0) <= 0 || !p.inStock;
      const statusText = isDeactive ? 'Deactive' : isOos ? 'Out of Stock' : (p.stockCount ?? 0) <= 3 ? 'Low Stock' : 'Active';
      const sku = p.sku || `SKU-${p.id.slice(-6)}`;
      const val = (p.stockCount ?? 0) * p.price;
      return [
        p.id,
        `"${sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        `"${p.metalName || p.metal}"`,
        statusText,
        p.stockCount ?? 0,
        p.price,
        val
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `naxtto_vault_inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render individual product card
  const renderProductCard = (p: Product) => {
    const stock = p.stockCount ?? 0;
    const isDeactive = p.isActive === false;
    const isOutOfStock = !isDeactive && (stock <= 0 || p.inStock === false);
    const isLowStock = !isDeactive && !isOutOfStock && stock <= 3;
    const isActive = !isDeactive && !isOutOfStock;
    const isSelected = selectedIds.includes(p.id);

    // Dynamic warehouse location tag
    const vaultLocation = p.category === 'shakha' 
      ? 'Vault Shelf A-01 (Conch Shell)' 
      : p.category === 'pola' 
      ? 'Vault Shelf B-04 (Coral Red)'
      : p.category === 'gold-badhano' 
      ? 'High-Security Safe S-1 (22K Gold)' 
      : p.category === 'loha-badhano' 
      ? 'Vault Shelf C-02 (Sacred Iron)' 
      : 'Bridal Trunk Vault B-09';

    return (
      <div 
        key={p.id}
        className={`bg-white rounded-xl border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4 ${
          isSelected 
            ? 'border-[#2874f0] ring-1 ring-[#2874f0]/20 bg-blue-50/10' 
            : isOutOfStock 
            ? 'border-red-200 bg-red-50/10' 
            : isDeactive 
            ? 'border-amber-200 bg-amber-50/10' 
            : 'border-[#e5e5ea]'
        }`}
      >
        {/* Left Column: Checkbox, Image, and Identifiers */}
        <div className="flex items-start gap-3 w-full md:w-5/12">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedIds(prev => [...prev, p.id]);
              } else {
                setSelectedIds(prev => prev.filter(id => id !== p.id));
              }
            }}
            className="mt-2 w-4 h-4 rounded text-[#2874f0] border-gray-300 focus:ring-blue-400 shrink-0 cursor-pointer"
          />

          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#e5e5ea] bg-gray-50 shrink-0 group">
            <img 
              src={p.images?.[0] || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80'} 
              alt={p.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setPreviewProduct(p)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              title="Quick Preview Specs"
            >
              <Eye className="w-4 h-4" />
            </button>
            {/* Status dot in corner */}
            <span 
              className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                isActive ? 'bg-emerald-500' : isDeactive ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Badge */}
              {isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
              {isDeactive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <PauseCircle className="w-3 h-3" /> Deactivated
                </span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                  <XCircle className="w-3 h-3" /> Out of Stock
                </span>
              )}
              {isLowStock && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  <AlertTriangle className="w-3 h-3" /> Low Stock ({stock} left)
                </span>
              )}

              {/* SKU Pill */}
              <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {p.sku || `SKU-${p.id.slice(-6)}`}
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#212121] truncate mt-1" title={p.name}>
              {p.name}
            </h4>
            <p className="text-xs text-gray-500 truncate" title={p.subtitle}>
              {p.subtitle || p.category}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1 flex-wrap">
              <span className="font-medium text-gray-700">{p.metalName || p.metal}</span>
              <span>•</span>
              <span className="text-gray-400">{vaultLocation}</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Stock Level Controls */}
        <div className="flex flex-col items-start md:items-center justify-center w-full md:w-3/12 px-2 py-1 bg-gray-50/70 rounded-lg border border-gray-100">
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
            Vault Stock Level
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjustStock(p, -1)}
              disabled={stock === 0}
              title="Decrease stock by 1"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="px-3 py-1 bg-white border border-gray-300 rounded-md font-mono text-sm font-bold text-center min-w-[54px] shadow-2xs">
              <span className={isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-emerald-700'}>
                {stock}
              </span>
              <span className="text-[10px] text-gray-400 font-normal ml-1">pcs</span>
            </div>

            <button
              type="button"
              onClick={() => handleAdjustStock(p, 1)}
              title="Increase stock by 1"
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Restock Increment Shortcuts */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-gray-400">Quick add:</span>
            <button
              onClick={() => handleAdjustStock(p, 5)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 hover:bg-blue-100 hover:text-blue-700 text-gray-700 font-semibold transition"
            >
              +5
            </button>
            <button
              onClick={() => handleAdjustStock(p, 10)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 hover:bg-blue-100 hover:text-blue-700 text-gray-700 font-semibold transition"
            >
              +10
            </button>
            <button
              onClick={() => handleAdjustStock(p, 25)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 hover:bg-blue-100 hover:text-blue-700 text-gray-700 font-semibold transition"
            >
              +25
            </button>
          </div>
        </div>

        {/* Pricing & Valuation */}
        <div className="flex flex-col items-start md:items-end w-full md:w-2/12">
          <span className="text-sm font-bold text-[#212121]">
            {currencySymbol}{p.price.toLocaleString('en-IN')}
          </span>
          {p.originalPrice && p.originalPrice > p.price && (
            <span className="text-[11px] text-gray-400 line-through">
              {currencySymbol}{p.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-[11px] text-gray-500 mt-1">
            Total Value: <span className="font-semibold text-gray-800">{currencySymbol}{(p.price * stock).toLocaleString('en-IN')}</span>
          </span>
        </div>

        {/* Action Controls Column */}
        <div className="flex items-center gap-2 w-full md:w-2/12 justify-end border-t md:border-t-0 pt-3 md:pt-0">
          {/* Status Switch (Activate / Deactivate) */}
          <button
            type="button"
            onClick={() => handleToggleActiveStatus(p)}
            title={isDeactive ? "Click to Activate product on storefront" : "Click to Deactivate / Pause product"}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isDeactive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-800 border border-gray-200'
            }`}
          >
            {isDeactive ? (
              <>
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Activate</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Deactivate</span>
              </>
            )}
          </button>

          {/* Quick Restock Dialog opener */}
          {isOutOfStock && (
            <button
              type="button"
              onClick={() => {
                setRestockProduct(p);
                setRestockAmount(15);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2874f0] text-white hover:bg-blue-600 flex items-center gap-1 shadow-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restock</span>
            </button>
          )}

          {/* Edit in ProductFormView */}
          <button
            type="button"
            onClick={() => onEditProduct(p)}
            title="Edit full catalogue specs & pricing"
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#2874f0] hover:bg-blue-50 border border-gray-200 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Top Control Bar */}
      <div className="bg-white rounded-xl border border-[#e5e5ea] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#e5e5ea]">
          <div>
            <div className="flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-[#2874f0]" />
              <h2 className="text-xl font-bold text-[#212121]">Inventory Health & Vault Stocks</h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-[#2874f0] rounded-full border border-blue-200">
                Live Vault Manager
              </span>
            </div>
            <p className="text-xs text-[#717478] mt-1">
              Organized stock thresholds, live vault reserves, active status, and re-order schedules for authentic Sakha Pola pieces.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLayoutMode('sections')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  layoutMode === 'sections' 
                    ? 'bg-white text-[#212121] shadow-2xs font-semibold' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Separate sections for Active, Deactive, and Out of Stock"
              >
                <Layers className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>Separate Sections</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('tabs')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  layoutMode === 'tabs' 
                    ? 'bg-white text-[#212121] shadow-2xs font-semibold' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Tabbed view to view one category at a time"
              >
                <Tag className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>Tabbed View</span>
              </button>
            </div>

            {/* Export Sheet Button */}
            <button
              type="button"
              onClick={handleExportStockSheet}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
              title="Download full vault inventory CSV report"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>Export Stock Sheet</span>
            </button>
          </div>
        </div>

        {/* 2. Key Inventory Metric Cards (Organized breakdown) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Card 1: Active Listings */}
          <div 
            onClick={() => {
              setLayoutMode('tabs');
              setActiveTab('active');
            }}
            className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 cursor-pointer hover:border-emerald-300 hover:shadow-xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active Listings
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                Live in Shop
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-2">
              {categorizedProducts.active.length} <span className="text-sm font-normal text-emerald-600">listings</span>
            </p>
            <div className="flex items-center justify-between text-[11px] text-emerald-700 mt-2 pt-2 border-t border-emerald-200/60">
              <span>{categorizedProducts.active.reduce((acc, p) => acc + (p.stockCount ?? 0), 0)} units ready</span>
              <span className="font-semibold">{currencySymbol}{activeVaultValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 2: Deactivated / Paused */}
          <div 
            onClick={() => {
              setLayoutMode('tabs');
              setActiveTab('deactive');
            }}
            className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 cursor-pointer hover:border-amber-300 hover:shadow-xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <PauseCircle className="w-4 h-4 text-amber-600" />
                Deactivated / Paused
              </span>
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                Hidden
              </span>
            </div>
            <p className="text-2xl font-black text-amber-700 mt-2">
              {categorizedProducts.deactive.length} <span className="text-sm font-normal text-amber-600">listings</span>
            </p>
            <div className="flex items-center justify-between text-[11px] text-amber-700 mt-2 pt-2 border-t border-amber-200/60">
              <span>On hold / seasonal pause</span>
              <span className="font-semibold">{categorizedProducts.deactive.reduce((acc, p) => acc + (p.stockCount ?? 0), 0)} units</span>
            </div>
          </div>

          {/* Card 3: Out of Stock */}
          <div 
            onClick={() => {
              setLayoutMode('tabs');
              setActiveTab('out_of_stock');
            }}
            className="p-4 bg-red-50/60 rounded-xl border border-red-200/80 cursor-pointer hover:border-red-300 hover:shadow-xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600" />
                Out of Stock
              </span>
              <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded">
                0 Units
              </span>
            </div>
            <p className="text-2xl font-black text-red-700 mt-2">
              {categorizedProducts.outOfStock.length} <span className="text-sm font-normal text-red-600">listings</span>
            </p>
            <div className="flex items-center justify-between text-[11px] text-red-700 mt-2 pt-2 border-t border-red-200/60">
              <span>Immediate restock needed</span>
              <span className="font-semibold text-red-800">Action Required</span>
            </div>
          </div>

          {/* Card 4: Low Stock Warnings */}
          <div 
            onClick={() => {
              setLayoutMode('tabs');
              setActiveTab('low_stock');
            }}
            className="p-4 bg-orange-50/60 rounded-xl border border-orange-200/80 cursor-pointer hover:border-orange-300 hover:shadow-xs transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Low Stock (1–3 Units)
              </span>
              <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded">
                Critical
              </span>
            </div>
            <p className="text-2xl font-black text-orange-700 mt-2">
              {categorizedProducts.lowStock.length} <span className="text-sm font-normal text-orange-600">listings</span>
            </p>
            <div className="flex items-center justify-between text-[11px] text-orange-700 mt-2 pt-2 border-t border-orange-200/60">
              <span>Threshold re-order alert</span>
              <span className="font-semibold">Buffer needed</span>
            </div>
          </div>
        </div>

        {/* Total Vault Summary Bar */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200/80 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span>Total Units in Vault: <strong className="text-[#212121]">{totalUnits} units</strong></span>
            <span>•</span>
            <span>Total Catalogue Assets: <strong className="text-[#212121]">{currencySymbol}{totalVaultValue.toLocaleString('en-IN')}</strong></span>
            <span>•</span>
            <span>Total Catalogued Designs: <strong className="text-[#212121]">{products.length} pieces</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2874f0] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated BIS Hallmark & Vault Tracking Enabled</span>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter & Bulk Action Toolbar */}
      <div className="bg-white rounded-xl border border-[#e5e5ea] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, title, metal..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs text-[#212121] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2874f0] focus:border-[#2874f0]"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-[#212121] focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
            >
              <option value="all">All Categories ({availableCategories.length})</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Metal Filter */}
            <select
              value={metalFilter}
              onChange={(e) => setMetalFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs text-[#212121] focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
            >
              <option value="all">All Metals / Materials</option>
              {availableMetals.map(m => (
                <option key={m} value={m}>
                  {m.replace(/-/g, ' ')}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1 bg-white">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#212121] focus:outline-none cursor-pointer"
              >
                <option value="stock_desc">Stock: High to Low</option>
                <option value="stock_asc">Stock: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Action Controls (Visible if any product selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50/80 rounded-lg border border-blue-200 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <Check className="w-4 h-4 text-[#2874f0]" />
              <span>{selectedIds.length} piece{selectedIds.length > 1 ? 's' : ''} selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkToggle(true)}
                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
              >
                Activate Selected
              </button>
              <button
                type="button"
                onClick={() => handleBulkToggle(false)}
                className="px-2.5 py-1 rounded bg-amber-600 text-white font-medium hover:bg-amber-700 transition"
              >
                Deactivate Selected
              </button>
              <button
                type="button"
                onClick={() => handleBulkRestock(10)}
                className="px-2.5 py-1 rounded bg-[#2874f0] text-white font-medium hover:bg-blue-700 transition"
              >
                Restock (+10)
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Display Content: Either "Separate Sections" or "Tabbed View" */}
      {layoutMode === 'sections' ? (
        /* ================= SEPARATE SECTIONS MODE ================= */
        <div className="space-y-6">
          {/* SECTION A: ACTIVE PRODUCTS */}
          <div className="bg-white rounded-xl border border-emerald-200/90 shadow-xs overflow-hidden">
            <div 
              onClick={() => setCollapsedSections(prev => ({ ...prev, active: !prev.active }))}
              className="p-4 bg-emerald-50/80 border-b border-emerald-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-emerald-950 text-base">Active Products</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200/80 text-emerald-900">
                      {filterAndSortList(categorizedProducts.active).length} items
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Live pieces currently visible and purchasable in the storefront with active vault stock.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-emerald-800 hidden sm:inline">
                  {categorizedProducts.active.reduce((acc, p) => acc + (p.stockCount ?? 0), 0)} total units
                </span>
                {collapsedSections.active ? (
                  <ChevronDown className="w-5 h-5 text-emerald-800" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-emerald-800" />
                )}
              </div>
            </div>

            {!collapsedSections.active && (
              <div className="p-4 space-y-3 bg-white">
                {filterAndSortList(categorizedProducts.active).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No active products found matching current filter/search.
                  </div>
                ) : (
                  filterAndSortList(categorizedProducts.active).map(renderProductCard)
                )}
              </div>
            )}
          </div>

          {/* SECTION B: DEACTIVATED PRODUCTS */}
          <div className="bg-white rounded-xl border border-amber-200/90 shadow-xs overflow-hidden">
            <div 
              onClick={() => setCollapsedSections(prev => ({ ...prev, deactive: !prev.deactive }))}
              className="p-4 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center">
                  <PauseCircle className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-amber-950 text-base">Deactivated Products</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-900">
                      {filterAndSortList(categorizedProducts.deactive).length} items
                    </span>
                  </div>
                  <p className="text-xs text-amber-700">
                    Paused by seller. Hidden from buyers on the storefront while retaining vault stock & specs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-amber-800 hidden sm:inline">
                  {categorizedProducts.deactive.reduce((acc, p) => acc + (p.stockCount ?? 0), 0)} units preserved
                </span>
                {collapsedSections.deactive ? (
                  <ChevronDown className="w-5 h-5 text-amber-800" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-amber-800" />
                )}
              </div>
            </div>

            {!collapsedSections.deactive && (
              <div className="p-4 space-y-3 bg-white">
                {filterAndSortList(categorizedProducts.deactive).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No deactivated products. All products with stock are active!
                  </div>
                ) : (
                  filterAndSortList(categorizedProducts.deactive).map(renderProductCard)
                )}
              </div>
            )}
          </div>

          {/* SECTION C: OUT OF STOCK PRODUCTS */}
          <div className="bg-white rounded-xl border border-red-200/90 shadow-xs overflow-hidden">
            <div 
              onClick={() => setCollapsedSections(prev => ({ ...prev, out_of_stock: !prev.out_of_stock }))}
              className="p-4 bg-red-50/80 border-b border-red-200 flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-red-950 text-base">Out of Stock Products</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-200/80 text-red-900">
                      {filterAndSortList(categorizedProducts.outOfStock).length} items
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    Vault inventory depleted (0 units). Customers cannot buy until restocked by artisan workshop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-red-800 hidden sm:inline">
                  Restock Required
                </span>
                {collapsedSections.out_of_stock ? (
                  <ChevronDown className="w-5 h-5 text-red-800" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-red-800" />
                )}
              </div>
            </div>

            {!collapsedSections.out_of_stock && (
              <div className="p-4 space-y-3 bg-white">
                {filterAndSortList(categorizedProducts.outOfStock).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    Great news! No pieces are currently out of stock.
                  </div>
                ) : (
                  filterAndSortList(categorizedProducts.outOfStock).map(renderProductCard)
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= TABBED VIEW MODE ================= */
        <div className="bg-white rounded-xl border border-[#e5e5ea] p-6 shadow-xs space-y-5">
          {/* Sub-Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>All Products</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {categorizedProducts.active.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('deactive')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'deactive'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Deactive</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {categorizedProducts.deactive.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('out_of_stock')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'out_of_stock'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Out of Stock</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {categorizedProducts.outOfStock.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('low_stock')}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'low_stock'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-orange-700 hover:bg-orange-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {categorizedProducts.lowStock.length}
              </span>
            </button>
          </div>

          {/* Tab Product List */}
          <div className="space-y-3">
            {(() => {
              const listToFilter = activeTab === 'all'
                ? products
                : activeTab === 'active'
                ? categorizedProducts.active
                : activeTab === 'deactive'
                ? categorizedProducts.deactive
                : activeTab === 'out_of_stock'
                ? categorizedProducts.outOfStock
                : categorizedProducts.lowStock;

              const filtered = filterAndSortList(listToFilter);

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500 space-y-2">
                    <Package className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-sm font-medium">No products found in this category.</p>
                    <p className="text-xs text-gray-400">Try adjusting your search keywords or filters.</p>
                  </div>
                );
              }

              return filtered.map(renderProductCard);
            })()}
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#2874f0]" />
                <h3 className="font-bold text-gray-900 text-base">Restock Vault Units</h3>
              </div>
              <button
                onClick={() => setRestockProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <img 
                  src={restockProduct.images?.[0]} 
                  alt={restockProduct.name} 
                  className="w-12 h-12 object-cover rounded border border-gray-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{restockProduct.name}</h4>
                  <p className="text-[11px] text-gray-500">Current Stock: <strong className="text-red-600">{restockProduct.stockCount ?? 0} pcs</strong></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Units to Add into Vault
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#212121] focus:ring-1 focus:ring-[#2874f0]"
                  />
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">pieces</span>
                </div>
              </div>

              {/* Quick shortcut pills */}
              <div className="flex items-center gap-2">
                {[5, 10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockAmount(amt)}
                    className={`px-3 py-1 text-xs rounded-md border font-semibold transition ${
                      restockAmount === amt 
                        ? 'bg-[#2874f0] text-white border-[#2874f0]' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50/60 rounded-lg text-[11px] text-blue-800 border border-blue-100">
                ✓ Adding stock will automatically mark this piece <strong>Active</strong> and live in the online storefront.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyRestock}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Restock (+{restockAmount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Preview Specs Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Vault Piece Specifications</h3>
              <button
                onClick={() => setPreviewProduct(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex gap-4">
                <img 
                  src={previewProduct.images?.[0]} 
                  alt={previewProduct.name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0" 
                />
                <div>
                  <h4 className="font-bold text-sm text-[#212121]">{previewProduct.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{previewProduct.subtitle}</p>
                  <p className="text-sm font-bold text-[#2874f0] mt-1">{currencySymbol}{previewProduct.price.toLocaleString('en-IN')}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {previewProduct.sku || `SKU-${previewProduct.id.slice(-6)}`}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                      {previewProduct.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Karat Purity</span>
                  <span className="font-semibold text-gray-800">{previewProduct.karatPurity || 'Vedic Grade Natural Conch / Pola'}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Metal / Material</span>
                  <span className="font-semibold text-gray-800">{previewProduct.metalName || previewProduct.metal}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Origin & Workshop</span>
                  <span className="font-semibold text-gray-800">{previewProduct.origin || 'Nabadwip & Bowbazar'}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Current Vault Stock</span>
                  <span className="font-bold text-emerald-700">{previewProduct.stockCount ?? 0} pieces</span>
                </div>
              </div>

              {previewProduct.description && (
                <div className="text-xs text-gray-600 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                  <span className="font-bold text-gray-700 block mb-1">Catalogue Description:</span>
                  <p className="line-clamp-3">{previewProduct.description}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const prod = previewProduct;
                  setPreviewProduct(null);
                  onEditProduct(prod);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#2874f0] hover:bg-blue-50 rounded-lg transition flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Open Full Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
