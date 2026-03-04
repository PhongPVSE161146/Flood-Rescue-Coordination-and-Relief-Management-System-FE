'use client';

import {
  Modal,
  Form,
  Input,
  Button,
  Spin,
  message,
  Row,
  Col,
  Avatar
} from "antd";

import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SaveOutlined
} from "@ant-design/icons";

import {
  useEffect,
  useState
} from "react";

import {
  getUserProfile,
  updateUserProfile
} from "../../../api/axios/Auth/authApi";

import "./UserProfileModal.css";


export default function UserProfileModal({
  open,
  onClose
}) {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  const [userId, setUserId] = useState(null);

  const [userName, setUserName] = useState("");


  /* ================= LOAD PROFILE ================= */
  const fetchProfile = async () => {

    try {

      setFetching(true);

      const res = await getUserProfile();

      const data = res.data || res;

      console.log("PROFILE DATA:", data);

      setUserId(data.userId);

      setUserName(data.fullName);

      form.setFieldsValue({

        fullName: data.fullName || "",

        phone: data.phone || "",

        areaId: data.areaId || 0

      });

    }
    catch (error) {

      console.error(error);

      message.error("Không thể tải thông tin người dùng");

    }
    finally {

      setFetching(false);

    }

  };


  useEffect(() => {

    if (open) {

      fetchProfile();

    }

  }, [open]);


  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {

    try {

      if (!userId) {

        message.error("UserId không tồn tại");

        return;

      }

      const values = await form.validateFields();

      setLoading(true);

      const payload = {

        userId: Number(userId),

        fullName: String(values.fullName),

        phone: String(values.phone),

        areaId: Number(values.areaId)

      };

      console.log("UPDATE PAYLOAD:", payload);

      await updateUserProfile(payload);

      message.success("Cập nhật thông tin thành công");

      onClose();

    }
    catch (error) {

      console.error(error);

      message.error("Cập nhật thất bại");

    }
    finally {

      setLoading(false);

    }

  };


  /* ================= AVATAR TEXT ================= */
  const avatarText = userName
    ?.split(" ")
    ?.map(word => word[0])
    ?.slice(0, 2)
    ?.join("")
    ?.toUpperCase() || "U";


  return (

    <Modal

      open={open}

      onCancel={onClose}

      footer={null}

      width={520}

      className="profile-modal"

      centered

    >

      {

        fetching

        ?

        <div className="profile-loading">

          <Spin size="large" />

        </div>

        :

        <>

          {/* HEADER */}
          <div className="profile-header">

            <Avatar
              size={64}
              className="profile-avatar"
            >
              {avatarText}
            </Avatar>

            <div>

              <h2>{userName}</h2>

              <p>Cập nhật thông tin cá nhân</p>

            </div>

          </div>


          {/* FORM */}
          <Form

            form={form}

            layout="vertical"

            className="profile-form"

          >

            <Row gutter={16}>

              <Col span={24}>

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

                    size="large"

                    placeholder="Nhập họ tên"

                  />

                </Form.Item>

              </Col>


              <Col span={24}>

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

                    size="large"

                    placeholder="Nhập số điện thoại"

                  />

                </Form.Item>

              </Col>


              <Col span={24}>

                <Form.Item

                  name="areaId"

                  label="Khu vực"

                  rules={[
                    {
                      required: true,
                      message: "Nhập areaId"
                    }
                  ]}

                >

                  <Input

                    prefix={<EnvironmentOutlined />}

                    size="large"

                    type="number"

                    placeholder="Nhập Area ID"

                  />

                </Form.Item>

              </Col>

            </Row>


            <Button

              type="primary"

              block

              size="large"

              icon={<SaveOutlined />}

              loading={loading}

              onClick={handleUpdate}

              className="profile-save-btn"

            >

              Cập nhật thông tin

            </Button>

          </Form>

        </>

      }

    </Modal>

  );

}