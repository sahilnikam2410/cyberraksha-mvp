import axios from "axios";

// ✅ Auto picks Vercel ENV in production
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE
});

// ✅ Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("admin_token") || localStorage.getItem("user_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
