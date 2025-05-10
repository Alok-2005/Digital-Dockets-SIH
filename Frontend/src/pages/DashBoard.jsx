import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, CheckCircle, List, Settings, FileText, Layers, Key, Map, LogOut, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();

  const api = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get("http://localhost:3000/api/auth/check-auth");
        if (response.data.success) {
          setUserRole(response.data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/login");
      }
    };
    fetchUserRole();
  }, [navigate]);

  // Navigation handlers
  const navItems = [
    { label: "Home", path: "/dashboard/AdminHomePage", icon: Home, roles: ["citizen", "auth_1", "auth_2", "admin"] },
    { label: "Accept/Reject", path: "/dashboard/Accept_Reject_Page", icon: CheckCircle, roles: ["auth_1", "auth_2", "admin"] },
    { label: "Service List", path: "/dashboard/service_list_page", icon: List, roles: ["admin"] },
    { label: "Service Configuration", path: "/dashboard/service_config_page", icon: Settings, roles: ["admin"] },
    { label: "Field List", path: "/dashboard/field_list_page", icon: FileText, roles: ["admin"] },
    { label: "Field List Entries", path: "/dashboard/field_list_entries_page", icon: Layers, roles: ["admin"] },
    { label: "Form Configure", path: "/dashboard/form_config_page", icon: FileText, roles: ["admin"] },
    { label: "Generate Form", path: "/dashboard/generate_form_page", icon: FileText, roles: ["admin"] },
    { label: "Authorization Sequence", path: "/dashboard/authorization_sequence_page", icon: Key, roles: ["admin"] },
    { label: "Master SubZone", path: "/dashboard/master_subzone_page", icon: Map, roles: ["admin"] },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine active route
  const isActive = (path) => location.pathname === path;

  // Render navigation buttons based on user role
  const renderNavigationButtons = () => {
    return navItems
      .filter((item) => !userRole || item.roles.includes(userRole))
      .map((item) => (
        <motion.button
          key={item.label}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            isActive(item.path)
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-100 hover:bg-blue-600/70 hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate(item.path)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </motion.button>
      ));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed lg:static lg:w-72 w-72 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 z-50 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-semibold tracking-tight flex items-center space-x-2">
                <span className="bg-blue-500 p-2 rounded-full">
                  <Settings className="w-5 h-5 text-white" />
                </span>
                <span>Admin Portal</span>
              </h2>
              <button
                className="lg:hidden text-gray-200 hover:text-white"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center space-x-3 mb-10 bg-blue-800/40 p-4 rounded-xl shadow-inner">
              <div className="w-12 h-12 rounded-full bg-blue-400/50 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <p className="text-base font-medium">
                  {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Loading..."}
                </p>
                <p className="text-xs text-gray-300">Role</p>
              </div>
            </div>
            <nav className="space-y-2">{renderNavigationButtons()}</nav>
            <motion.button
              className="mt-10 flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors w-full font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-lg p-4 sm:p-5 flex justify-between items-center lg:justify-end">
          <button
            className="lg:hidden text-blue-800"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-semibold text-sm sm:text-base hidden sm:block">
              Welcome, {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "User"}
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
              <User className="w-6 h-6 text-blue-800" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        {/* <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto">
          {location.pathname === "/dashboard" ? (
    <div className="text-gray-700 text-xl font-semibold">
      {/* Your custom content for /dashboard route only */}
      {/* Welcome to the Dashboard! Please select a menu item.  */}
    {/* </div>
  ) : (
    <Outlet />
  )} */}
        {/* </main> */}


       <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 bg-gray-100 overflow-auto">
  {location.pathname === "/dashboard" ? (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-blue-800 mb-3">
          {userRole === "citizen" 
            ? "Welcome to Citizen Dashboard"
            : "Welcome to Certificate Management System"}
        </h1>
        <p className="text-gray-600 text-lg">
          {userRole === "citizen"
            ? "Track and manage your certificate applications with ease."
            : "Your centralized platform for digital certificate management and verification."}
        </p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-md p-6 md:p-8 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {userRole === "citizen" ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">How to Use</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Apply for services using the Generate Form option.</li>
              <li>Track your submitted applications in real-time.</li>
              <li>Receive notifications when your certificates are ready.</li>
              <li>Verify issued certificates directly via the portal.</li>
            </ul>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">Platform Overview</h2>
            <p className="text-gray-700">
              This portal allows administrators to configure, verify, and issue digital certificates efficiently.
              Use the left menu to navigate to different sections based on your assigned role.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2">Manage Workflows</h3>
                <p className="text-sm text-gray-600">Define approval steps for certificate processing.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2">Track Applications</h3>
                <p className="text-sm text-gray-600">Monitor and update application statuses in real-time.</p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  ) : (
    <Outlet />
  )}
</main>

      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashBoard;