import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Service_list_page = () => {
    const getServiceList = useAdminStore((state) => state.getServiceList);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getServiceList();
                console.log('Service List Result:', result); // Debug log
                
                if (result && result.serviceList) {
                    setData(result.serviceList);
                    if (result.serviceList.length === 0) {
                        toast.info('No services available. Please add some services.');
                    }
                } else {
                    setData([]);
                    toast.error('No services data available');
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                toast.error(error.message || "Failed to fetch service list");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getServiceList]);

    const handleAddNewService = () => {
        navigate("/dashboard/service_add");
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading services...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Service List Table</h1>
                <button
                    onClick={handleAddNewService}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    Add New Service
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No services found.</p>
                    <p className="text-gray-500 mt-2">Click "Add New Service" to create one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Table Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Time Limit</th>
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
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{item.tableName}</td>
                                    <td className="px-6 py-4">{item.timeLimit}</td>
                                    <td className="px-6 py-4">
                                        {new Date(item.CreatedAt).toLocaleString()}
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

export default Service_list_page;