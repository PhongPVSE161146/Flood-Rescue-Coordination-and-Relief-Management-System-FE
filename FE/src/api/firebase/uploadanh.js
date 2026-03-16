import axiosInstance from "../service/axiosInstance";

export const uploadImages = async (files, folder = "citizen") => {

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("Files", file);
  });

  /* folder mặc định */
  formData.append("Folder", folder || "citizen");

  const res = await axiosInstance.post(
    "/api/Upload/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};