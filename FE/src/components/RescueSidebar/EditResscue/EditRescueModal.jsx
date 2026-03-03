import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  InputNumber,
  Button,
  message
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { updateRescueRequest } from "../../../api/service/historyApi";
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

  const [form, setForm] = useState({
    fullname: "",
    mainIncidentType: "",
    locationLat: 0,
    locationLng: 0,
    victimCount: 0,
    availableRescueTools: "",
    specialNeeds: "",
    detailDescription: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        fullname: data.fullname || "",
        mainIncidentType: data.type || "",
        locationLat: data.lat || 0,
        locationLng: data.lng || 0,
        victimCount: data.victimCount || 0,
        availableRescueTools: data.availableRescueTools || "",
        specialNeeds: data.specialNeeds || "",
        detailDescription: data.detailDescription || "",
      });
    }
  }, [data]);

  if (!data) return null;

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateRescueRequest(data.id, {
        fullname: form.fullname,
        mainIncidentType: form.mainIncidentType,
        locationLat: Number(form.locationLat),
        locationLng: Number(form.locationLng),
        victimCount: Number(form.victimCount),
        availableRescueTools: form.availableRescueTools,
        specialNeeds: form.specialNeeds,
        detailDescription: form.detailDescription,
      });

      message.success("Cập nhật thành công ✅");

      onUpdated && onUpdated({
        type: form.mainIncidentType,
      });

      onClose();
    } catch (err) {
      message.error(err.message || "Cập nhật thất bại");
    } finally {
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
    >
      <section className="emergency-form edit-form">

        <h2>CHỈNH SỬA YÊU CẦU CỨU HỘ</h2>

        {/* ===== 1. THÔNG TIN ===== */}
        <div className="form-section section-1">
          <h4>
            <UserOutlined /> THÔNG TIN NGƯỜI GỬI
          </h4>

          <label>HỌ VÀ TÊN *</label>
          <Input
            value={form.fullname}
            onChange={(e) =>
              setForm({ ...form, fullname: e.target.value })
            }
          />
        </div>

        {/* ===== 2. LOẠI SỰ CỐ ===== */}
        <div className="form-section section-2">
          <h4>LOẠI SỰ CỐ</h4>

          <label>LOẠI SỰ CỐ CHÍNH *</label>
          <Select
           className="full-width"
            value={form.mainIncidentType}
            onChange={(v) =>
              setForm({ ...form, mainIncidentType: v })
            }
          >
            {MAIN_INCIDENT_OPTIONS.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* ===== 3. VỊ TRÍ ===== */}
        {/* <div className="form-section section-3">
          <h4>VỊ TRÍ</h4>

          <div className="form-row">
            <div>
              <label>Vĩ độ</label>
              <InputNumber
                style={{ width: "100%" }}
                value={form.locationLat}
                onChange={(v) =>
                  setForm({ ...form, locationLat: v })
                }
              />
            </div>

            <div>
              <label>Kinh độ</label>
              <InputNumber
                style={{ width: "100%" }}
                value={form.locationLng}
                onChange={(v) =>
                  setForm({ ...form, locationLng: v })
                }
              />
            </div>
          </div>
        </div> */}

        {/* ===== 4. MÔ TẢ ===== */}
        <div className="form-section section-4">
          <h4>CHI TIẾT</h4>

          <label>Số người gặp nạn *</label>
          <InputNumber
            style={{ width: "100%" }}
            value={form.victimCount}
            onChange={(v) =>
              setForm({ ...form, victimCount: v })
            }
          />

          <label>Dụng cụ cứu hộ</label>
          <Input
            value={form.availableRescueTools}
            onChange={(e) =>
              setForm({
                ...form,
                availableRescueTools: e.target.value,
              })
            }
          />

          <label>Nhu cầu đặc biệt</label>
          <Input
            value={form.specialNeeds}
            onChange={(e) =>
              setForm({
                ...form,
                specialNeeds: e.target.value,
              })
            }
          />

          <label>Mô tả chi tiết *</label>
          <TextArea
            rows={4}
            value={form.detailDescription}
            onChange={(e) =>
              setForm({
                ...form,
                detailDescription: e.target.value,
              })
            }
          />
        </div>

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