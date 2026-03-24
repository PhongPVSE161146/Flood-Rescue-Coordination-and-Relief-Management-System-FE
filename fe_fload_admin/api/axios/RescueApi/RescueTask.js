import axiosInstance from "../../axiosInstance";



export const acceptRescueAssignment = async (assignmentId) => {

    try {
  
      const response = await axiosInstance.put(
        `/api/RescueAssignments/${assignmentId}/accept`
      );
  
      return response.data;
  
    } 
    catch (error) {
  
      console.error("Lỗi nhận nhiệm vụ:", error);
  
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Không thể nhận nhiệm vụ cứu hộ"
      );
  
    }
  
  };

  /* ================= REJECT ASSIGNMENT ================= */

  export const rejectRescueAssignment = async (assignmentId, data) => {

    try {
  
      const response = await axiosInstance.put(
        `/api/RescueAssignments/${assignmentId}/reject`,
        data || {}
      );
  
      return response.data;
  
    } catch (error) {
  
      console.error("REJECT ASSIGNMENT ERROR:", error);
  
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Không thể từ chối nhiệm vụ cứu hộ"
      );
  
    }
  
  };

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
export const getBusyRescueTeams = () => {

  return axiosInstance.get(
    "/api/RescueTeams/busy"
  );

};
/* ================= GET TEAM MEMBERS ================= */

export const getTeamMembers = async (teamId) => {

  try {

    const response = await axiosInstance.get(
      `/api/rescueteams/${teamId}/members`
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy members team:", error);

    return null; // không throw để tránh crash loop

  }

};
export const getAllUser = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/User/all"   // FIX thêm dấu /
    );

    return response.data;

  } catch (error) {

    console.error("GET ALL USER ERROR:", error?.response);

    throw error?.response?.data || error;

  }

};
export const getAllVehicles = (params = {}) => {
  const query = {};

  if (params.q) query.q = params.q;
  if (params.type) query.type = params.type;
  if (params.status) query.status = params.status;

  if (params.includeDeleted !== undefined) {
    query.includeDeleted = params.includeDeleted;
  }

  return axiosInstance.get("/api/vehicles", { params: query });
};

export const getRescueTeamMembers = (teamId) => {

  return axiosInstance.get(`/api/rescueteams/${teamId}/members`);

};

export const getPendingRescueRequests = async (params = {}) => {

  try {

    const response = await axiosInstance.get(
      `/api/RescueRequests`,
      {
        params,
        headers: {
          Accept: "application/json"
        }
      }
    );

    return response.data;

  }
  catch (error) {

    console.error("Lỗi lấy RescueRequests:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể tải danh sách RescueRequests"
    );

  }

};
export const getAllRescueTeams = () => {

  return axiosInstance.get("/api/RescueTeams");

};
/* ================= DEPART ASSIGNMENT ================= */

export const departRescueAssignment = async (assignmentId) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueAssignments/${assignmentId}/depart`
    );

    return response.data;

  }
  catch (error) {

    console.error("DEPART ASSIGNMENT ERROR:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể xuất phát nhiệm vụ"
    );

  }

};
/* ================= ARRIVE ASSIGNMENT ================= */

export const arriveRescueAssignment = async (assignmentId) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueAssignments/${assignmentId}/arrive`
    );

    return response.data;

  }
  catch (error) {

    console.error("ARRIVE ASSIGNMENT ERROR:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể cập nhật đã đến hiện trường"
    );

  }

};
/* ================= COMPLETE ASSIGNMENT ================= */

export const completeRescueAssignment = async (assignmentId) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueAssignments/${assignmentId}/complete`
    );

    return response.data;

  }
  catch (error) {

    console.error("COMPLETE ASSIGNMENT ERROR:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể hoàn thành nhiệm vụ"
    );

  }

};