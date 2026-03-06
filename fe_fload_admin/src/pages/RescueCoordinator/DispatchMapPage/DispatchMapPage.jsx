import { useState } from "react";

import ListTeamRescue from "../../../components/RescueCoordinatorComponents/ListTeamRescue/ListTeamRescue";
import DispatchMapView from "../../../components/RescueCoordinatorComponents/DispatchMap/DispatchMapView";

import "./dispatch-map-layout.css";

export default function DispatchMapPage() {

  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="rcd-layout">

      {/* LEFT */}
      <aside className="rcd-layout__sidebar">

        <ListTeamRescue
          onSelectRequest={setSelectedRequest}
        />

      </aside>

      {/* RIGHT */}
      <main className="rcd-layout__main">

        <DispatchMapView
          request={selectedRequest}
        />

      </main>

    </div>
  );
}