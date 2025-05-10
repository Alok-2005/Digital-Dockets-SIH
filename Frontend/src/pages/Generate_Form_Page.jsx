import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Generate_Form_Page = () => {
  const getGenerateForm = useAdminStore((state) => state.getGenerateForm);
  const [data, setData] = useState([]);
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
        const result = await getGenerateForm();
        console.log('Generate Form List Result:', result);

        if (result && result.generateForm) {
          setData(result.generateForm);
          if (result.generateForm.length === 0) {
            toast.info('No forms available. Please add a new form.');
          }
        } else {
          setData([]);
          toast.error('No generate form data available.');
        }
      } catch (error) {
        console.error('Error fetching generate forms:', error);
        toast.error(error.message || 'Failed to fetch generate form list.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getGenerateForm]);

  const handleAddNewForm = () => {
    navigate('/dashboard/generate_form_add');
  };

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
              Generate Form List
            </h1>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>
          <button
            onClick={handleAddNewForm}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Form</span>
          </button>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg">No forms found.</p>
            <p className="text-gray-500 mt-2">Click "Add New Form" to create one.</p>
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
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Created At
                  </th>
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
                      {item.service.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Generate_Form_Page;