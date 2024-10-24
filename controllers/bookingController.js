import {Booking} from '../models/bookingModel.js';
import {Car} from '../models/carModel.js';
import { User } from '../models/userModel.js';


import { isValidObjectId } from 'mongoose';
export const createBooking = async (req, res, next) => {
    try {
        const { user, car, pickupDate, dropOffDate } = req.body;

        console.log('Received booking data:', { user, car, pickupDate, dropOffDate });

        // Validate the dates
        if (!pickupDate || !dropOffDate) {
            return res.status(400).json({ success: false, message: 'Pickup and drop-off dates are required' });
        }

        if (new Date(pickupDate) >= new Date(dropOffDate)) {
            return res.status(400).json({ success: false, message: 'Pickup date must be before drop-off date' });
        }

        // Check if car and user IDs are valid
        if (!isValidObjectId(car)) {
            return res.status(400).json({ success: false, message: 'Invalid car ID' });
        }

        if (!isValidObjectId(user)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        // Check if car exists
        const carData = await Car.findById(car);
        console.log('Car data:', carData);

        if (!carData) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        // Check if user exists
        const userData = await User.findById(user);
        console.log('User data:', userData);

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check car availability
        if (!carData.availability) {
            return res.status(400).json({ success: false, message: 'Car is not available' });
        }

        // Calculate total cost
        const days = (new Date(dropOffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24);
        const totalCost = days * carData.pricePerDay;

        // Create a new booking
        const newBooking = new Booking({
            user,
            car,
            pickupDate,
            dropOffDate,
            totalCost,
            status: 'booked' // Add status field
        });

        console.log('New booking:', newBooking);

        // Save the booking
        const savedBooking = await newBooking.save();

        // Update car availability
        carData.availability = false;
        await carData.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: savedBooking // Return the complete booking data
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ success: false, message: 'Failed to create booking', error }); // Pass error to global error handler
    }
};


export const cancelBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

// Update car availability
const carData = await Car.findById(booking.car);
if (carData) {
    carData.availability = true;
    await carData.save();
}


        res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        next(error);
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
    


// backend/controller/bookingController.js
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the booking ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid booking ID' });
        }

        // Fetch booking by ID
        const booking = await Booking.findById(id).populate('user').populate('car');
        
        // Check if booking exists
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Booking details retrieved successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch booking', error });
    }
};




 // Adjust path as needed

export const getLatestBooking = async (req, res) => {
  try {
    // Fetch the most recent booking
    const latestBooking = await Booking.findOne().sort({ createdAt: -1 }); // Sort by createdAt in descending order to get the latest booking
    
    if (!latestBooking) {
      return res.status(404).json({ success: false, message: 'No bookings found' });
    }

    res.status(200).json({ success: true, data: latestBooking });
  } catch (error) {
    console.error('Error fetching latest booking:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch latest booking', error });
  }
};




// backend/controller/bookingController.js

export const updateCarStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { car_Status } = req.body; // Ensure car_Status is included in the request body

        // Log incoming data for debugging
        console.log('Update Request:', { bookingId, car_Status });

        // Validate car_Status
        const validStatuses = ['booked', 'received', 'returned'];
        if (!validStatuses.includes(car_Status)) {
            return res.status(400).json({ success: false, message: 'Invalid car status' });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.car_Status = car_Status; // Update the car_Status field

        await booking.save(); // Make sure to save the updated booking

        res.status(200).json({
            success: true,
            message: 'Car status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Error updating car status:', error);
        res.status(500).json({ success: false, message: 'Failed to update car status', error });
    }
};


