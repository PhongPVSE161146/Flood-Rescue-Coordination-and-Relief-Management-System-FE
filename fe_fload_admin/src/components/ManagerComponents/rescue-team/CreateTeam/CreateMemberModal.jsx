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
  PhoneOutlined,
  IdcardOutlined,
  TeamOutlined

} from '@ant-design/icons';

import { useState } from 'react';

import {

  createTeamMember

} from '../../../../../api/axios/ManagerApi/rescueTeamApi';

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


  const handleCreate = async () => {

    try {
  
      const values = await form.validateFields();
  
      setLoading(true);
  
      const payload = {
  
        rescueTeamId: teamId,
  
        userId: Number(values.userId),
  
        fullName: String(values.fullName),
  
        phone: String(values.phone),
  
        roleInTeam: String(values.roleInTeam)
  
      };
  
      console.log("Payload gửi:", payload);
  
      await createTeamMember(teamId, payload);
  
      message.success("Tạo thành viên thành công");
  
      form.resetFields();
  
      onClose();
  
      onSuccess?.();
  
    }
    catch (error) {
  
      console.error("Create member error:", error);
  
      message.error("Tạo thành viên thất bại");
  
    }
    finally {
  
      setLoading(false);
  
    }
  
  };


  return (

    <Modal

      open={open}

      title="➕ Tạo thành viên đội cứu hộ"

      onCancel={onClose}

      footer={null}

      width={500}

      className="create-member-modal"

    >

      <Form

        form={form}

        layout="vertical"

        className="create-member-form"

      >

        <Form.Item

          name="userId"

          label="User ID"

          rules={[

            {

              required: true,

              message: "Nhập User ID"

            }

          ]}

        >

          <Input

            prefix={<IdcardOutlined />}

            placeholder="Nhập user id"

            size="large"

          />

        </Form.Item>


        <Form.Item

          name="fullName"

          label="Họ và tên"

          rules={[

            {

              required: true,

              message: "Nhập họ tên"

            }

          ]}

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

            {

              required: true,

              message: "Nhập số điện thoại"

            }

          ]}

        >

          <Input

            prefix={<PhoneOutlined />}

            placeholder="0901234567"

            size="large"

          />

        </Form.Item>


        <Form.Item

          name="roleInTeam"

          label="Vai trò trong đội"

          rules={[

            {

              required: true,

              message: "Chọn vai trò"

            }

          ]}

        >

          <Select

            size="large"

            placeholder="Chọn vai trò"

          >

            <Option value="Leader">

              👑 Leader

            </Option>

            <Option value="Member">

              👤 Thành viên

            </Option>

            <Option value="Medic">

              🏥 Medic

            </Option>

            <Option value="Driver">

              🚑 Driver

            </Option>

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