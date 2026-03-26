import { useEffect, useState } from "react";
import { Table, Tag } from "antd";

import {
  getAllAidCampaigns,
} from "../../../../api/axios/AdminApi/suplyingApi";

import AuthNotify from "../../../utils/Common/AuthNotify";
import { useNavigate } from "react-router-dom";

import "./CampaignPageManagerSuply.css";

export default function CampaignPageManagerSuply() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= LOAD ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getAllAidCampaigns();

      const data =
        res?.items ||
        res?.data ||
        res ||
        [];

      setList(data);

    } catch {
      AuthNotify.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= STATUS ================= */

  const renderStatus = (status) => {
    const map = {
      accepted: { text: "Đã nhận", color: "blue" },
      rejected: { text: "Từ chối", color: "red" },
      "in progress": { text: "Đang thực hiện", color: "processing" },
      completed: { text: "Hoàn thành", color: "green" },

      pending: { text: "Đang chờ", color: "gold" },
      active: { text: "Đang hoạt động", color: "blue" },

      "đã nhận": { text: "Đã nhận", color: "blue" },
      "từ chối": { text: "Từ chối", color: "red" },
      "đang thực hiện": { text: "Đang thực hiện", color: "processing" },
      "hoàn thành": { text: "Hoàn thành", color: "green" },
    };

    const key = status?.toLowerCase()?.trim();

    const s = map[key] || {
      text: status || "Không rõ",
      color: "default",
    };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "campaignID",
      width: 80,
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "campaignName",
      render: (text, record) => (
        <span
          className="link"
          onClick={() =>
            navigate(`/manager/ke-hoach-cuu-tro/${record.campaignID}`)
          }
        >
          {text}
        </span>
      ),
    },
    {
      title: "Thời gian",
      render: (_, record) =>
        `Tháng ${record.month}/${record.year}`,
    },
    {
      title: "Người tạo",
      dataIndex: "adminName",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatus,
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="campaign-page">

      {/* HEADER */}
      <div className="campaign-header">
        <div className="left">
          <h2>Danh sách chiến dịch</h2>

          <span className="count">
            {list.length} chiến dịch
          </span>
        </div>
      </div>

      {/* TABLE */}
      <Table
        rowKey="campaignID"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} chiến dịch`,
        }}
      />

    </div>
  );
}