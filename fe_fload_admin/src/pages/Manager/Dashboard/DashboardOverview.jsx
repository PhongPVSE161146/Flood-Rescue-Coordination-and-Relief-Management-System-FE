import { useEffect, useState } from "react";
import { message, Row, Col } from "antd";
import "./DashboardOverview.css";

import {
  getDashboardManagement,
} from "../../../../api/axios/ManagerApi/getDashboardManagement";
import {
  getCompletedRequestsCount,
  getDashboardSummaryDetail,
} from "../../../../api/axios/ManagerApi/getDashboardSummaryDetail";

import RescueTrendChart from "../../../components/ManagerComponents/Dashboard/RescueTrendChart";
import SummaryCards from "../../../components/ManagerComponents/Dashboard/SummaryCards";
import RecentActivities from "../../../components/ManagerComponents/Dashboard/RecentActivities";
import CampaignProgress from "../../../components/ManagerComponents/Dashboard/CampaignProgress";
import TeamStatus from "../../../components/ManagerComponents/Dashboard/TeamStatus";
import InventoryAlerts from "../../../components/ManagerComponents/Dashboard/InventoryAlerts";
import SummaryDetailPanel from "../../../components/ManagerComponents/Dashboard/SummaryDetailPanel";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSummaryKey, setActiveSummaryKey] = useState(null);
  const [summaryDetailData, setSummaryDetailData] = useState(null);
  const [summaryDetailLoading, setSummaryDetailLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const normalize = (res) => res?.data || res || {};

  /* ================= LOAD DATA ================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, completedRequests] = await Promise.all([
        getDashboardManagement(),
        getCompletedRequestsCount(),
      ]);

      setData(normalize(dashboardRes));
      setCompletedCount(completedRequests);
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

  const handleSummaryCardClick = async (summaryKey) => {
    try {
      setActiveSummaryKey(summaryKey);
      setSummaryDetailLoading(true);
      setSummaryDetailData(null);

      const res = await getDashboardSummaryDetail(summaryKey);
      const detailData = normalize(res);

      setSummaryDetailData(detailData);
      console.log(`Dashboard summary detail [${summaryKey}]`, detailData);
    } catch (err) {
      console.error(err);
      message.error("Loi tai du lieu chi tiet cho the dashboard");
    } finally {
      setSummaryDetailLoading(false);
    }
  };

  const handleCloseSummaryModal = () => {
    setActiveSummaryKey(null);
    setSummaryDetailData(null);
  };

  if (!data) return null;

  return (
    <div className="dashboard">

      {/* 🔥 SUMMARY */}
      <SummaryCards
        summary={data.summary}
        activeKey={activeSummaryKey}
        onClickItem={handleSummaryCardClick}
        completedValue={completedCount}
      />

      <SummaryDetailPanel
        summaryKey={activeSummaryKey}
        loading={summaryDetailLoading}
        data={summaryDetailData}
        onClear={handleCloseSummaryModal}
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
