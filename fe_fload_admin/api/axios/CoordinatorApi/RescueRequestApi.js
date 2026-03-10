import axiosInstance from "../../axiosInstance";

/* ================= GET PENDING REQUEST ================= */

export const getPendingRescueRequests = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/RescueRequests"
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy danh sách yêu cầu:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải danh sách yêu cầu cứu hộ"
    );

  }

};
export const getUrgencyLevels = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/urgency-levels"
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy mức độ khẩn cấp:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải danh sách mức độ khẩn cấp"
    );

  }

};
export const getDispatchingRescueRequests = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/RescueRequests/dispatch"
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy danh sách đang điều phối:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải danh sách đang điều phối"
    );

  }

};
/* ================= VERIFY & DISPATCH REQUEST ================= */

export const verifyAndDispatchRescueRequest = async (
  requestId,
  data
) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueRequests/${requestId}/verify`,
      {
        urgencyLevelId: data.urgencyLevelId,
        note: data.note
      }
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi xác nhận và điều phối:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể xác nhận và điều phối yêu cầu cứu hộ"
    );

  }

};
/* ================= CONFIRM DISPATCH ================= */

export const confirmDispatchRescueRequest = async (data) => {

  try {

    const response = await axiosInstance.post(
      "/api/RescueAssignments",
      {
        rescueRequestId: data.rescueRequestId,
        rescueTeamId: data.rescueTeamId,
        vehicleId: data.vehicleId,
        assignedBy: data.assignedBy
      }
    );

    return response.data;

  }
  catch (error) {

    console.error("DISPATCH ERROR:", error?.response);

    throw error?.response?.data || error;

  }

};

/* ================= GET ALL ASSIGNMENTS ================= */

export const getAllAssignments = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/RescueAssignments"
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy danh sách assignments:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải danh sách điều phối cứu hộ"
    );

  }

};

/* ================= UPDATE ASSIGNMENT ================= */

export const updateRescueAssignment = async (
  assignmentId,
  payload
) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueAssignments/${assignmentId}`,
      payload
    );

    return response.data;

  } catch (error) {

    console.error("UPDATE ASSIGNMENT ERROR:", error);

    throw error;

  }

};
/* ================= GET ASSIGNMENT BY ID ================= */

export const getRescueAssignmentById = async (assignmentId) => {

  try {

    const response = await axiosInstance.get(
      `/api/RescueAssignments/${assignmentId}`
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy assignment:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải thông tin điều phối cứu hộ"
    );

  }

};