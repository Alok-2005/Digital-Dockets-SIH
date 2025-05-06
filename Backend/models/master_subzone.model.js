import mongoose from "mongoose";

const master_subzone_Schema = new mongoose.Schema({
    zoneId: {
        type: String,
        required: true
    },
    SubZoneName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // This should automatically set the current date when the document is created
    }
});


const master_subzone = mongoose.model("master_subzone", master_subzone_Schema);
export default master_subzone;
