// src/api/AdminApi/urgencyLevelApi.js
import axiosInstance from "../../axiosInstance";

// Lấy danh sách mức độ khẩn cấp
export const getAllUrgencyLevels = async () => {
  try {
    const response = await axiosInstance.get("/api/urgency-levels");
    return response?.data;
  } catch (error) {
    console.error("GET URGENCY LEVELS ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được danh sách mức độ khẩn cấp";
  }
};

// Lấy chi tiết mức độ khẩn cấp
export const getUrgencyLevelById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/urgency-levels/${id}`);
    return response?.data;
  } catch (error) {
    console.error("GET URGENCY LEVEL DETAIL ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được chi tiết mức độ khẩn cấp";
  }
};

// Thêm mức độ khẩn cấp mới
export const createUrgencyLevel = async (data) => {
  try {
    const response = await axiosInstance.post("/api/urgency-levels", data);
    return response?.data;
  } catch (error) {
    console.error("CREATE URGENCY LEVEL ERROR:", error?.response || error);
    throw error?.response?.data || "Thêm mức độ khẩn cấp thất bại";
  }
};

// Cập nhật mức độ khẩn cấp
export const updateUrgencyLevel = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/urgency-levels/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error("UPDATE URGENCY LEVEL ERROR:", error?.response || error);
    throw error?.response?.data || "Cập nhật mức độ khẩn cấp thất bại";
  }
};

// Xóa mức độ khẩn cấp
export const deleteUrgencyLevel = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/urgency-levels/${id}`);
    return response?.data;
  } catch (error) {
    console.error("DELETE URGENCY LEVEL ERROR:", error?.response || error);
    throw error?.response?.data || "Xóa mức độ khẩn cấp thất bại";
  }
};
