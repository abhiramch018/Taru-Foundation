import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isBuyer } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isBuyer) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setCart(data || { items: [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isBuyer]);

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [isAuthenticated, isBuyer, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true, message: 'Please log in to add items to your cart' };
    }
    if (!isBuyer) {
      return { success: false, message: 'Only buyers can add items to cart' };
    }
    try {
      const data = await cartApi.addToCart(productId, quantity);
      await fetchCart();
      return { success: true, message: data.message || 'Added to cart' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await cartApi.updateCartItem(productId, quantity);
      await fetchCart();
      return { success: true, message: data.message || 'Cart updated' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await cartApi.removeFromCart(productId);
      await fetchCart();
      return { success: true, message: data.message || 'Item removed from cart' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      return { success: false, message: msg };
    }
  };

  const cartCount = cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
  const cartSubtotal = cart?.items?.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * (item.quantity || 1);
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
