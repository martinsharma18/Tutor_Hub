import apiClient from "../../services/apiClient";

export const metadataApi = {
  all: () => apiClient.get("/metadata").then((res) => res.data),
  byCategory: (category) => apiClient.get(`/metadata/${category}`).then((res) => res.data),
};

export const adminLookupsApi = {
  byCategory: (category) => apiClient.get(`/admin/lookups/${category}`).then((res) => res.data),
  create: (payload) => apiClient.post("/admin/lookups", payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/admin/lookups/${id}`, payload).then((res) => res.data),
  remove: (id) => apiClient.delete(`/admin/lookups/${id}`).then((res) => res.data),
};
