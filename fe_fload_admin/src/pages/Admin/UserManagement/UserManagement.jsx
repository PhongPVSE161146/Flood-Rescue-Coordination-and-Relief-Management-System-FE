import { useState, useEffect } from "react";
import { Button, Drawer, Form, message } from "antd";

import {
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "./UserManagement.css";

import UserTable from "../../../components/AdminComponents/TableUser/UserListManager/UserTable";
import UserFormModal from "../../../components/AdminComponents/TableUser/FormModal/UserFormModal";
import UserDetail from "../../../components/AdminComponents/TableUser/UserListManager/UserDetail";
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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [isEdit, setIsEdit] = useState(false);

  const [roleFilter, setRoleFilter] = useState("ALL");


  useEffect(() => {

    fetchUsers();

  }, []);



  const fetchUsers = async () => {

    try {

      setLoading(true);

      const data = await getAllUser();

      if (!Array.isArray(data)) return;

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
      setUsers(mappedUsers);

    }
    catch(error){

      message.error("Không tải được user");

    }
    finally{

      setLoading(false);

    }

  };

  const filteredUsers =
  roleFilter === "ALL"
    ? users
    : users.filter(u => u.role === roleFilter);

    const handleSubmit = async () => {

      try {
    
        const values = await form.validateFields();
    
        const res = await registerUser(values);
    
        message.success("Tạo user thành công");
    
        setModalOpen(false);
    
        form.resetFields();
    
    
        // thêm user mới vào state ngay lập tức
        const newUser = {
    
          id: Date.now(), // tạm (hoặc res.userId nếu API trả)
    
          name: values.name,
    
          phone: values.phone,
    
          role:
            values.roleId === 2
              ? "Manager"
              : values.roleId === 3
              ? "RescueTeam"
              : values.roleId === 4
              ? "RescueCoordinator"
              : "User",
    
          area: "N/A",
    
          status: "Hoạt động",
    
        };
    
    
        setUsers(prev => [newUser, ...prev]);
    
      }
      catch {
    
        
        message.error("Tạo user thất bại");
    
      } finally {
        fetchUsers();
        form.resetFields();
      }
    
    };



  const openCreateModal = () => {

    setIsEdit(false);

    form.resetFields();

    setModalOpen(true);

  };


  const openEditModal = (user) => {

    setSelectedUser(user);

    setIsEdit(true);

    form.setFieldsValue(user);

    setModalOpen(true);

  };



  // STAT CALCULATE

  const totalUsers = users.length;

  const totalAdmin = users.filter(u => u.role === "Admin").length;

  const totalManager = users.filter(u => u.role === "Manager").length;

  const totalCoordinator = users.filter(
    u => u.role === "RescueCoordinator"
  ).length;

  const totalRescue = users.filter(
    u => u.role === "RescueTeam"
  ).length;

  const totalActive = users.length;



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
  type="total"
  active={roleFilter === "ALL"}
  onClick={() => setRoleFilter("ALL")}
/>

<StatCard
  title="Admin"
  value={totalAdmin}
  type="admin"
  active={roleFilter === "Admin"}
  onClick={() => setRoleFilter("Admin")}
/>

<StatCard
  title="Manager"
  value={totalManager}
  type="manager"
  active={roleFilter === "Manager"}
  onClick={() => setRoleFilter("Manager")}
/>

<StatCard
  title="Coordinator"
  value={totalCoordinator}
  type="RescueCoordinator"
  active={roleFilter === "RescueCoordinator"}
  onClick={() => setRoleFilter("RescueCoordinator")}
/>

<StatCard
  title="Rescue Team"
  value={totalRescue}
  type="RescueTeam"
  active={roleFilter === "RescueTeam"}
  onClick={() => setRoleFilter("RescueTeam")}
/>

</div>



      {/* TABLE */}

      <UserTable
        users={users}
        loading={loading}
        onRowClick={(user)=>{
          setSelectedUser(user);
          setDrawerOpen(true);
        }}
        onEdit={openEditModal}
      />



      {/* DRAWER */}

      {/* <Drawer
        open={drawerOpen}
        width={500}
        onClose={()=>setDrawerOpen(false)}
        title="Chi tiết user"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={()=>openEditModal(selectedUser)}
          >
            Chỉnh sửa
          </Button>
        }
      >

        <UserDetail user={selectedUser} />

      </Drawer> */}



      {/* MODAL */}

      <UserFormModal
        open={modalOpen}
        onCancel={()=>setModalOpen(false)}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        form={form}
      />

    </div>

  );

}