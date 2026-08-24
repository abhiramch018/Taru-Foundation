import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, Package, Store, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout, isBuyer, isSeller, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Account Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your credentials, role privileges, and address information.</p>
      </div>

      <div className="bg-white rounded-3xl border border-taru-border p-6 sm:p-10 shadow-card space-y-8">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-taru-dark text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">{user?.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-taru-sand text-taru-dark border border-taru-border">
                  {user?.role} Account
                </span>
                <span className="text-xs text-gray-400">· Verified Member</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 flex items-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold uppercase">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </div>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>

          <div className="space-y-1 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold uppercase">
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Number</span>
            </div>
            <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
          </div>

          <div className="sm:col-span-2 space-y-1 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Registered Location / Shipping Address</span>
            </div>
            <p className="font-medium text-gray-900">{user?.address || 'Not provided'}</p>
          </div>
        </div>

        {/* Quick Role Navigation */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h3 className="font-serif text-base font-bold text-gray-900">Role Portals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {isBuyer && (
              <Link
                to="/orders"
                className="p-4 rounded-xl border border-taru-border hover:border-taru-dark bg-taru-sand/30 flex items-center space-x-3 transition-colors"
              >
                <Package className="w-5 h-5 text-taru-dark" />
                <div>
                  <p className="text-xs font-bold text-gray-900">My Orders</p>
                  <p className="text-[11px] text-gray-500">Track shipments</p>
                </div>
              </Link>
            )}

            {isSeller && (
              <>
                <Link
                  to="/seller"
                  className="p-4 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/50 flex items-center space-x-3 transition-colors"
                >
                  <Store className="w-5 h-5 text-amber-800" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Seller Dashboard</p>
                    <p className="text-[11px] text-amber-700">Manage crafts & stock</p>
                  </div>
                </Link>
                <Link
                  to="/seller/products/create"
                  className="p-4 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/50 flex items-center space-x-3 transition-colors"
                >
                  <Store className="w-5 h-5 text-amber-800" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Create Listing</p>
                    <p className="text-[11px] text-amber-700">Add new product</p>
                  </div>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="p-4 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 flex items-center space-x-3 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Admin Central Hub</p>
                  <p className="text-[11px] text-emerald-700">Approvals & registry</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
