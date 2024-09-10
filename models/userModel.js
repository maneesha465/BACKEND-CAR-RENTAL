import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        mobile: {
            type: Number,
            required: true,
        },
        profilePic: {
            type: String,
            default: "default-car-image-url",
        },

        
        role: {
            type: String, 
            enum: ['user', 'admin'], // Enum to validate role values
            default: 'user', // Default role for regular users
        },

    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);