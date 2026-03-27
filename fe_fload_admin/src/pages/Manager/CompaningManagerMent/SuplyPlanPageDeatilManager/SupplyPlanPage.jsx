import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";

import {
  getSupplyPlansByCampaign,
  deleteSupplyPlan,
  getAllReliefItems,
  getAllWarehouses // ✅ dùng luôn
} from "../../../../../api/axios/ManagerApi/periodicAidApi";

import { getAllAidCampaigns } from "../../../../../api/axios/AdminApi/suplyingApi";

import CreateSupplyPlan from "../../../../components/ManagerComponents/AidSuplyManager/CreateYTableSuplan/CreateSupplyPlan";
import EditSupplyPlan from "../../../../components/ManagerComponents/AidSuplyManager/EditTableSuplylan/EditSupplyPlan";
import AuthNotify from "../../../../utils/Common/AuthNotify";
import { useParams } from "react-router-dom";

import "./SupplyPlanPage.css";

export default function SupplyPlanPage() {
  const { id } = useParams();

  const [list, setList] = useState([]);
  const [reliefItems, setReliefItems] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // ✅ thêm

  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ================= GET CURRENT USER ================= */

  const getCurrentUser = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"))
      );
    } catch {
      return null;
    }
  };

  /* ================= GET USER NAME ================= */

  const getUserName = (id) => {
    const currentUser = getCurrentUser();

    if (!currentUser) return `User ${id}`;

    if (currentUser.userId === id || currentUser.id === id) {
      return currentUser.fullName || currentUser.name || "Bạn";
    }

    return `User ${id}`;
  };

  /* ================= LOAD ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [planRes, itemRes, campaignRes, warehouseRes] = await Promise.all([
        getSupplyPlansByCampaign(id),
        getAllReliefItems(),
        getAllAidCampaigns(),
        getAllWarehouses() // ✅ thêm API kho
      ]);

      const plans = planRes?.items || planRes?.data || planRes || [];
      const items = itemRes?.items || itemRes?.data || itemRes || [];
      const camps = campaignRes?.items || campaignRes?.data || campaignRes || [];
      const warehousesData =
        warehouseRes?.items || warehouseRes?.data || warehouseRes || [];

      setList(plans);
      setReliefItems(items);
      setCampaigns(camps);
      setWarehouses(warehousesData); // ✅ set kho

    } catch (err) {
      console.error(err);
      AuthNotify.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= DELETE ================= */

  const handleDelete = async (record) => {
    try {
      await deleteSupplyPlan(record.supplyPlanId);

      setList(prev =>
        prev.filter(x => x.supplyPlanId !== record.supplyPlanId)
      );

      AuthNotify.success("Đã xóa");

    } catch {
      AuthNotify.error("Xóa thất bại");
    }
  };

  /* ================= HELPERS ================= */

  const getItemName = (id) => {
    return reliefItems.find(x => x.reliefItemId === id)?.itemName || "—";
  };

  const getCampaignName = (id) => {
    return campaigns.find(x => x.campaignID === id)?.campaignName || "—";
  };

  // ✅ FIX QUAN TRỌNG
  const getWarehouseName = (id) => {
    return warehouses.find(x => x.warehouseId === id)?.warehouseName || "—";
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "supplyPlanId",
      width: 80,
    },
    {
      title: "Chiến dịch",
      render: (_, record) => getCampaignName(record.campaignId),
    },
    {
      title: "Kho hàng",
      render: (_, record) => getWarehouseName(record.warehouseId), // ✅ FIX
    },
    {
      title: "Vật phẩm",
      render: (_, record) => getItemName(record.reliefItemId),
    },
    {
      title: "Số lượng dự kiến",
      dataIndex: "plannedQuantity",
    },
    {
      title: "Số lượng duyệt",
      render: (_, record) => record.approvedQuantity ?? 0,
    },
    {
      title: "Người tạo",
      render: (_, record) =>
        getUserName(record.createdByManagerId),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleString("vi-VN") : "—",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div className="actions">
          <Button
            onClick={() => {
              setSelected(record);
              setOpenEdit(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="supply-page">

      <div className="header">
        <h2>Kế hoạch cấp phát</h2>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          + Tạo kế hoạch
        </Button>
      </div>

      <Table
        rowKey="supplyPlanId"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} kế hoạch`,
        }}
      />

<CreateSupplyPlan
  open={openCreate}
  onClose={() => setOpenCreate(false)}
  campaignId={Number(id)}
  onSuccess={(newItem) => {
    setList(prev => [
      {
        ...newItem,
        supplyPlanId:
          newItem?.supplyPlanId || Date.now(), // fallback
      },
      ...prev,
    ]);
  }}
/>

      <EditSupplyPlan
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selected}
        onSuccess={fetchData}
      />

    </div>
  );
}