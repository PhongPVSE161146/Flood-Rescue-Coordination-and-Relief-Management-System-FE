import "./MissionInProgress.css";

export default function MissionInProgress() {
  return (
    <section className="rp-root">
      {/* HEADER */}
      <header className="rp-header">
        <div>
          <h2>
            Cháy Nhà Dân Cư <span>#REQ-9921</span>
          </h2>
          <p>
            <span className="rp-dot" /> ĐANG THỰC THI · Thời gian đã trôi qua: 08:42
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
            <b>Trần Thị Thu Hương</b>
            <p>Trạng thái: Còn bị thương, bị kẹt</p>
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
            src="https://www.google.com/maps?q=10.7731,106.7031&z=13&output=embed"
          />
        </main>
      </div>

      {/* PROGRESS */}
      <div className="rp-progress">
        <div className="done">Đã xuất phát</div>
        <div className="done">Đã đến hiện trường</div>
        <div className="active">Đang cứu hộ</div>
        <div>Hoàn thành</div>
      </div>

      {/* FOOTER */}
      <footer className="rp-footer">
        <span>📍 Vị trí đội: Cầu Khánh Hội · Team A</span>
        <div>
          <button className="rp-help">YÊU CẦU HỖ TRỢ</button>
          <button className="rp-done">HOÀN THÀNH NHIỆM VỤ</button>
        </div>
      </footer>
    </section>
  );
}
