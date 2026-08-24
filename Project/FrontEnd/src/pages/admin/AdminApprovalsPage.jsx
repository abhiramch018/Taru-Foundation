import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { adminApi } from '../../api/adminApi';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminApprovalsPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'sellers'
  const [products, setProducts] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, sellersData] = await Promise.allSettled([
        productApi.getProducts({ all: 'true' }),
        adminApi.getPendingSellers(),
      ]);
      if (productsData.status === 'fulfilled') {
        setProducts(Array.isArray(productsData.value) ? productsData.value : []);
      }
      if (sellersData.status === 'fulfilled') {
        setPendingSellers(Array.isArray(sellersData.value) ? sellersData.value : []);
      }
    } catch (err) {
      console.error('Failed to load audits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await adminApi.approveProduct(id);
      setProducts(
        products.map((p) => (p._id === id ? { ...p, status: 'APPROVED' } : p))
      );
    } catch (err) {
      console.error('Approve failed:', err);
      alert(err.response?.data?.message || 'Failed to approve product.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await adminApi.rejectProduct(id);
      setProducts(
        products.map((p) => (p._id === id ? { ...p, status: 'REJECTED' } : p))
      );
    } catch (err) {
      console.error('Reject failed:', err);
      alert(err.response?.data?.message || 'Failed to reject product.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveSeller = async (id) => {
    setProcessingId(id);
    try {
      await adminApi.approveSeller(id);
      setPendingSellers(pendingSellers.filter((s) => s._id !== id));
      alert('Seller approved successfully! The user can now log in to access the Seller Portal.');
    } catch (err) {
      console.error('Seller approve failed:', err);
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
      console.error('Seller reject failed:', err);
      alert(err.response?.data?.message || 'Failed to reject seller.');
    } finally {
      setProcessingId(null);
    }
  };

  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Registration & Listing Audits</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Quality inspections and authentic cooperative registration validations.
          </p>
        </div>

        {/* Audit Tabs */}
        <div className="flex items-center space-x-2 bg-taru-sand p-1 rounded-xl border border-taru-border">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'products'
                ? 'bg-taru-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Product Audits ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'sellers'
                ? 'bg-taru-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Seller SHG Audits ({pendingSellers.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              {activeTab === 'products' ? 'Craft Products Review Queue' : 'SHG Seller Applications Queue'}
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              {activeTab === 'products' ? `${products.length} catalog items` : `${pendingSellers.length} pending applications`}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching audit queue..." />
          ) : activeTab === 'products' ? (
            products.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">
                No products found in audit queue.
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((p) => {
                  const imgUrl =
                    p.images && p.images.length > 0 ? p.images[0] : defaultImg;
                  const isProcessing = processingId === p._id;

                  return (
                    <div
                      key={p._id}
                      className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-taru-border hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-taru-sand overflow-hidden flex-shrink-0 border border-taru-border/60">
                          <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={p.type || 'STANDARD'} type="productType" />
                            <StatusBadge status={p.status || 'PENDING'} />
                          </div>
                          <h4 className="font-serif text-base font-bold text-gray-900">{p.name}</h4>
                          <p className="text-xs text-gray-500">
                            Submitted by: <strong className="text-gray-700">{p.seller?.name || 'Radha SHG'}</strong> · Stock: {p.stock} units
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                        <span className="font-serif text-base font-bold text-gray-900">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReject(p._id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                          >
                            Reject Listing
                          </button>
                          <button
                            onClick={() => handleApprove(p._id)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Sellers Audit Tab */
            pendingSellers.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400">
                No pending seller applications in the verification queue.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSellers.map((s) => {
                  const isProcessing = processingId === s._id;
                  const dateStr = s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }) : 'Recently';

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
                                <span key={c} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
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
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-40 whitespace-nowrap"
                        >
                          {isProcessing ? 'Processing...' : 'Approve & Grant Seller Access'}
                        </button>
                        <button
                          onClick={() => handleRejectSeller(s._id)}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Sidebar Inspection Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
            <h4 className="font-serif text-base font-bold text-gray-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Inspection Guidelines</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ensure that all standard catalog entries provide high-fidelity natural dye disclosures. In the event that photos depict machine-milled fabrics under handloom claims, reject the listing and notify the corresponding Taru hub.
            </p>

            <div className="pt-2 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Rejection Reason / Notes
              </label>
              <textarea
                rows="3"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Describe precisely what listing requirements are missing..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
