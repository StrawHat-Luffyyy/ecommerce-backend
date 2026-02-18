import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { registrationSchema, loginSchema } from "../utils/validationSchema.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/register", validate(registrationSchema), register);
router.post("/login", validate(loginSchema), login);

// Protected Routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// Admin Only Route (Test)
router.get("/admin-dashboard", protect, authorize("ADMIN"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

export default router;
