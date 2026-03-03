import "./MapHeader.css";
import { NavLink, Link } from "react-router-dom";

const MapHeader = () => {
  return (
    <header className="map-header">
      {/* LEFT */}
      <div className="left">
        <div className="logo">📍</div>
        <div className="title">
          <h3>BẢN ĐỒ CỨU HỘ</h3>
          <span>HỆ THỐNG TRỰC TUYẾN</span>
        </div>
      </div>

      {/* CENTER NAV */}
    
      <nav className="center">
      <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Trang Chủ
        </NavLink>
        <NavLink
          to="/map"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Bản đồ
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Đội cứu trợ
        </NavLink>

     
      </nav>

      {/* RIGHT */}
      <div className="right">
        <Link to="/emergency" className="btn-primary">
          🔔 GỬI YÊU CẦU CỨU TRỢ
        </Link>
        <div className="avatar">👤</div>
      </div>
    </header>
  );
};

export default MapHeader;
