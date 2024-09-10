
import express from 'express';
import { createReview, getReviewsByCar } from '../../controllers/reviewController.js';

const router = express.Router();

router.post('/reviews', createReview);
router.get('/car/:carId', getReviewsByCar);

export default router;
