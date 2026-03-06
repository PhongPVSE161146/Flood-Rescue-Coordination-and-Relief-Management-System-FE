
import "./Services.css";
import {
  FaCarSide,
  FaMotorcycle,
  FaBriefcaseMedical,
  FaHouseFloodWater,
} from "react-icons/fa6";

const services = [
  {
    icon: <FaCarSide />,
    title: "CỨU HỘ Ô TÔ",
    desc: "Sửa chữa tại chỗ, kích bình, thay lốp và cứu kéo xe chuyên nghiệp 24/7.",
  },
  {
    icon: <FaMotorcycle />,
    title: "CỨU HỘ XE MÁY",
    desc: "Đội phản ứng nhanh hỗ trợ hỏng hóc giữa đường, hết xăng hoặc mất chìa khóa.",
  },
  {
    icon: <FaBriefcaseMedical />,
    title: "CỨU HỘ Y TẾ",
    desc: "Điều phối xe cấp cứu và nhân viên y tế sơ cứu kịp thời trong các vụ tai nạn.",
  },
  {
    icon: <FaHouseFloodWater />,
    title: "CỨU NẠN THIÊN TAI",
    desc: "Hỗ trợ di dời, cung cấp nhu yếu phẩm và cứu nạn trong vùng bão lũ, sạt lở.",
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="services-header">
        <div>
          <span className="services-label">DỊCH VỤ CỦA CHÚNG TÔI</span>
          <h2>
            CỨU HỘ TOÀN DIỆN <br /> CHO MỌI TÌNH HUỐNG
          </h2>
        </div>

        <p>
          Chúng tôi cung cấp giải pháp cứu trợ chuyên biệt cho từng loại phương
          tiện và tình trạng khẩn cấp.
        </p>
      </div>

      <div className="services-grid">
        {services.map((item, index) => (
          <div className="service-card" key={index}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <a>
              XEM CHI TIẾT <span>→</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
