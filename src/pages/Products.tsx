import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Package, RefreshCw } from 'lucide-react';
import { API } from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    API.get('/products/categories/all')
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch products whenever category, search, sort, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get('/products', {
          params: {
            category: currentCategory,
            search: searchQuery,
            sort: sortBy,
            page,
            limit: 9
          }
        });

        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.pagination.totalPages);
          setTotalItems(res.data.pagination.total);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, searchQuery, sortBy, page]);

  const handleCategoryChange = (slug: string) => {
    setPage(1);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-900 font-serif-brand">
          Restaurant Packaging Catalog
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Wholesale food-grade containers, corrugated pizza boxes, kraft bags, and custom branding solutions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza boxes, burger packaging, cups..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 whitespace-nowrap">
            Showing <strong className="text-stone-800 font-mono">{products.length}</strong> of{' '}
            <strong className="text-stone-800 font-mono">{totalItems}</strong> products
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="moq_asc">Lowest MOQ</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Interactive Filter Tabs allowed by frontend-design §1.A) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            currentCategory === 'all'
              ? 'bg-[#174D37] text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentCategory === cat.slug
                ? 'bg-[#174D37] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-stone-200 p-4 space-y-4 animate-pulse">
              <div className="w-full aspect-4/3 bg-stone-200 rounded-lg" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
              <div className="h-8 bg-stone-200 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No products matched your criteria</h3>
          <p className="text-xs text-stone-500">
            Try resetting your search query or selecting a different packaging category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg tabular-nums transition-colors ${
                page === i + 1
                  ? 'bg-[#174D37] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
