import { useEffect, useState } from "react";
import { Modal, Tag, Spin, Alert, Image } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getRescueProgress,
  getUrgencyLevels,
  completeRescueRequest
} from "../../../api/service/historyApi";
import { Button, Modal as AntModal } from "antd";
import AuthNotify from "../../../utils/Common/AuthNotify";
import "./RescueProgressModal.css";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
const IMAGE_BASE = "https://api-rescue.purintech.id.vn";

/* ================= REQUEST TYPE ================= */

const REQUEST_TYPES = [
  "cứu hộ khẩn cấp",
  "hỗ trợ cứu trợ",
  "cứu hộ ngập lụt",
  "cứu hộ lũ quét",
  "cứu hộ sạt lở",
  "hỗ trợ sơ tán",
  "hỗ trợ y tế khẩn cấp",
  "tiếp tế lương thực",
  "tìm kiếm cứu nạn",
  "cứu người mắc kẹt",
  "đưa đến nơi trú ẩn"
];

const MAIN_INCIDENT_OPTIONS = REQUEST_TYPES.map(t => ({
  value: t,
  label: t
}));

const getRequestTypeLabel = (value) => {
  const found = MAIN_INCIDENT_OPTIONS.find(
    (item) => item.value === value
  );
  return found ? found.label : value;
};

/* ================= PRIORITY ================= */

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};
const urgencyColor = {
    High: "red",
    Medium: "orange",
    Low: "green"
  };
/* ================= STATUS ================= */

const STATUS_STEPS = [
  { key: "ASSIGNED", label: "Đã điều động", icon: "📋" },
  { key: "ACCEPTED", label: "Đội đã nhận", icon: "👍" },
  { key: "DEPARTED", label: "Đã xuất phát", icon: "🚑" },
  { key: "ARRIVED", label: "Đã đến hiện trường", icon: "📍" },
  { key: "COMPLETED", label: "Hoàn thành", icon: "✔" },
];

const RescueProgressModal = ({ requestId, open, onClose }) => {

  const [data, setData] = useState(null);
  const [urgencyLevels, setUrgencyLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
const [note, setNote] = useState("");
  /* ================= API ================= */

  useEffect(() => {

    if (!open || !requestId) return;

    const fetchData = async () => {

      try {
        setLoading(true);
        setError(null);

        const [progressRes, urgencyRes] = await Promise.all([
          getRescueProgress(requestId),
          getUrgencyLevels()
        ]);

        setData(progressRes);
        setUrgencyLevels(urgencyRes);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchData();

  }, [open, requestId]);
  const handleConfirmComplete = () => {

    let tempNote = "";
  
    AntModal.confirm({
  
      title: "Xác nhận hoàn thành cứu hộ",
  
      content: (
        <Input.TextArea
          placeholder="Nhập ghi chú..."
          onChange={(e) => {
            tempNote = e.target.value;
          }}
        />
      ),
  
      okText: "Xác nhận",
      cancelText: "Hủy",
  
      onOk: async () => {
  
        try {
  
          setConfirmLoading(true);
  
          await completeRescueRequest(
            requestId,
            tempNote || "Đã hoàn thành cứu trợ"
          );
  
          AuthNotify.success(
            "Thành công",
            "Đã xác nhận hoàn thành cứu hộ"
          );
  
          // 👉 navigate sau khi xong
          navigate("/map");
  
        } catch (err) {
  
          if (data?.rescueRequest?.statusId !== 3) {
            AuthNotify.warning(
              "Không thể hoàn thành",
              "Yêu cầu chưa ở trạng thái ACTIVE"
            );
            return;
          }
  
        } finally {
  
          setConfirmLoading(false);
  
        }
  
      }
  
    });
  
  };

  const isCompletedAssignment =
  data?.assignment?.assignmentStatus === "COMPLETED";

const isProgressCompleted =
  data?.currentProgressCode === "COMPLETED";

  const canConfirm =
  data?.currentProgressCode === "COMPLETED" &&
  data?.assignment?.assignmentStatus === "COMPLETED" &&
  data?.rescueRequest?.statusId === 3; // 👈 ACTIVE
  /* ================= STEP ================= */

  const currentIndex = STATUS_STEPS.findIndex(
    step => step.key === data?.currentProgressCode
  );

  /* ================= URGENCY ================= */

  const urgency = urgencyLevels.find(
    u => u.urgencyLevelId === data?.rescueRequest?.urgencyLevelId
  );
  
  const urgencyLabel =
    priorityTranslate[urgency?.levelName] ||
    urgency?.description ||
    "Không xác định";

  /* ================= IMAGE ================= */

  const images = data?.rescueRequest?.locationImageUrl
    ?.split(",")
    .filter(Boolean)
    .map(img =>
      img.startsWith("http") ? img : IMAGE_BASE + img
    );

  return (

    <Modal
    open={open}
    onCancel={onClose}
    width={1000}
    centered
    destroyOnClose
    className="progress-modal"

    /* 🔥 FOOTER FIX */
    footer={[
      data?.currentProgressCode === "COMPLETED" && (
        <Button
          key="complete"
          type="primary"
          danger
          loading={confirmLoading}
          disabled={!canConfirm}
          onClick={handleConfirmComplete}
        >
          ✔ Xác nhận hoàn thành (update status)
        </Button>
      ),
    
      <Button key="close" onClick={onClose}>
        Đóng
      </Button>
    ]}
  >

      <section className="rc-md">

        {/* ================= HEADER ================= */}
        <header className="rc-md__header">

          <div>

            <h2>
              🚑 Yêu cầu #{data?.rescueRequest?.rescueRequestId}
            </h2>

            <p>
              {data?.rescueRequest?.createdAt &&
                new Date(data.rescueRequest.createdAt).toLocaleString()}
            </p>

          </div>

          <div>
            {/* <Tag color="blue">{data?.currentProgressLabel}</Tag> */}
            <Tag color={urgencyColor[urgency?.levelName]}>
  {urgencyLabel}
</Tag>
          </div>

        </header>

        <div className="divider" />

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="loading-box">
            <Spin indicator={<LoadingOutlined spin />} />
            <p>Đang tải tiến trình...</p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && (
          <Alert type="error" message={error} showIcon />
        )}

        {/* ================= CONTENT ================= */}
        {!loading && !error && data && (
          <>

            {/* ================= TIMELINE ================= */}
            <div className="rescue-progress-timeline">

{STATUS_STEPS.map((step, index) => {

  const isActive = index === currentIndex;
  const isDone = index < currentIndex;

  return (

    <div key={step.key} className="rp-step">

      <div
        className={`rp-item 
        ${isActive ? "active" : ""} 
        ${isDone ? "done" : ""}`}
      >

        <div className="rp-icon">
          {step.icon}
        </div>

        <div className="rp-text">
          {step.label}
        </div>

      </div>

      {index < STATUS_STEPS.length - 1 && (
        <div className={`rp-line ${isDone ? "done" : ""}`} />
      )}

    </div>

  );

})}

</div>

            <div className="detail-grid">

              {/* LEFT */}
              <div className="left-col">

                <section className="card">
                  <h4>👤 THÔNG TIN NGƯỜI GỬI</h4>
                  <p><b>Họ tên:</b> {data.rescueRequest?.fullName}</p>
                  <p><b>SĐT:</b> {data.rescueRequest?.contactPhone}</p>
                  <p><b>Địa chỉ:</b> {data.rescueRequest?.address}</p>
                </section>
                <section className="card">
                  <h4>📌 LOẠI YÊU CẦU</h4>
                  <p>{getRequestTypeLabel(data.rescueRequest?.requestType)}</p>
                </section>

                <section className="card">
                  <h4>📋 MÔ TẢ CHI TIẾT</h4>
                  <p>{data.rescueRequest?.detailDescription}</p>
                </section>
                <section className="card">
                  <h4>📷 HÌNH ẢNH THỰC TẾ </h4>

                  {images?.length > 0 ? (
                    <Image.PreviewGroup>
                      {images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          width="100%"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </Image.PreviewGroup>
                  ) : (
                    <p>Không có ảnh</p>
                  )}

                </section>
                {data.rescueRequest?.locationLat && (
                  <section className="map-card">
                    <iframe
                      title="map"
                      src={`https://www.google.com/maps?q=${data.rescueRequest.locationLat},${data.rescueRequest.locationLng}&z=15&output=embed`}
                    />
                  </section>
                )}

              </div>

              {/* RIGHT */}
              <div className="right-col">

               
                

                <section className="card">
                  <h4>📊 THÔNG TIN & Mô Tả</h4>
                  <p><b>Số người:</b> {data.rescueRequest?.victimCount}</p>
                  <p><b>Dụng cụ:</b> {data.rescueRequest?.availableRescueTool || "Không có"}</p>
                  <p><b>Nhu cầu:</b> {data.rescueRequest?.specialNeeds}</p>
                  <p><b>Ghi chú:</b> {data.rescueRequest?.rescueTeamNote || "Không có"}</p>
                </section>

                <section className="card">
                  <h4>👨‍🚒 ĐỘI CỨU HỘ</h4>
                  <p><b>Tên:</b> {data.assignment?.rescueTeam?.teamName}</p>
                  <p><b>SĐT:</b> {data.assignment?.rescueTeam?.contactPhone}</p>
                  <p><b>Khu vực:</b> {data.assignment?.rescueTeam?.areaName}</p>
                </section>

                <section className="card">
                  <h4>🚗 PHƯƠNG TIỆN</h4>
                  <p><b>Tên:</b> {data.assignment?.vehicle?.vehicleName}</p>
                  <p><b>Loại:</b> {data.assignment?.vehicle?.vehicleType}</p>
                  {/* <p><b>Trạng thái:</b> {data.assignment?.vehicle?.vehicleStatus}</p> */}
                  <p><b>Vị trí:</b> {data.assignment?.vehicle?.vehicleLocation}</p>
                </section>

                <section className="card">
                  <h4>⚙️ HỆ THỐNG GHI NHẬN </h4>
                  <p><b>Xác minh:</b> {data.isVerified ? "✔️" : "❌"}</p>
                  <p><b>Đã phân công:</b> {data.isAssigned ? "✔️" : "❌"}</p>
                  <p><b>Trạng thái:</b> {data.assignment?.assignmentStatusLabel}</p>
                </section>

              </div>

            </div>

          </>
        )}

      </section>

    </Modal>
  );

};

export default RescueProgressModal;