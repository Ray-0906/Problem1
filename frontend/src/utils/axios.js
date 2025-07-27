// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, // Send cookies if using auth sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or use cookies/storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
