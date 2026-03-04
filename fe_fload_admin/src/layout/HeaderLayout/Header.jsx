import { Input, Badge } from "antd";
import {
  BellOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import "./rc-hd.header.css";

export default function Header() {
  const role = sessionStorage.getItem("role") || "admin";

  const roleInfo = {
    admin: {
      title: " Admin",
      subtitle: "System Management",
      icon: "🛡️",
    },
    manager: {
      title: "Rescue Manager",
      subtitle: "Operation Management",
      icon: "📊",
    },
    coordinator: {
      title: "Rescue Coordinator",
      subtitle: "Dispatch & Monitoring",
      icon: "🗺️",
    },
    rescueteam: {
      title: "Rescue Team",
      subtitle: "Field Operations",
      icon: "🚑",
    },
  };

  const currentRole = roleInfo[role] || roleInfo.admin;

  return (
    <header className="rc-hd">
      {/* ===== LEFT ===== */}
      <div className="rc-hd__left">
        <div className="rc-hd__logo-icon">
          {currentRole.icon}
        </div>

        <div className="rc-hd__logo-text">
          <h3>{currentRole.title}</h3>
          <span>{currentRole.subtitle}</span>
        </div>
      </div>

      {/* ===== CENTER ===== */}
      <Input.Search
        placeholder="Tìm kiếm người dùng theo tên, email, ID..."
        className="rc-hd__search"
      />

      {/* ===== RIGHT ===== */}
      <div className="rc-hd__actions">
        <Badge dot>
          <BellOutlined className="rc-hd__icon" />
        </Badge>

        <QuestionCircleOutlined className="rc-hd__icon" />

        <span className="rc-hd__lang">
          LANGUAGE: VN
        </span>
      </div>
    </header>
  );
}
