import mongoose from "mongoose";

const ServiceListSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
tableName:{
    type:String,
    required: true
},
timeLimit:{
    type:Number,
    required: true
},
CreatedAt: {
    type: Date,
    default: Date.now,
  }
})
const ServiceList = mongoose.model('ServiceList', ServiceListSchema);
export default ServiceList