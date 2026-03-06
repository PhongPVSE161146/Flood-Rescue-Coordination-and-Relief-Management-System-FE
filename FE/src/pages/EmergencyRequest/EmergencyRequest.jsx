import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import EmergencyHeader from "../../Layout/EmergencyHeader/EmergencyHeader";
import EmergencyFooter from "../../Layout/EmergencyFooter/EmergencyFooter";
import AuthNotify from "../../utils/Common/AuthNotify";
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
  UploadOutlined,
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

  const [startTime] = useState(new Date()); // thời điểm hệ thống active
const [timeAgo, setTimeAgo] = useState("Vừa xong");

useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now - startTime) / 60000);

    if (diffMinutes <= 0) {
      setTimeAgo("Vừa xong");
    } else if (diffMinutes === 1) {
      setTimeAgo("1 phút trước");
    } else {
      setTimeAgo(`${diffMinutes} phút trước`);
    }
  };

  updateTime(); // chạy lần đầu

  const interval = setInterval(updateTime, 60000); // mỗi 1 phút

  return () => clearInterval(interval);
}, [startTime]);

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

  /* ================= VALIDATE ================= */
  const validateForm = () => {

    const newErrors = {};
    const errorMessages = {};
  
    /* ===== NORMALIZE PHONE ===== */
  
    const primaryPhone =
      form.primaryPhone?.replace(/\D/g, "").trim();
  
    const backupPhone =
      form.backupPhone?.replace(/\D/g, "").trim();
  
    /* ===== REGEX SỐ VIỆT NAM ===== */
  
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  
    /* ===== 1. FULLNAME ===== */
  
    if (!form.fullname?.trim()) {
  
      newErrors.fullname = true;
      errorMessages.fullname = "Vui lòng nhập họ và tên";
  
    }
    else if (form.fullname.trim().length < 3) {
  
      newErrors.fullname = true;
      errorMessages.fullname = "Họ tên phải ít nhất 3 ký tự";
  
    }
  
    /* ===== 2. PRIMARY PHONE ===== */
  
    if (!primaryPhone) {
  
      newErrors.primaryPhone = true;
      errorMessages.primaryPhone =
        "Vui lòng nhập số điện thoại chính";
  
    }
    else if (!phoneRegex.test(primaryPhone)) {
  
      newErrors.primaryPhone = true;
      errorMessages.primaryPhone =
        "Số điện thoại phải gồm 10 số ";
  
    }
  
    /* ===== 3. BACKUP PHONE ===== */
  
    if (backupPhone) {
  
      if (!phoneRegex.test(backupPhone)) {
  
        newErrors.backupPhone = true;
        errorMessages.backupPhone =
          "Số điện thoại phụ không hợp lệ";
  
      }
  
      if (backupPhone === primaryPhone) {
  
        newErrors.backupPhone = true;
        errorMessages.backupPhone =
          "SĐT phụ không được trùng SĐT chính";
  
      }
  
    }
  
    /* ===== 4. MAIN INCIDENT ===== */
  
    if (!form.mainIncidentType) {
  
      newErrors.mainIncidentType = true;
      errorMessages.mainIncidentType =
        "Vui lòng chọn loại sự cố";
  
    }
  
    /* ===== 5. SPECIFIC CONDITIONS ===== */
  
    if (!form.specificConditions?.length) {
  
      newErrors.specificConditions = true;
      errorMessages.specificConditions =
        "Vui lòng chọn ít nhất một tình trạng";
  
    }
  
    /* ===== 6. GPS ===== */
  
    if (!gps) {
  
      newErrors.gps = true;
      errorMessages.gps = "Vui lòng lấy tọa độ GPS";
  
    }
  
    /* ===== 7. VICTIM COUNT ===== */
  
    if (form.victimCount === "" || form.victimCount === null) {
  
      newErrors.victimCount = true;
      errorMessages.victimCount =
        "Vui lòng nhập số người gặp nạn (0 nếu không có)";
  
    }
    else if (
      isNaN(form.victimCount) ||
      Number(form.victimCount) < 0
    ) {
  
      newErrors.victimCount = true;
      errorMessages.victimCount =
        "Số người gặp nạn không hợp lệ";
  
    }
  
    /* ===== 8. RESCUE TOOLS ===== */
  
    if (!form.availableRescueTools?.trim()) {
  
      newErrors.availableRescueTools = true;
      errorMessages.availableRescueTools =
        "Vui lòng nhập dụng cụ cứu hộ (nếu không có ghi 'Không')";
  
    }
    else if (form.availableRescueTools.length > 200) {
  
      newErrors.availableRescueTools = true;
      errorMessages.availableRescueTools =
        "Dụng cụ cứu hộ tối đa 200 ký tự";
  
    }
  
    /* ===== 9. SPECIAL NEEDS ===== */
  
    if (!form.specialNeeds?.trim()) {
  
      newErrors.specialNeeds = true;
      errorMessages.specialNeeds =
        "Vui lòng nhập nhu cầu đặc biệt";
  
    }
    else if (form.specialNeeds.length > 200) {
  
      newErrors.specialNeeds = true;
      errorMessages.specialNeeds =
        "Nhu cầu đặc biệt tối đa 200 ký tự";
  
    }
  
    /* ===== 10. DETAIL DESCRIPTION ===== */
  
    if (!form.detailDescription?.trim()) {
  
      newErrors.detailDescription = true;
      errorMessages.detailDescription =
        "Vui lòng nhập mô tả chi tiết";
  
    }
    else if (form.detailDescription.trim().length < 10) {
  
      newErrors.detailDescription = true;
      errorMessages.detailDescription =
        "Mô tả phải ít nhất 10 ký tự";
  
    }
  
    /* ===== 11. LANDMARK ===== */
  
    if (!form.landmarkNote?.trim()) {
  
      newErrors.landmarkNote = true;
      errorMessages.landmarkNote =
        "Vui lòng nhập ghi chú điểm nhận dạng";
  
    }
    else if (form.landmarkNote.trim().length > 50) {
  
      newErrors.landmarkNote = true;
      errorMessages.landmarkNote =
        "Ghi chú tối đa 50 ký tự";
  
    }
  
    /* ===== 12. IMAGES ===== */
  
    if (!form.images || form.images.length === 0) {
  
      newErrors.images = true;
      errorMessages.images =
        "Vui lòng tải lên ít nhất một hình ảnh";
  
    }
    else if (form.images.length > 5) {
  
      newErrors.images = true;
      errorMessages.images =
        "Tối đa 5 hình ảnh";
  
    }
  
    setErrors({
      ...newErrors,
      messages: errorMessages
    });
  
    return Object.keys(newErrors).length === 0;
  
  };

  /* ================= GPS ================= */
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      AuthNotify.error(
        "Thiết bị không hỗ trợ GPS",
        "Vui lòng sử dụng trình duyệt khác"
      );
      return;
    }

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setGps({ lat, lng });

        setErrors(prev => ({
          ...prev,
          gps: false,
          messages: { ...(prev.messages || {}), gps: "" }
        }));

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
        AuthNotify.error(
          "Không lấy được vị trí",
          "Vui lòng bật định vị"
        );
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (!validateForm()) return;
  
    const phone = form.primaryPhone.trim();
  
    const fd = new FormData();
  
    fd.append("Fullname", form.fullname.trim());
    fd.append("PrimaryPhone", phone);
    fd.append("MainIncidentType", form.mainIncidentType);
  
    form.specificConditions.forEach(v =>
      fd.append("SpecificConditions", v)
    );
  
    if (form.landmarkNote)
      fd.append("LandmarkNote", form.landmarkNote.trim());
  
    if (form.victimCount !== "")
      fd.append("VictimCount", Number(form.victimCount));
  
    fd.append("AvailableRescueTools", form.availableRescueTools || "");
    fd.append("SpecialNeeds", form.specialNeeds || "");
    fd.append("DetailDescription", form.detailDescription || "");
    fd.append("CurrentAddress", address || "");
  
    if (gps) {
  
      fd.append("LocationLat", String(gps.lat));
      fd.append("LocationLng", String(gps.lng));
  
    }
  
    fd.append("AreaId", DEFAULT_AREA_ID);
  
    if (form.images?.length) {
  
      form.images.forEach(file => {
  
        const raw = file.originFileObj;
  
        if (raw) fd.append("Images", raw);
  
      });
  
    }
  
    try {
  
      await createRescueRequest(fd);
  
      AuthNotify.success(
        "Tạo yêu cầu thành công",
        "Yêu cầu cứu hộ đã được gửi"
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
  
      setGps(null);
      setAddress("");
      setErrors({});
  
      setTimeout(() => navigate("/map"), 2000);
  
    }
  
    catch (error) {
  
      const msg =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message ||
      "";
    
    const lowerMsg = msg.toLowerCase();
    
    if (
      lowerMsg.includes("số điện thoại") ||
      lowerMsg.includes("phone") ||
      lowerMsg.includes("rescue")
    ) {
    
      AuthNotify.error(
        "Số điện thoại đã tồn tại",
        "Số điện thoại này đã có yêu cầu cứu hộ đang xử lý"
      );
    
      setErrors(prev => ({
        ...prev,
        primaryPhone: true,
        messages: {
          ...(prev?.messages || {}),
          primaryPhone: "Số điện thoại đã có yêu cầu cứu hộ"
        }
      }));
    
      return;
    }
      /* ===== ERROR KHÁC ===== */
  
      AuthNotify.error(
        "Gửi yêu cầu thất bại",
        "Số điện thoại này đã có yêu cầu cứu hộ đang tồn tại. Không thể tạo thêm yêu cầu mới"
      );
  
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

              <label>HỌ VÀ TÊN NGƯỜI GỬI{" "}
              <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
              <Input
                placeholder="Họ và tên"
                status={errors.fullname ? "error" : ""}
                value={form.fullname}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, fullname: value });
                
                  if (value.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      fullname: false,
                      messages: { ...prev.messages, fullname: "" }
                    }));
                  }
                }}
              />
              {errors.fullname && <p className="error-message">{errors.messages?.fullname}</p>}

              <div className="form-row">
                <div>
                  <label>SỐ ĐIỆN THOẠI CHÍNH{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
                  <Input
  prefix={<PhoneOutlined />}
  placeholder="SĐT chính"
  maxLength={10}
  status={errors.primaryPhone ? "error" : ""}
  value={form.primaryPhone}
  onChange={(e) => {

    const onlyNumber =
      e.target.value.replace(/\D/g, "");

    setForm({ ...form, primaryPhone: onlyNumber });

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;

    if (phoneRegex.test(onlyNumber)) {
    
      setErrors(prev => ({
        ...prev,
        primaryPhone: false,
        messages: {
          ...(prev.messages || {}),
          primaryPhone: ""
        }
      }));
    
    }

  }}
/>
                  {errors.primaryPhone && <p className="error-message">{errors.messages?.primaryPhone}</p>}
                </div>
            
              </div>
            </div>

            {/* ===== 2 ===== */}
            <div className="form-section section-2">
              <h4 className="section-title">
                ⚠️ 2. LOẠI SỰ CỐ & TÌNH TRẠNG HIỆN TRƯỜNG
              </h4>

              <label className="field-label">
                LOẠI SỰ CỐ CHÍNH{" "}
                <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
              </label>
              <Select
                className="full-width"
                placeholder="Chọn loại sự cố"
                status={errors.mainIncidentType ? "error" : ""}
                value={form.mainIncidentType || undefined}
                onChange={(v) => {
                  setForm({ ...form, mainIncidentType: v });
                
                  if (v) {
                    setErrors(prev => ({
                      ...prev,
                      mainIncidentType: false,
                      messages: { ...prev.messages, mainIncidentType: "" }
                    }));
                  }
                }}
              >
                {MAIN_INCIDENT_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
              {errors.mainIncidentType && <p className="error-message">{errors.messages?.mainIncidentType}</p>}

              <label className="field-label mt">
                TÌNH TRẠNG CỤ THỂ (CHỌN CÁC MỤC ÁP DỤNG){" "}
                <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
              </label>

              <div className="condition-wrapper">
  <Checkbox.Group
    value={form.specificConditions}
    onChange={(v) => {
      setForm({ ...form, specificConditions: v });
    
      if (v.length > 0) {
        setErrors(prev => ({
          ...prev,
          specificConditions: false,
          messages: { ...prev.messages, specificConditions: "" }
        }));
      }
    }}
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
                  <label>ĐỊA CHỈ HIỆN TẠI{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
                  <Input
                    placeholder="Địa chỉ sẽ tự động điền theo GPS"
                    value={address}
                    status={errors.gps ? "error" : ""}
                    readOnly
                  />
                  {errors.gps && <p className="error-message">{errors.messages?.gps}</p>}

                  <label>GHI CHÚ ĐIỂM NHẬN DẠNG{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
<Input
  placeholder="Gần cây đa, đối diện tiệm thuốc..."
  value={form.landmarkNote}
  status={errors.landmarkNote ? "error" : ""}
  onChange={(e) => {
    const value = e.target.value;

    setForm({ ...form, landmarkNote: value });

    // Giới hạn 200 ký tự
    if (value.length > 200) {
      setErrors(prev => ({
        ...prev,
        landmarkNote: true,
        messages: {
          ...(prev.messages || {}),
          landmarkNote: "Ghi chú tối đa 200 ký tự"
        }
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        landmarkNote: false,
        messages: {
          ...(prev.messages || {}),
          landmarkNote: ""
        }
      }));
    }
  }}
/>
{errors.landmarkNote && <p className="error-message">{errors.messages?.landmarkNote}</p>}
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
                  <label>SỐ LƯỢNG NGƯỜI GẶP NẠN{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Số người gặp nạn"
                    min={0}
                    value={form.victimCount}
                    onChange={(value) => {
                      setForm({ ...form, victimCount: value });
                    
                      if (value === "" || value === null) {
                        setErrors(prev => ({
                          ...prev,
                          victimCount: true,
                          messages: {
                            ...(prev.messages || {}),
                            victimCount: "Vui lòng nhập số người gặp nạn (0 nếu không có)"
                          }
                        }));
                      } else if (value < 0) {
                        setErrors(prev => ({
                          ...prev,
                          victimCount: true,
                          messages: {
                            ...(prev.messages || {}),
                            victimCount: "Số người gặp nạn không hợp lệ"
                          }
                        }));
                      } else {
                        setErrors(prev => ({
                          ...prev,
                          victimCount: false,
                          messages: {
                            ...(prev.messages || {}),
                            victimCount: ""
                          }
                        }));
                      }
                    }}
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
                  {errors.victimCount && <p className="error-message">{errors.messages?.victimCount}</p>}
                </div>
                <div>
                  <label>DỤNG CỤ CỨU HỘ HIỆN CÓ{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
                  <Input
                    placeholder="Dụng cụ cứu hộ"
                    value={form.availableRescueTools}
                    onChange={(e) => {
                      const value = e.target.value;
                    
                      setForm({ ...form, availableRescueTools: value });
                    
                      // Nếu hợp lệ thì clear lỗi
                      if (value.length <= 200) {
                        setErrors(prev => ({
                          ...prev,
                          availableRescueTools: false,
                          messages: {
                            ...(prev.messages || {}),
                            availableRescueTools: ""
                          }
                        }));
                      } else {
                        setErrors(prev => ({
                          ...prev,
                          availableRescueTools: true,
                          messages: {
                            ...(prev.messages || {}),
                            availableRescueTools: "Tối đa 200 ký tự"
                          }
                        }));
                      }
                    }}


                  />
                  {errors.availableRescueTools && <p className="error-message">{errors.messages?.availableRescueTools}</p>}
                </div>
              </div>

              <label>NHU CẦU ĐẶC BIỆT{" "}
              <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
              <Input
                placeholder="Nhu cầu đặc biệt (nếu có)"
                value={form.specialNeeds}
                onChange={(e) => {
                  const value = e.target.value;
                
                  setForm({ ...form, specialNeeds: value });
                
                  if (value.length > 50) {
                    setErrors(prev => ({
                      ...prev,
                      specialNeeds: true,
                      messages: {
                        ...(prev.messages || {}),
                        specialNeeds: "Nhu cầu đặc biệt tối đa 50 ký tự"
                      }
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      specialNeeds: false,
                      messages: {
                        ...(prev.messages || {}),
                        specialNeeds: ""
                      }
                    }));
                  }
                }}
              />
             {errors.specialNeeds && <p className="error-message">{errors.messages?.specialNeeds}</p>}
              <label>MÔ TẢ CHI TIẾT{" "}
              <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></label>
              <TextArea
                rows={4}
                placeholder="Mô tả chi tiết"
                status={errors.detailDescription ? "error" : ""}
                value={form.detailDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, detailDescription: value });
                
                  if (value.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      detailDescription: false,
                      messages: { ...prev.messages, detailDescription: "" }
                    }));
                  }
                }}
              />
              {errors.detailDescription && <p className="error-message">{errors.messages?.detailDescription}</p>}
            </div>

            {/* ===== 5 ===== */}
            <div className="form-section section-5">
              <h4>📷 5. HÌNH ẢNH HIỆN TRƯỜNG{" "}
              <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span></h4>

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
              {errors.images && <p className="error-message">{errors.messages?.images}</p>}
            </div>

            <Button block className="submit-btn" onClick={handleSubmit}>
              GỬI YÊU CẦU CỨU TRỢ →
            </Button>
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="emergency-info">

{/* ===== BOX 1: HOTLINE ===== */}
<div className="info-card hotline-card">
  <div className="card-header red">
    <span>📞 HOTLINE KHẨN CẤP</span>
  </div>

  <div className="card-body">
    <div className="hotline-item">🚓 113 – CẢNH SÁT</div>
    <div className="hotline-item">🔥 114 – CỨU HỎA</div>
    <div className="hotline-item">🚑 115 – CẤP CỨU</div>
  </div>
</div>

{/* ===== BOX 2: HƯỚNG DẪN ===== */}
<div className="info-card guide-card">
  <div className="card-header blue">
    <span>📘 HƯỚNG DẪN AN TOÀN</span>
  </div>

  <div className="card-body">
    <ul className="guide-list">
      <li>Giữ điện thoại luôn bật.</li>
      <li>Di chuyển đến nơi an toàn.</li>
      <li>Dùng đèn pin hoặc vật sáng.</li>
    </ul>
  </div>
</div>

{/* ===== BOX 3: TRẠNG THÁI ===== */}
<div className="info-card status-card">
  <div className="card-header green">
    <span>TRẠNG THÁI HỆ THỐNG</span>
  </div>

  <div className="card-body status-body">
    <div className="status-line">
      <span className="status-dot"></span>
      <span className="status-text">
        HỆ THỐNG : ĐANG HOẠT ĐỘNG
      </span>
    </div>

    <div className="status-update">
  Cập nhật: {timeAgo}
</div>
  </div>
</div>

</aside>
        </div>
      </main>

      <EmergencyFooter />
    </>
  );
};

export default EmergencyRequest;
