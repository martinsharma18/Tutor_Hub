import apiClient from "../../services/apiClient";

export const postsApi = {
  create: (payload) =>
    apiClient.post("/tuition-posts", payload).then((res) => res.data),
  myPosts: (params = {}) =>
    apiClient
      .get("/tuition-posts/me", {
        params: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
      })
      .then((res) => res.data),
  openPosts: (params = {}) =>
    apiClient
      .get("/tuition-posts/open", {
        params: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
      })
      .then((res) => res.data),
  pendingPosts: (params = {}) =>
    apiClient
      .get("/tuition-posts/pending", {
        params: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
      })
      .then((res) => res.data),
  allPosts: (params = {}) =>
    apiClient
      .get("/tuition-posts/all", {
        params: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
      })
      .then((res) => res.data),
  approve: (postId) =>
    apiClient.post(`/tuition-posts/${postId}/approve`).then((res) => res.data),
  updateStatus: (postId, status) =>
    apiClient
      .patch(`/tuition-posts/${postId}/status`, { status })
      .then((res) => res.data),
};

