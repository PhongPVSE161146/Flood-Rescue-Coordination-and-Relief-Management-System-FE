import { Button, Input, Image } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PhoneOutlined } from "@ant-design/icons";
import "./MissionDetail.css";

export default function MissionDetail() {
  const [priority, setPriority] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="rc-md">
      {/* ================= HEADER ================= */}
      <header className="rc-md__header">
        <div className="rc-md__header-info">
          <h2 className="request-title">
            Yêu cầu #1234
            <span className="status status-pending">
              CHỜ XÁC MINH
            </span>
          </h2>

          <p className="request-meta">
            Tiếp nhận lúc 14:30 · Qua Hệ Thống Cứu Hộ Việt Nam
          </p>
        </div>

        <Button
          icon={<PhoneOutlined />}
          className="call-btn rc-md__action-call"
        >
          GỌI XÁC MINH
        </Button>
      </header>

      <div className="divider" />

      {/* ================= CONTENT GRID ================= */}
      <div className="detail-grid rc-md__content">

        {/* ========== LEFT COLUMN ========== */}
        <div className="left-col rc-md__column rc-md__column-left">

          {/* --- SECTION: CITIZEN INFO --- */}
          <section className="card rc-md__section rc-md__section-citizen">
            <h4 className="card-title">👤 THÔNG TIN NGƯỜI DÂN</h4>

            <div className="info-row">
              <div className="info-item">
                <label>HỌ VÀ TÊN</label>
                <strong>Nguyễn Văn An</strong>
              </div>

              <div className="info-item">
                <label>SỐ ĐIỆN THOẠI</label>
                <strong className="phone">
                  090 123 4567
                </strong>
              </div>
            </div>

            <label>ĐỊA CHỈ HIỆN TẠI</label>
            <p className="address-text">
              123 Nguyễn Huệ, Phường Đa Kao,
              Quận 1, TP.HCM
            </p>
          </section>

          {/* --- SECTION: EMERGENCY STATUS --- */}
          <section className="card rc-md__section rc-md__section-status">
            <h4 className="card-title">📋 TÌNH TRẠNG KHẨN CẤP</h4>

            <p className="quote">
              "Nước đang dâng cao khoảng 1m, tràn vào tầng trệt.
              Trong nhà có 2 người già (80 tuổi), một người hạn chế vận động.
              Cần hỗ trợ trước khi trời tối."
            </p>
          </section>
  <section className="card rc-md__section rc-md__section-resources">
            <h4 className="card-title">
              🧰 NGUỒN LỰC & MÔ TẢ CHI TIẾT
            </h4>

            <div className="resource-grid">
              <div className="resource-item">
                <label>SỐ NGƯỜI GẶP NẠN</label>
                <p>3</p>
              </div>

              <div className="resource-item">
                <label>DỤNG CỤ CỨU HỘ HIỆN CÓ</label>
                <p>Gậy, dây thừng, phao</p>
              </div>
            </div>

            <label>NHU CẦU ĐẶC BIỆT</label>
            <p className="resource-text">
              Thuốc điều trị tim mạch cho người già
            </p>

            <label>MÔ TẢ CHI TIẾT</label>
            <p className="resource-text">
              Mực nước tiếp tục dâng, không còn điện,
              cần hỗ trợ di chuyển khẩn cấp.
            </p>
          </section>
          {/* --- SECTION: MAP --- */}
          <section className="map-card rc-md__section rc-md__section-map">
            <iframe
              title="map"
              src="https://www.google.com/maps?q=10.7758,106.7024&z=13&output=embed"
            />
            <button className="map-link rc-md__action-map">
              ↗ Xem bản đồ lớn
            </button>
          </section>
          
        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="right-col rc-md__column rc-md__column-right">

          {/* --- SECTION: RESOURCES --- */}
        

          {/* --- SECTION: IMAGES --- */}
          <section className="card rc-md__section rc-md__section-images">
            <h4 className="card-title">
              📷 HÌNH ẢNH HIỆN TRƯỜNG
            </h4>

            <Image.PreviewGroup>
              <div className="image-grid">
                <Image src="https://picsum.photos/300/200?1" />
                <Image src="https://picsum.photos/300/200?2" />
                <Image src="https://picsum.photos/300/200?3" />
              </div>
            </Image.PreviewGroup>
          </section>

          {/* --- SECTION: PRIORITY --- */}
          <section className="card rc-priority-card">
  <h4 className="card-title">⚠️ PHÂN LOẠI ƯU TIÊN</h4>

  {/* P1 */}
  <div
    className={`rc-priority-item rc-p1 ${priority === "P1" ? "is-active" : ""}`}
    onClick={() => setPriority("P1")}
  >
    <span className="rc-radio" />
    <div className="rc-priority-content">
      <strong>KHẨN CẤP</strong>
      <p>Đe dọa tính mạng ngay lập tức</p>
    </div>
  </div>

  {/* P2 */}
  <div
    className={`rc-priority-item rc-p2 ${priority === "P2" ? "is-active" : ""}`}
    onClick={() => setPriority("P2")}
  >
    <span className="rc-radio" />
    <div className="rc-priority-content">
      <strong>CAO</strong>
      <p>Tình trạng nghiêm trọng, cần xử lý sớm</p>
    </div>
  </div>

  {/* P3 */}
  <div
    className={`rc-priority-item rc-p3 ${priority === "P3" ? "is-active" : ""}`}
    onClick={() => setPriority("P3")}
  >
    <span className="rc-radio" />
    <div className="rc-priority-content">
      <strong>THƯỜNG</strong>
      <p>Hỗ trợ tiếp tế hoặc cứu hộ không gấp</p>
    </div>
  </div>
</section>


          {/* --- SECTION: NOTE --- */}
          <section className="card rc-md__section rc-md__section-note">
            <h4 className="card-title">📝 GHI CHÚ XÁC MINH</h4>
            <Input.TextArea rows={4} placeholder="Ghi chú sau khi gọi..." />
          </section>

          {/* --- ACTIONS --- */}
          <Button
  className="confirm-btn"
  disabled={!priority}
  onClick={() => {
    if (!priority) return;

    navigate("/coordinator/dang", {
      state: {
        priority,
      },
    });
  }}
>
  ▶ XÁC NHẬN & CHUYỂN ĐIỀU PHỐI
</Button>



          <p className="danger-text rc-md__action-flag">
            Đánh dấu yêu cầu giả mạo / Trùng lặp
          </p>
        </div>
      </div>
    </section>
  );
}
