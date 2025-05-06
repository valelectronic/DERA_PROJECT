import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    cartItems:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ], 

    role:{
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    }
}, { timestamps: true });


// Middleware to hash password before saving to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
    
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
//compile model after middleware and schema are defined
const User = mongoose.model("User", userSchema);

export default User;

