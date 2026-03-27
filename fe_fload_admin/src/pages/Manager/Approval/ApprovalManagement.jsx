import { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import AuthNotify from "../../../utils/Common/AuthNotify";

import {
  getInventoryTransactions,
  confirmInventoryTransaction,
} from "../../../../api/axios/ManagerApi/inventoryApi";

import { getAllWarehouses } from "../../../../api/axios/ManagerApi/inventoryApi";

import CreateTransactionModal from "../../../components/ManagerComponents/Approval/CreateTransactionModal";

export default function ApprovalManagement() {
  const [data, setData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [filter, setFilter] = useState("all");

  /* ================= NORMALIZE ================= */
  const normalize = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  /* ================= LOAD ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const [resTran, resWh] = await Promise.all([
        getInventoryTransactions(),
        getAllWarehouses(),
      ]);

      const list = normalize(resTran);
      const whList = normalize(resWh);

      setWarehouses(whList);

      const mapped = list
        .map((t) => ({
          ...t,
          key: t.transactionId,
          isPending: !t.confirmedAt,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(mapped);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      AuthNotify.error(
        err?.response?.data?.message || "Load dữ liệu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= HELPER ================= */

  const getWarehouseName = (id) => {
    const w = warehouses.find((x) => x.warehouseId === id);
    return w?.warehouseName || `WH-${id}`;
  };

  /* ================= FILTER ================= */

  const filteredData =
    filter === "pending"
      ? data.filter((t) => t.isPending)
      : filter === "confirmed"
      ? data.filter((t) => !t.isPending)
      : data;

  /* ================= CONFIRM ================= */

  const handleConfirm = async (id) => {
    try {
      await confirmInventoryTransaction(id);

      setData((prev) =>
        prev.map((t) =>
          t.transactionId === id
            ? { ...t, confirmedAt: new Date().toISOString() }
            : t
        )
      );

      AuthNotify.success("Xác nhận thành công");
    } catch (err) {
      console.error(err);

      AuthNotify.error(
        err?.response?.data?.message || "Xác nhận thất bại"
      );
    }
  };

  /* ================= COLUMNS ================= */

  const columns = [
    {
      title: "Mã",
      dataIndex: "transactionId",
      render: (id) => <strong>#{id}</strong>,
    },
    {
      title: "Kho",
      dataIndex: "warehouseId",
      render: (id) => getWarehouseName(id),
    },
    {
      title: "Loại",
      dataIndex: "transactionType",
      render: (type) => {
        const map = {
          IN: { text: "Nhập", color: "green" },
          OUT: { text: "Xuất", color: "red" },
        };
        const t = map[type] || { text: type };
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: "Hàng hóa",
      dataIndex: "lines",
      render: (lines) => (
        <div>
          {lines?.map((l, i) => (
            <div key={i}>
              {l.itemName} ({l.quantity} {l.unit})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "confirmedAt",
      render: (confirmedAt) =>
        confirmedAt ? (
          <Tag color="green">Đã duyệt</Tag>
        ) : (
          <Tag color="orange">Chờ duyệt</Tag>
        ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (d) =>
        new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_, record) =>
        !record.confirmedAt ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleConfirm(record.transactionId)}
          >
            Xác nhận
          </Button>
        ) : null,
    },
  ];

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20, background: "#eff3f7", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Quản lý giao dịch kho</h2>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          + Tạo giao dịch
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button
          type={filter === "all" ? "primary" : "default"}
          onClick={() => setFilter("all")}
        >
          Tất cả ({data.length})
        </Button>

        <Button
          style={{ marginLeft: 8 }}
          type={filter === "pending" ? "primary" : "default"}
          onClick={() => setFilter("pending")}
        >
          Chờ duyệt ({data.filter((t) => t.isPending).length})
        </Button>

        <Button
          style={{ marginLeft: 8 }}
          type={filter === "confirmed" ? "primary" : "default"}
          onClick={() => setFilter("confirmed")}
        >
          Đã duyệt ({data.filter((t) => !t.isPending).length})
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />

      <CreateTransactionModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}