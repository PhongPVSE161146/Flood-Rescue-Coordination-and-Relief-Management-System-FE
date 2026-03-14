import { useState } from "react";
import ListTeamCuuHo from "../../../components/RescueCoordinatorComponents/RescueOperation/ListTaskTeamSupport/ListTeamCuuHo";
import RescueOperationDetail from "../../../components/RescueCoordinatorComponents/RescueOperation/ListTaskTeamSupportDetail/RescueOperationDetail";
import "./rescue-operation.layout.css";

export default function RescueOperationLayout() {

  const [selectedAssignmentId,setSelectedAssignmentId] = useState(null);

  return (
    <div className="rc-operation-layout">

      {/* LEFT */}
      <aside className="rc-operation-layout__left">
        <ListTeamCuuHo
          onSelectMission={setSelectedAssignmentId}
        />
      </aside>

      {/* RIGHT */}
      <main className="rc-operation-layout__right">
        <RescueOperationDetail
          assignmentId={selectedAssignmentId}
        />
      </main>

    </div>
  );
}