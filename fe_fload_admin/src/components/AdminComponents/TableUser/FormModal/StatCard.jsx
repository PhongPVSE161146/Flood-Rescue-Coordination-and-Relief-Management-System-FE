import "./StatCard.css";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="statCard">

      <div className="statCard__icon">
        {icon}
      </div>

      <div>

        <div className="statCard__value">
          {value}
        </div>

        <div className="statCard__title">
          {title}
        </div>

      </div>

    </div>
  );
}