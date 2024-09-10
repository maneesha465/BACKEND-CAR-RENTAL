import Review from '../models/reviewModel.js';
import { Car } from '../models/carModel.js';
import { User } from '../models/userModel.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { userId, carId, rating, comment } = req.body;

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Create a new review
    const review = new Review({
      user: userId,
      car: carId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a car
export const getReviewsByCar = async (req, res) => {
  try {
    const { carId } = req.params;

    // Get reviews for the car
    const reviews = await Review.find({ car: carId }).populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews by user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get reviews by the user
    const reviews = await Review.find({ user: userId }).populate('car', 'make model');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Delete the review
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
