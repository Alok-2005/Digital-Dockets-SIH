import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ServiceFormTable from '../components/ServiceFormTable';

const ServicePage = () => {
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Check service status
  useEffect(() => {
    const checkServiceStatus = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`http://localhost:3000/api/admin/generate-form/status/${serviceId}`);
        if (response.data.success) {
          setIsServiceEnabled(response.data.status === 'ENABLED');
        } else {
          setIsServiceEnabled(false);
          toast.error('Service is not enabled');
        }
      } catch (error) {
        console.error('Error checking service status:', error);
        setIsServiceEnabled(false);
        toast.error('Unable to verify service status');
      } finally {
        setLoading(false);
      }
    };

    checkServiceStatus();
  }, [serviceId]);

  const handleApplyClick = () => {
    if (serviceId) {
      navigate(`/dashboard/service/form/${serviceId}`);
    }
  };

  if (!serviceId) {
    return (
      <div className="p-4">
        <p className="text-red-500">No Service ID provided!</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ServiceFormTable serviceId={serviceId} />
      
      {/* Only show Apply button if service is enabled */}
      {isServiceEnabled && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleApplyClick}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
          >
            Apply
          </button>
        </div>
      )}

      {/* Optional: Show message if service is disabled */}
      {!isServiceEnabled && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-center text-yellow-700">
            This service is currently not available for new applications.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicePage;