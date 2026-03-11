import { useMemo, useState, useEffect } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

import {
  getAllRescueTeams,
  getRescueTeamLocation
} from "../../../../api/axios/ManagerApi/rescueTeamApi";

import {
  getAllAssignments,
  confirmDispatchRescueRequest,
  updateRescueAssignment
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import {
  getAllVehicles
} from "../../../../api/axios/ManagerApi/vehicleApi";

import AuthNotify from "../../../utils/Common/AuthNotify";

import "./rc-dispatch-map.css";

export default function DispatchMapView({ request, onDispatchSuccess }) {

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("team");

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [rescueTeams, setRescueTeams] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const teamCount = rescueTeams.length;
  const vehicleCount = vehicles.length;
  /* ================= REQUEST INFO ================= */

  const id = request?.id || request?.requestId || "N/A";
  const fullname = request?.fullname || request?.name || "Không rõ";
  const address = request?.address || request?.location || "Không rõ địa chỉ";
  const status = request?.statusText || "Đang xử lý";

  /* ================= LOAD TEAMS ================= */

  useEffect(() => {

    const fetchTeams = async () => {
  
      try {
  
        const [teamRes, assignmentRes] = await Promise.all([
          getAllRescueTeams(),
          getAllAssignments()
        ]);
  
        const teams = teamRes?.data?.items || [];
  
        const assignments = assignmentRes?.data || assignmentRes || [];
  
        /* team đang được assign */
  
        const busyTeamIds = assignments
          .filter(a => a.assignmentStatus !== "COMPLETED")
          .map(a => a.rescueTeamId);
  
        const filteredTeams = teams.filter(
          team => !busyTeamIds.includes(team.rcid)
        );
  
        const mapped = await Promise.all(
  
          filteredTeams.map(async (team) => {
  
            let lat = request?.lat || 10.8231;
            let lng = request?.lng || 106.6297;
            let address = "Không xác định";
  
            try {
  
              const loc = await getRescueTeamLocation(team.rcid);
  
              const location = loc?.data?.location;
  
              if (location) {
  
                const [lngStr, latStr] = location.split(",");
  
                lat = parseFloat(latStr);
                lng = parseFloat(lngStr);
  
                address = `${lat}, ${lng}`;
  
              }
  
            } catch {}
  
            return {
  
              id: team.rcid,
              name: team.rcName,
              specialty: "Cứu hộ tổng hợp",
              members: team.memberCount || 6,
              address,
              lat,
              lng
  
            };
  
          })
  
        );
  
        setRescueTeams(mapped);
  
      }
      catch (err) {
  
        console.error("Load teams error:", err);
  
      }
  
    };
  
    fetchTeams();
  
  }, [request]);

  /* ================= LOAD VEHICLES ================= */
  useEffect(() => {

    const fetchVehicles = async () => {
  
      try {
  
        const [vehicleRes, assignmentRes] = await Promise.all([
          getAllVehicles(),
          getAllAssignments()
        ]);
  
        const vehicles = vehicleRes?.data || [];
  
        const assignments = assignmentRes?.data || assignmentRes || [];
  
        const busyVehicleIds = assignments
          .filter(a => a.assignmentStatus !== "COMPLETED")
          .map(a => a.vehicleId);
  
        const filteredVehicles = vehicles.filter(
          v => !busyVehicleIds.includes(v.vehicleId)
        );
  
        const mapped = filteredVehicles
          .filter(v =>
            ["ready","available"].includes(
              v.vehicleStatus?.toLowerCase()
            )
          )
          .map(v => ({
  
            id: v.vehicleId,
            name: v.vehicleName,
            type: v.vehicleType,
            capacity: v.vehicleLocation || "Không rõ"
  
          }));
  
        setVehicles(mapped);
  
      }
      catch (err) {
  
        console.error("Load vehicles error:", err);
  
      }
  
    };
  
    fetchVehicles();
  
  }, []);

  /* ================= SELECT ================= */

  const toggleTeam = (id) => {

    setSelectedTeam(id);

  };

  const toggleVehicle = (id) => {

    setSelectedVehicles(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );

  };

  /* ================= MAP ================= */

  const mapUrl = useMemo(() => {

    if (!request) {

      return "https://www.google.com/maps?q=10.8231,106.6297&z=13&output=embed";

    }

    if (!selectedTeam) {

      return `https://www.google.com/maps?q=${request.lat},${request.lng}&z=15&output=embed`;

    }

    const team = rescueTeams.find(t => t.id === selectedTeam);

    if (!team) {

      return `https://www.google.com/maps?q=${request.lat},${request.lng}&z=15&output=embed`;

    }

    return `https://www.google.com/maps?saddr=${team.lat},${team.lng}&daddr=${request.lat},${request.lng}&z=15&output=embed`;

  }, [selectedTeam, rescueTeams, request]);

  /* ================= CONFIRM DISPATCH ================= */

  const canConfirm =
    Boolean(selectedTeam) &&
    selectedVehicles.length > 0;

  const handleConfirmDispatch = async () => {

    if (!canConfirm) {

      AuthNotify.warning(
        "Thiếu thông tin",
        "Vui lòng chọn đội cứu hộ và phương tiện"
      );

      return;

    }

    try {

      /* STEP 1: GET ASSIGNMENTS */

      const res = await getAllAssignments();

      const assignments =
        res?.data || res || [];

      let assignment = assignments.find(
        a => a.rescueRequestId === Number(id)
      );

      /* STEP 2: CREATE ASSIGNMENT (POST) */

      if (!assignment) {

        const created = await confirmDispatchRescueRequest({

          rescueRequestId: Number(id),

          rescueTeamId: Number(selectedTeam),

          vehicleId: Number(selectedVehicles[0]),

          assignedBy: 5

        });

        assignment = created?.data || created;

      }

      /* STEP 3: UPDATE ASSIGNMENT (PUT) */

      else {

        await updateRescueAssignment(
          assignment.assignmentId,
          {

            rescueTeamId: Number(selectedTeam),

            vehicleId: Number(selectedVehicles[0])

          }
        );

      }

      AuthNotify.success(
        "Điều động thành công",
        "Đội cứu hộ đã được điều động"
      );
      onDispatchSuccess?.(id);

      navigate("/coordinator/mina", {

        state: {

          teamId: selectedTeam,
          vehicleIds: selectedVehicles,
          request

        }

      });

    }
    catch (err) {

      console.error("Dispatch error:", err);

      AuthNotify.error(
        "Điều động thất bại",
        err?.response?.data?.message ||
        err?.message ||
        "Không thể điều động"
      );

    }

  };

  /* ================= EMPTY ================= */

  if (!request) {

    return (
      <div style={{
        height:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:22,
        fontWeight:600
      }}>
        Chọn yêu cầu bên trái để xem chi tiết
      </div>
    );

  }

  /* ================= UI ================= */

  return (

    <section className={`rc-map ${collapsed ? "rc-map--expanded" : ""}`}>

      <header className="dispatch-header">

        <div className="dispatch-header-left">

          <h2 className="dispatch-title">
            Yêu cầu #{id}
            <span className="dispatch-status">{status}</span>
          </h2>

        </div>

        <div className="dispatch-header-right">

          <div className="dispatch-user">
            Họ Và Tên : {fullname}
          </div>

          <div className="dispatch-address">
            📍 {address}
          </div>

        </div>

      </header>

      <div className="rc-map__canvas">

        <iframe
          title="rescue-map"
          className="rc-map__iframe"
          src={mapUrl}
          loading="lazy"
        />

      </div>

      <div className={`rc-map__panel ${collapsed ? "is-collapsed" : ""}`}>

        <div className="rc-map__panel-header">

          <div className="rc-map__panel-title">

          <h4>
  LỰA CHỌN NGUỒN LỰC 
  <span className="rc-resource-count">
    ({teamCount} đội | {vehicleCount} xe)
  </span>
</h4>

<span
  className={`rc-map__tab ${tab==="team"?"active":""}`}
  onClick={()=>setTab("team")}
>
  Đội Cứu Hộ ({teamCount})
</span>

<span
  className={`rc-map__tab ${tab==="vehicle"?"active":""}`}
  onClick={()=>setTab("vehicle")}
>
  Phương Tiện ({vehicleCount})
</span>

          </div>

          <button
            className="rc-map__collapse-btn"
            onClick={()=>setCollapsed(!collapsed)}
          >
            {collapsed ? <>MỞ RỘNG <DownOutlined/></> : <>THU GỌN <UpOutlined/></>}
          </button>

        </div>

        <div className="rc-map__teams">

          {tab==="team" && rescueTeams.map(team=>(
            <div
              key={team.id}
              className={`rc-team ${selectedTeam===team.id?"active":""}`}
              onClick={()=>toggleTeam(team.id)}
            >
              <h5>{team.name}</h5>
              <p><b>Chuyên môn:</b> {team.specialty}</p>
              <p><b>Quân số:</b> {team.members}</p>
              <p><b>Vị trí:</b> {team.address}</p>
            </div>
          ))}

          {tab==="vehicle" && vehicles.map(v=>(
            <div
              key={v.id}
              className={`rc-team ${selectedVehicles.includes(v.id)?"active":""}`}
              onClick={()=>toggleVehicle(v.id)}
            >
              <h5>{v.name}</h5>
              <p><b>Loại:</b> {v.type}</p>
              <p><b>Khu vực:</b> {v.capacity}</p>
            </div>
          ))}

        </div>

        <div className="rc-map__footer">

          <span className="rc-map__selected">
            Đã chọn <b>{selectedTeam?1:0}</b> đội và <b>{selectedVehicles.length}</b> xe
          </span>

          <div className="rc-map__actions">

            <Button onClick={()=>navigate(-1)}>
              Hủy bỏ
            </Button>

            <Button
              type="primary"
              disabled={!canConfirm}
              onClick={handleConfirmDispatch}
            >
              ▶ Xác nhận điều động
            </Button>

          </div>

        </div>

      </div>

    </section>

  );

}