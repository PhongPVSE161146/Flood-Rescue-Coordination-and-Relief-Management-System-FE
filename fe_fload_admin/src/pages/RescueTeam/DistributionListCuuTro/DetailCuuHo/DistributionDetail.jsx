import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Divider, Button, Table, Input } from "antd";

import {
  getPeriodicAidCampaignById,
  getSupplyPlansByCampaign,
  getReliefItems,
  getReliefWarehouses,
  getBeneficiariesByCampaign
} from "../../../../../api/axios/RescueApi/RescueTask";

export default function DistributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [plans, setPlans] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [itemMap, setItemMap] = useState({});
  const [warehouseMap, setWarehouseMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const toArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.items)) return res.items;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.items)) return res.data.items;
    return [];
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        campaignRes,
        plansRes,
        itemsRes,
        warehouseRes,
        beneficiaryRes
      ] = await Promise.all([
        getPeriodicAidCampaignById(id),
        getSupplyPlansByCampaign(id),
        getReliefItems(),
        getReliefWarehouses(),
        getBeneficiariesByCampaign(id), // 🔥 NEW
      ]);

      setCampaign(campaignRes);
      setPlans(toArray(plansRes));
      setBeneficiaries(toArray(beneficiaryRes));

      /* ITEM */
      const itemMapTemp = {};
      toArray(itemsRes).forEach((i) => {
        itemMapTemp[i.reliefItemId || i.id] =
          i.itemName || i.name;
      });
      setItemMap(itemMapTemp);

      /* WAREHOUSE */
      const warehouseMapTemp = {};
      toArray(warehouseRes).forEach((w) => {
        warehouseMapTemp[w.warehouseId || w.id] =
          w.warehouseName || w.name;
      });
      setWarehouseMap(warehouseMapTemp);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= MERGE DATA ================= */

  const tableData = beneficiaries
  
    .map((b) => {
      const plan = plans[0]; // 👉 tạm gán 1 plan (nếu backend chưa link)

      return {
        key: b.beneficiaryId,

        name: b.fullName,
        phone: b.phone,
        address: b.address,
        group: b.targetGroup,

        itemName: plan
          ? itemMap[plan.reliefItemId] || "—"
          : "—",

          people: b.householdSize, 
        approved: plan?.approvedQuantity || 0,

        warehouseName: plan
          ? warehouseMap[plan.warehouseId] || "—"
          : "—",

        status: b.status,
      };
    })
    .filter((row) => {
      return (
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.phone?.includes(search)
      );
    });
    const totalHouseholds = tableData.length;

  /* ================= COLUMNS ================= */

  const columns = [
    {
      title: "Người nhận",
      dataIndex: "name",
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
      dataIndex: "people",
    },
    {
      title: "Đối tượng",
      dataIndex: "group",
    },
    {
      title: "Vật phẩm",
      dataIndex: "itemName",
    },
    {
      title: "Số lượng hỗ trợ",
      render: (_, r) => (
        <b>{r.approved} </b>
      ),
    },
    {
      title: "Kho",
      dataIndex: "warehouseName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
  ];

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 20 }}>

      <Button onClick={() => navigate(-1)}>← Quay lại</Button>

      <h2>Chi tiết chiến dịch</h2>

      <Divider />

      <p><b>Tên chiến dịch:</b> {campaign?.campaignName}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
  
  {/* LEFT */}
  <Input
    placeholder="Tìm tên hoặc SĐT..."
    style={{ maxWidth: 300 }}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* RIGHT 👉 TỔNG */}
  <div style={{ fontWeight: 600 }}>
    Tổng: <span style={{ color: "#1890ff" }}>{totalHouseholds}</span> người nhận
  </div>

</div>

<Table
  columns={columns}
  dataSource={tableData}
  pagination={{ pageSize: 5 }}
  bordered
/>
    </div>
  );
}