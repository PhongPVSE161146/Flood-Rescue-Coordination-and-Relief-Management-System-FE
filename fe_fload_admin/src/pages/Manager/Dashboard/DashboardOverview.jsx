import { useState } from "react";
import { Card, Progress, Tag, Button, Drawer } from "antd";
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
import "./DashboardOverview.css";

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

export default function DashboardOverview() {
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
          Danh sách {vehiclesData.length} phương tiện sẵn sàng có thể điều động ngay lập tức
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
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "12px",
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
                {vehicle.id}
              </p>
            </div>
            <Tag color="green">SẴN SÀNG</Tag>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <span style={{ color: "#64748b", fontWeight: "500" }}>📍 Vị trí:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.location}</p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontWeight: "500" }}>👤 Lái xe:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.driver}</p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontWeight: "500" }}>⛽ Xăng:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.fuel}</p>
            </div>
            <div>
              <span style={{ color: "#64748b", fontWeight: "500" }}>🔧 Tình trạng:</span>
              <p style={{ margin: "4px 0 0", color: "#16a34a" }}>{vehicle.condition}</p>
            </div>
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
      id: "VN-RSC-025",
      name: "Xe cứu thương Mercedes 4x4",
      type: "Xe cứu thương",
      status: "ready-action",
      location: "Trạm Quận 1",
      driver: "Phạm Văn Tú",
      fuel: "92%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-026",
      name: "Cano tuần tra nhanh",
      type: "Cano",
      status: "ready-action",
      location: "Bến Cát Lái, Q.2",
      driver: "Trương Văn Hùng",
      fuel: "88%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-027",
      name: "Xe thang cứu hộ 32m",
      type: "Xe chuyên dụng",
      status: "ready-action",
      location: "Trạm Quận 3",
      driver: "Võ Thị Phương",
      fuel: "82%",
      condition: "Tốt",
    },
    {
      id: "VN-RSC-028",
      name: "Xe máy bơm chữa cháy",
      type: "Xe chuyên dụng",
      status: "ready-action",
      location: "Trạm Quận 5",
      driver: "Hoàng Văn Đức",
      fuel: "90%",
      condition: "Tốt",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Danh sách {vehiclesData.length} phương tiện sẵn sàng hành động tích cực
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
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "12px",
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
                {vehicle.id}
              </p>
            </div>
            <Tag color="blue">SẴN SÀNG HÀNH ĐỘNG</Tag>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "4px" }}>📍 Vị trí</div>
              {vehicle.location}
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "4px" }}>👤 Lái xe</div>
              {vehicle.driver}
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "4px" }}>⛽ Nhiên liệu</div>
              {vehicle.fuel}
            </div>
            <div>
              <div style={{ color: "#94a3b8", marginBottom: "4px" }}>✅ Tình trạng</div>
              {vehicle.condition}
            </div>
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
      name: "Trực thăng Cứu nạn Eurocopter 135",
      type: "Trực thăng",
      status: "maintenance",
      location: "Hangar A, Sân bay TSN",
      maintenanceType: "Bảo dưỡng định kỳ",
      expectedDate: "25/01/2026",
      progress: 60,
    },
    {
      id: "VN-RSC-009",
      name: "Xe Cứu thương Ford Transit",
      type: "Xe cứu thương",
      status: "maintenance",
      location: "Trạm sửa chữa Quận 1",
      maintenanceType: "Sửa chữa động cơ",
      expectedDate: "28/01/2026",
      progress: 45,
    },
    {
      id: "VN-RSC-018",
      name: "Cano tuần tra nhanh",
      type: "Cano",
      status: "maintenance",
      location: "Bến sửa chữa Nhà Bè",
      maintenanceType: "Thay thế mô-tơ",
      expectedDate: "22/01/2026",
      progress: 80,
    },
    {
      id: "VN-RSC-031",
      name: "Xe thang cứu hộ 32m",
      type: "Xe thang",
      status: "maintenance",
      location: "Hangar B, Sân bay TSN",
      maintenanceType: "Kiểm tra toàn bộ",
      expectedDate: "30/01/2026",
      progress: 30,
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Danh sách {vehiclesData.length} phương tiện đang được bảo trì
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
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "12px",
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
                {vehicle.id}
              </p>
            </div>
            <Tag color="orange">BẢO TRÌ</Tag>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              marginBottom: "12px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>🔧 Loại bảo trì:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.maintenanceType}</p>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>📍 Địa điểm:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.location}</p>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>📅 Dự kiến hoàn thành:</span>
              <p style={{ margin: "4px 0 0" }}>{vehicle.expectedDate}</p>
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#64748b" }}>Tiến độ:</span>
              <span style={{ fontWeight: "500" }}>{vehicle.progress}%</span>
            </div>
            <Progress
              percent={vehicle.progress}
              showInfo={false}
              strokeColor={
                vehicle.progress < 50
                  ? "#faad14"
                  : vehicle.progress < 80
                  ? "#1890ff"
                  : "#52c41a"
              }
            />
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

/* ===== VEHICLES DETAIL (Cũ - để tương thích) ===== */
function VehiclesDetail({ onNavigate }) {
  return <VehiclesReadyDetail onNavigate={onNavigate} />;
}

/* ===== APPROVALS DETAIL ===== */
function ApprovalsDetail({ onNavigate }) {
  const approvalsData = [
    {
      id: "PAP-001",
      unit: "Đội Cứu hộ Quận 8",
      requester: "Nguyễn Văn A",
      item: "Nước uống đóng chai",
      quantity: "500 Lít",
      priority: "KHẨN CẤP",
      createdAt: "14:30 hôm nay",
    },
    {
      id: "PAP-002",
      unit: "Trạm Y tế Phường 15",
      requester: "BS. Lê Thị B",
      item: "Túi sơ cứu loại A",
      quantity: "20 Bộ",
      priority: "CAO",
      createdAt: "13:45 hôm nay",
    },
    {
      id: "PAP-003",
      unit: "Nhóm Tình nguyện Xanh",
      requester: "Trần Văn C",
      item: "Lương thực khô",
      quantity: "100 Gói",
      priority: "TRUNG BÌNH",
      createdAt: "12:20 hôm nay",
    },
    {
      id: "PAP-004",
      unit: "Trung tâm Sơ cấp cứu Q.1",
      requester: "ThS. Phạm Liên",
      item: "Nước rửa tay khô",
      quantity: "50 Chai",
      priority: "CAO",
      createdAt: "11:15 hôm nay",
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          {approvalsData.length} yêu cầu phê duyệt đang chờ xử lý
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
              <strong>{approval.item}</strong>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "4px 0 0",
                }}
              >
                {approval.unit}
              </p>
            </div>
            <Tag
              color={
                approval.priority === "KHẨN CẤP"
                  ? "red"
                  : approval.priority === "CAO"
                  ? "orange"
                  : "default"
              }
            >
              {approval.priority}
            </Tag>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div>
              <span style={{ color: "#64748b" }}>📊 Số lượng:</span>
              <p>{approval.quantity}</p>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>⏰ Yêu cầu lúc:</span>
              <p>{approval.createdAt}</p>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/approve")}
      >
        Xem chi tiết & Phê duyệt
      </Button>
    </div>
  );
}

/* ===== INVENTORY DETAIL ===== */
function InventoryDetail({ onNavigate }) {
  const inventoryData = [
    {
      name: "Nước uống đóng chai",
      stock: "12,400 L",
      status: "ok",
      level: 85,
    },
    {
      name: "Lương thực khô",
      stock: "2,150 Gói",
      status: "warning",
      level: 45,
    },
    {
      name: "Y tế Túi sơ cứu",
      stock: "480 Bộ",
      status: "ok",
      level: 75,
    },
    {
      name: "Áo phao cứu sinh",
      stock: "320 Chiếc",
      status: "ok",
      level: 80,
    },
    {
      name: "Mặt nạ phòng chịu",
      stock: "150 Cái",
      status: "danger",
      level: 25,
    },
  ];

  return (
    <div className="drawer-content">
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>
          Tình trạng tồn kho các vật tư thiết yếu hiện tại
        </p>
      </div>

      {inventoryData.map((item, idx) => (
        <div
          key={idx}
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
            <strong>{item.name}</strong>
            <Tag
              color={
                item.status === "ok"
                  ? "green"
                  : item.status === "warning"
                  ? "orange"
                  : "red"
              }
            >
              {item.status === "ok"
                ? "ĐỦ"
                : item.status === "warning"
                ? "SẮP HẾT"
                : "NGUY HIỂM"}
            </Tag>
          </div>

          <div
            style={{
              marginBottom: "8px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Tồn kho: <strong>{item.stock}</strong>
          </div>

          <Progress
            percent={item.level}
            showInfo={false}
            strokeColor={
              item.status === "ok"
                ? "#22c55e"
                : item.status === "warning"
                ? "#f59e0b"
                : "#dc2626"
            }
          />
        </div>
      ))}

      <Button
        type="primary"
        block
        style={{ marginTop: "20px" }}
        onClick={() => onNavigate("/manager/inventory")}
      >
        Quản lý kho hàng đầy đủ
      </Button>
    </div>
  );
}