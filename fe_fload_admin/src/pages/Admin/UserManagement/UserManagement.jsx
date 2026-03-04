import { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./userManagement.css";

import UserTable from "../../../components/AdminComponents/TableUser/UserListManager/UserTable";
import UserFormModal from "../../../components/AdminComponents/TableUser/FormModal/UserFormModal";
<<<<<<< HEAD
=======

>>>>>>> origin/main
import StatCard from "../../../components/AdminComponents/TableUser/FormModal/StatCard";

import {
  registerUser,
  getAllUser,
} from "../../../../api/axios/AdminApi/userApi";

export default function UserManagement() {
  const [form] = Form.useForm();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [roleFilter, setRoleFilter] = useState("ALL");
  

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getAllUser();
      const data = res?.data || [];

      if (!Array.isArray(data)) {
        setUsers([]);
        return;
      }

<<<<<<< HEAD
      const mappedUsers = data
        .filter((u) => u.roleName)
        .map((user) => ({
          id: user.userId,
          name: user.fullName,
          phone: user.phone,
          role: user.roleName,
          area: user.areaId ? `Area ${user.areaId}` : "N/A",
          status: "Hoạt động",
          raw: user,
        }));

=======
      const validUsers = data.filter(u => u.roleName);

      const mappedUsers = validUsers.map(user => ({

        id: user.userId,
        name: user.fullName,
        phone: user.phone,
        role: user.roleName,
      
        areaId: user.areaId, // 🔥 QUAN TRỌNG
      
        status: user.status || "Hoạt động",
        raw: user,
      
      }));
>>>>>>> origin/main
      setUsers(mappedUsers);
    } catch (error) {
      message.error("Không tải được user");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers =
    roleFilter === "ALL"
      ? users
      : users.filter((u) => u.role === roleFilter);

  /* ================= CREATE USER ================= */

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await registerUser(values);

      message.success("Tạo user thành công");

      setModalOpen(false);
      form.resetFields();

      // Load lại danh sách từ backend
      fetchUsers();
    } catch (error) {
      message.error("Tạo user thất bại");
    }
  };

  /* ================= MODAL ================= */

  const openCreateModal = () => {
    setIsEdit(false);
    setSelectedUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEdit(true);

    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    setModalOpen(true);
  };

  /* ================= STATS ================= */

  const totalUsers = users.length;
  const totalAdmin = users.filter((u) => u.role === "Admin").length;
  const totalManager = users.filter((u) => u.role === "Manager").length;
  const totalCoordinator = users.filter(
    (u) => u.role === "RescueCoordinator"
  ).length;
  const totalRescue = users.filter(
    (u) => u.role === "RescueTeam"
  ).length;

  return (
    <div className="userManagement">
      {/* HEADER */}
      <div className="userManagement__header">
        <div>
          <h2 className="userManagement__title">
            Quản lý người dùng
          </h2>
          <p className="userManagement__subtitle">
            Dashboard quản lý hệ thống
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreateModal}
        >
          Tạo người dùng
        </Button>
      </div>

      {/* STAT */}
      <div className="userManagement__stats">
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          active={roleFilter === "ALL"}
          onClick={() => setRoleFilter("ALL")}
        />

        <StatCard
          title="Admin"
          value={totalAdmin}
          active={roleFilter === "Admin"}
          onClick={() => setRoleFilter("Admin")}
        />

        <StatCard
          title="Manager"
          value={totalManager}
          active={roleFilter === "Manager"}
          onClick={() => setRoleFilter("Manager")}
        />

        <StatCard
          title="Coordinator"
          value={totalCoordinator}
          active={roleFilter === "RescueCoordinator"}
          onClick={() => setRoleFilter("RescueCoordinator")}
        />

        <StatCard
          title="Rescue Team"
          value={totalRescue}
          active={roleFilter === "RescueTeam"}
          onClick={() => setRoleFilter("RescueTeam")}
        />
      </div>

      {/* TABLE */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        onRowClick={(user) => {
          setSelectedUser(user);
        }}
        onEdit={openEditModal}
      />

      {/* MODAL */}
      <UserFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        form={form}
      />
    </div>
  );
}