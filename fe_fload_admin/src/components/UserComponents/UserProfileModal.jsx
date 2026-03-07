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
  Avatar,
  Select,
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
  updateUserProfile,
  getProvinces
} from "../../../api/axios/Auth/authApi";

import "./UserProfileModal.css";

import AuthNotify from "../../utils/Common/AuthNotify";
export default function UserProfileModal({
  open,
  onClose
}) {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  const [userId, setUserId] = useState(null);

  const [userName, setUserName] = useState("");

  const [provinces, setProvinces] = useState([]);
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
      AuthNotify.error(
        "Không tải được thông tin cá nhân",
        "Vui lòng thử lại"
      );  

    }
    finally {

      setFetching(false);

    }

  };

  const validatePhoneVN = (_, value) => {

    if (!value) {
      return Promise.reject("Vui lòng nhập số điện thoại");
    }
  
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
  
    if (!phoneRegex.test(value)) {
      return Promise.reject(
        "Số điện thoại phải gồm 10 số và đúng đầu số Việt Nam"
      );
    }
  
    return Promise.resolve();
  };

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      const data = res.data || res;
  
      setProvinces(data);
  
    } catch (error) {
      console.error(error);
      AuthNotify.error(
        "Không tải được khu vực",
        "Vui lòng thử lại"
      );
    }
  };
  useEffect(() => {
    if (open) {
      fetchProfile();
      fetchProvinces();
    }
  }, [open]);


  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    

    try {

      if (!userId) {

        AuthNotify.error(
          "Lỗi người dùng",
          "Không xác định được người dùng"
        );

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

      AuthNotify.success(
        "Cập nhật thành công",
        "Thông tin cá nhân đã được cập nhật"
      );

      onClose();

    }
    catch (error) {

      console.error(error);

      AuthNotify.error(
        "Cập nhật thất bại",
        "Không thể cập nhật thông tin"
      );

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
  validateTrigger="onChange"
  rules={[
    {
      validator: validatePhoneVN
    }
  ]}
>

  <Input
    prefix={<PhoneOutlined />}
    size="large"
    placeholder="VD: 0901234567"
    maxLength={10}

    onChange={(e) => {

      const onlyNumber =
        e.target.value.replace(/\D/g, "");

      form.setFieldsValue({
        phone: onlyNumber
      });

    }}
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

<Select
  size="large"
  placeholder="Chọn tỉnh/thành"
  suffixIcon={<EnvironmentOutlined />}
  options={provinces.map(item => ({
    label: item.name,   // tên tỉnh
    value: item.id      // areaId
  }))}
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