import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 30000,
});

/**
 * Fetch sales data with search, filters, sorting, pagination
 */
export const fetchSales = (params) => api.get("/api/sales", { params }).then((r) => r.data);

export default api;
