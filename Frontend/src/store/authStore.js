import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const API_URL =  "https://digital-dockets-sih-2.onrender.com/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,


  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      // toast.error("Session expired. Please log in again.");
    }
  },
  signup: async ({ name, email, password, confirmPassword, phone, countryCode,fullPhoneNumber }) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
        confirmPassword,
        phone,
        countryCode,
        fullPhoneNumber
      });
      set({ user: res.data, loading: false });
      toast.success("Signed up successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Error logging in");
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      toast.success("Logged out successfully!");
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      toast.error("Error logging out");
      throw error;
    }
  },


  
}));
