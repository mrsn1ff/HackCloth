import React, { useState, useEffect } from 'react';
import { useCart } from '../admin/CartContext';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import logo from '../../assets/Hackcloth.avif';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCharge = subtotal > 1000 ? 0 : 99;
  const totalAmount = subtotal + shippingCharge;

  // Auto-fill email if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        setFormData((prev) => ({ ...prev, email: userEmail }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.pincode
      ) {
        throw new Error('Please fill all required fields');
      }

      if (!/^[0-9]{10}$/.test(formData.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!/^[0-9]{6}$/.test(formData.pincode)) {
        throw new Error('Please enter a valid 6-digit pincode');
      }

      const orderData = {
        shippingInfo: formData,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        subtotal,
        shippingCharge,
        totalAmount,
        paymentMethod: 'online',
      };

      const response = await API.post('/orders', orderData);
      navigate(`/payment/${response.data.orderId}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Navbar */}
      <nav className="bg-grey-500 shadow-sm py-4 border-b">
        <div className="max-w-6xl mx-auto px-4 flex justify-center">
          <img src={logo} alt="HACKCLOTH" className="h-8" />
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Shipping Info */}
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border border-gray-300 p-2 rounded ${
                        isLoggedIn ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                      required
                      readOnly={isLoggedIn}
                    />
                    {isLoggedIn && (
                      <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                        (Auto-filled)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.size} | {item.color}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cartItems.length === 0}
              className={`w-full bg-black text-white py-3 rounded-md mt-6 ${
                isSubmitting || cartItems.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
