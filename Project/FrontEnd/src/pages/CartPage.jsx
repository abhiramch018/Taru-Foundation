import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CartPage = () => {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  const items = cart?.items || [];
  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80';

  const shippingFee = items.length > 0 ? 150 : 0;
  const welfareTax = items.length > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  const finalTotal = Math.max(0, cartSubtotal + shippingFee + welfareTax - promoDiscount);

  const handleQuantityChange = async (productId, currentQty, delta, maxStock, isUnique) => {
    if (isUnique) return;
    const newQty = currentQty + delta;
    if (newQty < 1 || newQty > maxStock) return;

    setUpdatingId(productId);
    await updateQuantity(productId, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ARTISAN10' || promoCode.trim().toUpperCase() === 'TARU10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "ARTISAN10" for 10% artisan support discount.');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text="Loading your shopping bag..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-taru-sand rounded-full flex items-center justify-center mx-auto text-taru-dark">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-gray-900">Your Shopping Bag is Empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Discover authentic handcrafted products and organic harvest directly from rural women Self-Help Groups.
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-taru-dark text-white rounded-full font-medium hover:bg-taru-dark-hover shadow-md transition-all"
          >
            <span>Explore Sacred Crafts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Your Shopping Bag
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {items.length} item{items.length > 1 ? 's' : ''} in your cart awaiting direct village dispatch
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item.product;
            const isUnique = product.type === 'UNIQUE';
            const imgUrl =
              product.images && product.images.length > 0 ? product.images[0] : defaultImg;
            const isUpdating = updatingId === productId;

            return (
              <div
                key={productId}
                className="bg-white rounded-2xl border border-taru-border/90 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-taru-accent/40"
              >
                {/* Product Info & Thumb */}
                <div className="flex items-center space-x-4 flex-1">
                  <Link
                    to={`/products/${productId}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-taru-sand overflow-hidden flex-shrink-0 border border-taru-border/60"
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImg;
                      }}
                    />
                  </Link>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={product.type || 'STANDARD'} type="productType" />
                    </div>
                    <Link
                      to={`/products/${productId}`}
                      className="font-serif text-base sm:text-lg font-semibold text-gray-900 hover:text-taru-accent transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-taru-accent font-medium flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isUnique ? 'Exclusive 1-of-1 Piece' : 'Direct Village Produce'}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity & Pricing Controls */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity */}
                  {!isUnique ? (
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            productId,
                            item.quantity,
                            -1,
                            product.stock,
                            isUnique
                          )
                        }
                        disabled={item.quantity <= 1 || isUpdating}
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            productId,
                            item.quantity,
                            1,
                            product.stock,
                            isUnique
                          )
                        }
                        disabled={item.quantity >= product.stock || isUpdating}
                        className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                      Qty: 1
                    </span>
                  )}

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="font-semibold text-base text-gray-900">
                      ₹{((product.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      ₹{product.price} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(productId)}
                    disabled={isUpdating}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-taru-border/90 p-6 shadow-card space-y-6 sticky top-28">
          <h3 className="font-serif text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Craft Shipping (Direct from villages)</span>
              <span className="font-semibold text-gray-900">₹{shippingFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SHG Welfare Tax (5%)</span>
              <span className="font-semibold text-gray-900">₹{welfareTax.toLocaleString('en-IN')}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Artisan Promo Discount</span>
                <span>-₹{promoDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-gray-900">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-taru-dark">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyPromo} className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Welfare / Promo Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="e.g. ARTISAN10"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-taru-sand text-taru-dark border border-taru-border rounded-xl text-xs font-bold hover:bg-taru-sand-dark transition-colors"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>10% artisan community discount active</span>
              </p>
            )}
          </form>

          {/* Proceed to Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center text-xs text-gray-400 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure 256-bit SSL Village Payment Escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
