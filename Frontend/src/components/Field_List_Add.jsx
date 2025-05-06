import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Field_List_Add = () => {
    const [form, setForm] = useState({
        name: ""
    });
    
    const { FieldListAdd } = useAdminStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('List name is required');
            return;
        }

        try {
            await FieldListAdd(form);  // Fixed: using form instead of from
            toast.success('List added successfully');
            setForm({ name: "" });  // Reset form after successful submission
        } catch (error) {
            console.error('Error adding list:', error);
            toast.error('Failed to add list');
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-black">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            htmlFor="name" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name Of List <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"  // Added name attribute
                            type="text"
                            value={form.name}  // Using form.name instead of listName
                            onChange={handleChange}  // Using new handleChange function
                            placeholder="Enter Name Of List"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>Submit</span>
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Field_List_Add;