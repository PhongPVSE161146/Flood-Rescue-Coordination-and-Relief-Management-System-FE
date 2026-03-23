import RescueTeamManagementContainer from "../../../components/ManagerComponents/RescueTeamRoleManagement/RescueTeamManagementContainer";
import "../../page-layout.css";

export default function RescueTeamManagement() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#fff7ed" }}>
            🚒
          </div>
          <div>
            <h2 className="page-shell__title">Đội cứu hộ</h2>
            <p className="page-shell__subtitle">Quản lý nhân sự và phân công đội cứu hộ trong hệ thống</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <RescueTeamManagementContainer />
      </div>

    </div>
  );
}