import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { invoiceApi } from '../api/invoiceApi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order for invoice:', err);
        setError(err.response?.data?.message || 'Invoice not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await invoiceApi.downloadInvoice(orderId);
    } catch (err) {
      console.error('Invoice download failed:', err);
      alert('Failed to download invoice PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingSpinner text="Generating tax invoice..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Invoice Unavailable</h2>
        <p className="text-sm text-gray-500">{error || 'Unable to display invoice.'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-taru-dark text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const invoiceNo = `INV-TF-${order._id.slice(-8).toUpperCase()}`;
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/orders"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-taru-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5"
          >
            {downloading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="bg-white rounded-2xl border border-taru-border p-8 sm:p-12 shadow-card space-y-8 print:border-none print:shadow-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-taru-dark flex items-center justify-center text-white font-serif text-sm font-bold">
                T
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-taru-dark">
                Taru Foundation
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Plot 52, Rural Livelihoods Hub, Institutional Area, Chanakyapuri, New Delhi - 110021
            </p>
            <p className="text-[11px] text-gray-400">
              GSTIN: 07AAATT0012F1Z3 · NGO Act Registration: #8837/2014
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-wider">
              TAX INVOICE
            </h2>
            <p className="font-mono text-xs font-bold text-taru-accent">{invoiceNo}</p>
            <p className="text-xs text-gray-500">Date: {dateStr}</p>
          </div>
        </div>

        {/* Billed To & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <p className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">
              BILLED TO (BUYER)
            </p>
            <p className="font-semibold text-gray-900 text-sm">{order.buyer?.name || 'Verified Buyer'}</p>
            <p className="text-gray-600 leading-relaxed">{order.shippingAddress}</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <p className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">
              PAYMENT INFORMATION
            </p>
            <p className="font-semibold text-gray-900 text-sm">Direct SHG-Transfer UPI</p>
            <p className="text-gray-500 font-mono">Status: {order.paymentStatus || 'PAID'}</p>
            <p className="text-emerald-700 font-semibold flex items-center sm:justify-end space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow Cleared</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50/70 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">S.No</th>
                <th className="py-3 px-3">Product Details</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => {
                const product = item.product || {};
                const lineTotal = (item.price || 0) * (item.quantity || 1);

                return (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      {product.name || 'Craft Product'}
                    </td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-semibold text-gray-900">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total calculation */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-300">
              <span>Total Amount Paid:</span>
              <span className="font-serif text-lg text-taru-dark">
                ₹{order.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-500 italic">
          "Thank you for directly supporting rural Self-Help Group (SHG) women artisans."
        </div>
      </div>
    </div>
  );
};
