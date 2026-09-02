import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Tag, 
  Search, 
  Share2, 
  X, 
  Check, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { BlogPost, Product } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currencySymbol: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  products,
  onSelectProduct,
  onAddToCart,
  currencySymbol
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    'All',
    'Style & Stacking',
    'Gemology',
    'Care Guides',
    'Sustainability'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.seoKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShareArticle = (post: BlogPost) => {
    navigator.clipboard.writeText(`${window.location.origin}/journal/${post.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleQuickAddRelated = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  // Get related products for active post
  const relatedProducts = activePost 
    ? products.filter(p => activePost.relatedProductIds.includes(p.id))
    : [];

  return (
    <section id="journal-section" className="w-full bg-white py-20 border-t border-[#e5e5ea]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Journal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e5e5ea] pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-[#8c5d3b]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The NaxtTo Journal • Issue No. 04</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1d1d1f] font-normal leading-tight">
              Atelier, Metallurgy & <br />
              <span className="italic text-[#86868b]">The Art of Heirlooms.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] font-light max-w-xl">
              Comprehensive guides on precious gold karats, master stacking principles, ethical diamond metallurgy, and preservation secrets written by our master jewellers.
            </p>
          </div>

          {/* Search bar inside Journal */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, gold, care..."
              className="w-full bg-white border border-[#e5e5ea] rounded-full py-2 pl-9 pr-4 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f]"
            />
            <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'bg-white text-[#6e6e73] border border-[#e5e5ea] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              onClick={() => setActivePost(post)}
              className="group flex flex-col bg-white border border-[#e5e5ea] hover:border-[#d2d2d7] rounded-sm overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-106"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1d1d1f]/80 backdrop-blur-xs text-white text-[10px] tracking-wider uppercase font-semibold rounded-xs">
                  {post.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-[#8C7E70]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#1A1816] group-hover:text-[#8C5D3B] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#7A7065] font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Read More Link */}
                <div className="pt-3 border-t border-[#F2EDE5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#D8CEBF]"
                    />
                    <span className="text-[11px] text-[#5A524A] font-medium truncate max-w-[110px]">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1816] group-hover:text-[#8C5D3B] flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Editorial Article Modal */}
      {activePost && (
        <div
          id="article-reader-modal"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FAF9F5] rounded-sm shadow-2xl overflow-hidden border border-[#E8DFD1] my-8 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="sticky top-0 z-20 bg-[#FAF9F5]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8DFD1] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8C7E70]">
                <span className="font-semibold uppercase tracking-wider text-[#8C5D3B]">{activePost.category}</span>
                <span>•</span>
                <span>{activePost.readTime}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShareArticle(activePost)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EDE5] hover:bg-[#EAE2D7] text-[#1A1816] text-xs font-medium rounded-full transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share Story'}</span>
                </button>

                <button
                  onClick={() => setActivePost(null)}
                  className="p-1.5 rounded-full hover:bg-[#EFE9DF] text-[#1A1816]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Article Body Container */}
            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-10 space-y-8">
              {/* Title & Metadata */}
              <div className="space-y-4 max-w-2xl">
                <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1816] leading-[1.15]">
                  {activePost.title}
                </h1>
                <p className="text-base sm:text-lg text-[#7A7065] font-light italic leading-relaxed">
                  {activePost.subtitle}
                </p>

                {/* Author Card */}
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={activePost.author.avatar}
                    alt={activePost.author.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D8CEBF]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1816]">{activePost.author.name}</h4>
                    <p className="text-[11px] text-[#8C7E70]">{activePost.author.role} • Published {activePost.publishedAt}</p>
                  </div>
                </div>
              </div>

              {/* Cover Banner */}
              <div className="aspect-[21/9] w-full rounded-sm overflow-hidden bg-[#ECE5DA] shadow-inner">
                <img
                  src={activePost.coverImage}
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Table of Contents & Quick Jump */}
              <div className="p-5 bg-[#F4EFE7] border border-[#D8CEBF] rounded-sm max-w-xl space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1816] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Table of Contents</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#5A524A]">
                  {activePost.tableOfContents.map(toc => (
                    <li key={toc.id} className="hover:text-[#1A1816] hover:translate-x-1 transition-transform">
                      <a href={`#${toc.id}`} className="hover:underline">
                        {toc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Content Sections */}
              <div className="prose prose-stone max-w-none space-y-8 text-sm sm:text-base text-[#3A3530] font-light leading-relaxed">
                {activePost.contentSections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h2 className="font-serif text-2xl font-normal text-[#1A1816] pt-4 border-t border-[#E8DFD1]/60">
                      {section.heading}
                    </h2>

                    {section.body.map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}

                    {/* Pull Quote */}
                    {section.quote && (
                      <blockquote className="my-6 pl-4 border-l-2 border-[#D4AF37] italic font-serif text-lg text-[#1A1816] bg-[#F2EDE5]/50 py-3 pr-4">
                        "{section.quote}"
                      </blockquote>
                    )}

                    {/* Inline Story Image */}
                    {section.image && (
                      <div className="my-6 space-y-2">
                        <img
                          src={section.image}
                          alt={section.imageCaption || 'Editorial image'}
                          className="w-full rounded-sm max-h-[420px] object-cover"
                        />
                        {section.imageCaption && (
                          <p className="text-center text-xs text-[#8C7E70] italic">
                            {section.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SEO Meta Keywords Tags Strip */}
              <div className="pt-6 border-t border-[#E8DFD1] space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C7E70]">
                  SEO Indexing Keywords & Topics:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activePost.seoKeywords.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#F2EDE5] text-[#5A524A] text-[11px] rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shoppable Featured Pieces from this Article */}
              {relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-[#E8DFD1] space-y-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#8C5D3B]" />
                    <h3 className="font-serif text-xl font-medium text-[#1A1816]">
                      Featured Creations in this Story
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setActivePost(null);
                          onSelectProduct(prod);
                        }}
                        className="p-3 bg-[#FAF9F5] border border-[#D8CEBF] hover:border-[#1A1816] rounded-sm flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-14 h-14 rounded-xs object-cover bg-white shrink-0"
                          />
                          <div>
                            <h4 className="font-serif text-xs font-semibold text-[#1A1816] group-hover:text-[#8C5D3B] line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-[#8C7E70]">{currencySymbol}{prod.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleQuickAddRelated(prod, e)}
                          className={`p-2 rounded-lg transition-all shadow-2xs active:scale-95 ${
                            addedAnimationId === prod.id
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gradient-to-r from-[#FFAEC0] to-[#FFEBF0] hover:from-[#FF9EAF] hover:to-[#FFDDE6] text-[#1A1816] border border-[#FFAEC0]/40'
                          }`}
                          title="Add to Bag"
                        >
                          {addedAnimationId === prod.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5 text-[#1A1816]" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
