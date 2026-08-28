import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taru_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taru_token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('taru_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('taru_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.login({ email, password });
      if (data.token) {
        localStorage.setItem('taru_token', data.token);
        localStorage.setItem('taru_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.register(userData);
      return {
        success: true,
        message: data.message,
        requiresOtp: data.requiresOtp,
        email: data.email
      };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.verifyOtp(email, otp);
      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'OTP verification failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    setAuthError(null);
    try {
      const data = await authApi.resendOtp(email);
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP.';
      const cooldownSeconds = err.response?.data?.cooldownSeconds;
      return { success: false, message: msg, cooldownSeconds };
    }
  };

  const applySeller = async (sellerData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.applySeller(sellerData);
      if (data.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('taru_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit seller application.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('taru_token');
    localStorage.removeItem('taru_user');
    setToken(null);
    setUser(null);
  };

  // Refreshes user data from the live backend (GET /api/auth/me queries the DB).
  // Used by the seller onboarding page to detect approval without requiring logout/login.
  const refreshMe = async () => {
    try {
      const data = await authApi.getMe();
      if (data.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('taru_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: data.user };
      }
      return { success: false };
    } catch (err) {
      console.error('refreshMe error:', err.message);
      return { success: false };
    }
  };

  const isAuthenticated = Boolean(token && user);
  const sellerStatus = user?.sellerStatus || 'NONE';
  const isSeller = user?.role === 'seller' && (user?.sellerStatus === 'APPROVED' || !user?.sellerStatus);
  const isPendingSeller = user?.sellerStatus === 'PENDING';
  const isRejectedSeller = user?.sellerStatus === 'REJECTED';
  const isBuyer = user?.role === 'buyer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        isAuthenticated,
        sellerStatus,
        isBuyer,
        isSeller,
        isPendingSeller,
        isRejectedSeller,
        isAdmin,
        login,
        register,
        verifyOtp,
        resendOtp,
        applySeller,
        logout,
        refreshMe,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
