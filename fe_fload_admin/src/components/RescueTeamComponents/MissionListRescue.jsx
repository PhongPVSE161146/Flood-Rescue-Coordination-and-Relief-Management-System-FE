import "./MissionListRescue.css";
import { useNavigate } from "react-router-dom";

const missions = [
  {
    id: "#REQ-9921",
    title: "CHÁY NHÀ DÂN CƯ",
    level: "KHẨN CẤP",
    address: "123 Nguyễn Huệ, P. Bến Nghé, Quận 1",
    tags: ["Yêu cầu y tế"],
    time: "2 phút trước",
    active: true,
    lat: 10.7731,
    lng: 106.7031,
  },
  {
    id: "#REQ-9920",
    title: "TAI NẠN GIAO THÔNG",
    level: "TAI NẠN",
    address: "456 Võ Văn Kiệt, Quận 5",
    tags: ["Cần xe cứu thương"],
    time: "5 phút trước",
    lat: 10.7546,
    lng: 106.6601,
  },
  {
    id: "#REQ-9919",
    title: "MÈO MẮC KẸT TRÊN CÂY",
    level: "CỨU HỘ ĐỘNG VẬT",
    address: "Công viên Tao Đàn",
    tags: ["Yêu cầu thang"],
    time: "15 phút trước",
    lat: 10.7722,
    lng: 106.6937,
  },
];

export default function MissionList() {

  const navigate = useNavigate();
  return (
    <section className="rm-mission-list">
      {/* HEADER */}
      <header className="rm-list-header">
        <h3>
          Nhiệm vụ mới <span>{missions.length} yêu cầu</span>
        </h3>
        <p>
          Các yêu cầu cứu hộ đang chờ xử lý từ trung
          tâm điều phối.
        </p>
      </header>

      {/* LIST */}
      {missions.map((m) => (
        <div
          key={m.id}
          className={`rm-mission-card ${
            m.active ? "active" : ""
          }`}
        >
          {/* ===== MAP THUMB (GOOGLE MAP REAL) ===== */}
          <div className="rm-map-thumb">
            <iframe
              title={m.id}
              src={`https://www.google.com/maps?q=${m.lat},${m.lng}&z=15&output=embed`}
              loading="lazy"
            />
          </div>

          {/* ===== CONTENT ===== */}
          <div className="rm-card-body">
            <div className="rm-card-head">
              <span
                className={`rm-badge ${m.level
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
              >
                {m.level}
              </span>

              <span className="rm-time">
                {m.time}
              </span>
            </div>

            <h4>{m.title}</h4>

            <p className="rm-address">
              📍 {m.address}
            </p>

            <div className="rm-tags">
              {m.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="rm-actions">
              <button className="rm-btn-accept">
                ✓ CHẤP NHẬN NHIỆM VỤ
              </button>
              <button
  className="rm-btn-detail"
  onClick={() =>
    navigate(`/rescue/mission/${m.id.replace("#", "")}`)
  }
>
  XEM CHI TIẾT →
</button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
