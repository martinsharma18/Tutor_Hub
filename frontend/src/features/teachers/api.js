import apiClient from "../../services/apiClient";

export const teacherApi = {
  me: () => apiClient.get("/teachers/me").then((res) => res.data),
  updateProfile: (payload) =>
    apiClient.put("/teachers/me", payload).then((res) => res.data),
  applyToPost: (payload) =>
    apiClient.post("/teachers/applications", payload).then((res) => res.data),
  myApplications: () => apiClient.get("/teachers/applications").then((res) => res.data),
  openPosts: (params = {}) =>
    apiClient
      .get("/tuition-posts/open", {
        params: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
      })
      .then((res) => res.data.items),
};

