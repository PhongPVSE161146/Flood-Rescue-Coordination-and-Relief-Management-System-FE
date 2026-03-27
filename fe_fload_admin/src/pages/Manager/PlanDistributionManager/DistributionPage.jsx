import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Tag
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getAllDistributions,
  deleteDistribution,
  getAllRescueTeams,
  getAllAidCampaigns
} from "../../../../api/axios/ManagerApi/periodicAidApi";
import AuthNotify from "../../../utils/Common/AuthNotify";
import CreateDistribution from "../../../components/ManagerComponents/DistributionPlanModal/CreateDistribuionPlan/CreateDistribution";
import EditDistribution from "../../../components/ManagerComponents/DistributionPlanModal/EditDistribuitonPlan/EditDistribution";

export default function DistributionPage() {
  const [list, setList] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  /* ================= HELPER ================= */

  const normalize = (res) =>
    res?.items || res?.data || res || [];

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

    </div>
  );
}