import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Field_List_Page = () => {
  const getFieldList = useAdminStore((state) => state.getFieldList);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFieldList();
        if (result && Array.isArray(result.fieldList)) {
          setData(result.fieldList);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch field list");
        setData([]);
        setLoading(false);
      }
    };
    fetchData();
  }, [getFieldList]);

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/dashboard/field_list_add");
  };

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
        <h1 className="text-3xl font-semibold">Field List</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none transition duration-200 flex items-center gap-2"
        >
          <span>Add New Field</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gray-600 rounded-lg shadow-lg overflow-hidden text-white" >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-6 py-3 text-left font-medium">#</th>
                <th className="px-6 py-3 text-left font-medium">Field Name</th>
                {/* <th className="px-6 py-3 text-left font-medium">Status</th> */}
                <th className="px-6 py-3 text-left font-medium">Created At</th>
                {/* <th className="px-6 py-3 text-left font-medium">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-500 transition duration-200"
                >
                  <td className="px-6 py-3 text-center">{index + 1}</td>
                  <td className="px-6 py-3">{item.name}</td>
                  {/* <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status || "active"}
                    </span>
                  </td> */}
                  <td className="px-6 py-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  {/* <td className="px-6 py-3">
                    <button
                      onClick={() => navigate(`/dashboard/field-list/edit/${item._id}`)}
                      className="text-blue-500 hover:text-blue-700 mr-4 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this field?")) {
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
              No field lists found
            </div>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default Field_List_Page;