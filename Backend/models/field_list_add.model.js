import mongoose from "mongoose";

const FieldListAddSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    options: [
        {
            label: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
      }
})
const FieldList = mongoose.model('FieldList', FieldListAddSchema);
export default FieldList