import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { toast } from 'react-hot-toast';

const Authorization_Sequence_Page = () => {
    const getAuthorizationSequence = useAdminStore((state) => state.getAuthorizationSequence); // API call from the store
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAuthorizationSequence();
                console.log('Authorization Sequence Data:', result); // Debug log

                if (result && result.authorizationSequence) {
                    setData(result.authorizationSequence);
                    if (result.authorizationSequence.length === 0) {
                        toast.info('No authorization sequences available. Please add a new one.');
                    }
                } else {
                    setData([]);
                    toast.error('No authorization sequence data found.');
                }
            } catch (error) {
                console.error('Error fetching authorization sequence:', error);
                toast.error(error.message || 'Failed to fetch authorization sequence data.');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getAuthorizationSequence]);

    // Navigate to add new authorization sequence page
    const handleAddNewSequence = () => {
        navigate('/dashboard/authorization_sequence_add');
    };

    return (
        <>
            <div className="container mx-auto p-4">
                {/* Header Section */}
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold">Authorization Sequence</h1>
                    <button
                        onClick={handleAddNewSequence}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Add New Authorization Sequence
                    </button>
                </div>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading authorization sequences...</p>
                    </div>
                ) : data.length === 0 ? (
                    /* No Data Available */
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No authorization sequences found.</p>
                        <p className="text-gray-500 mt-2">Click "Add New Authorization Sequence" to create one.</p>
                    </div>
                ) : (
                    /* Table Section */
                    <div className="overflow-x-auto bg-white rounded-lg shadow text-white">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Service Name</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">User Role</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Part Of Service</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Stage</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Subzones</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Supervisor Of</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Can Take Payment</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Can Reject</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className="border-t hover:bg-gray-500 transition-colors duration-200 bg-gray-600"
                                    >
                                        <td className="px-6 py-4 text-center">{index + 1}</td>
                                        <td className="px-6 py-4">{item.service?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.userId?.role || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.partOfService ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4">{item.stage || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            {item.subzones && item.subzones.length > 0
                                                ? item.subzones.map((subzone, index) => (
                                                      <span key={subzone._id}>
                                                          {subzone.SubZoneName}
                                                          {index < item.subzones.length - 1 && ', '}
                                                      </span>
                                                  ))
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">{item.supervisorOf || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.canTakePayment ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4">{item.canReject ? 'Yes' : 'No'}</td>
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
        </>
    );
};

export default Authorization_Sequence_Page;
