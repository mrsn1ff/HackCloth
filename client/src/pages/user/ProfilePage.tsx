// src/pages/user/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileNavbar from '../../components/ProfileNavbar'; // Only use ProfileNavbar
import Footer from '../../components/Footer';
import { ShoppingBag } from 'lucide-react';

interface Order {
  id: string;
  status: 'Confirmed' | 'Shipped' | 'Delivered';
  date: string;
  items: number;
  orderNumber: string;
  productCode: string;
}

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only ProfileNavbar here - no duplicate navbar */}
      <ProfileNavbar
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`font-semibold ${
                    order.status === 'Confirmed'
                      ? 'text-green-600'
                      : order.status === 'Shipped'
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-gray-500">{order.date}</span>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">
                  {order.items} item{order.items > 1 ? 's' : ''}
                </p>
                <p className="text-gray-500 mb-2">Order {order.orderNumber}</p>

                <button className="text-black font-medium hover:underline flex items-center">
                  Buy again <ShoppingBag className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-8">
          <Link to="#" className="hover:text-black">
            Richard Boffin
          </Link>
          <span>|</span>
          <Link to="#" className="hover:text-black">
            Customer Author
          </Link>
          <span>|</span>
          <Link to="#" className="hover:text-black">
            Finance Editor
          </Link>
          <span>|</span>
          <Link to="#" className="hover:text-black">
            Terms of Service
          </Link>
          <span>|</span>
          <Link to="#" className="hover:text-black">
            Contact Information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
