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
    title: "CỨU NẠN NGƯỜI BỊ MẮC KẸT",
    desc: "Triển khai đội cứu hộ tiếp cận và giải cứu người dân bị mắc kẹt trong khu vực ngập lụt hoặc thiên tai.",
  },
  {
    icon: <FaMotorcycle />,
    title: "HỖ TRỢ SƠ TÁN KHẨN CẤP",
    desc: "Tổ chức sơ tán người dân khỏi các khu vực nguy hiểm khi xảy ra bão, lũ quét hoặc sạt lở.",
  },
  {
    icon: <FaBriefcaseMedical />,
    title: "HỖ TRỢ Y TẾ & SƠ CỨU",
    desc: "Cung cấp sơ cứu ban đầu và hỗ trợ vận chuyển người bị thương đến nơi an toàn.",
  },
  {
    icon: <FaHouseFloodWater />,
    title: "TIẾP TẾ LƯƠNG THỰC",
    desc: "Phân phối nước uống, lương thực và nhu yếu phẩm đến các khu vực bị cô lập do bão lũ.",
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="services-header">
        <div>
          <span className="services-label">DỊCH VỤ CỨU HỘ</span>
          <h2>
            HỖ TRỢ NGƯỜI DÂN <br /> TRONG THIÊN TAI BÃO LŨ
          </h2>
        </div>

        <p>
          Hệ thống cứu hộ của chúng tôi hỗ trợ người dân trong các tình huống
          bão lũ, ngập lụt và thiên tai với các đội phản ứng nhanh và mạng lưới
          cứu hộ trên toàn quốc.
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