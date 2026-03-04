import "./UserFormModal.css";
import { Modal, Button } from "antd";
import { useState } from "react";
import UserForm from "./UserForm";

export default function UserFormModal({
  open,
  onCancel,
  onSubmit,
  isEdit,
  form
}) {

  const [loading, setLoading] = useState(false);

  const handleOk = async () => {

    try {

      setLoading(true);

      await onSubmit();

    } catch (error) {

      // giữ loading tắt nếu lỗi

    } finally {

      setLoading(false);

    }

  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={700}
      destroyOnClose
      title={isEdit ? "Chỉnh sửa người dùng" : "Tạo người dùng"}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          {isEdit ? "Cập nhật" : "Tạo người dùng"}
        </Button>,
      ]}
    >
      <UserForm form={form} />
    </Modal>
  );
}