import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Field_List_Entries_Page = () => {
  const { getFieldListEntries, getFieldList } = useAdminStore();
  const [data, setData] = useState([]);
  const [fieldLists, setFieldLists] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
          listsResult.fieldList.forEach((list) => {
            listsMap[list._id] = list.name;
          });
          setFieldLists(listsMap);
        }

        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [getFieldListEntries, getFieldList]);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div
          className="mb-6 flex justify-between items-center"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Field List Entries
            </h1>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>
          <button
            onClick={() => navigate('/dashboard/field_list_entries_add')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <span>Add New Entry</span>
            <Plus className="w-5 h-5" />
          </button>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg">No entries found.</p>
            <p className="text-gray-500 mt-2">Click "Add New Entry" to create one.</p>
          </motion.div>
        ) : (
          <motion.div
            className="overflow-x-auto"
            variants={itemVariants}
          >
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    List Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Label
                  </th>
                  {/* Uncomment if actions are needed */}
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                    variants={itemVariants}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {fieldLists[item.listId] || 'Unknown List'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.value}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.label}
                    </td>
                    {/* Uncomment if actions are needed */}
                    {/* <td className="px-6 py-4 text-sm border-b">
                      <button
                        onClick={() => navigate(`/dashboard/field-list-entries/edit/${item._id}`)}
                        className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this entry?')) {
                            // Implement delete logic
                          }
                        }}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td> */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
      {/* <Outlet /> */}
    </motion.section>
  );
};

export default Field_List_Entries_Page;