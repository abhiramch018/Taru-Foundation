import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Edit3, Trash2, Layers, AlertCircle, Sparkles, CheckCircle2, TrendingUp, DollarSign, Package } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const sellerId = user?.id || user?._id;
      const data = await productApi.getProducts({ seller: sellerId });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Unable to load seller products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProducts();
    }
  }, [user]);

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      setDeletingId(productId);
      await productApi.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const defaultImg =
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&q=80';

  const approvedProducts = products.filter((p) => p.status === 'APPROVED');
  const pendingProducts = products.filter((p) => p.status === 'PENDING');
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
              SELLER HUB
            </span>
            <span className="text-xs text-gray-500">Verified Self-Help Group</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mt-1">
            {user?.shgName || user?.name || 'Artisan Cooperative'}
          </h1>
          <p className="text-xs text-gray-500">
            Rural Co-op Panel · {user?.district ? `${user.district}, ${user.state || ''}` : user?.address || 'India'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/seller/orders"
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>

          <Link
            to="/seller/products/create"
            className="px-5 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Live Approved Crafts
          </p>
          <p className="font-serif text-2xl font-bold text-emerald-800">
            {approvedProducts.length} Live
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Published on Marketplace</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Pending Quality Audit
          </p>
          <p className="font-serif text-2xl font-bold text-amber-700">
            {pendingProducts.length} Under Review
          </p>
          <p className="text-[11px] text-gray-400 font-medium">Awaiting platform audit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Inventory Units
          </p>
          <p className="font-serif text-2xl font-bold text-gray-900">
            {totalStock} Units
          </p>
          <p className="text-[11px] text-gray-500 font-medium">Across {products.length} catalog items</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Artisan Collective
          </p>
          <p className="font-serif text-2xl font-bold text-taru-dark truncate">
            {user?.membersCount || 'Active SHG'}
          </p>
          <p className="text-[11px] text-gray-500 font-medium">100% Direct Fair Trade</p>
        </div>
      </div>

      {/* Live Product Inventory Table */}
      <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">Live Product Inventory</h3>
            <p className="text-xs text-gray-500">Monitor stock levels, approval statuses, and piece types.</p>
          </div>

          <Link
            to="/seller/products/create"
            className="text-xs font-semibold text-taru-accent hover:text-taru-dark flex items-center space-x-1"
          >
            <span>+ Create Listing</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching inventory..." />
        ) : products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-gray-500">No craft products listed under your SHG collective yet.</p>
            <Link
              to="/seller/products/create"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-taru-dark text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-3">Artisan Pool Type</th>
                  <th className="py-3 px-3">Approval Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const imgUrl =
                    p.images && p.images.length > 0 ? p.images[0] : defaultImg;
                  const isDeleting = deletingId === p._id;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-3 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-taru-sand overflow-hidden flex-shrink-0">
                          <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-gray-900">{p.name}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-gray-600">{p.category}</td>

                      {/* Price */}
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-3">
                        <span
                          className={`font-medium ${
                            p.stock <= 1 ? 'text-amber-700' : 'text-gray-600'
                          }`}
                        >
                          {p.stock === 1 ? 'Only 1 left' : `${p.stock} in stock`}
                        </span>
                      </td>

                      {/* Pool Type */}
                      <td className="py-3 px-3">
                        <StatusBadge status={p.type || 'STANDARD'} type="productType" />
                      </td>

                      {/* Approval Status */}
                      <td className="py-3 px-3">
                        <StatusBadge status={p.status || 'APPROVED'} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/seller/products/${p._id}/edit`}
                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            disabled={isDeleting}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            {isDeleting ? (
                              <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
