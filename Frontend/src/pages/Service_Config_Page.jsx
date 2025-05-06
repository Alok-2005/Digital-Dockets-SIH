import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';
import MDEditor from '@uiw/react-md-editor';

const Service_Config_Page = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const getServiceConfig = useAdminStore((state) => state.getServiceConfig);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const result = await getServiceConfig();
                console.log('Service Config Result:', result); // Debug log
                
                if (result && result.data) {
                    setConfigs(result.data);
                    if (result.data.length === 0) {
                        toast.info('No service configurations available. Please add some configurations.');
                    }
                } else {
                    setConfigs([]);
                    toast.error('No service configuration data available');
                }
            } catch (error) {
                console.error('Error fetching service configurations:', error);
                toast.error(error.message || "Failed to fetch service configurations");
                setConfigs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, [getServiceConfig]);

    const handleAddNewService = () => {
        navigate("/dashboard/service_config_add");
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading service configurations...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Service Configurations</h1>
                <button
                    onClick={handleAddNewService}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    Add New Service Config
                </button>
            </div>

            {configs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No service configurations found.</p>
                    <p className="text-gray-500 mt-2">Click "Add New Service Config" to create one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Service Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Paid Service</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Rate</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Custom Rate</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Certificate</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((config, index) => (
                                <tr
                                    key={config._id}
                                    className="border-t hover:bg-gray-500 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-center">{index + 1}</td>
                                    <td className="px-6 py-4">{config.service?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            config.isPaidService ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {config.isPaidService ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">₹{config.rateOfService}</td>
                                    <td className="px-6 py-4">{config.customRate ? `₹${config.customRate}` : 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {/* Render certificateData using MDEditor for live preview */}
                                        <MDEditor.Markdown source={config.certificateData} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(config.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Service_Config_Page;
