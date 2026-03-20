import "./MissionInProgress.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRescueAssignmentById,
  getDispatchQueue as getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../api/axios/RescueRequests/rescueRequestsApi";

import { getAllRescueTeams } from "../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../api/axios/ManagerApi/vehicleApi";
import {
  departRescueAssignment,
  arriveRescueAssignment,
  completeRescueAssignment
} from "../../../../api/axios/RescueApi/RescueTask";
const API_BASE = "https://api-rescue.purintech.id.vn";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

const STATUS_STEPS = [
  { key: "ASSIGNED", label: "Đã điều động", icon: "📋" },
  { key: "ACCEPTED", label: "Đội đã nhận", icon: "👍" },
  { key: "DEPARTED", label: "Đã xuất phát", icon: "🚑" },
  { key: "ARRIVED", label: "Đã đến hiện trường", icon: "📍" },
  { key: "COMPLETED", label: "Hoàn thành", icon: "✔" }
];

export default function MissionInProgress() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  /* ================= LOAD DATA ================= */

  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        assignment,
        requestRes,
        urgencyRes,
        teamRes,
        vehicleRes
      ] = await Promise.all([
        getRescueAssignmentById(id),
        getPendingRescueRequests(),
        getUrgencyLevels(),
        getAllRescueTeams(),
        getAllVehicles()
      ]);

      const requests = requestRes?.data || requestRes || [];
      const teams = teamRes?.data?.items || [];
      const vehicles = vehicleRes?.data || [];
      const urgencies = urgencyRes || [];

      /* ===== MAP ===== */
      const teamMap = {};
      teams.forEach(t => (teamMap[t.rcid] = t.rcName));

      const vehicleMap = {};
      vehicles.forEach(v => (vehicleMap[v.vehicleId] = v.vehicleName));

      const urgencyMap = {};
      urgencies.forEach(u => (urgencyMap[u.urgencyLevelId] = u.levelName));

      const req = requests.find(
        r => r.rescueRequestId === assignment?.rescueRequestId
      );

      if (!assignment) return;

      const urgencyLevel = urgencyMap[req?.urgencyLevelId];

      /* ===== SET DETAIL ===== */
      setDetail({
        missionId: assignment.assignmentId,
        rescueRequestId: assignment.rescueRequestId,

        team: teamMap[assignment.rescueTeamId] || "Không rõ",
        vehicle: vehicleMap[assignment.vehicleId] || "Không rõ",

        assignmentStatus: assignment.assignmentStatus,

        fullname: req?.fullName || req?.fullname || "Không rõ",
        phone: req?.contactPhone || "Không có",
        address: req?.address || "Chưa có",

        requestType: req?.requestType || "Không rõ",
        victimCount: req?.victimCount || 0,
        availableRescueTool: req?.availableRescueTool || "Không có",
        specialNeeds: req?.specialNeeds || "Không có",
        detailDescription: req?.detailDescription || "Không có",
        rescueTeamNote: req?.rescueTeamNote || "Không có",

        urgency:
          priorityTranslate[urgencyLevel] ||
          urgencyLevel ||
          "Không xác định",

        startTime: assignment.assignedAt
      });

      /* ===== LOCATION ===== */
      if (req?.locationLat && req?.locationLng) {
        setLocation({
          lat: req.locationLat,
          lng: req.locationLng
        });
      }

      /* ===== IMAGES ===== */
      const imgs = [
        ...(req?.imageUrls || []),
        ...(req?.images || []),
        req?.locationImageUrl
      ].filter(Boolean);

      setImages(
        imgs.map(img =>
          img.startsWith("http") ? img : API_BASE + img
        )
      );

    } catch (err) {

      console.error("Load detail error:", err);

    } finally {

      setLoading(false);

    }

  };
  const handleAction = async () => {

    if (!detail) return;
  
    try {
  
      setActionLoading(true);
  
      const status = detail.assignmentStatus;
  
      if (status === "ACCEPTED") {
        await departRescueAssignment(id);
      }
  
      else if (status === "DEPARTED") {
        await arriveRescueAssignment(id);
      }
  
      else if (status === "ARRIVED") {
        await completeRescueAssignment(id);
      }
  
      // reload data sau khi update
      await fetchData();
  
    } catch (err) {
  
      console.error("Action error:", err);
  
    } finally {
  
      setActionLoading(false);
  
    }
  
  };

  const getActionText = () => {

    switch (detail?.assignmentStatus) {
      case "ACCEPTED":
        return "🚑 Xuất phát";
      case "DEPARTED":
        return "📍 Đã đến nơi";
      case "ARRIVED":
        return "✅ Hoàn thành";
      case "COMPLETED":
        return "✔ Đã hoàn thành";
      default:
        return "Không khả dụng";
    }
  
  };
  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  /* ===== TIMELINE ===== */

  const currentIndex = STATUS_STEPS.findIndex(
    s => s.key === detail?.assignmentStatus
  );

  /* ================= UI ================= */

  if (loading) return <div className="rc-loading">Đang tải...</div>;
  if (!detail) return <div  style={{
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 600,
    color: "#555"
  }}>Vui lòng bấm vào nhiệm vụ để xem quá trình cứu hộ</div>;

  return (

    <section className="rc-op-detail">

      {/* HEADER */}
      <header className="rc-op-detail__header">

        <div>
          <h2>
            Nhiệm vụ #{detail.rescueRequestId}
            <span className="rc-badge rc-badge--danger">
              {detail.urgency}
            </span>
          </h2>

          <p>
            ⏱ {detail.startTime
              ? new Date(detail.startTime).toLocaleString("vi-VN")
              : "Chưa có"}
          </p>
        </div>

        <button onClick={() => navigate(-1)} className="btn-outline">
          ← Quay lại
        </button>

      </header>

      {/* TIMELINE */}
      <section className="rc-op-card">

        <div className="rc-timeline">

          {STATUS_STEPS.map((step, index) => {

            const isDone = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div key={step.key} className="rc-timeline__step">

                <div
                  className={`rc-timeline__item 
                  ${isActive ? "active" : ""}
                  ${isDone ? "done" : ""}`}
                >
                  <div className="rc-timeline__icon">
                    {step.icon}
                  </div>

                  <div className="rc-timeline__content">
                    <b>{step.label.toUpperCase()}</b>
                  </div>
                </div>

                {index < STATUS_STEPS.length - 1 && (
                  <div className={`rc-timeline__line ${isDone ? "done" : ""}`} />
                )}

              </div>
            );

          })}

        </div>

      </section>

      {/* GRID */}
      <div className="rc-op-grid">

        {/* LEFT */}
        <div className="rc-op-col">

          {/* Người dân */}
          <section className="rc-op-card">

  <h4>👤 NGƯỜI GỬI YÊU CẦU</h4>

  <div className="rc-user-grid">

    <div>
      <label>Họ tên</label>
      <p>{detail.fullname}</p>
    </div>

    <div>
      <label>Số điện thoại</label>
      <p className="phone">{detail.phone}</p>
    </div>

  </div>

  <div className="rc-address">
    📍 {detail.address}
  </div>

</section>

          {/* Sự cố */}
          <section className="rc-op-card">

<h4>📋 THÔNG TIN SỰ CỐ</h4>

<div className="rc-incident-grid">

  <div className="rc-box">
    <span>Loại</span>
    <b>{detail.requestType}</b>
  </div>

  <div className="rc-box">
    <span>Số nạn nhân</span>
    <b>{detail.victimCount}</b>
  </div>

  <div className="rc-box">
    <span>Dụng cụ</span>
    <b>{detail.availableRescueTool}</b>
  </div>

  <div className="rc-box">
    <span>Nhu cầu</span>
    <b>{detail.specialNeeds}</b>
  </div>

</div>

</section>

      

          {/* MAP */}
          <section className="rc-op-card">
            <h4>📍 Bản Đồ</h4>
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
              loading="lazy"
            />
          </section>

        </div>

        {/* RIGHT */}
        <div className="rc-op-col">
    {/* Đội */}
    <section className="rc-op-card">
            <h4>🚑 ĐỘI CỨU HỘ</h4>
            <p>👥 {detail.team}</p>
            <p>🚑 {detail.vehicle}</p>
          </section>

          {/* Mô tả */}
          <section className="rc-op-card">
            <h4>📝 MÔ TẢ</h4>
            <p>{detail.detailDescription}</p>
          </section>

          {/* Ghi chú */}
          <section className="rc-op-card">
            <h4>📌 GHI CHÚ</h4>
            <p>{detail.rescueTeamNote}</p>
          </section>

          <section className="rc-op-card">
            <h4>📷 HÌNH ẢNH</h4>

            <div className="rc-images">

              {images.length === 0 && <p>Không có hình ảnh</p>}

              {images.map((img, i) => (
                <div
                  key={i}
                  className="rc-image"
                  style={{
                    backgroundImage: `url(${img})`
                  }}
                />
              ))}

            </div>

          </section>

        </div>

      </div>
      <footer className="rp-footer">

<div className="rp-actions">

  <button className="rp-help">
    🆘 Yêu cầu hỗ trợ
  </button>

  <button
    className={`rp-done ${
      detail.assignmentStatus === "COMPLETED" ? "disabled" : ""
    }`}
    onClick={handleAction}
    disabled={
      actionLoading ||
      detail.assignmentStatus === "COMPLETED"
    }
  >
    {actionLoading
      ? "⏳ Đang xử lý..."
      : getActionText()}
  </button>

</div>

</footer>
    </section>
  );
}