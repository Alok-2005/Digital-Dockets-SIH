import React, { useEffect, useState } from 'react'
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Generate_Form_Add = () => {
    const [serviceList, setServiceList] = useState([]);
    const [formData, setFormData] = useState({
      service: "",
      status: "",
    });
    const [isLoading, setIsLoading] = useState(false);
  const {getServiceList,GenerateFormAdd}=useAdminStore()
    // Fetch Service List on Component Mount
    useEffect(() => {
      const fetchServiceList = async () => {
        try {
            const servicesData = await getServiceList();

            setServiceList(Array.isArray(servicesData.serviceList) ? servicesData.serviceList : []); // Ensure it's an array

        } catch (error) {
          toast.error("Failed to fetch services");
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
        try {
          await GenerateFormAdd(formData);
        //   alert('Form submitted successfully!');
        toast.success("Form submitted successfully!");
          setFormData({
            service: "",
            status: "",
          }); // Reset the form
        } catch (error) {
          console.error('Form submission error:', error);
          toast.error("Form submission error!");
        }
      };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg p-6 rounded-lg max-w-md w-full text-black"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate Form</h2>

      {/* Service Dropdown */}
      <div className="mb-4">
        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
          Service <span className="text-red-500">*</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a value ...</option>
          {serviceList.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a value ...</option>
          <option value="ENABLED">ENABLED</option>
          <option value="DISABLED">DISABLED</option>
        </select>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  </div>
  )
}

export default Generate_Form_Add