import { useEffect, useState } from "react";
import { Button, Table, Tag, Space, message } from "antd";
import "./Logs.css";

const sampleLogs = [
  { id: 1, time: new Date().toISOString(), level: "INFO", user: "system", message: "Hệ thống khởi động" },
  { id: 2, time: new Date().toISOString(), level: "WARN", user: "admin", message: "Cấu hình gần đầy" },
  { id: 3, time: new Date().toISOString(), level: "ERROR", user: "manager", message: "Lỗi khi phân công nhiệm vụ" },
];

export default function 
Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("system_logs");
      const parsed = raw ? JSON.parse(raw) : null;
      setLogs(parsed && Array.isArray(parsed) ? parsed : sampleLogs);
    } catch (e) {
      setLogs(sampleLogs);
    }
  }, []);

  const clearLogs = () => {
    localStorage.removeItem("system_logs");
    setLogs([]);
    message.success("Đã xóa logs");
  };

  const columns = [
    { title: "Thời gian", dataIndex: "time", key: "time", render: (t) => new Date(t).toLocaleString() },
    { title: "Mức", dataIndex: "level", key: "level", render: (l) => <Tag>{l}</Tag> },
    { title: "Người", dataIndex: "user", key: "user" },
    { title: "Nội dung", dataIndex: "message", key: "message" },
  ];

  return (
    <div className="logs-page">
      <div className="page-header">
        <div>
          <h2>Logs hệ thống</h2>
          <p>Danh sách log ghi lại hoạt động và lỗi hệ thống</p>
        </div>

        <div className="page-actions">
          <Space>
            <Button danger onClick={clearLogs}>
              Xóa logs
            </Button>
          </Space>
        </div>
      </div>

      <div className="logs-table">
        <Table rowKey={(r) => r.id || r.time} dataSource={logs} columns={columns} pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
}
