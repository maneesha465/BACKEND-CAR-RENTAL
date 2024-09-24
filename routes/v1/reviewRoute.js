
import express from 'express';
import { createReview, deleteReview, getReviewsByCar, getReviewsByUser } from '../../controllers/reviewController.js';
import { authUser } from '../../middlewares/authUser.js';

const router = express.Router();

router.post('/reviews',authUser, createReview);
router.get('/reviews/:id', getReviewsByCar);
router.get('/reviewbyuser/:id', getReviewsByUser);
router.delete('/review/:id', deleteReview);

export default router;
