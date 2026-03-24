import PeriodicAidManagementContainer from "../../../components/ManagerComponents/PeriodicAid/PeriodicAidManagementContainer";
import "../../page-layout.css";

export default function PeriodicAidManagement() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#fff1f2" }}>
            🩺
          </div>
          <div>
            <h2 className="page-shell__title">Hỗ trợ định kỳ</h2>
            <p className="page-shell__subtitle">Kế hoạch và lịch trình phân phối nhu yếu phẩm định kỳ</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <PeriodicAidManagementContainer />
      </div>

    </div>
  );
}