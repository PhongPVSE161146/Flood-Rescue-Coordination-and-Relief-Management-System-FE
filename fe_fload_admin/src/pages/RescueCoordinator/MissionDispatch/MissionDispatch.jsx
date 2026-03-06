import { useState } from "react";

import MissionList from "../../../components/RescueCoordinatorComponents/MissionList";
import MissionDetail from "../../../components/RescueCoordinatorComponents/Veryfi/MissionDetail";

import "./rc-mission-dispatch.layout.css";

export default function MissionDispatch() {

  const [selectedMission, setSelectedMission] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectMission = async (mission) => {
    setLoading(true);

    // giả lập load API
    setTimeout(() => {
      setSelectedMission(mission);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="rc-mission-dispatch">

      {/* LEFT */}
      <aside className="rc-mission-dispatch__sidebar">
        <MissionList onSelectMission={handleSelectMission} />
      </aside>

      {/* RIGHT */}
      <section className="rc-mission-dispatch__detail">

      {loading ? (
  <div className="rc-loading">
    {/* <div className="rc-spinner" /> */}
    <p>Đang tải dữ liệu...</p>
  </div>
) : (
  <MissionDetail mission={selectedMission} />
)}

      </section>

    </div>
  );
}