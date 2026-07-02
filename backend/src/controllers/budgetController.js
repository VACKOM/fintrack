import Budget from "../models/budgetModel.js";

export const createBudget = async (req, res) => {
  try {
    const {
      budgetName,
      category,
      amount,
      frequency,
      dueDate,
      paymentMethod,
      recipient,
      notes,
    } = req.body;

    if (
      !budgetName ||
      !category ||
      amount === undefined ||
      !frequency ||
      !dueDate
    ) {
      return res.status(404).json({ message: "Provide all details" });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      budgetName,
      category,
      amount,
      frequency,
      dueDate,
      paymentMethod,
      recipient,
      notes,
    });
    res
      .status(200)
      .json({ message: "Budget is successfully created.", data: budget });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};

export const getAllBudget = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });

    if (budgets.length === 0) {
      return res.status(404).json({ message: "No budget found" });
    }
    res.status(200).json({ message: "Budget Found", budgets });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};
