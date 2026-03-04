'use client';

import { NavLink, useNavigate } from "react-router-dom";
import {
  LogoutOutlined,

  /* ADMIN */
  TeamOutlined,
  SettingOutlined,
  SafetyOutlined,
  FileTextOutlined,

  /* MANAGER */
  AppstoreOutlined,
  InboxOutlined,
  CheckSquareOutlined,
  UsergroupAddOutlined,
  CarOutlined,

  /* RESCUE */
  CarryOutOutlined,
  HistoryOutlined,
  MessageOutlined,
  UserOutlined,

  /* COORDINATOR */
  CheckCircleOutlined,
  GlobalOutlined,
  AimOutlined,
  BarChartOutlined,

} from "@ant-design/icons";

import { useState, useEffect } from "react";
import { getUserProfile } from "../../../api/axios/Auth/authApi";
import UserProfileModal from "../../components/UserComponents/UserProfileModal";
import "./Sidebar.css";

/* ================= MENU BY ROLE ================= */

const menuByRole = {
  admin: [
    {
      label: "Quản lý người dùng",
      icon: <TeamOutlined />,
      path: "/admin/user",
      end: true
    },
    {
      label: "Cấu hình tham số",
      icon: <SettingOutlined />,
      path: "/admin/settings"
    },
    {
      label: "Logs hệ thống",
      icon: <FileTextOutlined />,
      path: "/admin/logs"
    },
    {
      label: "Phân quyền nâng cao",
      icon: <SafetyOutlined />,
      path: "/admin/permissions"
    }
  ],

  manager: [
    {
      label: "Tổng quan",
      icon: <AppstoreOutlined />,
      path: "/manager",
      end: true
    },
    {
      label: "Phương tiện",
      icon: <CarOutlined />,
      path: "/manager/vehicles"
    },
    {
      label: "Kho hàng",
      icon: <InboxOutlined />,
      path: "/manager/inventory"
    },
    {
      label: "Phê duyệt",
      icon: <CheckSquareOutlined />,
      path: "/manager/approve"
    },
    {
      label: "Đội cứu hộ",
      icon: <UsergroupAddOutlined />,
      path: "/manager/rescue-team"
    }
  ],

  coordinator: [
    {
      label: "Xác minh yêu cầu",
      icon: <CheckCircleOutlined />,
      path: "/coordinator",
      end: true
    },
    {
      label: "Đang điều phối",
      icon: <GlobalOutlined />,
      path: "/coordinator/dang"
    },
    {
      label: "Đang cứu hộ",
      icon: <AimOutlined />,
      path: "/coordinator/mina"
    },
    {
      label: "Hoàn thành & báo cáo",
      icon: <BarChartOutlined />,
      path: "/coordinator/reports"
    },
    {
      label: "Tài nguyên",
      icon: <AppstoreOutlined />,
      path: "/coordinator/resources"
    }
  ],

  rescueteam: [
    {
      label: "Nhiệm vụ",
      icon: <CarryOutOutlined />,
      path: "/rescue",
      end: true
    },
    {
      label: "Đang cứu hộ",
      icon: <GlobalOutlined />,
      path: "/rescue/dangcuho"
    },
    {
      label: "Lịch sử",
      icon: <HistoryOutlined />,
      path: "/rescue/history"
    },
    {
      label: "Tin nhắn",
      icon: <MessageOutlined />,
      path: "/rescue/messages"
    },
    {
      label: "Cá nhân",
      icon: <UserOutlined />,
      path: "/rescue/profile"
    }
  ]
};

export default function Sidebar() {

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  /* USER LOCAL STORAGE */

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const role =
    (sessionStorage.getItem("role") || "admin")
      .toLowerCase();

  const fullName = user.fullName || "Unknown User";
  const roleName = user.roleName || role;

  const menus = menuByRole[role] || [];

  /* PROFILE STATE */

  const [userProfile, setUserProfile] = useState({
    fullName: "Loading...",
    roleName: ""
  });

  /* LOAD PROFILE */

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
    } catch {
      console.error("Load profile failed");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* AVATAR TEXT */

  const avatarText =
    userProfile.fullName
      ?.split(" ")
      ?.map(w => w[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase()
    || "U";

  /* LOGOUT */

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">

      {/* MENU */}

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

            <span className="menu-icon">
              {item.icon}
            </span>

            <span className="menu-label">
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* FOOTER */}

      <div className="sidebar-footer">

        <div
          className="user-info"
          onClick={() => setProfileOpen(true)}
          style={{ cursor: "pointer" }}
        >

          <div className="avatar">
            {avatarText}
          </div>

          <div>
            <strong>
              {userProfile.fullName}
            </strong>

            <p>
              {roleName}
            </p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <LogoutOutlined />
          <span>Đăng xuất</span>

        </button>

      </div>

      {/* PROFILE MODAL */}

      <UserProfileModal
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          loadProfile();
        }}
      />

    </aside>
  );
}