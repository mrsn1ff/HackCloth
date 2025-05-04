import React from 'react';
import { Instagram, Twitter, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white px-4 sm:px-6 pt-12 pb-6 text-center">
      {/* Social Links */}
      <div className="flex justify-center space-x-6 mb-6">
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

      {/* Heading */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
        Subscribe to get a 10% coupon code
      </h3>

      {/* Email Subscription Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-md mx-auto w-full"
      >
        <div className="flex border border-white rounded overflow-hidden">
          <input
            type="email"
            placeholder="Email"
            className="bg-black text-white placeholder-white px-4 py-3 w-full focus:outline-none text-sm"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-3 flex items-center justify-center"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>

      {/* Footer Links */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400 flex flex-wrap justify-center gap-2">
        <span>© 2025, HackCloth Clothing Brand</span>
        {[
          '• Privacy policy',
          '• Refund policy',
          '• Terms of service',
          '• Shipping policy',
          '• Contact information',
        ].map((text) => (
          <React.Fragment key={text}>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">
              {text}
            </a>
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
