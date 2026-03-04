import "./ListTeamSuccessful.css";

const data = [
  {
    id: "#RSC-9921",
    name: "Trần Thị Thuận",
    location: "Quận 8, Phường 4",
    tag: "DI DỜI KHẨN CẤP",
    time: "2 giờ trước",
    active: true,
  },
  {
    id: "#RSC-9918",
    name: "Hoàng Văn Nam",
    location: "Bình Chánh, Vĩnh Lộc B",
    tag: "TIẾP TẾ Y TẾ",
    time: "08:45 AM",
  },
  {
    id: "#RSC-9915",
    name: "Nguyễn Quốc Huy",
    location: "Quận 12",
    tag: "GIAO LƯƠNG THỰC",
    time: "Hôm qua",
  },
];

export default function ListTeamSuccessful() {
  return (
    <section className="rc-success-list">
      {/* HEADER */}
      <div className="rc-success-header">
        <h3>Đã hoàn thành</h3>

        <div className="rc-search">
          🔍
          <input placeholder="Tìm tên, mã số..." />
        </div>
      </div>

      {/* LIST */}
      {data.map((item) => (
        <div
          key={item.id}
          className={`rc-success-item ${
            item.active ? "active" : ""
          }`}
        >
          {/* ID + TIME */}
          <div className="rc-top">
            <span className="rc-id">
              Mã: <b>{item.id}</b>
            </span>

            <span
              className={`rc-time ${
                item.active ? "online" : ""
              }`}
            >
              {item.time}
            </span>
          </div>

          <b className="rc-name">{item.name}</b>

          <p className="rc-location">
            📍 {item.location}
          </p>

          <span className="rc-tag">{item.tag}</span>
        </div>
      ))}
    </section>
  );
}
