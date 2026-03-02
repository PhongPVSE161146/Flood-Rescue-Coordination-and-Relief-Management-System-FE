// src/api/service/emergencyApi.js
import axiosInstance from "../service/axiosInstance"; // import instance axios của bạn

// 1. Tra cứu lịch sử cứu hộ theo số điện thoại (GET)
export const getRescueHistoryByPhone = async (phone) => {
  if (!phone) throw new Error("Số điện thoại không được để trống");

  // Chuẩn hóa số điện thoại (loại bỏ dấu +, khoảng trắng, dấu - nếu có)
  const cleanPhone = phone.replace(/[\s+\-]/g, "");

  try {
    const response = await axiosInstance.get(
      `/api/RescueRequest/citizen/${cleanPhone}`
    );
    return response.data; // Trả về array yêu cầu cứu hộ hoặc object tùy backend
  } catch (error) {
    console.error("Lỗi tra cứu lịch sử cứu hộ:", error);
    const errMsg = error.response?.data?.message || error.message || "Không tìm thấy lịch sử";
    throw new Error(errMsg);
  }
};
// 2. Xóa yêu cầu cứu hộ theo ID (DELETE)
export const deleteRescueRequest = async (id) => {
  if (!id) throw new Error("Thiếu ID yêu cầu");

  try {
    const response = await axiosInstance.delete(
      `/api/RescueRequest/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa yêu cầu:", error);
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      "Không thể xóa yêu cầu";
    throw new Error(errMsg);
  }
};
// ================= UPDATE RESCUE REQUEST =================

export const updateRescueRequest = async (id, payload) => {
  if (!id) throw new Error("Thiếu ID yêu cầu");

  try {
    const response = await axiosInstance.put(
      `/api/RescueRequest/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật yêu cầu:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Cập nhật thất bại"
    );
  }
};