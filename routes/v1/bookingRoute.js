import express from 'express';
import { createBooking, cancelBooking,getUserBookings, getBookingById, getLatestBooking, updateCarStatus} from '../../controllers/bookingController.js';
import { authUser } from '../../middlewares/authUser.js';

const router = express.Router();

router.post('/create-booking/:id',authUser, createBooking);

router.put('/cancelbooking/:bookingId', cancelBooking);
router.get('/booking-details/:id', getUserBookings);
router.get('/userbooking-details/:id', authUser,getBookingById);
router.get('/latest',getLatestBooking);
router.put('/update-status/:bookingId', updateCarStatus);

export default router;
