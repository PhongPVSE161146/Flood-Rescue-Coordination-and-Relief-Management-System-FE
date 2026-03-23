import { useEffect, useState } from "react";
import { Button, Table, Tag, Space, message, Spin, Input } from "antd";
import { getAllRequestLogs } from "../../../../api/axios/RequestLogs/requestLogsApi";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import "../../../pages/Admin/Logs/Logs.css";

export default function LogsContainer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");

  const fetchLogs = async (id = "") => {
    try {
      setLoading(true);
      // Fetch logs. If id is empty, it depends on API if it returns all or nothing.
      const data = await getAllRequestLogs(id || null);
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch logs failed:", error);
      message.error("Không thể tải nhật ký hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80
    },
    {
      title: "Yêu cầu ID",
      dataIndex: "rescueRequestId",
      key: "rescueRequestId",
      width: 120,
      render: (id) => <Tag color="blue">REQ-{id}</Tag>
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text) => <strong>{text}</strong>
    },
    {
      title: "Người thực hiện",
      dataIndex: "performedBy",
      key: "performedBy",
      render: (user) => <span>User ID: {user}</span>
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (t) => t ? new Date(t).toLocaleString() : "N/A"
    },
  ];

  return (
    <div className="logs-page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Nhật ký yêu cầu cứu hộ</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>Lịch sử hoạt động và log audit cho các yêu cầu cứu hộ trong hệ thống</p>
        </div>

        <div className="page-actions">
          <Space size="middle">
            <Input
              placeholder="Nhập Rescue Request ID"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              onPressEnter={() => fetchLogs(requestId)}
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => fetchLogs(requestId)}
              loading={loading}
              size="large"
            >
              Làm mới
            </Button>
          </Space>
        </div>
      </div>

      <div className="logs-table" style={{ background: "#fff", borderRadius: "12px", padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <Table
          rowKey="id"
          dataSource={logs}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          bordered
        />
      </div>
    </div>
  );
}
