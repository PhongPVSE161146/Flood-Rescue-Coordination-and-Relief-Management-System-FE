import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  Button
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import { updateRescueRequest } from "../../../api/service/historyApi";

import AuthNotify from "../../../utils/Common/AuthNotify";

import "./EditRescueModal.css";

const { TextArea } = Input;
const { Option } = Select;

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" },
];

function EditRescueModal({ data, onClose, onUpdated }) {

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullname: "",
    mainIncidentType: "",
    victimCount: 0,
    availableRescueTools: "",
    specialNeeds: "",
    detailDescription: "",
  });

  /* ================= LOAD DATA CŨ ================= */

  useEffect(() => {

    if (data) {

      setForm({
        fullname: data.fullname || "",
        mainIncidentType: data.type || "",
        victimCount: data.victimCount || 0,
        availableRescueTools: data.availableRescueTools || "",
        specialNeeds: data.specialNeeds || "",
        detailDescription: data.detailDescription || "",
      });

    }

  }, [data]);

  if (!data) return null;

  /* ================= VALIDATE ================= */

  const validateForm = () => {

    const newErrors = {};

    if (!form.fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ và tên";
    }
    else if (form.fullname.trim().length < 3) {
      newErrors.fullname = "Họ tên phải ít nhất 3 ký tự";
    }

    if (!form.mainIncidentType) {
      newErrors.mainIncidentType = "Vui lòng chọn loại sự cố";
    }

    if (form.victimCount === null || form.victimCount < 0) {
      newErrors.victimCount = "Số người gặp nạn không hợp lệ";
    }

    if (!form.detailDescription?.trim()) {
      newErrors.detailDescription = "Vui lòng nhập mô tả chi tiết";
    }
    else if (form.detailDescription?.trim().length < 10) {
      newErrors.detailDescription = "Mô tả phải ít nhất 10 ký tự";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {

      AuthNotify.warning(
        "Thông tin chưa hợp lệ",
        "Vui lòng kiểm tra lại các trường bắt buộc"
      );

      return false;

    }

    return true;

  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {

    if (!validateForm()) return;

    try {

      setLoading(true);

      await updateRescueRequest(data.id, {

        fullname: form.fullname,
        mainIncidentType: form.mainIncidentType,
        victimCount: Number(form.victimCount),
        availableRescueTools: form.availableRescueTools,
        specialNeeds: form.specialNeeds,
        detailDescription: form.detailDescription,

      });

      AuthNotify.success(
        "Cập nhật thành công",
        "Yêu cầu cứu hộ đã được cập nhật"
      );

      onUpdated?.();

      onClose();

    }
    catch (err) {

      AuthNotify.error(
        "Cập nhật thất bại",
        err?.response?.data?.message ||
        err.message ||
        "Không thể cập nhật yêu cầu"
      );

    }
    finally {

      setLoading(false);

    }

  };

  return (

    <Modal
      open
      onCancel={onClose}
      footer={null}
      width={800}
      className="edit-emergency-modal"
      centered
      destroyOnClose
    >

      <section className="emergency-form edit-form">

        <h2>CHỈNH SỬA YÊU CẦU CỨU HỘ</h2>

        {/* ================= THÔNG TIN ================= */}

        <div className="form-section">

          <h4>
            <UserOutlined /> THÔNG TIN NGƯỜI GỬI
          </h4>

          <label>HỌ VÀ TÊN *</label>

          <Input
            status={errors.fullname ? "error" : ""}
            value={form.fullname}
            placeholder="Nhập họ và tên"
            onChange={(e) => {

              const value = e.target.value;

              setForm({
                ...form,
                fullname: value
              });

              if (value.trim()) {

                setErrors(prev => ({
                  ...prev,
                  fullname: ""
                }));

              }

            }}
          />

          {errors.fullname && (
            <p className="error-message">{errors.fullname}</p>
          )}

        </div>

        {/* ================= LOẠI SỰ CỐ ================= */}

        <div className="form-section">

          <h4>LOẠI SỰ CỐ</h4>

          <label>LOẠI SỰ CỐ CHÍNH *</label>

          <Select
            status={errors.mainIncidentType ? "error" : ""}
            className="full-width"
            value={form.mainIncidentType || undefined}
            placeholder="Chọn loại sự cố"
            onChange={(v) => {

              setForm({
                ...form,
                mainIncidentType: v
              });

              if (v) {

                setErrors(prev => ({
                  ...prev,
                  mainIncidentType: ""
                }));

              }

            }}
          >

            {MAIN_INCIDENT_OPTIONS.map((o) => (

              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>

            ))}

          </Select>

          {errors.mainIncidentType && (
            <p className="error-message">
              {errors.mainIncidentType}
            </p>
          )}

        </div>

        {/* ================= CHI TIẾT ================= */}

        <div className="form-section">

          <h4>CHI TIẾT</h4>

          <label>SỐ NGƯỜI GẶP NẠN *</label>

          <InputNumber
            status={errors.victimCount ? "error" : ""}
            style={{ width: "100%" }}
            min={0}
            value={form.victimCount}
            onChange={(v) => {

              setForm({
                ...form,
                victimCount: v
              });

              if (v !== null && v >= 0) {

                setErrors(prev => ({
                  ...prev,
                  victimCount: ""
                }));

              }

            }}
          />

          {errors.victimCount && (
            <p className="error-message">
              {errors.victimCount}
            </p>
          )}

          <label>DỤNG CỤ CỨU HỘ</label>

          <Input
            value={form.availableRescueTools}
            placeholder="Nhập dụng cụ cứu hộ"
            onChange={(e) =>
              setForm({
                ...form,
                availableRescueTools: e.target.value
              })
            }
          />

          <label>NHU CẦU ĐẶC BIỆT</label>

          <Input
            value={form.specialNeeds}
            placeholder="Nhập nhu cầu đặc biệt"
            onChange={(e) =>
              setForm({
                ...form,
                specialNeeds: e.target.value
              })
            }
            
          />
             {errors.specialNeeds && (
            <p className="error-message">
              {errors.specialNeeds}
            </p>
          )}

          <label>MÔ TẢ CHI TIẾT *</label>

          <TextArea
            status={errors.detailDescription ? "error" : ""}
            rows={4}
            placeholder="Mô tả chi tiết"
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

          {errors.detailDescription && (
            <p className="error-message">
              {errors.detailDescription}
            </p>
          )}

        </div>

        {/* ================= BUTTON ================= */}

        <Button
          block
          className="submit-btn"
          loading={loading}
          onClick={handleUpdate}
        >
          LƯU THAY ĐỔI →
        </Button>

      </section>

    </Modal>

  );

}

export default EditRescueModal;