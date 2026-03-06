import {
  FaLocationDot,
  FaBolt
} from "react-icons/fa6";

import "./NetworkSection.css";

const NetworkSection = () => {
  return (
    <section className="network-section">
      <div className="network-container">

        {/* LEFT */}
        <div className="network-left">

          <span className="network-tag">MẠNG LƯỚI BAO PHỦ</span>

          <h2 className="network-title">
            HỆ THỐNG ĐỘI CỨU HỘ <br />
            TRÊN KHẮP VIỆT NAM
          </h2>

          <p className="network-desc">
            Chúng tôi xây dựng mạng lưới liên kết chặt chẽ với hơn
            <strong> 500 gara</strong>, bệnh viện và đội tình nguyện tại
            <strong> 63 tỉnh thành</strong> để đảm bảo sự hỗ trợ nhanh nhất.
          </p>

          <div className="network-features">

            <div className="feature-item">
              <FaLocationDot className="feature-icon" />
              <div>
                <h4>ĐỊNH VỊ THÔNG MINH</h4>
                <p>Tự động xác định vị trí gặp nạn qua GPS của người dùng.</p>
              </div>
            </div>

            <div className="feature-item">
              <FaBolt className="feature-icon" />
              <div>
                <h4>PHẢN HỒI THẦN TỐC</h4>
                <p>Thời gian trung bình tiếp cận hiện trường dưới 20 phút.</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="network-right">

          <div className="map-card">

            <iframe
              title="Map Quận 1"
              src="https://maps.google.com/maps?q=quan%201%20ho%20chi%20minh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="map-frame"
              loading="lazy"
            ></iframe>

          </div>

        </div>

      </div>
    </section>
  );
};

export default NetworkSection;