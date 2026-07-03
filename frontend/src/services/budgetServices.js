import api from "../api/axios.js";

export const createBudget = async (budgetData) => {
  const response = await api.post("/budgets", budgetData);
  return response.data;
};

export const getAllBudgets = async () => {
  const response = await api.get("/budgets");
  return response.data;
};

export const updateBudget = async (budgetUpdate) => {
  const response = await api.put("/budgets", budgetUpdate);
  return response.data;
};
