import express from "express";
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Only Routes (Inventory Management)
router.post("/", protect, authorize("ADMIN"), createProduct);
router.put("/:id", protect, authorize("ADMIN"), updateProduct);
router.delete("/:id", protect, authorize("ADMIN"), deleteProduct);
export default router;
