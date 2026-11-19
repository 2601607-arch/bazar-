import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export function CategoriesPage() {
  const { products, queryParams, navigate } = useStore();
  const activeCat = queryParams.get('cat') || 'all';
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filtered = useMemo(() => {
    const base =
      activeCat === 'all'
        ? products
        : products.filter((p) => p.categorySlug === activeCat);
    const list = [...base];
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCat, sortBy]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#18181B]">
            Product Categories
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Showing <span className="font-mono font-semibold tabular-nums">{filtered.length}</span> products across verified marketplace vendors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="cat-sort" className="text-xs font-medium text-zinc-500">
            Sort by
          </label>
          <select
            id="cat-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-[#18181B] focus:outline-none focus:border-[#F85606]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => navigate('/categories')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
            activeCat === 'all'
              ? 'bg-[#F85606] border-[#F85606] text-white'
              : 'bg-white border-zinc-200 text-zinc-700 hover:border-[#F85606]'
          }`}
        >
          All Products
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => navigate(`/categories?cat=${cat.slug}`)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
              activeCat === cat.slug
                ? 'bg-[#F85606] border-[#F85606] text-white'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-[#F85606]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-sm text-zinc-600 mb-4">No products found in this category yet.</p>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="px-4 py-2 rounded-lg bg-[#F85606] text-white text-sm font-semibold cursor-pointer"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchPage() {
  const { products, queryParams, navigate } = useStore();
  const initialQuery = queryParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const term = (queryParams.get('q') || '').trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.sellerName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [products, queryParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  const activeTerm = queryParams.get('q') || '';

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="font-display text-2xl font-bold text-[#18181B]">
            {activeTerm ? `Search Results for "${activeTerm}"` : 'Search Marketplace'}
          </h1>
          <span className="text-sm text-zinc-500 tabular-nums">
            {results.length} matching products
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headphones, smartwatch, espresso, seller..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#18181B]">
            No products matched "{activeTerm}"
          </p>
          <p className="text-sm text-zinc-600">
            Try searching for headphones, smartwatch, keyboard, espresso, backpack, or shoes.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              navigate('/search');
            }}
            className="px-4 py-2 rounded-lg bg-[#F85606] text-white text-sm font-semibold cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
