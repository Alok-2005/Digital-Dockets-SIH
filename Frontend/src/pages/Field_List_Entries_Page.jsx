import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

const Field_List_Entries_Page = () => {
    const { getFieldListEntries, getFieldList } = useAdminStore();
    const [data, setData] = useState([]);
    const [fieldLists, setFieldLists] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Fetch entries
                const result = await getFieldListEntries();
                if (result && Array.isArray(result.fieldListEntries)) {
                    setData(result.fieldListEntries);
                }

                // Fetch field lists for reference
                const listsResult = await getFieldList();
                if (listsResult && Array.isArray(listsResult.fieldList)) {
                    const listsMap = {};
                    listsResult.fieldList.forEach(list => {
                        listsMap[list._id] = list.name;
                    });
                    setFieldLists(listsMap);
                }

                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch data");
                setLoading(false);
            }
        };
        fetchData();
    }, [getFieldListEntries, getFieldList]);

    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Field List Entries</h1>
                <button
                    onClick={() => navigate("/dashboard/field_list_entries_add")}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none transition duration-200 flex items-center gap-2"
                >
                    <span>Add New Entry</span>
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden text-black">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="px-6 py-3 text-left font-medium">#</th>
                                <th className="px-6 py-3 text-left font-medium">List Name</th>
                                <th className="px-6 py-3 text-left font-medium">Value</th>
                                <th className="px-6 py-3 text-left font-medium">Label</th>
                                {/* <th className="px-6 py-3 text-left font-medium">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className="border-b hover:bg-gray-50 transition duration-200"
                                >
                                    <td className="px-6 py-3 text-center">{index + 1}</td>
                                    <td className="px-6 py-3">{fieldLists[item.listId] || 'Unknown List'}</td>
                                    <td className="px-6 py-3">{item.value}</td>
                                    <td className="px-6 py-3">{item.label}</td>
                                    {/* <td className="px-6 py-3">
                                        <button
                                            onClick={() => navigate(`/dashboard/field-list-entries/edit/${item._id}`)}
                                            className="text-blue-500 hover:text-blue-700 mr-4 inline-flex items-center gap-1"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this entry?")) {
                                                    // Implement delete logic
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No entries found
                        </div>
                    )}
                </div>
            </div>

            {/* <Outlet /> */}
        </div>
    );
};

export default Field_List_Entries_Page;