import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ServiceFormPage = () => {
  const { serviceId } = useParams();
  const [formConfig, setFormConfig] = useState([]);
  const [formData, setFormData] = useState({});
  const [subzones, setSubzones] = useState([]);
  const [selectedSubzone, setSelectedSubzone] = useState('');
  const { getFormConfigByService, submitServiceForm } = useAdminStore();
  const API_URL_Admin = "http://localhost:3000/api/admin";

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

  // Fetch form configuration and subzones when the page loads
  useEffect(() => {
    const fetchFormConfigAndSubzones = async () => {
      try {
        // Fetch form configuration
        const formResponse = await getFormConfigByService(serviceId);
        if (formResponse?.data) {
          const sortedFields = formResponse.data.sort((a, b) => a.position - b.position);
          setFormConfig(sortedFields);

          const initialData = {};
          sortedFields.forEach((field) => {
            initialData[field.fieldName] = field.fieldType === 'CHECKBOX' ? false : '';
          });
          setFormData(initialData);
        }

        // Fetch subzones data
        const subzoneResponse = await fetch(`${API_URL_Admin}/master_subzone`);
        const subzoneData = await subzoneResponse.json();
        if (subzoneData.success) {
          setSubzones(subzoneData.subzones);
        } else {
          toast.error('Failed to load subzones.');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load form configuration or subzones.');
      }
    };

    fetchFormConfigAndSubzones();
  }, [serviceId, getFormConfigByService]);

  const handleChange = (e, field) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error('File size should not exceed 5MB');
          return;
        }
      }
    }

    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Find the selected subzone object
    const selectedSubzoneObject = subzones.find((sz) => sz._id === selectedSubzone);

    // Add both subzone ID and name to the form data
    formDataToSend.append('subzone', selectedSubzone);
    formDataToSend.append(
      'subzoneName',
      selectedSubzoneObject ? `${selectedSubzoneObject.zoneId} - ${selectedSubzoneObject.SubZoneName}` : ''
    );

    // Add all other form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (typeof value === 'string' && value.trim()) {
        formDataToSend.append(key, value.trim());
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      console.log('Submitting form data:', Object.fromEntries(formDataToSend));
      const response = await submitServiceForm(serviceId, formDataToSend);
      if (response?.success) {
        toast.success(response?.message || 'Form submitted successfully!');

        // Reset the form after successful submission
        const initialData = {};
        formConfig.forEach((field) => {
          initialData[field.fieldName] = field.fieldType === 'CHECKBOX' ? false : '';
        });
        setFormData(initialData);
        setSelectedSubzone('');
      } else {
        toast.error(response?.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Failed to submit the form.');
    }
  };

  const renderField = (field) => {
    switch (field.fieldType) {
      case 'INPUT-TEXT':
      case 'INPUT-EMAIL':
      case 'INPUT-NUMBER':
      case 'DATE':
      case 'TIME':
        return (
          <input
            type={field.fieldType === 'DATE' ? 'date' : field.fieldType.split('-')[1].toLowerCase()}
            id={field.fieldName}
            name={field.fieldName}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleChange(e, field)}
            required={field.required}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800"
            placeholder={field.helpBlock}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            id={field.fieldName}
            name={field.fieldName}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleChange(e, field)}
            required={field.required}
            rows="4"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800"
            placeholder={field.helpBlock}
          />
        );

      case 'UPLOAD':
        return (
          <div>
            <input
              type="file"
              id={field.fieldName}
              name={field.fieldName}
              onChange={(e) => handleChange(e, field)}
              required={field.required}
              className="mt-1 block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 cursor-pointer"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {formData[field.fieldName] && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {formData[field.fieldName].name}
              </p>
            )}
          </div>
        );

      case 'SELECT':
        return (
          <select
            id={field.fieldName}
            name={field.fieldName}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleChange(e, field)}
            required={field.required}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800"
          >
            <option value="">Select {field.nameOfLabel}</option>
            {field.fieldListId?.options?.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'RADIO':
        return (
          <div className="flex flex-col space-y-2">
            {field.fieldListId?.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`${field.fieldName}_${option.value}`}
                  name={field.fieldName}
                  value={option.value}
                  checked={formData[field.fieldName] === option.value}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`${field.fieldName}_${option.value}`}
                  className="text-sm text-gray-800"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-red-500 text-sm">Unsupported field type: {field.fieldType}</p>;
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
            Service Form: {serviceId}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
        >
          {/* Subzone Dropdown */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="subzone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Subzone
              <span className="text-red-500">*</span>
            </label>
            <select
              id="subzone"
              name="subzone"
              value={selectedSubzone}
              onChange={(e) => setSelectedSubzone(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800"
            >
              <option value="">Select a Subzone</option>
              {subzones.map((subzone) => (
                <option key={subzone._id} value={subzone._id}>
                  {subzone.zoneId} - {subzone.SubZoneName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Dynamic Fields */}
          {formConfig.map((field) => (
            <motion.div key={field._id} variants={itemVariants}>
              <label
                htmlFor={field.fieldName}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.nameOfLabel}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
              {field.helpBlock && field.fieldType !== 'CHECKBOX' && (
                <p className="mt-1 text-sm text-gray-600">{field.helpBlock}</p>
              )}
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
            >
              Submit
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default ServiceFormPage;