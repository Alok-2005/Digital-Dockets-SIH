import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';

const Service_Config_Page = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const getServiceConfig = useAdminStore((state) => state.getServiceConfig);
  const navigate = useNavigate();

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
    const fetchConfigs = async () => {
      try {
        const result = await getServiceConfig();
        console.log('Service Config Result:', result); // Debug log

        if (result && result.data) {
          setConfigs(result.data);
          if (result.data.length === 0) {
            toast.info('No service configurations available. Please add some configurations.');
          }
        } else {
          setConfigs([]);
          toast.error('No service configuration data available');
        }
      } catch (error) {
        console.error('Error fetching service configurations:', error);
        toast.error(error.message || 'Failed to fetch service configurations');
        setConfigs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, [getServiceConfig]);

  const handleAddNewService = () => {
    navigate('/dashboard/service_config_add');
  };

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
              Service Configurations
            </h1>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>
          <button
            onClick={handleAddNewService}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            Add New Service Config
          </button>
        </motion.div>

        {configs.length === 0 ? (
          <motion.div
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg">No service configurations found.</p>
            <p className="text-gray-500 mt-2">Click "Add New Service Config" to create one.</p>
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
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Paid Service
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Custom Rate
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config, index) => (
                  <motion.tr
                    key={config._id}
                    className="hover:bg-gray-50 transition-colors"
                    variants={itemVariants}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {config.service?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm border-b">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          config.isPaidService
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {config.isPaidService ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      ₹{config.rateOfService}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {config.customRate ? `₹${config.customRate}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b max-w-xs">
                      <div className="prose prose-sm">
                        <MDEditor.Markdown source={config.certificateData} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {new Date(config.createdAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Service_Config_Page;