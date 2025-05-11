import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import ServiceFormTable from '../components/ServiceFormTable';

const ServicePage = () => {
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const BASE_URL =  'http://localhost:3000' || 'https://digital-dockets-sih-2.onrender.com';

  // Check service status
  useEffect(() => {
    const checkServiceStatus = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`${BASE_URL}/api/admin/generate-form/status/${serviceId}`);
        if (response.data.success) {
          setIsServiceEnabled(response.data.status === 'ENABLED');
        } else {
          setIsServiceEnabled(false);
          toast.error('Service is not enabled');
        }
      } catch (error) {
        console.error('Error checking service status:', error);
        setIsServiceEnabled(false);
        toast.error('Unable to verify service status');
      } finally {
        setLoading(false);
      }
    };

    checkServiceStatus();
  }, [serviceId]);

  const handleApplyClick = () => {
    if (serviceId) {
      navigate(`/dashboard/service/form/${serviceId}`);
    }
  };

  if (!serviceId) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
          <p className="text-red-600 text-lg font-semibold">No Service ID provided!</p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 text-lg font-semibold">Loading...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Service Application: {serviceId}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Manage and track your service applications with real-time updates.
          </p>
        </motion.div>

        {/* Service Form Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ServiceFormTable serviceId={serviceId} />
        </motion.div>

        {/* Apply Button or Disabled Message */}
        {isServiceEnabled ? (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={handleApplyClick}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply for Service
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-yellow-700 text-lg font-semibold">
              This service is currently not available for new applications.
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ServicePage;