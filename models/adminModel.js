import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
        role: {
            type: String,
            default: "admin", // Ensure this is set to distinguish from regular users
        },
    },
    { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
