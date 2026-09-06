import apiClient from "../../services/apiClient";

export const filesApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post("/files/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data);
  },
};
