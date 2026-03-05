import "./EmergencyHeader.css";
import { Link } from "react-router-dom";

const EmergencyHeader = () => {
  return (
    <header className="emergency-header">
      {/* LOGO */}
      <Link to="/" className="logo">
        ✱ CỨU HỘ KHẨN CẤP
      </Link>

      {/* NAV */}
      <nav>
        <Link to="/">TRANG CHỦ</Link>
        <Link to="/map">BẢN ĐỒ CỨU TRỢ</Link>
        <Link to="/guide">HƯỚNG DẪN</Link>
      </nav>

      {/* HOTLINE */}
      <a href="tel:18001111" className="hotline-btn">
        📞 HOTLINE: 1800-1111
      </a>
    </header>
  );
};

export default EmergencyHeader;
