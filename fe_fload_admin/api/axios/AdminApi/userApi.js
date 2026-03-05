// src/api/userApi.js

import axiosInstance from "../../axiosInstance";

export const registerUser = async (data) => {

  try {

    const payload = {
      phone: data?.phone?.trim() || "",
      password: data?.password || "",
      name: data?.name?.trim() || "",
      roleId: Number(data?.roleId ?? 0),
      areaId: Number(data?.areaId ?? 0),
    };

    const response = await axiosInstance.post(
      "/api/User/register",
      payload
    );

    return response?.data;

  } catch (error) {

    console.error("REGISTER ERROR:", error?.response || error);

    throw error?.response?.data?.message || "Đăng ký user thất bại";

  }

};




// export const getUserProfile = async () => {

//   try {

//     const response = await axiosInstance.get(
//       "/api/User/profile"
//     );

//     return response.data;

//   } catch (error) {

//     console.error("PROFILE ERROR:", error?.response);

//     throw error?.response?.data || error;

//   }

// };
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