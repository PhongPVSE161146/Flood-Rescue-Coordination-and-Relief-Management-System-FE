import { useState } from "react";

import ListTeamRescue from "../../../components/RescueCoordinatorComponents/ListTeamRescue/ListTeamRescue";
import DispatchMapView from "../../../components/RescueCoordinatorComponents/DispatchMap/DispatchMapView";

import "./dispatch-map-layout.css";

export default function DispatchMapPage() {

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [removedRequests, setRemovedRequests] = useState([]);

  const handleDispatchSuccess = (requestId) => {

    setRemovedRequests(prev => [...prev, requestId]);
    setSelectedRequest(null);

  };

  return (

    <div className="rcd-layout">

      <aside className="rcd-layout__sidebar">

        <ListTeamRescue
          onSelectRequest={setSelectedRequest}
      
        />

      </aside>

      <main className="rcd-layout__main">

        <DispatchMapView
          request={selectedRequest}
          onDispatchSuccess={handleDispatchSuccess}
        />

      </main>

    </div>

  );

}