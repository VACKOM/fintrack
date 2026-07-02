import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createBudget,
  getAllBudget,
} from "../../controllers/budgetController.js";

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getAllBudget);

export default router;
