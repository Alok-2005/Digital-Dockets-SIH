import mongoose from "mongoose";
const GenerateFromSchema=new mongoose.Schema({
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ServiceList',
        required:true
    },
    status:{
        type:String,
        enum:['ENABLED','DISABLED'],
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }

})
const GenerateForm = mongoose.model('GenerateForm', GenerateFromSchema);
export default GenerateForm