import { Button, Input, Image } from "antd";
import { useState, useEffect } from "react";
import { PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  getUrgencyLevels,
  verifyAndDispatchRescueRequest
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import AuthNotify from "../../../utils/Common/AuthNotify";

import "./MissionDetail.css";

const IMAGE_BASE = "https://api-rescue.purintech.id.vn";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

export default function MissionDetail({ mission }) {

  const [urgencyLevels, setUrgencyLevels] = useState([]);
  const [priority, setPriority] = useState(null);
  const [note, setNote] = useState("");

  const navigate = useNavigate();

  /* ================= CHECK MISSION ================= */

  if (!mission) {

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 600,
          color: "#555"
        }}
      >
        Chọn yêu cầu bên trái để xem chi tiết
      </div>
    );

  }

  /* ================= DEBUG ================= */

  console.log("MISSION DATA:", mission);

  /* ================= LOAD URGENCY LEVEL ================= */

  useEffect(() => {

    const fetchUrgencyLevels = async () => {

      try {

        const data = await getUrgencyLevels();
        setUrgencyLevels(data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchUrgencyLevels();

  }, []);

  /* ================= IMAGE FIX ================= */

  const images =
    mission?.imageUrls ||
    mission?.images ||
    [];

  /* ================= HANDLE CONFIRM ================= */

  const handleConfirm = async () => {

    if (!priority) return;

    const index = parseInt(priority.replace("P", "")) - 1;

    const level = urgencyLevels[index];

    if (!level) return;

    try {

      await verifyAndDispatchRescueRequest(
        mission.id,
        {
          urgencyLevelId: level.urgencyLevelId,
          note: note || "Xác minh yêu cầu cứu hộ"
        }
      );

      AuthNotify.success("Xác nhận và điều phối thành công");

      navigate("/coordinator/dang", {
        state: { mission, priority }
      });

    }
    catch (err) {

      console.error("Dispatch error:", err);

      AuthNotify.error("Xác nhận điều phối thất bại");

    }

  };

  /* ================= RENDER ================= */

  return (

    <section className="rc-md">

      {/* HEADER */}

      <header className="rc-md__header">

        <div className="rc-md__header-info">

          <h2 className="request-title">

            Yêu cầu #{mission.id}

            <span className="status status-pending">
              CHỜ XÁC MINH
            </span>

          </h2>

          <p className="request-meta">
            Tiếp nhận lúc {new Date(mission.createdAt).toLocaleString()}
          </p>

        </div>

        <Button
          icon={<PhoneOutlined />}
          className="call-btn rc-md__action-call"
          href={`tel:${mission.phone}`}
        >
          GỌI XÁC MINH
        </Button>

      </header>

      <div className="divider" />

      <div className="detail-grid rc-md__content">

        {/* LEFT */}

        <div className="left-col">

          {/* USER INFO */}

          <section className="card">

            <h4 className="card-title">👤 THÔNG TIN NGƯỜI DÂN</h4>

            <div className="info-row">

              <div className="info-item">
                <label>HỌ VÀ TÊN</label>
                <strong>{mission.name || mission.fullname}</strong>
              </div>

              <div className="info-item">
                <label>SỐ ĐIỆN THOẠI</label>
                <strong className="phone">{mission.phone}</strong>
              </div>

            </div>

            <label>ĐỊA CHỈ HIỆN TẠI</label>

            <p className="address-text">
              {mission.location}
            </p>

          </section>

          {/* DESCRIPTION */}

          <section className="card">

            <h4 className="card-title">
              📋 TÌNH TRẠNG KHẨN CẤP
            </h4>

            <p className="quote">
              {mission.detailDescription}
            </p>

          </section>

          {/* RESOURCES */}

          <section className="card">

            <h4 className="card-title">
              🧰 NGUỒN LỰC & MÔ TẢ
            </h4>

            <div className="resource-grid">

              <div className="resource-item">
                <label>SỐ NGƯỜI GẶP NẠN</label>
                <p>{mission.victimCount}</p>
              </div>

              <div className="resource-item">
                <label>DỤNG CỤ CỨU HỘ</label>
                <p>{mission.availableRescueTools}</p>
              </div>

            </div>

            <label>NHU CẦU ĐẶC BIỆT</label>

            <p>{mission.specialNeeds}</p>

          </section>

          {/* MAP */}

          <section className="map-card">

            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${mission.lat},${mission.lng}&z=13&output=embed`}
            />

          </section>

        </div>

        {/* RIGHT */}

        <div className="right-col">

          {/* IMAGE */}

          <section className="card">

            <h4 className="card-title">
              📷 HÌNH ẢNH HIỆN TRƯỜNG
            </h4>

            <Image.PreviewGroup>

              <div className="image-grid">

                {images.length > 0 ? (

                  images.map((img, i) => {

                    const imageUrl =
                      img.startsWith("http")
                        ? img
                        : `${IMAGE_BASE}${img}`;

                    return (

                      <Image
                        key={i}
                        width={140}
                        src={imageUrl}
                        alt={`rescue-${i}`}
                      />

                    );

                  })

                ) : (

                  <p style={{ color: "#888" }}>
                    Không có hình ảnh
                  </p>

                )}

              </div>

            </Image.PreviewGroup>

          </section>

          {/* PRIORITY */}

          <section className="card rc-priority-card">

            <h4 className="card-title">
              ⚠️ PHÂN LOẠI ƯU TIÊN
            </h4>

            {urgencyLevels.map((level, index) => {

              const priorityCode = `P${index + 1}`;

              return (

                <div
                  key={level.urgencyLevelId}
                  className={`rc-priority-item rc-p${index + 1}
                  ${priority === priorityCode ? "is-active" : ""}`}
                  onClick={() => setPriority(priorityCode)}
                >

                  <span className="rc-radio" />

                  <div className="rc-priority-content">

                    <strong>
                      {priorityTranslate[level.levelName] || level.levelName}
                    </strong>

                    <p>{level.description}</p>

                    <small className="sla-text">
                      Thời gian xử lý:
                      {" "}
                      {Math.floor(level.slaMinutes / 60)} giờ
                    </small>

                  </div>

                </div>

              );

            })}

          </section>

          {/* NOTE */}

          <section className="card">

            <h4 className="card-title">
              📝 GHI CHÚ XÁC MINH
            </h4>

            <Input.TextArea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

          </section>

          {/* ACTION */}

          <Button
            className="confirm-btn"
            disabled={!priority}
            onClick={handleConfirm}
          >
            ▶ XÁC NHẬN & CHUYỂN ĐIỀU PHỐI
          </Button>

          <p className="danger-text rc-md__action-flag">
            Đánh dấu yêu cầu giả mạo / Trùng lặp
          </p>

        </div>

      </div>

    </section>

  );

}