import apiClient from "../../services/apiClient";

export const authApi = {
  login: (payload) =>
    apiClient.post("/auth/login", payload).then((res) => res.data),
  registerParent: (payload) =>
    apiClient.post("/auth/parent/register", payload).then((res) => res.data),
  registerTeacher: (payload) =>
    apiClient.post("/auth/teacher/register", payload).then((res) => res.data),
};

