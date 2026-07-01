import express from "express";
import {
  createAccount,
  getAllAccounts,
} from "../../controllers/accountController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAccount);
router.get("/", protect, getAllAccounts);

export default router;
