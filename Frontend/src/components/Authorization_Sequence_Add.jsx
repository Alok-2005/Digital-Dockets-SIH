import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Authorization_Sequence_Add = () => {
  const { AuthorizationSequenceAdd, getServiceList, getUsers, isLoading, error, getMasterSubZone } = useAdminStore();
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [subzones, setSubzones] = useState([]);
  const [formData, setFormData] = useState({
    service: '',
    userId: '',
    partOfService: '',
    stage: '',
    subzones: [],
    supervisorOf: '',
    canTakePayment: false,
    canReject: false,
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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [serviceData, userData, subzoneData] = await Promise.all([
        getServiceList(),
        getUsers(),
        getMasterSubZone(),
      ]);

      setServices(serviceData.serviceList || []);
      setUsers(userData.users || []);
      setSubzones(subzoneData.subzones || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to fetch initial data');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'subzones') {
      setFormData((prev) => ({
        ...prev,
        subzones: Array.from(e.target.selectedOptions, (option) => option.value),
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else if (name === 'partOfService' || name === 'canTakePayment' || name === 'canReject') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'Yes',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.service ||
      !formData.userId ||
      !formData.stage ||
      !formData.supervisorOf ||
      formData.subzones.length === 0
    ) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      await AuthorizationSequenceAdd(formData);
      toast.success('Authorization sequence added successfully!');
      setFormData({
        service: '',
        userId: '',
        partOfService: '',
        stage: '',
        subzones: [],
        supervisorOf: '',
        canTakePayment: false,
        canReject: false,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to add authorization sequence');
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
            Add Authorization Sequence
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
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Role <span className="text-red-500">*</span>
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.role}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="partOfService"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Part Of Service <span className="text-red-500">*</span>
            </label>
            <select
              name="partOfService"
              value={formData.partOfService ? 'Yes' : 'No'}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="stage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stage <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter stage"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="subzones"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subzones <span className="text-red-500">*</span>
            </label>
            <select
              name="subzones"
              value={formData.subzones}
              onChange={handleChange}
              multiple
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[120px]"
            >
              {subzones && subzones.length > 0 ? (
                subzones.map((subzone) => (
                  <option key={subzone._id} value={subzone._id}>
                    {subzone.SubZoneName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No subzones available
                </option>
              )}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl (Windows) or Command (Mac) to select multiple zones
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="supervisorOf"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supervisor Of <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supervisorOf"
              value={formData.supervisorOf}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter supervisor role"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="canTakePayment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Can Take Payment <span className="text-red-500">*</span>
            </label>
            <select
              name="canTakePayment"
              value={formData.canTakePayment ? 'Yes' : 'No'}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="canReject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Can Reject <span className="text-red-500">*</span>
            </label>
            <select
              name="canReject"
              value={formData.canReject ? 'Yes' : 'No'}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </motion.div>

          {error && (
            <motion.div variants={itemVariants} className="text-red-500 text-sm">
              {error}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{isLoading ? 'Adding...' : 'Add Sequence'}</span>
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Authorization_Sequence_Add;