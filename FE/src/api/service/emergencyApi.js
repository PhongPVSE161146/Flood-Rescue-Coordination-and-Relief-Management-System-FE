import axiosInstance from "./axiosInstance";

/* ================================
   CREATE RESCUE REQUEST
================================ */

export const createRescueRequest = async (payload) => {

  try {

    const response = await axiosInstance.post(
      "/api/RescueRequests",
      {
        requestType: payload.requestType,
        contactPhone: payload.contactPhone,
        locationLat: payload.locationLat,
        locationLng: payload.locationLng,
        locationImageUrl: payload.locationImageUrl,
        areaId: payload.areaId,
        fullName: payload.fullName,
        victimCount: payload.victimCount,
        availableRescueTool: payload.availableRescueTool,
        specialNeeds: payload.specialNeeds,
        detailDescription: payload.detailDescription,
        rescueTeamNote: payload.rescueTeamNote,
        address: payload.address
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*"
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error("Create Rescue Request Error:", error);

    throw error;

  }

};