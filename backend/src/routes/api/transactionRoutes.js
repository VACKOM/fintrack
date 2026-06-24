import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactonsById,
  updateTransaction,
  deleteTransaction,
  summary,
  summaryByMonth,
} from "../../controllers/transactionController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTransaction);
router.get("/", protect, getAllTransactions);

router.get("/summary", protect, summary);
router.get("/summary/month", protect, summaryByMonth);

router.get("/:id", protect, getTransactonsById);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;
