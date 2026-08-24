import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

const CATEGORIES_DATA = [
  {
    name: 'Handloom Textiles',
    slug: 'Handloom Textiles',
    count: '120+ Products',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Organic Foods',
    slug: 'Organic Foods',
    count: '80+ Products',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Handicrafts',
    slug: 'Handicrafts',
    count: '150+ Products',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Pottery',
    slug: 'Pottery',
    count: '95+ Products',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Natural Beauty',
    slug: 'Natural Beauty',
    count: '45+ Products',
    image: 'https://images.unsplash.com/photo-1608248597359-5f2571216d6c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Spices',
    slug: 'Spices',
    count: '65+ Products',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  },
];

export const HomePage = () => {
  const { isSeller, isAdmin, isPendingSeller } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProducts();
        setFeaturedProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (err) {
        console.error('Failed to load featured products:', err);
        setError('Unable to load featured masterpieces. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-taru-sand border border-taru-border text-taru-accent text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUPPORTING 120+ RURAL SHGS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.15] tracking-tight">
              Empowering Rural <br className="hidden sm:inline" />
              Artisans, One Purchase <br className="hidden sm:inline" />
              at a Time
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl font-normal leading-relaxed">
              Directly connect with women-led Self-Help Groups across India. Discover authentic handloom fabrics, organic foods, and masterfully crafted unique collectibles.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-taru-dark text-white rounded-full font-medium hover:bg-taru-dark-hover shadow-md transition-all transform hover:-translate-y-0.5"
              >
                Shop Now
              </Link>

              {isAdmin ? (
                <Link
                  to="/admin"
                  className="px-8 py-3.5 bg-white text-emerald-900 border border-emerald-300 rounded-full font-medium hover:bg-emerald-50 transition-all"
                >
                  Admin Hub
                </Link>
              ) : isSeller ? (
                <Link
                  to="/seller"
                  className="px-8 py-3.5 bg-white text-amber-900 border border-amber-300 rounded-full font-medium hover:bg-amber-50 transition-all"
                >
                  Seller Dashboard
                </Link>
              ) : isPendingSeller ? (
                <Link
                  to="/seller/onboarding"
                  className="px-8 py-3.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full font-medium hover:bg-amber-100 transition-all"
                >
                  Application Pending Audit
                </Link>
              ) : (
                <Link
                  to="/seller/onboarding"
                  className="px-8 py-3.5 bg-white text-taru-dark border border-taru-border rounded-full font-medium hover:bg-taru-sand transition-all"
                >
                  Become a Seller
                </Link>
              )}
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-taru-sand">
              <img
                src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80"
                alt="Rural Artisan Weaving on Loom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Phulia Weavers Cluster</span>
                <p className="text-sm font-serif italic text-white/90">"Preserving 400-year-old cotton weaving traditions."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#f4efe4] border-y border-taru-border/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">2,500+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Artisans Empowered</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">15,000+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Products Sold</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">₹1.2 Cr</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Revenue Generated</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">120+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">SHG Groups Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Sacred Crafts & Produce Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Explore Sacred Crafts & Produce
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-taru-sand border border-taru-border shadow-sm hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="font-serif text-sm sm:text-base font-bold leading-tight">
                  {cat.name}
                </p>
                <p className="text-[11px] text-amber-200/90 font-medium mt-0.5">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-taru-border">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Featured Masterpieces
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-normal">
              Hand-selected items carrying stories of community labor, regional soils, and ancient techniques
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-taru-accent hover:text-taru-dark transition-colors mt-3 sm:mt-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching verified rural products..." />
        ) : error ? (
          <div className="text-center py-12 bg-amber-50 rounded-2xl border border-amber-200 p-6 text-amber-900 text-sm">
            {error}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-taru-border p-8">
            <p className="text-gray-500 text-base font-medium">No approved products available right now.</p>
            <p className="text-gray-400 text-xs mt-1">Sellers can list products and Admins can approve them in the portal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Our Mission / Impact Highlight Section */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a3328] rounded-3xl text-white p-8 sm:p-14 overflow-hidden relative shadow-xl">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>THE TARU FOUNDATION MODEL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Reinventing Rural Livelihoods Through Direct Ethical Trade
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Every purchase made on Taru Foundation eliminates predatory middlemen. Over 70% of proceeds go directly to rural women's bank accounts, funding local community schools, healthcare, and sustainable self-reliance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">100% Authentic</h4>
                  <p className="text-xs text-gray-300">Verified GI & artisan certified craftwork.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <HeartHandshake className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Fair Pricing</h4>
                  <p className="text-xs text-gray-300">Artisans set prices reflecting true labor costs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Payouts</h4>
                  <p className="text-xs text-gray-300">Instant digital escrow settlement into SHG funds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
