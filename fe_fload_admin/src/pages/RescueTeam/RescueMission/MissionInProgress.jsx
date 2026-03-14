import { useState, useEffect } from "react";
import "./MissionInProgress.css";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getRescueAssignmentById, 
  departRescueAssignment, 
  arriveRescueAssignment, 
  completeRescueAssignment 
} from "../../../../api/axios/RescueTeamApi/rescueAssignmentApi";

export default function MissionInProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derive active progress step from status string / enum if available
  // e.g. "Departed" -> step 2, "Arrived" -> step 3, "Completed" -> step 4
  const statusStr = typeof mission?.assignmentStatus === "string" ? mission.assignmentStatus.toLowerCase() : "";
  let progressStep = 1; // Default
  if (statusStr.includes("depart")) progressStep = 2;
  if (statusStr.includes("arrive")) progressStep = 3;
  if (statusStr.includes("complete")) progressStep = 4;

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

  const handleDepart = async () => {
    try {
        await departRescueAssignment(id);
        fetchMissionDetail();
    } catch (err) {
        alert("Lỗi khi cập nhật xuất phát: " + err);
    }
  };

  const handleArrive = async () => {
    try {
        await arriveRescueAssignment(id);
        fetchMissionDetail();
    } catch (err) {
        alert("Lỗi khi cập nhật đến nơi: " + err);
    }
  };

  const handleComplete = async () => {
    try {
      if (window.confirm("Bạn có chắc muốn báo cáo hoàn thành nhiệm vụ này?")) {
        await completeRescueAssignment(id);
        alert("Đã báo cáo hoàn thành!");
        navigate("/rescue/mission"); // Or somewhere appropriate
      }
    } catch (error) {
      alert("Hoàn thành nhiệm vụ thất bại: " + error);
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;
  if (!mission) return <p>Không tìm thấy nhiệm vụ</p>;

  return (
    <section className="rp-root">
      {/* HEADER */}
      <header className="rp-header">
        <div>
          <h2>
            {mission.title || "YÊU CẦU CỨU HỘ"} <span>#{mission.rescueRequestId || id}</span>
          </h2>
          <p>
            <span className="rp-dot" /> ĐANG THỰC THI · {mission.assignmentStatus}
          </p>
        </div>

        <div className="rp-header-right">
          <div>
            <small>KHOẢNG CÁCH</small>
            <b>1.2 KM</b>
          </div>
          <span className="rp-badge-danger">KHẨN CẤP</span>
        </div>
      </header>

      {/* MAIN */}
      <div className="rp-main">
        {/* LEFT */}
        <aside className="rp-left">
          <div className="rp-card">
            <h4>👤 Thông tin nạn nhân</h4>
            <b>{mission.victimName || "Trần Thị Thu Hương"}</b>
            <p>Trạng thái: {mission.condition || "Còn bị thương, bị kẹt"}</p>
            <button className="rp-call">📞 GỌI NẠN NHÂN</button>
          </div>

          <div className="rp-card">
            <h4>📸 Báo cáo hiện trường</h4>
            <button>Chụp ảnh</button>
            <button>Tải lên</button>
            <textarea placeholder="Ghi chú nhanh..." />
          </div>
        </aside>

        {/* MAP */}
        <main className="rp-map">
          <iframe
            title="map"
            src={`https://www.google.com/maps?q=${mission.lat || 10.7731},${mission.lng || 106.7031}&z=13&output=embed`}
          />
        </main>
      </div>

      {/* PROGRESS */}
      <div className="rp-progress">
        <div className={progressStep >= 1 ? (progressStep > 1 ? "done" : "active") : ""}>
            Đã tiếp nhận (Đang chuẩn bị)
        </div>
        <div className={progressStep >= 2 ? (progressStep > 2 ? "done" : "active") : ""}>
            Đã xuất phát 
            {progressStep === 1 && <button onClick={handleDepart} style={{marginLeft: "10px", padding: '2px 8px'}}>Báo Xuất Phát</button>}
        </div>
        <div className={progressStep >= 3 ? (progressStep > 3 ? "done" : "active") : ""}>
            Đã đến hiện trường
            {progressStep === 2 && <button onClick={handleArrive} style={{marginLeft: "10px", padding: '2px 8px'}}>Báo Đã Đến</button>}
        </div>
        <div className={progressStep === 4 ? "done" : ""}>
            Hoàn thành
        </div>
      </div>

      {/* FOOTER */}
      <footer className="rp-footer">
        <span>📍 Vị trí đội: Vị trí hiện tại · Team ID {mission.rescueTeamId}</span>
        <div>
          <button className="rp-help" onClick={() => navigate(-1)}>← QUAY LẠI</button>
          <button className="rp-done" onClick={handleComplete}>HOÀN THÀNH NHIỆM VỤ</button>
        </div>
      </footer>
    </section>
  );
}
