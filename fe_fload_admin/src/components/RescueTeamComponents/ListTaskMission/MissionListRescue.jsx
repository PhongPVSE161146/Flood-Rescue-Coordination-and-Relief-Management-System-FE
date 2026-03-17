import "./MissionListRescue.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAllAssignments,
  acceptRescueAssignment,
  getRescueTeamMembers,
  getAllRescueTeams,
  getAllVehicles
} from "../../../../api/axios/RescueApi/RescueTask";
import AuthNotify from "../../../utils/Common/AuthNotify";

const STATUS_MAP = {
  ASSIGNED: { label: "🟡 Chờ nhận nhiệm vụ" },
  ACCEPTED: { label: "✔ Đã nhận nhiệm vụ" },
  DEPARTED: { label: "🚑 Đã xuất phát" },
  ARRIVED: { label: "📍 Đã đến hiện trường" },
  COMPLETED: { label: "✅ Hoàn thành nhiệm vụ" },
  REJECTED: { label: "❌ Đã từ chối" }
};



export default function MissionListRescue() {

  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user")) ||
    {};
// lấy chữ cái đầu (Nguyễn Văn A -> NA)
const getInitials = (name = "") => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase();

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase();
};
  /* ================= GET REQUEST BY ID ================= */

  const getRequestById = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/RescueRequests/${id}`
      );
      return await res.json();
    } catch {
      return null;
    }
  };

  /* ================= FIND TEAM ================= */

  const findMyTeamId = async (teams, userId) => {

    for (const team of teams) {

      const teamId = team.rcid;

      if (!teamId) continue;

      try {

        const res = await getRescueTeamMembers(teamId);
        const data = res?.data;

        if (!data) continue;

        const isMember = data.items?.some(
          m => m.userId === userId
        );

        if (isMember) return teamId;

      } catch {
        console.warn("Lỗi team:", teamId);
      }
    }

    return null;
  };

  /* ================= LOAD TASK ================= */

  const fetchAssignments = async () => {

    try {

      setLoading(true);

      if (!user?.userId) {
        console.error("Không có userId");
        return;
      }

      /* 🔥 core API */
      const [assignmentsRes, teamRes] = await Promise.all([
        getAllAssignments(),
        getAllRescueTeams()
      ]);

      const assignments = assignmentsRes || [];
      const teams = teamRes?.data?.items || teamRes?.data || [];

      /* 🔥 vehicle */
      let vehicles = [];
      try {
        const vehicleRes = await getAllVehicles();
        vehicles = vehicleRes?.data || [];
      } catch {
        console.warn("Lỗi vehicles");
      }

      /* ================= MAP LOOKUP ================= */

      const vehicleMap = {};
      vehicles.forEach(v => {
        vehicleMap[v.vehicleId] = v.vehicleName;
      });

      const teamMap = {};
      teams.forEach(t => {
        teamMap[t.rcid] = t.rcName;
      });

      /* 🔥 find team */
      const myTeamId = await findMyTeamId(teams, user.userId);

      if (!myTeamId) {
        setMissions([]);
        return;
      }

      /* 🔥 filter */
      const myAssignments = assignments.filter(
        a => a.rescueTeamId === myTeamId
      );

      /* 🔥 MAP + CALL REQUEST API */
      const mapped = await Promise.all(
        myAssignments.map(async (a) => {

          const req = await getRequestById(a.rescueRequestId);

          return {
            id: a.assignmentId,

            // 👤 request info
            name: req?.fullName || "Không rõ",
            phone: req?.contactPhone || "Không có",
            address: req?.address || "Chưa có",

            // 🚑 vehicle
            vehicle: vehicleMap[a.vehicleId] || a.vehicleId,

            // 👥 team
            team: teamMap[a.rescueTeamId] || `Team ${a.rescueTeamId}`,

            status: a.assignmentStatus,

            time: a.assignedAt
              ? new Date(a.assignedAt).toLocaleString("vi-VN")
              : "Chưa có",

            active: a.assignmentStatus === "ASSIGNED"
          };

        })
      );

      setMissions(mapped);

    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  /* ================= ACCEPT ================= */

  const handleAccept = async (id) => {

    try {
      await acceptRescueAssignment(id);
  
      // ✅ update UI ngay lập tức
      setMissions(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, status: "ACCEPTED", active: false }
            : m
        )
      );
  
      // ✅ thông báo
      AuthNotify.success(
        "Nhận nhiệm vụ thành công",
        "Đang chuyển sang màn hình cứu hộ..."
      );
  
      // 👉 chuyển trang
      setTimeout(() => {
        navigate(`/rescueTeam/dangcuho/${id}`);
      }, 1000);
  
    } catch (err) {
  
      AuthNotify.error(
        "Nhận nhiệm vụ thất bại",
        err?.message || "Có lỗi xảy ra"
      );
  
    }
  
  };

  /* ================= UI ================= */

  return (

<section className="rm-container">

{/* ===== HEADER FIXED ===== */}
<div className="rm-header-fixed">
  <h3>Nhiệm vụ của tôi</h3>
  <span>{missions.length} nhiệm vụ</span>
</div>

{/* ===== LIST SCROLL ===== */}
<div className="rm-list-scroll">

  {loading && <p className="rm-loading">Đang tải...</p>}

  {!loading && missions.length === 0 && (
    <p className="rm-empty">Không có nhiệm vụ</p>
  )}

  {missions.map(m => (

    <div key={m.id} className="rm-card">

      {/* TOP */}
      <div className="rm-top">
      <div className="rm-avatar">
  {getInitials(m.name)}
</div>
        <div>
          <h4> 👤{m.name}</h4>
          <span className="rm-phone">📞 {m.phone}</span>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="rm-address">
        📍 {m.address}
      </div>

      {/* INFO */}
      <div className="rm-info">
        <div className="rm-tag team">Tên đội cứu hộ: {m.team}</div>
        <div className="rm-tag vehicle">Tên phương tiện: {m.vehicle}</div>
      </div>

      {/* STATUS */}
      <div className="rm-meta">
      <span className={`status-badge ${m.status.toLowerCase()}`}>
      <span className={`status-badge ${m.status?.toLowerCase()}`}>
  {STATUS_MAP[m.status]?.label || "Không xác định"}
</span>
</span>
        <span className="time">⏱Phân công lúc: {m.time}</span>
      </div>

      {/* ACTION */}
      <div className="rm-actions">
      <button
  className={`btn-accept ${
    m.status === "ASSIGNED" ? "" : "view-mode"
  }`}
  onClick={() => {
    if (m.status === "ASSIGNED") {
      handleAccept(m.id);
    } else {
      navigate(`/rescueTeam/dangcuho/${m.id}`);
    }
  }}
>
{m.status === "ASSIGNED" && "🚀 Nhận nhiệm vụ"}
  {m.status === "ACCEPTED" && "🔍 Xem quá trình"}
  {m.status === "COMPLETED" && "📋 Xem chi tiết"}
</button>

        <button
          onClick={() => navigate(`/rescueTeam/mission/${m.id}`)}
        >
          Xem Chi Tiết
        </button>
      </div>

    </div>

  ))}

</div>

</section>

  );
}