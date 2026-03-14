import { useEffect, useMemo, useState } from "react";
import { Button, Input, Switch, message, Tabs, Select, Table, Modal, Form, Checkbox } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import "./SystemSetting.css";
import { getAllSystemConfigs, updateSystemConfig } from "../../../../api/axios/AdminApi/systemConfigApi";
import { getAllRequestStatuses, createRequestStatus, updateRequestStatus } from "../../../../api/axios/AdminApi/requestStatusApi";
import { getAllUrgencyLevels, createUrgencyLevel, updateUrgencyLevel, deleteUrgencyLevel } from "../../../../api/axios/AdminApi/urgencyLevelApi";

const GROUPS = [
  { id: "rescue", title: "Tham số vận hành", label: "Tham số vận hành" },
  { id: "urgency_levels", title: "Mức độ khẩn cấp", label: "Mức độ khẩn cấp" },
  // { id: "emergency_levels", title: "Mức độ Khẩn Cấp", label: "Mức độ Khẩn Cấp" }, // Tạm ẩn do chưa có API
  { id: "emergency", title: "Cảnh báo & SLA", label: "Thông báo & SLA" },
  { id: "request", title: "Tham số cứu trợ", label: "Tham số cứu trợ" },
  { id: "request_status", title: "Trạng thái yêu cầu", label: "Trạng thái yêu cầu" },
  // { id: "stock", title: "Kho & Cứu trợ", label: "Kho & Cứu trợ" }, // Tạm ẩn do chưa có API
  // { id: "donation", title: "Tiền & Quyên góp", label: "Tiền & Quyên góp" }, // Tạm ẩn do chưa có API
  // { id: "media", title: "Media & Dữ liệu", label: "Media & Dữ liệu" }, // Tạm ẩn do chưa có API
  // { id: "map", title: "Bản đồ & Hiển thị", label: "Bản đồ & Hiển thị" }, // Tạm ẩn do chưa có API
  // { id: "security", title: "Bảo mật & Hệ thống", label: "Bảo mật & Hệ thống" }, // Tạm ẩn do chưa có API
  // { id: "permission", title: "Phân quyền", label: "Phân quyền" }, // Tạm ẩn do chưa có API
];

const DEFAULT_CONFIGS = [
  /* 1. Điều phối & Đội cứu hộ */
  { key: "AUTO_ASSIGN", name: "AUTO_ASSIGN – Tự động phân đội", type: "boolean", value: true, group: "rescue" },
  { key: "MAX_TASK", name: "MAX_TASK – Số nhiệm vụ tối đa / đội", type: "number", value: 5, group: "rescue" },
  { key: "MAX_TEAM_PER_REQUEST", name: "MAX_TEAM_PER_REQUEST – Số đội tối đa / yêu cầu", type: "number", value: 3, group: "rescue" },
  { key: "ASSIGN_TIMEOUT", name: "ASSIGN_TIMEOUT – Thời gian đội xác nhận nhiệm vụ (s)", type: "number", value: 300, group: "rescue" },
  { key: "REASSIGN_ENABLE", name: "REASSIGN_ENABLE – Cho phép tái phân công", type: "boolean", value: true, group: "rescue" },
  { key: "RESCUE_RADIUS_KM", name: "RESCUE_RADIUS_KM – Bán kính cứu hộ tối đa (km)", type: "number", value: 10, group: "rescue" },

  /* 1.5. Mức độ Khẩn Cấp */
  { key: "EMERGENCY_LEVEL_1_NAME", name: "EMERGENCY_LEVEL_1_NAME – Tên Cấp độ 1", type: "string", value: "Cấp độ 1 - Thấp (Low Risk)", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_COLOR", name: "EMERGENCY_LEVEL_1_COLOR – Màu Cấp độ 1", type: "string", value: "#4CAF50", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_DEFINITION", name: "EMERGENCY_LEVEL_1_DEFINITION – Định nghĩa Cấp độ 1", type: "string", value: "Tình huống nhẹ, chưa đe dọa trực tiếp đến tính mạng, chủ yếu là hỗ trợ sớm hoặc cảnh báo", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_PEOPLE_COUNT", name: "EMERGENCY_LEVEL_1_PEOPLE_COUNT – Số người cần cứu Cấp độ 1", type: "string", value: "1–2 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_FLOOD_CRITERIA", name: "EMERGENCY_LEVEL_1_FLOOD_CRITERIA – Tiêu chí lũ lụt Cấp độ 1", type: "string", value: "Ngập < 20 cm; Chưa vào nhà hoặc chỉ ngập sân", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_INJURED_COUNT", name: "EMERGENCY_LEVEL_1_INJURED_COUNT – Số người bị thương Cấp độ 1", type: "string", value: "0 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_INJURY_SEVERITY", name: "EMERGENCY_LEVEL_1_INJURY_SEVERITY – Mức độ thương tích Cấp độ 1", type: "string", value: "Không có thương tích hoặc trầy xước nhẹ", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_EXAMPLES", name: "EMERGENCY_LEVEL_1_EXAMPLES – Ví dụ Cấp độ 1", type: "string", value: "Người bị mắc kẹt do nước dâng nhẹ; Cần hỗ trợ di chuyển người già/trẻ em; Cây đổ nhẹ chưa gây nguy hiểm", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_1_SLA", name: "EMERGENCY_LEVEL_1_SLA – Thời gian phản hồi Cấp độ 1 (phút)", type: "number", value: 120, group: "emergency_levels" },

  { key: "EMERGENCY_LEVEL_2_NAME", name: "EMERGENCY_LEVEL_2_NAME – Tên Cấp độ 2", type: "string", value: "Cấp độ 2 - Trung bình (Moderate Risk)", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_COLOR", name: "EMERGENCY_LEVEL_2_COLOR – Màu Cấp độ 2", type: "string", value: "#FFC107", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_DEFINITION", name: "EMERGENCY_LEVEL_2_DEFINITION – Định nghĩa Cấp độ 2", type: "string", value: "Có nguy cơ ảnh hưởng đến an toàn, cần theo dõi và xử lý sớm để tránh leo thang", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_PEOPLE_COUNT", name: "EMERGENCY_LEVEL_2_PEOPLE_COUNT – Số người cần cứu Cấp độ 2", type: "string", value: "3–10 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_FLOOD_CRITERIA", name: "EMERGENCY_LEVEL_2_FLOOD_CRITERIA – Tiêu chí lũ lụt Cấp độ 2", type: "string", value: "Ngập 20–50 cm; Nước đã vào nhà tầng trệt", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_INJURED_COUNT", name: "EMERGENCY_LEVEL_2_INJURED_COUNT – Số người bị thương Cấp độ 2", type: "string", value: "1–2 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_INJURY_SEVERITY", name: "EMERGENCY_LEVEL_2_INJURY_SEVERITY – Mức độ thương tích Cấp độ 2", type: "string", value: "Trầy xước, bong gân, choáng nhẹ, mất sức", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_EXAMPLES", name: "EMERGENCY_LEVEL_2_EXAMPLES – Ví dụ Cấp độ 2", type: "string", value: "Gia đình bị cô lập do nước dâng; Có người bị té ngã khi di chuyển; Nhà bị ngập tầng trệt chưa sập", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_2_SLA", name: "EMERGENCY_LEVEL_2_SLA – Thời gian phản hồi Cấp độ 2 (phút)", type: "number", value: 60, group: "emergency_levels" },

  { key: "EMERGENCY_LEVEL_3_NAME", name: "EMERGENCY_LEVEL_3_NAME – Tên Cấp độ 3", type: "string", value: "Cấp độ 3 - Cao (High Risk)", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_COLOR", name: "EMERGENCY_LEVEL_3_COLOR – Màu Cấp độ 3", type: "string", value: "#FF9800", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_DEFINITION", name: "EMERGENCY_LEVEL_3_DEFINITION – Định nghĩa Cấp độ 3", type: "string", value: "Tình huống nguy hiểm rõ ràng, nếu chậm xử lý có thể dẫn đến thương vong", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_PEOPLE_COUNT", name: "EMERGENCY_LEVEL_3_PEOPLE_COUNT – Số người cần cứu Cấp độ 3", type: "string", value: "11–50 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_FLOOD_CRITERIA", name: "EMERGENCY_LEVEL_3_FLOOD_CRITERIA – Tiêu chí lũ lụt Cấp độ 3", type: "string", value: "Ngập 50–100 cm; Nước chảy xiết", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_INJURED_COUNT", name: "EMERGENCY_LEVEL_3_INJURED_COUNT – Số người bị thương Cấp độ 3", type: "string", value: "3–10 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_INJURY_SEVERITY", name: "EMERGENCY_LEVEL_3_INJURY_SEVERITY – Mức độ thương tích Cấp độ 3", type: "string", value: "Gãy tay/chân, chảy máu nhiều, bất tỉnh ngắn hạn", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_EXAMPLES", name: "EMERGENCY_LEVEL_3_EXAMPLES – Ví dụ Cấp độ 3", type: "string", value: "Khu dân cư bị ngập sâu; Có người bị cuốn trôi nhẹ; Nhiều người cần sơ tán khẩn cấp", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_3_SLA", name: "EMERGENCY_LEVEL_3_SLA – Thời gian phản hồi Cấp độ 3 (phút)", type: "number", value: 30, group: "emergency_levels" },

  { key: "EMERGENCY_LEVEL_4_NAME", name: "EMERGENCY_LEVEL_4_NAME – Tên Cấp độ 4", type: "string", value: "Cấp độ 4 - Rất cao (Very High Risk)", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_COLOR", name: "EMERGENCY_LEVEL_4_COLOR – Màu Cấp độ 4", type: "string", value: "#F44336", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_DEFINITION", name: "EMERGENCY_LEVEL_4_DEFINITION – Định nghĩa Cấp độ 4", type: "string", value: "Đe dọa trực tiếp đến tính mạng, cần cứu hộ khẩn cấp ngay lập tức", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_PEOPLE_COUNT", name: "EMERGENCY_LEVEL_4_PEOPLE_COUNT – Số người cần cứu Cấp độ 4", type: "string", value: "51–200 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_FLOOD_CRITERIA", name: "EMERGENCY_LEVEL_4_FLOOD_CRITERIA – Tiêu chí lũ lụt Cấp độ 4", type: "string", value: "Ngập > 100 cm; Dòng nước mạnh, nguy hiểm", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_INJURED_COUNT", name: "EMERGENCY_LEVEL_4_INJURED_COUNT – Số người bị thương Cấp độ 4", type: "string", value: "11–50 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_INJURY_SEVERITY", name: "EMERGENCY_LEVEL_4_INJURY_SEVERITY – Mức độ thương tích Cấp độ 4", type: "string", value: "Đa chấn thương, gãy xương hở, bất tỉnh kéo dài, nghi ngờ chấn thương nội tạng", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_EXAMPLES", name: "EMERGENCY_LEVEL_4_EXAMPLES – Ví dụ Cấp độ 4", type: "string", value: "Cả khu dân cư bị cô lập; Nhà có nguy cơ sập; Người bị thương nặng cần sơ cứu khẩn", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_4_SLA", name: "EMERGENCY_LEVEL_4_SLA – Thời gian phản hồi Cấp độ 4 (phút)", type: "number", value: 15, group: "emergency_levels" },

  { key: "EMERGENCY_LEVEL_5_NAME", name: "EMERGENCY_LEVEL_5_NAME – Tên Cấp độ 5", type: "string", value: "Cấp độ 5 - Thảm họa (Disaster)", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_COLOR", name: "EMERGENCY_LEVEL_5_COLOR – Màu Cấp độ 5", type: "string", value: "#9C27B0", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_DEFINITION", name: "EMERGENCY_LEVEL_5_DEFINITION – Định nghĩa Cấp độ 5", type: "string", value: "Tình huống đặc biệt nghiêm trọng, ảnh hưởng diện rộng, vượt quá khả năng xử lý thông thường", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_PEOPLE_COUNT", name: "EMERGENCY_LEVEL_5_PEOPLE_COUNT – Số người cần cứu Cấp độ 5", type: "string", value: "> 200 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_FLOOD_CRITERIA", name: "EMERGENCY_LEVEL_5_FLOOD_CRITERIA – Tiêu chí lũ lụt Cấp độ 5", type: "string", value: "Ngập sâu > 150 cm; Lũ quét/vỡ đê", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_INJURED_COUNT", name: "EMERGENCY_LEVEL_5_INJURED_COUNT – Số người bị thương Cấp độ 5", type: "string", value: "> 50 người", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_INJURY_SEVERITY", name: "EMERGENCY_LEVEL_5_INJURY_SEVERITY – Mức độ thương tích Cấp độ 5", type: "string", value: "Nhiều ca nguy kịch, nguy cơ tử vong cao, cần hỗ trợ y tế quy mô lớn", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_EXAMPLES", name: "EMERGENCY_LEVEL_5_EXAMPLES – Ví dụ Cấp độ 5", type: "string", value: "Xã/huyện bị ngập diện rộng; Nhiều người mất tích; Cần huy động liên tỉnh/trung ương", group: "emergency_levels" },
  { key: "EMERGENCY_LEVEL_5_SLA", name: "EMERGENCY_LEVEL_5_SLA – Thời gian phản hồi Cấp độ 5 (phút)", type: "number", value: 5, group: "emergency_levels" },

  { key: "ALLOW_COORD_CHANGE_LEVEL", name: "ALLOW_COORD_CHANGE_LEVEL – Cho phép Coordinator thay đổi cấp độ", type: "boolean", value: true, group: "emergency_levels" },
  { key: "ALLOW_COORD_DOWNGRADE_LEVEL", name: "ALLOW_COORD_DOWNGRADE_LEVEL – Cho phép hạ cấp độ (phải có lý do)", type: "boolean", value: true, group: "emergency_levels" },
  { key: "NOTIFY_ON_LEVEL_CHANGE", name: "NOTIFY_ON_LEVEL_CHANGE – Thông báo khi thay đổi cấp độ", type: "boolean", value: true, group: "emergency_levels" },

  /* 2. Mức độ khẩn cấp & Ưu tiên */
  { key: "EMERGENCY_LEVELS", name: "EMERGENCY_LEVELS – Số cấp độ khẩn cấp", type: "number", value: 5, group: "emergency" },
  { key: "PRIORITY_CHILD", name: "PRIORITY_CHILD – Trọng số trẻ em", type: "number", value: 2, group: "emergency" },
  { key: "PRIORITY_ELDERLY", name: "PRIORITY_ELDERLY – Trọng số người già", type: "number", value: 2, group: "emergency" },
  { key: "PRIORITY_DISABLED", name: "PRIORITY_DISABLED – Trọng số người khuyết tật", type: "number", value: 2, group: "emergency" },
  { key: "SLA_RESPONSE_TIMES", name: "SLA_LEVELS – Thời gian phản hồi theo cấp (phút)", type: "list", value: [120, 60, 30, 15, 5], group: "emergency" },

  /* 3. Yêu cầu cứu hộ / cứu trợ */
  { key: "MAX_REQUEST_PER_USER", name: "MAX_REQUEST_PER_USER – Số yêu cầu/người/ngày", type: "number", value: 3, group: "request" },
  { key: "REQUEST_EXPIRE_TIME", name: "REQUEST_EXPIRE_TIME – Thời gian hết hiệu lực yêu cầu (phút)", type: "number", value: 1440, group: "request" },
  { key: "ALLOW_CANCEL_STATUS", name: "ALLOW_CANCEL_STATUS – Trạng thái cho phép hủy", type: "list", value: ["pending", "verified"], group: "request" },
  { key: "AUTO_CLOSE_TIME", name: "AUTO_CLOSE_TIME – Tự động đóng yêu cầu (ngày)", type: "number", value: 7, group: "request" },
  { key: "REQUIRE_LOCATION", name: "REQUIRE_LOCATION – Bắt buộc GPS", type: "boolean", value: true, group: "request" },
  { key: "MAX_CONCURRENT_REQUESTS", name: "MAX_CONCURRENT_REQUESTS – Số yêu cầu tối đa đồng thời/người dùng", type: "number", value: 1, group: "request" },

  /* 4. Kho & Cứu trợ */
  { key: "STOCK_DEDUCT_MODE", name: "STOCK_DEDUCT_MODE – Thời điểm trừ kho", type: "string", value: "on_dispatch", group: "stock" },
  { key: "LOW_STOCK_THRESHOLD", name: "LOW_STOCK_THRESHOLD – Ngưỡng cảnh báo thiếu hàng", type: "number", value: 10, group: "stock" },
  { key: "MAX_GOODS_PER_TRIP", name: "MAX_GOODS_PER_TRIP – Hạn mức hàng/chuyến", type: "number", value: 100, group: "stock" },
  { key: "FIFO_ENABLE", name: "FIFO_ENABLE – Áp dụng FIFO", type: "boolean", value: true, group: "stock" },
  { key: "ESSENTIAL_GOODS_LIST", name: "ESSENTIAL_GOODS_LIST – Danh mục hàng thiết yếu", type: "list", value: ["water", "food", "medicine"], group: "stock" },

  /* 5. Tiền & Quyên góp */
  { key: "MAX_DONATION_AMOUNT", name: "MAX_DONATION_AMOUNT – Hạn mức quyên góp", type: "number", value: 100000000, group: "donation" },
  { key: "REQUIRE_MANAGER_APPROVAL", name: "REQUIRE_MANAGER_APPROVAL – Duyệt chi tiền", type: "boolean", value: true, group: "donation" },
  { key: "CURRENCY", name: "CURRENCY – Đơn vị tiền tệ", type: "string", value: "VND", group: "donation" },
  { key: "PAYMENT_METHODS", name: "PAYMENT_METHODS – Phương thức thanh toán", type: "list", value: ["cash", "bank_transfer"], group: "donation" },
  { key: "DONATION_CLOSE_TIME", name: "DONATION_CLOSE_TIME – Thời gian đóng nhận quyên góp (ngày)", type: "number", value: 30, group: "donation" },

  /* 6. Media & Dữ liệu */
  { key: "MAX_IMAGE_SIZE_MB", name: "MAX_IMAGE_SIZE_MB – Dung lượng ảnh (MB)", type: "number", value: 5, group: "media" },
  { key: "MAX_VIDEO_SIZE_MB", name: "MAX_VIDEO_SIZE_MB – Dung lượng video (MB)", type: "number", value: 50, group: "media" },
  { key: "MAX_FILES_PER_REQUEST", name: "MAX_FILES_PER_REQUEST – Số file tối đa", type: "number", value: 10, group: "media" },
  { key: "ALLOWED_FILE_TYPES", name: "ALLOWED_FILE_TYPES – Định dạng cho phép", type: "list", value: ["jpg", "png", "mp4", "pdf"], group: "media" },
  { key: "GPS_UPDATE_INTERVAL", name: "GPS_UPDATE_INTERVAL – Chu kỳ cập nhật vị trí (s)", type: "number", value: 30, group: "media" },

  /* 7. Bản đồ & Hiển thị */
  { key: "MAP_DEFAULT_ZOOM", name: "MAP_DEFAULT_ZOOM – Zoom mặc định", type: "number", value: 12, group: "map" },
  { key: "MAP_REFRESH_INTERVAL", name: "MAP_REFRESH_INTERVAL – Thời gian refresh (s)", type: "number", value: 60, group: "map" },
  { key: "SHOW_ALL_REQUESTS", name: "SHOW_ALL_REQUESTS – Hiển thị tất cả yêu cầu", type: "boolean", value: false, group: "map" },
  { key: "CLUSTER_MARKERS", name: "CLUSTER_MARKERS – Gộp marker", type: "boolean", value: true, group: "map" },
  { key: "HEATMAP_ENABLE", name: "HEATMAP_ENABLE – Bật heatmap", type: "boolean", value: false, group: "map" },

  /* 8. Bảo mật & Hệ thống */
  { key: "SYSTEM_MODE", name: "SYSTEM_MODE – Chế độ hệ thống", type: "string", value: "Normal", group: "security" },
  { key: "DATA_RETENTION_DAYS", name: "DATA_RETENTION_DAYS – Thời gian lưu dữ liệu (ngày)", type: "number", value: 365, group: "security" },
  { key: "AUDIT_LOG_ENABLE", name: "AUDIT_LOG_ENABLE – Bật log hệ thống", type: "boolean", value: true, group: "security" },
  { key: "MAX_LOGIN_FAIL", name: "MAX_LOGIN_FAIL – Số lần đăng nhập sai", type: "number", value: 5, group: "security" },
  { key: "FORCE_LOGOUT_ON_ROLE_CHANGE", name: "FORCE_LOGOUT_ON_ROLE_CHANGE – Đăng xuất khi đổi quyền", type: "boolean", value: true, group: "security" },

  /* 9. Phân quyền */
  { key: "ROLE_PERMISSION_MATRIX", name: "ROLE_PERMISSION_MATRIX – Ma trận quyền (JSON)", type: "json", value: { admin: ["*"], manager: ["view","edit"], coordinator: ["view"], rescue: ["view"] }, group: "permission" },
  { key: "ALLOW_COORD_OVERRIDE", name: "ALLOW_COORD_OVERRIDE – Quyền override điều phối", type: "boolean", value: false, group: "permission" },
  { key: "VIEW_LIMIT_BY_ROLE", name: "VIEW_LIMIT_BY_ROLE – Giới hạn dữ liệu theo role (JSON)", type: "json", value: { admin: null, manager: 100, coordinator: 50, rescue: 10 }, group: "permission" },
];

export default function SystemSetting() {
  const [configs, setConfigs] = useState(() => {
    try {
      const raw = localStorage.getItem("system_configs");
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && Array.isArray(parsed)) return parsed;
    } catch (e) {
      // ignore
    }
    return DEFAULT_CONFIGS.map((c) => ({ ...c }));
  });

  const [activeTab, setActiveTab] = useState("rescue");
  const [backendConfigKeys, setBackendConfigKeys] = useState(new Set());
  const [saving, setSaving] = useState(false);

  // States for Request Statuses Tab
  const [requestStatuses, setRequestStatuses] = useState([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm] = Form.useForm();
  const [statusesLoading, setStatusesLoading] = useState(false);

  // States for Urgency Levels Tab
  const [urgencyLevels, setUrgencyLevels] = useState([]);
  const [isUrgencyModalVisible, setIsUrgencyModalVisible] = useState(false);
  const [editingUrgencyLevel, setEditingUrgencyLevel] = useState(null);
  const [urgencyForm] = Form.useForm();
  const [urgencyLoading, setUrgencyLoading] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const data = await getAllSystemConfigs();
        if (data && Array.isArray(data)) {
          const fetchedKeys = new Set(data.map(item => item.configKey));
          setBackendConfigKeys(fetchedKeys);

          setConfigs(prev => prev.map(c => {
            const backendConfig = data.find(b => b.configKey === c.key);
            if (backendConfig) {
              let parsedValue = backendConfig.configValue;
              if (c.type === "boolean") {
                parsedValue = backendConfig.configValue === "true" || backendConfig.configValue === true;
              } else if (c.type === "number") {
                parsedValue = Number(backendConfig.configValue);
              } else if (c.type === "json") {
                try { parsedValue = JSON.parse(backendConfig.configValue); } catch(e) {}
              } else if (c.type === "list") {
                try { 
                  parsedValue = JSON.parse(backendConfig.configValue);
                  if (!Array.isArray(parsedValue)) {
                    parsedValue = typeof backendConfig.configValue === 'string' ? backendConfig.configValue.split(",").map(s => s.trim()) : [];
                  }
                } catch(e) {
                  if (typeof backendConfig.configValue === 'string') {
                    parsedValue = backendConfig.configValue.split(",").map(s => s.trim());
                  }
                }
              }
              return { ...c, value: parsedValue };
            }
            return c;
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy System Configurations:", error);
      }
    };

    const fetchRequestStatuses = async () => {
      try {
        setStatusesLoading(true);
        const data = await getAllRequestStatuses();
        if (data && Array.isArray(data)) {
          setRequestStatuses(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy Request Statuses:", error);
      } finally {
        setStatusesLoading(false);
      }
    };

    const fetchUrgencyLevels = async () => {
      try {
        setUrgencyLoading(true);
        const data = await getAllUrgencyLevels();
        if (data && Array.isArray(data)) {
          setUrgencyLevels(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy Mức độ Khẩn Cấp:", error);
      } finally {
        setUrgencyLoading(false);
      }
    };

    fetchConfigs();
    fetchRequestStatuses();
    fetchUrgencyLevels();
  }, []);

  const handleToggle = (key, checked) => {
    setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value: checked } : c)));
  };

  const handleChange = (key, val) => {
    setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value: val } : c)));
  };

  const handleSaveGroup = async (groupId) => {
    try {
      setSaving(true);
      const currentGroupConfigs = configs.filter((c) => c.group === groupId);
      const configsToUpdateBackend = currentGroupConfigs.filter(c => backendConfigKeys.has(c.key));

      if (configsToUpdateBackend.length > 0) {
        const promises = configsToUpdateBackend.map(c => {
          let strValue = c.value;
          if (c.type === "json" || c.type === "list") {
            strValue = JSON.stringify(c.value);
          } else {
            strValue = String(c.value);
          }
          return updateSystemConfig(c.key, {
            configKey: c.key,
            configValue: strValue,
            configGroup: c.group,
            description: c.name
          });
        });
        await Promise.all(promises);
      }

      localStorage.setItem("system_configs", JSON.stringify(configs));
      message.success("Lưu cấu hình thành công");
    } catch (e) {
      console.error(e);
      message.error("Lưu cấu hình thất bại, vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  const grouped = useMemo(() => {
    const map = {};
    GROUPS.forEach((g) => (map[g.id] = []));
    (configs || []).forEach((c) => {
      (map[c.group] || []).push(c);
    });
    return map;
  }, [configs]);

  const renderConfigInput = (config) => {
    const { key, type, value } = config;

    switch (type) {
      case "boolean":
        return (
          <div className="config-input-wrapper">
            <Switch checked={!!value} onChange={(v) => handleToggle(key, v)} />
          </div>
        );

      case "number":
        return (
          <div className="config-input-wrapper">
            <Input
              type="number"
              value={value}
              onChange={(e) => handleChange(key, Number(e.target.value || 0))}
              placeholder="Nhập số"
            />
          </div>
        );

      case "string":
        return (
          <div className="config-input-wrapper">
            <Input
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder="Nhập giá trị"
            />
          </div>
        );

      case "list":
        return (
          <div className="config-input-wrapper">
            <Input
              value={Array.isArray(value) ? value.join(", ") : (value || "")}
              onChange={(e) => handleChange(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Nhập các giá trị cách nhau bằng dấu phẩy"
            />
          </div>
        );

      case "json":
        return (
          <div className="config-input-wrapper">
            <Input.TextArea
              rows={4}
              value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
              onChange={(e) => {
                const v = e.target.value;
                try {
                  const parsed = JSON.parse(v);
                  handleChange(key, parsed);
                } catch (err) {
                  handleChange(key, v);
                }
              }}
              placeholder="Nhập JSON"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderEmergencyLevelsSection = () => {
    const levelItems = (grouped["emergency_levels"] || []);
    const levels = {};git
    const generalSettings = [];

    // Group settings by level
    levelItems.forEach((item) => {
      const match = item.key.match(/EMERGENCY_LEVEL_(\d)_/);
      if (match) {
        const levelNum = match[1];
        if (!levels[levelNum]) levels[levelNum] = [];
        levels[levelNum].push(item);
      } else {
        generalSettings.push(item);
      }
    });

    // Sort each level's settings by type
    const fieldOrder = ["NAME", "COLOR", "DEFINITION", "PEOPLE_COUNT", "FLOOD_CRITERIA", "INJURED_COUNT", "INJURY_SEVERITY", "EXAMPLES", "SLA"];
    Object.keys(levels).forEach((levelNum) => {
      levels[levelNum].sort((a, b) => {
        const aIndex = fieldOrder.findIndex((f) => a.key.includes(`_${f}`));
        const bIndex = fieldOrder.findIndex((f) => b.key.includes(`_${f}`));
        return aIndex - bIndex;
      });
    });

    return (
      <div className="tab-content">
        <div className="emergency-levels-container">
          {/* Render each level */}
          {[1, 2, 3, 4, 5].map((levelNum) => (
            <div key={`level-${levelNum}`} className="level-section">
              {/* Level Name Header */}
              <div className="level-header">
                {levels[levelNum] && levels[levelNum][0] && (
                  <h3>{levels[levelNum][0].value || `Cấp độ ${levelNum}`}</h3>
                )}
              </div>

              <div className="level-settings">
                {(levels[levelNum] || []).map((config) => {
                  // Determine field type
                  let fieldLabel = "Cài đặt";
                  let fieldType = "normal";
                  if (config.key.includes("_NAME")) {
                    fieldLabel = "Tên cấp độ";
                    fieldType = "name";
                  } else if (config.key.includes("_COLOR")) {
                    fieldLabel = "Màu hiển thị";
                    fieldType = "color";
                  } else if (config.key.includes("_DEFINITION")) {
                    fieldLabel = "Định nghĩa";
                    fieldType = "definition";
                  } else if (config.key.includes("_PEOPLE_COUNT")) {
                    fieldLabel = "Số người cần cứu";
                    fieldType = "people_count";
                  } else if (config.key.includes("_FLOOD_CRITERIA")) {
                    fieldLabel = "Tiêu chí lũ lụt";
                    fieldType = "flood_criteria";
                  } else if (config.key.includes("_INJURED_COUNT")) {
                    fieldLabel = "Số người bị thương";
                    fieldType = "injured_count";
                  } else if (config.key.includes("_INJURY_SEVERITY")) {
                    fieldLabel = "Mức độ thương tích";
                    fieldType = "injury_severity";
                  } else if (config.key.includes("_EXAMPLES")) {
                    fieldLabel = "Ví dụ thực tế";
                    fieldType = "examples";
                  } else if (config.key.includes("_SLA")) {
                    fieldLabel = "Thời gian phản hồi (phút)";
                    fieldType = "sla";
                  }

                  // Don't show the name field in the list (it's in the header)
                  if (fieldType === "name") return null;

                  return (
                    <div key={config.key} className={`setting-item field-type-${fieldType}`}>
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>{fieldLabel}</h4>
                        </div>
                      </div>
                      <div className="setting-value">{renderConfigInput(config)}</div>
                      <div className="setting-action">
                        <Button
                          type="text"
                          size="small"
                          onClick={() => handleSaveGroup("emergency_levels")}
                          className="save-btn"
                        >
                          Lưu
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Render general settings */}
          {generalSettings.length > 0 && (
            <div className="level-section general-settings-section">
              <div className="level-header">
                <h3>Quy tắc và Cài đặt chung</h3>
              </div>
              <div className="level-settings">
                {generalSettings.map((config) => (
                  <div key={config.key} className="setting-item">
                    <div className="setting-header">
                      <div className="setting-label">
                        <h4>{config.name.replace(/^.*?–\s*/, "")}</h4>
                        <p className="setting-key">{config.key}</p>
                      </div>
                    </div>
                    <div className="setting-value">{renderConfigInput(config)}</div>
                    <div className="setting-action">
                      <Button
                        type="text"
                        size="small"
                        onClick={() => handleSaveGroup("emergency_levels")}
                        className="save-btn"
                      >
                        Lưu
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleEditStatus = (record) => {
    setEditingStatus(record);
    statusForm.setFieldsValue({
      statusName: record.statusName,
      description: record.description,
      isFinal: record.isFinal,
    });
    setIsStatusModalVisible(true);
  };

  const handleAddStatus = () => {
    setEditingStatus(null);
    statusForm.resetFields();
    setIsStatusModalVisible(true);
  };

  const handleSaveStatus = async () => {
    try {
      const values = await statusForm.validateFields();
      if (editingStatus) {
        await updateRequestStatus(editingStatus.statusId, values);
        message.success("Cập nhật trạng thái thành công");
      } else {
        await createRequestStatus(values);
        message.success("Thêm trạng thái thành công");
      }
      setIsStatusModalVisible(false);
      
      setStatusesLoading(true);
      const data = await getAllRequestStatuses();
      if (data && Array.isArray(data)) {
        setRequestStatuses(data);
      }
    } catch (error) {
      if (!error.errorFields) {
        console.error(error);
        message.error("Lưu trạng thái thất bại");
      }
    } finally {
      setStatusesLoading(false);
    }
  };

  const statusColumns = [
    { title: 'ID', dataIndex: 'statusId', key: 'statusId', width: 60, align: 'center' },
    { title: 'Tên trạng thái', dataIndex: 'statusName', key: 'statusName', width: 200 },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { 
      title: 'Trạng thái cuối?', 
      dataIndex: 'isFinal', 
      key: 'isFinal', 
      width: 150, 
      align: 'center',
      render: (val) => val ? <span style={{color: '#f5222d', fontWeight: 500}}>Có</span> : <span style={{color: '#52c41a'}}>Không</span> 
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEditStatus(record)}>Sửa</Button>
      ),
    },
  ];

  const renderRequestStatusesSection = () => {
    return (
      <div className="tab-content" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Quản lý Trạng thái Yêu cầu</h3>
          <Button type="primary" onClick={handleAddStatus}>Thêm trạng thái mới</Button>
        </div>
        <Table
          dataSource={requestStatuses}
          columns={statusColumns}
          rowKey="statusId"
          pagination={false}
          bordered
          loading={statusesLoading}
        />
        <Modal
          title={editingStatus ? "Sửa trạng thái yêu cầu" : "Thêm trạng thái yêu cầu"}
          open={isStatusModalVisible}
          onOk={handleSaveStatus}
          onCancel={() => setIsStatusModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          confirmLoading={statusesLoading}
        >
          <Form form={statusForm} layout="vertical">
            <Form.Item 
              name="statusName" 
              label="Tên trạng thái" 
              rules={[{ required: true, message: 'Vui lòng nhập tên trạng thái' }]}
            >
              <Input placeholder="Nhập tên trạng thái (VD: Rescuing)" />
            </Form.Item>
            <Form.Item 
              name="description" 
              label="Mô tả chi tiết" 
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={3} placeholder="Mô tả ý nghĩa trạng thái này..." />
            </Form.Item>
            <Form.Item name="isFinal" valuePropName="checked">
              <Checkbox>Đây là trạng thái kết thúc (Final)</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const handleEditUrgencyLevel = (record) => {
    setEditingUrgencyLevel(record);
    urgencyForm.setFieldsValue({
      levelName: record.levelName,
      description: record.description,
      slaMinutes: record.slaMinutes,
    });
    setIsUrgencyModalVisible(true);
  };

  const handleAddUrgencyLevel = () => {
    setEditingUrgencyLevel(null);
    urgencyForm.resetFields();
    setIsUrgencyModalVisible(true);
  };

  const handleSaveUrgencyLevel = async () => {
    try {
      const values = await urgencyForm.validateFields();
      if (editingUrgencyLevel) {
        await updateUrgencyLevel(editingUrgencyLevel.id, values);
        message.success("Cập nhật mức độ khẩn cấp thành công");
      } else {
        await createUrgencyLevel(values);
        message.success("Thêm mức độ khẩn cấp thành công");
      }
      setIsUrgencyModalVisible(false);
      
      setUrgencyLoading(true);
      const data = await getAllUrgencyLevels();
      if (data && Array.isArray(data)) {
        setUrgencyLevels(data);
      }
    } catch (error) {
      if (!error.errorFields) {
        console.error(error);
        message.error("Lưu mức độ khẩn cấp thất bại");
      }
    } finally {
      setUrgencyLoading(false);
    }
  };

  const handleDeleteUrgencyLevel = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mức độ khẩn cấp này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteUrgencyLevel(id);
          message.success('Xóa mức độ khẩn cấp thành công');
          setUrgencyLoading(true);
          const data = await getAllUrgencyLevels();
          if (data && Array.isArray(data)) {
            setUrgencyLevels(data);
          }
        } catch (error) {
          console.error(error);
          message.error('Xóa mức độ khẩn cấp thất bại');
        } finally {
          setUrgencyLoading(false);
        }
      }
    });
  };

  const urgencyColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, align: 'center' },
    { title: 'Tên mức độ', dataIndex: 'levelName', key: 'levelName', width: 200 },
    { title: 'Thời gian SLA (phút)', dataIndex: 'slaMinutes', key: 'slaMinutes', width: 180, align: 'center' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type="link" onClick={() => handleEditUrgencyLevel(record)} style={{ padding: 0 }}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDeleteUrgencyLevel(record.id)} style={{ padding: 0 }}>Xóa</Button>
        </div>
      ),
    },
  ];

  const renderUrgencyLevelsSection = () => {
    const mockDetails = {
      'Cấp độ 1': { color: '#52c41a', criteria: 'Ngập < 30cm, không chảy xiết', people: '1-5', injured: '0', priority: ['Có người cao tuổi'], examples: 'Khu vực thấp trũng, nước vào sân vườn.' },
      'Cấp độ 2': { color: '#faad14', criteria: 'Ngập 30-70cm, nước bắt đầu chảy', people: '5-20', injured: '1-3', priority: ['Có trẻ em', 'Có người cao tuổi'], examples: 'Nước vào tầng trệt, cần hỗ trợ di dời tài sản.' },
      'Cấp độ 3': { color: '#f5222d', criteria: 'Ngập > 100cm, nước chảy xiết nguy hiểm', people: '20-50', injured: '5-10', priority: ['Có trẻ em'], examples: 'Nước ngập mái nhà, dân đang kẹt trên nóc, cần ca nô cứu hộ khẩn cấp.' },
    };

    return (
      <div className="tab-content" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Quản lý Mức độ Khẩn Cấp</h3>
          <Button type="primary" onClick={handleAddUrgencyLevel}>Thêm mức độ</Button>
        </div>
        <Table
          dataSource={urgencyLevels}
          columns={urgencyColumns}
          rowKey="id"
          pagination={false}
          bordered
          loading={urgencyLoading}
        />
        <Modal
          title={editingUrgencyLevel ? "Sửa mức độ khẩn cấp" : "Thêm mức độ khẩn cấp"}
          open={isUrgencyModalVisible}
          onOk={handleSaveUrgencyLevel}
          onCancel={() => setIsUrgencyModalVisible(false)}
          okText="Lưu"
          cancelText="Hủy"
          confirmLoading={urgencyLoading}
        >
          <Form form={urgencyForm} layout="vertical">
            <Form.Item 
              name="levelName" 
              label="Tên mức độ" 
              rules={[{ required: true, message: 'Vui lòng nhập tên mức độ (VD: Cấp độ 1)' }]}
            >
              <Input placeholder="Nhập tên mức độ..." />
            </Form.Item>
            <Form.Item 
              name="slaMinutes" 
              label="Thời gian SLA (phút)" 
              rules={[{ required: true, message: 'Vui lòng nhập thời gian phản hồi theo phút' }]}
            >
              <Input type="number" placeholder="Nhập số phút SLA..." />
            </Form.Item>
            <Form.Item 
              name="description" 
              label="Mô tả chi tiết" 
            >
              <Input.TextArea rows={3} placeholder="Mô tả ý nghĩa mức độ khẩn cấp này..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* UI-ONLY: Chi tiết mức độ */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ height: 24, width: 4, background: '#1890ff', borderRadius: 2 }}></div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Cấu hình chi tiết (Chỉ giao diện)</h3>
          </div>
          
          <div className="emergency-levels-container">
            {urgencyLevels.map((level) => {
              const mock = mockDetails[level.levelName] || { color: '#1890ff', criteria: '', people: '', injured: '', priority: [], examples: '' };
              return (
                <div key={`detail-${level.id}`} className="level-section">
                  <div className="level-header" style={{ background: mock.color, color: '#fff' }}>
                    <h3>{level.levelName}</h3>
                  </div>
                  <div className="level-settings">
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Màu sắc hiển thị</h4>
                        </div>
                      </div>
                      <div className="setting-value">
                        <Input defaultValue={mock.color} placeholder="Nhập mã màu HEX..." />
                      </div>
                    </div>
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Định nghĩa</h4>
                        </div>
                      </div>
                      <div className="setting-value">
                        <Input.TextArea rows={2} defaultValue={level.description} placeholder="Định nghĩa cụ thể về mức độ này..." />
                      </div>
                    </div>
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Tiêu chí lũ lụt</h4>
                        </div>
                      </div>
                      <div className="setting-value">
                        <Input defaultValue={mock.criteria} placeholder="VD: Ngập > 100cm, nước chảy xiết..." />
                      </div>
                    </div>
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Số người cần cứu / Số người bị thương</h4>
                        </div>
                      </div>
                      <div className="setting-value" style={{ display: 'flex', gap: '12px' }}>
                        <Input defaultValue={mock.people} placeholder="Số người cần cứu" suffix="người" />
                        <Input defaultValue={mock.injured} placeholder="Số người bị thương" suffix="người" />
                      </div>
                    </div>
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Nhóm ưu tiên</h4>
                        </div>
                      </div>
                      <div className="setting-value">
                        <Checkbox.Group defaultValue={mock.priority} options={['Có trẻ em', 'Có người cao tuổi']} />
                      </div>
                    </div>
                    <div className="setting-item">
                      <div className="setting-header">
                        <div className="setting-label">
                          <h4>Ví dụ thực tế</h4>
                        </div>
                      </div>
                      <div className="setting-value">
                        <Input.TextArea rows={2} defaultValue={mock.examples} placeholder="Các tình huống cụ thể..." />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                      <Button type="text" size="small" className="save-btn" onClick={() => message.success("Đã lưu")}>
                        Lưu (Mock)
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {urgencyLevels.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c', background: '#f5f5f5', borderRadius: 8 }}>
                Chưa có dữ liệu mức độ khẩn cấp để thiết lập chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabItems = GROUPS.map((g) => {
    // Special rendering for emergency_levels
    if (g.id === "emergency_levels") {
      return {
        key: g.id,
        label: g.label,
        children: renderEmergencyLevelsSection(),
      };
    }

    if (g.id === "urgency_levels") {
      return {
        key: g.id,
        label: g.label,
        children: renderUrgencyLevelsSection(),
      };
    }

    if (g.id === "request_status") {
      return {
        key: g.id,
        label: g.label,
        children: renderRequestStatusesSection(),
      };
    }

    // Default rendering for other tabs
    return {
      key: g.id,
      label: g.label,
      children: (
        <div className="tab-content">
          <div className="settings-list">
            {(grouped[g.id] || []).map((config) => (
              <div key={config.key} className="setting-item">
                <div className="setting-header">
                  <div className="setting-label">
                    <h4>{config.name.replace(/^.*?–\s*/, "")}</h4>
                    <p className="setting-key">{config.key}</p>
                  </div>
                </div>
                <div className="setting-value">{renderConfigInput(config)}</div>
                <div className="setting-action">
                  <Button
                    type="text"
                    size="small"
                    onClick={() => handleSaveGroup(g.id)}
                    className="save-btn"
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="system-setting-page">
      <div className="page-header">
        <div>
          <h2>Cấu hình Tham số Hệ thống</h2>
          <p>Điều chỉnh các thông số vận hành, thông báo và ngưỡng SLA toàn hệ thống</p>
        </div>
      </div>

      <div className="settings-container">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="settings-tabs"
        />
      </div>
    </div>
  );
}
