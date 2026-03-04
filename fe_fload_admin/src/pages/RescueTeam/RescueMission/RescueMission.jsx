import MissionListRescue from "../../../components/RescueTeamComponents/MissionListRescue";
import MissionQuickNotify from "../../../components/RescueTeamComponents/MissionQuickNotify";
import "./RescueMission.css";

export default function RescueMission() {
  return (
    <div className="rc-dispatch">
      {/* LEFT – NHIỆM VỤ MỚI */}
      <aside className="rc-dispatch__left">
        <MissionListRescue />
      </aside>

      {/* RIGHT – THÔNG BÁO NHANH */}
      <aside className="rc-dispatch__right">
        <MissionQuickNotify />
      </aside>
    </div>
  );
}
