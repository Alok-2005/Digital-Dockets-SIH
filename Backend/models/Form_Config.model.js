import mongoose from "mongoose";

const FormConfigSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceList',
        required: true
    },
    fieldName: {
        type: String,
        required: true
    },
    // fieldType: {
    //     type: String,
    //     required: true
    // },
    fieldType: {
        type: String,
        required: true,
        enum: [
            'INPUT-TEXT',
            'INPUT-EMAIL',
            'INPUT-NUMBER',
            'DATE',
            'TIME',
            'SELECT',
            'CHECKBOX',
            'RADIO',
            'TEXTAREA',
            'UPLOAD'
        ]
    },
    nameOfLabel: {
        type: String,
        required: true
    },
    maxField: {
        type: Number
    },
    minField: {
        type: Number
    },
    required: {
        type: Boolean,
        default: false
    },
    fieldListId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'FieldList'
    },
    helpBlock: {
        type: String
    },
    extra: {
        type: String
    },
    position: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const FormConfig = mongoose.model('FormField', FormConfigSchema);
export default FormConfig

