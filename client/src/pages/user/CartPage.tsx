import React, { useEffect } from 'react';
import { useCart } from '../admin/CartContext';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types/cart';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, syncCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) syncCart();
  }, [syncCart]);

  const handleCheckout = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/profile');
      return;
    }
    navigate('/checkout');
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        'Are you sure you want to remove this item?',
      );
      if (!confirmed) return;

      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  // Helper function to ensure we always have an ID
  const getItemId = (item: CartItem): string => {
    return item._id || item.productId; // Fallback to productId if _id doesn't exist
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={getItemId(item)}
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
                  onClick={() => handleRemoveItem(getItemId(item))}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl font-bold">
                ₹{' '}
                {cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0,
                )}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
