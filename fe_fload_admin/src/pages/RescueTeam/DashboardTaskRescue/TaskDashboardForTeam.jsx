import { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Tag,Pagination,Spin } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import "./TaskDashboardForTeam.css"
import {
  getAllAssignments,
  getAllRescueTeams,
  getRescueTeamMembers
} from "../../../../api/axios/RescueApi/RescueTask";

/* ================= MAP STATUS ================= */

const mapStatusVN = (status) => {
  const map = {
    accepted: "Đã nhận",
    completed: "Hoàn thành",
    rejected: "Từ chối",
    assigned: "Đang chờ",
    pending: "Đang chờ",
  };
  return map[status] || status;
};

export default function TaskDashboardForTeam() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

        if (members.some(m => m.userId === userId)) {
          return team.rcid;
        }
      } catch {}
    }
    return null;
  };
  const filteredData =
  (filter === "all"
    ? data
    : data.filter(x => x.status === filter)
  ).sort((a, b) => new Date(b.time) - new Date(a.time));
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
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

  /* ================= LOAD ================= */

  const loadData = async () => {
    try {
      setLoading(true); // 🔥 bắt đầu loading
  
      if (!user?.userId) return;
  
      const teamRes = await getAllRescueTeams();
      const teams = teamRes?.data?.items || [];
  
      const myTeamId = await findMyTeamId(teams, user.userId);
  
      if (!myTeamId) {
        setData([]);
        return;
      }
  
      const res = await getAllAssignments();
      const list = res?.data?.items || res || [];
  
      const myData = list
        .filter(x => x.rescueTeamId === myTeamId)
        .filter(x => {
          const status = x.assignmentStatus?.toLowerCase();
          return status !== "pending";
        });
  
      const mapped = await Promise.all(
        myData.map(async (a) => {
          const req = await getRequestById(a.rescueRequestId);
  
          return {
            id: a.assignmentId,
            name: req?.fullName || "Không rõ",
            phone: req?.contactPhone || "Không có",
            address: req?.address || "Chưa có",
            status: a.assignmentStatus?.toLowerCase(),
            time: a.assignedAt
              ? new Date(a.assignedAt).toLocaleString("vi-VN")
              : "Chưa có"
          };
        })
      );
  
      setData(mapped);
  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // 🔥 kết thúc loading
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
  /* ================= COUNT ================= */

  const total = data.length;

  const accepted = data.filter(x => x.status === "accepted").length;
  const completed = data.filter(x => x.status === "completed").length;
  const rejected = data.filter(x => x.status === "rejected").length;

  /* ================= PERCENT ================= */

  const percent = (value) =>
    total ? Math.round((value / total) * 100) : 0;

  /* ================= UI ================= */

  return (
    <div className="dashboard-container">
  
      {loading ? (
        <div className="loading-full">
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <h2 className="dashboard-title">
            📊 Dashboard Nhiệm Vụ (Team)
          </h2>
  
          {/* ===== SUMMARY ===== */}
          <Row gutter={16}>
            <Col span={6}>
              <Card
                onClick={() => setFilter("all")}
                className={`dashboard-card ${filter === "all" ? "active" : ""}`}
              >
                <h3>Tổng nhiệm vụ</h3>
                <h1>{total}</h1>
              </Card>
            </Col>
  
            <Col span={6}>
              <Card
                onClick={() => setFilter("accepted")}
                className={`dashboard-card ${filter === "accepted" ? "active" : ""}`}
              >
                <h3>Đã nhận</h3>
                <h1>{accepted}</h1>
              </Card>
            </Col>
  
            <Col span={6}>
              <Card
                onClick={() => setFilter("completed")}
                className={`dashboard-card ${filter === "completed" ? "active" : ""}`}
              >
                <h3>Hoàn thành</h3>
                <h1>{completed}</h1>
              </Card>
            </Col>
  
            <Col span={6}>
              <Card
                onClick={() => setFilter("rejected")}
                className={`dashboard-card ${filter === "rejected" ? "active" : ""}`}
              >
                <h3>Từ chối</h3>
                <h1>{rejected}</h1>
              </Card>
            </Col>
          </Row>
  
          {/* ===== PROGRESS ===== */}
          <Row gutter={16} className="progress-row">
            <Col span={8}>
              <Card className="progress-card">
                <h3>Đã nhận</h3>
                <Progress percent={percent(accepted)} />
              </Card>
            </Col>
  
            <Col span={8}>
              <Card className="progress-card">
                <h3>Hoàn thành</h3>
                <Progress percent={percent(completed)} />
              </Card>
            </Col>
  
            <Col span={8}>
              <Card className="progress-card">
                <h3>Từ chối</h3>
                <Progress percent={percent(rejected)} />
              </Card>
            </Col>
          </Row>
  
          {/* ===== LIST ===== */}
          <Row className="list-row">
            <Col span={24}>
              <Card title="📋 Danh sách nhiệm vụ">
  
                <div className="task-list">
                  {paginatedData.map((item) => (
                    <div key={item.id} className="task-item">
                      <div>
                        <b className="task-name">
                         Mã nhiệm vụ: #{item.id} 
                        </b>
                        <div className="task-sub">Họ và tên: {item.name}</div>
                        <div className="task-sub">SĐT: {item.phone}</div>
                        <div className="task-sub">Địa chỉ: {item.address}</div>
                        <div className="task-sub">⏱Thời gian phân công: {item.time}</div>
                      </div>
  
                      <div
                        style={{
                          color:
                            item.status === "accepted"
                              ? "#1677ff"
                              : item.status === "completed"
                              ? "#52c41a"
                              : "#ff4d4f",
                          fontWeight: 500
                        }}
                      >
                        {mapStatusVN(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
  
                {filteredData.length > pageSize && (
                  <div className="pagination-wrap">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredData.length}
                      onChange={setCurrentPage}
                    />
                  </div>
                )}
  
              </Card>
            </Col>
          </Row>
        </>
      )}
  
    </div>
  );
}