// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void; // ✅ Added removeFromCart to context type
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => useContext(CartContext)!;

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    // ✅ New function to remove item
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {' '}
      {/* ✅ Added to value */}
      {children}
    </CartContext.Provider>
  );
};
