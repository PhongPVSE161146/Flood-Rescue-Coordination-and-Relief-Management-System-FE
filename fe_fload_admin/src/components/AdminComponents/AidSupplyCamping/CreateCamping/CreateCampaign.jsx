import { Modal, Form, Input, Select } from "antd";
import { createAidCampaign } from "../../../../../api/axios/AdminApi/suplyingApi";
import AuthNotify from "../../../../utils/Common/AuthNotify";

export default function CreateCampaign({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  /* ================= GET ADMIN ================= */

  const getAdmin = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"))
      );
    } catch {
      return null;
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const admin = getAdmin();

      if (!admin) {
        AuthNotify.error("Không xác định được admin");
        return;
      }

      const payload = {
        campaignName: values.campaignName?.trim(),
        month: Number(values.month),
        year: Number(values.year),
        status: values.status || "pending",
        createdByAdminId: Number(admin.userId || admin.id),
      };

      console.log("🚀 PAYLOAD:", payload);

      const res = await createAidCampaign(payload);

      AuthNotify.success("Tạo thành công");

      form.resetFields();
      onClose();

      /* ================= FIX DATA TRẢ VỀ ================= */

      const newItem = {
        ...(res?.data || res),

        campaignName: payload.campaignName,
        month: payload.month,
        year: payload.year,
        status: payload.status,

        createdByAdminId: payload.createdByAdminId,

        // 🔥 HIỂN THỊ NGƯỜI TẠO
        adminName:
          admin.fullName ||
          admin.name ||
          admin.username ||
          "Admin",

        // 🔥 thời gian fallback
        createdAt: new Date().toISOString(),
      };

      // 🔥 ĐẨY LÊN ĐẦU LIST
      onSuccess?.(newItem);

    } catch (err) {
      console.error("❌ CREATE CAMPAIGN ERROR:", err);

      AuthNotify.error(
        err?.response?.data?.message ||
        "Tạo thất bại"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <Modal
      title="Tạo chiến dịch"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">

        {/* NAME */}
        <Form.Item
          name="campaignName"
          label="Tên chiến dịch"
          rules={[{ required: true, message: "Nhập tên chiến dịch" }]}
        >
          <Input placeholder="Nhập tên chiến dịch" />
        </Form.Item>

        {/* MONTH */}
        <Form.Item
          name="month"
          label="Tháng"
          rules={[{ required: true, message: "Nhập tháng" }]}
        >
          <Input type="number" min={1} max={12} />
        </Form.Item>

        {/* YEAR */}
        <Form.Item
          name="year"
          label="Năm"
          rules={[{ required: true, message: "Nhập năm" }]}
        >
          <Input type="number" />
        </Form.Item>

        {/* STATUS */}
        <Form.Item
          name="status"
          label="Trạng thái"
          
        >
          <Select
           options={[
            { value: "accepted", label: "🔵 Đã nhận" },
          
            { value: "in progress", label: "🟡 Đang thực hiện" },
           
          ]}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
}