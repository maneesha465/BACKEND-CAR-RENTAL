import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";


import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

export const userCreate = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
     
        // Check if all required fields are present
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Initialize default profile picture URL
        let profilePic = "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
        
        // Handle file upload if present
        if (req.file) {
            try {
                const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
                console.log(uploadResult); // Log upload result for debugging

                if (uploadResult?.url) {
                    profilePic = uploadResult.url;
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to upload image" });
            }
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const salt = 10;
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create a new user document
        const newUser = new User({ name, email, password: hashedPassword, mobile, profilePic });

        // Save the new user to the database
        await newUser.save();

        // Generate a token for the new user
        const token = generateToken(email);

        // Set token in cookies
        res.cookie("token", token, {
            sameSite: "None",
            secure: true,
            httpOnly: true,
        });

        // Respond with success message
        res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "all fields required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ success: false, message: "user does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "user not authenticated" });
        }

        const token = generateToken(email, userExist.role, userExist._id.toString());

        res.cookie("token", token, {
            sameSite: "None",
            secure: true,
            httpOnly: true,
        });

        res.json({ success: true, message: "user login successfully", userId: userExist._id  });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};
export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            sameSite: "None",
            secure: true,
            httpOnly: true,
        });

        res.json({ success: true, message: "user logout successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const user = req.user;

        const useData = await User.findOne({ email: user.email }).select("-password");
        // const useData = await User.findById(id).select("-password");

        res.json({ success: true, message: "user data fetched", data: useData });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const checkUser = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(400).json({ success: true, message: "user not authenticated" });
        }
        res.json({ success: true, message: "User authenticated" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const editUser = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL parameter
        const { name, email, mobile, password } = req.body;

        // Initialize the update object
        const updateData = {};

        // Check and set fields for update
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;

        // Handle password update if provided
        if (password) {
            const salt = 10;
            updateData.password = bcrypt.hashSync(password, salt);
        }

        // Handle profile picture upload if present
        if (req.file) {
            try {
                const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
                if (uploadResult?.url) {
                    updateData.profilePic = uploadResult.url;
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Failed to upload image" });
            }
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};


 