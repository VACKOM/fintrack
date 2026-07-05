import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createBudget,
  getAllBudget,
  updateBudget,
  getBudgetCategorySummary,
  getUpcomingExpenses,
} from "../../controllers/budgetController.js";

const router = express.Router();

router.get("/upcoming-expenses", protect, getUpcomingExpenses);
router.get("/summary/categories", protect, getBudgetCategorySummary);
router.post("/", protect, createBudget);
router.get("/", protect, getAllBudget);
router.put("/:id", protect, updateBudget);

export default router;
