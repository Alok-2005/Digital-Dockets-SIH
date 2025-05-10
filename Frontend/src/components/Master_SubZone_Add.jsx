import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Master_SubZone_Add = () => {
  const [formData, setFormData] = useState({
    zoneId: '',
    SubZoneName: '',
  });
  const { MasterSubZoneAdd, isLoading } = useAdminStore();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zoneId || !formData.SubZoneName) {
      toast.error('All fields are required');
      return;
    }
    try {
      await MasterSubZoneAdd(formData);
      setFormData({
        zoneId: '',
        SubZoneName: '',
      });
      toast.success('SubZone added successfully!');
    } catch (error) {
      toast.error('Failed to add SubZone');
    }
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
            Add Master SubZone
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
              htmlFor="zoneId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Zone ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zoneId"
              name="zoneId"
              value={formData.zoneId}
              onChange={handleChange}
              placeholder="Enter Zone ID"
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="SubZoneName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SubZone Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="SubZoneName"
              name="SubZoneName"
              value={formData.SubZoneName}
              onChange={handleChange}
              placeholder="Enter SubZone Name"
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{isLoading ? 'Submitting...' : 'Submit'}</span>
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Master_SubZone_Add;