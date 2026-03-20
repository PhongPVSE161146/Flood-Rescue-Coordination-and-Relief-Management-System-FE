import axiosInstance from "../../axiosInstance";

const safeNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

/* =========================================================
   ================ PeriodicAidCampaigns ===================
   ========================================================= */

export const getAllPeriodicAidCampaigns = () => {
  return axiosInstance.get("/api/PeriodicAidCampaigns");
};

export const getPeriodicAidCampaignById = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.get(`/api/PeriodicAidCampaigns/${safeId}`);
};

export const createPeriodicAidCampaign = (data) => {
  return axiosInstance.post("/api/PeriodicAidCampaigns", {
    campaignName: data.campaignName || "",
    month: safeNumber(data.month),
    year: safeNumber(data.year),
    areaId: safeNumber(data.areaId),
    status: data.status || "Pending",
    createdByAdminId: safeNumber(data.createdByAdminId)
  });
};

export const updatePeriodicAidCampaign = (id, data) => {
  const safeId = safeNumber(id);
  return axiosInstance.put(`/api/PeriodicAidCampaigns/${safeId}`, {
    campaignName: data.campaignName || "",
    month: safeNumber(data.month),
    year: safeNumber(data.year),
    areaId: safeNumber(data.areaId),
    status: data.status || "Pending"
  });
};

export const deletePeriodicAidCampaign = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.delete(`/api/PeriodicAidCampaigns/${safeId}`);
};

/* =========================================================
   ============== PeriodicAidBeneficiaries =================
   ========================================================= */

export const getBeneficiariesByCampaign = (campaignId) => {
  const safeId = safeNumber(campaignId);
  return axiosInstance.get(`/api/periodic-aid-beneficiaries/by-campaign/${safeId}`);
};

export const getBeneficiaryById = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.get(`/api/periodic-aid-beneficiaries/${safeId}`);
};

export const createBeneficiary = (data) => {
  return axiosInstance.post("/api/periodic-aid-beneficiaries", {
    campaignId: safeNumber(data.campaignId),
    citizenUserId: safeNumber(data.citizenUserId) || 0,
    fullName: data.fullName || "",
    phone: data.phone || "",
    address: data.address || "",
    areaId: safeNumber(data.areaId),
    householdSize: safeNumber(data.householdSize) || 0,
    targetGroup: data.targetGroup || "",
    priorityLevel: safeNumber(data.priorityLevel) || 0,
    status: data.status || "",
    selectedByAdminId: safeNumber(data.selectedByAdminId),
    selectedAt: data.selectedAt || new Date().toISOString()
  });
};

export const updateBeneficiary = (id, data) => {
  const safeId = safeNumber(id);
  return axiosInstance.put(`/api/periodic-aid-beneficiaries/${safeId}`, {
    fullName: data.fullName || "",
    phone: data.phone || "",
    address: data.address || "",
    areaId: safeNumber(data.areaId) || 0,
    householdSize: safeNumber(data.householdSize) || 0,
    targetGroup: data.targetGroup || "",
    priorityLevel: safeNumber(data.priorityLevel) || 0,
    status: data.status || "",
    selectedByAdminId: safeNumber(data.selectedByAdminId) || 0,
    selectedAt: data.selectedAt || new Date().toISOString()
  });
};

export const deleteBeneficiary = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.delete(`/api/periodic-aid-beneficiaries/${safeId}`);
};

/* =========================================================
   ================ PeriodicAidSupplyPlans =================
   ========================================================= */

export const getSupplyPlansByCampaign = (campaignId) => {
  const safeId = safeNumber(campaignId);
  return axiosInstance.get(`/api/periodic-aid-supply-plans/by-campaign/${safeId}`);
};

export const getSupplyPlanById = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.get(`/api/periodic-aid-supply-plans/${safeId}`);
};

export const createSupplyPlan = (data) => {
  return axiosInstance.post("/api/periodic-aid-supply-plans", {
    campaignId: safeNumber(data.campaignId),
    reliefItemId: safeNumber(data.reliefItemId),
    plannedQuantity: safeNumber(data.plannedQuantity) || 0,
    approvedQuantity: safeNumber(data.approvedQuantity) || 0,
    createdByManagerId: safeNumber(data.createdByManagerId)
  });
};

export const updateSupplyPlan = (id, data) => {
  const safeId = safeNumber(id);
  return axiosInstance.put(`/api/periodic-aid-supply-plans/${safeId}`, {
    plannedQuantity: safeNumber(data.plannedQuantity) || 0,
    approvedQuantity: safeNumber(data.approvedQuantity) || 0
  });
};

export const deleteSupplyPlan = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.delete(`/api/periodic-aid-supply-plans/${safeId}`);
};

/* =========================================================
   ================ PeriodicAidDistributions ===============
   ========================================================= */

export const getDistributionsByCampaign = (campaignId) => {
  const safeId = safeNumber(campaignId);
  return axiosInstance.get(`/api/periodic-aid-distributions/by-campaign/${safeId}`);
};

export const getDistributionById = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.get(`/api/periodic-aid-distributions/${safeId}`);
};

export const createDistribution = (data) => {
  return axiosInstance.post("/api/periodic-aid-distributions", {
    campaignId: safeNumber(data.campaignId) || 0,
    rescueTeamId: safeNumber(data.rescueTeamId) || 0,
    distributedAt: data.distributedAt || new Date().toISOString(),
    status: data.status || "",
    note: data.note || ""
  });
};

export const updateDistribution = (id, data) => {
  const safeId = safeNumber(id);
  return axiosInstance.put(`/api/periodic-aid-distributions/${safeId}`, {
    distributedAt: data.distributedAt || new Date().toISOString(),
    status: data.status || "",
    note: data.note || ""
  });
};

export const deleteDistribution = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.delete(`/api/periodic-aid-distributions/${safeId}`);
};

/* =========================================================
   ============= PeriodicAidDistributionDetails ============
   ========================================================= */

export const getDistributionDetailsByDistribution = (distributionId) => {
  const safeId = safeNumber(distributionId);
  return axiosInstance.get(`/api/periodic-aid-distribution-details/by-distribution/${safeId}`);
};

export const getDistributionDetailById = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.get(`/api/periodic-aid-distribution-details/${safeId}`);
};

export const createDistributionDetail = (data) => {
  return axiosInstance.post("/api/periodic-aid-distribution-details", {
    distributionId: safeNumber(data.distributionId) || 0,
    beneficiaryId: safeNumber(data.beneficiaryId) || 0,
    status: data.status || "",
    note: data.note || ""
  });
};

export const updateDistributionDetail = (id, data) => {
  const safeId = safeNumber(id);
  return axiosInstance.put(`/api/periodic-aid-distribution-details/${safeId}`, {
    status: data.status || "",
    note: data.note || ""
  });
};

export const deleteDistributionDetail = (id) => {
  const safeId = safeNumber(id);
  return axiosInstance.delete(`/api/periodic-aid-distribution-details/${safeId}`);
};
