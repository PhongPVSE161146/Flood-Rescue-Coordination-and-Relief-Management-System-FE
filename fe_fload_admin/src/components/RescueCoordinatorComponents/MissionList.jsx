import { useEffect, useMemo, useState } from "react";
import { Tag, Select } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

import { getDispatchQueue as getPendingRescueRequests } from "../../../api/axios/RescueRequests/rescueRequestsApi";
import AuthNotify from "../../utils/Common/AuthNotify";
import { getRequestStatuses } from "../../../api/axios/Auth/authApi";
import "./MissionList.css";

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

/* ================= TIME FILTER ================= */

const isExpired = (createdAt) => {
  const diff = (Date.now() - createdAt) / 60000;
  return diff > 60;
};

const isNew = (createdAt) => {
  const diff = (Date.now() - createdAt) / 60000;
  return diff <= 60;
};

/* ================= REQUEST TYPES ================= */

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

/* ================= CONVERT API ================= */


const API_BASE = "https://api-rescue.purintech.id.vn";

const convertApiToMission = (data = [], statuses = []) => {

  if (!Array.isArray(data)) return [];

  return data
    .filter(item => item.statusId === 1)
    .map((item) => {

      const statusObj = statuses.find(
        s => s.statusId === item.statusId
      );

      const images = [];

      if (Array.isArray(item.imageUrls)) {
        images.push(...item.imageUrls.map(url =>
          url.startsWith("http") ? url : API_BASE + url
        ));
      }

      if (Array.isArray(item.images)) {
        images.push(...item.images.map(url =>
          url.startsWith("http") ? url : API_BASE + url
        ));
      }

      if (item.locationImageUrl) {
        images.push(
          item.locationImageUrl.startsWith("http")
            ? item.locationImageUrl
            : API_BASE + item.locationImageUrl
        );
      }

      return {
        id: item.rescueRequestId,
        name: item.fullName,
        phone: item.contactPhone,
        address: item.address,

        lat: item.locationLat,
        lng: item.locationLng,

        locationLat: item.locationLat,
        locationLng: item.locationLng,

        createdAt: new Date(item.createdAt).getTime(),

        incident:
          MAIN_INCIDENT_OPTIONS.find(
            (o) => o.value === item.requestType
          )?.label || item.requestType,

        status: "pending",
        statusText: statusObj?.description || "Đang xử lý",

        images: images,

        urgencyLevelId: item.urgencyLevelId,
        detailDescription: item.detailDescription,
        rescueTeamNote: item.rescueTeamNote,
        victimCount: item.victimCount,
        availableRescueTool: item.availableRescueTool,
        specialNeeds: item.specialNeeds,
      };

    });

};
/* ================= COMPONENT ================= */

export default function MissionList({ onSelectMission }) {

  const [missions, setMissions] = useState([]);
  const [tab, setTab] = useState("new");

  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(null);
  const [requestStatuses, setRequestStatuses] = useState([]);
  const [, forceRender] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const [filters, setFilters] = useState({
    requestType: "",
    timeRange: "",
    address: ""
  });

  /* ================= LOAD API ================= */

  const fetchData = async () => {

    try {

      setLoading(true);

      const response = await getPendingRescueRequests();
      const list = Array.isArray(response)
      ? response
      : response?.data || [];
    
    /* Chỉ lấy request chưa xác minh */
    
    const pendingList = list.filter(item => item.statusId === 1);
    
    setMissions(
      convertApiToMission(pendingList, requestStatuses)
    );

    }
    catch (error) {

      AuthNotify.error(
        "Không tải được dữ liệu",
        error?.response?.data?.message || error.message
      );

    }
    finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if(requestStatuses.length > 0){
      fetchData();
    }
  }, [requestStatuses]);

  /* ================= ADDRESS OPTIONS ================= */

  const ADDRESS_OPTIONS = useMemo(() => {

    const unique = [...new Set(missions.map(m => m.address).filter(Boolean))];

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
          timeRange: "",
          address: ""
        });
      }

      setTabLoading(null);

    }, 200);

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
      forceRender(n => n + 1);
    }, 60000);

    return () => clearInterval(timer);

  }, []);

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {

    let list = [...missions];

    if (tab === "new") {
      list = list.filter(m => isNew(m.createdAt));
    }

    if (tab === "expired") {
      list = list.filter(m => isExpired(m.createdAt));
    }

    if (tab === "merge") {

      if (filters.requestType)
        list = list.filter(m =>
          m.incident?.toLowerCase().includes(filters.requestType.toLowerCase())
        );

      if (filters.address)
        list = list.filter(m => m.address === filters.address);

      if (filters.timeRange) {

        const minutes = Number(filters.timeRange);

        list = list.filter(m => {
          const diff = (Date.now() - m.createdAt) / 60000;
          return diff <= minutes;
        });

      }

    }

    list.sort((a, b) => b.createdAt - a.createdAt);

    return list;

  }, [missions, tab, filters]);

  useEffect(() => {

    const loadStatuses = async () => {
  
      try {
  
        const data = await getRequestStatuses();
  
        const list = Array.isArray(data)
          ? data
          : data?.data || [];
  
        setRequestStatuses(list);
  
      } catch (error) {
  
        console.error("LOAD STATUS ERROR:", error);
  
      }
  
    };
  
    loadStatuses();
  
  }, []);

  /* ================= UI ================= */

  return (

    <aside className="rc-queue">

      <div className="rc-queue__header">

        <h3>Hàng đợi ({filtered.length})</h3>

        <span className="rc-queue__live">
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

  {/* LOẠI YÊU CẦU */}

  <Select
    placeholder="Loại yêu cầu"
    showSearch
    allowClear
    value={filters.requestType || undefined}
    style={{ width: "100%" }}
    options={[
      { label: "Tất cả", value: "" },
      ...MAIN_INCIDENT_OPTIONS
    ]}
    optionFilterProp="label"
    onChange={(value) =>
      setFilters({
        requestType: value || "",
        address: "",
        timeRange: ""
      })
    }
  />

  {/* ĐỊA CHỈ */}

  <Select
    placeholder="Địa chỉ"
    showSearch
    allowClear
    value={filters.address || undefined}
    style={{ width: "100%", marginTop: 8 }}
    options={[
      { label: "Tất cả", value: "" },
      ...ADDRESS_OPTIONS
    ]}
    optionFilterProp="label"
    onChange={(value) =>
      setFilters({
        requestType: "",
        address: value || "",
        timeRange: ""
      })
    }
  />

  {/* THỜI GIAN */}

  <Select
    placeholder="Thời gian"
    allowClear
    value={filters.timeRange || undefined}
    style={{ width: "100%", marginTop: 8 }}
    onChange={(value) =>
      setFilters({
        requestType: "",
        address: "",
        timeRange: value || ""
      })
    }
  >
    <Option value="">Tất cả</Option>
    <Option value="10">10 phút</Option>
    <Option value="30">30 phút</Option>
    <Option value="60">60 phút</Option>
    <Option value="120">2 giờ</Option>
  </Select>

  {/* RESET FILTER */}

  {/* {(filters.requestType || filters.address || filters.timeRange) && (
    <button
      className="rc-filter-reset"
      onClick={() =>
        setFilters({
          requestType: "",
          address: "",
          timeRange: ""
        })
      }
    >
      Xóa bộ lọc
    </button>
  )} */}

</div>

)}

      {/* LIST */}

      <div className="rc-queue__list">

        {loading ? (

          <div className="rc-loading">
            Đang tải dữ liệu...
          </div>

        ) : filtered.length === 0 ? (

          <div className="rc-empty">
            Không có dữ liệu
          </div>

        ) : (

          filtered.map((m) => (

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
      {m.statusText || "Đang xử lý"}
    </Tag>
  ) : (
    <Tag color="green">
      {m.statusText || "Đã xác nhận"}
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
                {m.address}
              </div>

              <div className="rc-queue__tags">
                <Tag color="red">{m.incident}</Tag>
              </div>

            </div>

          ))

        )}

      </div>

    </aside>

  );

}