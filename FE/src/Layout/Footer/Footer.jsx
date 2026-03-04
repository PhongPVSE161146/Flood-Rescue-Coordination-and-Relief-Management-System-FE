import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaShareAlt,
  FaGlobe,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <div className="brand">
            <div className="logo">✱</div>
            <div>
              <h3>CỨU HỘ VIỆT NAM</h3>
              <span>HỆ THỐNG QUỐC GIA TRỰC TUYẾN</span>
            </div>
          </div>

          <p className="mission">
            “Sứ mệnh của chúng tôi là không để bất kỳ ai bị bỏ lại
            phía sau khi gặp sự cố trên mọi nẻo đường của Tổ quốc.”
          </p>

          <div className="socials">
            <button><FaFacebookF /></button>
            <button><FaShareAlt /></button>
            <button><FaGlobe /></button>
          </div>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>DỊCH VỤ</h4>
          <ul>
            <li>Cứu hộ Ô tô</li>
            <li>Cứu hộ Xe máy</li>
            <li>Y tế khẩn cấp</li>
            <li>Cứu nạn thiên tai</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h4>PHÁP LÝ</h4>
          <ul>
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Giấy phép hoạt động</li>
            <li>Khiếu nại & Góp ý</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <span className="contact-title">LIÊN HỆ TRỰC TIẾP</span>

          <div className="hotline-box">
            <small>TỔNG ĐÀI 24/7</small>
            <h2>1900 8888</h2>
            <div className="address">
              <FaMapMarkerAlt />
              <span>
                Tầng 10, Tòa nhà Công nghệ, <br />
                Cầu Giấy, Hà Nội
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <span> © 2026 CỨU HỘ VIỆT NAM. ĐÃ ĐĂNG KÝ BẢN QUYỀN.</span>

        <div className="bottom-right">
          <span>CHÍNH SÁCH BẢO MẬT</span>
          <span>ĐIỀU KHOẢN SỬ DỤNG</span>
          <span className="status">
            TRẠNG THÁI: <strong>Hoạt Động</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
