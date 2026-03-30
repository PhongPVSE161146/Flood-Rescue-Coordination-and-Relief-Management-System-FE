import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Image,
  Modal,
  Row,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";

const { Paragraph, Text, Title } = Typography;

const SUMMARY_TITLES = {
  total: "Danh sach tong yeu cau",
  open: "Danh sach yeu cau dang xu ly",
  completed: "Danh sach yeu cau da hoan thanh",
  overdue: "Danh sach yeu cau qua han",
  campaign: "Danh sach chien dich dang thuc hien",
  stock: "Danh sach canh bao kho",
};

const IMAGE_FIELD_HINTS = ["image", "img", "photo", "avatar", "url"];
const DATE_FIELD_HINTS = ["date", "time", "at"];
const API_BASE = "https://api-rescue.purintech.id.vn";

const formatLabel = (value) =>
  String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

const isPrimitive = (value) =>
  value === null ||
  value === undefined ||
  ["string", "number", "boolean"].includes(typeof value);

const isImageUrl = (value) =>
  typeof value === "string" &&
  /^https?:\/\//i.test(value) &&
  /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(value);

const isHttpUrl = (value) =>
  typeof value === "string" && /^https?:\/\//i.test(value);

const resolveImageUrl = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (isHttpUrl(value)) {
    return value;
  }

  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
};

const looksLikeDateField = (fieldName) =>
  DATE_FIELD_HINTS.some((hint) => String(fieldName).toLowerCase().includes(hint));

const looksLikeImageField = (fieldName, value) =>
  IMAGE_FIELD_HINTS.some((hint) => String(fieldName).toLowerCase().includes(hint)) &&
  typeof value === "string" &&
  value.trim() !== "";

const formatValue = (fieldName, value) => {
  if (value === null || value === undefined || value === "") {
    return <Text type="secondary">Khong co</Text>;
  }

  if (typeof value === "boolean") {
    return <Tag color={value ? "green" : "red"}>{value ? "Co" : "Khong"}</Tag>;
  }

  if (looksLikeDateField(fieldName) && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toLocaleString("vi-VN");
  }

  if (looksLikeImageField(fieldName, value) || isImageUrl(value)) {
    return (
      <Image
        src={resolveImageUrl(value)}
        alt={formatLabel(fieldName)}
        width={88}
        height={64}
        style={{ objectFit: "cover", borderRadius: 10 }}
      />
    );
  }

  if (isHttpUrl(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        Mo lien ket
      </a>
    );
  }

  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return (
      <pre className="summary-detail-json">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return String(value);
};

const extractArrayData = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const candidateKeys = ["items", "list", "data", "results", "records"];

  for (const key of candidateKeys) {
    if (Array.isArray(value[key])) {
      return value[key];
    }
  }

  return null;
};

const buildSummaryFields = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value)
    .filter(([key, fieldValue]) => key !== "items" && isPrimitive(fieldValue))
    .map(([key, fieldValue]) => ({
      key,
      label: formatLabel(key),
      children: formatValue(key, fieldValue),
    }));
};

const normalizeRows = (rows) =>
  rows.map((row, index) => {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      return {
        key:
          row.id ??
          row.requestId ??
          row.rescueRequestId ??
          row.assignmentId ??
          row.campaignId ??
          row.warehouseId ??
          index,
        ...row,
      };
    }

    return { key: index, value: row };
  });

const isRescueRequestRow = (row) =>
  row &&
  typeof row === "object" &&
  !Array.isArray(row) &&
  Object.prototype.hasOwnProperty.call(row, "rescueRequestId");

const buildRescueRequestColumns = () => [
  {
    title: "Rescue Request Id",
    dataIndex: "rescueRequestId",
    key: "rescueRequestId",
  },
  {
    title: "Request Type",
    dataIndex: "requestType",
    key: "requestType",
    render: (value) => value || <Text type="secondary">Khong co</Text>,
  },
  {
    title: "Contact Phone",
    dataIndex: "contactPhone",
    key: "contactPhone",
  },
  {
    title: "Location Lat",
    dataIndex: "locationLat",
    key: "locationLat",
  },
  {
    title: "Location Lng",
    dataIndex: "locationLng",
    key: "locationLng",
  },
  {
    title: "Urgency Level Id",
    dataIndex: "urgencyLevelId",
    key: "urgencyLevelId",
  },
  {
    title: "Urgency Score",
    dataIndex: "urgencyScore",
    key: "urgencyScore",
  },
  {
    title: "Status Id",
    dataIndex: "statusId",
    key: "statusId",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => formatValue("createdAt", value),
  },
];

const buildColumns = (rows) => {
  const sampleRow = rows.find(
    (row) => row && typeof row === "object" && !Array.isArray(row)
  );

  if (!sampleRow) {
    return [
      {
        title: "Gia tri",
        dataIndex: "value",
        key: "value",
        render: (value) => formatValue("value", value),
      },
    ];
  }

  return Object.keys(sampleRow)
    .filter((key) => key !== "key")
    .map((key) => ({
      title: formatLabel(key),
      dataIndex: key,
      key,
      render: (value) => formatValue(key, value),
    }));
};

const buildRescueRequestDetailFields = (row) => {
  if (!row) {
    return [];
  }

  const hiddenKeys = new Set(["key", "locationImageUrl", "attachments"]);

  return Object.entries(row)
    .filter(([key]) => !hiddenKeys.has(key))
    .map(([key, value]) => ({
      key,
      label: formatLabel(key),
      children: formatValue(key, value),
    }));
};

const normalizeAttachments = (attachments) => {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .map((item, index) => ({
      key: item?.attachmentId ?? index,
      url: resolveImageUrl(item?.fileUrl || item?.url || ""),
    }))
    .filter((item) => item.url);
};

const detailText = (value, fallback = "Khong co") =>
  value === null || value === undefined || value === "" ? fallback : String(value);

export default function SummaryDetailPanel({
  summaryKey,
  loading,
  data,
  onClear,
}) {
  if (!summaryKey && !loading) {
    return null;
  }

  const title = SUMMARY_TITLES[summaryKey] || "Chi tiet dashboard";
  const rows = extractArrayData(data);
  const normalizedRows = rows ? normalizeRows(rows) : [];
  const isRescueRequestTable = normalizedRows.some(isRescueRequestRow);
  const columns = rows
    ? isRescueRequestTable
      ? buildRescueRequestColumns()
      : buildColumns(normalizedRows)
    : [];
  const summaryFields = buildSummaryFields(data);
  const totalCount = data?.total ?? normalizedRows.length ?? 0;
  const note = data?.note;
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    setSelectedRowKey(null);
    setIsDetailModalOpen(false);
  }, [summaryKey, data]);

  const selectedRow = useMemo(
    () => normalizedRows.find((row) => row.key === selectedRowKey) ?? null,
    [normalizedRows, selectedRowKey]
  );
  const rescueRequestDetailFields = buildRescueRequestDetailFields(selectedRow);
  const attachmentImages = normalizeAttachments(selectedRow?.attachments);

  return (
    <Card className="summary-detail-panel">
      <div className="summary-detail-header">
        <div>
          <Text className="summary-detail-eyebrow">Chi tiet theo the</Text>
          <Title level={4} className="summary-detail-title">
            {title}
          </Title>
          <Paragraph className="summary-detail-subtitle">
            {loading
              ? "Dang tai du lieu chi tiet..."
              : `Dang hien thi ${totalCount} ban ghi`}
          </Paragraph>
        </div>

        <Button onClick={onClear}>Dong chi tiet</Button>
      </div>

      {loading ? (
        <div className="summary-detail-loading">
          <Spin size="large" />
        </div>
      ) : !data ? (
        <Empty description="Chua co du lieu chi tiet" />
      ) : (
        <>
          <Row gutter={[16, 16]} className="summary-detail-metrics">
            <Col xs={24} sm={12} lg={8}>
              <div className="summary-detail-stat">
                <span className="summary-detail-stat-label">Tong ban ghi</span>
                <strong className="summary-detail-stat-value">{totalCount}</strong>
              </div>
            </Col>

            {note ? (
              <Col xs={24} sm={12} lg={16}>
                <div className="summary-detail-note">
                  <span className="summary-detail-stat-label">Ghi chu</span>
                  <span>{note}</span>
                </div>
              </Col>
            ) : null}
          </Row>

          {summaryFields.length > 0 ? (
            <Descriptions
              bordered
              size="middle"
              column={{ xs: 1, sm: 2, lg: 3 }}
              items={summaryFields}
              className="summary-detail-descriptions"
            />
          ) : null}

          {rows ? (
            <>
              <Table
                className="summary-detail-table"
                columns={columns}
                dataSource={normalizedRows}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                scroll={{ x: 1200 }}
                rowClassName={(record) =>
                  record.key === selectedRowKey ? "summary-detail-row-active" : ""
                }
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedRowKey(record.key);
                    if (isRescueRequestTable) {
                      setIsDetailModalOpen(true);
                    }
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </>
          ) : (
            <pre className="summary-detail-json">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </>
      )}

      {isRescueRequestTable && selectedRow ? (
        <Modal
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
          width={1080}
          className="summary-detail-modal"
          title={`Chi tiet rescue request #${selectedRow.rescueRequestId}`}
        >
          <div className="summary-detail-modal-grid">
            <div className="summary-detail-modal-main">
              <div className="summary-detail-hero">
                <div>
                  <Text className="summary-detail-eyebrow">Rescue Request</Text>
                  <Title level={3} className="summary-detail-modal-title">
                    #{selectedRow.rescueRequestId}
                  </Title>
                  <Paragraph className="summary-detail-modal-subtitle">
                    {detailText(selectedRow.requestType)}
                  </Paragraph>
                </div>

                <div className="summary-detail-status-pill">
                  <span>Status</span>
                  <strong>{detailText(selectedRow.statusId)}</strong>
                </div>
              </div>

              <div className="summary-detail-section-card">
                <Title level={5} className="summary-detail-section-title">
                  Thong tin lien he
                </Title>
                <div className="summary-detail-info-grid">
                  <div className="summary-detail-info-item">
                    <span>Ho ten</span>
                    <strong>{detailText(selectedRow.fullName)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>So dien thoai</span>
                    <strong>{detailText(selectedRow.contactPhone)}</strong>
                  </div>
                  <div className="summary-detail-info-item summary-detail-info-item-full">
                    <span>Dia chi</span>
                    <strong>{detailText(selectedRow.address)}</strong>
                  </div>
                </div>
              </div>

              <div className="summary-detail-section-card">
                <Title level={5} className="summary-detail-section-title">
                  Thong tin yeu cau
                </Title>
                <div className="summary-detail-info-grid">
                  <div className="summary-detail-info-item">
                    <span>Created At</span>
                    <strong>{formatValue("createdAt", selectedRow.createdAt)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>Urgency Level Id</span>
                    <strong>{detailText(selectedRow.urgencyLevelId)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>Urgency Score</span>
                    <strong>{detailText(selectedRow.urgencyScore)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>Victim Count</span>
                    <strong>{detailText(selectedRow.victimCount)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>Available Rescue Tool</span>
                    <strong>{detailText(selectedRow.availableRescueTool)}</strong>
                  </div>
                  <div className="summary-detail-info-item">
                    <span>Special Needs</span>
                    <strong>{detailText(selectedRow.specialNeeds)}</strong>
                  </div>
                </div>
              </div>

              <div className="summary-detail-section-card">
                <Title level={5} className="summary-detail-section-title">
                  Mo ta chi tiet
                </Title>
                <div className="summary-detail-text-block">
                  {detailText(selectedRow.detailDescription)}
                </div>
              </div>

              <div className="summary-detail-section-card">
                <Title level={5} className="summary-detail-section-title">
                  Ghi chu doi cuu ho
                </Title>
                <div className="summary-detail-text-block">
                  {detailText(selectedRow.rescueTeamNote)}
                </div>
              </div>

              <div className="summary-detail-gallery-block">
                <Text className="summary-detail-gallery-title">Vi tri tren ban do</Text>
                <div className="summary-detail-map-frame">
                  <iframe
                    title={`map-${selectedRow.rescueRequestId}`}
                    src={`https://www.google.com/maps?q=${selectedRow.locationLat ?? 0},${selectedRow.locationLng ?? 0}&z=15&output=embed`}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="summary-detail-modal-side">
              <Card className="summary-detail-modal-info" bordered={false}>
                <Text className="summary-detail-gallery-title">Thong tin nhanh</Text>
                <div className="summary-detail-quick-grid">
                  <div>
                    <span>Status Id</span>
                    <strong>{selectedRow.statusId ?? "Khong co"}</strong>
                  </div>
                  <div>
                    <span>Urgency Score</span>
                    <strong>{selectedRow.urgencyScore ?? "Khong co"}</strong>
                  </div>
                  <div>
                    <span>Victim Count</span>
                    <strong>{selectedRow.victimCount ?? "Khong co"}</strong>
                  </div>
                  <div>
                    <span>Phone</span>
                    <strong>{selectedRow.contactPhone ?? "Khong co"}</strong>
                  </div>
                  <div>
                    <span>Lat - Lng</span>
                    <strong>
                      {detailText(selectedRow.locationLat)}, {detailText(selectedRow.locationLng)}
                    </strong>
                  </div>
                  <div>
                    <span>Area Id</span>
                    <strong>{detailText(selectedRow.areaId)}</strong>
                  </div>
                </div>
              </Card>

              {selectedRow.locationImageUrl ? (
                <div className="summary-detail-gallery-block">
                  <Text className="summary-detail-gallery-title">Location Image</Text>
                  <div className="summary-detail-gallery">
                    <Image
                      src={resolveImageUrl(selectedRow.locationImageUrl)}
                      alt={`Location ${selectedRow.rescueRequestId}`}
                      width={260}
                      height={180}
                      style={{ objectFit: "cover", borderRadius: 14 }}
                    />
                  </div>
                </div>
              ) : null}

              {attachmentImages.length > 0 ? (
                <div className="summary-detail-gallery-block">
                  <Text className="summary-detail-gallery-title">Attachments</Text>
                  <div className="summary-detail-gallery">
                    {attachmentImages.map((item) => (
                      <Image
                        key={item.key}
                        src={item.url}
                        alt={`Attachment ${item.key}`}
                        width={120}
                        height={96}
                        style={{ objectFit: "cover", borderRadius: 14 }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Modal>
      ) : null}
    </Card>
  );
}
