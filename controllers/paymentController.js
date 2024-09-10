

import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = async (req, res) => {
    try {
        const { user, car, pickupDate, dropOffDate, totalCost } = req.body;

        // Check if car exists
        const selectedCar = await Car.findById(car);
        if (!selectedCar) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }

        // Create new booking
        const newBooking = new Booking({
            user,
            car,
            pickupDate,
            dropOffDate,
            totalCost
        });

        await newBooking.save();

        // Create payment session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${selectedCar.make} ${selectedCar.model}`,
                    },
                    unit_amount: totalCost * 100, // Stripe works in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_DOMAIN}/payment-success`,
            cancel_url: `${process.env.CLIENT_DOMAIN}/cancel-payment`,
        });

        return res.status(200).json({
            success: true,
            message: "Booking created and payment session initiated",
            sessionId: session.id,
            bookingId: newBooking._id,
            transactionId: session.payment_intent, // Optional: based on your use case
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Booking creation failed" });
    }
};
