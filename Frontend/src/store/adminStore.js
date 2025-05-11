import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

const API_URL_Admin =  "https://digital-dockets-sih-2.onrender.com/api/admin";
axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
  isLoading: false,
  error: null,

  getUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL_Admin}/get_users`);
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

getAcceptReject: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL_Admin}/accept_reject`);
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  Accept_Reject_Add: async ({ serviceId, RecId, status, remark }) => {
    try {
      // Validate inputs
      if (!RecId || !serviceId || !status || !remark) {
        throw new Error("All fields are required");
      }

      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL_Admin}/accept_reject/add`, {
        serviceId,
        RecId,
        status,
        remark,
      });

      // Only update loading state on success
      set({ isLoading: false, error: null });

      toast.success(response.data.message || "Added Successfully!");
      return response.data;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      
      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error(errorMessage);
      throw error;
    }
  },

  getServiceList: async () => {
    try {
        set({ isLoading: true, error: null });
        const response = await axios.get(`${API_URL_Admin}/service_list`);
        set({ isLoading: false, error: null });
        
        console.log('API Response:', response.data); // Debug log
        
        // Check both possible response formats
        if (response.data && (response.data.serviceList || response.data.data)) {
            return {
                status: response.data.status,
                serviceList: response.data.serviceList || response.data.data
            };
        } else if (Array.isArray(response.data)) {
            return {
                status: true,
                serviceList: response.data
            };
        } else {
            throw new Error("No services available");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Error occurred";
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
        throw error;
    }
},

  Service_List_Add: async ({ name, tableName, timeLimit }) => {
    try {
      // Validate inputs
      if (!name || !tableName || !timeLimit) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/service_list/add`, {
        name,
        tableName,
        timeLimit,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

getServiceConfig: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL_Admin}/service_config`);
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  Service_Config_Add: async ({ service, isPaidService, rateOfService, customRate, certificateData }) => {
    try {
      // Validate inputs
      if (!service || !isPaidService || !rateOfService || !certificateData) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/service_config/add`, {
        service,
        isPaidService,
        rateOfService,
        customRate,
        certificateData,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) { 
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

getFieldList: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL_Admin}/field_list`);
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  FieldListAdd: async ({ name }) => {
    try {
      // Validate inputs
      if (!name) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/field_list/add`, {
        name,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";  
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
getFieldListEntries: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/field_list_entries`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);    
    throw error;
  }
},

  FieldListEntries: async ({ listId, value,label }) => {
    try {
      // Validate inputs
      if (!listId || !value || !label) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/field_list_entries/add`, {
        listId,
        value,
        label,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

getFromConfig: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/form_config`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);
    throw error;
  }
},

getFieldType: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/field_type`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);
    throw error;
  }
},

  FormConfigAdd: async ({ service,fieldName,fieldType,nameOfLabel,maxField,minField,required,fieldListId,helpBlock,extra,position}) => {
    try {
      // Validate inputs
      if (!service || !fieldName || !fieldType || !nameOfLabel || !maxField || !minField || !required || !fieldListId) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/form_config/add`, {
        service,
        fieldName,
        fieldType,
        nameOfLabel,
        maxField,
        minField,
        required,
        fieldListId,
        helpBlock,
        extra,
        position,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  
getGenerateForm: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/generate_form`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);
    throw error;
  }
},

  GenerateFormAdd: async ({ service, status }) => {
    try {
      // Validate inputs
      if (!service || !status) {
        throw new Error("All fields are required");
      } 
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/generate_form/add`, {
        service,
        status,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) { 
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";  
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

getAuthorizationSequence: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/authorization_sequence`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);
    throw error;
  }
},

  AuthorizationSequenceAdd: async ({ service, userId, partOfService, stage, subzones, supervisorOf, canTakePayment, canReject }) => {
    try {
      // Validate inputs
      if (!service || !userId || !partOfService || !stage || !subzones || !supervisorOf || !canTakePayment || !canReject) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/authorization_sequence/add`, {
        service,
        userId,
        partOfService,
        stage,
        subzones,
        supervisorOf,
        canTakePayment,
        canReject,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
getMasterSubZone: async () => {
  try {
    set({ isLoading: true, error: null });
    const response = await axios.get(`${API_URL_Admin}/master_subzone`);
    set({ isLoading: false, error: null });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error occurred";
    set({ error: errorMessage, isLoading: false });
    toast.error(errorMessage);
    throw error;
  }
},

  MasterSubZoneAdd:async({zoneId,SubZoneName})=>{
    try {
      // Validate inputs
      if (!zoneId || !SubZoneName) {
        throw new Error("All fields are required");
      }
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/master_subzone/add`, {
        zoneId,
        SubZoneName,
      });
      set({ isLoading: false, error: null });
      toast.success(response.data.message || "Added Successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  getFormConfigByService: async (serviceId) => {  
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL_Admin}/form_config/service/${serviceId}`);
      set({ isLoading: false, error: null });
      return response.data; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
  submitServiceForm: async (serviceId, formData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL_Admin}/service/${serviceId}/submit`, formData);
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

}));


