import ListTeamCuuHo from "../../../components/RescueCoordinatorComponents/RescueOperation/ListTeamCuuHo";
import RescueOperationDetail from "../../../components/RescueCoordinatorComponents/RescueOperation/RescueOperationDetail";
import "./rescue-operation.layout.css";
import { Outlet } from "react-router-dom";

export default function RescueOperationLayout() {
  return (
    <div className="rc-operation-layout">
      {/* LEFT */}
      <aside className="rc-operation-layout__left">
        <ListTeamCuuHo />
      </aside>

      {/* RIGHT */}
      <main className="rc-operation-layout__right">
        <RescueOperationDetail />
      </main>
      {/* <main className="app-layout__content">
          <Outlet />
        </main> */}
    </div>
  );
}
