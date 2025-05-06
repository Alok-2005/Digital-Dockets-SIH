import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Generate_Form_Page = () => {
    const getGenerateForm = useAdminStore((state) => state.getGenerateForm); // API call from the store
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getGenerateForm();
                console.log('Generate Form List Result:', result); // Debug log

                if (result && result.generateForm) {
                    setData(result.generateForm);
                    if (result.generateForm.length === 0) {
                        toast.error('No forms available. Please add a new form.');
                    }
                } else {
                    setData([]);
                    toast.error('No generate form data available.');
                }
            } catch (error) {
                console.error('Error fetching generate forms:', error);
                toast.error(error.message || "Failed to fetch generate form list.");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getGenerateForm]);

    const handleAddNewForm = () => {
        navigate("/dashboard/generate_form_add");
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading generate forms...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Generate Form List</h1>
                <button
                    onClick={handleAddNewForm}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    Add New Form
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No forms found.</p>
                    <p className="text-gray-500 mt-2">Click "Add New Form" to create one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Service Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
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
                                    <td className="px-6 py-4">{item.service.name}</td>
                                    <td className="px-6 py-4">{item.status}</td>
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
    )
}

export default Generate_Form_Page