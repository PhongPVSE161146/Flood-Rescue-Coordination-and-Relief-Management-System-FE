// src/lib/axios.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


/**
 * REQUEST INTERCEPTOR
 * attach accessToken automatically
 */
axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);


/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {

    console.error("API ERROR:", error?.response || error);

    if (error?.response?.status === 401) {

      localStorage.clear();

      window.location.href = "/login";

    }

    return Promise.reject(error);

  }
);

export default axiosInstance;