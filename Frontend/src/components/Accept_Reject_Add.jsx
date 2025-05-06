import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Accept_Reject_Add = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const { Accept_Reject_Add, isLoading } = useAdminStore();
    const [formData, setFormData] = useState({
        serviceId: location.state?.serviceId || "",
        RecId: location.state?.RecId || "",
        status: "ACCEPT",
        remark: "",
    });

    const isProcessing = Boolean(location.state?.submissionId);

    const api = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await api.get('/api/auth/check-auth');
                if (response.data.success) {
                    setUserRole(response.data.user.role);
                    setUserId(response.data.user._id);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                toast.error('Error fetching user role');
            }
        };
        fetchUserRole();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        const errors = [];
        if (!formData.serviceId.trim()) {
            errors.push("Service ID is required");
        }
        if (!formData.RecId.trim()) {
            errors.push("Rec ID is required");
        }
        if (!formData.remark.trim()) {
            errors.push("Remark is required");
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        try {
            if (isProcessing) {
                // Processing existing submission
                let newStatus;
                if (formData.status === "ACCEPT") {
                    newStatus = userRole === "auth_1" ? "auth_2" : "done";
                } else {
                    newStatus = "rejected";
                }

                const payload = {
                    submissionId: location.state.submissionId,
                    newStatus: newStatus,
                    userId: userId,
                    userRole: userRole,
                    remark: formData.remark
                };

                const updateResponse = await api.put(
                    `/api/admin/service/submission/${location.state.submissionId}/status`,
                    payload
                );

                if (!updateResponse.data.success) {
                    throw new Error(updateResponse.data.message || "Failed to update status");
                }
            } else {
                // Creating new submission
                const payload = {
                    serviceId: formData.serviceId,
                    RecId: formData.RecId,
                    remark: formData.remark,
                    status: "auth_1",
                    userId: userId,
                };

                const createResponse = await api.post('/api/admin/service/submission/create', payload);

                if (!createResponse.data.success) {
                    throw new Error(createResponse.data.message || "Failed to create submission");
                }
            }

            toast.success(isProcessing ? "Form processed successfully!" : "New submission created successfully!");
            navigate(-1);
        } catch (err) {
            console.error("Failed to process form:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to process form");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'remark' ? value : value.trim()
        }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md text-black"
        >
            <div className="mb-4">
                <label htmlFor="serviceId" className="block text-gray-700 font-medium">
                    Service Id <span className="text-red-500">*</span>
                    {!isProcessing && <span className="text-gray-500 ml-2">(Auto-generated)</span>}
                </label>
                <input
                    type="text"
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500 bg-gray-50"
                    required
                    disabled
                />
            </div>

            <div className="mb-4">
                <label htmlFor="RecId" className="block text-gray-700 font-medium">
                    Rec Id <span className="text-red-500">*</span>
                    {!isProcessing && <span className="text-gray-500 ml-2">(Auto-generated)</span>}
                </label>
                <input
                    type="text"
                    id="RecId"
                    name="RecId"
                    value={formData.RecId}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500 bg-gray-50"
                    required
                    disabled
                />
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 font-medium">
                    Status <span className="text-red-500">*</span>
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                >
                    <option value="ACCEPT">ACCEPT</option>
                    <option value="REJECT">REJECT</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="remark" className="block text-gray-700 font-medium">
                    Remark <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Enter your remark"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500 min-h-[100px]"
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? 'Processing...' : isProcessing ? 'Process Submission' : 'Create Submission'} 
                <span className="ml-2">🚀</span>
            </button>
        </form>
    );
};

export default Accept_Reject_Add;