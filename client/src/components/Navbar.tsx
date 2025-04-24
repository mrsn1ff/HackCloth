// Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Hackcloth.avif';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';

const CustomNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Hackcloth Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-sm font-mono">
          <li>
            <Link to="/" className="hover:underline underline-offset-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tshirts" className="hover:text-gray-400">
              T-Shirts
            </Link>
          </li>
          <li>
            <Link to="/hoodies" className="hover:text-gray-400">
              Hoodies
            </Link>
          </li>
          <li>
            <Link to="/sweatshirts" className="hover:text-gray-400">
              Sweatshirts
            </Link>
          </li>
          <li>
            <Link to="/jackets" className="hover:text-gray-400">
              Jackets
            </Link>
          </li>
          <li>
            <Link to="/support" className="hover:text-gray-400">
              Support
            </Link>
          </li>
        </ul>

        {/* Icons (Desktop) */}
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/search">
            <Search className="w-5 h-5 cursor-pointer" />
          </Link>
          <Link to="/profile">
            <User className="w-5 h-5 cursor-pointer" />
          </Link>
          <Link to="/cart">
            <ShoppingBag className="w-5 h-5 cursor-pointer" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black px-4 pb-4 space-y-3 text-sm font-mono">
          <Link to="/" className="block hover:underline" onClick={toggleMenu}>
            Home
          </Link>
          <Link
            to="/tshirts"
            className="block hover:text-gray-400"
            onClick={toggleMenu}
          >
            T-Shirts
          </Link>
          <Link
            to="/hoodies"
            className="block hover:text-gray-400"
            onClick={toggleMenu}
          >
            Hoodies
          </Link>
          <Link
            to="/sweatshirts"
            className="block hover:text-gray-400"
            onClick={toggleMenu}
          >
            Sweatshirts
          </Link>
          <Link
            to="/jackets"
            className="block hover:text-gray-400"
            onClick={toggleMenu}
          >
            Jackets
          </Link>
          <Link
            to="/support"
            className="block hover:text-gray-400"
            onClick={toggleMenu}
          >
            Support
          </Link>

          <div className="flex space-x-6 text-lg pt-3">
            <Link to="/search">
              <Search className="w-5 h-5 cursor-pointer" />
            </Link>
            <Link to="/profile">
              <User className="w-5 h-5 cursor-pointer" />
            </Link>
            <Link to="/cart">
              <ShoppingBag className="w-5 h-5 cursor-pointer" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomNavbar;
