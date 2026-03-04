import { useMemo, useState } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  rescueTeams,
  vehicles,
  INCIDENT_LOCATION,
} from "./rc-dispatch.data";

import "./rc-dispatch-map.css";

export default function DispatchMapView() {
  /* ================= NAVIGATE ================= */
  const navigate = useNavigate(); // ✅ FIX QUAN TRỌNG

  /* ================= STATE ================= */
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("team");

  const [selectedTeam, setSelectedTeam] = useState(null); // ✅ CHỈ 1 ĐỘI
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  /* ================= SELECT ================= */
  const toggleTeam = (id) => {
    setSelectedTeam(id); // luôn chỉ 1 đội
  };

  const toggleVehicle = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  /* ================= MAP URL ================= */
  const mapUrl = useMemo(() => {
    // Chưa chọn đội → map hiện trường
    if (!selectedTeam) {
      return `https://www.google.com/maps?q=${INCIDENT_LOCATION.lat},${INCIDENT_LOCATION.lng}&z=15&output=embed`;
    }

    const team = rescueTeams.find(
      (t) => t.id === selectedTeam
    );

    if (!team) {
      return `https://www.google.com/maps?q=${INCIDENT_LOCATION.lat},${INCIDENT_LOCATION.lng}&z=15&output=embed`;
    }

    // ✅ Vẽ đường đội → hiện trường (iframe-safe)
    return `https://www.google.com/maps?saddr=${team.lat},${team.lng}&daddr=${INCIDENT_LOCATION.lat},${INCIDENT_LOCATION.lng}&z=15&output=embed`;
  }, [selectedTeam]);

  /* ================= COUNTS ================= */
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
      },
    });
  };

  /* ================= RENDER ================= */
  return (
    <section
      className={`rc-map ${
        collapsed ? "rc-map--expanded" : ""
      }`}
    >
      {/* ================= MAP ================= */}
      <div className="rc-map__canvas">
        <iframe
          title="rescue-map"
          className="rc-map__iframe"
          src={mapUrl}
          loading="lazy"
        />
      </div>

      {/* ================= PANEL ================= */}
      <div
        className={`rc-map__panel ${
          collapsed ? "is-collapsed" : ""
        }`}
      >
        {/* ===== HEADER ===== */}
        <div className="rc-map__panel-header">
          <div className="rc-map__panel-title">
            <h4>LỰA CHỌN NGUỒN LỰC</h4>

            <span className="rc-map__badge">
              {availableCount} SẴN SÀNG
            </span>

            <span
              className={`rc-map__tab ${
                tab === "team" ? "active" : ""
              }`}
              onClick={() => setTab("team")}
            >
              Đội Cứu Hộ
            </span>

            <span
              className={`rc-map__tab ${
                tab === "vehicle" ? "active" : ""
              }`}
              onClick={() => setTab("vehicle")}
            >
              Phương Tiện
            </span>
          </div>

          <button
            className="rc-map__collapse-btn"
            onClick={() =>
              setCollapsed(!collapsed)
            }
          >
            {collapsed ? (
              <>
                MỞ RỘNG <DownOutlined />
              </>
            ) : (
              <>
                THU GỌN <UpOutlined />
              </>
            )}
          </button>
        </div>

        {/* ================= LIST ================= */}
        <div className="rc-map__teams">
          {/* ===== TEAMS ===== */}
          {tab === "team" &&
            rescueTeams.map((team) => (
              <div
                key={team.id}
                className={`rc-team ${
                  selectedTeam === team.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleTeam(team.id)
                }
              >
                <h5>{team.name}</h5>
                <span className="rc-team__status">
                  ● SẴN SÀNG
                </span>

                <p>
                  <b>Chuyên môn:</b>{" "}
                  {team.specialty}
                </p>
                <p>
                  <b>Quân số:</b>{" "}
                  {team.members}
                </p>

                {/* ✅ ĐỊA CHỈ THẬT */}
                <p>
                  <b>Vị trí:</b>{" "}
                  {team.address}
                </p>

                <div className="rc-team__meta">
                  <span>ETA: {team.eta}</span>
                  <span>{team.distance}</span>
                </div>
              </div>
            ))}

          {/* ===== VEHICLES ===== */}
          {tab === "vehicle" &&
            vehicles.map((v) => (
              <div
                key={v.id}
                className={`rc-team ${
                  selectedVehicles.includes(v.id)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleVehicle(v.id)
                }
              >
                <h5>{v.name}</h5>
                <span className="rc-team__status">
                  ● SẴN SÀNG
                </span>
                <p>
                  <b>Loại:</b> {v.type}
                </p>
                <p>
                  <b>Sức chứa:</b>{" "}
                  {v.capacity}
                </p>
              </div>
            ))}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="rc-map__footer">
          <span className="rc-map__selected">
            Đã chọn{" "}
            <b>{selectedTeam ? 1 : 0}</b>{" "}
            Đội và{" "}
            <b>{selectedVehicles.length}</b>{" "}
            Phương tiện
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
