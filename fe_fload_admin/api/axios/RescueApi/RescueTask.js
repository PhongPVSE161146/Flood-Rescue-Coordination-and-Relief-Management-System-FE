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

export const rejectRescueAssignment = async (assignmentId) => {

  try {

    const response = await axiosInstance.put(
      `/api/RescueAssignments/${assignmentId}/reject`
    );

    return response.data;

  }
  catch (error) {

    console.error("REJECT ASSIGNMENT ERROR:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Không thể từ chối nhiệm vụ cứu hộ"
    );

  }

};