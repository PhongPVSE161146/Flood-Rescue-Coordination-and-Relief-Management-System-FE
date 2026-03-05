import { useEffect, useMemo, useState } from "react";
import { Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./MissionList.css";

/* ================= MOCK DATA ================= */
export const initialMissions = [
  {
    id: "#1234",
    name: "Nguyễn Văn An",
    location: "Quận 1, Đa Kao",
    tags: [
      { label: "NGẬP LỤT", type: "red" },
      { label: "CÓ NGƯỜI GIÀ", type: "blue" },
    ],
    createdAt: Date.now() - 2 * 60 * 1000, // 2 phút trước
    status: "pending",
  },
  {
    id: "#1235",
    name: "Lê Thị Mai",
    location: "Quận 7, Tân Hưng",
    tags: [{ label: "KẸT TRONG NHÀ", type: "orange" }],
    createdAt: Date.now() - 18 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1236",
    name: "Trần Thanh Tùng",
    location: "Nhà Bè",
    tags: [{ label: "HỖ TRỢ LƯƠNG THỰC", type: "green" }],
    createdAt: Date.now() - 35 * 60 * 1000,
    status: "dispatched",
  },
  {
    id: "#1237",
    name: "Phạm Minh Hoàng",
    location: "Quận 4",
    tags: [{ label: "MẤT ĐIỆN", type: "blue" }],
    createdAt: Date.now() - 8 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1238",
    name: "Nguyễn Thị Lan",
    location: "Quận Bình Thạnh",
    tags: [
      { label: "NGẬP LỤT", type: "red" },
      { label: "TRẺ NHỎ", type: "orange" },
    ],
    createdAt: Date.now() - 25 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1239",
    name: "Võ Thành Nam",
    location: "Quận 12",
    tags: [{ label: "SẠT LỞ", type: "red" }],
    createdAt: Date.now() - 50 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1240",
    name: "Đặng Thị Hồng",
    location: "Thủ Đức",
    tags: [{ label: "CÓ NGƯỜI BỆNH", type: "blue" }],
    createdAt: Date.now() - 12 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1241",
    name: "Bùi Quốc Khánh",
    location: "Hóc Môn",
    tags: [{ label: "CẦN DI DỜI", type: "orange" }],
    createdAt: Date.now() - 90 * 60 * 1000,
    status: "dispatched",
  },
  {
    id: "#1242",
    name: "Nguyễn Minh Trí",
    location: "Quận 8",
    tags: [{ label: "NGẬP NẶNG", type: "red" }],
    createdAt: Date.now() - 5 * 60 * 1000,
    status: "pending",
  },
  {
    id: "#1243",
    name: "Lý Thị Thu",
    location: "Bình Chánh",
    tags: [{ label: "HẾT LƯƠNG THỰC", type: "green" }],
    createdAt: Date.now() - 65 * 60 * 1000,
    status: "pending",
  },
];


/* ================= TIME UTILS ================= */
function timeAgo(ts) {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min <= 0) return "Vừa xong";
  return `${min} phút trước`;
}

/* ================= COMPONENT ================= */
export default function MissionList() {
  const [missions, setMissions] = useState(initialMissions);
  const [tab, setTab] = useState("new");
  const [, forceRender] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(time);
    };

    updateTime(); // chạy ngay
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  /* realtime update mỗi phút */
  useEffect(() => {
    const timer = setInterval(() => {
      forceRender((n) => n + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  /* filter theo nghiệp vụ */
  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const minutes = (Date.now() - m.createdAt) / 60000;

      if (tab === "new") {
        return m.status === "pending" && minutes <= 15;
      }
      if (tab === "urgent") {
        return m.status === "pending" && minutes > 15;
      }
      if (tab === "recent") {
        return m.status === "dispatched";
      }
      return true;
    });
  }, [missions, tab]);

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
        {/* <button
          className={tab === "urgent" ? "active" : ""}
          onClick={() => setTab("urgent")}
        >
          KHẨN CẤP
        </button>
        <button
          className={tab === "recent" ? "active" : ""}
          onClick={() => setTab("recent")}
        >
          GẦN ĐÂY
        </button> */}
      </div>

      {/* LIST */}
      <div className="rc-queue__list">
        {filtered.map((m) => (
          <div className="rc-queue__card" key={m.id}>
            <div className="rc-queue__top">
              <span className="rc-queue__id">{m.id}</span>
              <span className="rc-queue__time">
                {timeAgo(m.createdAt)}
              </span>
            </div>

            <div className="rc-queue__name">{m.name}</div>

            <div className="rc-queue__location">
              <EnvironmentOutlined />
              {m.location}
            </div>

            {m.tags.length > 0 && (
              <div className="rc-queue__tags">
                {m.tags.map((t) => (
                  <Tag key={t.label} color={t.type}>
                    {t.label}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
