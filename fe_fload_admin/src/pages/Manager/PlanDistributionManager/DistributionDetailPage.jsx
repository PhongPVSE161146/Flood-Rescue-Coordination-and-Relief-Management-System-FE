import { useEffect, useState } from "react";
import { Table, message, Tag, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  getDistributionDetailsByDistribution,
  getBeneficiaryById
} from "../../../../api/axios/ManagerApi/periodicAidApi";

export default function DistributionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getDistributionDetailsByDistribution(id);
      const data = res?.items || res?.data || res || [];

      // 🔥 gọi thêm beneficiary
      const enriched = await Promise.all(
        data.map(async (item) => {
          try {
            const b = await getBeneficiaryById(item.beneficiaryId);

            return {
              ...item,
              fullName: b?.fullName,
              phone: b?.phone,
              address: b?.address,
              householdSize: b?.householdSize,
              targetGroup: b?.targetGroup,
              beneficiaryStatus: b?.status,
              priorityLevel: b?.priorityLevel,
            };
          } catch {
            return {
              ...item,
              fullName: "Không rõ",
            };
          }
        })
      );

      setList(enriched);

    } catch (err) {
      console.error(err);
      message.error("Lỗi tải chi tiết");
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
      accepted: { text: "Đã nhận", color: "blue" },
      rejected: { text: "Từ chối", color: "red" },
      "in progress": { text: "Đang phát", color: "processing" },
      completed: { text: "Hoàn thành", color: "green" },
    };

    const key = status?.toLowerCase();
    const s = map[key] || { text: status, color: "default" };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderBeneficiaryStatus = (status) => {
    const map = {
      active: { text: "Đang hoạt động", color: "green" },
      inactive: { text: "Không hoạt động", color: "default" },
      pending: { text: "Chờ", color: "gold" },
    };

    const key = status?.toLowerCase();
    const s = map[key] || { text: status, color: "default" };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderPriority = (level) => {
    const map = {
      1: { text: "Ưu tiên", color: "red" },
      2: { text: "Trung bình", color: "gold" },
      3: { text: "Thấp", color: "green" },
    };

    const p = map[level] || {
      text: level,
      color: "default",
    };

    return <Tag color={p.color}>{p.text}</Tag>;
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "detailId",
      width: 80,
    },
    {
      title: "Người nhận",
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
      title: "Mức ưu tiên",
      dataIndex: "priorityLevel",
      render: renderPriority,
    },
    {
      title: "TT người nhận",
      dataIndex: "beneficiaryStatus",
      render: renderBeneficiaryStatus,
    },
    {
      title: "TT phân phối",
      dataIndex: "status",
      render: renderStatus,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
  ];

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16
      }}>
        <Button onClick={() => navigate(-1)}>
          ← Quay lại
        </Button>

        {/* 🔥 COUNT */}
        <span style={{ fontWeight: 600 }}>
          Tổng: {list.length} người
        </span>
      </div>

      <h2 style={{ marginBottom: 16 }}>
        Chi tiết phân phối #{id}
      </h2>

      {/* TABLE */}
      <Table
        rowKey="detailId"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người`,
        }}
      />

    </div>
  );
}