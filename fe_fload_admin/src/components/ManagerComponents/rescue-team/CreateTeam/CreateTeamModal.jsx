'use client';

import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Divider
} from 'antd';

import {
  SafetyOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  AimOutlined
} from '@ant-design/icons';

import {
  createRescueTeam,
  updateRescueTeamLocation
} from '../../../../../api/axios/ManagerApi/rescueTeamApi';

import { useState } from 'react';

import './CreateTeamModal.css';

const { Option } = Select;

export default function CreateTeamModal({
  open,
  onClose,
  onSuccess
}) {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);


  const handleCreate = async () => {

    try {

      const values =
        await form.validateFields();

      setLoading(true);

      // 1️⃣ create team
      const res =
        await createRescueTeam({

          rcName: values.rcName,

          rcPhone: values.rcPhone,

          areaId: Number(values.areaId),

          rcStatus: values.rcStatus,

        });

      // get new team id
      const teamId =
        res?.data?.id ||
        res?.data?.teamId;

      // 2️⃣ update location
      if (teamId && values.location) {

        await updateRescueTeamLocation(
          teamId,
          values.location
        );

      }

      message.success(
        "🚑 Tạo đội cứu hộ thành công"
      );

      form.resetFields();

      onClose?.();

      onSuccess?.();

    }
    catch (error) {

      console.error(error);

      message.error(
        "❌ Tạo đội thất bại"
      );

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <Modal
      open={open}
      title="🚑 Tạo đội cứu hộ mới"
      onCancel={onClose}
      footer={null}
      width={520}
      className="createTeamModal"
    >

      <div className="createTeamModal__header">

        <AimOutlined className="createTeamModal__icon"/>

        <div>

          <div className="createTeamModal__title">

            Tạo đội cứu hộ

          </div>

          <div className="createTeamModal__subtitle">

            Nhập thông tin đội cứu hộ mới

          </div>

        </div>

      </div>


      <Divider/>


      <Form
        form={form}
        layout="vertical"
      >

        <Form.Item
          name="rcName"
          label="Tên đội cứu hộ"
          rules={[
            {
              required: true,
              message: "Nhập tên đội"
            }
          ]}
        >

          <Input
            prefix={<SafetyOutlined />}
            placeholder="VD: Đội cứu hộ Quận 1"
            size="large"
          />

        </Form.Item>


        <Form.Item
          name="rcPhone"
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
          name="areaId"
          label="Area ID"
          rules={[
            {
              required: true,
              message: "Nhập area id"
            }
          ]}
        >

          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="VD: 1"
            size="large"
            type="number"
          />

        </Form.Item>


        {/* NEW LOCATION FIELD */}

        <Form.Item
          name="location"
          label="Vị trí (lng,lat)"
        >

          <Input
            prefix={<AimOutlined />}
            placeholder="VD: 106.699018,10.779783"
            size="large"
          />

        </Form.Item>


        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={handleCreate}
          className="createTeamModal__btn"
        >

          🚑 Tạo đội cứu hộ

        </Button>


      </Form>

    </Modal>

  );

}