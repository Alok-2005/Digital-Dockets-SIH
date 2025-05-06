import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

const Homepage = () => {
    const getServiceList = useAdminStore((state) => state.getServiceList); // Fetch the service list function
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getServiceList();
                console.log('Service List:', result); // Debugging
                if (result && result.serviceList) {
                    setData(result.serviceList);
                } else {
                    setData([]);
                    toast.error('No services data available.');
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                toast.error(error.message || 'Failed to fetch service list');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getServiceList]);

    const handleView = (serviceId) => {
      console.log('Navigating to:', serviceId);
      navigate(`/dashboard/service/${serviceId}`);
  };
  

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading services...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-semibold">No Services Found</h1>
                <p className="text-gray-500 mt-2">Please add services to display here.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6 text-center">Available Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
                {data.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition-shadow"
                    >
                        <h2 className="text-xl font-bold mb-2 text-gray-700">{item.name}</h2>
                        <p className="text-gray-600 mb-4">
                            <span className="font-semibold">Time Limit:</span> {item.timeLimit} Days
                        </p>
                        <button
                            onClick={() => handleView(item._id)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Homepage;
