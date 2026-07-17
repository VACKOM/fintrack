import Transaction from "../models/transactionModel.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, name, amount, paymentMethod, notes, category } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type: type,
      name: name,
      amount: amount,
      paymentMethod: paymentMethod,
      category: category,
      notes: notes,
    });
    res
      .status(200)
      .json({ message: "Transaction successfully created", data: transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const category = req.query.category;
    const query = {
      userId: req.user._id,
    };
    if (category) {
      query.category = category;
    }
    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Transaction Found.", transactions });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};

export const getTransactonsById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    if (!transactionId) {
      return res.status(400).json({ message: "Provide valid details" });
    }
    const transaction = await Transaction.findOne({
      userId: req.user._id,
      _id: transactionId,
    });
    if (transaction.length === 0) {
      return res
        .status(404)
        .json({ message: "Provide a valid transaction ID" });
    }
    res.status(200).json({ message: "Transaction Found", transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const updatedData = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }
    return;
    res.status(200),
      json({ message: "Transaction successfully updated.", transaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    if (!transactionId) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }
    const transaction = await Transaction.findOne({
      userId: req.user._id,
      _id: transactionId,
    });
    if (!transaction) {
      return res.status(400).json({ message: "Invalid Transaction ID." });
    }
    const deletedTransaction = await transaction.deleteOne();
    res.status(200).json({
      message: "Transaction successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "System Error", error: error.message });
  }
};

export const summary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }
      if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      message: "Summary found",
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const summaryByMonth = async (req, res) => {
  try {
    let totalExpense = 0;
    let totalIncome = 0;

    const { month, year } = req.query;
    console.log(month, year);

    if (!month || !year) {
      return res.status(200).json({ message: "Please provide month and year" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lt: endDate },
    });
    if (!transactions) {
      return res.status(400).json({ message: "No transactions found" });
    }
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpense;
    res.status(200).json({
      message: "Monthly Summary Found",
      summary: {
        month,
        year,
        totalExpense,
        totalIncome,
        balance,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};

export const getAllExpenseOnly = async (req, res) => {
  try {
    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
    });

    const expenseByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
