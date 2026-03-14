// src/api/AdminApi/systemConfigApi.js

import axiosInstance from "../../axiosInstance";


// =============================
// GET ALL CONFIG
// =============================
export const getAllSystemConfigs = async (params = {}) => {

  try {

    const response = await axiosInstance.get(
      "/api/SystemConfigurations",
      { params }
    );

    return response?.data;

  } catch (error) {

    console.error("GET SYSTEM CONFIG ERROR:", error?.response || error);

    throw error?.response?.data || "Không lấy được cấu hình hệ thống";

  }

};



// =============================
// GET CONFIG BY KEY
// =============================
export const getSystemConfigByKey = async (configKey) => {

  try {

    const response = await axiosInstance.get(
      `/api/SystemConfigurations/${configKey}`
    );

    return response?.data;

  } catch (error) {

    console.error("GET CONFIG DETAIL ERROR:", error?.response || error);

    throw error?.response?.data || "Không lấy được chi tiết cấu hình";

  }

};



// =============================
// UPDATE CONFIG
// =============================
export const updateSystemConfig = async (configKey, data) => {

  try {

    const payload = {
      configKey: data?.configKey || configKey,
      configValue: data?.configValue || "",
      configGroup: data?.configGroup || "",
      description: data?.description || ""
    };

    const response = await axiosInstance.put(
      `/api/SystemConfigurations/${configKey}`,
      payload
    );

    return response?.data;

  } catch (error) {

    console.error("UPDATE CONFIG ERROR:", error?.response || error);

    throw error?.response?.data || "Cập nhật cấu hình thất bại";

  }

};



// =============================
// SEED DEFAULT CONFIG
// =============================
export const seedSystemConfig = async () => {

  try {

    const response = await axiosInstance.post(
      "/api/SystemConfigurations/seed"
    );

    return response?.data;

  } catch (error) {

    console.error("SEED CONFIG ERROR:", error?.response || error);

    throw error?.response?.data || "Seed config thất bại";

  }

};