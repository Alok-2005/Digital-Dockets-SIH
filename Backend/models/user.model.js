import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    
    countryCode: {
        type: String,
        required: [true, "Please Select Country Code"],
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid country code!`
        }
    },
    phone: {
        type: String,
        required: [true, "Please Enter Phone Number"],
        trim: true
    },
    fullPhoneNumber: {
        type: String,
        unique: true,  // Unique constraint on fullPhoneNumber
    },
    role: {
        type: String,
        enum: ["citizen", "admin","auth_1","auth_2"],
        default: "citizen"
    }
});

userSchema.pre("save", async function(next) {
    // Generate fullPhoneNumber by combining countryCode and phone
    if (this.isModified('phone') || this.isModified('countryCode')) {
        this.fullPhoneNumber = `${this.countryCode}${this.phone}`;
    }

    // Hash password if modified
    if (this.isModified("password")) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Remove the extra schema.index() call
// No need for this line anymore:
// userSchema.index({ fullPhoneNumber: 1 }, { unique: true, sparse: true });

userSchema.methods.comparePasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
