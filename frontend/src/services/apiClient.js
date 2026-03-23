import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5083/api",
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  const expiresAt = state.auth.expiresAtUtc;

  // Check if token is expired
  if (token && expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (expiryDate < new Date()) {
      // Token expired, but don't logout here - let the response interceptor handle 401
      // We could add refresh token logic here if needed
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        baseURL: apiClient.defaults.baseURL,
        url: error.config?.url,
      });
    }
    
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;

