import "./DistributionListRescue.css";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getRescueTeamMembers,
  getAllRescueTeams,
  getAllDistributions // 🔥 thêm API mới
} from "../../../../api/axios/RescueApi/RescueTask";

export default function DistributionListRescue() {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamMap, setTeamMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = 5;

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user")) ||
    {};

  /* ================= FIND TEAM ================= */

  const findMyTeamId = async (teams, userId) => {

    for (const team of teams) {
      try {
        const res = await getRescueTeamMembers(team.rcid);
        const members = res?.data?.items || [];

        const isMember = members.some(m => m.userId === userId);

        if (isMember) return team.rcid;

      } catch {}
    }

    return null;
  };

  /* ================= LOAD ================= */

  const fetchDistributions = async () => {

    try {
      setLoading(true);
  
      if (!user?.userId) return;
  
      // 🔥 lấy danh sách team
      const teamRes = await getAllRescueTeams();
      const teams = teamRes?.data?.items || [];
  
      // 🔥 map id -> name
      const map = {};
      teams.forEach(t => {
        map[t.rcid] = t.rcName;
      });
      setTeamMap(map);
  
      // 🔥 tìm team của user
      const myTeamId = await findMyTeamId(teams, user.userId);
  
      if (!myTeamId) {
        setList([]);
        return;
      }
  
      // 🔥 gọi API distribution
      const data = await getAllDistributions();
  
      const myList = data
        .filter(d => d.rescueTeamId === myTeamId)
        .sort((a, b) => new Date(b.distributedAt) - new Date(a.distributedAt));
  
      setList(myList);
  
    } catch (err) {
      console.error("Load distribution error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [list]);

  /* ================= PAGINATION ================= */

  const paginated = list.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= STATUS ================= */

  const getStatus = (s) => {
    const map = {
      pending: "🟡 Đang chờ",
      completed: "✔ Hoàn thành",
    };

    return map[s?.toLowerCase()] || s;
  };

  /* ================= UI ================= */

  return (
    <section className="rm-container">

      <div className="rm-header-fixed">
        <h3>Danh sách cứu trợ</h3>
        <span>{list.length} đợt</span>
      </div>

      <div className="rm-list-scroll">

        {loading && <p className="rm-loading">Đang tải...</p>}

        {!loading && list.length === 0 && (
          <p className="rm-empty">Không có dữ liệu</p>
        )}

{paginated.map(item => (

<div key={item.distributionId} className="rm-card">

  <div className="rm-top">
    <div className="rm-avatar">
      #{item.distributionId}
    </div>

    <div>
      <h4>Chiến dịch: {item.campaignId}</h4>
      <span>
        🚑 {teamMap[item.rescueTeamId] || `Team ${item.rescueTeamId}`}
      </span>
    </div>
  </div>

  <div className="rm-address">
    Ghi chú: {item.note || "Không có"}
  </div>

  <div className="rm-meta">
    <span className="status-badge">
      {getStatus(item.status)}
    </span>

    <span className="time">
      ⏱ {new Date(item.distributedAt).toLocaleString("vi-VN")}
    </span>
  </div>

  {/* 🔥 NÚT DETAIL */}
  <div style={{ marginTop: 10, textAlign: "right" }}>
    <button
      className="rm-btn-detail"
      onClick={() =>
        navigate(`/rescueTeam/cuu-tro/${item.distributionId}`)
      }
    >
      Xem chi tiết →
    </button>
  </div>

</div>

))}

      </div>

      {/* PAGINATION */}
      {list.length > pageSize && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={list.length}
            onChange={setCurrentPage}
          />
        </div>
      )}

    </section>
  );
}