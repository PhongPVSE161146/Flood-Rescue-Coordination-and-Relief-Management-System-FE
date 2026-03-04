import ListTeamRescue from "../../../components/RescueCoordinatorComponents/ListTeamRescue/ListTeamRescue";
import DispatchMapView from "../../../components/RescueCoordinatorComponents/DispatchMap/DispatchMapView";

import "./dispatch-map-layout.css";

export default function DispatchMapPage() {
  return (
    <div className="rcd-layout">
      {/* LEFT */}
      <aside className="rcd-layout__sidebar">
        <ListTeamRescue />
      </aside>

      {/* RIGHT */}
      <main className="rcd-layout__main">
        <DispatchMapView />
      </main>
    </div>
  );
}
