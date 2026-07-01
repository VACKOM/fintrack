import api from "../api/axios.js";

export const getAllAccounts = async () => {
  const response = await api.get("/accounts");
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await api.post("/accounts", accountData);
  return response.data;
};

export const updateAccount = async (updatedData) => {
  const response = await api.put("/accounts", updatedData);
  return response.data;
};
