import { useMemo, useState, useEffect } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  getAllRescueTeams,
  getRescueTeamLocation
} from "../../../../api/axios/ManagerApi/rescueTeamApi";

import {
  getAllVehicles
} from "../../../../api/axios/ManagerApi/vehicleApi";

import "./rc-dispatch-map.css";

export default function DispatchMapView({ request }) {

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("team");

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [rescueTeams, setRescueTeams] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  /* ================= LOAD TEAMS ================= */

  useEffect(() => {

    const fetchTeams = async () => {

      try {

        const res = await getAllRescueTeams();
        const teams = res?.data?.items || [];

        const mappedTeams = await Promise.all(

          teams.map(async (team) => {

            let lat = request?.lat || 10.8231;
            let lng = request?.lng || 106.6297;
            let address = "Không xác định";

            try {

              const locRes = await getRescueTeamLocation(team.rcid);
              const location = locRes?.data?.location;

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
              members: 6,
              address,
              lat,
              lng,
              eta: "10 phút",
              distance: "3 km"

            };

          })

        );

        setRescueTeams(mappedTeams);

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

        const res = await getAllVehicles();
        const list = res?.data || [];

        const mappedVehicles = list.map((v) => ({

          id: v.vehicleId,
          name: v.vehicleName,
          type: v.vehicleType,
          capacity: v.vehicleLocation || "Không rõ",
          status: v.vehicleStatus?.toLowerCase() || ""

        }));

        setVehicles(mappedVehicles);

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

    setSelectedVehicles((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
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

    const team = rescueTeams.find(
      (t) => t.id === selectedTeam
    );

    if (!team) {
      return `https://www.google.com/maps?q=${request.lat},${request.lng}&z=15&output=embed`;
    }

    return `https://www.google.com/maps?saddr=${team.lat},${team.lng}&daddr=${request.lat},${request.lng}&z=15&output=embed`;

  }, [selectedTeam, rescueTeams, request]);

  /* ================= COUNT ================= */

  const availableCount =
    tab === "team"
      ? rescueTeams.length
      : vehicles.length;

  const canConfirm =
    Boolean(selectedTeam) &&
    selectedVehicles.length > 0;

  /* ================= CONFIRM ================= */

  const handleConfirmDispatch = () => {

    if (!canConfirm) return;

    navigate("/coordinator/mina", {
      state: {
        teamId: selectedTeam,
        vehicleIds: selectedVehicles,
        request
      }
    });

  };

  /* ================= VEHICLE STATUS ================= */

  const getVehicleStatus = (status) => {

    if (status === "ready")
      return "● SẴN SÀNG";

    if (status === "maintenance")
      return "● BẢO TRÌ";

    if (status === "in use")
      return "● ĐANG SỬ DỤNG";

    if (status === "broken")
      return "● HỎNG";

    return "● KHÔNG XÁC ĐỊNH";

  };

  /* ================= UI ================= */

  return (

    <section className={`rc-map ${collapsed ? "rc-map--expanded" : ""}`}>

      {/* MAP */}

      <div className="rc-map__canvas">

        <iframe
          title="rescue-map"
          className="rc-map__iframe"
          src={mapUrl}
          loading="lazy"
        />

      </div>

      {/* PANEL */}

      <div className={`rc-map__panel ${collapsed ? "is-collapsed" : ""}`}>

        <div className="rc-map__panel-header">

          <div className="rc-map__panel-title">

            <h4>LỰA CHỌN NGUỒN LỰC</h4>

            <span className="rc-map__badge">
              {availableCount} SẴN SÀNG
            </span>

            <span
              className={`rc-map__tab ${tab === "team" ? "active" : ""}`}
              onClick={() => setTab("team")}
            >
              Đội Cứu Hộ
            </span>

            <span
              className={`rc-map__tab ${tab === "vehicle" ? "active" : ""}`}
              onClick={() => setTab("vehicle")}
            >
              Phương Tiện
            </span>

          </div>

          <button
            className="rc-map__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? <>MỞ RỘNG <DownOutlined /></>
              : <>THU GỌN <UpOutlined /></>}
          </button>

        </div>

        {/* LIST */}

        <div className="rc-map__teams">

          {tab === "team" &&
            rescueTeams.map((team) => (

              <div
                key={team.id}
                className={`rc-team ${selectedTeam === team.id ? "active" : ""}`}
                onClick={() => toggleTeam(team.id)}
              >

                <h5>{team.name}</h5>

                <p><b>Chuyên môn:</b> {team.specialty}</p>
                <p><b>Quân số:</b> {team.members}</p>
                <p><b>Vị trí:</b> {team.address}</p>

                <span className="rc-team__status">
                  ● SẴN SÀNG
                </span>

                <div className="rc-team__meta">
                  <span>ETA: {team.eta}</span>
                  <span>{team.distance}</span>
                </div>

              </div>

            ))}

          {tab === "vehicle" &&
            vehicles.map((v) => (

              <div
                key={v.id}
                className={`rc-team ${selectedVehicles.includes(v.id) ? "active" : ""}`}
                onClick={() => toggleVehicle(v.id)}
              >

                <h5>Phương tiện : {v.name}</h5>

                <p><b>Loại:</b> {v.type}</p>
                <p><b>Khu vực:</b> {v.capacity}</p>

                <span className="rc-team__status">
                  {getVehicleStatus(v.status)}
                </span>

              </div>

            ))}

        </div>

        {/* FOOTER */}

        <div className="rc-map__footer">

          <span className="rc-map__selected">
            Đã chọn <b>{selectedTeam ? 1 : 0}</b> Đội và <b>{selectedVehicles.length}</b> Phương tiện
          </span>

          <div className="rc-map__actions">

            <button className="btn-cancel">
              Hủy bỏ
            </button>

            <button
              className="btn-confirm"
              disabled={!canConfirm}
              onClick={handleConfirmDispatch}
            >
              ▶ Xác nhận điều động
            </button>

          </div>

        </div>

      </div>

    </section>

  );

}
