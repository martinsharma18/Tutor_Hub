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
  getTeacherDetails: (teacherProfileId) =>
    apiClient.get(`/admin/teachers/${teacherProfileId}`).then((res) => res.data),
  getTeachers: () => apiClient.get("/admin/teachers").then((res) => res.data),
  getUsers: () => apiClient.get("/admin/users").then((res) => res.data),
  updateUserStatus: (userId, isActive) =>
    apiClient.patch(`/admin/users/${userId}/status`, isActive, { headers: { "Content-Type": "application/json" } }).then((res) => res.data),
  updateUserRole: (userId, role) =>
    apiClient.patch(`/admin/users/${userId}/role`, JSON.stringify(role), { headers: { "Content-Type": "application/json" } }).then((res) => res.data),
  removeTeacher: (teacherProfileId) =>
    apiClient.delete(`/admin/teachers/${teacherProfileId}`).then((res) => res.data),
  getApplications: () => apiClient.get("/admin/applications").then((res) => res.data),
  // Was pointed at /admin/applications/{id}/verify-payment, a route that never existed on the
  // backend (silent 404) — the real endpoint lives on ApplicationsController.
  verifyPayment: (applicationId) =>
    apiClient.post(`/applications/${applicationId}/verify-payment`).then((res) => res.data),
  auditLog: (params = {}) =>
    apiClient
      .get("/admin/audit-log", { params: { page: params.page ?? 1, pageSize: params.pageSize ?? 25 } })
      .then((res) => res.data),
};

