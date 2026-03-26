import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag, Divider, Button } from "antd";

import {
  getDistributionById,
  getAllRescueTeams
} from "../../../../../api/axios/RescueApi/RescueTask";

import "./DistributionDetail.css";

export default function DistributionDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamMap, setTeamMap] = useState({});

  /* ================= LOAD ================= */

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const [detail, teamRes] = await Promise.all([
        getDistributionById(id),
        getAllRescueTeams()
      ]);

      // map team
      const teams = teamRes?.data?.items || [];
      const map = {};
      teams.forEach(t => {
        map[t.rcid] = t.rcName;
      });

      setTeamMap(map);
      setData(detail);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  /* ================= STATUS ================= */

  const renderStatus = (status) => {
    const map = {
      pending: { color: "gold", text: "Đang chờ" },
      completed: { color: "green", text: "Hoàn thành" },
    };

    const s = status?.toLowerCase();
    const d = map[s] || { color: "default", text: status };

    return <Tag color={d.color}>{d.text}</Tag>;
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <p style={{ textAlign: "center" }}>Không có dữ liệu</p>;
  }

  return (
    <div className="detail-page">

      <div className="detail-header">

        <Button onClick={() => navigate(-1)}>
          ← Quay lại
        </Button>

        <h2>Chi tiết cứu trợ #{data.distributionId}</h2>

        {renderStatus(data.status)}

      </div>

      <Divider />

      <div className="detail-box">

        <div className="detail-row">
          <span>🎯 Chiến dịch</span>
          <b>{data.campaignId}</b>
        </div>

        <div className="detail-row">
          <span>🚑 Đội</span>
          <b>
            {teamMap[data.rescueTeamId] ||
              `Team ${data.rescueTeamId}`}
          </b>
        </div>

        <div className="detail-row">
          <span>⏱ Thời gian</span>
          <b>
            {new Date(data.distributedAt).toLocaleString("vi-VN")}
          </b>
        </div>

      </div>

      <Divider />

      <div className="detail-note-box">
        <h3>📝 Ghi chú</h3>
        <p>{data.note || "Không có ghi chú"}</p>
      </div>

    </div>
  );
}