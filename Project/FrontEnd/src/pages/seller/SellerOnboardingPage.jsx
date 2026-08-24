import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Store,
  Building2,
  Users,
  Clock,
  AlertCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerOnboardingPage = () => {
  const { user, isAuthenticated, isSeller, isAdmin, isPendingSeller, isRejectedSeller, applySeller, loading } = useAuth();
  const navigate = useNavigate();

  // Form State initialized from authenticated user
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shgName, setShgName] = useState('');
  const [shgRegNumber, setShgRegNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [membersCount, setMembersCount] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState(['Textiles', 'Handicrafts']);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setShgName(user.shgName || '');
      setShgRegNumber(user.shgRegNumber || '');
      setDistrict(user.district || '');
      setStateName(user.state || '');
      setMembersCount(user.membersCount || '');
      setDescription(user.description || '');
      if (Array.isArray(user.craftCategories) && user.craftCategories.length > 0) {
        setCategories(user.craftCategories);
      }
    }
  }, [user]);

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const payload = {
      name,
      phone,
      address,
      shgName,
      shgRegNumber,
      district,
      state: stateName,
      membersCount,
      description,
      craftCategories: categories,
    };

    const res = await applySeller(payload);
    setIsSubmitting(false);

    if (!res.success) {
      setSubmitError(res.message);
    }
  };

  // 1. Unauthenticated View
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Join Taru as an Artisan Partner</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Please log in with your Taru account or register to submit a verified Self-Help Group (SHG) seller application.
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Sign In / Register
          </Link>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-white border border-taru-border hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // 2. Admin View
  if (isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Administrator Central Account</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          You are signed in as a platform administrator (<strong>{user?.email}</strong>). Administrators oversee quality verification, review seller applications, and audit listings.
        </p>
        <div className="pt-2">
          <Link
            to="/admin/approvals"
            className="px-6 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-sm font-semibold transition-colors shadow"
          >
            Open Admin Approvals Queue
          </Link>
        </div>
      </div>
    );
  }

  // 3. Approved Seller View
  if (isSeller) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
          VERIFIED ARTISAN COOPERATIVE
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Seller Account Active</h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Your collective (<strong>{user?.shgName || user?.name}</strong>) is approved and authorized to publish listings and manage orders.
        </p>
        <div className="pt-2">
          <Link
            to="/seller"
            className="px-6 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-sm font-semibold transition-colors shadow"
          >
            Go to Seller Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 4. Pending Review View
  if (isPendingSeller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-card space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-200">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  APPLICATION PENDING AUDIT
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mt-1">
                Your Seller Application is Under Review
              </h2>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Thank you for applying to sell on Taru Foundation! Our administrative team is currently verifying your cooperative credentials and craft origins.
          </p>

          {/* Submitted Summary */}
          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Submitted Application Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
              <div>
                <span className="text-gray-500">Applicant:</span> <strong>{user?.name}</strong>
              </div>
              <div>
                <span className="text-gray-500">Email:</span> <strong>{user?.email}</strong>
              </div>
              <div>
                <span className="text-gray-500">SHG / Collective:</span> <strong>{user?.shgName || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> <strong>{user?.phone || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-gray-500">Location:</span> <strong>{user?.district ? `${user.district}, ${user.state || ''}` : user?.address || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-gray-500">Members:</span> <strong>{user?.membersCount || 'N/A'}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>What happens next?</span>
            </p>
            <p className="text-emerald-800">
              Once an administrator approves your application, your role will be upgraded to <strong>Seller</strong>. You will then log in to access the full Seller Portal to list handloom & organic products.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/products"
              className="px-5 py-2.5 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Browse Catalog as Buyer
            </Link>
            <span className="text-xs text-gray-400">Application Status: PENDING</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Application Form View (For Normal Buyer or Re-submitting Rejected Buyer)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Seller Application Portal</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Register your Self-Help Group (SHG) or artisan collective to sell directly to conscious buyers.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="text-taru-dark font-bold bg-taru-sand px-3 py-1 rounded-full border border-taru-border">
            Application Form
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-400">Admin Audit</span>
          <span className="text-gray-400">→</span>
          <span className="text-gray-400">Active Seller</span>
        </div>
      </div>

      {isRejectedSeller && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Your previous application was rejected. Please review your details and submit an updated application below.</span>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Grid: Why Sell Left Card + Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 'Why sell on Taru?' (4 cols) */}
        <div className="lg:col-span-4 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-card">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
              Cooperative Advantage
            </span>
            <h3 className="font-serif text-2xl font-bold">Why sell on Taru?</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Taru is an open-source non-profit platform ensuring self-sustaining wealth for rural artisan groups.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3 text-xs">
              <Store className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Direct Market Access</p>
                <p className="text-gray-300 text-[11px]">Sell directly with zero middleman commissions.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <HeartHandshake className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Fair Pricing Model</p>
                <p className="text-gray-300 text-[11px]">Artisans set price matrices directly matching labor costs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Direct Digital Payouts</p>
                <p className="text-gray-300 text-[11px]">Direct UPI escrow security triggers on customer delivery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-taru-border p-6 sm:p-8 shadow-card space-y-6">
          <h3 className="font-serif text-xl font-bold text-gray-900 pb-3 border-b border-gray-100">
            Artisan Collective & Cooperative Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Applicant Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhabai Devi"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Account Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Postal Address / Village Location *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village, Post, Pincode"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>
            </div>

            {/* SHG Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Self-Help Group (SHG) / Collective Name *
                </label>
                <input
                  type="text"
                  required
                  value={shgName}
                  onChange={(e) => setShgName(e.target.value)}
                  placeholder="e.g. Ganga Weavers Collective"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  SHG Government Reg. Number (Optional)
                </label>
                <input
                  type="text"
                  value={shgRegNumber}
                  onChange={(e) => setShgRegNumber(e.target.value)}
                  placeholder="e.g. SHG-WB-NAD-2021"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  District / Town *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Nadia District"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. West Bengal"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Active Women / Artisan Members *
                </label>
                <input
                  type="text"
                  required
                  value={membersCount}
                  onChange={(e) => setMembersCount(e.target.value)}
                  placeholder="e.g. 18 Members"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
                />
              </div>
            </div>

            {/* Description & Craft Story */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Artisan Story & Craft Description *
              </label>
              <textarea
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your craft tradition, weaving techniques, natural dyes, or organic cultivation methods..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark"
              />
            </div>

            {/* Produce & Crafts Categories */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Produce & Crafts Categories (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Textiles', 'Organic Foods', 'Handicrafts', 'Pottery', 'Natural Beauty', 'Spices'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      categories.includes(cat)
                        ? 'bg-taru-dark text-white border-taru-dark shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-500">
                Application is subject to quality and authenticity audit by Taru administrators.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-taru-dark hover:bg-taru-dark-hover text-white rounded-xl font-semibold text-xs transition-all shadow flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Application for Admin Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
