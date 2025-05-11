import Accept_reject_add from "../models/accept_reject_add.model.js";
import { v4 as uuidv4 } from 'uuid';
import ServiceList from "../models/service_list.model.js";
import ServiceConfig from "../models/service_config_add.js";
import FieldList from "../models/field_list_add.model.js";
import FieldListEntries from "../models/field_list_entries.model.js";
import FormConfig from "../models/Form_Config.model.js";
import GenerateForm from "../models/generate_form.model.js";
import authorization_sequence_add from "../models/authorization_sequence_add.model.js";
import User from "../models/user.model.js";
import master_subzone from "../models/master_subzone.model.js";
import ServiceFormSubmission from "../models/service_form_submission.model.js";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, users });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

// Add this to your existing exports
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ServiceFormSubmission.find()
      .sort({ submittedAt: -1 })
      .populate({
        path: 'service',
        select: 'name'
      })
      .lean();

    const formattedSubmissions = submissions.map(submission => ({
      _id: submission._id,
      service: submission.service?.name ?? 'Unknown Service',
      formData: submission.formData, // Make sure this includes the category
      status: submission.status,
      submittedAt: submission.submittedAt,
      processedBy: submission.processedBy
    }));

    res.status(200).json({
      success: true,
      submissions: formattedSubmissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

export const getAcceptReject = async (req, res) => {
  try {
    const acceptReject = await Accept_reject_add.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, acceptReject });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const AcceptRejectAdd = async (req, res) => {
  try {
    const { serviceId, RecId, status, remark } = req.body;

    if (!serviceId || !status || !remark) {
      return res.status(400).json({
        status: false,
        message: "serviceId, status, and remark are required",
      });
    }

    const newAcceptReject = new Accept_reject_add({
      serviceId,
      RecId,
      status,
      remark,
    });

    const savedDocument = await newAcceptReject.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getServiceListAdd = async (req, res) => {
  try {
    const serviceList = await ServiceList.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      serviceList: serviceList
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const ServiceListAdd = async (req, res) => {
  try {
    const { name, tableName, timeLimit } = req.body;
    const newServiceList = new ServiceList({
      name,
      tableName,
      timeLimit,
    });

    const savedDocument = await newServiceList.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getServiceConfig = async (req, res) => {
  try {
    const configs = await ServiceConfig.find()
      .populate('service', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      data: configs
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

// New endpoint to fetch payment amount
export const getServiceConfigAmount = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const serviceConfig = await ServiceConfig.findOne({ service: serviceId });
    if (!serviceConfig) {
      return res.status(404).json({
        success: false,
        message: 'Service configuration not found'
      });
    }

    if (!serviceConfig.isPaidService) {
      return res.status(400).json({
        success: false,
        message: 'This service does not require payment'
      });
    }

    const amount = serviceConfig.customRate || serviceConfig.rateOfService;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount configured for this service'
      });
    }

    res.status(200).json({
      success: true,
      amount
    });
  } catch (error) {
    console.error('Error fetching service config amount:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment amount',
      error: error.message
    });
  }
};

export const ServiceConfigAdd = async (req, res) => {
  try {
    const { service, isPaidService, rateOfService, customRate, certificateData } = req.body;
    const newServiceConfig = new ServiceConfig({
      service,
      isPaidService,
      rateOfService,
      customRate,
      certificateData,
    });

    const savedDocument = await newServiceConfig.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getFieldList = async (req, res) => {
  try {
    const fieldList = await FieldList.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      fieldList: fieldList
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const FieldListAdd = async (req, res) => {
  try {
    const { name } = req.body;
    const newFieldListAdd = new FieldList({
      name,
    });

    const savedDocument = await newFieldListAdd.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getFieldListEntries = async (req, res) => {
  try {
    const fieldListEntries = await FieldListEntries.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      fieldListEntries: fieldListEntries
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const FieldListEntriesAdd = async (req, res) => {
  try {
    const { listId, value, label } = req.body;
    const newFieldListEntriesAdd = new FieldListEntries({
      listId,
      value,
      label,
    });

    const savedDocument = await newFieldListEntriesAdd.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getFormConfig = async (req, res) => {
  try {
    const formConfig = await FormConfig.find()
      .populate('service', 'name')
      .populate('fieldListId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      formConfig: formConfig
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const FieldType = async (req, res) => {
  try {
    const fieldTypes = [
      { value: 'INPUT-TEXT', label: 'Input Text' },
      { value: 'INPUT-EMAIL', label: 'Input Email' },
      { value: 'INPUT-NUMBER', label: 'Input Number' },
      { value: 'DATE', label: 'Date' },
      { value: 'TIME', label: 'Time' },
      { value: 'SELECT', label: 'Select' },
      { value: 'CHECKBOX', label: 'Checkbox' },
      { value: 'RADIO', label: 'Radio' },
      { value: 'TEXTAREA', label: 'Textarea' },
      { value: 'UPLOAD', label: 'Upload' },
    ];
    res.status(200).json({ status: true, fieldTypes: fieldTypes });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to fetch field types', error: error.message });
  }
};

export const FormConfigAdd = async (req, res) => {
  try {
    const { service, fieldName, fieldType, nameOfLabel, maxField, minField, required, fieldListId, helpBlock, extra, position } = req.body;
    const newFormConfigAdd = new FormConfig({
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

    const savedDocument = await newFormConfigAdd.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getGenerateForm = async (req, res) => {
  try {
    const generateForm = await GenerateForm.find().
      populate('service', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      generateForm: generateForm
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const GenerateFromAdd = async (req, res) => {
  try {
    const { service, status } = req.body;
    const newFormAdd = new GenerateForm({
      service,
      status,
    });

    const savedDocument = await newFormAdd.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getAuthorizationSequence = async (req, res) => {
  try {
    const authorizationSequence = await authorization_sequence_add.find().
      populate('userId', 'role')
      .populate('service', 'name')
      .populate('subzones', 'SubZoneName')
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      authorizationSequence: authorizationSequence
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const AuthorizationSequenceAdd = async (req, res) => {
  try {
    const { service, userId, partOfService, stage, subzones, supervisorOf, canTakePayment, canReject } = req.body;
    const newAuthorizationSequenceAdd = new authorization_sequence_add({
      service,
      userId,
      partOfService,
      stage,
      subzones,
      supervisorOf,
      canTakePayment,
      canReject,
    });

    const savedDocument = await newAuthorizationSequenceAdd.save();

    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getmasterSubzone = async (req, res) => {
  try {
    const subzones = await master_subzone.find({}, 'zoneId SubZoneName createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      subzones: subzones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subzones',
      error,
    });
  }
};

export const MasterSubzone = async (req, res) => {
  try {
    const { zoneId, SubZoneName } = req.body;
    const newMasterSubzone = new master_subzone({
      zoneId,
      SubZoneName,
    });
    const savedDocument = await newMasterSubzone.save();
    return res.status(200).json({
      status: true,
      message: "Added Successfully",
      data: savedDocument,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getFormConfigByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const formConfig = await FormConfig.find({ service: serviceId })
      .populate({
        path: 'fieldListId',
        select: 'name options'
      })
      .sort('position')
      .lean();

    if (!formConfig || formConfig.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Form configuration not found for this service'
      });
    }

    res.status(200).json({
      success: true,
      data: formConfig
    });
  } catch (error) {
    console.error('Error fetching form configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form configuration',
      error: error.message
    });
  }
};

export const getFormData = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const submissions = await ServiceFormSubmission.find({ service: serviceId });

    if (submissions.length === 0) {
      return res.status(404).json({ success: false, message: 'No submissions found for this service' });
    }

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching submissions', error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
}).any();

export const submitServiceForm = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userID;

    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { serviceId } = req.params;
    const formData = { ...req.body };

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filename = encodeURIComponent(file.filename);
        formData[file.fieldname] = `https://digital-dockets-sih-2.onrender.com/Uploads/${filename}`;
      });
    }

    const submission = new ServiceFormSubmission({
      service: serviceId,
      formData,
      submittedBy: userId,
      submittedAt: new Date(),
      status: 'auth_1',
      paymentStatus: 'pending'
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: submission
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

// Updated endpoint to create Razorpay order
export const createOrder = async (req, res) => {
  try {
    // Verify environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured');
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('JWT secret not configured');
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected');
    }

    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    const userId = decoded.userID;

    const { amount, currency, submissionId } = req.body;

    // Validate submissionId
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID'
      });
    }

    // Validate amount
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount provided'
      });
    }

    // Convert to paise and ensure minimum amount
    const amountInPaise = Math.round(parsedAmount * 100); // Convert rupees to paise
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1 (100 paise)'
      });
    }

    // Verify submission
    const submission = await ServiceFormSubmission.findById(submissionId);
    if (!submission || submission.submittedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to create order for this submission'
      });
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: `receipt_${submissionId}`,
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating order:', {
      message: error.message,
      stack: error.stack,
      razorpayError: error.statusCode ? error : null,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: {
        message: error.message,
        statusCode: error.statusCode || 500,
        details: error.statusCode ? error.error : error.message
      }
    });
  }
};

// New endpoint to verify payment
export const verifyPayment = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userID;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, submissionId } = req.body;

    const submission = await ServiceFormSubmission.findById(submissionId);
    if (!submission || submission.submittedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to verify payment for this submission'
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      submission.paymentStatus = 'success';
      submission.status = 'auth_1';
      await submission.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: submission
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

export const processPayment = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userID;

    const user = await User.findById(userId);
    if (!user || !['auth_1', 'auth_2'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can manually process payments'
      });
    }

    const { submissionId } = req.params;
    const { paymentStatus } = req.body;

    console.log(`Processing payment for submissionId: ${submissionId}`);

    const submission = await ServiceFormSubmission.findById(submissionId);
    if (!submission) {
      console.error(`Submission not found for submissionId: ${submissionId}`);
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.paymentStatus = paymentStatus;
    if (paymentStatus === 'success') {
      submission.status = 'auth_1';
    }

    await submission.save();

    res.status(200).json({ success: true, message: 'Payment status updated', data: submission });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
  }
};

export const updateFormStatus = async (req, res) => {
  try {
    const { submissionId, newStatus, userId, userRole, remark } = req.body;

    if (!submissionId || !newStatus || !userId || !userRole) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID format" });
    }

    const submission = await ServiceFormSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    submission.status = newStatus;
    submission.processedBy.push({
      user: userId,
      role: userRole,
      action: `Status updated to ${newStatus}`,
      remark: remark || "No remark provided",
      processedAt: Date.now()
    });

    await submission.save();

    res.status(200).json({ success: true, message: "Status updated successfully", submission });
  } catch (error) {
    console.error("Error updating submission status:", error);
    const errorMessage = error.name === 'ValidationError'
      ? "Validation error"
      : "Error updating status";

    res.status(500).json({ success: false, message: errorMessage, error: error.message });
  }
};

export const getServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const generateForm = await GenerateForm.findOne({
      service: serviceId
    }).exec();

    if (!generateForm) {
      return res.json({
        success: false,
        message: 'Service not found in generate forms',
        status: 'DISABLED'
      });
    }

    return res.json({
      success: true,
      status: generateForm.status,
      message: `Service is ${generateForm.status}`
    });
  } catch (error) {
    console.error('Error checking service status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking service status',
      error: error.message
    });
  }
};

export const getCertificateData = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const serviceConfig = await ServiceConfig.findOne({ service: serviceId })
      .populate('service', 'name')
      .select('certificateData');

    if (!serviceConfig) {
      return res.status(404).json({
        success: false,
        message: 'Certificate template not found for this service'
      });
    }

    res.status(200).json({
      success: true,
      certificateData: serviceConfig.certificateData
    });
  } catch (error) {
    console.error('Error fetching certificate data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificate data',
      error: error.message
    });
  }
};