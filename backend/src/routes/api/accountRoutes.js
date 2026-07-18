import express from "express";
import {
  createAccount,
  getAllAccounts,
} from "../../controllers/accountController.js";
import { protect, authorize } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize, createAccount);
router.get("/", protect, authorize, getAllAccounts);

export default router;
