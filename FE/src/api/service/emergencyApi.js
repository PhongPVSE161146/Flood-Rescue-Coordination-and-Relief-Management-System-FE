import axiosInstance from "./axiosInstance";

export const createRescueRequest = (formData) => {
  return axiosInstance.post("/api/RescueRequest", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
