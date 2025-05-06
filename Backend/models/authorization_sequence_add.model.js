import mongoose from "mongoose";

// const VALID_SUBZONES = [
//     'Alipur',
//     'Civil Lines',
//     'Defence Colony',
//     'Chanakyapuri',
//     'Delhi Cantonment',
//     'Dwarka',
//     'Hauz Khas',
//     'Karawal Nagar',
//     'Karol Bagh',
//     'Kotwali'
// ];

const authorization_sequence_addSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceList',
        required: [true, 'Service field is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    partOfService: {
        type: Boolean,  // Changed from Boolean to String as per form
        required: [true, 'Part of service is required'],
    },
    stage: {
        type: Number,
        required: [true, 'Stage is required'],
    },
    // subzones: {
    //     type: [{
    //         type: String,
    //         enum: {
    //             values: VALID_SUBZONES,
    //             message: '{VALUE} is not a valid subzone'
    //         }
    //     }],
    //     required: [true, 'At least one subzone is required'],
    //     validate: {
    //         validator: function(array) {
    //             return array && array.length > 0;
    //         },
    //         message: 'At least one subzone must be selected'
    //     }
    // },
    subzones:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'master_subzone',  
        required: [true, 'Subzone is required'],
    }],
    supervisorOf: {
        type: String,
        required: [true, 'Supervisor information is required'],
        trim: true
    },
    canTakePayment: {
        type: Boolean,
        required: [true, 'Payment permission must be specified'],
        default: false
    },
    canReject: {
        type: Boolean,
        required: [true, 'Rejection permission must be specified'],
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Add indexes for better query performance
authorization_sequence_addSchema.index({ service: 1, userId: 1 });
authorization_sequence_addSchema.index({ subzones: 1 });

const authorization_sequence_add = mongoose.model('authorization_sequence_add', authorization_sequence_addSchema);

export default authorization_sequence_add;