import { useEffect, useState } from "react";
import { Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./list-team-rescue-queue.css";

/* ===== MOCK DATA ===== */
const initialRequests = [
  {
    id: "#1234",
    title: "Ngập lụt Huỳnh Tấn Phát",
    location: "Quận 7, TP.HCM",
    tags: ["KHẨN CẤP", "Y TẾ"],
    createdAt: Date.now() - 2 * 60 * 1000,
    level: "urgent",
  },
  {
    id: "#1235",
    title: "Cây đổ chắn đường",
    location: "Nguyễn Văn Linh, Q7",
    tags: ["TRUNG BÌNH"],
    createdAt: Date.now() - 15 * 60 * 1000,
    level: "medium",
  },
  {
    id: "#1236",
    title: "Hỗ trợ di dời dân",
    location: "Tân Thuận, Q7",
    tags: ["THEO DÕI"],
    createdAt: Date.now() - 24 * 60 * 1000,
    level: "low",
  },
];

const timeAgo = (time) => {
  const diff = Math.floor((Date.now() - time) / 60000);
  return `${diff} phút trước`;
};

export default function ListTeamRescue() {
  const [data] = useState(initialRequests);
  const [, force] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => force((v) => v + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="ltr-queue">
      <div className="ltr-queue__header">
        <div>
          <h3>CHỜ ĐIỀU PHỐI ({data.length})</h3>
          <span className="ltr-queue__sub">
            Yêu cầu khẩn cấp cần xử lý ngay
          </span>
        </div>

        <span className="ltr-queue__live">REAL-TIME</span>
      </div>

      <div className="ltr-queue__list">
        {data.map((item) => (
          <div
            key={item.id}
            className={`ltr-queue__card ltr-queue__card--${item.level}`}
          >
            <div className="ltr-queue__top">
              <Tag color="red">{item.tags[0]}</Tag>
              <span>{timeAgo(item.createdAt)}</span>
            </div>

            <h4>{item.title}</h4>

            <div className="ltr-queue__location">
              <EnvironmentOutlined />
              {item.location}
            </div>

            <div className="ltr-queue__tags">
              {item.tags.slice(1).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
