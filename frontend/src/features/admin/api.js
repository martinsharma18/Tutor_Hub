import apiClient from "../../services/apiClient";

export const adminApi = {
  dashboard: () => apiClient.get("/admin/dashboard").then((res) => res.data),
  getSettings: () => apiClient.get("/admin/settings").then((res) => res.data),
  updateSettings: (payload) =>
    apiClient.put("/admin/settings", payload).then((res) => res.data),
  approveTeacher: (teacherProfileId) =>
    apiClient.post(`/admin/teachers/${teacherProfileId}/approve`).then((res) => res.data),
  featureTeacher: (payload) =>
    apiClient.post("/admin/teachers/feature", payload).then((res) => res.data),
};

