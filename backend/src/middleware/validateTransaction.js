export const validateTransaction = (req, res, next) => {
  const { name, amount, type, category, paymentMethod } = req.body;
  // Add your validation checks here.
  if (!name) {
    return res.status(400).json({ message: "Transaction name is required" });
  }

  if (!amount) {
    return res.status(400).json({ message: "Transaction amount is required" });
  }
  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Transaction amount should be greater than 0" });
  }
  if (!category) {
    return res
      .status(400)
      .json({ message: "Transaction category is required" });
  }
  if (!paymentMethod) {
    return res
      .status(400)
      .json({ message: "Transaction payment method is required" });
  }
  if (type !== "income" && type !== "expense") {
    return res
      .status(400)
      .json({ message: "Transaction type must be income or expense" });
  }
  next();
};
