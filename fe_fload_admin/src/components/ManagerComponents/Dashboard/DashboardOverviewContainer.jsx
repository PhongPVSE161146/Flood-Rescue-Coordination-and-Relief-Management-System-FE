import { useState } from "react";
import { Card, Progress, Tag, Button, Drawer } from "antd";
import "../../../pages/Manager/Dashboard/DashboardOverview.css";
import {
  PlayCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  CloseOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../../pages/Manager/Dashboard/DashboardOverview.css";

/* ================= DATA ================= */

// UC-M11: Hiệu suất cứu hộ theo ngày (%)
const rescuePerformanceData = [
  { day: "Thứ 2", value: 62 },
  { day: "Thứ 3", value: 78 },
  { day: "Thứ 4", value: 70 },
  { day: "Thứ 5", value: 88 },
  { day: "Thứ 6", value: 66 },
  { day: "Thứ 7", value: 72 },
  { day: "CN", value: 90 },
];

// UC-M13: Thống kê nhiệm vụ theo tuần
const rescueStatisticData = [
  { week: "Tuần 1", value: 24 },
  { week: "Tuần 2", value: 36 },
  { week: "Tuần 3", value: 28 },
  { week: "Tuần 4", value: 40 },
];

export default function DashboardOverviewContainer() {
  const navigate = useNavigate();
  const [selectedModal, setSelectedModal] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleStatClick = (type) => {
    setSelectedModal(type);
    setDrawerVisible(true);
  };

  const handleClose = () => {
    setDrawerVisible(false);
    setSelectedModal(null);
  };

  const handleNavigate = (path) => {
    setDrawerVisible(false);
    setSelectedModal(null);
    navigate(path);
  };

  return (
    <div className="dashboard">
      {/* ===== TOP STATS ===== */}
      <div className="stat-grid">
        <div onClick={() => handleStatClick("missions")}>
          <StatCard
            title="NHIỆM VỤ ĐANG CHẠY"
            value="24"
            change="+5.2%"
            icon={<PlayCircleOutlined />}
            color="green"
          />
        </div>

        <div onClick={() => handleStatClick("vehicles-ready")}>
          <StatCard
            title="PHƯƠNG TIỆN SẴN SÀNG"
            value="15"
            change="-2 v.x"
            icon={<CarOutlined />}
            color="red"
          />
        </div>

        <div onClick={() => handleStatClick("vehicles-ready-action")}>
          <StatCard
            title="PHƯƠNG TIỆN SẴN SÀNG HÀNH ĐỘNG"
            value="08"
            icon={<CarOutlined />}
            color="blue"
          />
        </div>

        <div onClick={() => handleStatClick("vehicles-maintenance")}>
          <StatCard
            title="ĐANG BẢO TRÌ"
            value="04"
            icon={<ToolOutlined />}
            color="orange"
          />
        </div>

        <div onClick={() => handleStatClick("approvals")}>
          <StatCard
            title="PHÊ DUYỆT CHỜ XỬ LÝ"
            value="08"
            change="+12%"
            icon={<CheckCircleOutlined />}
            color="green"
          />
        </div>

        <div onClick={() => handleStatClick("inventory")}>
          <StatCard
            title="MỨC TỒN KHO THIẾT YẾU"
            value="82%"
            icon={<BarChartOutlined />}
            progress={82}
          />
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="chart-grid">
        {/* ===== UC-M11 ===== */}
        <Card className="chart-card">
          <div className="chart-header">
            <div>
              <h4>Hiệu suất cứu hộ (UC-M11)</h4>
              <span>Tỉ lệ hoàn thành nhiệm vụ theo thời gian</span>
            </div>
            <Tag>7 ngày qua</Tag>
          </div>

          <div className="fake-chart">
            <svg viewBox="0 0 700 200" width="100%" height="200">
              <polyline
                fill="none"
                stroke="#2f4f4f"
                strokeWidth="3"
                points={rescuePerformanceData
                  .map((d, i) => {
                    const x =
                      (i / (rescuePerformanceData.length - 1)) * 700;
                    const y = 200 - (d.value / 100) * 180;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            </svg>

            <div className="chart-labels">
              {rescuePerformanceData.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* ===== UC-M13 ===== */}
        <Card className="chart-card">
          <div className="chart-header">
            <div>
              <h4>Thống kê nhiệm vụ (UC-M13)</h4>
              <span>Số lượng điều động theo tuần</span>
            </div>
            <div className="total">
              <strong>
                {rescueStatisticData.reduce(
                  (sum, item) => sum + item.value,
                  0
                )}
              </strong>
              <span>TỔNG THÁNG</span>
            </div>
          </div>

          <div className="bar-placeholder">
            {rescueStatisticData.map((item) => (
              <div key={item.week} className="bar-item">
                <div
                  className="bar"
                  style={{ height: `${item.value * 2}px` }}
                />
                <span>{item.week}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== TABLE ===== */}
      <Card className="table-card">
        <div className="table-tabs">
          <span className="active">🚑 Phương tiện (UC-M01)</span>
          <span>📦 Kho cứu trợ (UC-M05)</span>
          <span>
            ✅ Phê duyệt phân phối (UC-M20)
            <Tag color="red">8</Tag>
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>MÃ HIỆU</th>
              <th>LOẠI PHƯƠNG TIỆN</th>
              <th>TRẠNG THÁI</th>
              <th>NHÂN SỰ PHỤ TRÁCH</th>
              <th>VỊ TRÍ HIỆN TẠI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="code">VN-RSC-001</td>
              <td>Cano Cứu hộ Cao tốc</td>
              <td><Tag color="green">SẴN SÀNG</Tag></td>
              <td>
                <span className="user-dot" />
                Trần Văn Nam
              </td>
              <td>
                <EnvironmentOutlined /> Bến Bạch Đằng
              </td>
              <td><MoreOutlined /></td>
            </tr>

            <tr>
              <td className="code">VN-RSC-005</td>
              <td>Xe Cứu thương 4x4</td>
              <td><Tag color="blue">ĐANG SỬ DỤNG</Tag></td>
              <td>
                <span className="user-dot dark" />
                Lê Thị Hoa
              </td>
              <td>
                <EnvironmentOutlined /> Vùng tâm bão B1
              </td>
              <td><MoreOutlined /></td>
            </tr>

            <tr>
              <td className="code">VN-RSC-012</td>
              <td>Trực thăng Cứu hộ H-12</td>
              <td><Tag color="gold">BẢO TRÌ</Tag></td>
              <td>
                <span className="user-dot gray" />
                Nguyễn Văn Kỳ
              </td>
              <td>
                <EnvironmentOutlined /> Hangar khu A
              </td>
              <td><MoreOutlined /></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* ===== DRAWER - DETAIL VIEW ===== */}
      <Drawer
        title={getDrawerTitle(selectedModal)}
        placement="right"
        onClose={handleClose}
        open={drawerVisible}
        width={800}
        extra={
          <CloseOutlined
            onClick={handleClose}
            style={{ cursor: "pointer" }}
          />
        }
      >
        {selectedModal === "missions" && (
          <MissionsDetail onNavigate={handleNavigate} />
        )}
        {selectedModal === "vehicles-ready" && (
          <VehiclesReadyDetail onNavigate={handleNavigate} />
        )}
        {selectedModal === "vehicles-ready-action" && (
          <VehiclesReadyActionDetail onNavigate={handleNavigate} />
        )}
        {selectedModal === "vehicles-maintenance" && (
          <VehiclesMaintenanceDetail onNavigate={handleNavigate} />
        )}
        {selectedModal === "approvals" && (
          <ApprovalsDetail onNavigate={handleNavigate} />
        )}
        {selectedModal === "inventory" && (
          <InventoryDetail onNavigate={handleNavigate} />
        )}
      </Drawer>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

function getDrawerTitle(type) {
  const titles = {
    missions: "🎯 Chi tiết Nhiệm vụ đang chạy",
    "vehicles-ready": "🚗 Phương tiện sẵn sàng điều động",
    "vehicles-ready-action": "🚔 Phương tiện sẵn sàng hành động",
    "vehicles-maintenance": "🔧 Phương tiện đang bảo trì",
    approvals: "✅ Chi tiết Phê duyệt chờ xử lý",
    inventory: "📦 Chi tiết Tồn kho thiết yếu",
  };
  return titles[type] || "";
}

function StatCard({ title, value, change, icon, color, progress }) {
  return (
    <Card
      className="stat-card"
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(59, 130, 246, 0.3)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.transform = "";
      }}
    >
      <div className="stat-header">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>

      <div className="stat-body">
        <h2>{value}</h2>
        {change && (
          <span className={`change ${color}`}>{change}</span>
        )}
        {progress && <Progress percent={progress} showInfo={false} />}
      </div>
    </Card>
  );
}

/* ===== MISSIONS DETAIL ===== */
function MissionsDetail({ onNavigate }) {
  const missionsData = [
    {
      id: "MV-001",
      title: "Sơ tán dân cư khu vực B-1",
      status: "in-progress",
      team: "ALPHA TEAM",
      progress: 65,
      people: 45,
      startTime: "08:30",
    },
    {
      id: "MV-002",
      title: "Khảo sát thiệt hại khu vực D-2",
      status: "in-progress",
      team: "DELTA MED",
      progress: 40,
      people: 12,
      startTime: "09:15",
    },
    {
      id: "MV-003",
      title: "Cấp cứu y tế vùng sạt lở",
      status: "in-progress",
      team: "K9 RESCUE",
      progress: 80,
      people: 8,
      startTime: "07:45",
    },
    {
      id: "MV-004",
      title: "Cung cấp lương thực khu vực A-5",
      status: "in-progress",
      team: "LOGISTICS",
      progress: 55,
      people: 6,
      startTime: "09:00",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Danh sách các nhiệm vụ đang thực hiện trong khoảng 24h qua
        </p>
      </div>

      {missionsData.map((mission) => (
        <div
          key={mission.id}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{mission.title}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {mission.id} • {mission.team}
              </p>
            </div>
            <Tag color="blue">ĐANG CHẠY</Tag>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <span>Tiến độ: {mission.progress}%</span>
            <span>{mission.people} người • Bắt đầu {mission.startTime}</span>
          </div>

          <Progress
            percent={mission.progress}
            showInfo={false}
            strokeColor="#3b82f6"
          />
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager")}
      >
        Xem tất cả nhiệm vụ
      </Button>
    </div>
  );
}

/* ===== VEHICLES READY DETAIL ===== */
function VehiclesReadyDetail({ onNavigate }) {
  const vehiclesData = [
    {
      id: "VN-RSC-001",
      name: "Cano Cứu hộ Cao tốc SeaGuard",
      type: "Cano",
      status: "ready",
      location: "Bến Bạch Đằng, Q.1",
      driver: "Trần Văn Nam",
      fuel: "95%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-024",
      name: "Xe lội nước đặc chủng 6x6",
      type: "Xe lội nước",
      status: "ready",
      location: "Trạm Cứu hộ Nhà Bè",
      driver: "Lê Văn Kiên",
      fuel: "80%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-007",
      name: "Xe cứu thương Mercedes 4x4",
      type: "Xe cứu thương",
      status: "ready",
      location: "Bệnh viện Y học Cộng đồng",
      driver: "Nguyễn Thị Hương",
      fuel: "85%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-015",
      name: "Xe tải chuyên dụng 5 tấn",
      type: "Xe tải",
      status: "ready",
      location: "Kho cứu trợ Quận 7",
      driver: "Phạm Văn Hoàng",
      fuel: "70%",
      condition: "Tốt",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Danh sách phương tiện sẵn sàng điều động trong khu vực
        </p>
      </div>

      {vehiclesData.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{vehicle.name}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {vehicle.id} • {vehicle.type}
              </p>
            </div>
            <Tag color="green">SẴN SÀNG</Tag>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <span>🚗 {vehicle.driver}</span>
            <span>⛽ {vehicle.fuel}</span>
            <span>⚙️ {vehicle.condition}</span>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            📍 {vehicle.location}
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/vehicles")}
      >
        Quản lý phương tiện
      </Button>
    </div>
  );
}

/* ===== VEHICLES READY ACTION DETAIL ===== */
function VehiclesReadyActionDetail({ onNavigate }) {
  const vehiclesData = [
    {
      id: "VN-RSC-001",
      name: "Cano Cứu hộ Cao tốc SeaGuard",
      type: "Cano",
      status: "ready-action",
      location: "Bến Bạch Đằng, Q.1",
      driver: "Trần Văn Nam",
      fuel: "95%",
      condition: "Tốt",
      team: "ALPHA TEAM",
    },
    {
      id: "VN-RSC-024",
      name: "Xe lội nước đặc chủng 6x6",
      type: "Xe lội nước",
      status: "ready-action",
      location: "Trạm Cứu hộ Nhà Bè",
      driver: "Lê Văn Kiên",
      fuel: "80%",
      condition: "Tốt",
      team: "DELTA MED",
    },
    {
      id: "VN-RSC-007",
      name: "Xe cứu thương Mercedes 4x4",
      type: "Xe cứu thương",
      status: "ready-action",
      location: "Bệnh viện Y học Cộng đồng",
      driver: "Nguyễn Thị Hương",
      fuel: "85%",
      condition: "Tốt",
      team: "K9 RESCUE",
    },
    {
      id: "VN-RSC-015",
      name: "Xe tải chuyên dụng 5 tấn",
      type: "Xe tải",
      status: "ready-action",
      location: "Kho cứu trợ Quận 7",
      driver: "Phạm Văn Hoàng",
      fuel: "70%",
      condition: "Tốt",
      team: "LOGISTICS",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Phương tiện đã được phân công và sẵn sàng hành động
        </p>
      </div>

      {vehiclesData.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{vehicle.name}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {vehicle.id} • {vehicle.type}
              </p>
            </div>
            <Tag color="blue">SẴN SÀNG HÀNH ĐỘNG</Tag>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <span>🚗 {vehicle.driver}</span>
            <span>⛽ {vehicle.fuel}</span>
            <span>⚙️ {vehicle.condition}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <span>📍 {vehicle.location}</span>
            <span>👥 {vehicle.team}</span>
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/vehicles")}
      >
        Quản lý phương tiện
      </Button>
    </div>
  );
}

/* ===== VEHICLES MAINTENANCE DETAIL ===== */
function VehiclesMaintenanceDetail({ onNavigate }) {
  const vehiclesData = [
    {
      id: "VN-RSC-012",
      name: "Trực thăng Cứu hộ H-12",
      type: "Trực thăng",
      status: "maintenance",
      location: "Hangar khu A",
      technician: "Nguyễn Văn Kỳ",
      issue: "Bảo trì định kỳ",
      eta: "2 ngày",
    },
    {
      id: "VN-RSC-019",
      name: "Xe cứu thương Toyota Hiace",
      type: "Xe cứu thương",
      status: "maintenance",
      location: "Garage Quận 7",
      technician: "Trần Thị Lan",
      issue: "Thay thế lốp xe",
      eta: "1 ngày",
    },
    {
      id: "VN-RSC-003",
      name: "Cano cứu hộ nhỏ",
      type: "Cano",
      status: "maintenance",
      location: "Trạm Cứu hộ Nhà Bè",
      technician: "Lê Văn Minh",
      issue: "Sửa chữa động cơ",
      eta: "3 ngày",
    },
    {
      id: "VN-RSC-008",
      name: "Xe tải 3 tấn",
      type: "Xe tải",
      status: "maintenance",
      location: "Kho cứu trợ Quận 7",
      technician: "Phạm Văn Hoàng",
      issue: "Kiểm tra hệ thống điện",
      eta: "1 ngày",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Phương tiện đang trong quá trình bảo trì và sửa chữa
        </p>
      </div>

      {vehiclesData.map((vehicle) => (
        <div
          key={vehicle.id}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{vehicle.name}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {vehicle.id} • {vehicle.type}
              </p>
            </div>
            <Tag color="gold">ĐANG BẢO TRÌ</Tag>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <span>🔧 {vehicle.technician}</span>
            <span>⏱️ {vehicle.eta}</span>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            📍 {vehicle.location} • {vehicle.issue}
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/vehicles")}
      >
        Quản lý phương tiện
      </Button>
    </div>
  );
}

/* ===== APPROVALS DETAIL ===== */
function ApprovalsDetail({ onNavigate }) {
  const approvalsData = [
    {
      id: "AP-001",
      title: "Phân phối lương thực khu vực A-5",
      requester: "Nguyễn Văn An",
      team: "LOGISTICS",
      items: "Gạo, nước uống, thuốc men",
      quantity: "500 phần",
      urgency: "Cao",
      requestedAt: "10:30",
    },
    {
      id: "AP-002",
      title: "Điều động xe cứu thương khu vực B-1",
      requester: "Trần Thị Bình",
      team: "DELTA MED",
      items: "Xe cứu thương VN-RSC-007",
      quantity: "1 xe",
      urgency: "Cao",
      requestedAt: "09:15",
    },
    {
      id: "AP-003",
      title: "Triển khai đội cứu hộ khu vực D-2",
      requester: "Lê Văn Cường",
      team: "ALPHA TEAM",
      items: "Đội cứu hộ 12 người",
      quantity: "1 đội",
      urgency: "Trung bình",
      requestedAt: "08:45",
    },
    {
      id: "AP-004",
      title: "Cấp phát thuốc men khu vực C-3",
      requester: "Phạm Thị Dung",
      team: "K9 RESCUE",
      items: "Thuốc, băng gạc, dụng cụ y tế",
      quantity: "200 phần",
      urgency: "Trung bình",
      requestedAt: "11:00",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Danh sách yêu cầu phê duyệt đang chờ xử lý
        </p>
      </div>

      {approvalsData.map((approval) => (
        <div
          key={approval.id}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{approval.title}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {approval.id} • {approval.team}
              </p>
            </div>
            <Tag color={approval.urgency === "Cao" ? "red" : "orange"}>
              {approval.urgency}
            </Tag>
          </div>

          <div
            style={{
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <div>📦 {approval.items}</div>
            <div>🔢 {approval.quantity}</div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <span>👤 {approval.requester}</span>
            <span>🕐 {approval.requestedAt}</span>
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/approve")}
      >
        Xem tất cả phê duyệt
      </Button>
    </div>
  );
}

/* ===== INVENTORY DETAIL ===== */
function InventoryDetail({ onNavigate }) {
  const inventoryData = [
    {
      item: "Gạo",
      current: 1200,
      minRequired: 1500,
      unit: "kg",
      status: "low",
      supplier: "Kho lương thực Q.7",
    },
    {
      item: "Nước uống",
      current: 800,
      minRequired: 1000,
      unit: "thùng",
      status: "low",
      supplier: "Kho nước Q.1",
    },
    {
      item: "Thuốc men",
      current: 450,
      minRequired: 500,
      unit: "hộp",
      status: "warning",
      supplier: "Bệnh viện Y học Cộng đồng",
    },
    {
      item: "Băng gạc",
      current: 200,
      minRequired: 300,
      unit: "cuốn",
      status: "low",
      supplier: "Trạm y tế Q.7",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Mức tồn kho của các vật phẩm thiết yếu
        </p>
      </div>

      {inventoryData.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{item.item}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {item.supplier}
              </p>
            </div>
            <Tag color={item.status === "low" ? "red" : "orange"}>
              {item.status === "low" ? "THIẾU" : "CẢNH BÁO"}
            </Tag>
          </div>

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <Progress
              percent={Math.round((item.current / item.minRequired) * 100)}
              showInfo={false}
              strokeColor={item.status === "low" ? "#ff4d4f" : "#faad14"}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <span>
              Hiện tại: {item.current} {item.unit}
            </span>
            <span>
              Cần tối thiểu: {item.minRequired} {item.unit}
            </span>
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/inventory")}
      >
        Quản lý kho
      </Button>
    </div>
  );
}
