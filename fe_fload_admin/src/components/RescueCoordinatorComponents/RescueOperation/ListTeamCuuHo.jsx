import "./list-team-cuuho.css";

const rescueTeamsInMission = [
  {
    id: "MS-9921",
    name: "Nguyễn Văn An",
    team: "Đội phản ứng nhanh Q1",
    status: "ĐANG CỨU NẠN",
    priority: "KHẨN CẤP",
    time: "14 phút",
    active: true,
  },
  {
    id: "MS-9844",
    name: "Lê Thị Mai",
    team: "Volunteer HCMC",
    status: "ĐÃ TIẾP CẬN",
    time: "22 phút",
  },
  {
    id: "MS-9712",
    name: "Trần Thanh Tùng",
    team: "Đội Y tế Chợ Rẫy",
    status: "ĐANG SƠ CỨU",
    time: "35 phút",
  },
];

export default function ListTeamCuuHo() {
  return (
    <section className="rc-team-list">
      <h3 className="rc-team-list__title">
        Đang cứu hộ (8)
      </h3>

      <input
        className="rc-team-list__search"
        placeholder="Lọc theo tên hoặc đội..."
      />

      <div className="rc-team-list__items">
        {rescueTeamsInMission.map((item) => (
          <div
            key={item.id}
            className={`rc-team-item ${
              item.active ? "is-active" : ""
            }`}
          >
            <div className="rc-team-item__top">
              <span className="rc-team-item__id">
                #{item.id}
              </span>

              {item.priority && (
                <span className="rc-team-item__priority">
                  {item.priority}
                </span>
              )}
            </div>

            <strong className="rc-team-item__name">
              {item.name}
            </strong>

            <div className="rc-team-item__team">
              👥 {item.team}
            </div>

            <div className="rc-team-item__footer">
              <span className="rc-team-item__status">
                {item.status}
              </span>
              <span className="rc-team-item__time">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
