import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { authApi } from '../api/authApi';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters.'
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match.'
      });
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.resetPassword(token, password);

      setMessage({
        type: 'success',
        text:
          result.message ||
          'Password reset successful. You can now sign in with your new password.'
      });

      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Unable to reset your password. The link may be invalid or expired.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-taru-border p-8 sm:p-10">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-taru-dark">
            Reset Password
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter a new password for your Taru Foundation account.
          </p>
        </div>

        {message && (
          <div
            className={`mb-5 p-3.5 rounded-xl text-xs font-medium ${
              message.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
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
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          <Link to="/login" className="text-taru-dark hover:underline font-medium">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
