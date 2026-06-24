import express from "express";
import { createAccount } from "../../controllers/accountController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAccount);

export default router;
