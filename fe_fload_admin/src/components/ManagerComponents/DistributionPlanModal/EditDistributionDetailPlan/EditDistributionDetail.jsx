import { Modal, Form, Select, Input } from "antd";
import { useEffect } from "react";
import { updateDistributionDetail } from "../../../../../api/axios/ManagerApi/periodicAidApi";
import AuthNotify from "../../../../utils/Common/AuthNotify";

export default function EditDistributionDetail({
  open,
  onClose,
  data,
  onSuccess
}) {
  const [form] = Form.useForm();

  const isCompleted = data?.status?.toLowerCase() === "completed";

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data.status?.toLowerCase(),
        note: data.note,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    // 🔥 chặn sửa nếu completed
    if (isCompleted) {
      AuthNotify.warning("Không thể chỉnh sửa khi đã hoàn thành");
      return;
    }

    try {
      const values = await form.validateFields();

      await updateDistributionDetail(data.detailId, {
        status: values.status,
        note: values.note || "",
      });

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
      title="Sửa phân phối"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ disabled: isCompleted }} // 🔥 disable nút
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isCompleted} // 🔥 disable toàn bộ form
      >

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Chọn trạng thái" }]}
        >
          <Select
            options={[
              { value: "accepted", label: "Đã nhận" },
              { value: "in progress", label: "Đang phát" },
              { value: "completed", label: "Hoàn thành" },
              { value: "rejected", label: "Từ chối" },
            ]}
          />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

      </Form>

      {/* 🔥 hiển thị cảnh báo */}
      {isCompleted && (
        <p style={{ color: "red", marginTop: 10 }}>
          ⚠ Không thể chỉnh sửa vì đã hoàn thành
        </p>
      )}
    </Modal>
  );
}