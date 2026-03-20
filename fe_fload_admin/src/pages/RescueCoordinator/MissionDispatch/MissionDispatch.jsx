import { useState } from "react";
import MissionList from "../../../components/RescueCoordinatorComponents/MissionList";
import MissionDetail from "../../../components/RescueCoordinatorComponents/Veryfi/MissionDetail";
import { getRescueRequestById } from "../../../../api/axios/RescueRequests/rescueRequestsApi";
import AuthNotify from "../../../utils/Common/AuthNotify";

import "./rc-mission-dispatch.layout.css";

export default function MissionDispatch() {

  const [selectedMission, setSelectedMission] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectMission = async (mission) => {
    if (!mission?.id) return;
    
    try {
      setLoading(true);
      const data = await getRescueRequestById(mission.id);
      setSelectedMission(data || mission);
    } catch (error) {
      console.error("Error fetching mission detail:", error);
      AuthNotify.error("Không thể tải chi tiết yêu cầu");
      // Fallback to the mission object from the list if API fails
      setSelectedMission(mission);
    } finally {
      setLoading(false);
    }
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