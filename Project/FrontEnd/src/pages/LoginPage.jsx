import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, MapPin, Sparkles, ArrowRight, ShieldCheck, Store, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab);
  const { login, register, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regRole, setRegRole] = useState('buyer');

  const [localMessage, setLocalMessage] = useState(null);

  const fromPath = location.state?.from?.pathname || null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(null);
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      if (result.user?.sellerStatus === 'PENDING') {
        setLocalMessage({
          type: 'warning',
          text: 'Your seller application has been received and is pending admin approval. You can browse the marketplace as a buyer in the meantime.',
        });
      }

      // Determine safe redirect path based on user role
      let targetPath = null;
      if (fromPath) {
        const isAdminPath = fromPath.startsWith('/admin');
        const isSellerPath = fromPath.startsWith('/seller');

        if (isAdminPath && result.user?.role === 'admin') {
          targetPath = fromPath;
        } else if (isSellerPath && result.user?.role === 'seller' && result.user?.sellerStatus === 'APPROVED') {
          targetPath = fromPath;
        } else if (!isAdminPath && !isSellerPath) {
          targetPath = fromPath;
        }
      }

      if (targetPath) {
        navigate(targetPath, { replace: true });
      } else if (result.user?.role === 'admin') {
        navigate('/admin');
      } else if (result.user?.role === 'seller' && result.user?.sellerStatus === 'APPROVED') {
        navigate('/seller');
      } else {
        navigate('/products');
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage(null);
    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      address: regAddress,
      role: regRole,
    });

    if (result.success) {
      if (regRole === 'seller') {
        setLocalMessage({
          type: 'success',
          text: 'Your seller application has been submitted and is pending admin approval. Logging you in...',
        });
      } else {
        setLocalMessage({ type: 'success', text: 'Account registered successfully! Logging you in...' });
      }

      // Automatically log the user in
      const logRes = await login(regEmail, regPassword);
      if (logRes.success) {
        if (logRes.user?.role === 'seller' && logRes.user?.sellerStatus === 'APPROVED') {
          navigate('/seller');
        } else {
          navigate('/products');
        }
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-taru-border overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Artisanal Story Panel */}
        <div className="relative md:col-span-5 bg-taru-dark text-white p-8 flex flex-col justify-between overflow-hidden min-h-[360px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80)',
            }}
          />
          <div className="relative z-10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-serif text-lg font-bold border border-white/20">
              T
            </div>
            <p className="text-[10px] tracking-widest uppercase font-bold text-amber-300">
              The Artisanal Path
            </p>
            <h2 className="font-serif text-2xl font-bold">Taru Foundation</h2>
          </div>

          <div className="relative z-10 space-y-4 pt-8">
            <blockquote className="font-serif italic text-sm sm:text-base text-gray-200 leading-relaxed">
              "Buying here doesn't just fill my shelf, it sustains my community's looms and sends my grandchildren to school."
            </blockquote>
            <p className="text-xs text-amber-200/90 font-medium">
              — Kamla Devi, Phulia Handloom Cluster
            </p>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-gray-400 border-t border-white/10 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Connecting 120+ Verified SHG Clusters</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`pb-3 text-sm font-semibold transition-colors flex-1 text-center relative ${
                tab === 'login'
                  ? 'text-taru-dark border-b-2 border-taru-dark font-serif text-base'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`pb-3 text-sm font-semibold transition-colors flex-1 text-center relative ${
                tab === 'register'
                  ? 'text-taru-dark border-b-2 border-taru-dark font-serif text-base'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Feedback messages */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {authError}
            </div>
          )}
          {localMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
              {localMessage.text}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">Password</label>
                  <span className="text-[11px] text-gray-400">Keep credentials safe</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name / SHG Head
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Kamala Devi or Lakshmi Weavers"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Address (Village / City, State, PIN)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House No., Street, Village/District, State"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select Your Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      regRole === 'buyer'
                        ? 'border-taru-dark bg-taru-sand ring-1 ring-taru-dark text-taru-dark'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 mb-1 text-taru-dark" />
                    <span className="text-xs font-bold leading-tight">Buyer</span>
                    <span className="text-[10px] text-gray-500">Conscious Shopper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('seller')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      regRole === 'seller'
                        ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600 text-amber-900'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Store className="w-4 h-4 mb-1 text-amber-700" />
                    <span className="text-xs font-bold leading-tight">Seller</span>
                    <span className="text-[10px] text-gray-500">SHG Artisan</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create {regRole.toUpperCase()} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => <LoginPage initialTab="register" />;
