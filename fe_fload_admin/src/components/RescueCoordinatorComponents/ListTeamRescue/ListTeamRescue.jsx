import { useEffect, useState } from "react";
import { Tag } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

import {
  getDispatchingRescueRequests,
  getUrgencyLevels
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import "./list-team-rescue-queue.css";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

const MAIN_INCIDENT_OPTIONS = [
  { value: "MedicalEmergency", label: "Y tế khẩn cấp" },
  { value: "TrafficAccident", label: "Tai nạn giao thông" },
  { value: "FireExplosion", label: "Cháy nổ" },
  { value: "DisasterFlood", label: "Ngập lụt" },
];

const timeAgo = (time) => {
  const diff = Math.floor((Date.now() - time) / 60000);
  if (diff <= 0) return "Vừa xong";
  return `${diff} phút trước`;
};

const formatSla = (minutes) => {
  if (!minutes) return "Không xác định";
  if (minutes < 60) return `${minutes} phút`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ`;
  return `${Math.floor(minutes / 1440)} ngày`;
};

export default function ListTeamRescue({ onSelectRequest }) {

  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [, force] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [requestRes, urgencyRes] = await Promise.all([
          getDispatchingRescueRequests(),
          getUrgencyLevels()
        ]);

        const list = Array.isArray(requestRes)
          ? requestRes
          : requestRes?.data || [];

        const urgencyList = urgencyRes || [];

        const levelMap = {};
        urgencyList.forEach((u) => {
          levelMap[u.urgencyLevelId] = u;
        });

        const mapped = list.map((item) => {

          const urgency = levelMap[item.urgencyLevelId];

          const levelColorMap = {
            High: "urgent",
            Medium: "medium",
            Low: "low"
          };

          return {

            id: item.rescueRequestId,
            fullname: item.fullname,
            phone: item.contactPhone,

            location:
              item.locationText ||
              `${item.locationLat}, ${item.locationLng}`,

            lat: item.locationLat,
            lng: item.locationLng,

            createdAt: new Date(item.createdAt).getTime(),

            level: levelColorMap[urgency?.levelName] || "medium",

            urgency:
              priorityTranslate[urgency?.levelName] ||
              urgency?.levelName ||
              "Không xác định",

            incident:
              MAIN_INCIDENT_OPTIONS.find(
                (o) => o.value === item.requestType
              )?.label || item.requestType,

            sla: urgency?.slaMinutes

          };

        });

        setData(mapped);

      }
      catch (error) {
        console.error(error);
      }

    };

    fetchData();

  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      force((v) => v + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  return (

    <aside className="ltr-queue">

      <div className="ltr-queue__header">

        <div>
          <h3>CHỜ ĐIỀU PHỐI ({data.length})</h3>
          <span className="ltr-queue__sub">
            Yêu cầu cần điều phối đội cứu hộ
          </span>
        </div>

        <span className="ltr-queue__live">
          {currentTime}
        </span>

      </div>

      <div className="ltr-queue__list">

        {data.map((item) => (

          <div
            key={item.id}
            className={`ltr-queue__card ltr-queue__card--${item.level}
            ${selectedId === item.id ? "ltr-active" : ""}`}
            onClick={() => {

              setSelectedId(item.id);
              onSelectRequest?.(item);

            }}
          >

            <div className="ltr-queue__top">

              <div>
                <div className="ltr-queue__request-id">
                  Mã yêu cầu: #{item.id}
                </div>

                <span className="ltr-queue__time">
                  {timeAgo(item.createdAt)}
                </span>
              </div>

              <Tag
                color={
                  item.level === "urgent"
                    ? "red"
                    : item.level === "medium"
                    ? "orange"
                    : "green"
                }
              >
                {item.urgency}
              </Tag>

            </div>

            <h4>Họ và tên : {item.fullname}</h4>

            <div className="ltr-queue__phone">
              <PhoneOutlined /> {item.phone}
            </div>

            <div className="ltr-queue__location">
              <EnvironmentOutlined /> {item.location}
            </div>

            <div className="ltr-queue__tags">
              <Tag color="blue">{item.incident}</Tag>
            </div>

            <div className="ltr-queue__sla">
              <ClockCircleOutlined />
              Thời gian xử lý: {formatSla(item.sla)}
            </div>

          </div>

        ))}

      </div>

    </aside>

  );

}