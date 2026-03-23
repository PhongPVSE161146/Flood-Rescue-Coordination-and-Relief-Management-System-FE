import UserManagementContainer from "../../../components/AdminComponents/UserRoleManagement/UserManagementContainer";
import "../../page-layout.css";

export default function UserManagement() {
  return (
    <div className="page-shell">

      <div className="page-shell__header">
        <div className="page-shell__header-left">
          <div className="page-shell__icon" style={{ background: "#fff7ed" }}>
            👥
          </div>
          <div>
            <h2 className="page-shell__title">Quản lý người dùng</h2>
            <p className="page-shell__subtitle">Phân quyền và quản lý tài khoản trong hệ thống</p>
          </div>
        </div>
      </div>

      <div className="page-shell__body">
        <UserManagementContainer />
      </div>

    </div>
  );
}
