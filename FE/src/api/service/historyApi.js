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