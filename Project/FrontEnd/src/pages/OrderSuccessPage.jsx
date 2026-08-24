import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Heart, ArrowRight, Download, Package, Sparkles } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { invoiceApi } from '../api/invoiceApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const data = await orderApi.getOrderById(id);
          setOrder(data);
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const handleDownloadInvoice = async () => {
    if (!order?._id) return;
    try {
      setDownloading(true);
      await invoiceApi.downloadInvoice(order._id);
    } catch (err) {
      console.error('Failed to download invoice:', err);
      alert('Unable to download invoice PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingSpinner text="Confirming order details & payment settlement..." />
      </div>
    );
  }

  const orderIdShort = order?._id ? `#TF-${order._id.slice(-8).toUpperCase()}` : '#TF-SUCCESS';
  const items = order?.items || [];
  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner with Checkmark */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-gray-500">
          Thank you for your support. Your order <span className="font-mono font-bold text-taru-dark">{orderIdShort}</span> is on its way.
        </p>
      </div>

      {/* Impact Card */}
      <div className="bg-[#fcf7ee] border border-[#ebdcc4] rounded-2xl p-6 sm:p-7 space-y-2 relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-taru-accent fill-taru-accent flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-serif text-base font-bold text-gray-900">
              You're making a real difference!
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              This purchase directly supports rural women artisans across partner Self-Help Groups. Over 70% of the proceeds go directly back to rural women artisans to sustain local livelihoods.
            </p>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Ordered Items List (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-taru-border p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            Your Ordered Items
          </h3>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const product = item.product || {};
              const imgUrl =
                product.images && product.images.length > 0 ? product.images[0] : defaultImg;

              return (
                <div key={idx} className="flex items-center justify-between space-x-4 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-xl bg-taru-sand overflow-hidden flex-shrink-0">
                      <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name || 'Handcrafted Craft Item'}</p>
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-xs text-gray-900">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary Box (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-taru-border p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            Payment Summary
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                {order?.paymentStatus || 'PAID'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Order Status</span>
              <span className="font-semibold text-gray-800 uppercase">
                {order?.orderStatus || 'CONFIRMED'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-serif text-lg font-bold text-taru-dark">
                ₹{(order?.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => navigate(`/orders/${order?._id}`)}
              className="w-full py-3 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Track Your Order</span>
            </button>

            <button
              onClick={handleDownloadInvoice}
              disabled={downloading}
              className="w-full py-2.5 bg-taru-sand hover:bg-taru-sand-dark text-taru-dark border border-taru-border rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-2 border-taru-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Official Invoice (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
