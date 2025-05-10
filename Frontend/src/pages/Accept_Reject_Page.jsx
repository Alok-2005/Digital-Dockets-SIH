import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Accept_Reject_Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3000',
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

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/api/admin/service/formdata/all');
      if (response.data.success) {
        setData(response.data.submissions);
      } else {
        setData([]);
        toast.error(response.data.message || 'Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch submissions');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'auth_1':
        return 'text-blue-600';
      case 'auth_2':
        return 'text-purple-600';
      case 'done':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state UI
  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div
          className="mb-6 flex justify-between items-center"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Service Submissions
            </h1>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>
          <button
            onClick={() => navigate('/dashboard/add')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Add New Submission
          </button>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg">No submissions found</p>
          </motion.div>
        ) : (
          <motion.div
            className="overflow-x-auto"
            variants={itemVariants}
          >
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Latest Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const latestProcess = item.processedBy?.[item.processedBy.length - 1];
                  return (
                    <motion.tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                      variants={itemVariants}
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 border-b">
                        {item.service || 'Unknown Service'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {item.formData?.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm border-b">
                        <span className={`font-semibold ${getStatusColor(item.status)}`}>
                          {item.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {formatDate(latestProcess?.processedAt || item.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {latestProcess?.remark || 'No remark'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Accept_Reject_Page;