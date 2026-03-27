import { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Pagination, Spin } from "antd";
import "./TaskDashboardForTeam.css";
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

  /* ================= LOAD ================= */

  const loadData = async () => {
    try {
      setLoading(true);

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

      const myData = list.filter(
        (x) => x.rescueTeamId === myTeamId
      );

      const mapped = await Promise.all(
        myData.map(async (a) => {
          const req = await getRequestById(a.rescueRequestId);

          // 🔥 normalize assigned → pending
          let status = a.assignmentStatus?.toLowerCase();
          if (status === "assigned") status = "pending";

          return {
            id: a.assignmentId,
            name: req?.fullName || "Không rõ",
            phone: req?.contactPhone || "Không có",
            address: req?.address || "Chưa có",
            status,
            time: a.assignedAt
              ? new Date(a.assignedAt).toLocaleString("vi-VN")
              : "Chưa có",
          };
        })
      );

      setData(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  /* ================= FILTER ================= */

  const filteredData =
    filter === "all"
      ? data
      : data.filter((x) => x.status === filter);

  const sortedData = filteredData.sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* ================= COUNT ================= */

  const total = data.length;
  const pending = data.filter((x) => x.status === "pending").length;
  const accepted = data.filter((x) => x.status === "accepted").length;
  const completed = data.filter((x) => x.status === "completed").length;
  const rejected = data.filter((x) => x.status === "rejected").length;

  /* ================= PERCENT ================= */

  const percent = (value) =>
    total ? Math.round((value / total) * 100) : 0;

  /* ================= UI ================= */

  return (
    <div className="task-dashboard">
      {loading ? (
        <div className="task-dashboard__loading">
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <h2 className="task-dashboard__title">
            📊 Thống Kê Nhiệm Vụ
          </h2>

          {/* ===== SUMMARY ===== */}
          <Row gutter={12}>
            <Col span={4}>
              <Card onClick={() => setFilter("all")}>
                <h3>Tổng</h3>
                <h1>{total}</h1>
              </Card>
            </Col>

            <Col span={4}>
              <Card onClick={() => setFilter("pending")}>
                <h3>Đang chờ</h3>
                <h1>{pending}</h1>
              </Card>
            </Col>

            <Col span={6}>
              <Card onClick={() => setFilter("accepted")}>
                <h3>Đã nhận</h3>
                <h1>{accepted}</h1>
              </Card>
            </Col>

            <Col span={4}>
              <Card onClick={() => setFilter("completed")}>
                <h3>Hoàn thành</h3>
                <h1>{completed}</h1>
              </Card>
            </Col>

            <Col span={6}>
              <Card onClick={() => setFilter("rejected")}>
                <h3>Từ chối</h3>
                <h1>{rejected}</h1>
              </Card>
            </Col>
          </Row>

          {/* ===== PROGRESS ===== */}
          <Row gutter={16} className="task-dashboard__progress-row">
            <Col span={6}>
              <Card>
                <h3>Đang chờ</h3>
                <Progress percent={percent(pending)} />
              </Card>
            </Col>

            <Col span={6}>
              <Card>
                <h3>Đã nhận</h3>
                <Progress percent={percent(accepted)} />
              </Card>
            </Col>

            <Col span={6}>
              <Card>
                <h3>Hoàn thành</h3>
                <Progress percent={percent(completed)} />
              </Card>
            </Col>

            <Col span={6}>
              <Card>
                <h3>Từ chối</h3>
                <Progress percent={percent(rejected)} />
              </Card>
            </Col>
          </Row>

          {/* ===== LIST ===== */}
          <Card title="📋 Danh sách nhiệm vụ">
            {paginatedData.map((item) => (
              <div key={item.id} className="task-dashboard__item">
                <div>
                  <b>Mã nhiệm vụ: #{item.id}</b>
                  <div>Họ tên: {item.name}</div>
                  <div>SĐT: {item.phone}</div>
                  <div>Địa chỉ: {item.address}</div>
                  <div>⏱ {item.time}</div>
                </div>

                <div
                  className={`task-dashboard__status ${
                    item.status === "accepted"
                      ? "task-dashboard__status--accepted"
                      : item.status === "completed"
                      ? "task-dashboard__status--completed"
                      : item.status === "pending"
                      ? "task-dashboard__status--pending"
                      : "task-dashboard__status--rejected"
                  }`}
                >
                  {mapStatusVN(item.status)}
                </div>
              </div>
            ))}

            {filteredData.length > pageSize && (
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={setCurrentPage}
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}