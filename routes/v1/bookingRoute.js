import express from 'express';
import { createBooking, cancelBooking,getUserBookings, getBookingById} from '../../controllers/bookingController.js';
import { authUser } from '../../middlewares/authUser.js';

const router = express.Router();

router.post('/create-booking/:id',authUser, createBooking);

router.put('/cancelbooking/:bookingId', cancelBooking);
router.get('/booking-details/:id', getUserBookings);
router.get('/userbooking-details/:id', authUser,getBookingById);

export default router;
