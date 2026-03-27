import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag, Divider, Button } from "antd";

import {
  getDistributionById,
  getAllRescueTeams,
  getPeriodicAidCampaignById,
} from "../../../../../api/axios/RescueApi/RescueTask";

import "./DistributionDetail.css";

export default function DistributionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [teamMap, setTeamMap] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= STATUS ================= */

  const normalizeStatus = (status) => {
    const map = {
      "đang chờ": "pending",
      "đã nhận": "accepted",
      "hoàn thành": "completed",
      "từ chối": "rejected",
    };

    return map[status?.toLowerCase()] || status?.toLowerCase();
  };

  const renderStatus = (status) => {
    const map = {
      pending: { color: "gold", text: "🟡 Chờ xác nhận" },
      accepted: { color: "blue", text: "🔵 Đã nhận nhiệm vụ" },
      completed: { color: "green", text: "✔ Hoàn thành nhiệm vụ" },
      rejected: { color: "red", text: "❌ Đã từ chối nhiệm vụ" },
    };

    const key = normalizeStatus(status);
    const s = map[key] || { color: "default", text: status };

    return <Tag color={s.color}>{s.text}</Tag>;
  };

  /* ================= LOAD DATA ================= */

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const [detail, teamRes] = await Promise.all([
        getDistributionById(id),
        getAllRescueTeams(),
      ]);

      /* ===== DEBUG (QUAN TRỌNG) ===== */
      console.log("TEAM RES:", teamRes);

      /* ===== CAMPAIGN ===== */
      const campaignId = detail.campaignId || detail.campaignID;

      if (campaignId) {
        const campaignData = await getPeriodicAidCampaignById(campaignId);
        setCampaign(campaignData);
      }

      /* ===== TEAM MAP FIX CHUẨN ===== */
      // handle mọi kiểu API trả về
      const teams =
        teamRes?.items ||
        teamRes?.data?.items ||
        teamRes?.data ||
        teamRes ||
        [];

      const map = {};

      teams.forEach((t) => {
        const teamId =
          t.rcid ||
          t.rcId ||
          t.rescueTeamId ||
          t.teamId ||
          t.id;

        const teamName =
          t.rcName ||
          t.teamName ||
          t.name ||
          t.rescueTeamName;

        if (teamId) {
          map[String(teamId)] = teamName;
        }
      });

      console.log("TEAM MAP:", map);
      console.log("RESCUE TEAM ID:", detail.rescueTeamId);

      setTeamMap(map);
      setData(detail);

    } catch (err) {
      console.error("FETCH DETAIL ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

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

  const teamName =
    teamMap[String(data.rescueTeamId)] ||
    teamMap[data.rescueTeamId];

  return (
    <div className="detail-page">

      {/* HEADER */}
      <div className="detail-header">
        <Button onClick={() => navigate(-1)}>← Quay lại</Button>

        <h2>Chi tiết cứu trợ: #{data.distributionId}</h2>

        {renderStatus(data.status)}
      </div>

      <Divider />

      {/* MAIN */}
      <div className="detail-box">

        <div className="detail-row">
          <span>Tên chiến dịch</span>
          <b>{campaign?.campaignName || "—"}</b>
        </div>

        {/* <div className="detail-row">
          <span> Khu vực</span>
          <b>{campaign?.areaName || "—"}</b>
        </div> */}

        <div className="detail-row">
          <span> Thời gian</span>
          <b>
            {campaign
              ? `Tháng ${campaign.month} / ${campaign.year}`
              : "—"}
          </b>
        </div>

        <div className="detail-row">
          <span> Người tạo chiến dịch</span>
          <b>{campaign?.adminName || "—"}</b>
        </div>

        <div className="detail-row">
          <span> Thời gian tạo chiến dịch</span>
          <b>
            {campaign?.createdAt
              ? new Date(campaign.createdAt).toLocaleString("vi-VN")
              : "—"}
          </b>
        </div>

        {/* 🔥 TEAM FIXED */}
        <div className="detail-row">
          <span>Tên đội </span>
          <b>
            {teamName || `Team ${data.rescueTeamId}`}
          </b>
        </div>

       

      </div>

      <Divider />

      {/* NOTE */}
      <div className="detail-note-box">
        <h3> Ghi chú</h3>
        <p>{data.note || "Không có ghi chú"}</p>
      </div>

    </div>
  );
}