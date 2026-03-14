import "./MissionHistory.css";

const stats = [
  {
    label: "Tổng nhiệm vụ",
    value: 124,
    sub: "+12% tháng này",
    type: "up",
  },
  {
    label: "Người đã cứu",
    value: 482,
    sub: "Ghi nhận thành tích",
    type: "medal",
  },
  {
    label: "Thời gian TB",
    value: "42p",
    sub: "Phản ứng nhanh",
  },
];

const missions = [
  {
    id: "#REQ-9921",
    title: "Cháy Nhà Dân Cư",
    status: "ĐÃ HOÀN THÀNH",
    date: "15/10/2023",
    time: "10:23 - 11:45 (82 phút)",
    location: "Quận 1, TP.HCM",
    people: 2,
    equipment: 4,
    highlight: true,
  },
  {
    id: "#REQ-9854",
    title: "Tai nạn Giao thông",
    status: "ĐÃ HOÀN THÀNH",
    date: "14/10/2023",
    time: "15:10 - 15:45 (35 phút)",
    location: "Quận 7, TP.HCM",
    people: 1,
    equipment: 2,
  },
  {
    id: "#REQ-9721",
    title: "Cứu hộ Ngập lụt",
    status: "ĐÃ HOÀN THÀNH",
    date: "12/10/2023",
    time: "08:00 - 12:30 (270 phút)",
    location: "Huyện Nhà Bè",
    people: 15,
    equipment: 8,
  },
];

export default function MissionHistory() {
  return (
    <section className="mh-root">
      {/* ===== HEADER ===== */}
      <header className="mh-header">
        <h2>Lịch sử Nhiệm vụ</h2>

        <div className="mh-actions">
          <button className="mh-btn-outline">☰ Bộ lọc</button>
          <button className="mh-btn-outline">⬇ Xuất báo cáo</button>
        </div>
      </header>

      {/* ===== STATS ===== */}
      <div className="mh-stats">
        {stats.map((s, i) => (
          <div key={i} className="mh-stat-card">
            <span className="mh-stat-label">{s.label}</span>
            <strong>{s.value}</strong>
            <small className={s.type}>{s.sub}</small>
          </div>
        ))}
      </div>

      {/* ===== LIST ===== */}
      <div className="mh-list">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`mh-item ${m.highlight ? "highlight" : ""}`}
          >
            <div className="mh-left">
              <div className="mh-icon">
                {m.highlight ? "✔" : "⚙"}
              </div>

              <div>
                <h4>
                  {m.title}
                  <span className="mh-status">{m.status}</span>
                  <span className="mh-id">{m.id}</span>
                </h4>

                <p>
                  📅 {m.date} &nbsp; ⏱ {m.time}
                </p>
                <p>📍 {m.location}</p>
              </div>
            </div>

            <div className="mh-meta">
              <div>
                <label>Nạn nhân</label>
                <b>{m.people} người</b>
              </div>
              <div>
                <label>Vật tư dùng</label>
                <b>{m.equipment} thiết bị</b>
              </div>
            </div>

            <button className="mh-report-btn">
              📄 Xem báo cáo
            </button>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="mh-footer">
        <span>Hiển thị 3 trên 124 nhiệm vụ</span>

        <div className="mh-pagination">
          <button>‹</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>›</button>
        </div>
      </footer>
    </section>
  );
}
