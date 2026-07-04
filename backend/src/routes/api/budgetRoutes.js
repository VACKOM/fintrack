import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createBudget,
  getAllBudget,
  updateBudget,
} from "../../controllers/budgetController.js";

const router = express.Router();

router.post("/", protect, createBudget);
router.get("/", protect, getAllBudget);
router.put("/:id", protect, updateBudget);

export default router;
