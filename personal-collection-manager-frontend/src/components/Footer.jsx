// import React from "react";
// import { Link } from "react-router-dom";
// import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-8 mt-10">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Column 1 */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
//             <ul className="space-y-2">
//               <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
//               <li><Link to="/collections" className="hover:text-gray-400">Collections</Link></li>
//               <li><Link to="/cart" className="hover:text-gray-400">Cart</Link></li>
//               <li><Link to="/payment-history" className="hover:text-gray-400">Payment History</Link></li>
//               <li><Link to="/admin" className="hover:text-gray-400">Admin Dashboard</Link></li>
//             </ul>
//           </div>

//           {/* Column 2 */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Support</h2>
//             <ul className="space-y-2">
//               <li><Link to="/register" className="hover:text-gray-400">Register</Link></li>
//               <li><Link to="/login" className="hover:text-gray-400">Login</Link></li>
//               <li><Link to="/checkout" className="hover:text-gray-400">Checkout</Link></li>
//               <li><Link to="/my-collections" className="hover:text-gray-400">My Collections</Link></li>
//               <li><Link to="/payment" className="hover:text-gray-400">Payment</Link></li>
//             </ul>
//           </div>

//           {/* Column 3 */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
//             <div className="flex space-x-4">
//               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
//                 <FaFacebook size={24} />
//               </a>
//               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
//                 <FaTwitter size={24} />
//               </a>
//               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
//                 <FaInstagram size={24} />
//               </a>
//               <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
//                 <FaGithub size={24} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="mt-8 text-center text-gray-400 text-sm">
//           © {new Date().getFullYear()} Your App Name. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaList, FaUser, FaShoppingCart, FaHistory, FaEnvelope, FaGithub, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaHome className="mr-2" /> Explore
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/collections" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/my-collections" className="hover:text-white transition-colors">My Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaUser className="mr-2" /> Account
            </h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/payment-history" className="hover:text-white transition-colors">Payment History</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaEnvelope className="mr-2" /> Support
            </h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@example.com" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Your Collection Hub. All rights reserved.</p>
            <div className="mt-2">
              <Link to="/terms" className="hover:text-white px-2">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white px-2">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;