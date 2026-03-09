import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmergencyHeader from "../../Layout/EmergencyHeader/EmergencyHeader";
import EmergencyFooter from "../../Layout/EmergencyFooter/EmergencyFooter";
import AuthNotify from "../../utils/Common/AuthNotify";

import {
  Input,
  Select,
  Checkbox,
  Button,
  Upload,
  InputNumber
} from "antd";

import {
  PhoneOutlined,
  UploadOutlined,
  UserOutlined
} from "@ant-design/icons";

import { createRescueRequest } from "../../api/service/emergencyApi";

import "./EmergencyRequest.css";

const { TextArea } = Input;
const { Option } = Select;

const DEFAULT_AREA_ID = 1;

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" }
];

const SPECIFIC_CONDITION_OPTIONS = [
  { value: "SevereFlood", label: "Ngập nặng" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "Landslide", label: "Sạt lở" },
  { value: "InjuredPeople", label: "Có người bị thương" },
  { value: "ElderlyOrChildren", label: "Người già / trẻ em" },
  { value: "PowerOrCommunicationOutage", label: "Mất điện / liên lạc" }
];

const EmergencyRequest = () => {

  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    requestType: "",
    contactPhone: "",
    locationLat: 0,
    locationLng: 0,
    locationImageUrl: "",
    areaId: 0,
    fullName: "",
    victimCount: 0,
    availableRescueTool: "",
    specialNeeds: "",
    detailDescription: "",
    rescueTeamNote: "",
    address: ""
  });

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    const newErrors = {};
    const messages = {};

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    const phone = form.primaryPhone.replace(/\D/g, "");

    if (!form.fullname.trim()) {
      newErrors.fullname = true;
      messages.fullname = "Vui lòng nhập họ tên";
    }

    if (!phoneRegex.test(phone)) {
      newErrors.primaryPhone = true;
      messages.primaryPhone = "Số điện thoại không hợp lệ";
    }

    if (!form.mainIncidentType) {
      newErrors.mainIncidentType = true;
      messages.mainIncidentType = "Chọn loại sự cố";
    }

    if (!form.specificConditions.length) {
      newErrors.specificConditions = true;
      messages.specificConditions = "Chọn ít nhất 1 tình trạng";
    }

    if (!address.trim()) {
      newErrors.address = true;
      messages.address = "Nhập địa chỉ hiện tại";
    }

    if (!latitude) {
      newErrors.latitude = true;
      messages.latitude = "Nhập Latitude";
    }

    if (!longitude) {
      newErrors.longitude = true;
      messages.longitude = "Nhập Longitude";
    }

    if (!form.landmarkNote.trim()) {
      newErrors.landmarkNote = true;
      messages.landmarkNote = "Nhập điểm nhận dạng";
    }

    if (!form.availableRescueTools.trim()) {
      newErrors.availableRescueTools = true;
      messages.availableRescueTools = "Nhập dụng cụ cứu hộ";
    }

    if (!form.specialNeeds.trim()) {
      newErrors.specialNeeds = true;
      messages.specialNeeds = "Nhập nhu cầu đặc biệt";
    }

    if (!form.detailDescription.trim()) {
      newErrors.detailDescription = true;
      messages.detailDescription = "Nhập mô tả chi tiết";
    }

    if (!form.images.length) {
      newErrors.images = true;
      messages.images = "Tải ít nhất 1 hình ảnh";
    }

    setErrors({ ...newErrors, messages });

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!validateForm()) return;

    const fd = new FormData();

    fd.append("Fullname", form.fullname.trim());
    fd.append("PrimaryPhone", form.primaryPhone.trim());
    fd.append("MainIncidentType", form.mainIncidentType);

    fd.append("Address", address.trim());
    fd.append("LocationLat", latitude);
    fd.append("LocationLng", longitude);

    form.specificConditions.forEach(v =>
      fd.append("SpecificConditions", v)
    );

    fd.append("VictimCount", form.victimCount || 0);
    fd.append("LandmarkNote", form.landmarkNote.trim());
    fd.append("AvailableRescueTools", form.availableRescueTools.trim());
    fd.append("SpecialNeeds", form.specialNeeds.trim());
    fd.append("DetailDescription", form.detailDescription.trim());

    fd.append("AreaId", DEFAULT_AREA_ID);

    form.images.forEach(file => {
      if (file.originFileObj) {
        fd.append("Images", file.originFileObj);
      }
    });

    try {

      await createRescueRequest(fd);

      AuthNotify.success(
        "Gửi yêu cầu thành công",
        "Đội cứu hộ sẽ tiếp nhận"
      );

      navigate("/map");

    } catch (err) {

      console.log(err);

      AuthNotify.error(
        "Gửi yêu cầu thất bại",
        "Vui lòng thử lại"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <EmergencyHeader />

      <main className="emergency-page">
        <div className="emergency-container">

          <section className="emergency-form">

            <h2>GỬI YÊU CẦU CỨU HỘ</h2>

            {/* FULLNAME */}

            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              value={form.fullname}
              status={errors.fullname ? "error" : ""}
              onChange={(e)=>
                setForm({...form,fullname:e.target.value})
              }
            />

            {/* PHONE */}

            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              maxLength={10}
              value={form.primaryPhone}
              status={errors.primaryPhone ? "error" : ""}
              onChange={(e)=>{

                const onlyNumber = e.target.value.replace(/\D/g,"");
                setForm({...form,primaryPhone:onlyNumber});

              }}
            />

            {/* INCIDENT TYPE */}

            <Select
              placeholder="Chọn loại sự cố"
              value={form.mainIncidentType || undefined}
              status={errors.mainIncidentType ? "error" : ""}
              onChange={(v)=>setForm({...form,mainIncidentType:v})}
            >
              {MAIN_INCIDENT_OPTIONS.map(o=>(
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>

            {/* CONDITIONS */}

            <Checkbox.Group
              value={form.specificConditions}
              onChange={(v)=>setForm({...form,specificConditions:v})}
            >
              {SPECIFIC_CONDITION_OPTIONS.map(o=>(
                <Checkbox key={o.value} value={o.value}>
                  {o.label}
                </Checkbox>
              ))}
            </Checkbox.Group>

            {/* ADDRESS */}

            <Input
              placeholder="Địa chỉ hiện tại"
              value={address}
              status={errors.address ? "error" : ""}
              onChange={(e)=>setAddress(e.target.value)}
            />

            {/* LATITUDE */}

            <Input
              placeholder="Latitude (ví dụ: 10.8231)"
              value={latitude}
              status={errors.latitude ? "error" : ""}
              onChange={(e)=>setLatitude(e.target.value)}
            />

            {/* LONGITUDE */}

            <Input
              placeholder="Longitude (ví dụ: 106.6297)"
              value={longitude}
              status={errors.longitude ? "error" : ""}
              onChange={(e)=>setLongitude(e.target.value)}
            />

            {/* LANDMARK */}

            <Input
              placeholder="Điểm nhận dạng"
              value={form.landmarkNote}
              status={errors.landmarkNote ? "error" : ""}
              onChange={(e)=>
                setForm({...form,landmarkNote:e.target.value})
              }
            />

            {/* RESCUE TOOLS */}

            <Input
              placeholder="Dụng cụ cứu hộ"
              value={form.availableRescueTools}
              status={errors.availableRescueTools ? "error" : ""}
              onChange={(e)=>
                setForm({...form,availableRescueTools:e.target.value})
              }
            />

            {/* SPECIAL NEEDS */}

            <Input
              placeholder="Nhu cầu đặc biệt"
              value={form.specialNeeds}
              status={errors.specialNeeds ? "error" : ""}
              onChange={(e)=>
                setForm({...form,specialNeeds:e.target.value})
              }
            />

            {/* VICTIM COUNT */}

            <InputNumber
              style={{width:"100%"}}
              min={0}
              placeholder="Số người gặp nạn"
              value={form.victimCount}
              onChange={(v)=>setForm({...form,victimCount:v})}
            />

            {/* DESCRIPTION */}

            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết"
              value={form.detailDescription}
              status={errors.detailDescription ? "error" : ""}
              onChange={(e)=>
                setForm({...form,detailDescription:e.target.value})
              }
            />

            {/* UPLOAD */}

            <Upload
              listType="picture"
              multiple
              beforeUpload={()=>false}
              onChange={({fileList})=>
                setForm({...form,images:fileList})
              }
            >
              <Button icon={<UploadOutlined/>}>
                Tải ảnh hiện trường
              </Button>
            </Upload>

            <Button type="primary" block onClick={handleSubmit}>
              GỬI YÊU CẦU CỨU HỘ
            </Button>

          </section>

        </div>
      </main>

      <EmergencyFooter />
    </>
  );
};

export default EmergencyRequest;