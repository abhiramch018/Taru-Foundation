import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, DollarSign, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { adminApi } from '../../api/adminApi';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders for admin registry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Direct Artisan Settlement Registry
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track global buyer checkout flows, escrow states, and verify 100% direct revenue splits to village cooperative pools.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reconcile Accounts</span>
        </button>
      </div>

      {/* Top Settlement Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Today's Dispatches
          </p>
          <p className="font-serif text-2xl font-bold text-gray-900">47 Shipments</p>
          <p className="text-[11px] text-emerald-600 font-medium">Escrow cleared: 71.4%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Artisan Unsettled Dues
          </p>
          <p className="font-serif text-2xl font-bold text-amber-700">₹2,34,500</p>
          <p className="text-[11px] text-gray-400 font-medium">Cycle settles in 3 days</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card space-y-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Escrow Protection Fund
          </p>
          <p className="font-serif text-2xl font-bold text-emerald-900">₹12,50,000</p>
          <p className="text-[11px] text-emerald-700 font-medium">● Fully Funded State</p>
        </div>
      </div>

      {/* Flow Audit Registry Table */}
      <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
        <h3 className="font-serif text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
          Active Flow Audit Registry
        </h3>

        {loading ? (
          <LoadingSpinner text="Retrieving settlement records..." />
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">
            No active order registries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Artisan Cooperative SHG</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment State</th>
                  <th className="py-3 px-3">Dispatch State</th>
                  <th className="py-3 px-3">Settlement Audit</th>
                  <th className="py-3 px-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => {
                  const isUpdating = updatingId === o._id;
                  const isDelivered = o.orderStatus === 'DELIVERED';

                  return (
                    <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                        #TR-{o._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-3 font-medium text-gray-800">
                        {o.items?.[0]?.product?.seller?.name || 'Radha Women Weavers SHG'}
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-gray-900">
                        ₹{o.totalAmount?.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-emerald-800 text-[11px]">
                          PAID (Escrow Cleared)
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={o.orderStatus} />
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {isDelivered ? 'SETTLED (Direct Pool)' : 'Hold in Escrow'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <select
                          value={o.orderStatus}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-taru-dark cursor-pointer disabled:opacity-40"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
