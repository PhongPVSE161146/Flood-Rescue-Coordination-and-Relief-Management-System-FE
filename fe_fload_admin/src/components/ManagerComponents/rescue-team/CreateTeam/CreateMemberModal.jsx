'use client';

import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message
} from 'antd';

import {
  UserOutlined,
  PhoneOutlined
} from '@ant-design/icons';

import { useState, useEffect } from 'react';

import {
  createTeamMember,
  getRescueTeamMembers   // 🔥 thêm API này
} from '../../../../../api/axios/ManagerApi/rescueTeamApi';

import { getAllUser } from '../../../../../api/axios/AdminApi/userApi';

import "./CreateMemberModal.css";

const { Option } = Select;

export default function CreateMemberModal({
  open,
  onClose,
  teamId,
  onSuccess
}) {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  /* ================= LOAD USERS + FILTER ================= */

  useEffect(() => {
    if (open) {
      fetchData();
      form.setFieldsValue({
        roleInTeam: "Member"
      });
    }
  }, [open]);

  const fetchData = async () => {

    try {
      setLoadingUsers(true);

      // 🔥 lấy song song
      const [allUsersRes, teamMembersRes] = await Promise.all([
        getAllUser(),
        getRescueTeamMembers(teamId)
      ]);

      let allUsers = [];
      let teamMembers = [];

      // normalize users
      if (Array.isArray(allUsersRes)) {
        allUsers = allUsersRes;
      } else if (Array.isArray(allUsersRes?.data)) {
        allUsers = allUsersRes.data;
      } else if (Array.isArray(allUsersRes?.items)) {
        allUsers = allUsersRes.items;
      }

      // normalize team members
      if (Array.isArray(teamMembersRes?.data)) {
        teamMembers = teamMembersRes.data;
      } else if (Array.isArray(teamMembersRes?.data?.data)) {
        teamMembers = teamMembersRes.data.data;
      }

      // 🔥 Lấy danh sách userId đã thuộc team
      const existingUserIds = teamMembers.map(
        (member) => Number(member.userId)
      );

      // 🔥 LỌC USER CHƯA THUỘC TEAM
      const filteredUsers = allUsers.filter(
        (user) => !existingUserIds.includes(Number(user.userId))
      );

      setUsers(filteredUsers);

    } catch (err) {
      console.log("Load data error:", err);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ================= AUTO FILL ================= */

  const handleUserChange = (userId) => {

    const selectedUser = users.find(
      (u) => Number(u.userId) === Number(userId)
    );

    if (!selectedUser) return;

    form.setFieldsValue({
      fullName: selectedUser.fullName || selectedUser.name || "",
      phone: selectedUser.phone || "",
    });
  };

  /* ================= CREATE ================= */

  const handleCreate = async () => {

    try {

      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        rescueTeamId: teamId,
        userId: Number(values.userId),
        fullName: String(values.fullName),
        phone: String(values.phone),
        roleInTeam: String(values.roleInTeam || "Member")
      };

      await createTeamMember(teamId, payload);

      message.success("Tạo thành viên thành công");

      form.resetFields();
      onClose();
      onSuccess?.();

    }
    catch (error) {
      message.error("Tạo thành viên thất bại");
    }
    finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (

    <Modal
      open={open}
      title="➕ Tạo thành viên đội cứu hộ"
      onCancel={onClose}
      footer={null}
      width={500}
      className="create-member-modal"
      centered
    >

      <Form
        form={form}
        layout="vertical"
        className="create-member-form"
      >

        <Form.Item
          name="userId"
          label="Chọn User"
          rules={[{ required: true, message: "Chọn user" }]}
        >
          <Select
            size="large"
            placeholder={
              users.length === 0
                ? "Tất cả user đã thuộc đội"
                : "Chọn user"
            }
            loading={loadingUsers}
            showSearch
            onChange={handleUserChange}
            optionFilterProp="children"
          >
            {users.map(user => (
              <Option
                key={user.userId}
                value={user.userId}
              >
                {user.userId} - {user.fullName || user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true }]}
        >
          <Input
            prefix={<UserOutlined />}
            size="large"
            disabled
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            size="large"
            disabled
          />
        </Form.Item>

        <Form.Item
          name="roleInTeam"
          label="Vai trò trong đội"
          rules={[{ required: true }]}
        >
          <Select size="large">
        
            <Option value="Member">👤 Thành viên</Option>
           
          </Select>
        </Form.Item>

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={handleCreate}
          className="create-member-btn"
        >
          Tạo thành viên
        </Button>

      </Form>

    </Modal>
  );
}