import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Accept_Reject_Add = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const { Accept_Reject_Add, isLoading } = useAdminStore();
  const [formData, setFormData] = useState({
    serviceId: location.state?.serviceId || '',
    RecId: location.state?.RecId || '',
    status: 'ACCEPT',
    remark: '',
  });

  const isProcessing = Boolean(location.state?.submissionId);

  const api = axios.create({
    baseURL: 'http://localhost:3000' ||"https://digital-dockets-sih-2.onrender.com",
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/api/auth/check-auth');
        if (response.data.success) {
          setUserRole(response.data.user.role);
          setUserId(response.data.user._id);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Error fetching user role');
      }
    };
    fetchUserRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.serviceId.trim()) {
      errors.push('Service ID is required');
    }
    if (!formData.RecId.trim()) {
      errors.push('Rec ID is required');
    }
    if (!formData.remark.trim()) {
      errors.push('Remark is required');
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      if (isProcessing) {
        let newStatus;
        if (formData.status === 'ACCEPT') {
          newStatus = userRole === 'auth_1' ? 'auth_2' : 'done';
        } else {
          newStatus = 'rejected';
        }

        const payload = {
          submissionId: location.state.submissionId,
          newStatus: newStatus,
          userId: userId,
          userRole: userRole,
          remark: formData.remark,
        };

        const updateResponse = await api.put(
          `/api/admin/service/submission/${location.state.submissionId}/status`,
          payload
        );

        if (!updateResponse.data.success) {
          throw new Error(updateResponse.data.message || 'Failed to update status');
        }
      } else {
        const payload = {
          serviceId: formData.serviceId,
          RecId: formData.RecId,
          remark: formData.remark,
          status: 'auth_1',
          userId: userId,
        };

        const createResponse = await api.post('/api/admin/service/submission/create', payload);

        if (!createResponse.data.success) {
          throw new Error(createResponse.data.message || 'Failed to create submission');
        }
      }

      toast.success(
        isProcessing ? 'Form processed successfully!' : 'New submission created successfully!'
      );
      navigate(-1);
    } catch (err) {
      console.error('Failed to process form:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to process form');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'remark' ? value : value.trim(),
    }));
  };

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {isProcessing ? 'Process Submission' : 'Create Submission'}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="serviceId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service ID <span className="text-red-500">*</span>
              {!isProcessing && <span className="text-gray-600 text-xs ml-2">(Auto-generated)</span>}
            </label>
            <input
              type="text"
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="RecId" className="block text-sm font-medium text-gray-700 mb-1">
              Rec ID <span className="text-red-500">*</span>
              {!isProcessing && <span className="text-gray-600 text-xs ml-2">(Auto-generated)</span>}
            </label>
            <input
              type="text"
              id="RecId"
              name="RecId"
              value={formData.RecId}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={isLoading}
            >
              <option value="ACCEPT">ACCEPT</option>
              <option value="REJECT">REJECT</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
              Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Enter your remark"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[120px]"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading
                ? 'Processing...'
                : isProcessing
                ? 'Process Submission'
                : 'Create Submission'}
              {!isLoading && <span className="ml-2">🚀</span>}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Accept_Reject_Add;