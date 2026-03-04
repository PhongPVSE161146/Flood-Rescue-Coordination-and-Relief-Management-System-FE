import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import MainLayout from "../pages/mainLayout";
import RequireAuth from "./PrivateRoute";

/* ================= ADMIN ================= */
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import SystemSetting from "../pages/Admin/Setting/SystemSetting";
import Logs from "../pages/Admin/Logs/LogsChange";
import Permissions from "../pages/Admin/Permissions/Permissions";


/* ================= MANAGER ================= */
import DashboardOverview from "../pages/Manager/Dashboard/DashboardOverview";
import Vehicle from "../pages/Manager/Vehicle/VehicleManagement";

// import ManagerInfo from "../pages/Manager/Info";
import Inventory from "../pages/Manager/Inventory/InventoryManagement";
import Approve from "../pages/Manager/Approval/ApprovalManagement";
import ManagerRescueTeam from "../pages/Manager/RescueTeamManagement/RescueTeamManagement";

/* ================= COORDINATOR ================= */
import CoordinatorDispatch from "../pages/RescueCoordinator/MissionDispatch/MissionDispatch";
import DispatchMapPage from "../pages/RescueCoordinator/DispatchMapPage/DispatchMapPage";
import RescueOperationLayout from "../pages/RescueCoordinator/RescueOperationLayout/RescueOperationLayout";
import RescueReportPage from "../pages/RescueCoordinator/RescueReportPage/RescueReportPage";

/* ================= RESCUE ================= */
import RescueTask from "../pages/RescueTeam/RescueMission/RescueMission";
import MissionDetailRescue from "../pages/RescueTeam/RescueMission/MissionDetailRescue";
import MissionHistory from "../pages/RescueTeam/RescueMission/MissionHistory";
import MissionInProgress from "../pages/RescueTeam/RescueMission/MissionInProgress";
// import RescueHistory from "../pages/Rescue/History";
// import RescueMessages from "../pages/Rescue/Messages";
// import RescueProfile from "../pages/Rescue/Profile";

export default function AppRoutes() {
  const isAuth = localStorage.getItem("isAuth") === "true";
  const role = localStorage.getItem("role");

  const redirectByRole = {
    admin: "/admin/user",
    manager: "/manager",
    coordinator: "/coordinator",
    rescue: "/rescue",
  };

  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="user" replace />} />
        <Route path="user" element={<UserManagement />} />
        <Route path="settings" element={<SystemSetting />} />
        <Route path="logs" element={<Logs />} />
        <Route path="permissions" element={<Permissions />} />
      </Route>

      {/* ================= MANAGER ================= */}
      <Route
        path="/manager"
        element={
          <RequireAuth role="manager">
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="vehicles" element={<Vehicle />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="approve" element={<Approve />} />
        <Route path="rescue-team" element={<ManagerRescueTeam />} />
        {/* <Route path="info" element={<ManagerInfo />} />
        <Route path="warehouse" element={<Warehouse />} />
     
         />  */}
      </Route>

      {/* ================= COORDINATOR ================= */}
      <Route
        path="/coordinator"
        element={
          <RequireAuth role="coordinator">
            <MainLayout />
          </RequireAuth>
        }
      >
      <Route index element={<CoordinatorDispatch />} />
      <Route path="dang" element={< DispatchMapPage/>} />
      <Route path="mina" element={<RescueOperationLayout />} />
      <Route path="reports" element={<RescueReportPage />} />
      </Route>

      {/* ================= RESCUE ================= */}
      <Route
        path="/rescueTeam"
        element={
          <RequireAuth role="rescueteam">
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<RescueTask />} />
        <Route path="mission/:id" element={<MissionDetailRescue />} />
        <Route path="history" element={<MissionHistory />} />
        <Route path="dangcuho" element={<MissionInProgress />} />
       
      </Route>

      {/* ================= ROOT ================= */}
      <Route
        path="/"
        element={
          isAuth && role && redirectByRole[role] ? (
            <Navigate to={redirectByRole[role]} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
