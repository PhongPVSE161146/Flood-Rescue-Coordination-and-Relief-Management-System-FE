import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Spin,
  Tabs,
  Pagination,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import "./TaskDashboardForTeam.css";

import {
  getAllAssignments,
  getAllRescueTeams,
  getRescueTeamMembers,
  getAllDistributions,
  getAllAidCampaigns,
} from "../../../../api/axios/RescueApi/RescueTask";

/* ================= STATUS ================= */
const mapStatusVN = (status) => {
  const map = {
    accepted: "Đã nhận",
    completed: "Hoàn thành",
    rejected: "Từ chối",
    pending: "Đang chờ",
  };
  return map[status] || status;
};

export default function TaskDashboardForTeam() {
  const [tab, setTab] = useState("assignment");
  const [loading, setLoading] = useState(false);

  const [assignmentData, setAssignmentData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  const [assignmentPage, setAssignmentPage] = useState(1);
  const [distributionPage, setDistributionPage] = useState(1);

  const [campaignMap, setCampaignMap] = useState({});

  const pageSize = 5;

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user")) ||
    {};

  /* ================= FIND TEAM ================= */
  const findMyTeamId = async (teams, userId) => {
    for (const team of teams) {
      try {
        const res = await getRescueTeamMembers(team.rcid);
        const members = res?.data?.items || [];

        if (members.some((m) => m.userId === userId)) {
          return team.rcid;
        }
      } catch {}
    }
    return null;
  };

  /* ================= GET REQUEST ================= */
  const getRequestById = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/RescueRequests/${id}`
      );
      return await res.json();
    } catch {
      return null;
    }
  };

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      // TEAM
      const teamRes = await getAllRescueTeams();
      const teams = teamRes?.data?.items || [];

      const myTeamId = await findMyTeamId(teams, user.userId);
      if (!myTeamId) return;

      // CAMPAIGN
      const campaigns = await getAllAidCampaigns();
      const cmap = {};
      campaigns.forEach((c) => (cmap[c.campaignID] = c));
      setCampaignMap(cmap);

      // ===== ASSIGNMENT =====
      const aRes = await getAllAssignments();
      const assignments = aRes?.data?.items || aRes || [];

      const myAssignments = assignments.filter(
        (a) => a.rescueTeamId === myTeamId
      );

      const aData = await Promise.all(
        myAssignments.map(async (a) => {
          const req = await getRequestById(a.rescueRequestId);

          let status = a.assignmentStatus?.toLowerCase();
          if (status === "assigned") status = "pending";

          return {
            name: req?.fullName || "Không rõ",
            phone: req?.contactPhone || "Không có",
            address: req?.address || "Chưa có",
            status,
            time: new Date(a.assignedAt).toLocaleString("vi-VN"),
          };
        })
      );

      setAssignmentData(aData);

      // ===== DISTRIBUTION =====
      const dRes = await getAllDistributions();

      const dData = dRes
        .filter((d) => d.rescueTeamId === myTeamId)
        .map((d) => ({
          campaignName:
            cmap[d.campaignId]?.campaignName ||
            "Không rõ chiến dịch",
          status: d.status?.toLowerCase(),
          time: new Date(d.distributedAt).toLocaleString("vi-VN"),
        }));

      setDistributionData(dData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= PAGINATION ================= */
  const paginate = (data, page) =>
    data.slice((page - 1) * pageSize, page * pageSize);

  /* ================= STATS ================= */
  const getStats = (data) => ({
    total: data.length,
    pending: data.filter((x) => x.status === "pending").length,
    accepted: data.filter((x) => x.status === "accepted").length,
    completed: data.filter((x) => x.status === "completed").length,
    rejected: data.filter((x) => x.status === "rejected").length,
  });

  /* ================= PIE ================= */
  const renderPie = (stats) => {
    const pieData = [
      { name: "Chờ", value: stats.pending },
      { name: "Đã nhận", value: stats.accepted },
      { name: "Hoàn thành", value: stats.completed },
      { name: "Từ chối", value: stats.rejected },
    ];

    const COLORS = ["#faad14", "#1890ff", "#52c41a", "#ff4d4f"];

    return (
      <Card title="📈 Biểu đồ" style={{ marginTop: 16 }}>
        <PieChart width={400} height={300}>
          <Pie data={pieData} dataKey="value" outerRadius={100} label>
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>
    );
  };

  /* ================= UI ASSIGNMENT ================= */
  const renderAssignment = () => {
    const stats = getStats(assignmentData);
    const data = paginate(assignmentData, assignmentPage);

    return (
      <>
        <Row gutter={12}>
          <Col span={4}><Card>Tổng: {stats.total}</Card></Col>
          <Col span={4}><Card>Chờ: {stats.pending}</Card></Col>
          <Col span={4}><Card>Đã nhận: {stats.accepted}</Card></Col>
          <Col span={6}><Card>Hoàn thành: {stats.completed}</Card></Col>
          <Col span={6}><Card>Từ chối: {stats.rejected}</Card></Col>
        </Row>

        {renderPie(stats)}

        <Card title="📋 Danh sách cứu hộ" style={{ marginTop: 16 }}>
          {data.map((item, i) => (
            <div key={i} className="task-dashboard__item">
              <div>
                <b>{item.name}</b>
                <div>📞 {item.phone}</div>
                <div>📍 {item.address}</div>
                <div>⏱ {item.time}</div>
              </div>
              <div
  className={`task-dashboard__status task-dashboard__status--${item.status}`}
>
  {mapStatusVN(item.status)}
</div>
            </div>
          ))}

          <Pagination
            current={assignmentPage}
            pageSize={pageSize}
            total={assignmentData.length}
            onChange={setAssignmentPage}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </Card>
      </>
    );
  };

  /* ================= UI DISTRIBUTION ================= */
  const renderDistribution = () => {
    const stats = getStats(distributionData);
    const data = paginate(distributionData, distributionPage);

    return (
      <>
        <Row gutter={12}>
          <Col span={4}><Card>Tổng: {stats.total}</Card></Col>
          <Col span={4}><Card>Chờ: {stats.pending}</Card></Col>
          <Col span={4}><Card>Đã nhận: {stats.accepted}</Card></Col>
          <Col span={6}><Card>Hoàn thành: {stats.completed}</Card></Col>
          <Col span={6}><Card>Từ chối: {stats.rejected}</Card></Col>
        </Row>

        {renderPie(stats)}

        <Card title="📋 Danh sách cứu trợ" style={{ marginTop: 16 }}>
          {data.map((item, i) => (
            <div key={i} className="task-dashboard__item">
              <div>
                <b>{item.campaignName}</b>
                <div>⏱ {item.time}</div>
              </div>
              <div
  className={`task-dashboard__status task-dashboard__status--${item.status}`}
>
  {mapStatusVN(item.status)}
</div>
            </div>
          ))}

          <Pagination
            current={distributionPage}
            pageSize={pageSize}
            total={distributionData.length}
            onChange={setDistributionPage}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </Card>
      </>
    );
  };

  /* ================= MAIN ================= */
  return (
    <div className="task-dashboard">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            {
              key: "assignment",
              label: "🚑 Cứu hộ",
              children: renderAssignment(),
            },
            {
              key: "distribution",
              label: "🎁 Cứu trợ",
              children: renderDistribution(),
            },
          ]}
        />
      )}
    </div>
  );
}