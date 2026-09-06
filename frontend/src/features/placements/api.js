import apiClient from "../../services/apiClient";

export const placementsApi = {
  getById: (id) => apiClient.get(`/placements/${id}`).then((res) => res.data),

  // parent
  myTuitions: () => apiClient.get("/placements/parent").then((res) => res.data),
  myInvoices: () => apiClient.get("/placements/parent/invoices").then((res) => res.data),

  // teacher
  myAssignments: () => apiClient.get("/placements/teacher").then((res) => res.data),
  myEarnings: () => apiClient.get("/placements/teacher/earnings").then((res) => res.data),
};

export const adminPlacementsApi = {
  list: (params = {}) =>
    apiClient
      .get("/admin/placements", {
        params: { status: params.status, page: params.page ?? 1, pageSize: params.pageSize ?? 25 },
      })
      .then((res) => res.data),
  create: (payload) => apiClient.post("/admin/placements", payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/admin/placements/${id}`, payload).then((res) => res.data),
  pause: (id) => apiClient.post(`/admin/placements/${id}/pause`).then((res) => res.data),
  resume: (id) => apiClient.post(`/admin/placements/${id}/resume`).then((res) => res.data),
  end: (id, payload) => apiClient.post(`/admin/placements/${id}/end`, payload).then((res) => res.data),

  invoices: (params = {}) =>
    apiClient
      .get("/admin/placements/invoices", {
        params: { status: params.status, page: params.page ?? 1, pageSize: params.pageSize ?? 25 },
      })
      .then((res) => res.data),
  generateInvoices: () =>
    apiClient.post("/admin/placements/invoices/generate").then((res) => res.data),
  markInvoicePaid: (invoiceId, referenceNumber) =>
    apiClient
      .post(`/admin/placements/invoices/${invoiceId}/mark-paid`, { referenceNumber })
      .then((res) => res.data),
  payTeacher: (invoiceId) =>
    apiClient.post(`/admin/placements/invoices/${invoiceId}/pay-teacher`).then((res) => res.data),

  feedback: (placementId) =>
    apiClient.get(`/admin/placements/${placementId}/feedback`).then((res) => res.data),
  addFeedback: (placementId, payload) =>
    apiClient.post(`/admin/placements/${placementId}/feedback`, payload).then((res) => res.data),
  atRisk: () => apiClient.get("/admin/placements/at-risk").then((res) => res.data),
};
