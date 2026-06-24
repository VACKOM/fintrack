import Account from "../models/accountModel.js";

export const createAccount = async (req, res) => {
  try {
    const { accountName, accountNumber, type, balance, notes } = req.body;
    if (!accountName || !type || balance === undefined) {
      return res.status(400).json({ message: "Provide all details" });
    }
    const account = await Account.create({
      userId: req.user._id,
      accountName,
      accountNumber,
      type,
      balance,
      notes,
    });
    res
      .status(201)
      .json({ message: "Account is successfully created", data: account });
  } catch (error) {
    res.status(500).json({ message: "System Error", error: error.message });
  }
};
