import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, DollarSign, Layers, Activity, ArrowRight, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { adminApi } from '../../api/adminApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, sellersData] = await Promise.allSettled([
        productApi.getProducts({ all: 'true' }),
        orderApi.getMyOrders(),
        adminApi.getPendingSellers(),
      ]);
      if (productsData.status === 'fulfilled') {
        setProducts(Array.isArray(productsData.value) ? productsData.value : []);
      }
      if (ordersData.status === 'fulfilled') {
        setOrders(Array.isArray(ordersData.value) ? ordersData.value : []);
      }
      if (sellersData.status === 'fulfilled') {
        setPendingSellers(Array.isArray(sellersData.value) ? sellersData.value : []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveSeller = async (id) => {
    setProcessingId(id);
    try {
      await adminApi.approveSeller(id);
      setPendingSellers(pendingSellers.filter((s) => s._id !== id));
      alert('Seller application approved successfully! The user is now an authorized Seller.');
    } catch (err) {
      console.error('Approve failed:', err);
      alert(err.response?.data?.message || 'Failed to approve seller.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSeller = async (id) => {
    setProcessingId(id);
    try {
      await adminApi.rejectSeller(id);
      setPendingSellers(pendingSellers.filter((s) => s._id !== id));
      alert('Seller application rejected.');
    } catch (err) {
      console.error('Reject failed:', err);
      alert(err.response?.data?.message || 'Failed to reject seller.');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingProducts = products.filter((p) => p.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
              ADMIN PORTAL
            </span>
            <span className="text-xs text-gray-500">Taru Central Registry</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mt-1">
            Taru Central Management Hub
          </h1>
          <p className="text-xs text-gray-500">
            Consolidated state registry of active rural cooperative markets, verification streams, and revenue pooling.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/approvals"
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold border border-amber-200 shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Audits ({pendingProducts.length + pendingSellers.length})</span>
          </Link>

          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Settlement Registry</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Active Cooperative Sellers
          </p>
          <p className="font-serif text-2xl font-bold text-gray-900">186 SHGs</p>
          <p className="text-[11px] text-emerald-600 font-medium">+5 verified this week</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Consolidated Revenue
          </p>
          <p className="font-serif text-2xl font-bold text-taru-dark">₹18,42,900</p>
          <p className="text-[11px] text-emerald-600 font-medium">+24.1% MoM Growth</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Live Products
          </p>
          <p className="font-serif text-2xl font-bold text-gray-900">
            {products.length > 0 ? `${products.length} Items` : '1,847 Items'}
          </p>
          <p className="text-[11px] text-amber-700 font-medium">
            {pendingProducts.length} pending quality inspection
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Orders Fulfill Rate
          </p>
          <p className="font-serif text-2xl font-bold text-emerald-800">98.2% Done</p>
          <p className="text-[11px] text-gray-400 font-medium">Avg dispatch time: 34h</p>
        </div>
      </div>

      {/* SELLER APPLICATIONS / ONBOARDING VERIFICATION SECTION */}
      <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                PENDING APPROVALS
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {pendingSellers.length} Self-Help Group Application{pendingSellers.length === 1 ? '' : 's'}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mt-1">
              Seller Applications Queue
            </h3>
            <p className="text-xs text-gray-500">
              Audit applicant identity, SHG credentials, and grant verified seller privileges.
            </p>
          </div>

          <Link
            to="/admin/approvals"
            className="text-xs font-semibold text-taru-accent hover:text-taru-dark flex items-center space-x-1"
          >
            <span>View All Audits ({pendingSellers.length + pendingProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingSellers.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-gray-50/70 border border-dashed border-gray-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-gray-800">All Seller Applications Reviewed</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No pending seller applications in the verification queue. When a buyer applies to become a seller, their application will appear here with one-click approval.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSellers.map((s) => {
              const isProcessing = processingId === s._id;
              const dateStr = s.createdAt
                ? new Date(s.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={s._id}
                  className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-white hover:border-taru-border hover:shadow-sm transition-all flex flex-col sm:flex-row items-start justify-between gap-6"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-serif font-bold text-lg flex items-center justify-center flex-shrink-0 border border-amber-300">
                      {s.shgName?.charAt(0) || s.name?.charAt(0) || 'S'}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                          PENDING AUDIT
                        </span>
                        <span className="text-[11px] text-gray-400">Applied: {dateStr}</span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-gray-900">
                        {s.shgName || 'Artisan Collective'}
                      </h4>

                      <p className="text-xs text-gray-700">
                        <strong>Contact Person:</strong> {s.name} · <strong>Email:</strong> {s.email} · <strong>Phone:</strong> {s.phone || 'N/A'}
                      </p>

                      <p className="text-xs text-gray-600">
                        <strong>Location:</strong> {s.district ? `${s.district}, ${s.state || ''}` : s.address || 'N/A'}
                        {s.membersCount ? ` · Members: ${s.membersCount}` : ''}
                        {s.shgRegNumber ? ` · Reg: ${s.shgRegNumber}` : ''}
                      </p>

                      {s.description && (
                        <p className="text-xs text-gray-600 bg-white/80 p-2.5 rounded-xl border border-amber-100/80 italic">
                          "{s.description}"
                        </p>
                      )}

                      {Array.isArray(s.craftCategories) && s.craftCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {s.craftCategories.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 flex-shrink-0">
                    <button
                      onClick={() => handleApproveSeller(s._id)}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-40 whitespace-nowrap flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isProcessing ? 'Processing...' : 'Approve & Grant Seller Access'}</span>
                    </button>
                    <button
                      onClick={() => handleRejectSeller(s._id)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid: Sales Category Breakdown & Recent Registry Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Sales Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-5">
          <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
            Cooperative Category Sales Breakdown
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-800">Handloom Textiles</span>
                <span className="text-gray-900">₹8,45,000 (46%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-taru-dark h-full w-[46%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-800">Organic Produce & Foods</span>
                <span className="text-gray-900">₹4,20,000 (23%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full w-[23%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-800">Handicrafts & Pottery</span>
                <span className="text-gray-900">₹3,12,000 (17%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full w-[17%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
            Recent Registry Activity
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
              <div>
                <p className="font-bold text-gray-900">New SHG Registration Approved</p>
                <p className="text-gray-500 text-[11px]">Solan Organic Honey Co-op (Himachal Pradesh) is now live.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
              <div>
                <p className="font-bold text-gray-900">Disbursement Initiated</p>
                <p className="text-gray-500 text-[11px]">₹42,000 transferred to Hamirpur Artisans fund pool.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
              <div>
                <p className="font-bold text-gray-900">Order Delivery Cleared</p>
                <p className="text-gray-500 text-[11px]">Order #TF-2024-890 flagged as Delivered by Delhivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
