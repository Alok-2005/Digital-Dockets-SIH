import React, { useState } from 'react'
import { useAdminStore } from '../store/adminStore'
import toast from 'react-hot-toast'

const Master_SubZone_Add = () => {
    const [formData, setformData] = useState({
        zoneId:'',
        SubZoneName:'',
    })
const {MasterSubZoneAdd,isLoading}=useAdminStore()
const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.zoneId || !formData.SubZoneName){
        toast.error("All fields are required");
            return;
    }
    try {
        await MasterSubZoneAdd(formData);
        setformData({
            zoneId:'',
            SubZoneName:'',
        })
        toast.success("Added Successfully!");
    } catch (error) {
         toast.error("Failed to add");

    }
}
const handleChange = (e) => {
    const { name, value } = e.target;
    setformData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  return (
    <>
    <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-md text-black"
        >
            {/* Name of Service */}
            <div className="mb-4">
                <label htmlFor="ZoneId" className="block text-gray-700 font-medium">
                    ZoneID<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="zoneId"
                    name="zoneId"
                    value={formData.zoneId}
                    onChange={handleChange}
                    placeholder="Enter ZoneID"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Table Name */}
            <div className="mb-4">
                <label htmlFor="tableName" className="block text-gray-700 font-medium">
                    SubZone Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="SubZoneName"
                    name="SubZoneName"
                    value={formData.SubZoneName}
                    onChange={handleChange}
                    placeholder="Enter SubZone"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-blue-500"
                    required
                    disabled={isLoading}
                />
            </div>

           

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? 'Submitting...' : 'Submit'} <span className="ml-2">🚀</span>
            </button>
        </form>
    </>
  )
}

export default Master_SubZone_Add