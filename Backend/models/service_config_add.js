import mongoose from "mongoose";

const ServiceConfigAddSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId, // Reference to ServiceList
    ref: "ServiceList",
    required: true,
  },
  isPaidService: {
    type: Boolean, // True for paid service, false otherwise
    required: true,
  },
  rateOfService: {
    type: Number, // Numeric rate of service
    required: true,
    min: 0,
  },
  customRate: {
    type: Number, // Optional custom rate
    min: 0,
  },
  certificateData: {
    type: String, // Rich text data in HTML/JSON format
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ServiceConfig = mongoose.model("ServiceConfigAdd", ServiceConfigAddSchema);
export default ServiceConfig;
