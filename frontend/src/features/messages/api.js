import apiClient from "../../services/apiClient";

export const messagesApi = {
  send: (payload) =>
    apiClient.post("/messages", payload).then((res) => res.data),
  conversation: (otherUserId, take = 50) =>
    apiClient.get(`/messages/${otherUserId}`, { params: { take } }).then((res) => res.data),
};

