import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, CheckCircle2, Clock, MapPin, Package, Download, HelpCircle, ArrowLeft } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { invoiceApi } from '../api/invoiceApi';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError(err.response?.data?.message || 'Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = async () => {
    if (!order?._id) return;
    try {
      setDownloading(true);
      await invoiceApi.downloadInvoice(order._id);
    } catch (err) {
      console.error('Failed to download invoice:', err);
      alert('Unable to download invoice.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingSpinner text="Fetching live dispatch telemetry..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-sm text-gray-500">{error || 'Could not retrieve details for this order ID.'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-taru-dark text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  // Determine active step index based on orderStatus
  const statusSteps = [
    { key: 'PLACED', title: 'Order Placed', desc: 'Sustaining communities - SHG confirmed production' },
    { key: 'CONFIRMED', title: 'SHG Dispatched', desc: 'Craft curated and leaves village cluster' },
    { key: 'PROCESSING', title: 'In Transit', desc: 'Handed over to delivery partner Delhivery (#DLV903178041)' },
    { key: 'SHIPPED', title: 'Out for Delivery', desc: 'Nearing your destination address' },
    { key: 'DELIVERED', title: 'Delivered', desc: 'Enjoy your handcrafted heritage masterpiece!' },
  ];

  const currentStatus = order.orderStatus || 'PLACED';
  const getStepState = (stepIndex) => {
    const statusMap = { PLACED: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4 };
    const currentIndex = statusMap[currentStatus] ?? 1;
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const orderIdShort = `#TF-${order._id.slice(-8).toUpperCase()}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/orders" className="text-xs text-gray-400 hover:text-gray-700">Orders</Link>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-xs font-mono text-gray-600">{orderIdShort}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mt-1">Delivery Tracking</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            Order ID: {orderIdShort} · Partner: Delhivery Logistics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <StatusBadge status={currentStatus} />
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="px-4 py-2 bg-taru-sand hover:bg-taru-sand-dark text-taru-dark border border-taru-border rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            {downloading ? (
              <div className="w-3.5 h-3.5 border-2 border-taru-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Invoice PDF</span>
          </button>
        </div>
      </div>

      {/* Main Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Journey Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-taru-border p-6 sm:p-8 shadow-card space-y-6">
          <h3 className="font-serif text-xl font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-taru-accent" />
            <span>Journey Timeline</span>
          </h3>

          <div className="space-y-8 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
            {statusSteps.map((s, idx) => {
              const state = getStepState(idx);

              return (
                <div key={s.key} className="relative flex items-start space-x-4">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                      state === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : state === 'current'
                        ? 'bg-taru-dark text-white ring-taru-sand'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {state === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px]">{idx + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-bold ${
                        state === 'current'
                          ? 'text-taru-dark font-serif text-base'
                          : state === 'completed'
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Map & Support Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Route Graphic Card */}
          <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
            <h4 className="font-serif text-base font-bold text-gray-900">Current Dispatch Status</h4>
            <div className="relative rounded-xl overflow-hidden bg-emerald-950 p-6 text-white text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800/80 mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6 text-emerald-300 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                  Delhi Transit Hub
                </p>
                <p className="text-xs text-gray-300">
                  Sorted and dispatched towards destination hub
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
              <p className="font-semibold text-gray-800">Destination Address:</p>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Need Help Box */}
          <div className="bg-[#fcfbf8] rounded-2xl border border-taru-border p-6 space-y-3">
            <div className="flex items-center space-x-2 text-taru-dark font-serif font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-taru-accent" />
              <span>Need Help with Delivery?</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our rural cooperative coordinators monitor regional courier logistics daily. For inquiries, email <span className="font-medium text-taru-dark">support@tarufoundation.org</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
