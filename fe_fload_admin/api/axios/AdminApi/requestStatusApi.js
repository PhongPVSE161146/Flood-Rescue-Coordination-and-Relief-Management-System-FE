// src/api/AdminApi/requestStatusApi.js
import axiosInstance from "../../axiosInstance";

// Lấy danh sách trạng thái
export const getAllRequestStatuses = async () => {
  try {
    const response = await axiosInstance.get("/api/request-statuses");
    return response?.data;
  } catch (error) {
    console.error("GET REQUEST STATUSES ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được danh sách trạng thái";
  }
};

// Lấy chi tiết trạng thái
export const getRequestStatusById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/request-statuses/${id}`);
    return response?.data;
  } catch (error) {
    console.error("GET REQUEST STATUS DETAIL ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được chi tiết trạng thái";
  }
};

// Thêm trạng thái mới
export const createRequestStatus = async (data) => {
  try {
    const response = await axiosInstance.post("/api/request-statuses", data);
    return response?.data;
  } catch (error) {
    console.error("CREATE REQUEST STATUS ERROR:", error?.response || error);
    throw error?.response?.data || "Tạo trạng thái thất bại";
  }
};

// Cập nhật trạng thái
export const updateRequestStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/request-statuses/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error("UPDATE REQUEST STATUS ERROR:", error?.response || error);
    throw error?.response?.data || "Cập nhật trạng thái thất bại";
  }
};
