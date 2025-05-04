import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Hackcloth.avif';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';

const CustomNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
        {/* Navbar Container */}
        <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
          {/* Left: Hamburger / Cross + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link to="/">
              <img
                src={logo}
                alt="Hackcloth Logo"
                className="h-8 w-auto object-contain md:h-10"
              />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/search">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/profile">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex justify-between items-center w-full">
            <ul className="flex space-x-8 text-sm font-mono ml-8">
              {[
                ['Home', '/'],
                ['T-Shirts', '/tshirts'],
                ['Hoodies', '/hoodies'],
                ['Sweatshirts', '/sweatshirts'],
                ['Jackets', '/jackets'],
                ['Support', '/support'],
              ].map(([label, link]) => (
                <li key={label}>
                  <Link
                    to={link}
                    className="hover:text-gray-400 transition duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex space-x-6 text-lg">
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
        </div>
      </nav>

      {/* Full-screen Overlay BELOW the navbar */}
      {menuOpen && (
        <div className="fixed top-[64px] md:top-[88px] left-0 w-full h-full bg-black z-40">
          <div className="px-6 pt-6 space-y-6 text-lg font-mono">
            {[
              ['Home', '/'],
              ['T-Shirts', '/tshirts'],
              ['Hoodies', '/hoodies'],
              ['Sweatshirts', '/sweatshirts'],
              ['Jackets', '/jackets'],
              ['Support', '/support'],
            ].map(([label, link]) => (
              <Link
                key={label}
                to={link}
                onClick={toggleMenu}
                className="block text-white hover:text-gray-400 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomNavbar;
