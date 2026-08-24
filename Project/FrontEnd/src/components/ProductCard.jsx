import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80';

  const imageUrl =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : defaultImg;

  const sellerName = product.seller?.name || 'Artisan SHG Partner';
  const isOutOfStock = product.stock <= 0;
  const isOnlyOne = product.stock === 1 || product.type === 'UNIQUE';

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isBuyer) {
      alert('Please log in with a Buyer account to add items to cart.');
      return;
    }

    setAdding(true);
    const res = await addToCart(product._id, 1);
    setAdding(false);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert(res.message);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-taru-border/80 hover:border-taru-accent/50 hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] bg-taru-sand/50 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImg;
          }}
        />

        {/* Product Type Badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={product.type || 'STANDARD'} type="productType" />
        </div>

        {/* Quick Add Button Overlay on Hover */}
        {!isOutOfStock && (!isAuthenticated || isBuyer) && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={adding}
              title="Quick Add to Cart"
              className={`p-2.5 rounded-full shadow-md text-white transition-all transform active:scale-95 ${
                added
                  ? 'bg-emerald-600'
                  : 'bg-taru-dark hover:bg-taru-accent'
              }`}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : adding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Artisan Name */}
          <div className="flex items-center space-x-1 text-[11px] font-medium text-taru-accent mb-1 truncate">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">By {sellerName}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-taru-accent transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Stock Info */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-base text-gray-900">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>

          <span
            className={`text-xs font-medium ${
              isOutOfStock
                ? 'text-red-500'
                : isOnlyOne
                ? 'text-amber-600 font-semibold'
                : 'text-gray-500'
            }`}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : isOnlyOne
              ? 'Only 1 Left'
              : `${product.stock} in stock`}
          </span>
        </div>
      </div>
    </Link>
  );
};
