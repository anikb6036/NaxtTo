import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  Check, 
  X, 
  Filter,
  Eye,
  Tag
} from 'lucide-react';
import { Product } from '../../types';

interface MasterCatalogViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  currencySymbol: string;
}

export const MasterCatalogView: React.FC<MasterCatalogViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  currencySymbol
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Master Catalog Governance</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {products.length} Jewellery Pieces
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centrally curate, authenticate gold hallmarks, and regulate artisan seller catalog listings.
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
            placeholder="Search master catalog by name or SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
        >
          <option value="all">All Heritage Categories</option>
          <option value="shakha">Shakha (Conch Shell)</option>
          <option value="pola">Pola (Coral)</option>
          <option value="gold-badhano">Gold Badhano</option>
          <option value="loha-badhano">Loha Badhano</option>
          <option value="bridal-combos">Bridal Heritage Sets</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:border-slate-300 transition-all">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                src={p.images[0]} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                  {p.karatPurity || '22K Gold'}
                </span>
                {p.inStock ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-xs">
                    In Stock ({p.stockCount})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/90 text-white backdrop-blur-xs">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  {p.category.replace('-', ' ')}
                </p>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5">{p.name}</h3>
                <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">{p.subtitle || p.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold font-mono text-slate-900">
                    {currencySymbol}{p.price.toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through ml-1.5 font-mono">
                      {currencySymbol}{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id={`delete-product-${p.id}`}
                    onClick={() => onDeleteProduct(p.id)}
                    title="Delete Piece Everywhere"
                    aria-label={`Delete ${p.name} everywhere`}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
