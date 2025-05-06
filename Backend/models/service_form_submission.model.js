import mongoose from 'mongoose';

const serviceFormSubmissionSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceList',
    required: true
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['auth_1', 'auth_2', 'rejected', 'done'],
    default: 'auth_1'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  processedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    action: String,
    remark: String,
    processedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // New field for payment details
  paymentDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['created', 'completed', 'failed'],
      default: 'created'
    },
    paidAt: Date
  }
});

const ServiceFormSubmission = mongoose.model('ServiceFormSubmission', serviceFormSubmissionSchema);

export default ServiceFormSubmission;