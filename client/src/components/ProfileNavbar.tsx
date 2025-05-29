import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Hackcloth.avif';
import {
  ChevronDown,
  X,
  Menu,
  Search,
  ShoppingBag,
  LogOut,
} from 'lucide-react';

interface ProfileNavbarProps {
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  showDropdown,
  setShowDropdown,
  handleLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white text-black sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-black focus:outline-none"
              aria-label="Toggle menu"
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

          <div className="hidden md:flex justify-between items-center w-full">
            <ul className="flex space-x-8 text-sm font-mono ml-8">
              {[
                '/',
                'TShirts',
                'Hoodies',
                'Sweatshirts',
                'Jackets',
                'Support',
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="hover:text-gray-400 transition duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-6">
              <Link to="/search">
                <Search className="w-5 h-5 cursor-pointer" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1 focus:outline-none"
                  aria-label="Profile dropdown"
                >
                  <span className="font-medium">Profile</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link to="/cart">
                <ShoppingBag className="w-5 h-5 cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-[64px] md:top-[88px] left-0 w-full h-full bg-white z-40 p-6">
          <div className="space-y-4">
            {[
              'Home',
              'T-Shirts',
              'Hoodies',
              'Sweatshirts',
              'Jackets',
              'Support',
            ].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block text-black hover:text-gray-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block text-black hover:text-gray-400 transition flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileNavbar;
