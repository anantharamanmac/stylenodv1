// components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white text-black mt-12 border-t border-gray-300 relative">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Logo & Social */}
        <div className="flex flex-col items-start space-y-4">
          <img src="/logo2.webp" alt="Stylenod Logo" className="w-36" />
          <div className="flex space-x-4 text-gray-600">
            <a href="#" className="hover:text-black"><FaFacebookF /></a>
            <a href="#" className="hover:text-black"><FaTwitter /></a>
            <a href="#" className="hover:text-black"><FaInstagram /></a>
          </div>
        </div>

        {/* Middle - Quick Links */}
        <div className="flex flex-col space-y-2 text-gray-700 md:items-center">
          <h3 className="font-semibold mb-2">QUICK LINKS</h3>
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Collections</a>
          <a href="#" className="hover:underline">Return & Refund Policies</a>
        </div>

        {/* Right - Newsletter */}
        <div className="flex flex-col space-y-2 md:items-end">
          <h3 className="font-semibold mb-2">Subscribe</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="border border-gray-300 px-3 py-2 rounded-l focus:outline-none"
            />
            <button className="bg-black text-white px-4 rounded-r hover:bg-gray-800">Subscribe</button>
          </div>
          <p className="text-xs text-gray-500 mt-1">*Don’t worry we don’t spam</p>
        </div>
      </div>

      {/* Bottom - Payment & Copyright */}
      <div className="border-t border-gray-300 py-4 text-center text-gray-600">
        <div className="flex justify-center space-x-3 mb-2">
          <img src="/payments/amazon.png" alt="Amazon Pay" className="h-6" />
          <img src="/payments/applepay.png" alt="Apple Pay" className="h-6" />
          <img src="/payments/gpay.png" alt="Google Pay" className="h-6" />
          <img src="/payments/mastercard.png" alt="Mastercard" className="h-6" />
          <img src="/payments/visa.png" alt="Visa" className="h-6" />
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Stylenod | All rights reserved.</p>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/your-number"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg text-white hover:bg-green-600 transition-colors"
      >
        <FaWhatsapp size={24} />
      </a>
    </footer>
  );
}

export default Footer;
