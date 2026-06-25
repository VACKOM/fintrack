import api from "../api/axios";

export const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};
