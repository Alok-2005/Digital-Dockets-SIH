import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import axios from 'axios';

const Service_Config_Add = () => {
  const [formData, setFormData] = useState({
    service: '',
    isPaidService: 'false',
    rateOfService: '',
    customRate: '',
    certificateData: '',
  });
  const BASE_URL = 'https://digital-dockets-sih-2.onrender.com'

  const [services, setServices] = useState([]);
  const [subzones, setSubzones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServicePlaceholders, setSelectedServicePlaceholders] = useState([]);

  const Service_Config_Add = useAdminStore((state) => state.Service_Config_Add);
  const getServiceList = useAdminStore((state) => state.getServiceList);
  const isLoading = useAdminStore((state) => state.isLoading);

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
    const fetchInitialData = async () => {
      try {
        // Fetch Services
        const serviceResponse = await getServiceList();
        if (serviceResponse && serviceResponse.serviceList && Array.isArray(serviceResponse.serviceList)) {
          setServices(serviceResponse.serviceList);
          if (serviceResponse.serviceList.length === 0) {
            toast.info('No services available. Please add services first.');
          }
        } else {
          console.error('Unexpected services response format:', serviceResponse);
          toast.error('No services available');
          setServices([]);
        }

        // Fetch Subzones
        const subzoneResponse = await axios.get(`${BASE_URL}/api/admin/master_subzone`);
        if (subzoneResponse.data && subzoneResponse.data.success) {
          setSubzones(subzoneResponse.data.subzones);
        } else {
          console.error('Unexpected subzones response format:', subzoneResponse.data);
          toast.error('Failed to fetch subzones');
          setSubzones([]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error(error.message || 'Failed to fetch initial data');
      }
    };

    fetchInitialData();
  }, [getServiceList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isPaidService' ? value === 'true' : value,
    }));
  };

  const handleEditorChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      certificateData: value || '',
    }));
  };

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value;
    handleInputChange(e);

    if (serviceId) {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/form_config/service/${serviceId}`);
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const placeholders = response.data.data.map((field) => `{{${field.fieldName}}}`);
          const subzonePlaceholders = ['{{subzoneName}}'];
          setSelectedServicePlaceholders([...placeholders, ...subzonePlaceholders]);
        } else {
          console.error('Unexpected response format:', response.data);
          toast.error('Failed to fetch service placeholders: Unexpected response format');
          setSelectedServicePlaceholders([]);
        }
      } catch (error) {
        console.error('Error fetching service placeholders:', error);
        toast.error('Failed to fetch service placeholders');
        setSelectedServicePlaceholders([]);
      }
    } else {
      setSelectedServicePlaceholders([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.service) {
        throw new Error('Please select a service');
      }
      if (formData.rateOfService === '') {
        throw new Error('Rate of Service is required');
      }
      if (formData.certificateData === '') {
        throw new Error('Certificate Data is required');
      }

      const submissionData = {
        ...formData,
        rateOfService: Number(formData.rateOfService),
        customRate: formData.customRate ? Number(formData.customRate) : undefined,
      };

      await Service_Config_Add(submissionData);
      toast.success('Service configuration added successfully');

      setFormData({
        service: '',
        isPaidService: 'false',
        rateOfService: '',
        customRate: '',
        certificateData: '',
      });
      setSelectedServicePlaceholders([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to add service configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Add Service Configuration
          </h1>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
        </motion.div>

        {services.length === 0 ? (
          <motion.div
            className="text-center py-4 bg-yellow-50 rounded-lg"
            variants={itemVariants}
          >
            <p className="text-yellow-700 text-lg">No services available.</p>
            <p className="text-sm text-yellow-600 mt-1">
              Please add services first before creating a service configuration.
            </p>
          </motion.div>
        ) : (
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
                onChange={handleServiceChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                disabled={loading || isLoading}
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="isPaidService"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Is Paid Service <span className="text-red-500">*</span>
              </label>
              <select
                id="isPaidService"
                name="isPaidService"
                value={formData.isPaidService}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                disabled={loading || isLoading}
              >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="rateOfService"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rate of Service <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="rateOfService"
                name="rateOfService"
                value={formData.rateOfService}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
                min="0"
                step="0.01"
                disabled={loading || isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="customRate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom Rate
              </label>
              <input
                type="number"
                id="customRate"
                name="customRate"
                value={formData.customRate}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                min="0"
                step="0.01"
                disabled={loading || isLoading}
              />
            </motion.div>

            {selectedServicePlaceholders.length > 0 && (
              <motion.div
                className="bg-gray-50 p-4 rounded-lg"
                variants={itemVariants}
              >
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Available Placeholders
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedServicePlaceholders.map((placeholder, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {placeholder}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={itemVariants} data-color-mode="light">
              <label
                htmlFor="certificateData"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Certificate Data <span className="text-red-500">*</span>
              </label>
              <MDEditor
                id="certificateData"
                value={formData.certificateData}
                onChange={handleEditorChange}
                height={300}
                preview="live"
                className="w-full"
                disabled={loading || isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading || isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center ${
                  loading || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading || isLoading ? 'Submitting...' : 'Submit'}
                {!loading && !isLoading && <span className="ml-2">🚀</span>}
              </button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </motion.section>
  );
};

export default Service_Config_Add;