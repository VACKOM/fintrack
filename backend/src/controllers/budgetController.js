import Budget from "../models/budgetModel.js";

export const createBudget = async (req, res) => {
  try {
    const {
      budgetName,
      category,
      amount,
      frequency,
      nextnextDueDate,
      reminderDaysBefore,
      paymentMethod,
      isRecurring,
      recipient,
      notes,
    } = req.body;

    if (
      !budgetName ||
      !category ||
      amount === undefined ||
      !frequency ||
      !nextnextDueDate
    ) {
      return res.status(404).json({ message: "Provide all details" });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      budgetName,
      category,
      amount,
      frequency,
      nextnextDueDate,
      reminderDaysBefore,
      isRecurring,
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
    budget.nextnextDueDate = req.body.nextnextDueDate || budget.nextnextDueDate;
    budget.reminderDaysBefore =
      req.body.reminderDaysBefore || budget.reminderDaysBefore;
    budget.isRecurring = req.body.isRecurring || budget.isRecurring;
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

export const getBudgetCategorySummary = async (req, res) => {
  try {
    const summary = await Budget.aggregate([
      {
        $match: {
          userId: req.user._id,
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    const totalBudget = summary.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    res.status(200).json({
      message: "Budget category summary found",
      totalBudget,
      categories: summary,
    });
  } catch (error) {
    res.status(500).json({
      message: "System Error",
      error: error.message,
    });
  }
};
export const getUpcomingExpenses = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });

    const today = new Date();
    const upcomingExpenses = budgets
      .map((budget) => {
        const nextDueDate = new Date(budget.nextDueDate);

        const daysLeft = Math.ceil(
          (nextDueDate - today) / (1000 * 60 * 60 * 24)
        );

        return {
          _id: budget._id,
          budgetName: budget.budgetName,
          category: budget.category,
          amount: budget.amount,
          nextDueDate: budget.nextDueDate,
          recipient: budget.recipient,
          paymentMethod: budget.paymentMethod,
          reminderDaysBefore: budget.reminderDaysBefore,
          daysLeft,
        };
      })
      .filter((budget) => {
        return (
          budget.daysLeft >= 0 && budget.daysLeft <= budget.reminderDaysBefore
        );
      });

    res.status(200).json({
      message: "Upcoming expenses found",
      upcomingExpenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "System Error",
      error: error.message,
    });
  }
};
