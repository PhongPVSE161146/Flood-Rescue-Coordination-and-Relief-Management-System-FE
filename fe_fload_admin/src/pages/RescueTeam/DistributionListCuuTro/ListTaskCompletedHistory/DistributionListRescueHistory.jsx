import "./DistributionListRescueHistory.css";
import { useEffect, useState } from "react";
import { Pagination, Spin, Tag } from "antd";
import {
  getRescueTeamMembers,
  getAllRescueTeams,
  getAllDistributions,
  getAllAidCampaigns
} from "../../../../../api/axios/RescueApi/RescueTask";

export default function DistributionListRescueHistory() {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamMap, setTeamMap] = useState({});
  const [campaignMap, setCampaignMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3;

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

      const teamRes = await getAllRescueTeams();
      const teams = teamRes?.data?.items || [];

      // map team
      const map = {};
      teams.forEach(t => {
        map[t.rcid] = t.rcName;
      });
      setTeamMap(map);

      // campaign
      const campaigns = await getAllAidCampaigns();
      const cmap = {};
      campaigns.forEach(c => {
        cmap[c.campaignID] = c;
      });
      setCampaignMap(cmap);

      const myTeamId = await findMyTeamId(teams, user.userId);

      if (!myTeamId) {
        setList([]);
        return;
      }

      const data = await getAllDistributions();

      // ✅ CHỈ LẤY completed + rejected
      const myList = data
        .filter(d => d.rescueTeamId === myTeamId)
        .filter(d => {
          const status = d.status?.toLowerCase();
          return status === "completed" || status === "rejected";
        })
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
  const renderStatus = (status) => {
    const map = {
      completed: { text: "Hoàn thành", color: "green" },
      rejected: { text: "Từ chối", color: "red" },
    };

    const key = status?.toLowerCase()?.trim();

    const s = map[key] || {
      text: status || "Không xác định",
      color: "default",
    };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  /* ================= UI ================= */
  return (
    <section className="rm-container">

      <div className="rm-header-fixed">
        <h3>Lịch sử cứu trợ</h3>
        <span style={{ color: "white", fontSize: 20 }}>
          {list.length} đợt
        </span>
      </div>

      <div className="rm-list-scroll">

        {loading && (
          <div className="rm-loading">
            <Spin size="large" />
            <p>Đang tải...</p>
          </div>
        )}

        {!loading && list.length === 0 && (
          <p className="rm-empty">Không có dữ liệu</p>
        )}

        {paginated.map(item => {

          const campaign =
            campaignMap[item.campaignId] ||
            campaignMap[item.campaignID];

          return (
            <div key={item.distributionId} className="rm-card">

              {/* TOP */}
              <div className="rm-top">
                <div className="rm-avatar">
                  #{item.distributionId}
                </div>

                <div>
                  <h4>
                    Tên chiến dịch: {campaign?.campaignName || `Chiến dịch ${item.campaignId}`}
                  </h4>

                  <div className="rm-campaign-info">
                    <span className="rm-date">
                      Lịch: {campaign
                        ? `Tháng ${campaign.month}/${campaign.year}`
                        : "Không rõ"}
                    </span>
                  </div>

                  <span>
                    Tên đội: {teamMap[item.rescueTeamId] || `Team ${item.rescueTeamId}`}
                  </span>
                </div>
              </div>

              {/* NOTE */}
              <div className="rm-address">
                Ghi chú: {item.note || "Không có"}
              </div>

              {/* META */}
              <div className="rm-meta">
                <div className="rm-status-wrap">
                  <span className="rm-status-label">Trạng thái:</span>
                  {renderStatus(item.status)}
                </div>

                <span className="time">
                  ⏱Thời gian: {new Date(item.distributedAt).toLocaleString("vi-VN")}
                </span>
              </div>

              {/* ❌ ĐÃ XÓA TOÀN BỘ BUTTON ACTION */}
            </div>
          );
        })}
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