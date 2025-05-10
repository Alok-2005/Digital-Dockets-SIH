import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogIn, LogOut, UserPlus, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Digital Dockets
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/"
                className="text-gray-200 hover:text-white font-medium transition duration-300"
              >
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-200 hover:text-white font-medium transition duration-300"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300"
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden bg-blue-800/95 backdrop-blur-md"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 hover:text-white font-medium text-lg transition duration-300"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-200 hover:text-white font-medium text-lg transition duration-300"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md flex items-center space-x-2 transition duration-300"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signup"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-6 rounded-md flex items-center space-x-2 transition duration-300"
                      onClick={toggleMenu}
                    >
                      <UserPlus size={18} />
                      <span>Sign Up</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md flex items-center space-x-2 transition duration-300"
                      onClick={toggleMenu}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;