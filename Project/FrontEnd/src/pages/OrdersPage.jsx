import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Download, Calendar, MapPin } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { invoiceApi } from '../api/invoiceApi';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderApi.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError(err.response?.data?.message || 'Unable to fetch your order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloadingId(orderId);
      await invoiceApi.downloadInvoice(orderId);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download invoice.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingSpinner text="Retrieving your orders & artisan dispatches..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track dispatches, view journey timelines, and download official NGO tax invoices.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-taru-dark text-white rounded-xl text-xs font-semibold hover:bg-taru-dark-hover"
        >
          <span>Shop More Crafts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="Support rural women Self-Help Groups by exploring our authentic handcrafted catalog."
          action={
            <Link
              to="/products"
              className="px-6 py-2.5 bg-taru-dark text-white rounded-xl text-xs font-medium"
            >
              Browse Products
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const isDownloading = downloadingId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-taru-border/90 p-5 sm:p-6 shadow-sm space-y-4 hover:border-taru-accent/40 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gray-900">
                      #TF-{order._id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                    <StatusBadge status={order.paymentStatus} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDownloadInvoice(order._id, e)}
                      disabled={isDownloading}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 flex items-center space-x-1.5 transition-colors"
                    >
                      {isDownloading ? (
                        <div className="w-3.5 h-3.5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Invoice</span>
                    </button>

                    <Link
                      to={`/orders/${order._id}`}
                      className="px-3.5 py-1.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items?.map((item, idx) => {
                    const product = item.product || {};
                    const defaultImg =
                      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80';
                    const imgUrl =
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : defaultImg;

                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 bg-gray-50/60 p-2.5 rounded-xl border border-gray-100"
                      >
                        <div className="w-12 h-12 rounded-lg bg-taru-sand overflow-hidden flex-shrink-0">
                          <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {product.name || 'Craft Product'}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Total & Shipping */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 border-t border-gray-50 gap-2">
                  <div className="flex items-center space-x-1 truncate max-w-md">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">Shipped to: {order.shippingAddress}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 mr-2">Total Amount:</span>
                    <span className="font-serif text-base font-bold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
