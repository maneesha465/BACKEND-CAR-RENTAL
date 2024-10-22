import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Refers to the User model
        required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',  // Refers to the Car model
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    dropOffDate: {
        type: Date,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled'],
        default: 'booked',
    },
    car_Status: {
         type: String, 
         enum: ['booked', 'received', 'returned'], 
         default: 'booked' 
        },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Booking = mongoose.model('Booking', bookingSchema);


