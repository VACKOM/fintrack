import api from "../api/axios.js";

export const getDashboardSummary = async () => {
  const response = await api.get("transactions/summary");
  return response.data;
};
