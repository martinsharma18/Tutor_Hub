import apiClient from "../../services/apiClient";

export const demoApi = {
  create: (payload) => apiClient.post("/demo", payload).then((res) => res.data),
  update: (demoId, payload) =>
    apiClient.patch(`/demo/${demoId}`, payload).then((res) => res.data),
  parentRequests: () => apiClient.get("/demo/parent").then((res) => res.data),
  teacherRequests: () => apiClient.get("/demo/teacher").then((res) => res.data),
};

