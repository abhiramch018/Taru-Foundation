import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

const CATEGORIES_LIST = [
  'Handloom Textiles',
  'Organic Foods',
  'Handicrafts',
  'Pottery',
  'Natural Beauty',
  'Spices',
];

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [productType, setProductType] = useState('ALL'); // 'ALL' | 'STANDARD' | 'UNIQUE'
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-low' | 'price-high' | 'name'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Unable to load products from server. Please verify the backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Category counts calculated from live products
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES_LIST.forEach((cat) => {
      counts[cat] = products.filter(
        (p) => p.category?.toLowerCase() === cat.toLowerCase()
      ).length;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term matching name, description, category, or seller name
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesName = p.name?.toLowerCase().includes(term);
          const matchesDesc = p.description?.toLowerCase().includes(term);
          const matchesCat = p.category?.toLowerCase().includes(term);
          const matchesSeller = p.seller?.name?.toLowerCase().includes(term);
          if (!matchesName && !matchesDesc && !matchesCat && !matchesSeller) return false;
        }

        // Category filter
        if (selectedCategory !== 'All') {
          if (p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Product type filter
        if (productType !== 'ALL') {
          if (p.type !== productType) return false;
        }

        // Price filter
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // newest default
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, searchTerm, selectedCategory, productType, maxPrice, sortBy]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setProductType('ALL');
    setMaxPrice(10000);
    setSortBy('newest');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-taru-dark">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-taru-dark text-white'
                : 'text-gray-600 hover:bg-taru-sand'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] opacity-80">({products.length})</span>
          </button>
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-taru-dark text-white'
                  : 'text-gray-600 hover:bg-taru-sand'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[11px] opacity-80">
                ({categoryCounts[cat] || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-taru-border/70">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-taru-dark">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-gray-700">
            Up to ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="15000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-taru-sand rounded-lg appearance-none cursor-pointer accent-taru-dark"
        />
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>₹100</span>
          <span>₹15,000+</span>
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-3 pt-4 border-t border-taru-border/70">
        <h4 className="text-xs font-bold uppercase tracking-wider text-taru-dark">
          Product Type
        </h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="prodType"
              checked={productType === 'ALL'}
              onChange={() => setProductType('ALL')}
              className="accent-taru-dark"
            />
            <span>All Craft Items</span>
          </label>
          <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="prodType"
              checked={productType === 'STANDARD'}
              onChange={() => setProductType('STANDARD')}
              className="accent-taru-dark"
            />
            <span>Standard In-Stock</span>
          </label>
          <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="prodType"
              checked={productType === 'UNIQUE'}
              onChange={() => setProductType('UNIQUE')}
              className="accent-taru-dark"
            />
            <span className="text-amber-800 font-medium">Unique Pieces Only (1-of-1)</span>
          </label>
        </div>
      </div>

      {/* Clear Filters CTA */}
      <button
        onClick={clearAllFilters}
        className="w-full py-2 px-3 text-xs font-semibold text-gray-600 bg-taru-sand hover:bg-taru-sand-dark rounded-xl border border-taru-border transition-colors flex items-center justify-center space-x-1.5"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Discover Rural Artisanal Heritage
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse authentic handmade crafts and organic produce directly from rural women-led Self-Help Groups.
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crafts, SHGs, villages, materials..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-taru-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-taru-border rounded-xl text-xs font-semibold text-gray-700 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-white border border-taru-border rounded-xl px-3 py-2 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="newest">Popularity / Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-taru-border/90 shadow-card sticky top-28">
          {filterSidebarContent}
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {loading ? (
            <LoadingSpinner text="Loading craft marketplace..." />
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200 p-6 text-red-800 text-sm">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-taru-border p-8 space-y-3">
              <p className="font-serif text-lg font-bold text-gray-800">
                No matching handcrafted items found
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try adjusting your search keywords, price filter, or selecting a different category.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-taru-dark text-white rounded-xl text-xs font-medium hover:bg-taru-dark-hover"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>
                  Showing <strong className="text-gray-800">{filteredProducts.length}</strong> items
                </span>
                {selectedCategory !== 'All' && (
                  <span className="bg-taru-sand px-2.5 py-0.5 rounded-full text-taru-dark font-medium">
                    Category: {selectedCategory}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {filterSidebarContent}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-taru-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
