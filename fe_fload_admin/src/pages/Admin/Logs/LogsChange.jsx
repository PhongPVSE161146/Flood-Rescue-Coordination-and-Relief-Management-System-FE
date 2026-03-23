import LogsContainer from "../../../components/AdminComponents/Logs/LogsContainer";
import "../../page-layout.css";

export default function Logs() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#eff6ff" }}>
            📋
          </div>
          <div>
            <h2 className="page-shell__title">Nhật ký hệ thống</h2>
            <p className="page-shell__subtitle">Lịch sử thao tác và audit log cho các yêu cầu cứu hộ</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <LogsContainer />
      </div>

    </div>
  );
}
