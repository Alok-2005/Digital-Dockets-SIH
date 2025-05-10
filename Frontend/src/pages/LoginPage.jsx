import { motion } from "framer-motion";
import { Loader, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in Successfully");
    } catch (error) {
      toast.error(error.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-blue-800/20 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-300/20 p-8"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text mb-6">
          Welcome Back
        </h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center mb-4"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100">
              Email Address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-blue-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-100">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-blue-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-300 hover:text-blue-100">
              Forgot Password?
            </Link>
          </div>

          <motion.button
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 transition duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-200">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-300 hover:text-blue-100">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;