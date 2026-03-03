export default function Sidebar() {
    const navigate = useNavigate();
  
    /* ===== LẤY USER TỪ API LOGIN ===== */
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = (localStorage.getItem("role") || "admin").toLowerCase();
    const menus = menuByRole[role] || [];
  
    const fullName = user.fullName || "Unknown User";
    const roleName = user.roleName || role;
  
    /* Avatar = 2 ký tự đầu tên */
    const avatarText = fullName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login", { replace: true });
    };
  
    return (
      <aside className="sidebar">
        {/* ================= MENU ================= */}
        <nav className="sidebar-menu">
          {menus.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
  
        {/* ================= FOOTER ================= */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{avatarText}</div>
            <div>
              <strong>{fullName}</strong>
              <p>{roleName}</p>
            </div>
          </div>
  
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    );
  }