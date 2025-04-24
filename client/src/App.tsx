import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import CustomNavbar from './components/Navbar';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './pages/CartContext';
import CartPage from './pages/CartPage';

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <CustomNavbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
