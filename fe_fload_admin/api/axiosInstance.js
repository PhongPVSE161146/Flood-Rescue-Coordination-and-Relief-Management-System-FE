import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

console.log("API URL:", import.meta.env.VITE_API_URL);

/* REQUEST */

axiosInstance.interceptors.request.use((config) => {

  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Authorization Token:", config.headers.Authorization);
  console.log(
    "API REQUEST:",
    config.method?.toUpperCase(),
    config.baseURL + config.url
  );

  return config;

});

/* RESPONSE */

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    console.error("API ERROR:", error?.response || error);

    if (error?.response?.status === 401) {

      sessionStorage.clear();
      localStorage.clear();

      window.location.href = "/login";

    }

    return Promise.reject(error);

  }
);

export default axiosInstance;