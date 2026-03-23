import apiClient from "../../services/apiClient";

export const applicationsApi = {
  listForPost: (postId) =>
    apiClient.get(`/applications/posts/${postId}`).then((res) => res.data),
  updateStatus: (applicationId, payload) =>
    apiClient.patch(`/applications/${applicationId}`, payload).then((res) => res.data),
};

