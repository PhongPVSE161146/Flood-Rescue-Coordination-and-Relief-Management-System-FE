import { useState } from "react";
import {
  Button,
  Tag,
  Checkbox,
  Modal,
  Form,
  Input,
  Select,
  Drawer,
  Divider,
} from "antd";
import {
  PlusOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./userManagement.css";

/* ================= CONSTANT ================= */

const ROLE_COLOR = {
  "RESCUE TEAM": "blue",
  COORDINATOR: "purple",
  MANAGER: "gold",
  ADMIN: "red",
};

const STATUS_COLOR = {
  "Hoạt động": "green",
  "Nghỉ phép": "orange",
  Khóa: "red",
};

/* ================= MAIN ================= */

export default function UserManagement() {
  const [form] = Form.useForm();

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@rescue.vn",
      phone: "0912345678",
      address: "123 Đường Láng, Hà Nội",
      role: "RESCUE TEAM",
      roleColor: "blue",
      department: "Đội Cứu Hộ 1",
      area: "Hà Nội - Đội 1",
      status: "Hoạt động",
      statusColor: "green",
      last: "Vừa xong",
      joinDate: "15/01/2024",
      notes: "",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= HANDLER ================= */

  const openCreateModal = () => {
    setIsEdit(false);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    form.setFieldsValue(user);
    setDrawerOpen(false);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (isEdit) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                ...values,
                roleColor: ROLE_COLOR[values.role],
                statusColor: STATUS_COLOR[values.status],
              }
            : u
        )
      );
    } else {
      setUsers((prev) => [
        {
          id: Date.now(),
          ...values,
          roleColor: ROLE_COLOR[values.role],
          statusColor: STATUS_COLOR[values.status],
          last: "Vừa xong",
          joinDate: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);
    }

    setModalOpen(false);
    setIsEdit(false);
    form.resetFields();
  };

  /* ================= RENDER ================= */

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Danh sách người dùng</h2>
          <p>Quản lý thành viên hệ thống cứu hộ</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Tạo người dùng
        </Button>
      </div>

      {/* STAT */}
      <div className="stat-cards">
        <StatCard title="TỔNG NGƯỜI DÙNG" value={users.length} icon={<TeamOutlined />} />
        <StatCard
          title="RESCUE TEAM"
          value={users.filter((u) => u.role === "RESCUE TEAM").length}
          icon={<ThunderboltOutlined />}
        />
        <StatCard
          title="ĐANG HOẠT ĐỘNG"
          value={users.filter((u) => u.status === "Hoạt động").length}
          icon={<CheckCircleOutlined />}
        />
      </div>

      {/* TABLE */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th />
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Khu vực</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => {
                  setSelectedUser(u);
                  setDrawerOpen(true);
                }}
              >
                <td><Checkbox /></td>
                <td>
                  <b>{u.name}</b>
                  <div>{u.email}</div>
                </td>
                <td><Tag color={u.roleColor}>{u.role}</Tag></td>
                <td>{u.area}</td>
                <td>
                  <span className={`status ${u.statusColor}`}>{u.status}</span>
                </td>
                <td>
                  <EditOutlined onClick={() => openEditModal(u)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      <Drawer
        open={drawerOpen}
        width={520}
        onClose={() => setDrawerOpen(false)}
        title="Chi tiết người dùng"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(selectedUser)}
          >
            Chỉnh sửa
          </Button>
        }
      >
        {selectedUser && <UserDetail user={selectedUser} />}
      </Drawer>

      {/* MODAL */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        width={720}
        title={isEdit ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
        okText={isEdit ? "Lưu thay đổi" : "Tạo người dùng"}
      >
        <UserForm form={form} />
      </Modal>
    </div>
  );
}

/* ================= SUB ================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      {icon}
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

function UserDetail({ user }) {
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

/* ================= FORM ================= */

function UserForm({ form }) {
  return (
    <Form layout="vertical" form={form}>
      <Divider orientation="left">📋 Thông tin cơ bản</Divider>

      <div className="form-grid">
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Điện thoại"
          name="phone"
          rules={[
            { required: true },
            { pattern: /^0\d{9}$/, message: "SĐT không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
      </div>

      <Divider orientation="left">💼 Thông tin công việc</Divider>

      <div className="form-grid">
        <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="RESCUE TEAM">Rescue Team</Select.Option>
            <Select.Option value="COORDINATOR">Coordinator</Select.Option>
            <Select.Option value="MANAGER">Manager</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Bộ phận" name="department" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Đội Cứu Hộ 1">Đội Cứu Hộ 1</Select.Option>
            <Select.Option value="Đội Cứu Hộ 2">Đội Cứu Hộ 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Trạng thái" name="status" initialValue="Hoạt động">
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Khóa">Khóa</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <Divider orientation="left">🔐 Bảo mật</Divider>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true }, { min: 6 }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="Ghi chú" name="notes">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
}

