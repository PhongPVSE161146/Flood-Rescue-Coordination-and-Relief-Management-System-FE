import "./rescue-operation-detail.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function RescueOperationDetail() {
  const navigate = useNavigate();

  const handleFinishMission = () => {
    // 👉 route bạn muốn chuyển tới (ví dụ trang báo cáo)
    navigate("/coordinator/reports");
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      side: "left",
      author: "Lâm (Đội trưởng Q1)",
      text: "Đã tiếp cận được căn nhà. Nước đang xiết.",
      time: "14:41",
    },
    {
      id: 2,
      side: "right",
      author: "Bạn (Coordinator)",
      text: "Đội y tế đang chờ sẵn, cách đó 500m.",
      time: "14:43",
    },
    {
      id: 3,
      side: "left",
      author: "Lâm (Đội trưởng Q1)",
      text: "Vừa đưa cụ ông lên xuồng.",
      time: "14:46",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /* ===== SEND MESSAGE ===== */
  const sendMessage = () => {
    if (!input.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        side: "right",
        author: "Bạn (Coordinator)",
        text: input,
        time,
      },
    ]);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  return (


    <section className="rc-op-detail">
      {/* ================= HEADER ================= */}
      <header className="rc-op-detail__header">
        <div>
          <h2>
            Nhiệm vụ #MS-9921
            <span className="rc-badge rc-badge--danger">
              KHẨN CẤP (P1)
            </span>
          </h2>
          <p>⏱ Bắt đầu lúc: 14:35 · Đã diễn ra 45 phút</p>
        </div>

        <div className="rc-op-detail__actions">
          <button className="btn-outline">
            Hỗ trợ thêm đội
          </button>
          <button
      className="btn-primary"
      onClick={handleFinishMission}
    >
      Kết thúc nhiệm vụ
    </button>
        </div>
      </header>

      {/* ================= TIMELINE ================= */}
      {/* ===== TIMELINE ===== */}
<section className="rc-op-card">
  <div className="rc-timeline">
    {/* STEP 1 */}
    <div className="rc-timeline__item done">
      <div className="rc-timeline__icon">✓</div>
      <div className="rc-timeline__content">
        <b>ĐÃ TIẾP CẬN</b>
        <span>14:40</span>
      </div>
    </div>

    {/* LINE */}
    <div className="rc-timeline__line" />

    {/* STEP 2 */}
    <div className="rc-timeline__item active">
      <div className="rc-timeline__icon">*</div>
      <div className="rc-timeline__content">
        <b>ĐANG CỨU NẠN</b>
        <span>Đang thực hiện...</span>
      </div>
    </div>

    {/* LINE */}
    <div className="rc-timeline__line" />

    {/* STEP 3 */}
    <div className="rc-timeline__item pending">
      <div className="rc-timeline__icon">+</div>
      <div className="rc-timeline__content">
        <b>ĐANG SƠ CỨU</b>
      </div>
    </div>
  </div>
</section>


      {/* ================= GRID ================= */}
      <div className="rc-op-grid">
        {/* ===== LEFT ===== */}
        <div className="rc-op-col">
          {/* INFO */}
          <section className="rc-op-card">
            <h4>👤 THÔNG TIN NẠN NHÂN</h4>

            <div className="rc-info-row">
              <div>
                <label>NGƯỜI GỬI YÊU CẦU</label>
                <b>Nguyễn Văn An</b>
                <span className="link">
                  090 123 4567
                </span>
              </div>

              <div>
                <label>TÌNH TRẠNG BÁO CÁO</label>
                <p>
                  2 người già, 1 người hạn chế vận
                  động. Nước dâng ~1m.
                </p>
              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="rc-op-card">
  <div className="rc-card-header">
    <h4>📷 HÌNH ẢNH TỪ HIỆN TRƯỜNG</h4>
    <span className="link">Xem tất cả</span>
  </div>

  <div className="rc-images">
    {/* Ảnh 1 */}
    <div
      className="rc-image"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1601027847350-0285867c31f7?auto=format&fit=crop&w=400&q=60)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      14:42 · Hiện trường
    </div>

    {/* Ảnh đang active */}
    <div
      className="rc-image active"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=400&q=60)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      14:45 · Tiếp cận
    </div>

    {/* Upload */}
    <div className="rc-image rc-image--upload">
      📷
    </div>
  </div>
</section>


          {/* MAP */}
          <section className="rc-op-card">
            <h4>
              📍 VỊ TRÍ GPS ĐỘI CỨU HỘ
              <span className="rc-online">
                ● TRỰC TUYẾN
              </span>
            </h4>

            <div className="rc-map-mini">
              <iframe
                title="team-map"
                src="https://www.google.com/maps?q=10.7436,106.7017&z=12&output=embed"
                loading="lazy"
              />
            </div>
          </section>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="rc-op-col">
      <section className="rc-op-card rc-chat">
        {/* HEADER */}
        <div className="rc-card-header">
          <h4>💬 NHẬT KÝ CẬP NHẬT & CHAT</h4>
          <span className="rc-chat__id">
            ID: #C-229
          </span>
        </div>

        {/* MESSAGES */}
        <div
          className="rc-chat__messages"
          ref={messagesRef}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg ${msg.side}`}
            >
              {msg.author && <b>{msg.author}</b>}
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="rc-chat__input">
          <input
            placeholder="Nhập tin nhắn hoặc chỉ thị..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>
            ➤
          </button>
        </div>

        {/* QUICK ACTION */}
        <div className="rc-chat__quick">
          <span>✳ Yêu cầu cấp cứu</span>
          <span>📍 Gửi vị trí mới</span>
        </div>
      </section>
    </div>
      </div>
    </section>
  );
}
