import { Card, Row, Col } from "antd";
import "./SummaryCards.css";

export default function SummaryCards({
  summary,
  onClickItem,
  activeKey,
  completedValue,
}) {
  const items = [
    { key: "total", label: "Tong yeu cau", value: summary.totalRequests },
    { key: "open", label: "Dang xu ly", value: summary.openRequests },
    { key: "completed", label: "Da hoan thanh", value: completedValue ?? 0 },
    { key: "overdue", label: "Qua han", value: summary.overdueRequests },
    { key: "campaign", label: "Chien dich dang thuc hien", value: summary.activeCampaigns },
    { key: "stock", label: "Canh bao kho", value: summary.inventoryAlertCount },
  ];

  return (
    <Row gutter={16}>
      {items.map((item, i) => (
        <Col span={4} key={i}>
          <Card
            className={`summary-card ${
              activeKey === item.key ? "summary-card-active" : ""
            }`}
            hoverable
            onClick={() => onClickItem?.(item.key)}
          >
            <div className="summary-value">{item.value}</div>
            <div className="summary-label">{item.label}</div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
