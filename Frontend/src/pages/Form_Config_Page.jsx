import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Form_Config_Page = () => {
    const getFromConfig = useAdminStore((state) => state.getFromConfig);  // Assuming this function exists in your store
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getFromConfig();
                console.log('Form Config List Result:', result);  // Debug log
                
                if (result && result.formConfig) {
                    setData(result.formConfig);
                    if (result.formConfig.length === 0) {
                        toast.info('No form configurations available. Please add some configurations.');
                    }
                } else {
                    setData([]);
                    toast.error('No form configurations data available');
                }
            } catch (error) {
                console.error('Error fetching form configurations:', error);
                toast.error(error.message || "Failed to fetch form configuration list");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getFromConfig]);

    const handleAddNewFormConfig = () => {
        navigate("/dashboard/form_config_add");  // Navigate to the page to add new form configuration
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading form configurations...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Form Config List</h1>
                <button
                    onClick={handleAddNewFormConfig}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    <Plus className="mr-2" /> Add New Form Config
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No form configurations found.</p>
                    <p className="text-gray-500 mt-2">Click "Add New Form Config" to create one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Service Name</th>  {/* Added service name */}
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Field Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Field Type</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Label</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Max Field</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Min Field</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Required</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Field List ID</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Help Block</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Extra</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Position</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className="border-t hover:bg-gray-500 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-center">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        {item.service ? item.service.name : 'No Service'} {/* Display the associated service name */}
                                    </td>
                                    <td className="px-6 py-4">{item.fieldName}</td>
                                    <td className="px-6 py-4">{item.fieldType}</td>
                                    <td className="px-6 py-4">{item.nameOfLabel}</td>
                                    <td className="px-6 py-4">{item.maxField || '-'}</td>
                                    <td className="px-6 py-4">{item.minField || '-'}</td>
                                    <td className="px-6 py-4">{item.required ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4">
                                        {item.fieldListId ? item.fieldListId.name : 'No field list'} {/* Display the associated service name */}
                                    </td>
                                    <td className="px-6 py-4">{item.helpBlock || '-'}</td>
                                    <td className="px-6 py-4">{item.extra || '-'}</td>
                                    <td className="px-6 py-4">{item.position}</td>
                                    
                                    <td className="px-6 py-4">
                                        {new Date(item.createdAt).toLocaleString()}
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

export default Form_Config_Page;
