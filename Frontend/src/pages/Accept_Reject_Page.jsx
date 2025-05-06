import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";
import toast from "react-hot-toast";
import axios from 'axios';

const Accept_Reject_Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Create axios instance
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/api/admin/service/formdata/all');
      if (response.data.success) {
        setData(response.data.submissions);
      } else {
        setData([]);
        toast.error(response.data.message || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error(error.response?.data?.message || "Failed to fetch submissions");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'auth_1':
        return 'text-blue-500';
      case 'auth_2':
        return 'text-purple-500';
      case 'done':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Service Submissions</h1>
        <button
          onClick={() => navigate("/dashboard/add")}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none transition duration-200"
        >
          Add New Submission
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No submissions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Remark</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => {
                const latestProcess = item.processedBy?.[item.processedBy.length - 1];
                return (
                  <tr key={item._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.service || 'Unknown Service'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.formData?.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-semibold ${getStatusColor(item.status)}`}>
                        {item.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(latestProcess?.processedAt || item.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {latestProcess?.remark || 'No remark'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Accept_Reject_Page;
