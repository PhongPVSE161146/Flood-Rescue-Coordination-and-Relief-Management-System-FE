'use client';

import {
  Modal,
  Form,
  Input,
  Select,
  Button
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

import { getProvinces } from '../../../../../api/axios/Auth/authApi';

import { useState, useEffect } from 'react';

import AuthNotify from "../../../../utils/Common/AuthNotify";

import './CreateTeamModal.css';

const { Option } = Select;

export default function CreateTeamModal({
  open,
  onClose,
  onSuccess
}) {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);

  /* ================= LOAD PROVINCES ================= */

  useEffect(() => {

    if (open) {
      fetchProvinces();
    }

  }, [open]);

  const fetchProvinces = async () => {

    try {

      const res = await getProvinces();

      const data = res?.data || res || [];

      setProvinces(
        Array.isArray(data) ? data : []
      );

    }
    catch (error) {

      console.error(error);

      AuthNotify.error(
        "Không tải được khu vực",
        "Vui lòng thử lại"
      );

    }

  };

  /* ================= CREATE TEAM ================= */

  const handleCreate = async () => {

    try {

      const values = await form.validateFields();

      setLoading(true);

      /* 1️⃣ CREATE TEAM */

      const res = await createRescueTeam({

        rcName: values.rcName,

        rcPhone: values.rcPhone,

        areaId: Number(values.areaId),

        rcStatus: values.rcStatus

      });

      const teamId =
        res?.data?.id ||
        res?.data?.teamId;

      /* 2️⃣ UPDATE LOCATION */

      if (teamId && values.location) {

        await updateRescueTeamLocation(
          teamId,
          values.location
        );

      }

      AuthNotify.success(
        "Tạo đội cứu hộ thành công",
        "Đội cứu hộ mới đã được tạo"
      );

      form.resetFields();

      onClose?.();

      onSuccess?.();

    }
    catch (error) {

      console.error(error);

      AuthNotify.error(
        "Tạo đội thất bại",
        "Không thể tạo đội cứu hộ"
      );

    }
    finally {

      setLoading(false);

    }

  };


  /* ================= UI ================= */

  return (

    <Modal
      open={open}
      title="🚑 Tạo đội cứu hộ mới"
      onCancel={onClose}
      footer={null}
      width={520}
      className="createTeamModal"
    >

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
          label="Khu vực"
          rules={[
            {
              required: true,
              message: "Chọn khu vực"
            }
          ]}
        >

          <Select
            size="large"
            placeholder="Chọn khu vực"
            suffixIcon={<EnvironmentOutlined />}
            options={provinces.map((item) => ({
              label: item.name,
              value: item.id
            }))}
          />

        </Form.Item>


        {/* LOCATION */}

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