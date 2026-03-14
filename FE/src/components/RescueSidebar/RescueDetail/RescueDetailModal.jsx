import { Modal, Button, Image } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

import "./RescueDetailModal.css";

const IMAGE_BASE = "https://api-rescue.purintech.id.vn/";
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

const REQUEST_TYPE_OPTIONS = REQUEST_TYPES.map(t => ({
  value: t,
  label: t
}));
export default function RescueDetailModal({ data, onClose }) {

  if (!data) return null;

  const imageUrl = data.locationImageUrl
    ? `${IMAGE_BASE}${data.locationImageUrl}`
    : null;
    const getRequestTypeLabel = (value) => {
      const found = REQUEST_TYPE_OPTIONS.find(
        (item) => item.value === value
      );
      return found ? found.label : value;
    };
  return (

    <Modal
      open={!!data}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >

      <section className="rc-md">

        {/* HEADER */}

        <header className="rc-md__header">

          <div className="rc-md__header-info">

            <h2 className="request-title">

              Yêu cầu #{data.rescueRequestId}

              <span className="status status-pending">
                {data.status || "ĐANG XỬ LÝ"}
              </span>

            </h2>

            <p className="request-meta">

              Tiếp nhận lúc{" "}
              {new Date(data.createdAt).toLocaleString()}

            </p>

          </div>

       

        </header>

        <div className="divider" />

        <div className="detail-grid">

          {/* LEFT */}

          <div className="left-col">

            {/* USER */}

            <section className="card">

              <h4 className="card-title">
                👤 THÔNG TIN NGƯỜI DÂN
              </h4>

              <div className="info-row">

                <div className="info-item">
                  <label>HỌ VÀ TÊN</label>
                  <strong>{data.fullName}</strong>
                </div>

                <div className="info-item">
                  <label>SỐ ĐIỆN THOẠI</label>
                  <strong className="phone">
                    {data.contactPhone}
                  </strong>
                </div>

              </div>

              <label>ĐỊA CHỈ</label>

              <p className="address-text">
                {data.address || "Không có địa chỉ"}
              </p>

            </section>

            {/* DESCRIPTION */}

            <section className="card">

              <h4 className="card-title">
                📋 TÌNH TRẠNG KHẨN CẤP
              </h4>

              <p className="quote">
                {data.detailDescription}
              </p>

            </section>

            {/* RESOURCE */}

    

            {/* MAP */}

            {data.locationLat && data.locationLng && (

              <section className="map-card">

                <iframe
                  title="map"
                  src={`https://www.google.com/maps?q=${data.locationLat},${data.locationLng}&z=15&output=embed`}
                />

              </section>

            )}

          </div>

          {/* RIGHT */}

          <div className="right-col">

            <section className="card">

              <h4 className="card-title">
                📷 HÌNH ẢNH HIỆN TRƯỜNG
              </h4>

              {imageUrl ? (

                <Image
                  src={imageUrl}
                  width="100%"
                />

              ) : (

                <p style={{ color:"#888" }}>
                  Không có hình ảnh
                </p>

              )}

            </section>

            <section className="card">

  <h4 className="card-title">
    📌 LOẠI YÊU CẦU
  </h4>

  <p style={{ fontWeight:600 }}>
    {getRequestTypeLabel(data.requestType)}
  </p>

</section>
<section className="card">

<h4 className="card-title">
  🧰 NGUỒN LỰC
</h4>

<div className="resource-grid">

  <div className="resource-item">
    <label>SỐ NGƯỜI GẶP NẠN</label>
    <p>{data.victimCount}</p>
  </div>

  <div className="resource-item">
    <label>DỤNG CỤ CỨU HỘ</label>
    <p>{data.availableRescueTool}</p>
  </div>

</div>

<label>NHU CẦU ĐẶC BIỆT</label>

<p>{data.specialNeeds}</p>

<label>GHI CHÚ CHO ĐỘI CỨU HỘ</label>

<p>{data.rescueTeamNote || "Không có"}</p>

</section>

          </div>

        </div>

      </section>

    </Modal>

  );

}