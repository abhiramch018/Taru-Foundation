import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, Lock, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';

export const CheckoutPage = () => {
  const { cart, cartSubtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shipping Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [streetAddress, setStreetAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NET_BANKING, TEST

  const items = cart?.items || [];
  const shippingFee = items.length > 0 ? 150 : 0;
  const welfareTax = items.length > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  const finalTotal = cartSubtotal + shippingFee + welfareTax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!streetAddress || !city || !stateName || !pinCode) {
      setError('Please fill in all shipping address fields.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fullShippingAddress = `${fullName}, ${streetAddress}, ${city}, ${stateName} - ${pinCode}. Phone: ${phone}`;
      
      // 1. Create Order via POST /api/orders
      const orderRes = await orderApi.createOrder(fullShippingAddress);
      const createdOrder = orderRes?.order || orderRes;
      const orderId = createdOrder?._id || createdOrder?.id;

      // 2. Initiate Payment via POST /api/payments
      const paymentRes = await paymentApi.createPayment(orderId, paymentMethod);
      const initiatedPayment = paymentRes?.payment || paymentRes;
      const paymentId = initiatedPayment?.paymentId || initiatedPayment?._id || initiatedPayment?.id;

      // 3. Verify / Settle Test Payment via POST /api/payments/verify
      if (paymentId) {
        await paymentApi.verifyPayment(paymentId, true);
      }

      // 4. Refresh cart state
      await fetchCart();

      // 5. Navigate to confirmation screen
      navigate(`/orders/${orderId}/success`, {
        state: { order: createdOrder, payment: initiatedPayment },
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Your bag is empty</h2>
        <p className="text-sm text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-taru-dark text-white rounded-xl text-sm font-medium hover:bg-taru-dark-hover"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stepper Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="flex flex-col items-center z-10">
            <button
              onClick={() => setStep(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step >= 1
                  ? 'bg-taru-dark text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              1
            </button>
            <span className="text-xs font-semibold text-gray-800 mt-2">Shipping</span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 -mt-5 ${
              step >= 2 ? 'bg-taru-dark' : 'bg-gray-200'
            }`}
          />

          <div className="flex flex-col items-center z-10">
            <button
              onClick={() => fullName && streetAddress && setStep(2)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step >= 2
                  ? 'bg-taru-dark text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </button>
            <span className="text-xs font-semibold text-gray-800 mt-2">Payment</span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 -mt-5 ${
              step >= 3 ? 'bg-taru-dark' : 'bg-gray-200'
            }`}
          />

          <div className="flex flex-col items-center z-10">
            <button
              onClick={() => fullName && streetAddress && setStep(3)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step === 3
                  ? 'bg-taru-dark text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </button>
            <span className="text-xs font-semibold text-gray-800 mt-2">Review</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Checkout Form & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-taru-accent" />
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  Shipping Destination
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sanjana Shah"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Address (Street, House No., Village/Locality) *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Apartment 4B, Lotus Green Society"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai / Jaipur"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="Maharashtra / Rajasthan"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="400018"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!fullName || !streetAddress || !city || !stateName || !pinCode) {
                    setError('Please complete all required fields.');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="w-full py-3.5 bg-taru-dark text-white rounded-xl text-sm font-semibold hover:bg-taru-dark-hover transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <CreditCard className="w-5 h-5 text-taru-accent" />
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  Select Payment Method
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'UPI', title: 'Direct SHG-Transfer UPI', desc: 'Instant Google Pay / PhonePe / BHIM transfer' },
                  { id: 'CARD', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                  { id: 'NET_BANKING', title: 'Net Banking', desc: 'All Indian major banks supported' },
                  { id: 'TEST', title: 'Test Escrow Sandbox', desc: 'Instant automated test settlement' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === m.id
                        ? 'border-taru-dark bg-taru-sand ring-2 ring-taru-dark/20'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-gray-900">{m.title}</span>
                      {paymentMethod === m.id && <CheckCircle2 className="w-4 h-4 text-taru-dark" />}
                    </div>
                    <span className="text-[11px] text-gray-500">{m.desc}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Secure Payment Sandbox</span>
                </p>
                <p className="text-[11px]">
                  Your credentials and bank accounts are safe. Funds are held in escrow until SHG verification and dispatch.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-taru-border rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-taru-dark text-white rounded-xl text-sm font-semibold hover:bg-taru-dark-hover transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-taru-accent" />
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  Review & Confirm Order
                </h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <p className="font-bold text-gray-800">Delivery Address:</p>
                <p className="text-gray-600">
                  {fullName} | {streetAddress}, {city}, {stateName} - {pinCode}
                </p>
                <p className="text-gray-600">Phone: {phone}</p>
                <p className="pt-1 text-gray-800">
                  <strong>Payment:</strong> {paymentMethod} (Direct Village Escrow)
                </p>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-medium text-sm shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 py-1"
              >
                ← Back to Payment Method
              </button>
            </div>
          )}
        </div>

        {/* Right Order Details Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-6 sticky top-28">
          <h3 className="font-serif text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Details
          </h3>

          {/* Product Items List in Order Details */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => {
              const product = item.product || {};
              return (
                <div key={product._id || item.product} className="flex justify-between text-xs py-1">
                  <div className="pr-3">
                    <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    ₹{((product.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-900">₹{shippingFee}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>SHG Welfare Tax (5%)</span>
              <span className="font-medium text-gray-900">₹{welfareTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
              <span className="font-serif font-bold text-gray-900">Total Amount</span>
              <span className="font-serif text-xl font-bold text-taru-dark">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
