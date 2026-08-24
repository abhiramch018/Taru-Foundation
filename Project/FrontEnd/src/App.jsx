import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

// Public & Buyer Pages
import { HomePage } from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { InvoicePage } from './pages/InvoicePage';
import { ProfilePage } from './pages/ProfilePage';

// Seller Pages
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { CreateProductPage } from './pages/seller/CreateProductPage';
import { EditProductPage } from './pages/seller/EditProductPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerOnboardingPage } from './pages/seller/SellerOnboardingPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminApprovalsPage } from './pages/admin/AdminApprovalsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Buyer / Protected Public Routes */}
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id/success"
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices/:orderId"
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <InvoicePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Seller Routes */}
                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/seller/dashboard" element={<Navigate to="/seller" replace />} />
                <Route
                  path="/seller/products"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/create"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <CreateProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <EditProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/seller/onboarding" element={<SellerOnboardingPage />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                <Route
                  path="/admin/approvals"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminApprovalsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/products" element={<Navigate to="/admin/approvals" replace />} />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/settlements" element={<Navigate to="/admin/orders" replace />} />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
