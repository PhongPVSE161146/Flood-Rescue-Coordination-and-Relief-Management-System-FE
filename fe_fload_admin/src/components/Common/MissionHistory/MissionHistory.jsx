import React, { useEffect, useState } from "react";
import { Timeline, Tag, Spin, Empty, Card } from "antd";
import { HistoryOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getAllRequestLogs } from "../../../../api/axios/RequestLogs/requestLogsApi";

/**
 * Reusable component to display the audit log / action history of a rescue request.
 * @param {Object} props
 * @param {number|string} props.rescueRequestId - The ID of the rescue request to fetch logs for.
 * @param {string} [props.title="Lịch sử Hoạt động"] - Optional title for the header.
 */
const MissionHistory = ({ rescueRequestId, title = "Lịch sử Hoạt động" }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!rescueRequestId) return;
    try {
      setLoading(true);
      const data = await getAllRequestLogs(rescueRequestId);
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching mission history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [rescueRequestId]);

  const getTimelineIcon = (action) => {
    const act = action?.toLowerCase() || "";
    if (act.includes("hoàn thành") || act.includes("complete")) return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    if (act.includes("đang") || act.includes("process")) return <SyncOutlined spin style={{ color: "#1890ff" }} />;
    if (act.includes("tạo") || act.includes("create")) return <HistoryOutlined style={{ color: "#8c8c8c" }} />;
    return <ClockCircleOutlined style={{ color: "#faad14" }} />;
  };

  return (
    <Card 
      title={<><HistoryOutlined /> {title}</>} 
      className="mission-history-card"
      style={{ marginTop: 16, borderRadius: 12 }}
    >
      <Spin spinning={loading}>
        {logs.length > 0 ? (
          <Timeline
            mode="left"
            items={logs.map((log) => ({
              label: log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN", {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
              }) : "N/A",
              children: (
                <div className="log-item">
                  <div style={{ fontWeight: 600, color: "#262626" }}>{log.action}</div>
                  <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                    Người thực hiện: <Tag color="default" style={{ fontSize: "10px" }}>User {log.performedBy}</Tag>
                  </div>
                </div>
              ),
              dot: getTimelineIcon(log.action),
            }))}
          />
        ) : (
          <Empty description="Chưa có lịch sử hoạt động" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </Card>
  );
};

export default MissionHistory;
