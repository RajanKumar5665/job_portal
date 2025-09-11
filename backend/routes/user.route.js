import express from "express";
import { registerUser, loginUser, logoutUser, updateUserProfile, getUserProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticated, getUserProfile);
router.post('/me', isAuthenticated, singleUpload, updateUserProfile);


export default router;

