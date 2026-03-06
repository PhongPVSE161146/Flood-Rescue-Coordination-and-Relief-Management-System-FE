import { useEffect, useMemo, useState } from "react";
import { Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import axios from "axios";
import { getPendingRescueRequests } from "../../../api/axios/CoordinatorApi/RescueRequestApi";
import AuthNotify from "../../utils/Common/AuthNotify";

import "./MissionList.css";

function timeAgo(ts) {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min <= 0) return "Vừa xong";
  return `${min} phút trước`;
}

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" },
];

const convertApiToMission = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    id: item.rescueRequestId,
    name: item.fullname,
    phone: item.contactPhone,

    location:
      item.locationText ||
      `${item.locationLat}, ${item.locationLng}`,

    lat: item.locationLat,
    lng: item.locationLng,

    createdAt: new Date(item.createdAt).getTime(),

    status: item.statusId === 1 ? "pending" : "dispatched",

    incident:
      MAIN_INCIDENT_OPTIONS.find(
        (o) => o.value === item.requestType
      )?.label || item.requestType,

    victimCount: item.victimCount,
    availableRescueTools: item.availableRescueTools,
    specialNeeds: item.specialNeeds,
    detailDescription: item.detailDescription,

    images: item.imageUrls || [],
  }));
};

export default function MissionList({ onSelectMission }) {
  const [missions, setMissions] = useState([]);
  const [tab, setTab] = useState("new");
  const [, forceRender] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  /* ================= LOAD API ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPendingRescueRequests();

        const list = Array.isArray(response)
          ? response
          : response?.data || [];

        setMissions(convertApiToMission(list));
      } catch (error) {
        AuthNotify.error(
          "Không tải được dữ liệu",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchData();
  }, []);

  const reverseGeocode = async (location) => {

    try {
  
      if (!location) return "Không xác định";
  
      const [lng, lat] = location.split(",");
  
      if (!lng || !lat) return "Không xác định";
  
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: { lat, lon: lng, format: "json" }
        }
      );
  
      return res.data.display_name || "Không xác định";
  
    }
    catch {
      return "Không xác định";
    }
  
  };

  /* ================= REALTIME CLOCK ================= */

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= UPDATE TIME AGO ================= */

  useEffect(() => {
    const timer = setInterval(() => {
      forceRender((n) => n + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      if (tab === "new") return m.status === "pending";
      return true;
    });
  }, [missions, tab]);

  /* ================= UI ================= */

  return (
    <aside className="rc-queue">
      {/* HEADER */}

      <div className="rc-queue__header">
        <h3>Hàng đợi ({filtered.length})</h3>

        <span className="rc-queue__live">
          {currentTime}
        </span>
      </div>

      {/* TABS */}

      <div className="rc-queue__tabs">
        <button
          className={tab === "new" ? "active" : ""}
          onClick={() => setTab("new")}
        >
          MỚI NHẤT
        </button>
      </div>

      {/* LIST */}

      <div className="rc-queue__list">
        {filtered.map((m) => (
          <div
            className="rc-queue__card"
            key={m.id}
            onClick={() => onSelectMission(m)}
          >
            <div className="rc-queue__top">
              <span className="rc-queue__id">
                Mã : #{m.id}
              </span>

              <span className="rc-queue__time">
                {timeAgo(m.createdAt)}

                <div className="rc-queue__status">
                  {m.status === "pending" ? (
                    <Tag color="orange">
                      ĐANG CHỜ
                    </Tag>
                  ) : (
                    <Tag color="green">
                      ĐÃ ĐIỀU PHỐI
                    </Tag>
                  )}
                </div>
              </span>
            </div>

            <div className="rc-queue__name">
              Họ và tên : {m.name}
            </div>

            <div className="rc-queue__phone">
              📞 {m.phone}
            </div>

            <div className="rc-queue__location">
              <EnvironmentOutlined />
              {m.location}
            </div>
     

            <div className="rc-queue__tags">
              <Tag color="red">
                {m.incident}
              </Tag>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}