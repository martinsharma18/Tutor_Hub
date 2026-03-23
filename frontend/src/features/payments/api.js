import apiClient from "../../services/apiClient";

export const paymentsApi = {
  teacherPayments: () => apiClient.get("/payments/teacher").then((res) => res.data),
  parentPayments: () => apiClient.get("/payments/parent").then((res) => res.data),
  markPaid: (paymentId, reference) =>
    apiClient.post(`/payments/${paymentId}/pay`, reference ?? null).then((res) => res.data),
};

