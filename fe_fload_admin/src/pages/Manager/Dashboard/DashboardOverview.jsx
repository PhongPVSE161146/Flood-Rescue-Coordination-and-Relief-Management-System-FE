import { useEffect, useState } from "react";
import { message, Row, Col } from "antd";
import "./DashboardOverview.css";

import { getDashboardManagement } from "../../../../api/axios/ManagerApi/getDashboardManagement";

import RescueTrendChart from "../../../components/ManagerComponents/Dashboard/RescueTrendChart";
import SummaryCards from "../../../components/ManagerComponents/Dashboard/SummaryCards";
import RecentActivities from "../../../components/ManagerComponents/Dashboard/RecentActivities";
import CampaignProgress from "../../../components/ManagerComponents/Dashboard/CampaignProgress";
import TeamStatus from "../../../components/ManagerComponents/Dashboard/TeamStatus";
import InventoryAlerts from "../../../components/ManagerComponents/Dashboard/InventoryAlerts";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalize = (res) => res?.data || res || {};

  /* ================= LOAD DATA ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getDashboardManagement();

      setData(normalize(res));
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return null;

  return (
    <div className="dashboard">

      {/* 🔥 SUMMARY */}
      <SummaryCards
        summary={data.summary}
        loading={loading}
      />

      {/* 🔥 CHART */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <RescueTrendChart data={data.rescueTrends} />
        </Col>
      </Row>

      {/* 🔥 TEAM + STOCK */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <TeamStatus data={data.teamStatusOverview} />
        </Col>

        <Col span={12}>
          <InventoryAlerts data={data.inventoryAlerts} />
        </Col>
      </Row>

      {/* 🔥 CAMPAIGN (FULL WIDTH - FIX LỆCH) */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <CampaignProgress data={data.campaignProgress} />
        </Col>
      </Row>

      {/* 🔥 ACTIVITY */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <RecentActivities data={data.recentActivities} />
        </Col>
      </Row>

    </div>
  );
}