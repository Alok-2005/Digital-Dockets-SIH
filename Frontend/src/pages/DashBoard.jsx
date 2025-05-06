import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from 'axios';

const DashBoard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const api = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('http://localhost:3000/api/auth/check-auth');
        if (response.data.success) {
          setUserRole(response.data.user.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  // Navigation handlers
  const handle = () => navigate("/dashboard/AdminHomePage");
  const handleAccept_Reject = () => navigate("/dashboard/Accept_Reject_Page");
  const handleServiceList = () => navigate("/dashboard/service_list_page");
  const handleServiceConfig = () => navigate("/dashboard/service_config_page");
  const handleFieldList = () => navigate("/dashboard/field_list_page");
  const handleFieldListEntries = () => navigate("/dashboard/field_list_entries_page");
  const handleFromConfig = () => navigate("/dashboard/form_config_page");
  const handleGenerateForm = () => navigate("/dashboard/generate_form_page");
  const handleSequence = () => navigate("/dashboard/authorization_sequence_page");
  const handleSubZone = () => navigate("/dashboard/master_subzone_page");

  // Render navigation buttons based on user role
  const renderNavigationButtons = () => {
    switch(userRole) {
      case 'citizen':
        return (
          <div className="flex flex-col space-y-2">
            <button onClick={handle} >
              Home
            </button>
          </div>
        );
      case 'auth_1':
      case 'auth_2':
        return (
          <div className="flex flex-col space-y-2">
            <button onClick={handle} >
              Home
            </button>
            <button onClick={handleAccept_Reject} >
              Accept/Reject
            </button>
          </div>
        );
      case 'admin':
        return (
          <div className="flex flex-col space-y-2">
            <button onClick={handle} >Home</button>
            <button onClick={handleAccept_Reject}>Accept/Reject</button>
            <button onClick={handleServiceList}>Service List</button>
            <button onClick={handleServiceConfig} >Service Configuration</button>
            <button onClick={handleFieldList} >Field List</button>
            <button onClick={handleFieldListEntries} >Field List Entries</button>
            <button onClick={handleFromConfig} >Form Configure</button>
            <button onClick={handleGenerateForm} >Generate Form</button>
            <button onClick={handleSequence} >Authorization Sequence</button>
            <button onClick={handleSubZone} >Master SubZone</button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col space-y-2">
            <button onClick={handle} >
              Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <div className="w-[20%] p-4 bg-gray-700">
        {renderNavigationButtons()}
      </div>
      <div className="bg-gray-600 w-[80%] h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoard;