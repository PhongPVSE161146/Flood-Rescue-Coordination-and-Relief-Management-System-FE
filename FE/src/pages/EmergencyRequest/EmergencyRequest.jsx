

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmergencyHeader from "../../components/EmergencyHeader/EmergencyHeader";
import EmergencyFooter from "../../components/EmergencyFooter/EmergencyFooter";
import EmergencyNotify from "../../utils/EmergencyNotify";

import {
  Input,
  Select,
  Checkbox,
  Button,
  Upload,
  message,
  InputNumber
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  WarningOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { createRescueRequest } from "../../api/service/emergencyApi";
import "./EmergencyRequest.css";

const { TextArea } = Input;
const { Option } = Select;

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" },
];
const SPECIFIC_CONDITION_OPTIONS = [
  { value: "SevereFlood", label: "Ngập nặng" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "Landslide", label: "Sạt lở" },
  { value: "InjuredPeople", label: "Có người bị thương" },
  { value: "ElderlyOrChildren", label: "Người già/trẻ em" },
  { value: "PowerOrCommunicationOutage", label: "Mất điện/liên lạc" },
];
const DEFAULT_AREA_ID = 1;

const EmergencyRequest = () => {
  const [gps, setGps] = useState(null);
  const [address, setAddress] = useState("");
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    primaryPhone: "",
    backupPhone: "",
    mainIncidentType: "",
    specificConditions: [],
    victimCount: "",
    availableRescueTools: "",
    specialNeeds: "",
    detailDescription: "",
    landmarkNote: "",
    images: [],
  });

  /* ===== VALIDATE ALL FIELDS ===== */
  const validateForm = () => {
    const newErrors = {};
    const errorMessages = {};

    if (!form.fullname?.trim()) {
      newErrors.fullname = true;
      errorMessages.fullname = "Vui lòng nhập họ và tên";
    }
    if (!form.primaryPhone?.trim()) {
      newErrors.primaryPhone = true;
      errorMessages.primaryPhone = "Vui lòng nhập số điện thoại chính";
    }
    if (!form.mainIncidentType) {
      newErrors.mainIncidentType = true;
      errorMessages.mainIncidentType = "Vui lòng chọn loại sự cố";
    }
    if (!form.specificConditions?.length) {
      newErrors.specificConditions = true;
      errorMessages.specificConditions = "Vui lòng chọn ít nhất một tình trạng";
    }
    if (!form.detailDescription?.trim()) {
      newErrors.detailDescription = true;
      errorMessages.detailDescription = "Vui lòng nhập mô tả chi tiết";
    }
    if (!gps) {
      newErrors.gps = true;
      errorMessages.gps = "Vui lòng lấy tọa độ GPS";
    }

    setErrors({ ...newErrors, messages: errorMessages });
    return Object.keys(newErrors).length === 0;
  };

  /* ===== GPS ===== */
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ GPS");
      return;
    }

    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGps({ lat, lng });
        setErrors(prev => ({ ...prev, gps: false }));

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`
          );
          const data = await res.json();
          setAddress(data.display_name || "Không xác định");
        } catch {
          setAddress("Không lấy được địa chỉ");
        } finally {
          setLoadingGPS(false);
        }
      },
      () => {
        message.error("Không lấy được vị trí");
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* ===== SUBMIT API ===== */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const fd = new FormData();
    fd.append("Fullname", form.fullname.trim());
    fd.append("PrimaryPhone", form.primaryPhone.trim());
    if (form.backupPhone?.trim()) fd.append("BackupPhone", form.backupPhone.trim());
    fd.append("MainIncidentType", form.mainIncidentType);
    (form.specificConditions || []).forEach((v) => {
      fd.append("SpecificConditions", v);
    });

    const victimCount = form.victimCount ? Number(form.victimCount) : "";
    if (victimCount !== "") fd.append("VictimCount", victimCount);
    fd.append("AvailableRescueTools", form.availableRescueTools ?? "");
    fd.append("SpecialNeeds", form.specialNeeds ?? "");
    fd.append("DetailDescription", form.detailDescription ?? "");
    fd.append("LandmarkNote", form.landmarkNote ?? "");
    fd.append("CurrentAddress", address);
    fd.append("LocationLat", String(gps.lat));
    fd.append("LocationLng", String(gps.lng));
    fd.append("AreaId", DEFAULT_AREA_ID);

    (form.images || []).forEach((file) => {
      const raw = file?.originFileObj ?? file;
      if (raw instanceof File) fd.append("Images", raw);
    });

    try {
      await createRescueRequest(fd);

      EmergencyNotify.success(
        "Tạo yêu cầu thành công",
        "Yêu cầu cứu hộ đã được gửi tới hệ thống"
      );
      setForm({
        fullname: "",
        primaryPhone: "",
        backupPhone: "",
        mainIncidentType: "",
        specificConditions: [],
        victimCount: "",
        availableRescueTools: "",
        specialNeeds: "",
        detailDescription: "",
        landmarkNote: "",
        images: [],
      });
      setErrors({});
      setGps(null);
      setAddress("");
      setTimeout(() => navigate("/map"), 2000);
    } catch (err) {
      const msg = err.response?.data?.title || err.response?.data?.message || err.message || "Gửi yêu cầu thất bại";
      EmergencyNotify.error("Lỗi", msg);
    }
  };

  return (
    <>
      <EmergencyHeader />

      <main className="emergency-page">
        <div className="emergency-container">
          {/* ================= LEFT FORM ================= */}
          <section className="emergency-form">
            <h2>GỬI YÊU CẦU CỨU HỘ</h2>
            <p className="sub">
              Hệ thống tiếp nhận thông tin trực tiếp cho đội cứu hộ hiện trường.
            </p>

            {/* ===== 1 ===== */}
            <div className="form-section section-1">
              <h4>
                <UserOutlined /> 1. THÔNG TIN NGƯỜI GỬI YÊU CẦU
              </h4>

              <label>HỌ VÀ TÊN NGƯỜI GỬI *</label>
              <Input
                placeholder="Họ và tên"
                status={errors.fullname ? "error" : ""}
                value={form.fullname}
                onChange={(e) =>
                  setForm({ ...form, fullname: e.target.value })
                }
              />
              {errors.fullname && <p className="error-message">{errors.messages?.fullname}</p>}

              <div className="form-row">
                <div>
                  <label>SỐ ĐIỆN THOẠI CHÍNH *</label>
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="SĐT chính"
                    status={errors.primaryPhone ? "error" : ""}
                    value={form.primaryPhone}
                    onChange={(e) =>
                      setForm({ ...form, primaryPhone: e.target.value })
                    }
                  />
                  {errors.primaryPhone && <p className="error-message">{errors.messages?.primaryPhone}</p>}
                </div>
                <div>
                  <label>SỐ ĐIỆN THOẠI DỰ PHÒNG</label>
                  <Input
                    placeholder="SĐT dự phòng"
                    value={form.backupPhone}
                    onChange={(e) =>
                      setForm({ ...form, backupPhone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ===== 2 ===== */}
            <div className="form-section section-2">
              <h4 className="section-title">
                ⚠️ 2. LOẠI SỰ CỐ & TÌNH TRẠNG HIỆN TRƯỜNG
              </h4>

              <label className="field-label">
                LOẠI SỰ CỐ CHÍNH *
              </label>
              <Select
                className="full-width"
                placeholder="Chọn loại sự cố"
                status={errors.mainIncidentType ? "error" : ""}
                value={form.mainIncidentType || undefined}
                onChange={(v) =>
                  setForm({ ...form, mainIncidentType: v })
                }
              >
                {MAIN_INCIDENT_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
              {errors.mainIncidentType && <p className="error-message">{errors.messages?.mainIncidentType}</p>}

              <label className="field-label mt">
                TÌNH TRẠNG CỤ THỂ (CHỌN CÁC MỤC ÁP DỤNG) *
              </label>

              <div className="condition-wrapper">
  <Checkbox.Group
    value={form.specificConditions}
    onChange={(v) => setForm({ ...form, specificConditions: v })}
  >
    <div className="condition-grid">
      {SPECIFIC_CONDITION_OPTIONS.map((o) => (
        <Checkbox key={o.value} value={o.value} className="condition-item">
          {o.label}
        </Checkbox>
      ))}
    </div>
  </Checkbox.Group>
</div>
              {errors.specificConditions && <p className="error-message">{errors.messages?.specificConditions}</p>}
            </div>

            {/* ===== 3 ===== */}
            <div className="form-section section-3">
              <h4>📍 3. VỊ TRÍ CHÍNH XÁC</h4>

              <div className="location-grid">
                <div className="location-left">
                  <label>ĐỊA CHỈ HIỆN TẠI *</label>
                  <Input
                    placeholder="Địa chỉ sẽ tự động điền theo GPS"
                    value={address}
                    status={errors.gps ? "error" : ""}
                    readOnly
                  />
                  {errors.gps && <p className="error-message">{errors.messages?.gps}</p>}

                  <label>GHI CHÚ ĐIỂM NHẬN DẠNG</label>
                  <Input
                    placeholder="Gần cây đa, đối diện tiệm thuốc..."
                    value={form.landmarkNote}
                    onChange={(e) => setForm({ ...form, landmarkNote: e.target.value })}
                  />

                  <Button
                    type="primary"
                    className="gps-locate-btn"
                    loading={loadingGPS}
                    onClick={handleGetGPS}
                  >
                    🎯 LẤY TỌA ĐỘ GPS HIỆN TẠI
                  </Button>
                </div>

                <div className="location-map">
                  <iframe
                    title="google-map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={
                      gps
                        ? `${import.meta.env.VITE_GOOGLE_MAP_EMBED}?q=${gps.lat},${gps.lng}&z=16&output=embed`
                        : `${import.meta.env.VITE_GOOGLE_MAP_EMBED}?q=10.8231,106.6297&z=12&output=embed`
                    }
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* ===== 4 ===== */}
            <div className="form-section section-4">
              <h4>🧰 4. NGUỒN LỰC & MÔ TẢ CHI TIẾT</h4>

              <div className="form-row">
                <div>
                  <label>SỐ LƯỢNG NGƯỜI GẶP NẠN</label>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Số người gặp nạn"
                    min={0}
                    value={form.victimCount}
                    onChange={(value) =>
                      setForm({ ...form, victimCount: value })
                    }
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div>
                  <label>DỤNG CỤ CỨU HỘ HIỆN CÓ</label>
                  <Input
                    placeholder="Dụng cụ cứu hộ"
                    value={form.availableRescueTools}
                    onChange={(e) =>
                      setForm({ ...form, availableRescueTools: e.target.value })
                    }
                  />
                </div>
              </div>

              <label>NHU CẦU ĐẶC BIỆT</label>
              <Input
                placeholder="Nhu cầu đặc biệt (nếu có)"
                value={form.specialNeeds}
                onChange={(e) =>
                  setForm({ ...form, specialNeeds: e.target.value })
                }
              />

              <label>MÔ TẢ CHI TIẾT *</label>
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết"
                status={errors.detailDescription ? "error" : ""}
                value={form.detailDescription}
                onChange={(e) =>
                  setForm({ ...form, detailDescription: e.target.value })
                }
              />
              {errors.detailDescription && <p className="error-message">{errors.messages?.detailDescription}</p>}
            </div>

            {/* ===== 5 ===== */}
            <div className="form-section section-5">
              <h4>📷 5. HÌNH ẢNH HIỆN TRƯỜNG</h4>

              <Upload
                listType="picture"
                multiple
                className="emergency-upload"
                beforeUpload={() => false}
                onChange={({ fileList }) =>
                  setForm({ ...form, images: fileList })
                }
              >
                <div className="upload-dropzone">
                  <UploadOutlined className="upload-icon" />
                  <p className="upload-title">
                    TẢI ẢNH HIỆN TRƯỜNG
                  </p>
                  <span className="upload-sub">
                    Nhấn để chụp hoặc tải ảnh (JPG, PNG)
                  </span>
                </div>
              </Upload>
            </div>

            <Button block className="submit-btn" onClick={handleSubmit}>
              GỬI YÊU CẦU CỨU TRỢ →
            </Button>
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="emergency-info">
            <div className="hotline-box">
              <h3>📞 HOTLINE KHẨN CẤP</h3>
              <div className="hotline red">113 – CẢNH SÁT</div>
              <div className="hotline orange">114 – CỨU HỎA</div>
              <div className="hotline green">115 – CẤP CỨU</div>
            </div>

            <div className="note-box">
              <h4>HƯỚNG DẪN AN TOÀN</h4>
              <ul>
                <li>Giữ điện thoại luôn bật.</li>
                <li>Di chuyển đến nơi an toàn.</li>
                <li>Dùng đèn pin hoặc vật sáng.</li>
              </ul>
            </div>

            <div className="status-box">
              🟢 HỆ THỐNG ĐANG HOẠT ĐỘNG
              <span>Cập nhật: 1 phút trước</span>
            </div>
          </aside>
        </div>
      </main>

      <EmergencyFooter />
    </>
  );
};

export default EmergencyRequest;
