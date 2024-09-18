import express from "express";
import { adminCreate, adminLogin, admingetUserById, admindeleteUser, manageUsers, checkAdmin, getAllUsers, getAllBookings, getUserBookings} from "../../controllers/adminController.js";
import { authAdmin } from "../../middlewares/authAdmin.js";

const router = express.Router();

router.post("/signup", adminCreate);
router.post("/login", adminLogin);
router.get("/check-admin",authAdmin, checkAdmin);
router.get("/data", authAdmin, manageUsers);
router.get("/users/:id",authAdmin,admingetUserById);
router.get("/getallusers",authAdmin, getAllUsers);
router.get("/getallbookings",authAdmin, getAllBookings);
router.delete("/delete/:id",authAdmin,admindeleteUser);
router.get('/booking-details/:id', getUserBookings);


export default router;
