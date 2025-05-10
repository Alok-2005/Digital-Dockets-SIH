import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Form_Config_Page = () => {
  const getFromConfig = useAdminStore((state) => state.getFromConfig);
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
        const result = await getFromConfig();
        console.log('Form Config List Result:', result);

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
        toast.error(error.message || 'Failed to fetch form configuration list');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getFromConfig]);

  const handleAddNewFormConfig = () => {
    navigate('/dashboard/form_config_add');
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
              Form Config List
            </h1>
            <div className="w-20 h-1 bg-blue-600 mt-2"></div>
          </div>
          <button
            onClick={handleAddNewFormConfig}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Form Config</span>
          </button>
        </motion.div>

        {data.length === 0 ? (
          <motion.div
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className="text-gray-600 text-lg">No form configurations found.</p>
            <p className="text-gray-500 mt-2">Click "Add New Form Config" to create one.</p>
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
                    Field Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Field Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Max Field
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Min Field
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Required
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Field List ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Help Block
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Extra
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Position
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
                      {item.service ? item.service.name : 'No Service'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.fieldName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.fieldType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.nameOfLabel}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.maxField || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.minField || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.required ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.fieldListId ? item.fieldListId.name : 'No field list'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.helpBlock || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.extra || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 border-b">
                      {item.position}
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

export default Form_Config_Page;