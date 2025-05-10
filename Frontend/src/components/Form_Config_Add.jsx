import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Form_Config_Add = () => {
  const [formData, setFormData] = useState({
    service: '',
    fieldName: '',
    fieldType: '',
    nameOfLabel: '',
    maxField: '',
    minField: '',
    required: false,
    fieldListId: '',
    helpBlock: '',
    extra: '',
    position: '',
  });

  const [services, setServices] = useState([]);
  const [fieldLists, setFieldLists] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const { getServiceList, getFieldList, getFieldType, FormConfigAdd } = useAdminStore();

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'radio' ? value === 'true' : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await FormConfigAdd(formData);
      toast.success('Form submitted successfully!');
      setFormData({
        service: '',
        fieldName: '',
        fieldType: '',
        nameOfLabel: '',
        maxField: '',
        minField: '',
        required: false,
        fieldListId: '',
        helpBlock: '',
        extra: '',
        position: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Form submission error!');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getServiceList();
        const fieldListsData = await getFieldList();
        const fieldTypesData = await getFieldType();

        setServices(Array.isArray(servicesData.serviceList) ? servicesData.serviceList : []);
        setFieldLists(Array.isArray(fieldListsData.fieldList) ? fieldListsData.fieldList : []);
        setFieldTypes(Array.isArray(fieldTypesData.fieldTypes) ? fieldTypesData.fieldTypes : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
        setServices([]);
        setFieldLists([]);
        setFieldTypes([]);
      }
    };

    fetchData();
  }, [getServiceList, getFieldList, getFieldType]);

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Add Form Configuration
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
              htmlFor="fieldName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Field Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fieldName"
              name="fieldName"
              value={formData.fieldName}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Field Name"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="fieldType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Field Type <span className="text-red-500">*</span>
            </label>
            <select
              id="fieldType"
              name="fieldType"
              value={formData.fieldType}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            >
              <option value="">Select a field type...</option>
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="nameOfLabel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name of Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nameOfLabel"
              name="nameOfLabel"
              value={formData.nameOfLabel}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Name of Label"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="maxField"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Max Field
            </label>
            <input
              type="number"
              id="maxField"
              name="maxField"
              value={formData.maxField}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Max Field"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="minField"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Min Field
            </label>
            <input
              type="number"
              id="minField"
              name="minField"
              value={formData.minField}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Min Field"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="required"
                  value="true"
                  checked={formData.required === true}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="required"
                  value="false"
                  checked={formData.required === false}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="fieldListId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Field List ID
            </label>
            <select
              id="fieldListId"
              name="fieldListId"
              value={formData.fieldListId}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select a field list...</option>
              {fieldLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="helpBlock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Help Block
            </label>
            <textarea
              id="helpBlock"
              name="helpBlock"
              value={formData.helpBlock}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Help Block"
              rows="4"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="extra"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Extra
            </label>
            <textarea
              id="extra"
              name="extra"
              value={formData.extra}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Extra"
              rows="4"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter Position"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <span>Submit</span>
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Form_Config_Add;