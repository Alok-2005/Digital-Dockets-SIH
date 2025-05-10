import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Service_List_Add = () => {
  const { Service_List_Add, isLoading } = useAdminStore();
  const [formData, setFormData] = useState({
    name: '',
    tableName: '',
    timeLimit: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.tableName.trim() || formData.timeLimit === '') {
      toast.error('All fields are required');
      return;
    }

    try {
      await Service_List_Add(formData);
      setFormData({
        name: '',
        tableName: '',
        timeLimit: '',
      });
      toast.success('Service added successfully!');
    } catch (err) {
      console.error('Failed to add service:', err.message);
      toast.error('Failed to add service');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'timeLimit' && isNaN(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
            Add New Service
          </h1>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name of Service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name of Service"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="tableName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Table Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tableName"
              name="tableName"
              value={formData.tableName}
              onChange={handleChange}
              placeholder="Enter Table Name"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="timeLimit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              placeholder="Enter Time Limit"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              {isLoading ? 'Submitting...' : 'Submit'}
              {!isLoading && <span className="ml-2">🚀</span>}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Service_List_Add;