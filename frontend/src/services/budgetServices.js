import api from "../api/axios.js";

export const createBudget = async (budgetData) => {
  const response = await api.post("/budgets", budgetData);
  return response.data;
};

export const getAllBudgets = async () => {
  const response = await api.get("/budgets");
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await api.put(`/budgets/${id}`, budgetData);
  return response.data;
};

export const getBudgetCategorySummary = async () => {
  const response = await api.get("/budgets/summary/categories");
  return response.data;
};

export const getUpcomingExpenses = async () => {
  const response = await api.get("/budgets/upcoming-expenses");
  return response.data;
};
