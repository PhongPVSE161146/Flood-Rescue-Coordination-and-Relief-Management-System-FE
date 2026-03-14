import { useState, useEffect } from "react";
import "./MissionDetailRescue.css";
import { useParams, useNavigate } from "react-router-dom";
import { getRescueAssignmentById, acceptRescueAssignment } from "../../../../api/axios/RescueTeamApi/rescueAssignmentApi";

export default function MissionDetailRescue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissionDetail();
  }, [id]);

  const fetchMissionDetail = async () => {
    try {
      setLoading(true);
      const res = await getRescueAssignmentById(id);
      const dataObj = res?.data || res;
      setMission(dataObj);
    } catch (error) {
      console.error("Failed to load mission detail", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRescueAssignment(id);
      alert("Đã nhận nhiệm vụ thành công!");
      navigate("/rescue/mission-in-progress"); // Navigate to a logical next page or reload
    } catch (error) {
      alert("Nhận nhiệm vụ thất bại: " + error);
    }
  };

  if (loading) return <p>Đang tải chi tiết nhiệm vụ...</p>;
  if (!mission) return <p>Không tìm thấy nhiệm vụ</p>;

  // Resolve fields (assuming the API returns specific fields, fallback to some mock-like defaults if missing)
  const reqId = mission.rescueRequestId || id;
  const statusStr = typeof mission.assignmentStatus === "string" ? mission.assignmentStatus : "Chưa tiếp nhận";

  return (
    <section className="md-root">
      {/* ===== HEADER ===== */}
      <header className="md-header">
        <div>
          <h2>
            {mission.title || "YÊU CẦU CỨU HỘ"}
            <span className="md-badge">#{reqId}</span>
            <span className="md-status">{statusStr}</span>
          </h2>
          <p>⏱ Yêu cầu lúc: {mission.createdAt ? new Date(mission.createdAt).toLocaleString() : "10:23 AM"}</p>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="md-content">
        {/* ===== LEFT INFO ===== */}
        <aside className="md-left">
          {/* Thông tin nạn nhân */}
          <div className="md-card">
            <h4>👤 Thông tin nạn nhân</h4>

            <div className="md-info">
              <label>Họ và tên</label>
              <b>{mission.victimName || "Trần Thị Thu Hương"}</b>
            </div>

            <div className="md-info">
              <label>Số điện thoại</label>
              <span className="md-phone">{mission.victimPhone || "0903 882 11x"}</span>
              <button className="md-call">📞 Gọi ngay</button>
            </div>
          </div>

          {/* Tình trạng */}
          <div className="md-card md-danger">
            <h4>⚠️ Tình trạng</h4>
            <p>
              {mission.condition || "Đang bị kẹt tại tầng 2, khói dày đặc. Có 1 người bị thương nhẹ ở chân, không di chuyển được."}
            </p>
          </div>

          {/* Yêu cầu đặc biệt */}
          <div className="md-card">
            <h4>❗ Yêu cầu đặc biệt</h4>

            <ul className="md-special">
              {mission.specialRequests ? (
                mission.specialRequests.map((req, i) => <li key={i}>{req}</li>)
              ) : (
                <>
                  <li>🚒 Cần xe thang gấp (độ cao &gt; 10m)</li>
                  <li>😷 Mặt nạ phòng độc (3 cái)</li>
                  <li>🩹 Thiết bị sơ cứu bỏng & hô hấp</li>
                </>
              )}
            </ul>
          </div>
        </aside>

        {/* ===== RIGHT MAP & MEDIA ===== */}
        <main className="md-right">
          {/* MAP */}
          <div className="md-map">
            <div className="md-map-label">
              📍 {mission.address || "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"}
            </div>

            <iframe
              title="rescue-map"
              src={`https://www.google.com/maps?q=${mission.lat || 10.7731},${mission.lng || 106.7031}&z=14&output=embed`}
              loading="lazy"
            />
          </div>

          {/* MEDIA */}
          <section className="md-media">
            <div className="md-media-header">
              <h4>🖼 Hình ảnh / Video từ hiện trường</h4>
              <span className="md-download">Tải xuống tất cả</span>
            </div>

            <div className="md-media-list">
              <div className="md-thumb map" />
              <div className="md-thumb map" />
              <div className="md-thumb video">
                ▶
              </div>
              <div className="md-thumb upload">
                📷
                <span>Thêm ảnh</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="md-footer">
        <button className="md-back" onClick={() => navigate(-1)}>← Quay lại</button>
        <button className="md-accept" onClick={handleAccept}>
          ✓ Chấp nhận nhiệm vụ
        </button>
      </footer>
    </section>
  );
}
