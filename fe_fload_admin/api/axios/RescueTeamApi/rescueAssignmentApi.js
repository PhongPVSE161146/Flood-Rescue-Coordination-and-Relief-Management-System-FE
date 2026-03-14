// src/api/axios/RescueTeamApi/rescueAssignmentApi.js
import axiosInstance from "../../axiosInstance";

// Lấy danh sách phân công cứu hộ theo điều kiện lọc
export const getRescueAssignments = async (params) => {
  try {
    const response = await axiosInstance.get("/api/RescueAssignments", { params });
    return response?.data;
  } catch (error) {
    console.error("GET RESCUE ASSIGNMENTS ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được danh sách phân công";
  }
};

// Lấy chi tiết phân công cứu hộ theo id
export const getRescueAssignmentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/RescueAssignments/${id}`);
    return response?.data;
  } catch (error) {
    console.error("GET RESCUE ASSIGNMENT DETAIL ERROR:", error?.response || error);
    throw error?.response?.data || "Không lấy được chi tiết phân công";
  }
};

// Tạo mới một phân công cứu hộ
export const createRescueAssignment = async (data) => {
  try {
    const response = await axiosInstance.post("/api/RescueAssignments", data);
    return response?.data;
  } catch (error) {
    console.error("CREATE RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Tạo phân công mới thất bại";
  }
};

// Cập nhật thông tin cơ bản của phân công cứu hộ
export const updateRescueAssignment = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error("UPDATE RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Cập nhật phân công thất bại";
  }
};

// Xóa phân công cứu hộ
export const deleteRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/RescueAssignments/${id}`);
    return response?.data;
  } catch (error) {
    console.error("DELETE RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Xóa phân công thất bại";
  }
};

// Xác nhận nhận nhiệm vụ cứu hộ
export const acceptRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/accept`);
    return response?.data;
  } catch (error) {
    console.error("ACCEPT RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Xác nhận nhận nhiệm vụ thất bại";
  }
};

// Từ chối nhiệm vụ cứu hộ
export const rejectRescueAssignment = async (id, rejectReason) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/reject`, { rejectReason });
    return response?.data;
  } catch (error) {
    console.error("REJECT RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Từ chối nhiệm vụ thất bại";
  }
};

// Hủy phân công cứu hộ
export const cancelRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/cancel`);
    return response?.data;
  } catch (error) {
    console.error("CANCEL RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Hủy phân công thất bại";
  }
};

// Điều chuyển lại team, shift hoặc vehicle cho assignment
export const reassignRescueAssignment = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/reassign`, data);
    return response?.data;
  } catch (error) {
    console.error("REASSIGN RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Điều chuyển phân công thất bại";
  }
};

// Cập nhật trạng thái assignment sang đã xuất phát
export const departRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/depart`);
    return response?.data;
  } catch (error) {
    console.error("DEPART RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Cập nhật trạng thái xuất phát thất bại";
  }
};

// Cập nhật trạng thái assignment sang đã đến hiện trường
export const arriveRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/arrive`);
    return response?.data;
  } catch (error) {
    console.error("ARRIVE RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Cập nhật trạng thái đến hiện trường thất bại";
  }
};

// Hoàn thành phân công cứu hộ
export const completeRescueAssignment = async (id) => {
  try {
    const response = await axiosInstance.put(`/api/RescueAssignments/${id}/complete`);
    return response?.data;
  } catch (error) {
    console.error("COMPLETE RESCUE ASSIGNMENT ERROR:", error?.response || error);
    throw error?.response?.data || "Hoàn thành nhiệm vụ thất bại";
  }
};
