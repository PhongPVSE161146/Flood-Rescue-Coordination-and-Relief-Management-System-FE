export default function UserDetail({ user }) {
    return (
      <div className="user-detail-box">
  
        <Section title="Thông tin liên hệ">
          <Item label="Họ tên" value={user.name} />
          <Item label="Email" value={user.email} />
          <Item label="Điện thoại" value={user.phone} />
          <Item label="Địa chỉ" value={user.address} />
        </Section>
  
        <Section title="Thông tin công việc">
          <Item label="Vai trò" value={user.role} />
          <Item label="Bộ phận" value={user.department} />
          <Item label="Khu vực" value={user.area} />
          <Item label="Trạng thái" value={user.status} />
          <Item label="Ngày tham gia" value={user.joinDate} />
        </Section>
  
      </div>
    );
  }
  
  function Section({ title, children }) {
    return (
      <>
        <h4 style={{ marginTop: 16 }}>{title}</h4>
        {children}
      </>
    );
  }
  
  function Item({ label, value }) {
    return (
      <div className="detail-row">
        <span>{label}</span>
        <b>{value}</b>
      </div>
    );
  }