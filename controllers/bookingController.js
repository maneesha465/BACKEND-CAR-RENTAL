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
        });

        console.log('New booking:', newBooking);

        await newBooking.save();

        // Update car availability
        carData.availability = false;
        await carData.save();

        res.status(201).json({ success: true, message: 'Booking created successfully', bookingId: newBooking._id });
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
    