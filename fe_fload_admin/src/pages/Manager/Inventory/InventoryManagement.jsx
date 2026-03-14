import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Space,
  Tabs,
  message,
  Card,
  Row,
  Col
} from "antd";

import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getAllReliefItems,
  createReliefItem,
  updateReliefItem,
  deleteReliefItem,
  getInventoryTransactions,
  createInventoryTransaction,
  confirmInventoryTransaction,
  getWarehouseInventory,
} from "../../../../api/axios/ManagerApi/inventoryApi";

import "./InventoryManagement.css";

export default function InventoryManagement() {

  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [activeTab, setActiveTab] = useState("");

  const [warehouseDrawer, setWarehouseDrawer] = useState(false);
  const [itemDrawer, setItemDrawer] = useState(false);
  const [transactionDrawer, setTransactionDrawer] = useState(false);

  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [transactionForm] = Form.useForm();

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= LOAD DATA ================= */

  /* ================= MOCK DATA FALLBACK ================= */

  const MOCK_WAREHOUSES = [
    { warehouseId: 1, warehouseName: "Kho Tổng TP.HCM", locationDescription: "Quận 7, TP.HCM", areaId: 1 },
    { warehouseId: 2, warehouseName: "Kho Dự Phòng Miền Trung", locationDescription: "Đà Nẵng", areaId: 2 },
    { warehouseId: 3, warehouseName: "Kho Cứu Trợ Hà Nội", locationDescription: "Cầu Giấy, Hà Nội", areaId: 3 },
  ];

  const MOCK_RELIEF_ITEMS = [
    { reliefItemId: 1, itemName: "Mì tôm", unit: "Thùng" },
    { reliefItemId: 2, itemName: "Nước suối (500ml)", unit: "Chai" },
    { reliefItemId: 3, itemName: "Áo phao", unit: "Cái" },
    { reliefItemId: 4, itemName: "Gạo", unit: "Bao 10kg" },
    { reliefItemId: 5, itemName: "Thuốc y tế cơ bản", unit: "Hộp" },
  ];

  const MOCK_INVENTORY = {
    1: [
      { itemName: "Mì tôm", quantity: 500 },
      { itemName: "Nước suối (500ml)", quantity: 2000 },
      { itemName: "Áo phao", quantity: 150 },
    ],
    2: [
      { itemName: "Mì tôm", quantity: 300 },
      { itemName: "Gạo", quantity: 100 },
      { itemName: "Nước suối (500ml)", quantity: 1000 },
    ],
    3: [
      { itemName: "Áo phao", quantity: 200 },
      { itemName: "Thuốc y tế cơ bản", quantity: 50 },
      { itemName: "Mì tôm", quantity: 450 },
    ]
  };

  /* ================= LOAD DATA ================= */

  const loadAll = async () => {
    try {
      console.log("Starting loadAll items...");

      const fetchWarehouses = async () => {
        try {
          const res = await getAllWarehouses();
          console.log("Warehouses loaded from API:", res.data);
          return (Array.isArray(res.data) && res.data.length > 0) ? res.data : MOCK_WAREHOUSES;
        } catch (err) {
          console.warn("Failed to load warehouses from API, using MOCK:", err);
          return MOCK_WAREHOUSES;
        }
      };

      const fetchItems = async () => {
        try {
          const res = await getAllReliefItems();
          console.log("Relief items loaded from API:", res.data);
          return (Array.isArray(res.data) && res.data.length > 0) ? res.data : MOCK_RELIEF_ITEMS;
        } catch (err) {
          console.warn("Failed to load relief items from API, using MOCK:", err);
          return MOCK_RELIEF_ITEMS;
        }
      };

      const fetchTransactions = async () => {
        try {
          const res = await getInventoryTransactions();
          console.log("Transactions loaded:", res.data);
          return res.data || [];
        } catch (err) {
          console.error("Failed to load transactions:", err);
          return [];
        }
      };

      const [w, i, t] = await Promise.all([
        fetchWarehouses(),
        fetchItems(),
        fetchTransactions(),
      ]);

      const warehouseData = w.map((x) => ({
        ...x,
        id: x.id || x.warehouseId,
      }));

      setWarehouses(warehouseData);

      if (warehouseData.length > 0) {
        const firstId = warehouseData[0].id;
        setSelectedWarehouseId(firstId);
        setActiveTab(`warehouse-${firstId}`);
        handleSelectWarehouseInventory(firstId);
      }

      setItems(
        i.map((x) => ({
          ...x,
          id: x.id || x.reliefItemId,
        }))
      );

      setTransactions(
        t.map((x) => ({
          ...x,
          id: x.id || x.transactionId,
        }))
      );

    } catch (err) {
      console.error("General error in loadAll:", err);
      message.error("Có lỗi xảy ra khi xử lý dữ liệu");
    }
  };

  /* ================= INVENTORY ================= */

  const handleSelectWarehouseInventory = async (warehouseId) => {
    setSelectedWarehouseId(warehouseId);
    setActiveTab(`warehouse-${warehouseId}`);

    try {
      console.log(`Loading inventory for warehouse: ${warehouseId}...`);
      const res = await getWarehouseInventory(warehouseId);
      
      let data = res.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`API returned empty inventory for ${warehouseId}, using MOCK.`);
        data = MOCK_INVENTORY[warehouseId] || [];
      }

      setInventory(
        data.map((x, index) => ({
          key: index,
          itemName: x.itemName,
          quantity: x.quantity,
        }))
      );

    } catch (err) {
      console.error(`Failed to load inventory for warehouse ${warehouseId}:`, err);
      console.warn("Using MOCK inventory fallback.");
      const mockResult = MOCK_INVENTORY[warehouseId] || [];
      setInventory(
        mockResult.map((x, index) => ({
          key: index,
          itemName: x.itemName,
          quantity: x.quantity,
        }))
      );
    }
  };

  /* ================= TRANSACTION FILTER ================= */

  const inTransactions = transactions.filter(
    (t) => t.transactionType === "IN"
  );

  const pendingTransactions = inTransactions.filter(
    (t) => !t.confirmedAt && !t.confirmed_at
  );

  const confirmedTransactions = inTransactions.filter(
    (t) => t.confirmedAt || t.confirmed_at
  );

  /* ================= WAREHOUSE ================= */

  const handleSaveWarehouse = async (values) => {

    try {

      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, values);
      } else {
        await createWarehouse(values);
      }

      message.success("Lưu warehouse thành công");

      setWarehouseDrawer(false);
      setEditingWarehouse(null);
      form.resetFields();
      loadAll();

    } catch {
      message.error("Lưu warehouse thất bại");
    }
  };

  const handleDeleteWarehouse = async (id) => {

    try {

      await deleteWarehouse(id);
      message.success("Xoá kho thành công");
      loadAll();

    } catch (err) {

      if (err.response?.status === 409) {
        message.error("Kho đang còn vật phẩm");
      } else {
        message.error("Xoá kho thất bại");
      }
    }
  };

  /* ================= ITEM ================= */

  const handleSaveItem = async (values) => {

    try {

      if (editingItem) {
        await updateReliefItem(editingItem.id, values);
      } else {
        await createReliefItem(values);
      }

      message.success("Lưu item thành công");

      setItemDrawer(false);
      setEditingItem(null);
      itemForm.resetFields();
      loadAll();

    } catch {
      message.error("Lưu item thất bại");
    }
  };

  const handleDeleteItem = async (id) => {

    try {
      await deleteReliefItem(id);
      message.success("Xoá item thành công");
      loadAll();
    } catch {
      message.error("Xoá item thất bại");
    }
  };

  /* ================= TRANSACTION ================= */

  const handleCreateTransaction = async (values) => {

    try {

      await createInventoryTransaction(values);

      message.success("Tạo transaction thành công");

      setTransactionDrawer(false);
      transactionForm.resetFields();
      loadAll();

    } catch {
      message.error("Tạo transaction thất bại");
    }
  };

  const handleConfirmTransaction = async (id) => {

    try {

      await confirmInventoryTransaction(id);

      message.success("Confirm thành công");

      loadAll();

      if (selectedWarehouseId) {
        handleSelectWarehouseInventory(selectedWarehouseId);
      }

    } catch {
      message.error("Confirm thất bại");
    }
  };

  /* ================= TABLE COLUMNS ================= */

  const warehouseColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "warehouseName" },
    { title: "Location", dataIndex: "locationDescription" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>

          <Button
            onClick={() => {
              setEditingWarehouse(record);
              form.setFieldsValue(record);
              setWarehouseDrawer(true);
            }}
          >
            Edit
          </Button>

          <Button
            danger
            onClick={() => handleDeleteWarehouse(record.id)}
          >
            Delete
          </Button>

        </Space>
      ),
    },
  ];

  const itemColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "itemName" },
    { title: "Unit", dataIndex: "unit" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>

          <Button
            onClick={() => {
              setEditingItem(record);
              itemForm.setFieldsValue(record);
              setItemDrawer(true);
            }}
          >
            Edit
          </Button>

          <Button
            danger
            onClick={() => handleDeleteItem(record.id)}
          >
            Delete
          </Button>

        </Space>
      ),
    },
  ];

  const transactionColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Warehouse", dataIndex: "warehouseId" },
    { title: "Type", dataIndex: "transactionType" },
    {
      title: "Action",
      render: (_, record) =>
        record.confirmedAt || record.confirmed_at ? (
          <span style={{ color: "green", fontWeight: "bold" }}>
            Confirmed
          </span>
        ) : (
          <Button
            type="primary"
            onClick={() => handleConfirmTransaction(record.id)}
          >
            Confirm
          </Button>
        ),
    },
  ];

  /* ================= WAREHOUSE INVENTORY TABS ================= */

  const warehouseTabs = warehouses.map((w) => ({
    key: `warehouse-${w.id}`,
    label: w.warehouseName,
    children: (
      <div className="inventory-card">

        <Row gutter={[16, 16]}>
  {inventory.map((item) => (
    <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
      <Card className="inventory-item-card" hoverable>

        <h3>{item.itemName}</h3>

        <p className="inventory-quantity">
          {item.quantity}
        </p>

        <span className="inventory-label">
          Available
        </span>

      </Card>
    </Col>
  ))}
</Row>

      </div>
    ),
  }));

  /* ================= UI ================= */

  return (
    <div className="inventory-page">

      <div className="inventory-header">

        <div className="inventory-title">
          <h2>📦 Inventory Management</h2>
          <p>Quản lý kho cứu trợ</p>
        </div>

        <Space>

          <Select
            style={{ width: 220 }}
            value={selectedWarehouseId}
            placeholder="Chọn kho"
            options={warehouses.map((w) => ({
              value: w.id,
              label: w.warehouseName,
            }))}
            onChange={handleSelectWarehouseInventory}
          />

          <Button
            type="primary"
            onClick={() => {
              setEditingWarehouse(null);
              form.resetFields();
              setWarehouseDrawer(true);
            }}
          >
            Thêm kho
          </Button>

          <Button onClick={() => setActiveTab("warehouses")}>
            Warehouses
          </Button>

          <Button onClick={() => setActiveTab("items")}>
            Relief Items
          </Button>

          <Button
            type="primary"
            onClick={() => setActiveTab("transactions")}
          >
            Giao dịch
          </Button>

        </Space>
      </div>

      <Tabs
  activeKey={activeTab}
  renderTabBar={() => null}   // ẨN THANH TAB
  onChange={(key) => {

    setActiveTab(key);

    if (key.startsWith("warehouse-")) {
      const id = key.split("-")[1];
      handleSelectWarehouseInventory(id);
    }
  }}
  items={[

          ...warehouseTabs,

          {
            key: "warehouses",
            label: "Warehouses",
            children: (
              <div className="inventory-card">
                <Table
                  rowKey="id"
                  columns={warehouseColumns}
                  dataSource={warehouses}
                />
              </div>
            ),
          },

          {
            key: "items",
            label: "Relief Items",
            children: (
              <div className="inventory-card">

                <Button
                  type="primary"
                  style={{ marginBottom: 16 }}
                  onClick={() => setItemDrawer(true)}
                >
                  Add Item
                </Button>

                <Table
                  rowKey="id"
                  columns={itemColumns}
                  dataSource={items}
                />

              </div>
            ),
          },

         {
  key: "transactions",
  label: "Giao dịch",
  children: (
    <div className="inventory-card">

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setTransactionDrawer(true)}
      >
        Tạo Transaction
      </Button>

      <Tabs
                  items={[
                    {
                      key: "pending",
                      label: `Pending (${pendingTransactions.length})`,
                      children: (
                        <Table
                          rowKey="id"
                          columns={transactionColumns}
                          dataSource={pendingTransactions}
                        />
                      ),
                    },
                    {
                      key: "confirmed",
                      label: `Confirmed (${confirmedTransactions.length})`,
                      children: (
                        <Table
                          rowKey="id"
                          columns={transactionColumns}
                          dataSource={confirmedTransactions}
                        />
                      ),
                    },
                  ]}
                />

              </div>
            ),
          },
        ]}
      />

      {/* DRAWER WAREHOUSE */}

      <Drawer
        title={editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
        open={warehouseDrawer}
        onClose={() => setWarehouseDrawer(false)}
        width={420}
      >

        <Form form={form} layout="vertical" onFinish={handleSaveWarehouse}>

          <Form.Item
            label="Warehouse Name"
            name="warehouseName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location Description"
            name="locationDescription"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Area ID"
            name="areaId"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingWarehouse ? "Update" : "Create"}
          </Button>

        </Form>

      </Drawer>

      {/* DRAWER ITEM */}

      <Drawer
        title={editingItem ? "Edit Item" : "Add Item"}
        open={itemDrawer}
        onClose={() => setItemDrawer(false)}
        width={420}
      >

        <Form form={itemForm} layout="vertical" onFinish={handleSaveItem}>

          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editingItem ? "Update" : "Create"}
          </Button>
          
        </Form>

      </Drawer>
       <Drawer
  title="Create Transaction"
  open={transactionDrawer}
  onClose={() => setTransactionDrawer(false)}
  width={480}
>
<Form
  form={transactionForm}
  layout="vertical"
  onFinish={handleCreateTransaction}
>

<Form.Item
  label="Warehouse"
  name="warehouseId"
  rules={[{ required: true }]}
>
<Select
  options={warehouses.map((w) => ({
    value: w.id,
    label: w.warehouseName
  }))}
/>
</Form.Item>

<Form.Item
  label="Transaction Type"
  name="transactionType"
  initialValue="IN"
>
<Select
  options={[
    { value: "IN", label: "Nhập kho" },
    { value: "OUT", label: "Xuất kho" }
  ]}
/>
</Form.Item>

<Form.Item
  label="Rescue Request ID"
  name="rescueRequestId"
>
<InputNumber style={{ width: "100%" }} />
</Form.Item>

<Form.Item
  label="Note"
  name="note"
>
<Input />
</Form.Item>

{/* ITEM LIST */}

<Form.List name="lines">

{(fields, { add, remove }) => (

<>
{fields.map(({ key, name }) => (

<Row gutter={10} key={key}>

<Col span={12}>
<Form.Item
  name={[name, "reliefItemId"]}
  label="Item"
  rules={[{ required: true }]}
>
<Select
  options={items.map((i) => ({
    value: i.id,
    label: i.itemName
  }))}
/>
</Form.Item>
</Col>

<Col span={8}>
<Form.Item
  name={[name, "quantity"]}
  label="Quantity"
  rules={[{ required: true }]}
>
<InputNumber style={{ width: "100%" }} />
</Form.Item>
</Col>

<Col span={4} style={{ display: "flex", alignItems: "center" }}>
<Button danger onClick={() => remove(name)}>
X
</Button>
</Col>

</Row>

))}

<Button
type="dashed"
block
onClick={() => add()}
>
+ Add Item
</Button>

</>

)}

</Form.List>

<Button
type="primary"
htmlType="submit"
block
style={{ marginTop: 20 }}
>
Create Transaction
</Button>

</Form>

</Drawer>
    </div>
  );
}