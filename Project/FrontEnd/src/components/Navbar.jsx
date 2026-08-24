import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ChevronDown, Package, ShieldCheck, Store, Layers, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isBuyer, isSeller, isAdmin, isPendingSeller } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#fcfbf8]/95 backdrop-blur-md border-b border-taru-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-taru-dark flex items-center justify-center text-white font-serif text-xl font-bold shadow-sm transition-transform group-hover:scale-105">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-taru-dark">
                Taru Foundation
              </span>
              <span className="text-[10px] tracking-widest uppercase text-taru-accent font-medium -mt-1">
                Empowering Rural SHGs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-taru-accent font-semibold' : 'text-gray-700 hover:text-taru-dark'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/products?category=Handloom+Textiles"
              className="text-sm font-medium text-gray-700 hover:text-taru-dark transition-colors"
            >
              Categories
            </Link>
            <a
              href="#mission"
              className="text-sm font-medium text-gray-700 hover:text-taru-dark transition-colors"
            >
              About
            </a>
            <a
              href="#impact"
              className="text-sm font-medium text-gray-700 hover:text-taru-dark transition-colors"
            >
              Impact
            </a>

            {/* Role specific quick nav */}
            {isBuyer && isPendingSeller && (
              <Link
                to="/seller/onboarding"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Application Pending</span>
              </Link>
            )}

            {(!isAuthenticated || (isBuyer && !isPendingSeller)) && (
              <Link
                to="/seller/onboarding"
                className="text-sm font-medium text-amber-900 hover:text-amber-700 font-semibold transition-colors"
              >
                Become a Seller
              </Link>
            )}

            {isSeller && (
              <Link
                to="/seller"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Portal</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </Link>
            )}
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-800 hover:text-taru-dark bg-taru-sand/60 px-3.5 py-1.5 rounded-full border border-taru-border transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-taru-dark text-white text-xs flex items-center justify-center font-bold uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                    {user?.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                    >
                      <User className="w-4 h-4 mr-2.5 text-gray-400" />
                      My Profile
                    </Link>

                    {isBuyer && (
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                        >
                          <Package className="w-4 h-4 mr-2.5 text-gray-400" />
                          My Orders
                        </Link>
                        {isPendingSeller ? (
                          <Link
                            to="/seller/onboarding"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 font-medium"
                          >
                            <Clock className="w-4 h-4 mr-2.5 text-amber-600" />
                            Application Status
                          </Link>
                        ) : (
                          <Link
                            to="/seller/onboarding"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                          >
                            <Store className="w-4 h-4 mr-2.5 text-gray-400" />
                            Become a Seller
                          </Link>
                        )}
                      </>
                    )}

                    {isSeller && (
                      <>
                        <Link
                          to="/seller"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                        >
                          <Store className="w-4 h-4 mr-2.5 text-gray-400" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products/create"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                        >
                          <Layers className="w-4 h-4 mr-2.5 text-gray-400" />
                          Add New Product
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-taru-sand/50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-gray-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-taru-dark hover:underline underline-offset-4"
              >
                Login / Register
              </Link>
            )}

            {/* Shopping Cart (Visible for Buyers or Visitors) */}
            {(!isAuthenticated || isBuyer) && (
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-800 hover:text-taru-dark bg-taru-sand px-3 py-1.5 rounded-full border border-taru-border transition-colors group"
              >
                <ShoppingBag className="w-4 h-4 text-taru-dark group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Cart ({cartCount})</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            {(!isAuthenticated || isBuyer) && (
              <Link
                to="/cart"
                className="flex items-center space-x-1 text-taru-dark bg-taru-sand px-2.5 py-1 rounded-full text-xs font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartCount}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-taru-dark hover:bg-taru-sand"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu modal/drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-taru-border bg-[#fcfbf8] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-taru-accent"
          >
            Shop All Products
          </Link>
          <Link
            to="/products?category=Handloom+Textiles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-taru-accent"
          >
            Categories
          </Link>

          {isSeller && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-bold uppercase text-amber-700 mb-2">Seller Actions</p>
              <Link
                to="/seller"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Seller Dashboard
              </Link>
              <Link
                to="/seller/products/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Add New Product
              </Link>
              <Link
                to="/seller/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Manage Orders
              </Link>
            </div>
          )}

          {isAdmin && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-bold uppercase text-emerald-700 mb-2">Admin Hub</p>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Admin Overview
              </Link>
              <Link
                to="/admin/approvals"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Listing Audits
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-gray-700"
              >
                Order Flow & Settlements
              </Link>
            </div>
          )}

          {isBuyer && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-800 hover:text-taru-accent"
              >
                My Orders
              </Link>
              {isPendingSeller ? (
                <Link
                  to="/seller/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-amber-800 hover:text-amber-900"
                >
                  Seller Application (Pending Audit)
                </Link>
              ) : (
                <Link
                  to="/seller/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-amber-900 hover:text-amber-700 font-semibold"
                >
                  Become a Seller
                </Link>
              )}
            </>
          )}

          <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-red-600 font-medium flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out ({user?.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-taru-dark text-white rounded-lg font-medium"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
