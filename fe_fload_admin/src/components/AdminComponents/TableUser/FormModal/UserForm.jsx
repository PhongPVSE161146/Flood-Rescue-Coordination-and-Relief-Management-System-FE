import "./UserForm.css";
import { Form, Input, Select } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyOutlined
} from "@ant-design/icons";

const ROLE_OPTIONS = [
  { label: "Rescue Team", value: 3 },
  { label: "Coordinator", value: 4 },
  { label: "Manager", value: 2 },
];

export default function UserForm({ form }) {

  return (
    <Form
      layout="vertical"
      form={form}
      className="userForm"
      autoComplete="off"
    >

      <div className="userForm__header">
        <h3  >Tạo người dùng mới</h3>
        <p>Nhập thông tin để tạo tài khoản hệ thống</p>
      </div>

      <div className="userForm__card">

        <div className="userForm__grid">

          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Nhập số điện thoại" },
              { pattern: /^[0-9+]+$/, message: "Số điện thoại không hợp lệ" }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              size="large"
            />
          </Form.Item>

        </div>

        <div className="userForm__grid">

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Nhập mật khẩu" },
              { min: 6, message: "Tối thiểu 6 ký tự" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Vai trò"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select
              placeholder="Chọn vai trò"
              options={ROLE_OPTIONS}
              size="large"
            />
          </Form.Item>

        </div>

      </div>

    </Form>
  );
}