// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LandingPage from './pages/user/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import CustomNavbar from './components/Navbar'; // Main navbar (black)
import ProductDetail from './pages/user/ProductDetail';
import { CartProvider } from './pages/admin/CartContext';
import CartPage from './pages/user/CartPage';
import TShirtsPage from './pages/user/TShirtsPage';
import SweatshirtsPage from './pages/user/SweatshirtsPage';
import JacketsPage from './pages/user/JacketsPage';
import HoodiesPage from './pages/user/HoodiesPage';
import Profile from './pages/user/Profile';
import ProfilePage from './pages/user/ProfilePage';
import Support from './pages/user/Support';
import CheckoutPage from './pages/user/CheckoutPage';

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Only show CustomNavbar on non-profile pages */}
        <Routes>
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="*"
            element={
              <>
                <CustomNavbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/tshirts" element={<TShirtsPage />} />
                  <Route path="/sweatshirts" element={<SweatshirtsPage />} />
                  <Route path="/jackets" element={<JacketsPage />} />
                  <Route path="/hoodies" element={<HoodiesPage />} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/support" element={<Support />} />

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
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
