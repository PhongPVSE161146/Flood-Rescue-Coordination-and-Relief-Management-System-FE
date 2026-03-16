import axios from "axios";

export const getPendingRescueRequests = async () => {

  const response = await axios.get(
    "https://api-rescue.purintech.id.vn/api/RescueRequests"
  );

  console.log("API RESPONSE:", response.data);

  return response.data;

};