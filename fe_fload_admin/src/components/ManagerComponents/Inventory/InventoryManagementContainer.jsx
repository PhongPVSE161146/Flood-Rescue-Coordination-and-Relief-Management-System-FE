import { useEffect, useState } from "react";
import {
  Select,
  Table,
  Space,
  Tabs,
  message,
} from "antd";

import {
  getAllWarehouses,
  getAllReliefItems,
  getWarehouseInventory,
} from "../../../../api/axios/ManagerApi/inventoryApi";

export default function InventoryManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [activeTab, setActiveTab] = useState("");

  // ================= LOAD ALL =================
  async function loadAll() {
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

      if (warehouseData.length > 0) {
        const firstId = warehouseData[0].id;
        setSelectedWarehouseId(firstId);
        setActiveTab(`warehouse-${firstId}`);
        loadInventory(firstId);
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
  ];

  // 👉 Item
  const itemColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên item", dataIndex: "itemName" },
    { title: "Đơn vị", dataIndex: "unit" },
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
          ...warehouseTabs,
          {
            key: "warehouses",
            label: "Danh sách kho",
            children: (
              <Table columns={warehouseColumns} dataSource={warehouses} />
            ),
          },
          {
            key: "items",
            label: "Danh sách item",
            children: (
              <Table columns={itemColumns} dataSource={items} />
            ),
          },
        ]}
      />
    </div>
  );
}