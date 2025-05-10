import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Phone, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    countryCode: "+91",
  });
  const [countryCodes, setCountryCodes] = useState([]);
  const [error, setError] = useState(null);
  const { signup, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const { data } = await axios.get("https://restcountries.com/v3.1/all");
        const codes = data
          .map((country) => ({
            code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
            name: country.name.common,
          }))
          .filter((country) => country.code)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };
    fetchCountryCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
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
          Create Your Account
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-100">
              Full Name
            </label>
            <div className="mt-1 relative">
              <User className="absolute top-3 left-3 h-5 w-5 text-blue-400" />
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-blue-100">
              Phone Number
            </label>
            <div className="mt-1 flex space-x-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-28 px-2 py-2 bg-blue-900/30 border border-blue-400/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              >
                {countryCodes.length > 0 ? (
                  countryCodes.map((country) => (
                    <option key={`${country.code}-${country.name}`} value={country.code}>
                      {country.code} ({country.name})
                    </option>
                  ))
                ) : (
                  <option>Loading...</option>
                )}
              </select>
              <div className="relative flex-1">
                <Phone className="absolute top-3 left-3 h-5 w-5 text-blue-400" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="123-456-7890"
                />
              </div>
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-blue-400" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="block w-full px-3 py-2 pl-10 bg-blue-900/30 border border-blue-400/30 rounded-md text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 transition duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </span>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-200">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-300 hover:text-blue-100">
            Login here <ArrowRight className="inline h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;