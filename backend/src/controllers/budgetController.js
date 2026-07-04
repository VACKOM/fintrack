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

export const updateBudget = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const budget = await Budget.findOne({
      userId: req.user._id,
      _id: budgetId,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget Id is invalid" });
    }
    budget.budgetName = req.body.budgetName || budget.budgetName;
    if (req.body.amount !== undefined) budget.amount = req.body.amount;
    budget.category = req.body.category || budget.category;
    budget.frequency = req.body.frequency || budget.frequency;
    budget.dueDate = req.body.dueDate || budget.dueDate;
    budget.paymentMethod = req.body.paymentMethod || budget.paymentMethod;
    budget.recipient = req.body.recipient || budget.recipient;
    budget.notes = req.body.notes || budget.notes;

    const updatedBudget = await budget.save();
    res.status(200).json({ message: "Budget successfully updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};
