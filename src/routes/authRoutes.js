import express from "express";
import { register, login, getMe , logout } from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/me", protect, getMe);
router.post('/logout', protect, logout);

// Admin Only Route (Test)
router.get("/admin-dashboard", protect, authorize("ADMIN"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

export default router;
