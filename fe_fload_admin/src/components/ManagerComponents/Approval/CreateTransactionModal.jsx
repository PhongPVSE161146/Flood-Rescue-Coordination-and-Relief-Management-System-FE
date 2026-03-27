import { Modal, Form, Input, InputNumber, Button, Select, message } from "antd";
import { useState, useEffect } from "react";

import {
  createInventoryTransaction,
  getAllWarehouses,
  getPendingRescueRequests,
  getAllReliefItems,
} from "../../../../api/axios/ManagerApi/inventoryApi";
import AuthNotify from "../../../utils/Common/AuthNotify";
export default function CreateTransactionModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [warehouses, setWarehouses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);

  /* ================= NORMALIZE ================= */
  const normalize = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      const [whRes, rqRes, itemRes] = await Promise.all([
        getAllWarehouses(),
        getPendingRescueRequests(),
        getAllReliefItems(),
      ]);

      setWarehouses(normalize(whRes));
      setRequests(normalize(rqRes));
      setItems(normalize(itemRes));
    } catch (err) {
      console.error(err);
      AuthNotify.error("Load dữ liệu thất bại");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await createInventoryTransaction({
        warehouseId: values.warehouseId,
        transactionType: values.transactionType,
        rescueRequestId: values.rescueRequestId,
        note: values.note,
        lines: [
          {
            reliefItemId: values.reliefItemId,
            quantity: values.quantity,
          },
        ],
      });

      AuthNotify.success("Tạo giao dịch thành công");

      onSuccess();
      onClose();
      form.resetFields();
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message || "Tạo thất bại";

        AuthNotify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo giao dịch"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        
        {/* WAREHOUSE */}
        <Form.Item
          name="warehouseId"
          label="Kho"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn kho"
            options={warehouses.map((w) => ({
              label: w.warehouseName,
              value: w.warehouseId,
            }))}
          />
        </Form.Item>

        {/* TYPE */}
        <Form.Item
          name="transactionType"
          label="Loại giao dịch"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn loại"
            options={[
              { label: "Nhập", value: "IN" },
              { label: "Xuất", value: "OUT" },
            ]}
          />
        </Form.Item>

        {/* RESCUE REQUEST */}
        <Form.Item
          name="rescueRequestId"
          label="Yêu cầu cứu trợ"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn request"
            options={requests.map((r) => ({
              label: `Request #${r.rescueRequestId}`,
              value: r.rescueRequestId,
            }))}
          />
        </Form.Item>

        {/* ITEM (API) 🔥 */}
        <Form.Item
          name="reliefItemId"
          label="Hàng hóa"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn item"
            options={items.map((i) => ({
              label: `${i.itemName} (${i.unit})`,
              value: i.reliefItemId,
            }))}
          />
        </Form.Item>

        {/* QUANTITY */}
        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* NOTE */}
        <Form.Item name="note" label="Ghi chú">
          <Input />
        </Form.Item>

        <Button htmlType="submit" type="primary" loading={loading} block>
          Tạo giao dịch
        </Button>
      </Form>
    </Modal>
  );
}