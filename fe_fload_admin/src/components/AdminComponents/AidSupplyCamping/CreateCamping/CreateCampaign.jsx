import { Modal, Form, Input, Select } from "antd";
import { createAidCampaign } from "../../../../../api/axios/AdminApi/suplyingApi";
import AuthNotify from "../../../../utils/Common/AuthNotify";

export default function CreateCampaign({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  /* ================= GET ADMIN ================= */

  const getAdminId = () => {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    return user?.userId || user?.id || 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        campaignName: values.campaignName,
        month: Number(values.month),
        year: Number(values.year),
        status: values.status || "pending",

        // 🔥 QUAN TRỌNG
        createdByAdminId: getAdminId(),
      };

      await createAidCampaign(payload);

      AuthNotify.success("Tạo thành công");

      form.resetFields();
      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
      AuthNotify.error("Tạo thất bại");
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
      destroyOnClose
    >
      <Form form={form} layout="vertical">

        <Form.Item
          name="campaignName"
          label="Tên chiến dịch"
          rules={[{ required: true, message: "Nhập tên chiến dịch" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="month"
          label="Tháng"
          rules={[{ required: true, message: "Nhập tháng" }]}
        >
          <Input type="number" min={1} max={12} />
        </Form.Item>

        <Form.Item
          name="year"
          label="Năm"
          rules={[{ required: true, message: "Nhập năm" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue="pending"
        >
          <Select
            options={[
              { value: "pending", label: "Chờ" },
              { value: "active", label: "Đang diễn ra" },
              { value: "completed", label: "Hoàn thành" },
            ]}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
}