import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createBudget,
  getAllBudget,
  updateBudget,
  getBudgetCategorySummary,
} from "../../controllers/budgetController.js";

const router = express.Router();

router.get("/summary/categories", protect, getBudgetCategorySummary);
router.post("/", protect, createBudget);
router.get("/", protect, getAllBudget);
router.put("/:id", protect, updateBudget);

export default router;
