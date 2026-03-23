import apiClient from "../../services/apiClient";

export const searchApi = {
  teachers: (filters = {}) =>
    apiClient
      .get("/search/teachers", {
        params: {
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 10,
          ...filters,
        },
      })
      .then((res) => res.data),
};

