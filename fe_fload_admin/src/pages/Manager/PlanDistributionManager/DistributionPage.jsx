import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Tag,
  Spin,
  Empty,
  Modal
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getAllDistributions,
  deleteDistribution,
  getAllRescueTeams,
  getAllAidCampaigns,
  getDistributionDetailsByDistribution,
  getBeneficiaryById,
  getAllReliefItems
} from "../../../../api/axios/ManagerApi/periodicAidApi";
import AuthNotify from "../../../utils/Common/AuthNotify";
import CreateDistribution from "../../../components/ManagerComponents/DistributionPlanModal/CreateDistribuionPlan/CreateDistribution";
import EditDistribution from "../../../components/ManagerComponents/DistributionPlanModal/EditDistribuitonPlan/EditDistribution";
import EditDistributionDetail from "../../../components/ManagerComponents/DistributionPlanModal/EditDistributionDetailPlan/EditDistributionDetail";
import AddDistributionDetail from "../../../components/ManagerComponents/DistributionPlanModal/AddDistributionDetail/AddDistributionDetail";

export default function DistributionPage() {
  const [list, setList] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [expandedLoading, setExpandedLoading] = useState({});

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditDetail, setOpenEditDetail] = useState(false);
  const [openAddDetail, setOpenAddDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedDistributionForAdd, setSelectedDistributionForAdd] = useState(null);
  const [reliefItems, setReliefItems] = useState([]);
  const navigate = useNavigate();
  /* ================= HELPER ================= */

  const normalize = (res) =>
    res?.items || res?.data || res || [];

  /* ================= LOAD RELIEF ITEMS ================= */

  const loadReliefItems = async () => {
    try {
      const res = await getAllReliefItems();
      setReliefItems(normalize(res));
    } catch (err) {
      console.error("Load relief items error:", err);
    }
  };

  /* ================= LOAD EXPANDED DETAILS ================= */

  const loadExpandedDetails = async (distributionId) => {
    try {
      setExpandedLoading(prev => ({ ...prev, [distributionId]: true }));

      const detailsRes = await getDistributionDetailsByDistribution(distributionId);
      const details = normalize(detailsRes);

      // 🔥 enrich each detail with beneficiary info
      const enriched = await Promise.all(
        details.map(async (detail) => {
          try {
            const beneficiary = await getBeneficiaryById(detail.beneficiaryId);
            return {
              ...detail,
              fullName: beneficiary?.fullName || "—",
              phone: beneficiary?.phone,
              address: beneficiary?.address,
              householdSize: beneficiary?.householdSize,
            };
          } catch {
            return { ...detail, fullName: "—" };
          }
        })
      );

      setExpandedDetails(prev => ({
        ...prev,
        [distributionId]: enriched
      }));

    } catch (err) {
      console.error("Load details error:", err);
      message.error("Lỗi tải chi tiết người nhận");
    } finally {
      setExpandedLoading(prev => ({ ...prev, [distributionId]: false }));
    }
  };

  /* ================= RELIEF ITEMS MAP ================= */

  const reliefItemMap = useMemo(() => {
    const map = {};
    reliefItems.forEach(item => {
      map[item.itemId] = item.itemName;
    });
    return map;
  }, [reliefItems]);

  /* ================= LOAD ================= */

  const fetchAll = async () => {
    try {
      setLoading(true);
  
      const [distRes, campRes, teamRes] = await Promise.all([
        getAllDistributions(),
        getAllAidCampaigns(),
        getAllRescueTeams(),
      ]);
  
      const data = normalize(distRes);
  
      // 🔥 FIX QUAN TRỌNG: sort mới nhất lên đầu
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.distributedAt) - new Date(a.distributedAt)
      );
  
      setList(sorted);
      setCampaigns(normalize(campRes));
      setTeams(normalize(teamRes));

      // 🔥 load relief items
      await loadReliefItems();
  
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (record) => {
    try {
      await deleteDistribution(record.distributionId);

      setList(prev =>
        prev.filter(x => x.distributionId !== record.distributionId)
      );

      AuthNotify.success("Đã xóa");
    } catch {
      AuthNotify.error("Xóa thất bại");
    }
  };

  /* ================= MAP ================= */

  const campaignMap = useMemo(() => {
    const map = {};
    campaigns.forEach(c => {
      const id = c.campaignId || c.campaignID;
      map[id] = c.campaignName;
    });
    return map;
  }, [campaigns]);

  const teamMap = useMemo(() => {
    const map = {};
    teams.forEach(t => {
      map[t.rcid] = t.rcName;
    });
    return map;
  }, [teams]);

  /* ================= STATUS ================= */

  const renderStatus = (status) => {
    const map = {
      pending: { text: "Đang chờ", color: "gold" },
      accepted: { text: "Đã nhận", color: "blue" },
      "in progress": { text: "Đang phát", color: "processing" },
      completed: { text: "Hoàn thành", color: "green" },
      rejected: { text: "Từ chối", color: "red" },
    };

    const key = status?.toLowerCase()?.trim();
    const s = map[key] || { text: status, color: "default" };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  /* ================= EXPANDED ROW RENDER ================= */

  const expandedRowRender = (record) => {
    const details = expandedDetails[record.distributionId] || [];
    const isLoading = expandedLoading[record.distributionId];

    if (isLoading) {
      return <div style={{ padding: 12 }}><Spin size="small" /> Đang tải...</div>;
    }

    if (!details || details.length === 0) {
      return <Empty description="Không có người nhận" />;
    }

    const detailColumns = [
      {
        title: "ID",
        dataIndex: "detailId",
        width: 70,
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
        title: "Vật phẩm",
        dataIndex: "reliefItemId",
        render: (id) => reliefItemMap[id] || `#${id}`,
      },
      {
        title: "Số lượng",
        dataIndex: "distributedQuantity",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: renderStatus,
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        ellipsis: true,
      },
      {
        title: "Hành động",
        width: 100,
        render: (_, detail) => (
          <Button
            size="small"
            onClick={() => {
              setSelectedDetail(detail);
              setOpenEditDetail(true);
            }}
          >
            Sửa
          </Button>
        ),
      },
    ];

    return (
      <div style={{ padding: "12px 16px" }}>
        <Table
          rowKey="detailId"
          columns={detailColumns}
          dataSource={details}
          pagination={false}
          size="small"
          style={{ marginBottom: 16 }}
        />

        <Button type="primary" onClick={() => {
          setSelectedDistributionForAdd(record);
          setOpenAddDetail(true);
        }}>
          + Thêm người nhận
        </Button>
      </div>
    );
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "distributionId",
      width: 80,
      render: (id) => (
        <span
          style={{ color: "#1677ff", cursor: "pointer" }}
          onClick={() => navigate(`/manager/team-cuu-tro/${id}`)}
        >
          #{id}
        </span>
      ),
    },
    {
      title: "Chiến dịch",
      render: (_, record) =>
        campaignMap[record.campaignId] || `#${record.campaignId}`,
    },
    {
      title: "Đội cứu trợ",
      render: (_, record) =>
        teamMap[record.rescueTeamId] || `#${record.rescueTeamId}`,
    },
    {
      title: "Thời gian",
      dataIndex: "distributedAt",
      render: (d) =>
        d ? new Date(d).toLocaleString("vi-VN") : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatus,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
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
    <div style={{ padding: 20 }}>

      <div style={{
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2>Phân phối cứu trợ ({list.length})</h2>

        <Button type="primary" onClick={() => setOpenCreate(true)}>
          + Tạo
        </Button>
      </div>

      <Table
        rowKey="distributionId"
        columns={columns}
        dataSource={list}
        loading={loading}
        expandable={{
          expandedRowRender,
          onExpand: (expanded, record) => {
            if (expanded && !expandedDetails[record.distributionId]) {
              loadExpandedDetails(record.distributionId);
            }
          },
        }}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (t) => `Tổng ${t}`,
        }}
      />

      <CreateDistribution
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchAll}
      />

      <EditDistribution
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selected}
        onSuccess={fetchAll}
      />

      <EditDistributionDetail
        open={openEditDetail}
        onClose={() => setOpenEditDetail(false)}
        data={selectedDetail}
        onSuccess={() => {
          setOpenEditDetail(false);
          if (selectedDetail?.distributionId) {
            loadExpandedDetails(selectedDetail.distributionId);
          }
        }}
      />

      <AddDistributionDetail
        open={openAddDetail}
        onClose={() => {
          setOpenAddDetail(false);
          setSelectedDistributionForAdd(null);
        }}
        distributionId={selectedDistributionForAdd?.distributionId}
        campaignId={selectedDistributionForAdd?.campaignId}
        onSuccess={() => {
          if (selectedDistributionForAdd?.distributionId) {
            loadExpandedDetails(selectedDistributionForAdd.distributionId);
          }
        }}
      />

    </div>
  );
}