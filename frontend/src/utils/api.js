import axios from "axios";
import { getToken } from "./auth";

export const API_BASE = "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("admin_token") || localStorage.getItem("user_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
