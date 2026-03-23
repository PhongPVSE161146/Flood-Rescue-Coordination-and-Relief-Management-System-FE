import ApprovalManagementContainer from "../../../components/ManagerComponents/Approval/ApprovalManagementContainer";
import "../../page-layout.css";

export default function ApprovalDispatch() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#f0fdf4" }}>
            ✅
          </div>
          <div>
            <h2 className="page-shell__title">Phê duyệt hàng hóa</h2>
            <p className="page-shell__subtitle">Xem xét và duyệt các giao dịch xuất kho chờ xử lý</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <ApprovalManagementContainer />
      </div>

    </div>
  );
}