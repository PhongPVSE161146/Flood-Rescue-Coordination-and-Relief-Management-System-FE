import axiosInstance from "../../axiosInstance";

/* ================= GET DASHBOARD MANAGEMENT ================= */

export const getDashboardManagement = async () => {
  try {

    const response = await axiosInstance.get(
      "/api/dashboard/management"
    );

    return response.data;

  } catch (error) {

    console.error("GET DASHBOARD ERROR:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải dữ liệu dashboard"
    );

  }
};
