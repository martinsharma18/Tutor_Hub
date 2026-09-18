import apiClient from "../../services/apiClient";

export const reviewsApi = {
  create: (payload) => apiClient.post("/reviews", payload).then((res) => res.data),
  forTeacher: (teacherProfileId) =>
    apiClient.get(`/reviews/teacher/${teacherProfileId}`).then((res) => res.data),
};
