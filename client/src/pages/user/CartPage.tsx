// src/pages/CartPage.tsx
import React from 'react';
import { useCart } from '../admin/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart } = useCart(); // 👈 use removeFromCart

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={index}
            className="border-b py-4 flex justify-between items-center"
          >
            <div className="flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold mb-2">
                ₹ {item.price * item.quantity}
              </p>
              <button
                onClick={() => removeFromCart(item._id)} // 👈 call remove
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
