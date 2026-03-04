import MissionList from "../../../components/RescueCoordinatorComponents/MissionList";
import MissionDetail from "../../../components/RescueCoordinatorComponents/Veryfi/MissionDetail";

import "./rc-mission-dispatch.layout.css";

export default function MissionDispatch() {
  return (
    <div className="rc-mission-dispatch">
      {/* ================= LEFT: QUEUE ================= */}
      <aside className="rc-mission-dispatch__sidebar">
        <MissionList />
      </aside>

      {/* ================= RIGHT: DETAIL ================= */}
      <section className="rc-mission-dispatch__detail">
        <MissionDetail />
      </section>
    </div>
  );
}
