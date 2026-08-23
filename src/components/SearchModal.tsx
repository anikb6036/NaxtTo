import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Gem, BookOpen } from 'lucide-react';
import { Product, BlogPost } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  blogPosts: BlogPost[];
  onSelectProduct: (product: Product) => void;
  onSelectArticle: (article: BlogPost) => void;
  currencySymbol: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  blogPosts,
  onSelectProduct,
  onSelectArticle,
  currencySymbol
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const matchingProducts = query.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    p.metalName.toLowerCase().includes(query.toLowerCase()) ||
    p.styleName.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchingArticles = query.trim() === '' ? [] : blogPosts.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    b.category.toLowerCase().includes(query.toLowerCase()) ||
    b.seoKeywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
  );

  const popularSearches = ['18K Solid Gold Band', 'Diamond Solitaire', 'Baroque Pearl', 'Hoops', 'Ring Stacking'];

  return (
    <div 
      id="search-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="search-modal-card"
        className="w-full max-w-2xl bg-[#FAF9F5] rounded-sm shadow-2xl overflow-hidden border border-[#E8DFD1] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8DFD1] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C7E70]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gold bands, diamonds, pearls, journal guides..."
            className="flex-1 bg-transparent text-base sm:text-lg text-[#1A1816] placeholder:text-[#A89F91] focus:outline-none font-light"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#8C7E70] hover:text-[#1A1816] p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-semibold text-[#8C5D3B] hover:text-[#1A1816] ml-2"
          >
            Esc
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="p-4 bg-[#F2EDE5] border-b border-[#E8DFD1] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8C7E70] font-medium shrink-0">Popular:</span>
          {popularSearches.map(term => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#EAE2D7] text-[#4A443D] rounded-full border border-[#D8CEBF] shrink-0 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-[#8C7E70]">
              Type a metal type, stone, or jewellery name to search the NaxtTo collection.
            </div>
          ) : (
            <>
              {/* Products Found */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                  <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Jewellery Creations ({matchingProducts.length})</span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(prod);
                        }}
                        className="p-3 bg-[#FAF9F5] border border-[#E8DFD1] hover:border-[#1A1816] rounded-xs flex items-center gap-3 cursor-pointer transition-colors group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xs object-cover bg-[#ECE5DA] shrink-0"
                        />
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-serif text-xs font-semibold text-[#1A1816] group-hover:text-[#8C5D3B] truncate">
                            {prod.name}
                          </h4>
                          <p className="text-[10px] text-[#8C7E70] truncate">{prod.metalName}</p>
                          <span className="text-xs font-medium text-[#1A1816] mt-0.5 block">{currencySymbol}{prod.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C7E70] italic">No jewellery pieces matched "{query}".</p>
                )}
              </div>

              {/* Articles Found */}
              <div className="space-y-3 pt-4 border-t border-[#E8DFD1]">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                  <BookOpen className="w-3.5 h-3.5 text-[#8C5D3B]" />
                  <span>Journal Stories & Guides ({matchingArticles.length})</span>
                </div>

                {matchingArticles.length > 0 ? (
                  <div className="space-y-2">
                    {matchingArticles.map(article => (
                      <div
                        key={article.id}
                        onClick={() => {
                          onClose();
                          onSelectArticle(article);
                        }}
                        className="p-3 bg-[#FAF9F5] border border-[#E8DFD1] hover:border-[#1A1816] rounded-xs flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8C5D3B]">{article.category}</span>
                          <h5 className="font-serif text-xs font-semibold text-[#1A1816] group-hover:text-[#8C5D3B] line-clamp-1">{article.title}</h5>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#8C7E70] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C7E70] italic">No journal articles matched "{query}".</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
