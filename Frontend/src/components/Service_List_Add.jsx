import React, { useState } from 'react'
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Service_List_Add = () => {
    const { Service_List_Add, isLoading } = useAdminStore(); // Replace with your appropriate method to add a service
    const [formData, setFormData] = useState({
        name: "",
        tableName: "",
        timeLimit: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!formData.name.trim() || !formData.tableName.trim() || formData.timeLimit === "") {
            toast.error("All fields are required");
            return;
        }

        try {
            await Service_List_Add(formData);
            // Reset form after successful submission
            setFormData({
                name: "",
                tableName: "",
                timeLimit: "",
            });
            toast.success("Service added successfully!");
        } catch (err) {
            console.error("Failed to add service:", err.message);
            toast.error("Failed to add service");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Restrict input for timeLimit to numbers only
        if (name === "timeLimit" && isNaN(value)) {
            return; // Ignore non-numeric input
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md text-black"
        >
            {/* Name of Service */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium">
                    Name of Service <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name of Service"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Table Name */}
            <div className="mb-4">
                <label htmlFor="tableName" className="block text-gray-700 font-medium">
                    Table Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="tableName"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleChange}
                    placeholder="Enter Table Name"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Time Limit */}
            <div className="mb-4">
                <label htmlFor="timeLimit" className="block text-gray-700 font-medium">
                    Time Limit <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="timeLimit"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    placeholder="Enter Time Limit"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? 'Submitting...' : 'Submit'} <span className="ml-2">🚀</span>
            </button>
        </form>
    );
}

export default Service_List_Add