import { useMemo, useState, useEffect } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

import {
  getAvailableRescueTeams,
  getRescueTeamLocation,
  getRescueTeamVehicles
} from "../../../../api/axios/ManagerApi/rescueTeamApi";

import { getAllVehicles } from "../../../../api/axios/ManagerApi/vehicleApi";
import {getProvinces} from "../../../../api/axios/Auth/authApi";
import {
  confirmDispatchRescueRequest
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import AuthNotify from "../../../utils/Common/AuthNotify";

import "./rc-dispatch-map.css";

export default function DispatchMapView({ request, onDispatchSuccess }) {

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("team");
  const [provinces, setProvinces] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [rescueTeams, setRescueTeams] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const teamCount = rescueTeams.length;
  const vehicleCount = vehicles.length;

  /* ================= USER ================= */

  let user = {};

  try {
    user =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user")) ||
      {};
  } catch {
    user = {};
  }

  const assignedBy = user?.userId || 0;

  /* ================= REQUEST ================= */

  const id = request?.id || request?.requestId || "N/A";
  const fullname = request?.fullname || request?.name || "Không rõ";
  const address = request?.address || "Không rõ địa chỉ";
  const status = request?.statusText || "Đang xử lý";

    /* ================= LOAD PROVINCES ================= */

    useEffect(() => {

      const fetchProvinces = async () => {
  
        try {
  
          const res = await getProvinces();
  
          const list =
            res?.data ||
            res?.data?.items ||
            [];
  
          setProvinces(list);
  
        } catch (err) {
  
          console.error("Load provinces error:", err);
  
        }
  
      };
  
      fetchProvinces();
  
    }, []);
  
    /* ================= MAP AREA ID -> NAME ================= */
  
    const provinceMap = useMemo(() => {

      const map = {};
    
      provinces.forEach(p => {
        map[p.id] = p.name;
      });
    
      return map;
    
    }, [provinces]);




  
  
  /* ================= LOAD TEAMS ================= */




  useEffect(() => {

    const fetchTeams = async () => {

      try {

        const teamRes = await getAvailableRescueTeams();

        const teams = teamRes?.data || [];

        const availableTeams =
          teams.filter(t => t.teamStatus === "on duty");

        const mapped = await Promise.all(

          availableTeams.map(async (team) => {

            let lat = request?.lat || 10.8231;
            let lng = request?.lng || 106.6297;
            let address = "Không xác định";

            try {

              const loc = await getRescueTeamLocation(team.rescueTeamId);

              const location = loc?.data?.location;

              if (location) {

                const [lngStr, latStr] = location.split(",");

                lat = parseFloat(latStr);
                lng = parseFloat(lngStr);

                address = `${lat}, ${lng}`;

              }

            } catch {}

            return {

              id: team.rescueTeamId,
              name: team.teamName,
              status: team.teamStatus,
              address,
              lat,
              lng,
              areaId: team.areaId,

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

  }, [request, provinces]);

  /* ================= LOAD VEHICLES ================= */

  useEffect(() => {

    const fetchVehicles = async () => {

      if (!selectedTeam) {
        setVehicles([]);
        return;
      }

      try {

        const [teamVehicleRes, vehicleRes] = await Promise.all([
          getRescueTeamVehicles(selectedTeam),
          getAllVehicles()
        ]);

        const teamVehicles =
          teamVehicleRes?.data?.items || [];

        const allVehicles =
          vehicleRes?.data || [];

        const mapped = teamVehicles
          .filter(v => v.isActive === true)
          .map(tv => {

            const vehicleDetail =
              allVehicles.find(v => v.vehicleId === tv.vehicleId);

            return {

              id: tv.vehicleId,
              name: vehicleDetail?.vehicleName || `Xe #${tv.vehicleId}`,
              type: vehicleDetail?.vehicleType || "Rescue Vehicle",
              location: vehicleDetail?.vehicleLocation || "Không xác định",
              status: vehicleDetail?.vehicleStatus || "ready"

            };

          });

        setVehicles(mapped);

      }
      catch (err) {

        console.error("Load vehicles error:", err);

      }

    };

    fetchVehicles();

  }, [selectedTeam]);

  /* ================= SELECT TEAM ================= */

  const toggleTeam = (id) => {

    setSelectedTeam(id);
    setSelectedVehicles([]);

  };

  /* ================= SELECT VEHICLE ================= */

  const toggleVehicle = (id) => {

    setSelectedVehicles(prev => {

      if (prev.includes(id)) {

        return prev.filter(v => v !== id);

      }

      if (prev.length >= 3) {

        AuthNotify.warning(
          "Giới hạn phương tiện",
          "Chỉ được chọn tối đa 3 phương tiện"
        );

        return prev;

      }

      return [...prev, id];

    });

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

  /* ================= CONFIRM ================= */

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

      const payload = {

        rescueRequestId: Number(id),
        rescueTeamId: Number(selectedTeam),
        vehicleId: Number(selectedVehicles[0]),
        assignedBy: Number(assignedBy)

      };

      await confirmDispatchRescueRequest(payload);

      setRescueTeams(prev =>
        prev.filter(t => t.id !== selectedTeam)
      );

      setVehicles(prev =>
        prev.filter(v =>
          !selectedVehicles.includes(v.id)
        )
      );

      setSelectedTeam(null);
      setSelectedVehicles([]);

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

  if (!request) {

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 600,
          color: "#555"
        }}
      >
        Chọn yêu cầu bên trái để xem chi tiết
      </div>
    );

  }

  return (

    <section className={`rc-map ${collapsed ? "rc-map--expanded" : ""}`}>

      <header className="dispatch-header">

        <div className="dispatch-header-left">

          <h2 className="dispatch-title">
            Mã yêu cầu: #{id}
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
              className={`rc-map__tab ${tab === "team" ? "active" : ""}`}
              onClick={() => setTab("team")}
            >
              Đội Cứu Hộ ({teamCount})
            </span>

            <span
              className={`rc-map__tab ${tab === "vehicle" ? "active" : ""}`}
              onClick={() => setTab("vehicle")}
            >
              Phương Tiện ({vehicleCount})
            </span>

          </div>

          <button
            className="rc-map__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed
              ? <>MỞ RỘNG <DownOutlined/></>
              : <>THU GỌN <UpOutlined/></>}
          </button>

        </div>

        <div className="rc-map__teams">

          {tab === "team" && rescueTeams.map(team => (

            <div
              key={team.id}
              className={`rc-team ${selectedTeam === team.id ? "active" : ""}`}
              onClick={() => toggleTeam(team.id)}
            >

              <h5>{team.name}</h5>

              <p><b>Trạng thái:</b> 🟢 Sẵn sàng</p>

              {/* <p><b>Vị trí:</b> {team.address}</p>
              <p>
  <b>Khu Vực:</b> {provinces.find(p => p.id === team.areaId)?.name || "Không xác định"}
</p> */}

            </div>

          ))}

          {tab === "vehicle" && vehicles.map(v => (

            <div
              key={v.id}
              className={`rc-team ${selectedVehicles.includes(v.id) ? "active" : ""}`}
              onClick={() => toggleVehicle(v.id)}
            >

              <h5>{v.name}</h5>

              <p><b>Loại:</b> {v.type}</p>

              <p><b>Trạng thái:</b> {v.status}</p>

              <p><b>Khu vực:</b> {v.location}</p>

            </div>

          ))}

        </div>

        <div className="rc-map__footer">

          <span className="rc-map__selected">
            Đã chọn <b>{selectedTeam ? 1 : 0}</b> đội và <b>{selectedVehicles.length}</b> xe
          </span>

          <div className="rc-map__actions">

            <Button onClick={() => navigate(-1)}>
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