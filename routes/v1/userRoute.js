import express from "express";
 import { checkUser, editUser,userCreate, userLogin, userLogout, userProfile } from "../../controllers/userController.js";
 import { authUser } from "../../middlewares/authUser.js";
import { upload } from "../../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post("/signup",upload.single('profilePic'), userCreate);
 router.post("/login", userLogin);
 router.post("/logout",authUser,userLogout);
// router.get("/getuser/:id", authUser, getUserById);
router.get("/profile", authUser, userProfile);
router.get("/check-user", authUser, checkUser);
router.put("/edit-user/:id",upload.single('profilePic'), authUser, editUser);


export default router;