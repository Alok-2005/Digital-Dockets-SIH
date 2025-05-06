import express from 'express';
import {
  AuthorizationSequenceAdd,
  FieldListAdd,
  FieldListEntriesAdd,
  FieldType,
  FormConfigAdd,
  GenerateFromAdd,
  getAllSubmissions,
  getAuthorizationSequence,
  getCertificateData,
  getFieldList,
  getFieldListEntries,
  getFormConfig,
  getFormConfigByService,
  getFormData,
  getGenerateForm,
  getmasterSubzone,
  getServiceConfig,
  getServiceConfigAmount, // New import
  getServiceListAdd,
  getServiceStatus,
  getUsers,
  MasterSubzone,
  processPayment,
  ServiceConfigAdd,
  ServiceListAdd,
  submitServiceForm,
  updateFormStatus,
  createOrder, // New import
  verifyPayment // New import
} from '../controllers/admin.controllers.js';
import { getAcceptReject, AcceptRejectAdd } from '../controllers/admin.controllers.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Existing routes
router.get("/get_users", getUsers);
router.get("/accept_reject", getAcceptReject);
router.post("/accept_reject/add", AcceptRejectAdd);

router.get("/service_list", getServiceListAdd);
router.post("/service_list/add", ServiceListAdd);

router.get("/service_config", getServiceConfig);
router.post("/service_config/add", ServiceConfigAdd);

router.get("/field_list", getFieldList);
router.post("/field_list/add", FieldListAdd);

router.get("/field_list_entries", getFieldListEntries);
router.post("/field_list_entries/add", FieldListEntriesAdd);

router.get("/form_config", getFormConfig);
router.get("/field_type", FieldType);
router.post("/form_config/add", FormConfigAdd);

router.get("/generate_form", getGenerateForm);
router.post("/generate_form/add", GenerateFromAdd);

router.get("/authorization_sequence", getAuthorizationSequence);
router.post("/authorization_sequence/add", AuthorizationSequenceAdd);

router.get("/master_subzone", getmasterSubzone);
router.post("/master_subzone/add", MasterSubzone);

router.get('/form_config/service/:serviceId', getFormConfigByService);

router.get('/service/formdata/all', getAllSubmissions);
router.get('/service/formdata/:serviceId', getFormData);

router.post('/service/:serviceId/submit', submitServiceForm);

router.put('/service/submission/:submissionId/status', updateFormStatus);
router.patch('/service/submission/:submissionId/status', updateFormStatus);

router.get('/service_config/certificate/:serviceId', getCertificateData);

router.get('/generate-form/status/:serviceId', getServiceStatus);
router.post('/service/:submissionId/payment', processPayment);

// New Razorpay routes
router.get('/service-config/amount/:serviceId', getServiceConfigAmount);
router.post('/service/create-order', createOrder);
router.post('/service/verify-payment', verifyPayment);



// In admin.routes.js
router.get('/razorpay-key', async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Razorpay key',
      error: error.message
    });
  }
});
export default router;