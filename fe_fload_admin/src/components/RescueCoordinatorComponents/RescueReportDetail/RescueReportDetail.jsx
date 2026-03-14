import "./RescueReportDetail.css";
import { useRef, useState } from "react";

export default function RescueReportDetail() {

    const fileRef = useRef(null);
    const [images, setImages] = useState([
        {
            id: "map",
            type: "map",
            src: "https://www.google.com/maps?q=10.7436,106.7017&z=13&output=embed",
          },
          {
            id: "avatar",
            type: "avatar",
            src: "https://i.pravatar.cc/300?img=12",
          },
      ]);

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "upload",
        src: previewUrl,
      },
    ]);

    e.target.value = "";
  };

  return (
    <section className="rc-report-detail">
      {/* ================= HEADER ================= */}
      <header className="rc-report-header">
        <div className="rc-report-title">
          <div className="rc-report-icon">✔</div>

          <div>
            <h2>
              BÁO CÁO CỨU HỘ <span>#RSC-9921</span>
            </h2>
            <p>
              Kết thúc lúc 16:45, ngày 24/10/2023 · Phụ trách
              bởi: <b>Rescue Team Alpha</b>
            </p>
          </div>

          <span className="rc-status">HOÀN THÀNH</span>
        </div>

        <div className="rc-report-actions">
          <button className="btn-outline">
            ⬇ Xuất báo cáo ca cứu hộ
          </button>
          <button className="btn-primary">
            💾 Lưu hồ sơ
          </button>
        </div>
      </header>

      {/* ================= STATS ================= */}
      <div className="rc-report-stats">
        <div className="stat">
          <label>THỜI GIAN BẮT ĐẦU</label>
          <b>15:10</b>
          <span>24/10/2023</span>
        </div>

        <div className="stat">
          <label>THỜI GIAN KẾT THÚC</label>
          <b>16:45</b>
          <span>24/10/2023</span>
        </div>

        <div className="stat">
          <label>SỐ NGƯỜI ĐƯỢC CỨU</label>
          <b className="highlight">04</b>
          <span>thành viên</span>
        </div>

        <div className="stat">
          <label>TỔNG THỜI LƯỢNG</label>
          <b>01:35:20</b>
          <span className="success">ĐÚNG TIẾN ĐỘ</span>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="rc-report-grid">
        {/* LEFT */}
        <div className="rc-left">
          {/* MATERIALS */}
          <section className="rc-card">
            <h4>🧰 VẬT TƯ ĐÃ SỬ DỤNG</h4>

            <div className="rc-materials">
              <div className="material">
                🚤 Ca nô cứu hộ <b>01</b> chiếc
              </div>
              <div className="material">
                🦺 Áo phao cứu sinh <b>06</b> bộ
              </div>
              <div className="material">
                🩹 Túi sơ cứu loại A <b>01</b> túi
              </div>
              <div className="material">
                🍞 Gói lương thực khô <b>12</b> phần
              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="rc-card">
  <h4>🖼 HÌNH ẢNH KẾT QUẢ CỨU TRỢ</h4>

  <div className="rc-images">
    {images.map((img) => {
      if (img.type === "map") {
        return (
          <div key={img.id} className="img map">
            <iframe
              title="map-result"
              src={img.src}
              loading="lazy"
            />
          </div>
        );
      }

      return (
        <div
          key={img.id}
          className="img avatar"
          style={{
            backgroundImage: `url(${img.src})`,
          }}
        />
      );
    })}

    {/* UPLOAD */}
    <div className="img upload">+ Thêm ảnh</div>
  </div>
</section>

        </div>

        {/* RIGHT */}
        <div className="rc-right">
          {/* CONFIRM */}
          <section className="rc-card confirm">
            <h4>✔ XÁC NHẬN TỪ NGƯỜI DÂN</h4>

            <div className="confirm-user">
              <div className="avatar-sm" />
              <div>
                <b>Trần Thị Thuận</b>
                <p>
                  “Đã nhận đủ hỗ trợ và được di dời an
                  toàn. Đội cứu hộ rất nhiệt tình và
                  chuyên nghiệp.”
                </p>
              </div>
            </div>

            <div className="signature">
              <span>CHỮ KÝ ĐIỆN TỬ</span>
              <b>T.T.Thuận</b>
              <p>Xác nhận lúc 16:50 - 24/10/2023</p>
            </div>
          </section>

          {/* NOTE */}
          <section className="rc-card">
            <h4>📝 GHI CHÚ TỪ RESCUE TEAM</h4>
            <p className="note">
              “Khu vực Phường 4 hẻm nhỏ, khó di chuyển
              bằng ca nô lớn. Đã sử dụng thuyền chèo tay
              hỗ trợ thêm. 2 cụ già sức khỏe ổn định sau
              khi được đưa về trạm xá.”
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
