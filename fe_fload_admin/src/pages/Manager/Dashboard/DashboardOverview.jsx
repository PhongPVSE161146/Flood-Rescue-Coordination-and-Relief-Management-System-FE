import DashboardOverviewContainer from "../../../components/ManagerComponents/Dashboard/DashboardOverviewContainer";
import "../../page-layout.css";

export default function DashboardOverview() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#eff6ff" }}>
            📊
          </div>
          <div>
            <h2 className="page-shell__title">Tổng quan hệ thống</h2>
            <p className="page-shell__subtitle">Dashboard thống kê hoạt động cứu hộ theo thời gian thực</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <DashboardOverviewContainer />
      </div>

    </div>
  );
}