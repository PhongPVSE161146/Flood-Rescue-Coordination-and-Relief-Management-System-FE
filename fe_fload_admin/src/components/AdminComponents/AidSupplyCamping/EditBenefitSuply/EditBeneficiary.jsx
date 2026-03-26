import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { useEffect } from "react";
import { updateBeneficiary } from "../../../../../api/axios/AdminApi/suplyingApi";
import AuthNotify from "../../../../utils/Common/AuthNotify";
export default function EditBeneficiary({ open, onClose, data, onSuccess }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const id = data?.id || data?.beneficiaryId;

      const payload = {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        householdSize: Number(values.householdSize),
        targetGroup: values.targetGroup,
        priorityLevel: Number(values.priorityLevel),
        status: values.status,
      };

      await updateBeneficiary(id, payload);

      AuthNotify.success("Cập nhật thành công");

      onClose();
      onSuccess();

    } catch (err) {
      console.error(err);
      AuthNotify.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal
      title="Sửa người nhận"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical">

        <Form.Item name="fullName" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="householdSize" label="Số người" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item name="targetGroup" label="Nhóm">
          <Input />
        </Form.Item>

        <Form.Item name="priorityLevel" label="Ưu tiên">
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

    

      </Form>
    </Modal>
  );
}