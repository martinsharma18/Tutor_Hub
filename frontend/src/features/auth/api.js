import apiClient from "../../services/apiClient";

export const authApi = {
  login: (payload) =>
    apiClient.post("/auth/login", payload).then((res) => res.data),
  registerTeacher: (payload) =>
    apiClient.post("/auth/teacher/register", payload).then((res) => res.data),
  registerParent: (payload) =>
    apiClient.post("/auth/parent/register", payload).then((res) => res.data),
  refresh: (payload) =>
    apiClient.post("/auth/refresh", payload).then((res) => res.data),
  forgotPassword: (payload) =>
    apiClient.post("/auth/forgot-password", payload).then((res) => res.data),
  resetPassword: (payload) =>
    apiClient.post("/auth/reset-password", payload).then((res) => res.data),
  requestEmailVerification: () =>
    apiClient.post("/auth/verify-email/request").then((res) => res.data),
  confirmEmail: (payload) =>
    apiClient.post("/auth/verify-email/confirm", payload).then((res) => res.data),
};

