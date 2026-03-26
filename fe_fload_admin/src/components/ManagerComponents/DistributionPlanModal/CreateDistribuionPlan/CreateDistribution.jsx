import { Modal, Form, Select, Input, message } from "antd";
import { useEffect, useState } from "react";

import {
  createDistribution,
  getAvailableRescueTeams,
  getAllAidCampaigns
} from "../../../../../api/axios/ManagerApi/periodicAidApi";

export default function CreateDistribution({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  const [campaigns, setCampaigns] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalize = (res) =>
    res?.items || res?.data || res || [];

  /* ================= LOAD ================= */

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [campRes, teamRes] = await Promise.all([
        getAllAidCampaigns(),
        getAvailableRescueTeams(),
      ]);

      setCampaigns(normalize(campRes));

      const teamData = normalize(teamRes).filter(t => t.isAvailable);
      setTeams(teamData);

    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        campaignId: Number(values.campaignId),
        rescueTeamId: Number(values.rescueTeamId),
        distributedAt: new Date().toISOString(),

        // 🔥 FIX: mặc định pending
        status: "pending",

        note: values.note || "",
      };

      const res = await createDistribution(payload);

      message.success("Tạo thành công");

      form.resetFields();
      onClose();

      // 🔥 FIX QUAN TRỌNG: đẩy item mới lên đầu
      onSuccess?.(res);

    } catch (err) {
      console.error(err);
      message.error("Tạo thất bại");
    }
  };

  /* ================= UI ================= */

  return (
    <Modal
      title="Tạo phân phối cứu trợ"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">

        {/* CAMPAIGN */}
        <Form.Item
          name="campaignId"
          label="Chiến dịch"
          rules={[{ required: true, message: "Chọn chiến dịch" }]}
        >
          <Select
            placeholder="Chọn chiến dịch"
            options={campaigns.map(c => ({
              value: c.campaignId || c.campaignID,
              label: c.campaignName,
            }))}
          />
        </Form.Item>

        {/* TEAM */}
        <Form.Item
          name="rescueTeamId"
          label="Đội cứu trợ"
          rules={[{ required: true, message: "Chọn đội cứu trợ" }]}
        >
          <Select
            placeholder="Chọn đội cứu trợ"
            options={teams.map(t => ({
              value: t.rescueTeamId,
              label: `${t.teamName} (${t.teamStatus})`,
            }))}
          />
        </Form.Item>

        {/* NOTE */}
        <Form.Item name="note" label="Ghi chú">
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
}