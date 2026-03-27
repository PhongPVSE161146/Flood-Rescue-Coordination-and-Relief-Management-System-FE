import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { updateDistribution } from "../../../../../api/axios/ManagerApi/periodicAidApi";
import AuthNotify from "../../../../utils/Common/AuthNotify";
export default function EditDistribution({ open, onClose, data, onSuccess }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue(data);
    }
  }, [open, data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await updateDistribution(data.distributionId, {
        distributedAt: new Date().toISOString(),
        status: values.status,
        note: values.note,
      });

      AuthNotify.success("Cập nhật thành công");

      onClose();
      onSuccess();

    } catch {
      AuthNotify.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal
      title="Sửa phân phối"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical">

        <Form.Item name="status" label="Trạng thái">
          <Select
            options={[
              { value: "pending", label: "Đang chờ" },
              { value: "accepted", label: "Đã nhận" },
              { value: "in progress", label: "Đang phát" },
              { value: "completed", label: "Hoàn thành" },
            ]}
          />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
}