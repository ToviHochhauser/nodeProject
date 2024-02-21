import express from "express";
import {
    getAllUsers,
    registerUser,
    loginUser
} from "../controller/user.js";
import { authForManager } from "../middleWares/auth.js";

const router = express.Router();

// Route to get all users (protected route)
router.get("/", authForManager, getAllUsers);

// Route to register a new user
router.post("/register", registerUser);

// Route to login a user
router.post("/login", loginUser);

export default router;
