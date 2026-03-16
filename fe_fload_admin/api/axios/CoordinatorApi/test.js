import axios from "axios";

export const getAllAssignments = async () => {

  const response = await axios.get(
    "https://api-rescue.purintech.id.vn/api/RescueAssignments"
  );

  console.log("API RESPONSE:", response.data);

  return response.data;

};