import { useState, useEffect } from "react";
import "./MissionListRescue.css";
import { useNavigate } from "react-router-dom";
import { getRescueAssignments, acceptRescueAssignment } from "../../../api/axios/RescueTeamApi/rescueAssignmentApi";

export default function MissionList() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getRescueAssignments();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (res && Array.isArray(res.items)) list = res.items;
      else if (res && Array.isArray(res.data)) list = res.data;
      
      setMissions(list);
    } catch (error) {
      console.error("Failed to load missions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptRescueAssignment(id);
      alert("Đã nhận nhiệm vụ thành công!");
      fetchAssignments();
    } catch (error) {
      alert("Nhận nhiệm vụ thất bại: " + error);
    }
  };

  if (loading) {
    return <section className="rm-mission-list"><p>Đang tải nhiệm vụ...</p></section>;
  }

  return (
    <section className="rm-mission-list">
      {/* HEADER */}
      <header className="rm-list-header">
        <h3>
          Nhiệm vụ mới <span>{missions.length} yêu cầu</span>
        </h3>
        <p>
          Các yêu cầu cứu hộ đang chờ xử lý từ trung tâm điều phối.
        </p>
      </header>

      {/* LIST */}
      {missions.map((m) => {
        const mId = m.id || m.rescueRequestId || "N/A";
        // Convert integer status back to a string or keep it mapped if enum exists
        const statusStr = typeof m.assignmentStatus === "string" ? m.assignmentStatus : "KHẨN CẤP";
        return (
          <div
            key={m.id}
            className={`rm-mission-card ${m.active ? "active" : ""}`}
          >
            {/* ===== MAP THUMB (GOOGLE MAP REAL) ===== */}
            <div className="rm-map-thumb">
              <iframe
                title={mId.toString()}
                src={`https://www.google.com/maps?q=${m.lat || 10.7731},${m.lng || 106.7031}&z=15&output=embed`}
                loading="lazy"
              />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="rm-card-body">
              <div className="rm-card-head">
                <span className={`rm-badge ${statusStr.toLowerCase().replace(/\s/g, "-")}`}>
                  {statusStr}
                </span>
                <span className="rm-time">{m.time || "Vừa xong"}</span>
              </div>

              <h4>{m.title || `Yêu cầu cứu hộ #${mId}`}</h4>

              <p className="rm-address">📍 {m.address || "Chưa có địa chỉ"}</p>

              <div className="rm-tags">
                {(m.tags || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="rm-actions">
                <button className="rm-btn-accept" onClick={() => handleAccept(m.id)}>
                  ✓ CHẤP NHẬN NHIỆM VỤ
                </button>
                <button
                  className="rm-btn-detail"
                  onClick={() => navigate(`/rescue/mission/${mId.toString().replace("#", "")}`)}
                >
                  XEM CHI TIẾT →
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
