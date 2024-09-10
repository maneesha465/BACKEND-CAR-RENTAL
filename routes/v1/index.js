import express from 'express';
import userRouter from './userRoute.js'
import adminRouter from './adminRoute.js'
import carRouter from './carRoute.js';
import bookingRouter from './bookingRoute.js';
import reviewRouter from './reviewRoute.js'
import paymentRouter from './paymentRoute.js'

const v1Router = express.Router();

v1Router.use('/user',userRouter)
v1Router.use('/admin',adminRouter)
v1Router.use('/car', carRouter);
v1Router.use('/booking', bookingRouter);
v1Router.use('/review', reviewRouter);
v1Router.use('/payment',paymentRouter);

export default v1Router