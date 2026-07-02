import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/api/authRoutes.js";
import transactionRoutes from "./src/routes/api/transactionRoutes.js";
import accountRoutes from "./src/routes/api/accountRoutes.js";
import budgetRoutes from "./src/routes/api/budgetRoutes.js";

import dbConnect from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/budgets", budgetRoutes);

//app.use("/api/auth", authRoutes);

dbConnect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
