import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  message,
  Spin,
  Input
} from "antd";
import { getAllRequestLogs } from "../../../../api/axios/RequestLogs/requestLogsApi";
import { SearchOutlined } from "@ant-design/icons";

export default function LogsContainer() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState(""); // search text
  const [requestId, setRequestId] = useState(""); // search theo yêu cầu

  /* ================= LOAD ALL ================= */

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const data = await getAllRequestLogs();

      const list =
        data?.items ||
        data?.data ||
        data ||
        [];

      setLogs(list);
      setFilteredLogs(list);

    } catch (error) {
      console.error(error);
      message.error("Không thể tải logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {
    let result = [...logs];

    // 🔥 filter theo requestId
    if (requestId) {
      result = result.filter((log) =>
        String(log.rescueRequestId).includes(requestId)
      );
    }

    // 🔥 filter theo keyword
    if (keyword) {
      const key = keyword.toLowerCase();

      result = result.filter((log) =>
        log.action?.toLowerCase().includes(key) ||
        log.performedByName?.toLowerCase().includes(key) ||
        log.performedByRole?.toLowerCase().includes(key)
      );
    }

    setFilteredLogs(result);

  }, [keyword, requestId, logs]);

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "logId",
      width: 80
    },
    {
      title: "Yêu cầu",
      dataIndex: "rescueRequestId",
      render: (id) => <Tag color="blue">REQ-{id}</Tag>
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text) => <strong>{text}</strong>
    },
    {
      title: "Người thực hiện",
      render: (_, r) => (
        <div>
          <b>{r.performedByName}</b>
          <div style={{ fontSize: 12, color: "#888" }}>
            {r.performedByRole}
          </div>
        </div>
      )
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (t) =>
        t ? new Date(t).toLocaleString("vi-VN") : "N/A"
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="logs-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h2>Nhật ký hệ thống</h2>
          <p>Tổng {filteredLogs.length} log</p>
        </div>

        <Space>

          {/* 🔥 SEARCH REQUEST ID */}
          <Input
            placeholder="Tìm theo Request ID"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            style={{ width: 180 }}
            allowClear
          />

          {/* 🔥 SEARCH TEXT */}
          <Input
            placeholder="Tìm hành động / người..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 260 }}
            allowClear
          />

        </Space>
      </div>

      {/* TABLE */}
      <div className="logs-table">

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Table
            rowKey="logId"
            dataSource={filteredLogs}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} log`,
            }}
            bordered
          />
        )}

      </div>
    </div>
  );
}