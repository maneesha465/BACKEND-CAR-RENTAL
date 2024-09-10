import express from 'express';
import {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    searchCars
} from '../../controllers/carController.js';
import { authAdmin } from '../../middlewares/authAdmin.js';
import { upload } from '../../middlewares/uploadMiddleware.js';
// import { authUser } from '../../middlewares/authUser.js';

const router = express.Router();

router.post('/create',upload.single('image'), authAdmin,createCar);
router.get('/carlist',getAllCars);
router.get('/car-details/:id', getCarById);
router.put('/updatecar/:id',updateCar);
router.delete('/deletecar/:id',authAdmin,deleteCar);
router.get('/search',searchCars);



export default router;
