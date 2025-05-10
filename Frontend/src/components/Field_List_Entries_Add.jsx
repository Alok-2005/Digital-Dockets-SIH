import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Field_List_Entries_Add = () => {
  const { FieldListEntries, getFieldList } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [fieldLists, setFieldLists] = useState([]);
  const [form, setForm] = useState({
    listId: '',
    value: '',
    label: '',
  });

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

  // Fetch field lists for dropdown
  useEffect(() => {
    const fetchFieldLists = async () => {
      try {
        const result = await getFieldList();
        if (result && Array.isArray(result.fieldList)) {
          setFieldLists(result.fieldList);
        }
      } catch (error) {
        toast.error('Failed to fetch field lists');
      }
    };
    fetchFieldLists();
  }, [getFieldList]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.listId || !form.value || !form.label) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await FieldListEntries(form);
      toast.success('Entry added successfully');
      setForm({
        listId: '',
        value: '',
        label: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Add Field List Entry
          </h1>
          <div className="w-20 h-1 bg-blue-600 mb-6"></div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="listId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              List Name <span className="text-red-500">*</span>
            </label>
            <select
              id="listId"
              name="listId"
              value={form.listId}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={loading}
            >
              <option value="">Select a list...</option>
              {fieldLists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Value <span className="text-red-500">*</span>
            </label>
            <input
              id="value"
              name="value"
              type="text"
              value={form.value}
              onChange={handleChange}
              placeholder="Enter Value"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Label <span className="text-red-500">*</span>
            </label>
            <input
              id="label"
              name="label"
              type="text"
              value={form.label}
              onChange={handleChange}
              placeholder="Enter Label"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{loading ? 'Submitting...' : 'Submit'}</span>
              <Send className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
};

export default Field_List_Entries_Add;