
import express from 'express';
import { createReview, getReviewsByCar } from '../../controllers/reviewController.js';
import { authUser } from '../../middlewares/authUser.js';

const router = express.Router();

router.post('/reviews',authUser, createReview);
router.get('/reviews/:id', getReviewsByCar);

export default router;
