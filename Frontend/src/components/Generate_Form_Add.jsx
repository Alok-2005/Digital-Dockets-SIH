import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Generate_Form_Add = () => {
  const [serviceList, setServiceList] = useState([]);
  const [formData, setFormData] = useState({
    service: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getServiceList, GenerateFormAdd } = useAdminStore();

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

  // Fetch Service List on Component Mount
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const servicesData = await getServiceList();
        setServiceList(Array.isArray(servicesData.serviceList) ? servicesData.serviceList : []);
      } catch (error) {
        toast.error('Failed to fetch services');
      }
    };
    fetchServiceList();
  }, [getServiceList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service || !formData.status) {
      toast.error('All fields are required');
      return;
    }
    setIsLoading(true);
    try {
      await GenerateFormAdd(formData);
      toast.success('Form submitted successfully!');
      setFormData({
        service: '',
        status: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Form submission error!');
    } finally {
      setIsLoading(false);
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
            Generate Form
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
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={isLoading}
            >
              <option value="">Select a service...</option>
              {serviceList.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <option value="">Select a status...</option>
              <option value="ENABLED">ENABLED</option>
              <option value="DISABLED">DISABLED</option>
            </select>
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

export default Generate_Form_Add;