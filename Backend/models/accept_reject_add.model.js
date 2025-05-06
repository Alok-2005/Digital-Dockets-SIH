// import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
const accept_reject_addSchema = new mongoose.Schema({
    serviceId: {
      type: String,
      required: true,
      unique: true,
    },
    RecId: {  // Changed from recId to RecId to match the database
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    status: {
      type: String,
      enum: ["ACCEPT", "REJECT", "PENDING"],
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    CreatedAt: {
      type: Date,
      default: Date.now,
    }
});

// Create the model
const Accept_reject_add = mongoose.model("Accept_reject_add", accept_reject_addSchema);
export default Accept_reject_add;