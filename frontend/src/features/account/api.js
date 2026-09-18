import apiClient from "../../services/apiClient";

export const accountApi = {
  exportData: () => apiClient.get("/account/export").then((res) => res.data),
  deleteAccount: () => apiClient.delete("/account").then((res) => res.data),
};
