import mongoose from 'mongoose';
import FieldList from './field_list_add.model.js';

// Define the FieldListEntries schema
const FieldListEntriesSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FieldList',  // Referencing the FieldList model
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Post-save hook to update the FieldList options after an entry is added
FieldListEntriesSchema.post('save', async function(doc) {
    try {
        // Find the corresponding FieldList using the listId from the doc (FieldListEntries)
        const fieldList = await FieldList.findById(doc.listId);

        if (fieldList) {
            // Push the new option (label and value) into the options array
            // Check if the option already exists to avoid duplicates
            const optionExists = fieldList.options.some(
                (option) => option.label === doc.label && option.value === doc.value
            );

            if (!optionExists) {
                fieldList.options.push({ label: doc.label, value: doc.value });
                await fieldList.save();  // Save the updated FieldList document
            }
        }
    } catch (error) {
        console.error('Error while updating FieldList options:', error);
    }
});

// Create and export the FieldListEntries model
const FieldListEntries = mongoose.model('FieldListEntries', FieldListEntriesSchema);
export default FieldListEntries;
