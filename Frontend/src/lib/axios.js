// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://digital-dockets-sih-2.onrender.com/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      headers: config.headers,
      withCredentials: config.withCredentials,
    });
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;