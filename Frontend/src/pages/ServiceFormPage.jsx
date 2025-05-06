import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const ServiceFormPage = () => {
  const { serviceId } = useParams(); // Grab the serviceId from the URL params
  const [formConfig, setFormConfig] = useState([]);
  const [formData, setFormData] = useState({});
  const [subzones, setSubzones] = useState([]);
  const [selectedSubzone, setSelectedSubzone] = useState('');
  const { getFormConfigByService, submitServiceForm } = useAdminStore();
  const API_URL_Admin = "http://localhost:3000/api/admin";

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
          sortedFields.forEach(field => {
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
        // Optional: Add file size and type validation here
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error('File size should not exceed 5MB');
          return;
        }
      }
    }
    
    const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
  
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
  
    // Find the selected subzone object
    const selectedSubzoneObject = subzones.find(sz => sz._id === selectedSubzone);
  
    // Add both subzone ID and name to the form data
    formDataToSend.append('subzone', selectedSubzone);
    formDataToSend.append('subzoneName', selectedSubzoneObject ? 
      `${selectedSubzoneObject.zoneId} - ${selectedSubzoneObject.SubZoneName}` : '');
  
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
        toast.success(response?.message || "Form submitted successfully!");
  
        // Reset the form after successful submission
        const initialData = {};
        formConfig.forEach(field => {
          initialData[field.fieldName] = field.fieldType === 'CHECKBOX' ? false : '';
        });
        setFormData(initialData);
        setSelectedSubzone('');
      } else {
        toast.error(response?.message || "Failed to submit form");
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
            type={field.fieldType === 'DATE' ? 'date' : field.fieldType.split('-')[1]}
            id={field.fieldName}
            name={field.fieldName}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleChange(e, field)}
            required={field.required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
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
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
              />
              {formData[field.fieldName] && (
                <p className="mt-1 text-sm text-gray-500">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">Select {field.nameOfLabel}</option>
                {field.fieldListId?.options?.map((option) => (
                  <option key={option.value} value={option.label}>  {/* Changed from option.value to option.label */}
                    {option.label}
                  </option>
                ))}
              </select>
            );
      case 'RADIO':
        return field.fieldListId?.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${field.fieldName}_${option.value}`}
              name={field.fieldName}
              value={option.value}
              checked={formData[field.fieldName] === option.value}
              onChange={(e) => handleChange(e, field)}
              required={field.required}
              className="form-radio text-blue-600"
            />
            <label htmlFor={`${field.fieldName}_${option.value}`} className="text-gray-700">
              {option.label}
            </label>
          </div>
        ));
  
      default:
        return <p className="text-red-500">Unsupported field type: {field.fieldType}</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white text-black">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Service Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subzone Dropdown */}
        <div>
          <label htmlFor="subzone" className="block text-sm font-medium text-gray-700">
            Select Subzone
          </label>
          <select
            id="subzone"
            name="subzone"
            value={selectedSubzone}
            onChange={(e) => setSelectedSubzone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">Select a Subzone</option>
            {subzones.map((subzone) => (
              <option key={subzone._id} value={subzone._id}>
                {subzone.zoneId} - {subzone.SubZoneName}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Fields */}
        {formConfig.map((field) => (
          <div key={field._id}>
            <label htmlFor={field.fieldName} className="block text-sm font-medium text-gray-700">
              {field.nameOfLabel}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {renderField(field)}
            {field.helpBlock && field.fieldType !== 'CHECKBOX' && (
              <p className="mt-1 text-sm text-gray-500">{field.helpBlock}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ServiceFormPage;
