import mongoose, { Mongoose } from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
      trim: true,
    },
    budgetName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "Food & Groceries",
        "Transportation",
        "Rent",
        "Utilities",
        "Internet",
        "Healthcare",
        "Education",
        "Entertainment",
        "Travel",
        "Savings",
        "Investments",
        "Insurance",
        "Loan Repayment",
        "Child Care",
        "Household",
        "Beauty & Cosmetics",
        "Tithe",
        "Offering",
        "Miscellaneous",
      ],
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "one - time"],
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    reminderDaysBefore: {
      type: Number,
      default: 7,
    },

    isRecurring: {
      type: Boolean,
      default: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "momo", "card", "others"],
    },
    recipient: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

BudgetSchema.index({ userId: 1, Date: -1 });
const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
