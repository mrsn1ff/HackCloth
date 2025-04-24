// Updated Footer.tsx using lucide-react icons
import React from 'react';
// ✅ Lucide icon imports
import { Instagram, Twitter, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white px-6 pt-12 pb-6 text-center">
      {/* Social icons */}
      <div className="flex justify-center space-x-6 mb-6 text-2xl">
        <a
          href="#"
          aria-label="Instagram"
          className="hover:text-gray-400 transition"
        >
          <Instagram size={24} />
        </a>
        <a
          href="#"
          aria-label="Twitter"
          className="hover:text-gray-400 transition"
        >
          <Twitter size={24} />
        </a>
      </div>

      {/* Subscription */}
      <h3 className="text-lg md:text-xl font-semibold mb-4">
        Subscribe to get a 10% coupon code
      </h3>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center items-center max-w-md mx-auto border border-white rounded px-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="bg-black text-white py-3 px-4 w-full focus:outline-none placeholder-white"
          required
        />
        <button type="submit" className="text-white ml-2">
          <ArrowRight size={22} />
        </button>
      </form>

      {/* Footer links */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400 space-x-2 flex flex-wrap justify-center gap-y-2">
        <span>© 2025, HackCloth Clothing Brand</span>
        <span>·</span>
        <a href="#" className="hover:underline">
          Privacy policy
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Refund policy
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Terms of service
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Shipping policy
        </a>
        <span>·</span>
        <a href="#" className="hover:underline">
          Contact information
        </a>
      </div>
    </footer>
  );
};

export default Footer;
