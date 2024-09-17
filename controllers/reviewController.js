import { Car } from '../models/carModel.js';
import { Review } from '../models/reviewModel.js';
import { User } from '../models/userModel.js';

/// Create a new review
export const createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    // Input validation
    if (!carId) {
      return res.status(400).json({ success: false, message: "carId is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Check if user has already reviewed the car
    const existingReview = await Review.findOne({ user: req.user.userId, car: carId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this car" });
    }

    // Create new review
    const newReview = new Review({
      user: req.user.userId,  // Assuming user ID is attached via middleware
      car: carId,
      rating,
      comment
    });

    // Save the review
    await newReview.save();

    // Optionally populate the review with user and car details for the response
    const populatedReview = await Review.findById(newReview._id)
      .populate('user', 'name')   // Assuming the user has a `name` field
      .populate('car', 'make model');  // Assuming the car has `make` and `model` fields

    return res.status(201).json({ 
      success: true, 
      message: "Review created successfully",
      data: populatedReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Get reviews for a specific car
export const getReviewsByCar = async (req, res) => {
  try {
    const { carId } = req.params;

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Get reviews for the car, populate user data (name only)
    const reviews = await Review.find({ car: carId }).populate('user', 'name');

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews by a specific user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get reviews by the user, populate car details (make and model only)
    const reviews = await Review.find({ user: userId }).populate('car', 'make model');

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review and remove it from the car's reviews array
    await Review.findByIdAndDelete(reviewId);
    await Car.findByIdAndUpdate(review.car, { $pull: { reviews: reviewId } });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
