import { useEffect, useMemo, useState } from "react";
import { Tag, Select } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

import {
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";
// import AuthNotify from "../../../utils/Common/AuthNotify";
import { getRequestStatuses } from "../../../../api/axios/Auth/authApi";
import "./list-team-rescue-queue.css";

const { Option } = Select;

/* ================= TIME AGO ================= */

function timeAgo(ts) {

  const diff = Date.now() - ts;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  return new Date(ts).toLocaleDateString("vi-VN");

}

/* ================= SLA ================= */

function formatSla(minutes) {

  if (!minutes) return "Không xác định";

  if (minutes < 60)
    return `${minutes} phút`;

  if (minutes < 1440)
    return `${Math.floor(minutes / 60)} giờ`;

  return `${Math.floor(minutes / 1440)} ngày`;

}
/* ================= PARSE TIME (FIX TIMEZONE) ================= */

function parseVietnamTime(dateString) {

  if (!dateString) return Date.now();

  /* nếu đã có timezone thì dùng luôn */

  if (
    dateString.includes("Z") ||
    dateString.includes("+")
  ) {
    return new Date(dateString).getTime();
  }

  /* nếu chưa có timezone thì thêm +07:00 */

  return new Date(dateString + "+07:00").getTime();

}

/* ================= FILTER TIME ================= */

const isExpired = (verifiedAt) => {
  const diff = (Date.now() - verifiedAt) / 60000;
  return diff > 60;
};

const isNew = (verifiedAt) => {
  const diff = (Date.now() - verifiedAt) / 60000;
  return diff <= 60;
};

/* ================= INCIDENT ================= */

const REQUEST_TYPES = [
  "cứu hộ khẩn cấp",
  "hỗ trợ cứu trợ",
  "cứu hộ ngập lụt",
  "cứu hộ lũ quét",
  "cứu hộ sạt lở",
  "hỗ trợ sơ tán",
  "hỗ trợ y tế khẩn cấp",
  "tiếp tế lương thực",
  "tìm kiếm cứu nạn",
  "cứu người mắc kẹt",
  "đưa đến nơi trú ẩn"
];

const MAIN_INCIDENT_OPTIONS = REQUEST_TYPES.map(t => ({
  value: t,
  label: t
}));

/* ================= PRIORITY ================= */

const priorityTranslate = {
  "Khẩn cấp": "Khẩn cấp",
  "ưu tiên": "ưu tiên",
  "Cần hỗ trợ": "Cần hỗ trợ"
};

const URGENCY_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Khẩn cấp", value: "Khẩn cấp" },
  { label: "Ưu tiên", value: "Ưu tiên" },
  { label: "Cần hỗ trợ", value: "Cần hỗ trợ" }
];

/* ================= CONVERT API ================= */

const convertApiToMission = (data = [], urgencyList = [], statuses = []) => {

  const levelMap = {};
  const statusMap = {};

statuses.forEach((s) => {
  statusMap[s.statusId] = s;
});

  urgencyList.forEach((u) => {
    levelMap[u.urgencyLevelId] = u;
  });

  const levelColorMap = {
    High: "urgent",
    Medium: "medium",
    Low: "low"
  };

  return data.map((item) => {

    const urgency = levelMap[item.urgencyLevelId];
    

    return {

      id: item.rescueRequestId,

      fullname: item.fullname || item.fullName || "Không rõ",

      phone: item.contactPhone || "Không có",

      location:
        item.locationText ||
        `${item.locationLat}, ${item.locationLng}`,

      address: item.address || "Không xác định",

      lat: item.locationLat,
      lng: item.locationLng,

      verifiedAt: parseVietnamTime(item.verifiedAt),

      level: levelColorMap[urgency?.levelName] || "medium",

      urgency:
        priorityTranslate[urgency?.levelName] ||
        urgency?.levelName ||
        "Không xác định",

      incident:
        MAIN_INCIDENT_OPTIONS.find(
          (o) => o.value === item.requestType
        )?.label || item.requestType || "Không rõ",

      sla: urgency?.slaMinutes || 0,
      statusText: statusMap[item.statusId]?.description || "",
    };

  });

};

/* ================= COMPONENT ================= */

export default function ListTeamRescue({ onSelectRequest }) {

  const [missions, setMissions] = useState([]);
  const [tab, setTab] = useState("new");

  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(null);

  const [selectedId, setSelectedId] = useState(null);

  const [, forceRender] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState({
    requestType: "",
    address: "",
    urgency: ""
  });

  useEffect(() => {

    const loadStatuses = async () => {
  
      try {
  
        const res = await getRequestStatuses();
  
        const list = Array.isArray(res)
          ? res
          : res?.data || [];
  
        setStatuses(list);
  
      } catch (err) {
  
        console.error("LOAD STATUS ERROR:", err);
  
      }
  
    };
  
    loadStatuses();
  
  }, []);
  /* ================= LOAD API ================= */

  const fetchData = async () => {

    try {

      setLoading(true);

      const [requestRes, urgencyRes] = await Promise.all([
        getPendingRescueRequests(),
        getUrgencyLevels()
      ]);

      const raw = Array.isArray(requestRes)
  ? requestRes
  : requestRes?.data || [];

/* CHỈ LẤY VERIFIED */

const list = raw.filter(
  r => Number(r.statusId) === 2
);

      const urgencyList = urgencyRes || [];

      setMissions(
        convertApiToMission(list, urgencyList, statuses)
      );

    }
    catch (error) {

      console.error(error);

    }
    finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= ADDRESS OPTIONS ================= */

  const ADDRESS_OPTIONS = useMemo(() => {

    const unique = [...new Set(
      missions.map(m => m.address).filter(Boolean)
    )];

    return unique.map(addr => ({
      label: addr,
      value: addr
    }));

  }, [missions]);

  /* ================= CHANGE TAB ================= */

  const changeTab = (key) => {

    setTabLoading(key);

    setTimeout(() => {

      setTab(key);

      if (key !== "merge") {
        setFilters({
          requestType: "",
          address: "",
          urgency: ""
        });
      }

      setTabLoading(null);

    }, 200);

  };

  /* ================= CLOCK ================= */

  useEffect(() => {

    const updateTime = () => {

      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );

    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);

  }, []);

  /* ================= TIME AGO UPDATE ================= */

  useEffect(() => {

    const timer = setInterval(() => {
      forceRender(n => n + 1);
    }, 60000);

    return () => clearInterval(timer);

  }, []);
  useEffect(() => {
    if (statuses.length > 0) {
      fetchData();
    }
  }, [statuses]);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    let list = [...missions];

    if (tab === "new")
      list = list.filter(m => isNew(m.verifiedAt));

    if (tab === "expired")
      list = list.filter(m => isExpired(m.verifiedAt));

    if (tab === "merge") {

      if (filters.requestType)
        list = list.filter(m =>
          m.incident?.toLowerCase()
          .includes(filters.requestType.toLowerCase())
        );

      if (filters.address)
        list = list.filter(m => m.address === filters.address);

      if (filters.urgency)
        list = list.filter(m => m.urgency === filters.urgency);

    }

    list.sort((a, b) => b.verifiedAt - a.verifiedAt);

    return list;

  }, [missions, tab, filters]);

  /* ================= UI ================= */

  return (

    <aside className="ltr-queue">

      <div className="ltr-queue__header">

        <div>

          <h3>CHỜ ĐIỀU PHỐI ({filtered.length})</h3>

          <span className="ltr-queue__sub">
            Yêu cầu cần điều phối đội cứu hộ
          </span>

        </div>

        <span className="ltr-queue__live">
          {currentTime}
        </span>

      </div>

      {/* TABS */}

      <div className="rc-queue__tabs">

        <button
          disabled={tabLoading !== null}
          className={tab === "new" ? "active" : ""}
          onClick={() => changeTab("new")}
        >
          {tabLoading === "new" ? "Loading..." : "MỚI NHẤT"}
        </button>

        <button
          disabled={tabLoading !== null}
          className={tab === "expired" ? "active" : ""}
          onClick={() => changeTab("expired")}
        >
          {tabLoading === "expired" ? "Loading..." : "QUÁ HẠN"}
        </button>

        <button
          disabled={tabLoading !== null}
          className={tab === "merge" ? "active" : ""}
          onClick={() => changeTab("merge")}
        >
          {tabLoading === "merge" ? "Loading..." : "GỘP YÊU CẦU"}
        </button>

      </div>

      {/* FILTER */}

      {tab === "merge" && (

        <div className="rc-filter">

          <Select
            placeholder="Loại yêu cầu"
            allowClear
            showSearch
            style={{ width: "100%" }}
            options={[
              { label: "Tất cả", value: "" },
              ...MAIN_INCIDENT_OPTIONS
            ]}
            optionFilterProp="label"
            value={filters.requestType || undefined}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                requestType: value || ""
              }))
            }
          />

          <Select
            placeholder="Địa chỉ"
            allowClear
            showSearch
            style={{ width: "100%", marginTop: 8 }}
            options={[
              { label: "Tất cả", value: "" },
              ...ADDRESS_OPTIONS
            ]}
            optionFilterProp="label"
            value={filters.address || undefined}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                address: value || ""
              }))
            }
          />

          <Select
            placeholder="Mức độ nguy hiểm"
            allowClear
            showSearch
            style={{ width: "100%", marginTop: 8 }}
            options={URGENCY_OPTIONS}
            optionFilterProp="label"
            value={filters.urgency || undefined}
            onChange={(value) =>
              setFilters(prev => ({
                ...prev,
                urgency: value || ""
              }))
            }
          />

        </div>

      )}

      {/* LIST */}

      <div className="ltr-queue__list">

        {loading ? (

          <div className="ltr-loading">
            Đang tải dữ liệu...
          </div>

        ) : filtered.length === 0 ? (

          <div className="rc-empty">
          Không có dữ liệu
        </div>


        ) : (

          filtered.map((item) => (

            <div
            key={item.id}
            className={`ltr-queue__card 
            ltr-queue__card--${item.level}
            ${selectedId === item.id ? "ltr-active" : ""}`}
            onClick={() => {
          
              setSelectedId(item.id);
          
              onSelectRequest?.(item);
          
            }}
          >

<div className="ltr-queue__top">

<div className="ltr-queue__meta">

  <div className="ltr-queue__request-id">
    Mã yêu cầu: #{item.id}
  </div>

  <Tag className="ltr-status-tag" color="purple">
    {item.statusText}
  </Tag>

  <span className="ltr-queue__time">
    {timeAgo(item.verifiedAt)}
  </span>

</div>

<Tag
  className="ltr-urgency-tag"
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
                <EnvironmentOutlined /> {item.address}
              </div>

              <div className="ltr-queue__tags">
                <Tag color="blue">{item.incident}</Tag>
              </div>

              <div className="ltr-queue__sla">
                <ClockCircleOutlined />
                Thời gian xử lý: {formatSla(item.sla)}
              </div>

            </div>

          ))

        )}

      </div>

    </aside>

  );

}