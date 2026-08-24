import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-taru-dark"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (allowedRoles.includes('seller') && user?.sellerStatus === 'PENDING') {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-amber-200 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Application Under Review</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your SHG seller registration has been submitted and is currently <strong>pending admin approval</strong>.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
              Platform auditors review artisan credentials within 24–48 hours. Once approved, you can log in to access the Seller Hub.
            </div>
            <div className="pt-2">
              <button
                onClick={() => window.location.href = '/products'}
                className="px-5 py-2.5 bg-taru-dark text-white rounded-lg text-sm font-medium hover:bg-taru-dark-hover transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-card border border-taru-border text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-serif">Access Restricted</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You are signed in as <span className="font-semibold uppercase text-taru-dark">{user?.role}</span> ({user?.email}). This area is reserved for {allowedRoles.join(' / ').toUpperCase()} accounts.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.location.href = user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/products'}
              className="w-full sm:w-auto px-5 py-2.5 bg-taru-dark text-white rounded-xl text-xs font-semibold hover:bg-taru-dark-hover transition-colors shadow-sm"
            >
              {user?.role === 'admin' ? 'Go to Admin Hub' : user?.role === 'seller' ? 'Go to Seller Hub' : 'Browse Marketplace'}
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-taru-border text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
