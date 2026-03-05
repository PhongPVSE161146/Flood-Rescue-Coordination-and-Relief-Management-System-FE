import { useEffect, useState } from "react";
import {
  Button,
  Tag,
  Input,
  Progress,
  Modal,
  message,
  Card,
  Form,
  Select,
  Dropdown,
  Drawer,
  Pagination,
} from "antd";

import {
  ToolOutlined,
  StopOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  SearchOutlined
} from "@ant-design/icons";

import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../../../api/axios/ManagerApi/vehicleApi";

import "./VehicleManagement.css";

export default function VehicleManagement() {

  const [vehicleList, setVehicleList] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [form] = Form.useForm();

  /* ================= LOAD ================= */

  const loadVehicles = async () => {
    try {
      const res = await getAllVehicles({ q: search });
      setVehicleList(res.data || []);
    } catch {
      message.error("Không tải được vehicles");
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = () => {
    setCurrentPage(1);
    loadVehicles();
  };

  /* ================= CREATE ================= */

  const handleCreate = () => {
    setEditingVehicle(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, values);
        message.success("Cập nhật vehicle thành công");
      } else {
        await createVehicle(values);
        message.success("Tạo vehicle thành công");
      }

      setModalVisible(false);
      loadVehicles();

    } catch {
      message.error("Lưu thất bại");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    form.setFieldsValue(vehicle);
    setModalVisible(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = (vehicle) => {
    Modal.confirm({
      title: "Xóa vehicle?",
      content: vehicle.vehicleName,
      okType: "danger",
      async onOk() {
        await deleteVehicle(vehicle.id);
        message.success("Đã xóa");
        loadVehicles();
      },
    });
  };

  /* ================= STATUS ================= */

  const getStatusTag = (status) => {

    const map = {
      ready: { color: "green", text: "SẴN SÀNG" },
      maintenance: { color: "orange", text: "BẢO TRÌ" },
      stop: { color: "red", text: "DỪNG" },
      "ready-action": { color: "blue", text: "SẴN SÀNG HOẠT ĐỘNG" },
    };

    const data = map[status] || map.ready;

    return <Tag color={data.color}>{data.text}</Tag>;
  };

  /* ================= FILTER ================= */

  const filteredVehicles = vehicleList.filter((v) => {

    const matchStatus =
      filterStatus === "all" || v.vehicleStatus === filterStatus;

    const matchType =
      !filterType || v.vehicleType === filterType;

    const matchSearch =
      !search ||
      v.vehicleName?.toLowerCase().includes(search.toLowerCase()) ||
      v.plateNumber?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchType && matchSearch;
  });

  /* ================= PAGINATION ================= */

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + pageSize
  );

  /* ================= COUNT ================= */

  const count = (status) =>
    vehicleList.filter((v) => v.vehicleStatus === status).length;

  const total = vehicleList.length;
  const readyCount = count("ready");

  const realPercent = total ? Math.round((readyCount / total) * 100) : 0;

  /* ================= PROGRESS ================= */

  useEffect(() => {

    let i = 0;

    const interval = setInterval(() => {

      i += 1;

      if (i >= realPercent) {
        clearInterval(interval);
        setProgressPercent(realPercent);
      } else {
        setProgressPercent(i);
      }

    }, 10);

    return () => clearInterval(interval);

  }, [realPercent]);

  /* ================= ACTION MENU ================= */

  const actionMenu = (vehicle) => ({
    items: [
      {
        key: "edit",
        label: "Cập nhật",
        onClick: () => handleEdit(vehicle),
      },
      {
        key: "delete",
        label: "Xóa",
        danger: true,
        onClick: () => handleDelete(vehicle),
      },
    ],
  });

  /* ================= DRAWER ================= */

  const openDrawer = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerVisible(true);
  };

  /* ================= TYPE OPTIONS ================= */

  const typeOptions = [
    ...new Set(vehicleList.map(v => v.vehicleType))
  ].map(t => ({
    label: t,
    value: t
  }));

  /* ================================================= */

  return (
    <div className="vehicle-page">

      {/* PERFORMANCE */}

      <div className="vehicle-performance">

        <div className="performance-header">

          <div>
            <h3>Vehicle Performance</h3>
            <p>Total: {total}</p>
          </div>

          <span className="percentage">{progressPercent}%</span>

        </div>

        <Progress percent={progressPercent} showInfo={false} />

      </div>

      {/* SEARCH UI */}

      <div className="vehicle-search">

        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên hoặc biển số..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Loại xe"
          allowClear
          options={typeOptions}
          onChange={(v) => setFilterType(v)}
        />

        <Select
          placeholder="Trạng thái"
          allowClear
          onChange={(v) => setFilterStatus(v || "all")}
          options={[
            { value: "ready", label: "Sẵn sàng" },
            { value: "ready-action", label: "Ready Action" },
            { value: "maintenance", label: "Bảo trì" },
            { value: "stop", label: "Dừng" },
          ]}
        />

        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>

        <Button onClick={handleCreate}>
          Thêm phương tiện
        </Button>

      </div>

      {/* CARD GRID */}

      <div className="vehicle-grid">

        {paginatedVehicles.map((v) => (

          <Card
            key={v.id}
            className="vehicle-card"
            hoverable
            onClick={() => openDrawer(v)}
          >

            <div className="vehicle-card-header">

              <h3>{v.vehicleName}</h3>

              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown menu={actionMenu(v)} trigger={["click"]}>
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              </div>

            </div>

            <div className="vehicle-card-body">

              <p><b>Loại:</b> {v.vehicleType}</p>
              <p><b>Vị trí:</b> {v.vehicleLocation}</p>

              <div style={{ marginTop: 10 }}>
                {getStatusTag(v.vehicleStatus)}
              </div>

            </div>

          </Card>

        ))}

      </div>

      <Pagination
        style={{ marginTop: 20 }}
        current={currentPage}
        pageSize={pageSize}
        total={filteredVehicles.length}
        onChange={(page) => setCurrentPage(page)}
      />

      {/* MODAL */}

      <Modal
        title={editingVehicle ? "Cập nhật phương tiện" : "Thêm phương tiện"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >

        <Form form={form} layout="vertical">

          <Form.Item
            name="vehicleName"
            label="Tên phương tiện"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vehicleType"
            label="Loại phương tiện"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vehicleLocation"
            label="Vị trí"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vehicleStatus"
            label="Trạng thái"
          >
            <Select
              options={[
                { value: "ready", label: "Sẵn sàng" },
                { value: "ready-action", label: "Ready Action" },
                { value: "maintenance", label: "Bảo trì" },
                { value: "stop", label: "Dừng" },
              ]}
            />
          </Form.Item>

        </Form>

      </Modal>

      {/* DRAWER */}

      <Drawer
        title="Chi tiết phương tiện"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
      >

        {selectedVehicle && (

          <div className="drawer-content">

            <p><b>Mã:</b> {selectedVehicle.id}</p>
            <p><b>Tên xe:</b> {selectedVehicle.vehicleName}</p>
            <p><b>Loại xe:</b> {selectedVehicle.vehicleType}</p>
            <p><b>Vị trí:</b> {selectedVehicle.vehicleLocation}</p>
            <p><b>Trạng thái:</b> {getStatusTag(selectedVehicle.vehicleStatus)}</p>

          </div>

        )}

      </Drawer>

    </div>
  );
}