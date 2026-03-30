import { useEffect, useState } from "react";
import {
  Select,
  Table,
  Space,
  Tabs,
  message,
  Button,
  Popconfirm,
} from "antd";

import {
  getAllWarehouses,
  getAllReliefItems,
  getWarehouseInventory,
  deleteWarehouse,
  deleteReliefItem,
} from "../../../../api/axios/ManagerApi/inventoryApi";

import CreateWarehouseModal from "./CreateWarehouseModal/CreateWarehouseModal";
import EditWarehouseModal from "./EditWarehouseModal/EditWarehouseModal";
import CreateReliefItemModal from "./CreateReliefItemModal/CreateReliefItemModal";
import EditReliefItemModal from "./EditReliefItemModal/EditReliefItemModal";

export default function InventoryManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [openCreateWarehouse, setOpenCreateWarehouse] = useState(false);
  const [openEditWarehouse, setOpenEditWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [openCreateItem, setOpenCreateItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ================= LOAD ALL =================
  async function loadAll(preferredTab = "") {
    try {
      const [w, i] = await Promise.all([
        getAllWarehouses(),
        getAllReliefItems(),
      ]);

      const warehouseData = w.data.map((x) => ({
        ...x,
        id: x.id || x.warehouseId,
      }));

      setWarehouses(warehouseData);
      setItems(i.data.map((x) => ({ ...x, id: x.id || x.reliefItemId })));

      if (preferredTab === "warehouses") {
        setActiveTab("warehouses");
        return;
      }

      if (preferredTab === "items") {
        setActiveTab("items");
        return;
      }

      if (preferredTab?.startsWith("warehouse-")) {
        const preferredId = Number(preferredTab.split("-")[1]);
        const hasPreferredWarehouse = warehouseData.some((x) => x.id === preferredId);

        if (hasPreferredWarehouse) {
          setSelectedWarehouseId(preferredId);
          setActiveTab(preferredTab);
          loadInventory(preferredId);
          return;
        }
      }

      if (warehouseData.length > 0) {
        const firstId = warehouseData[0].id;
        setSelectedWarehouseId(firstId);
        setActiveTab(`warehouse-${firstId}`);
        loadInventory(firstId);
      } else {
        setSelectedWarehouseId(null);
        setInventory([]);
        setActiveTab("warehouses");
      }
    } catch {
      message.error("Lỗi tải dữ liệu");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // ================= INVENTORY =================
  const loadInventory = async (warehouseId) => {
    try {
      const res = await getWarehouseInventory(warehouseId);

      setInventory(
        res.data.map((x, index) => ({
          key: `${warehouseId}-${index}`,
          itemName: x.itemName,
          quantity: x.quantity,
        }))
      );
    } catch {
      message.error("Lỗi tải tồn kho");
    }
  };

  const handleSelectWarehouse = (id) => {
    setSelectedWarehouseId(id);
    setActiveTab(`warehouse-${id}`);
    loadInventory(id);
  };

  // ================= DELETE WAREHOUSE =================
  const handleDeleteWarehouse = async (id) => {
    try {
      await deleteWarehouse(id);
      message.success("Xóa kho hàng thành công!");
      await loadAll("warehouses");
    } catch (err) {
      message.error(err.message || "Xóa kho hàng thất bại");
    }
  };

  // ================= DELETE RELIEF ITEM =================
  const handleDeleteItem = async (id) => {
    try {
      await deleteReliefItem(id);
      message.success("Xóa vật phẩm thành công!");
      await loadAll("items");
    } catch (err) {
      message.error(err.message || "Xóa vật phẩm thất bại");
    }
  };

  // ================= TABLE =================

  // 👉 Kho (đã bỏ Khu vực)
  const warehouseColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên kho", dataIndex: "warehouseName" },
    { title: "Vị trí", dataIndex: "locationDescription" },
    {
      title: "Ngân sách",
      dataIndex: "availableBudget",
      render: (v) => v?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => {
              setSelectedWarehouse(record);
              setOpenEditWarehouse(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa kho?"
            description="Bạn có chắc chắn muốn xóa kho hàng này?"
            onConfirm={() => handleDeleteWarehouse(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 👉 Item
  const itemColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên item", dataIndex: "itemName" },
    { title: "Đơn vị", dataIndex: "unit" },
    {
      title: "Giá tiền",
      dataIndex: "cost",
      render: (v) => (v ? v.toLocaleString("vi-VN") + " ₫" : "—"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => {
              setSelectedItem(record);
              setOpenEditItem(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa vật phẩm?"
            description="Bạn có chắc chắn muốn xóa vật phẩm này?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 👉 Tồn kho
  const inventoryColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Tên item", dataIndex: "itemName" },
    { title: "Số lượng", dataIndex: "quantity" },
  ];

  // 👉 Tabs theo từng kho (click được)
  const warehouseTabs = warehouses.map((w) => ({
    key: `warehouse-${w.id}`,
    label: w.warehouseName,
    children: (
      <Table
        columns={inventoryColumns}
        dataSource={inventory}
        pagination={false}
      />
    ),
  }));

  return (
    <div style={{ padding: 20 }}>
    

      {/* <Space style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 250 }}
          placeholder="Chọn kho để xem tồn kho"
          value={selectedWarehouseId}
          options={warehouses.map((w) => ({
            value: w.id,
            label: w.warehouseName,
          }))}
          onChange={handleSelectWarehouse}
        />
      </Space> */}

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);

          // 👉 Khi click tab kho → load inventory
          if (key.startsWith("warehouse-")) {
            const id = key.split("-")[1];
            loadInventory(id);
          }
        }}
        items={[
          {
            key: "warehouses",
            label: "Danh sách kho",
            children: (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => setOpenCreateWarehouse(true)}
                  >
                    + Tạo kho mới
                  </Button>
                </div>
                <Table columns={warehouseColumns} dataSource={warehouses} />
              </div>
            ),
          },
          {
            key: "items",
            label: "Danh sách item",
            children: (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => setOpenCreateItem(true)}
                  >
                    + Tạo vật phẩm mới
                  </Button>
                </div>
                <Table columns={itemColumns} dataSource={items} />
              </div>
            ),
          },
          ...warehouseTabs,
        ]}
      />

      {/* CREATE WAREHOUSE MODAL */}
      <CreateWarehouseModal
        open={openCreateWarehouse}
        onClose={() => setOpenCreateWarehouse(false)}
        onSuccess={async () => {
          await loadAll("warehouses");
          setActiveTab("warehouses");
          setOpenCreateWarehouse(false);
        }}
      />

      {/* EDIT WAREHOUSE MODAL */}
      <EditWarehouseModal
        open={openEditWarehouse}
        onClose={() => {
          setOpenEditWarehouse(false);
          setSelectedWarehouse(null);
        }}
        warehouse={selectedWarehouse}
        onSuccess={async () => {
          await loadAll("warehouses");
          setActiveTab("warehouses");
          setOpenEditWarehouse(false);
          setSelectedWarehouse(null);
        }}
      />

      {/* CREATE RELIEF ITEM MODAL */}
      <CreateReliefItemModal
        open={openCreateItem}
        onClose={() => setOpenCreateItem(false)}
        onSuccess={async () => {
          await loadAll("items");
          setActiveTab("items");
          setOpenCreateItem(false);
        }}
      />

      {/* EDIT RELIEF ITEM MODAL */}
      <EditReliefItemModal
        open={openEditItem}
        onClose={() => {
          setOpenEditItem(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSuccess={async () => {
          await loadAll("items");
          setActiveTab("items");
          setOpenEditItem(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}