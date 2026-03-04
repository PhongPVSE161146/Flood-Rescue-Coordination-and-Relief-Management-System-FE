// src/api/authApi.js

import axiosInstance from "../../axiosInstance";

export const loginApi = async ({ phone, password }) => {

  const response = await axiosInstance.post(
    "/api/User/login",
    {
      phone: phone.trim(),
      password: password.trim(),
    }
  );

  return response.data;
};

export const getUserProfile = async () => {

  try {

    const response = await axiosInstance.get(
      "/api/User/profile"
    );

    return response.data;

  } catch (error) {

    console.error("PROFILE ERROR:", error?.response);

    throw error?.response?.data || error;

  }

};

export const updateUserProfile = async (data) => {

  const response = await axiosInstance.put(
    "/api/User/profile",
    data
  );
  

  return response.data;

}