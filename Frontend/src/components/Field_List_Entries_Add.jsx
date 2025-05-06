import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Field_List_Entries_Add = () => {
    const { FieldListEntries, getFieldList } = useAdminStore();
    const [loading, setLoading] = useState(false);
    const [fieldLists, setFieldLists] = useState([]);
    const [form, setForm] = useState({
        listId: '',
        value: '',
        label: ''
    });

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
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!form.listId || !form.value || !form.label) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);
        try {
            await FieldListEntries(form);
            // Reset form after successful submission
            setForm({
                listId: '',
                value: '',
                label: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-black">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add Field List Entry</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            htmlFor="listId" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            List Id <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="listId"
                            name="listId"
                            value={form.listId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        >
                            <option value="">Select a value...</option>
                            {fieldLists.map((list) => (
                                <option key={list._id} value={list._id}>
                                    {list.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>

                    <div>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center space-x-2`}
                    >
                        <span>{loading ? 'Submitting...' : 'Submit'}</span>
                        <Send className={`w-4 h-4 ${loading ? 'opacity-50' : ''}`} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Field_List_Entries_Add;