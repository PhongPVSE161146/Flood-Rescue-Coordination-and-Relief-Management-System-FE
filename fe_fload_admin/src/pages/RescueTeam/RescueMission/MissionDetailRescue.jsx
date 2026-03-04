import "./MissionDetailRescue.css";
import { useParams } from "react-router-dom";

export default function MissionDetailRescue() {
    const { id } = useParams();
  return (
    <section className="md-root">
      {/* ===== HEADER ===== */}
      <header className="md-header">
        <div>
          <h2>
            Cháy Nhà Dân Cư
            <span className="md-badge">#REQ-9921</span>
            <span className="md-status">Chưa tiếp nhận</span>
          </h2>
          <p>⏱ Yêu cầu lúc: 10:23 AM · 2 phút trước</p>
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
              <b>Trần Thị Thu Hương</b>
            </div>

            <div className="md-info">
              <label>Số điện thoại</label>
              <span className="md-phone">0903 882 11x</span>
              <button className="md-call">📞 Gọi ngay</button>
            </div>
          </div>

          {/* Tình trạng */}
          <div className="md-card md-danger">
            <h4>⚠️ Tình trạng</h4>
            <p>
              Đang bị kẹt tại tầng 2, khói dày đặc.
              Có 1 người bị thương nhẹ ở chân, không
              di chuyển được.
            </p>
          </div>

          {/* Yêu cầu đặc biệt */}
          <div className="md-card">
            <h4>❗ Yêu cầu đặc biệt</h4>

            <ul className="md-special">
              <li>🚒 Cần xe thang gấp (độ cao &gt; 10m)</li>
              <li>😷 Mặt nạ phòng độc (3 cái)</li>
              <li>🩹 Thiết bị sơ cứu bỏng & hô hấp</li>
            </ul>
          </div>
        </aside>

        {/* ===== RIGHT MAP & MEDIA ===== */}
        <main className="md-right">
          {/* MAP */}
          <div className="md-map">
            <div className="md-map-label">
              📍 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM
            </div>

            <iframe
              title="rescue-map"
              src="https://www.google.com/maps?q=10.7731,106.7031&z=14&output=embed"
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
        <button className="md-back">← Quay lại</button>
        <button className="md-accept">
          ✓ Chấp nhận nhiệm vụ
        </button>
      </footer>
    </section>
  );
}
