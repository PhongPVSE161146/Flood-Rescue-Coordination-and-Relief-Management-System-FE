import { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import { getBeneficiariesByCampaign } from "../../../../../api/axios/AdminApi/suplyingApi";

import "./BeneficiaryPage.css";

export default function BeneficiaryPage() {
  const { id } = useParams(); // campaignId
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getBeneficiariesByCampaign(id);

      const data =
        res?.items ||
        res?.data ||
        res ||
        [];

      setList(data);

    } catch (err) {
      console.error(err);
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= STATUS ================= */

  const renderStatus = (status) => {
    const map = {
      pending: "gold",
      approved: "green",
      rejected: "red",
    };

    return <Tag color={map[status] || "default"}>{status}</Tag>;
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số người",
      dataIndex: "householdSize",
    },
    {
      title: "Nhóm",
      dataIndex: "targetGroup",
    },
    {
      title: "Ưu tiên",
      dataIndex: "priorityLevel",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatus,
    },
    {
      title: "Ngày chọn",
      dataIndex: "selectedAt",
      render: (date) =>
        date
          ? new Date(date).toLocaleString("vi-VN")
          : "—",
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="beneficiary-page">

      {/* HEADER */}
      <div className="header">

        <div className="left">
          <button
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>

          <h2>Danh sách người nhận</h2>
        </div>

        {/* 🔥 COUNT */}
        <div className="count-box">
          {list.length} người
        </div>

      </div>

      {/* TABLE */}
      <Table
        rowKey={(r) => r.id || r.beneficiaryId}
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người`,
        }}
      />

    </div>
  );
}