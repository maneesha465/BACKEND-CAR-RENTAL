import bcrypt from "bcrypt";
import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import { Booking } from "../models/bookingModel.js";

// import { generateToken } from "../utils/generateToken.js";

export const adminCreate = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const adminExist = await Admin.findOne({ email });
        if (adminExist) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        const salt = 10;
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        const token = generateToken(email, "admin");
        
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "Admin created successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const adminExist = await Admin.findOne({ email });
        if (!adminExist) {
            return res.status(404).json({ success: false, message: "Admin does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, adminExist.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = generateToken(email, "admin");
        const cookieOptions = {
            sameSite: 'None',
            secure: true,
            httpOnly: true,
        };
         res.cookie('token',token,cookieOptions)
        // res.cookie("token", token);
        res.json({ success: true, message: "Admin logged in successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

// checkAdmin.js

export const checkAdmin = async (req, res, next) => {
    try {
        const admin = req.admin;

        // Check if the user is authenticated
        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not authenticated" });
        }

        // Check if the authenticated admin has the 'admin' role
        if (admin.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }

        // If everything is okay, return a success response
        return res.status(200).json({ success: true, message: "user is an admin" });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error in checkAdmin:", error);

        // Return a more detailed error response
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};



export const manageUsers = async (req, res) => {
    try {
        // Example: Fetch all users for admin view
        const users = await User.find().select("-password");
        res.json({ success: true, message: "Fetched all users", data: users });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

// Get a specific user by ID
export const admingetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User fetched successfully", data: user });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

// // Update user details
// export const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         if (updates.password) {
//             const salt = 10;
//             updates.password = bcrypt.hashSync(updates.password, salt);
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
//         res.json({ success: true, message: "User updated successfully", data: updatedUser });
//     } catch (error) {
//         res.status(error.status || 500).json({ message: error.message || "Internal server error" });
//     }
// };

// Delete a user

export const admindeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Invalidate user session or token here if applicable
        
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find().select('-password'); // Exclude password field for security
  
      // If no users are found, return a message
      if (!users.length) {
        return res.status(404).json({ success: false, message: 'No users found' });
      }
  
      // Return the list of users
      res.status(200).json({ success: true, users });
  
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching users:', error);
  
      // Return a server error response
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  export const getAllBookings = async (req, res) => {
    try {
      // Fetch all bookings from the database
      const bookings = await Booking.find().populate('user car'); // Populate references if necessary
  
      // If no bookings are found, return a message
      if (!bookings.length) {
        return res.status(404).json({ success: false, message: 'No bookings found' });
      }
  
      // Return the list of bookings
      res.status(200).json({ success: true, bookings });
  
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching bookings:', error);
  
      // Return a server error response
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };




  export const getUserBookings = async (req, res) => {
    try {
      const userId = req.params.id; // Fetch userId from params
      const bookings = await Booking.find({ user: userId }).populate('car'); // Query bookings by userId
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ success: false, message: "No bookings found for this user" });
      }
  
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  };