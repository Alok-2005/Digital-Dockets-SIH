import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, FileText, Clock, Eye } from "lucide-react";

const Homepage = () => {
  const getServiceList = useAdminStore((state) => state.getServiceList);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getServiceList();
        console.log("Service List:", result);
        if (result && result.serviceList) {
          setData(result.serviceList);
        } else {
          setData([]);
          toast.error("No services data available.");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error(error.message || "Failed to fetch service list");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getServiceList]);

  const handleView = (serviceId) => {
    console.log("Navigating to:", serviceId);
    navigate(`/dashboard/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-3 sm:p-5 lg:p-6 xl:p-8 flex justify-center items-center min-h-[50vh] bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600 text-sm sm:text-base">Loading services...</p>
        </motion.div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="container mx-auto p-3 sm:p-5 lg:p-6 xl:p-8 flex justify-center items-center min-h-[50vh] bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Services Found</h1>
          <p className="text-gray-500 text-sm sm:text-base">Please add services to display here.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-5 lg:p-6 xl:p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8 text-center text-gray-800"
      >
        Available Services
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {data.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white shadow-md rounded-xl p-4 sm:p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{item.name}</h2>
            </div>
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Time Limit:</span> {item.timeLimit} Days
              </p>
            </div>
            <motion.button
              onClick={() => handleView(item._id)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View</span>
              </span>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;