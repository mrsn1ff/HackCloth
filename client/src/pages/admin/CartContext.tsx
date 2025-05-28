import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, AddToCartPayload } from '../../types/cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: AddToCartPayload) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  syncCart: async () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const API_BASE_URL =
    process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCartToLocal = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const addToCart = async (item: AddToCartPayload) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // First check current cart state
        const currentCartResponse = await fetch(`${API_BASE_URL}/email/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const currentCart = await currentCartResponse.json();

        // Find existing item
        const existingItem = currentCart.cart.find(
          (ci: CartItem) =>
            ci.productId === item.productId &&
            ci.size === item.size &&
            ci.color === item.color,
        );

        // Calculate new quantity (don't multiply, just add the specified amount)
        const newQuantity = existingItem
          ? existingItem.quantity + item.quantity
          : item.quantity;

        // Update with exact quantity
        const response = await fetch(`${API_BASE_URL}/email/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...item,
            quantity: Math.min(newQuantity, 100), // Enforce max limit
          }),
        });

        if (!response.ok) throw new Error('Failed to add to cart');

        const data = await response.json();
        setCartItems(data.cart);
        saveCartToLocal(data.cart);
      } else {
        // Local storage handling with exact quantity
        const existingItemIndex = cartItems.findIndex(
          (ci) =>
            ci.productId === item.productId &&
            ci.size === item.size &&
            ci.color === item.color,
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...cartItems];
          updatedCart[existingItemIndex].quantity = Math.min(
            updatedCart[existingItemIndex].quantity + item.quantity,
            100,
          );
          setCartItems(updatedCart);
          saveCartToLocal(updatedCart);
        } else {
          const newItem = {
            ...item,
            _id: Math.random().toString(36).substring(2, 9),
            quantity: Math.min(item.quantity, 100),
          };
          const updatedCart = [...cartItems, newItem];
          setCartItems(updatedCart);
          saveCartToLocal(updatedCart);
        }
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    const token = localStorage.getItem('authToken'); // Declare token here

    try {
      if (token) {
        const response = await fetch(`${API_BASE_URL}/email/cart/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from server');
        }

        const data = await response.json();

        // Verify the response contains the updated cart
        if (!data.cart) {
          throw new Error('Invalid response from server');
        }

        // Update both state and local storage
        setCartItems(data.cart);
        saveCartToLocal(data.cart);
      } else {
        // Local storage fallback
        const updatedCart = cartItems.filter((item) => item._id !== itemId);
        setCartItems(updatedCart);
        saveCartToLocal(updatedCart);
      }
    } catch (error) {
      console.error('Remove from cart failed:', error);

      // Force a full cart sync if removal fails
      if (token) {
        // Now token is properly defined
        await syncCart();
      }

      throw error;
    }
  };

  // Improved syncCart function
  const syncCart = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/email/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      const data = await response.json();
      setCartItems(data.cart || []);
      saveCartToLocal(data.cart || []);
    } catch (error) {
      console.error('Sync failed:', error);
      // Keep local cart as fallback
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, syncCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
