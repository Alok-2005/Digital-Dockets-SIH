import React, { useEffect } from "react";
import {  Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import DashBoard from "./pages/DashBoard";
import { Toaster } from "react-hot-toast";
import AdminHomePage from "./pages/AdminHomePage";
import AcceptReject from "./components/Accept_Reject_Add";
import Accept_Reject_Page from "./pages/Accept_Reject_Page";
import Service_list_page from "./pages/Service_list_page";
import Service_List_Add from "./components/service_list_add";
import Service_Config_Page from "./pages/Service_Config_Page";
import Service_Config_Add from "./components/Service_Config_Add";
import Field_List_Page from "./pages/Field_List_Page";
import Field_List_Add from "./components/Field_List_Add";
import Field_List_Entries_Page from "./pages/Field_List_Entries_Page";
import Field_List_Entries_Add from "./components/Field_List_Entries_Add";
import Form_Config_Page from "./pages/Form_Config_Page";
import Form_Config_Add from "./components/Form_Config_Add";
import Generate_Form_Page from "./pages/Generate_Form_Page";
import Generate_Form_Add from "./components/Generate_Form_Add";
import Authorization_Sequence_Page from "./pages/Authorization_Sequence_Page";
import Authorization_Sequence_Add from "./components/Authorization_Sequence_Add";
import Master_SubZone_Page from "./pages/Master_SubZone_Page";
import Master_SubZone_Add from "./components/Master_SubZone_Add";
import ServiceFormPage from "./pages/ServiceFormPage";
import ServicePage from "./pages/ServicePage";
// import CertificateGeneration from "./pages/CertificateGeneration";
import CertificateView from "./components/CertificateView";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};



function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;


  return (
    <>
   
    <Navbar/>
    
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          >
            <Route
            path="AdminHomePage"
            element={
              <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
            }
            />
            
            <Route
            path="Accept_Reject_Page"
            element={
              <ProtectedRoute>
              <Accept_Reject_Page />
            </ProtectedRoute>
            }
            /> 
            <Route
              path="add"
              element={
                <ProtectedRoute>
                <AcceptReject />
              </ProtectedRoute>
              }
              />
              <Route
              path="service_list_page"
              element={
                <ProtectedRoute>
                <Service_list_page />
              </ProtectedRoute>
              }
              />
              <Route
              path="service_add"
              element={
                <ProtectedRoute>
                <Service_List_Add />
              </ProtectedRoute>
              }
              />
              <Route
              path="service_config_page"
              element={
                <ProtectedRoute>
                <Service_Config_Page />
              </ProtectedRoute>
              }
              />
              <Route
              path="service_config_add"
              element={
                <ProtectedRoute>
                  <Service_Config_Add />
                </ProtectedRoute>
              }
              />
              <Route
              path="field_list_page"
              element={
                <ProtectedRoute>
                  <Field_List_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="field_list_add"
              element={
                <ProtectedRoute>
                  <Field_List_Add/>
                </ProtectedRoute>
              }
              />
              <Route
              path="field_list_entries_page"
              element={
                <ProtectedRoute>
                  <Field_List_Entries_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="field_list_entries_add"
              element={
                <ProtectedRoute>    
                  <Field_List_Entries_Add />
                </ProtectedRoute>
              }
              />
              <Route
              path="form_config_page"
              element={
                <ProtectedRoute>
                  <Form_Config_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="form_config_add"
              element={
                <ProtectedRoute>
                  <Form_Config_Add />
                </ProtectedRoute>
              }
              />
              <Route
              path="generate_form_page"
              element={
                <ProtectedRoute>  
                  <Generate_Form_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="generate_form_add"
              element={
                <ProtectedRoute>
                  <Generate_Form_Add />
                </ProtectedRoute>
              }
              />
              <Route
              path="authorization_sequence_page"
              element={
                <ProtectedRoute>
                  <Authorization_Sequence_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="authorization_sequence_add"
              element={
                <ProtectedRoute>
                  <Authorization_Sequence_Add />
                </ProtectedRoute>
              }
              />
              <Route
              path="master_subzone_page"
              element={
                <ProtectedRoute>
                  <Master_SubZone_Page />
                </ProtectedRoute>
              }
              />
              <Route
              path="master_subzone_add"
              element={
                <ProtectedRoute>
                <Master_SubZone_Add />
                </ProtectedRoute>
              }
              />
               <Route
              path="service/:serviceId"
              element={
                <ProtectedRoute>
                  <ServicePage/>
                </ProtectedRoute>
              }
              />
              <Route
              path="service/form/:serviceId"
              element={
                <ProtectedRoute>
                  <ServiceFormPage/>
                </ProtectedRoute>
              }
              />
              <Route path="certificate" element={<CertificateView />} />
          </Route>
       <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />

      </Routes>
   <Toaster/>
    </>
  );
}

export default App;
