import express from 'express';

import { authUser } from '../../middlewares/authUser.js';
import { createCheckoutSession } from '../../controllers/paymentController.js';

const router = express.Router();



router.post('/create-checkout-session',authUser,createCheckoutSession)
export default router;