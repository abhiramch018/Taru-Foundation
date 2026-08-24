import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Star, Truck, ShieldCheck, ArrowLeft, ShoppingBag, Check, Layers } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err.response?.data?.message || 'Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80';

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [defaultImg];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    if (!isBuyer) {
      alert('Only Buyer accounts can add items to the cart.');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (result.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    } else {
      alert(result.message);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    if (!isBuyer) {
      alert('Only Buyer accounts can make purchases.');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (result.success) {
      navigate('/cart');
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Fetching craft details & provenance..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Product Unavailable</h2>
        <p className="text-sm text-gray-600">{error || 'This artisan piece is not available.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-taru-dark text-white rounded-xl text-sm font-medium hover:bg-taru-dark-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isUnique = product.type === 'UNIQUE';
  const sellerName = product.seller?.name || 'Radha SHG (Phulia Village)';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-taru-dark">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-taru-dark">Marketplace</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-taru-dark">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="bg-white rounded-3xl border border-taru-border/90 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 p-6 sm:p-10">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-taru-sand border border-taru-border/60">
            <img
              src={images[selectedImageIndex] || defaultImg}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={product.type || 'STANDARD'} type="productType" />
            </div>
          </div>

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-taru-dark ring-2 ring-taru-dark/20'
                      : 'border-taru-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Type badge */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-taru-accent">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Artisan Attribution & Stars */}
            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-gray-100 text-xs">
              <div className="flex items-center space-x-1.5 text-taru-dark font-medium">
                <Sparkles className="w-4 h-4 text-taru-accent" />
                <span className="font-semibold">By {sellerName}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
                <span className="text-gray-500 font-medium ml-1">(14 reviews)</span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-3xl font-bold text-gray-900">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500">Local Taxes included</span>
              </div>

              <div className="flex items-center space-x-2 pt-1 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
                <span
                  className={`font-semibold ${
                    isOutOfStock
                      ? 'text-red-600'
                      : isUnique
                      ? 'text-amber-700'
                      : 'text-gray-700'
                  }`}
                >
                  {isOutOfStock
                    ? 'Currently Out of Stock'
                    : isUnique
                    ? 'Unique 1-of-1 Piece available'
                    : `${product.stock} pieces available in stock`}
                </span>
              </div>
            </div>

            {/* Craft Story Box */}
            <div className="bg-taru-sand/50 p-4 rounded-2xl border border-taru-border/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-taru-dark flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-taru-accent" />
                <span>Craft Story</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector (Only if standard in stock) */}
            {!isOutOfStock && !isUnique && (
              <div className="flex items-center space-x-3 pt-2">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium text-sm border-2 transition-all flex items-center justify-center space-x-2 ${
                  addedSuccess
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-taru-dark text-taru-dark hover:bg-taru-sand'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || addingToCart}
                className="flex-1 py-3.5 px-6 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Trust value props */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-taru-accent flex-shrink-0" />
              <span>Ships in 2-3 business days</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-taru-accent flex-shrink-0" />
              <span>Conscious 7-Day Organic Craft return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
