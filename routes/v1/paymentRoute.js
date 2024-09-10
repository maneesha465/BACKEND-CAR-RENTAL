import express from 'express';

import { authUser } from '../../middlewares/authUser.js';
import { createBooking } from '../../controllers/paymentController.js';

const router = express.Router();



router.post('/create-checkout-session',authUser,createBooking)
export default router;