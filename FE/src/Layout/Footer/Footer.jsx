import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaShareAlt,
  FaGlobe,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {

  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = "tel:19008888";
  };

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

            <button onClick={() => window.open("https://facebook.com")}>
              <FaFacebookF />
            </button>

            <button onClick={() => navigator.share?.({
              title: "Cứu hộ Việt Nam",
              url: window.location.href
            })}>
              <FaShareAlt />
            </button>

            <button onClick={() => navigate("/")}>
              <FaGlobe />
            </button>

          </div>

        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>DỊCH VỤ</h4>

          <ul>
            <li onClick={() => navigate("/rescue-car")}>Cứu hộ Ô tô</li>
            <li onClick={() => navigate("/rescue-motorbike")}>Cứu hộ Xe máy</li>
            <li onClick={() => navigate("/medical")}>Y tế khẩn cấp</li>
            <li onClick={() => navigate("/disaster")}>Cứu nạn thiên tai</li>
          </ul>

        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h4>PHÁP LÝ</h4>

          <ul>
            <li onClick={() => navigate("/terms")}>Điều khoản sử dụng</li>
            <li onClick={() => navigate("/privacy")}>Chính sách bảo mật</li>
            <li onClick={() => navigate("/license")}>Giấy phép hoạt động</li>
            <li onClick={() => navigate("/feedback")}>Khiếu nại & Góp ý</li>
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

        <span>© 2026 CỨU HỘ VIỆT NAM. ĐÃ ĐĂNG KÝ BẢN QUYỀN.</span>

        <div className="bottom-right">

          <span onClick={() => navigate("/privacy")}>
            CHÍNH SÁCH BẢO MẬT
          </span>

          <span onClick={() => navigate("/terms")}>
            ĐIỀU KHOẢN SỬ DỤNG
          </span>

          <span className="status">
            TRẠNG THÁI: <strong>Hoạt Động</strong>
          </span>

        </div>

      </div>

    </footer>
  );
};

export default Footer;