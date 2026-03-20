import "./MissionHistory.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination } from "antd";

import {
  getAllAssignments,
  getRescueTeamMembers,
  getAllRescueTeams,
  getAllVehicles
} from "../../../../api/axios/RescueApi/RescueTask";

/* ================= STATUS ================= */

const STATUS_MAP = {
  COMPLETED: { label: "✅ Hoàn thành nhiệm vụ" }
};

export default function MissionHistory() {

  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3;

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user")) ||
    {};

  /* ================= AVATAR ================= */

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase();

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  /* ================= GET REQUEST ================= */

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

      try {
        const res = await getRescueTeamMembers(team.rcid);
        const data = res?.data;

        const isMember = data?.items?.some(
          m => m.userId === userId
        );

        if (isMember) return team.rcid;

      } catch {
        console.warn("Lỗi team:", team.rcid);
      }
    }

    return null;
  };

  /* ================= LOAD DATA ================= */

  const fetchAssignments = async () => {

    try {

      setLoading(true);

      if (!user?.userId) return;

      const [assignmentsRes, teamRes, vehicleRes] = await Promise.all([
        getAllAssignments(),
        getAllRescueTeams(),
        getAllVehicles()
      ]);

      const assignments = assignmentsRes || [];
      const teams = teamRes?.data?.items || [];
      const vehicles = vehicleRes?.data || [];

      /* MAP */
      const vehicleMap = {};
      vehicles.forEach(v => {
        vehicleMap[v.vehicleId] = v.vehicleName;
      });

      const teamMap = {};
      teams.forEach(t => {
        teamMap[t.rcid] = t.rcName;
      });

      /* FIND TEAM */
      const myTeamId = await findMyTeamId(teams, user.userId);

      if (!myTeamId) {
        setMissions([]);
        return;
      }

      /* FILTER + SORT */
      const myAssignments = assignments
        .filter(a => a.rescueTeamId === myTeamId)
        .filter(a => a.assignmentStatus === "COMPLETED")
        .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));

      /* MAP DATA */
      const mapped = await Promise.all(
        myAssignments.map(async (a) => {

          const req = await getRequestById(a.rescueRequestId);

          return {
            id: a.assignmentId,
            name: req?.fullName || "Không rõ",
            phone: req?.contactPhone || "Không có",
            address: req?.address || "Chưa có",
            vehicle: vehicleMap[a.vehicleId] || a.vehicleId,
            team: teamMap[a.rescueTeamId] || `Team ${a.rescueTeamId}`,
            status: a.assignmentStatus,
            time: a.assignedAt
              ? new Date(a.assignedAt).toLocaleString("vi-VN")
              : "Chưa có"
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

  /* 🔥 RESET PAGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [missions]);

  /* ================= PAGINATION ================= */

  const paginatedMissions = missions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= UI ================= */

  return (

    <section className="rm-container">

      {/* HEADER */}
      <div className="rm-header-fixed">
        <h3>Lịch sử hoàn thành nhiệm vụ</h3>
        <span>{missions.length} nhiệm vụ</span>
      </div>

      {/* LIST */}
      <div className="rm-list-scroll">

        {loading && <p className="rm-loading">Đang tải...</p>}

        {!loading && missions.length === 0 && (
          <p className="rm-empty">Không có nhiệm vụ</p>
        )}

        {paginatedMissions.map(m => (

          <div key={m.id} className="rm-card">

            {/* TOP */}
            <div className="rm-top">
              <div className="rm-avatar">
                {getInitials(m.name)}
              </div>
              <div>
                <h4>Họ tên: {m.name}</h4>
                <span className="rm-phone">SĐT: {m.phone}</span>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="rm-address">
              Địa chỉ: {m.address}
            </div>

            {/* INFO */}
            <div className="rm-info">
              <div className="rm-tag team">
              Tên đội cứu hộ: {m.team}
              </div>
              <div className="rm-tag vehicle">
              Tên phương tiện: {m.vehicle}
              </div>
            </div>

            {/* STATUS */}
            <div className="rm-meta">
              <span className="status-badge completed">
                {STATUS_MAP[m.status]?.label}
              </span>
              <span className="time">
                ⏱Phân công lúc: {m.time}
              </span>
            </div>

            {/* ACTION */}
            <div className="rm-actions">
              <button
                className="btn-accept view-mode"
                onClick={() =>
                  navigate(`/rescueTeam/history/${m.id}`)
                }
              >
                 Xem lịch sử
              </button>
            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION */}
      {missions.length > pageSize && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={missions.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      )}

    </section>

  );
}