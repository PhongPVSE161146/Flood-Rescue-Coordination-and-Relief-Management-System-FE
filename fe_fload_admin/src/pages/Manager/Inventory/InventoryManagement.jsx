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

export default function InventoryManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

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

  /* ================= LOAD ================= */

  const loadAll = async () => {
    try {
      const [w, i, t] = await Promise.all([
        getAllWarehouses(),
        getAllReliefItems(),
        getInventoryTransactions(),
      ]);

      setWarehouses(
        w.data.map((x) => ({
          ...x,
          id: x.id || x.warehouseId,
        }))
      );

      setItems(
        i.data.map((x) => ({
          ...x,
          id: x.id || x.reliefItemId,
        }))
      );

      setTransactions(
        t.data.map((x) => ({
          ...x,
          id: x.id || x.transactionId,
        }))
      );
    } catch {
      message.error("Load dữ liệu thất bại");
    }
  };

  /* ================= INVENTORY ================= */

  const handleSelectWarehouseInventory = async (warehouseId) => {
    setSelectedWarehouseId(warehouseId);
    if (!warehouseId) return;

    try {
      const res = await getWarehouseInventory(warehouseId);
      setInventory(
        res.data.map((x, index) => ({
          key: index,
          itemName: x.itemName,
          quantity: x.quantity,
        }))
      );
    } catch {
      message.error("Load inventory thất bại");
    }
  };

  /* ================= WAREHOUSE ================= */

  const handleSaveWarehouse = async (values) => {
    try {
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.id, values);
      } else {
        await createWarehouse(values);
      }
      setWarehouseDrawer(false);
      setEditingWarehouse(null);
      form.resetFields();
      loadAll();
    } catch {
      message.error("Lưu warehouse thất bại");
    }
  };

  const handleDeleteWarehouse = async (id) => {
    if (!id) return;

    try {
      await deleteWarehouse(id);
      message.success("Xoá kho thành công");
      loadAll();
    } catch (err) {
      if (err.response?.status === 409) {
        message.error("Kho đang còn vật phẩm, không được xoá");
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
      setItemDrawer(false);
      setEditingItem(null);
      itemForm.resetFields();
      loadAll();
    } catch {
      message.error("Lưu item thất bại");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!id) return;

    try {
      await deleteReliefItem(id);
      message.success("Xoá vật phẩm thành công");
      loadAll();
    } catch (err) {
      if (err.response?.status === 409) {
        message.error("Vật phẩm đang được sử dụng, không được xoá");
      } else {
        message.error("Xoá vật phẩm thất bại");
      }
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
    if (!id) return;
    await confirmInventoryTransaction(id);
    loadAll();
  };

  /* ================= COLUMNS ================= */

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
          <Button danger onClick={() => handleDeleteWarehouse(record.id)}>
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
          <Button danger onClick={() => handleDeleteItem(record.id)}>
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
      render: (_, record) => (
        <Button onClick={() => handleConfirmTransaction(record.id)}>
          Confirm
        </Button>
      ),
    },
  ];

  /* ================= TABS ================= */

  const tabItems = [
    {
      key: "1",
      label: "Kho",
      children: (
        <>
          <Button type="primary" onClick={() => setWarehouseDrawer(true)}>
            Add Warehouse
          </Button>
          <Table rowKey="id" columns={warehouseColumns} dataSource={warehouses} />
        </>
      ),
    },
    {
      key: "2",
      label: "Relief Items",
      children: (
        <>
          <Button type="primary" onClick={() => setItemDrawer(true)}>
            Add Item
          </Button>
          <Table rowKey="id" columns={itemColumns} dataSource={items} />
        </>
      ),
    },
    {
      key: "3",
      label: "Tồn kho",
      children: (
        <>
          <Select
            placeholder="Chọn kho"
            style={{ width: 300, marginBottom: 16 }}
            options={warehouses.map((w) => ({
              value: w.id,
              label: w.warehouseName,
            }))}
            onChange={handleSelectWarehouseInventory}
          />
          <Table
            rowKey="key"
            columns={[
              { title: "Item", dataIndex: "itemName" },
              { title: "Quantity", dataIndex: "quantity" },
            ]}
            dataSource={inventory}
          />
        </>
      ),
    },
    {
      key: "4",
      label: "Giao dịch",
      children: (
        <>
          <Button type="primary" onClick={() => setTransactionDrawer(true)}>
            Create Transaction
          </Button>
          <Table
            rowKey="id"
            columns={transactionColumns}
            dataSource={transactions}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Inventory Management</h2>
      <Tabs items={tabItems} />
      {/* Giữ nguyên toàn bộ Drawer phía dưới như bạn gửi */}
      {/* ================= WAREHOUSE DRAWER ================= */}
<Drawer
  title={editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
  open={warehouseDrawer}
  onClose={() => {
    setWarehouseDrawer(false);
    setEditingWarehouse(null);
    form.resetFields();
  }}
  width={400}
>
  <Form form={form} layout="vertical" onFinish={handleSaveWarehouse}>
    <Form.Item
      label="Warehouse Name"
      name="warehouseName"
      rules={[{ required: true, message: "Nhập tên kho" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Location Description"
      name="locationDescription"
      rules={[{ required: true, message: "Nhập địa điểm" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Area ID"
      name="areaId"
      rules={[{ required: true, message: "Nhập Area ID" }]}
    >
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>

    <Button type="primary" htmlType="submit" block>
      {editingWarehouse ? "Update" : "Create"}
    </Button>
  </Form>
</Drawer>
{/* ================= ITEM DRAWER ================= */}
<Drawer
  title={editingItem ? "Edit Relief Item" : "Add Relief Item"}
  open={itemDrawer}
  onClose={() => {
    setItemDrawer(false);
    setEditingItem(null);
    itemForm.resetFields();
  }}
  width={400}
>
  <Form form={itemForm} layout="vertical" onFinish={handleSaveItem}>
    <Form.Item
      label="Item Name"
      name="itemName"
      rules={[{ required: true, message: "Nhập tên vật phẩm" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Unit"
      name="unit"
      rules={[{ required: true, message: "Nhập đơn vị" }]}
    >
      <Input />
    </Form.Item>

    <Button type="primary" htmlType="submit" block>
      {editingItem ? "Update" : "Create"}
    </Button>
  </Form>
</Drawer>
{/* ================= TRANSACTION DRAWER ================= */}
<Drawer
  title="Create Inventory Transaction"
  open={transactionDrawer}
  onClose={() => {
    setTransactionDrawer(false);
    transactionForm.resetFields();
  }}
  width={600}
>
  <Form
    form={transactionForm}
    layout="vertical"
    onFinish={handleCreateTransaction}
  >
    <Form.Item
      label="Warehouse"
      name="warehouseId"
      rules={[{ required: true, message: "Chọn kho" }]}
    >
      <Select
        options={warehouses.map((w) => ({
          value: w.id,
          label: w.warehouseName,
        }))}
      />
    </Form.Item>

    <Form.Item
      label="Rescue Request ID"
      name="rescueRequestId"
      rules={[{ required: true, message: "Nhập Rescue Request ID" }]}
    >
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>

    <Form.Item
      label="Transaction Type"
      name="transactionType"
      rules={[{ required: true, message: "Chọn loại giao dịch" }]}
    >
      <Select
        options={[
          { value: "IN", label: "IN" },
          { value: "OUT", label: "OUT" },
        ]}
      />
    </Form.Item>

    <Form.Item label="Note" name="note">
      <Input />
    </Form.Item>

    {/* Dynamic Lines */}
    <Form.List name="lines">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, "reliefItemId"]}
                rules={[{ required: true, message: "Chọn item" }]}
              >
                <Select
                  placeholder="Item"
                  style={{ width: 200 }}
                  options={items.map((i) => ({
                    value: i.id,
                    label: i.itemName,
                  }))}
                />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "quantity"]}
                rules={[{ required: true, message: "Nhập số lượng" }]}
              >
                <InputNumber placeholder="Quantity" min={1} />
              </Form.Item>

              <Button danger onClick={() => remove(name)}>
                X
              </Button>
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} block>
              + Add Item
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>

    <Button type="primary" htmlType="submit" block>
      Create Transaction
    </Button>
  </Form>
</Drawer>
    </>
  );
}