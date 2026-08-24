import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Eye, ArrowRight, Package } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SellerOrdersPage = () => {
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'PLACED' | 'PROCESSING' | 'SHIPPED'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingId, setTrackingId] = useState('DEL-74291845');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getMyOrders();
        const list = Array.isArray(data) ? data : [];
        setOrders(list);
        if (list.length > 0) {
          setSelectedOrder(list[0]);
        }
      } catch (err) {
        console.error('Failed to load seller orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'ALL') return true;
    return o.orderStatus === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">SHG Order Dispatches</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track live purchase orders, update shipping carriers, and manage cooperative dispatches.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 bg-taru-sand p-1 rounded-xl border border-taru-border">
          {[
            { id: 'ALL', label: `All (${orders.length})` },
            { id: 'PLACED', label: 'New' },
            { id: 'PROCESSING', label: 'Processing' },
            { id: 'SHIPPED', label: 'Shipped' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === tab.id
                  ? 'bg-taru-dark text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching SHG cooperative orders..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Orders Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
            <h3 className="font-serif text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Active Dispatches
            </h3>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">
                No orders found under "{filterTab}" status.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-2">Order ID</th>
                      <th className="py-2.5 px-2">Date</th>
                      <th className="py-2.5 px-2">Qty</th>
                      <th className="py-2.5 px-2">Amount</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((o) => {
                      const isSelected = selectedOrder?._id === o._id;
                      const dateStr = new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      });
                      const totalQty = o.items?.reduce((t, i) => t + (i.quantity || 1), 0) || 1;

                      return (
                        <tr
                          key={o._id}
                          onClick={() => setSelectedOrder(o)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-taru-sand/60 font-semibold' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-2 font-mono font-bold text-gray-900">
                            #TR-{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3 px-2 text-gray-500">{dateStr}</td>
                          <td className="py-3 px-2">{totalQty}</td>
                          <td className="py-3 px-2 font-semibold">
                            ₹{o.totalAmount?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-2">
                            <StatusBadge status={o.orderStatus} />
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button className="text-[11px] font-bold text-taru-dark hover:underline">
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expanded Selected Order Details Pane (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-6 sticky top-28">
            {selectedOrder ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-gray-900">
                    Order #TR-{selectedOrder._id.slice(-6).toUpperCase()} Details
                  </h3>
                  <StatusBadge status={selectedOrder.orderStatus} />
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                    <p className="font-bold text-gray-700">Shipping Address:</p>
                    <p className="text-gray-600 leading-relaxed">{selectedOrder.shippingAddress}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-gray-700">Ordered Craft Items:</p>
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-800 font-medium">
                          {item.product?.name || 'Handcrafted Craft Item'} (×{item.quantity})
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dispatch & Fulfill Actions Box */}
                  <div className="pt-2 space-y-3">
                    <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">
                      Dispatch & Fulfill Actions
                    </p>
                    <div className="space-y-2">
                      <label className="block text-[11px] text-gray-500">
                        Carrier Integrated Dispatch (Delhivery)
                      </label>
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter Waybill / Tracking ID"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      />
                      <button
                        onClick={() => alert(`Package marked as packed with Waybill #${trackingId}.`)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors"
                      >
                        Confirm Package Packed
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-xs text-gray-400">
                Select an order from the list to view fulfillment tools.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
