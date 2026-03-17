import "./MissionListRescue.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAllAssignments,
  acceptRescueAssignment,
  getRescueTeamMembers
} from "../../../../api/axios/RescueApi/RescueTask";

import { getAllRescueTeams } from "../../../../api/axios/ManagerApi/rescueTeamApi";

export default function MissionListRescue() {

  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user")) ||
    {};

  /* ================= FIND TEAM ================= */

  const findMyTeamId = async (teams, userId) => {

    for (const team of teams) {

      const teamId = team.rcid; // 🔥 đúng field

      if (!teamId) continue;

      try {

        const res = await getRescueTeamMembers(teamId);
        const data = res?.data;

        if (!data) continue;

        const isMember = data.items?.some(
          m => m.userId === userId
        );

        if (isMember) {
          console.log("FOUND TEAM:", teamId);
          return teamId;
        }

      } catch (err) {
        console.error("Lỗi team:", teamId, err);
      }
    }

    return null;
  };

  /* ================= LOAD TASK ================= */

  const fetchAssignments = async () => {

    try {

      setLoading(true);

      const [assignmentsRes, teamRes] = await Promise.all([
        getAllAssignments(),
        getAllRescueTeams()
      ]);

      const assignments = assignmentsRes || [];
      const teams = teamRes?.data?.items || teamRes?.data || [];

      console.log("ALL ASSIGNMENTS:", assignments);
      console.log("ALL TEAMS:", teams);

      const myTeamId = await findMyTeamId(teams, user.userId);

      if (!myTeamId) {
        console.warn("User không thuộc team nào");
        setMissions([]);
        return;
      }

      /* ================= FILTER ================= */

      const myAssignments = assignments.filter(
        a => a.rescueTeamId === myTeamId
      );

      console.log("MY TASK:", myAssignments);

      /* ================= MAP UI ================= */

      const mapped = myAssignments.map(a => ({
        id: a.assignmentId,
        requestId: a.rescueRequestId,
        vehicleId: a.vehicleId,
        status: a.assignmentStatus,
        time: a.assignedAt
          ? new Date(a.assignedAt).toLocaleString("vi-VN")
          : "Chưa có",
        active: a.assignmentStatus === "ASSIGNED"
      }));

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
      fetchAssignments();
    } catch (err) {
      alert("Nhận nhiệm vụ thất bại");
    }

  };

  /* ================= UI ================= */

  return (

    <section className="rm-mission-list">

      <h3>Nhiệm vụ của tôi ({missions.length})</h3>

      {loading && <p>Đang tải...</p>}

      {!loading && missions.length === 0 && (
        <p>Không có nhiệm vụ</p>
      )}

      {missions.map(m => (

        <div key={m.id} className="rm-card">

          <h4>Task #{m.id}</h4>

          <p>Request: {m.requestId}</p>
          <p>Vehicle: {m.vehicleId}</p>
          <p>Trạng thái: {m.status}</p>
          <p>Thời gian: {m.time}</p>

          <button
            disabled={!m.active}
            onClick={() => handleAccept(m.id)}
          >
            Nhận nhiệm vụ
          </button>

          <button
            onClick={() => navigate(`/rescueTeam/mission/${m.id}`)}
          >
            Chi tiết
          </button>

        </div>

      ))}

    </section>

  );
}