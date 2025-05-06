import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
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

  const [services, setServices] = useState([]); // Initialize as an empty array
  const [fieldLists, setFieldLists] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);

  const { getServiceList, getFieldList, getFieldType, FormConfigAdd } = useAdminStore();

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
    //   alert('Form submitted successfully!');
    toast.success("Form submitted successfully!");
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
      }); // Reset the form
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Form submission error!");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getServiceList();
        const fieldListsData = await getFieldList();
        const fieldTypesData = await getFieldType();

        setServices(Array.isArray(servicesData.serviceList) ? servicesData.serviceList : []); // Ensure it's an array
        setFieldLists(Array.isArray(fieldListsData.fieldList) ? fieldListsData.fieldList : []); // Ensure it's an array
        setFieldTypes(Array.isArray(fieldTypesData.fieldTypes) ? fieldTypesData.fieldTypes : []); // Ensure it's an array
      } catch (error) {

        console.error('Error fetching data:', error);

        setServices([]); // Fallback to an empty array on error
        setFieldLists([]);
        setFieldTypes([]);
      }
    };

    fetchData();
  }, [getServiceList, getFieldList, getFieldType]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Configuration</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg text-black">
        {/* Service */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="service">
            Service <span className="text-red-500">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a value...</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Field Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="fieldName">
            Field Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fieldName"
            name="fieldName"
            value={formData.fieldName}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Field Name"
            required
          />
        </div>

        {/* Field Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="fieldType">
            Field Type <span className="text-red-500">*</span>
          </label>
          <select
            id="fieldType"
            name="fieldType"
            value={formData.fieldType}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a value...</option>
            {fieldTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Name of Label */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="nameOfLabel">
            Name of Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nameOfLabel"
            name="nameOfLabel"
            value={formData.nameOfLabel}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Name of Label"
            required
          />
        </div>

        {/* Max Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="maxField">
            Max Field
          </label>
          <input
            type="number"
            id="maxField"
            name="maxField"
            value={formData.maxField}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Max Field"
            required
          />
        </div>

        {/* Min Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="minField">
            Min Field
          </label>
          <input
            type="number"
            id="minField"
            name="minField"
            value={formData.minField}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Min Field"
            required
          />
        </div>

        {/* Required */}
        <div className="mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Required <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center space-x-4">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="required"
        value="true"
        checked={formData.required === true}
        onChange={handleChange}
        required
      />
      <span>Yes</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="required"
        value="false"
        checked={formData.required === false}
        onChange={handleChange}
        required
      />
      <span>No</span>
    </label>
  </div>
</div>

        {/* Field List ID */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="fieldListId">
            Field List ID
          </label>
          <select
            id="fieldListId"
            name="fieldListId"
            value={formData.fieldListId}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            
          >
            <option value="">Select a value...</option>
            {fieldLists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {/* Help Block */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="helpBlock">
            Help Block
          </label>
          <textarea
            id="helpBlock"
            name="helpBlock"
            value={formData.helpBlock}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Help Block"
            required
          />
        </div>

        {/* Extra */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="extra">
            Extra
          </label>
          <textarea
            id="extra"
            name="extra"
            value={formData.extra}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Extra"
            required
          />
        </div>

        {/* Position */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="position">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Position"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form_Config_Add;
