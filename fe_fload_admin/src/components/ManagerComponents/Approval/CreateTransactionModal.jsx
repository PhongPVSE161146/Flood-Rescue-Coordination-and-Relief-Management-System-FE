import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
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
    if (Array.isArray(res?.items)) return res.items;
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

      const wh = normalize(whRes);
      const rq = normalize(rqRes);
      const it = normalize(itemRes);

      console.log("🏬 Warehouses:", wh);
      console.log("🆘 Requests:", rq);
      console.log("📦 Items:", it);

      setWarehouses(wh);
      setRequests(rq);
      setItems(it);
    } catch (err) {
      console.error(err);
      AuthNotify.error("Load dữ liệu thất bại");
    }
  };

  /* ================= BUILD LABEL REQUEST ================= */
  const buildRequestLabel = (r) => {
    return (
      r.fullName ||
      r.beneficiaryName ||
      r.receiverName ||
      r.userName ||
      r.createdByName ||
      `Request #${r.rescueRequestId}`
    );
  };
  /* ================= SUBMIT ================= */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        warehouseId: Number(values.warehouseId),
        transactionType: values.transactionType,
        rescueRequestId: Number(values.rescueRequestId),
        note: values.note,
        lines: [
          {
            reliefItemId: Number(values.reliefItemId),
            quantity: Number(values.quantity),
          },
        ],
      };

      console.log("🚀 PAYLOAD:", payload);

      await createInventoryTransaction(payload);

      AuthNotify.success("Tạo giao dịch thành công");

      onSuccess?.();
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

  /* ================= UI ================= */
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
          rules={[{ required: true, message: "Chọn kho" }]}
        >
          <Select
            placeholder="Chọn kho"
            showSearch
            optionFilterProp="label"
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
          rules={[{ required: true, message: "Chọn loại giao dịch" }]}
        >
          <Select
            placeholder="Chọn loại"
            options={[
              { label: "Nhập", value: "IN" },
              { label: "Xuất", value: "OUT" },
            ]}
          />
        </Form.Item>

        {/* 🔥 RESCUE REQUEST FIXED */}
        <Form.Item
          name="rescueRequestId"
          label="Yêu cầu cứu trợ"
          rules={[{ required: true, message: "Chọn yêu cầu cứu trợ" }]}
        >
          <Select
            placeholder="Chọn request"
            showSearch
            allowClear
            optionFilterProp="label"
            options={requests.map((r) => ({
              value: r.rescueRequestId,
              label: buildRequestLabel(r),
            }))}
          />
        </Form.Item>

        {/* ITEM */}
        <Form.Item
          name="reliefItemId"
          label="Hàng hóa"
          rules={[{ required: true, message: "Chọn hàng hóa" }]}
        >
          <Select
            placeholder="Chọn item"
            showSearch
            optionFilterProp="label"
            options={items.map((i) => ({
              label: `${i.itemName}${i.unit ? ` (${i.unit})` : ""}`,
              value: i.reliefItemId,
            }))}
          />
        </Form.Item>

        {/* QUANTITY */}
        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: "Nhập số lượng" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={1000000}
          />
        </Form.Item>

        {/* NOTE */}
        <Form.Item name="note" label="Ghi chú">
          <Input placeholder="Nhập ghi chú..." />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          block
        >
          Tạo giao dịch
        </Button>

      </Form>
    </Modal>
  );
}