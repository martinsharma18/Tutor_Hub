import apiClient from "../../services/apiClient";

export const messagesApi = {
  send: (payload) =>
    apiClient.post("/messages", payload).then((res) => res.data),
  conversation: (otherUserId, take = 50) =>
    apiClient.get(`/messages/${otherUserId}`, { params: { take } }).then((res) => res.data),
  inbox: () => apiClient.get("/messages/inbox").then((res) => res.data),
  unreadCount: () => apiClient.get("/messages/unread-count").then((res) => res.data),
  // Server decides who you may message — mirrors the send-endpoint's authorization exactly.
  contacts: () => apiClient.get("/messages/contacts").then((res) => res.data),
};

