import apiClient from "../../services/apiClient";

export const notificationsApi = {
  list: () => apiClient.get("/notifications").then((res) => res.data),
  unreadCount: () => apiClient.get("/notifications/unread-count").then((res) => res.data),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => apiClient.patch("/notifications/read-all").then((res) => res.data),
};
