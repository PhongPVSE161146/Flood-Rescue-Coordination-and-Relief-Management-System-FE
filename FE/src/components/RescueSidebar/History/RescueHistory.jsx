import { useState } from "react";
import {
  Input,
  Button,
  Tag,
  Modal,
  Spin,
  Alert,
  message
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  getRescueHistoryByPhone,
  deleteRescueRequest
} from "../../../api/service/historyApi";

import EditRescueModal from "../EditResscue/EditRescueModal";
import "./RescueHistory.css";

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" },
];

const getIncidentLabel = (value) => {
  const found = MAIN_INCIDENT_OPTIONS.find(
    (item) => item.value === value
  );
  return found ? found.label : value;
};

const RescueHistory = () => {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 1:
        return { text: "Đang xử lý", color: "orange" };
      case 2:
        return { text: "Hoàn thành", color: "green" };
      case 3:
        return { text: "Đã hủy", color: "red" };
      default:
        return { text: "Không xác định", color: "blue" };
    }
  };

  const handleSearch = async () => {
    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setHistories([]);

    try {
      const data = await getRescueHistoryByPhone(phone);

      const formattedData = data
        .sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        .map((item) => {
          const statusInfo = getStatusInfo(item.statusId);

          return {
            id: item.rescueRequestId,
            code: `#CH-${item.rescueRequestId}`,
            status: statusInfo.text,
            color: statusInfo.color,
            time: new Date(item.createdAt).toLocaleString(
              "vi-VN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            phone: item.contactPhone,
            type: item.requestType,
          };
        });

      setHistories(formattedData);
    } catch (err) {
      setError(
        err.message ||
        "Không tìm thấy lịch sử cứu hộ cho số điện thoại này"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa yêu cầu này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },

      onOk: async () => {
        try {
          await deleteRescueRequest(id);

          setHistories((prev) =>
            prev.filter((item) => item.id !== id)
          );

          message.success("Đã xóa yêu cầu cứu hộ thành công ✅");
        } catch (err) {
          Modal.error({
            title: "Lỗi",
            content: err.message,
          });
        }
      },
    });
  };

  return (
    <div className="sidebar-top">
      <div className="history-title">
        ⏱️ <b>TRA CỨU LỊCH SỬ CỨU HỘ</b>
      </div>

      <div className="history-input">
        <Input
          placeholder="Nhập số điện thoại..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          loading={loading}
        >
          Tra cứu
        </Button>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginTop: 12 }}
        />
      )}

      {searched && !loading && (
        <div className="history-list-title">
          LỊCH SỬ YÊU CẦU ({histories.length})
        </div>
      )}

      {loading ? (
        <div className="loading-box">
          <Spin
            indicator={
              <LoadingOutlined spin style={{ fontSize: 32 }} />
            }
          />
          <p>Đang tải lịch sử...</p>
        </div>
      ) : (
        histories.map((item) => (
          <HistoryCard
            key={item.id}
            data={item}
            onEdit={() => setEditing(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))
      )}

      {searched &&
        !loading &&
        histories.length === 0 &&
        !error && (
          <p className="empty-text">
            Không có lịch sử cứu hộ.
          </p>
        )}

      <EditRescueModal
        data={editing}
        onClose={() => setEditing(null)}
        onUpdated={(updatedData) => {
          setHistories((prev) =>
            prev.map((item) =>
              item.id === editing.id
                ? { ...item, ...updatedData }
                : item
            )
          );
        }}
      />
    </div>
  );
};

export default RescueHistory;

/* ================= CARD ================= */

function HistoryCard({ data, onEdit, onDelete }) {
  const isProcessing =
    data.status === "Đang xử lý";

  return (
    <div className={`history-card ${data.color}`}>
      <div className="history-row">
        <span className="code">
          Mã: {data.code}
        </span>
        <Tag color={data.color}>
          {data.status}
        </Tag>
      </div>

      <div className="time">
        Thời Gian : {data.time}
      </div>

      <div className="desc">
        Loại sự cố: {getIncidentLabel(data.type)}
      </div>

      <div className="phone">
        📞 {data.phone}
      </div>

      <div className="history-action">
        {isProcessing ? (
          <>
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={onEdit}
              className="action-btn edit-btn"
            >
              Chỉnh sửa
            </Button>

            <Button
              size="small"
              type="text"
              icon={<DeleteOutlined />}
              onClick={onDelete}
              className="action-btn delete-btn"
            >
              Xóa
            </Button>
          </>
        ) : (
          <Button
            size="small"
            type="text"
            icon={<EyeOutlined />}
            className="action-btn view-btn"
          >
            Xem chi tiết
          </Button>
        )}
      </div>
    </div>
  );
}