import { useEffect, useState } from "react";
import "../../../pages/Manager/PeriodicAid/PeriodicAidManagement.css";
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Space, message, Select, DatePicker, Tag, Popconfirm } from "antd";
import dayjs from "dayjs";

import {
  getAllPeriodicAidCampaigns, createPeriodicAidCampaign, updatePeriodicAidCampaign, deletePeriodicAidCampaign,
  getBeneficiariesByCampaign, createBeneficiary, updateBeneficiary, deleteBeneficiary,
  getSupplyPlansByCampaign, createSupplyPlan, updateSupplyPlan, deleteSupplyPlan,
  getDistributionsByCampaign, createDistribution, updateDistribution, deleteDistribution,
  getDistributionDetailsByDistribution, createDistributionDetail, updateDistributionDetail, deleteDistributionDetail
} from "../../../../api/axios/ManagerApi/periodicAidApi";

import {
  getInventoryTransactions,
  createInventoryTransaction,
  confirmInventoryTransaction,
  getAllWarehouses,
  getAllReliefItems
} from "../../../../api/axios/ManagerApi/inventoryApi";

export default function PeriodicAidManagementContainer() {
  const [activeTab, setActiveTab] = useState("campaigns");

  // Data states
  const [campaigns, setCampaigns] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [supplyPlans, setSupplyPlans] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [distributionDetails, setDistributionDetails] = useState([]);
  const [inventoryTransactions, setInventoryTransactions] = useState([]);

  // Selection states for filtering sub-lists
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedDistributionId, setSelectedDistributionId] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [isSupplyPlanModalOpen, setIsSupplyPlanModalOpen] = useState(false);
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [warehouses, setWarehouses] = useState([]);
  const [reliefItems, setReliefItems] = useState([]);

  const [formCampaign] = Form.useForm();
  const [formBeneficiary] = Form.useForm();
  const [formSupplyPlan] = Form.useForm();
  const [formDistribution] = Form.useForm();
  const [formDetail] = Form.useForm();
  const [formTransaction] = Form.useForm();

  // Current user info
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  const currentUserId = Number(user?.userId || user?.id || 0);

  useEffect(() => {
    loadCampaigns();
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      const [wRes, iRes] = await Promise.all([
        getAllWarehouses(),
        getAllReliefItems()
      ]);
      setWarehouses(wRes.data || []);
      setReliefItems(iRes.data || []);
    } catch {
      console.log("Failed to load warehouses/items");
    }
  };

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await getAllPeriodicAidCampaigns();
      setCampaigns(res.data || []);
    } catch {
      message.error("Lỗi khi tải danh sách chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  const loadBeneficiaries = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await getBeneficiariesByCampaign(campaignId);
      setBeneficiaries(res.data || []);
    } catch {
      message.error("Lỗi tải danh sách người nhận");
    } finally {
      setLoading(false);
    }
  };

  const loadSupplyPlans = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await getSupplyPlansByCampaign(campaignId);
      setSupplyPlans(res.data || []);
    } catch {
      message.error("Lỗi tải kế hoạch cung cấp");
    } finally {
      setLoading(false);
    }
  };

  const loadDistributions = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await getDistributionsByCampaign(campaignId);
      setDistributions(res.data || []);
    } catch {
      message.error("Lỗi tải đợt phân phát");
    } finally {
      setLoading(false);
    }
  };

  const loadDistributionDetails = async (distributionId) => {
    if (!distributionId) return;
    setLoading(true);
    try {
      const res = await getDistributionDetailsByDistribution(distributionId);
      setDistributionDetails(res.data || []);
    } catch {
      message.error("Lỗi tải chi tiết đợt phân phát");
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryTransactions = async () => {
    setLoading(true);
    try {
      const res = await getInventoryTransactions();
      setInventoryTransactions(res.data || []);
    } catch {
      message.error("Lỗi tải giao dịch kho");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "campaigns") loadCampaigns();
    else if (key === "beneficiaries" && selectedCampaignId) loadBeneficiaries(selectedCampaignId);
    else if (key === "supplyPlans" && selectedCampaignId) loadSupplyPlans(selectedCampaignId);
    else if (key === "distributions" && selectedCampaignId) loadDistributions(selectedCampaignId);
    else if (key === "distributionDetails" && selectedDistributionId) loadDistributionDetails(selectedDistributionId);
    else if (key === "transactions") loadInventoryTransactions();
  };

  const handleSelectCampaign = (value) => {
    setSelectedCampaignId(value);
    if (activeTab === "beneficiaries") loadBeneficiaries(value);
    if (activeTab === "supplyPlans") loadSupplyPlans(value);
    if (activeTab === "distributions") loadDistributions(value);
  };

  /* ================= CAMPAIGN HANDLERS ================= */
  const openCampaignModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      formCampaign.setFieldsValue({ ...record });
    } else {
      formCampaign.resetFields();
    }
    setIsCampaignModalOpen(true);
  };

  const handleCampaignSubmit = async (values) => {
    try {
      if (editingItem) {
        await updatePeriodicAidCampaign(editingItem.id, values);
        message.success("Cập nhật chiến dịch thành công");
      } else {
        const payload = { ...values, createdByAdminId: currentUserId };
        await createPeriodicAidCampaign(payload);
        message.success("Thêm chiến dịch thành công");
      }
      setIsCampaignModalOpen(false);
      loadCampaigns();
    } catch (error) {
      console.error("Campaign Submit Error:", error);
      message.error("Lỗi khi lưu chiến dịch");
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await deletePeriodicAidCampaign(id);
      message.success("Đã xóa chiến dịch");
      loadCampaigns();
      if (selectedCampaignId === id) setSelectedCampaignId(null);
    } catch {
      message.error("Lỗi khi xóa chiến dịch");
    }
  };

  /* ================= BENEFICIARY HANDLERS ================= */
  const openBeneficiaryModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      formBeneficiary.setFieldsValue(record);
    } else {
      formBeneficiary.resetFields();
      formBeneficiary.setFieldsValue({ campaignId: selectedCampaignId });
    }
    setIsBeneficiaryModalOpen(true);
  };

  const handleBeneficiarySubmit = async (values) => {
    try {
      if (editingItem) {
        await updateBeneficiary(editingItem.id, values);
        message.success("Cập nhật người nhận thành công");
      } else {
        const payload = { 
          ...values, 
          selectedByAdminId: currentUserId,
          areaId: selectedCampaignId ? (campaigns.find(c => c.id === selectedCampaignId)?.areaId || 1) : 1
        };
        await createBeneficiary(payload);
        message.success("Thêm người nhận thành công");
      }
      setIsBeneficiaryModalOpen(false);
      loadBeneficiaries(selectedCampaignId);
    } catch (error) {
      console.error("Beneficiary Submit Error:", error);
      message.error("Lỗi khi lưu người nhận");
    }
  };

  const handleDeleteBeneficiary = async (id) => {
    try {
      await deleteBeneficiary(id);
      message.success("Đã xóa người nhận");
      loadBeneficiaries(selectedCampaignId);
    } catch {
      message.error("Lỗi khi xóa người nhận");
    }
  };

  /* ================= SUPPLY PLAN HANDLERS ================= */
  const openSupplyPlanModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      formSupplyPlan.setFieldsValue(record);
    } else {
      formSupplyPlan.resetFields();
      formSupplyPlan.setFieldsValue({ campaignId: selectedCampaignId });
    }
    setIsSupplyPlanModalOpen(true);
  };

  const handleSupplyPlanSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateSupplyPlan(editingItem.id, values);
        message.success("Cập nhật kế hoạch thành công");
      } else {
        const payload = { ...values, createdByManagerId: currentUserId };
        await createSupplyPlan(payload);
        message.success("Thêm kế hoạch thành công");
      }
      setIsSupplyPlanModalOpen(false);
      loadSupplyPlans(selectedCampaignId);
    } catch (error) {
      console.error("Supply Plan Submit Error:", error);
      message.error("Lỗi khi lưu kế hoạch");
    }
  };

  const handleDeleteSupplyPlan = async (id) => {
    try {
      await deleteSupplyPlan(id);
      message.success("Đã xóa kế hoạch");
      loadSupplyPlans(selectedCampaignId);
    } catch {
      message.error("Lỗi khi xóa kế hoạch");
    }
  };

  /* ================= DISTRIBUTION HANDLERS ================= */
  const openDistributionModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      formDistribution.setFieldsValue({
        ...record,
        distributedAt: record.distributedAt ? dayjs(record.distributedAt) : null,
      });
    } else {
      formDistribution.resetFields();
      formDistribution.setFieldsValue({ campaignId: selectedCampaignId });
    }
    setIsDistributionModalOpen(true);
  };

  const handleDistributionSubmit = async (values) => {
    try {
      const payload = { ...values, distributedAt: values.distributedAt?.toISOString() };
      if (editingItem) {
        await updateDistribution(editingItem.id, payload);
        message.success("Cập nhật đợt phân phát thành công");
      } else {
        await createDistribution(payload);
        message.success("Tạo đợt phân phát thành công");
      }
      setIsDistributionModalOpen(false);
      loadDistributions(selectedCampaignId);
    } catch {
      message.error("Lỗi khi lưu đợt phân phát");
    }
  };

  const handleDeleteDistribution = async (id) => {
    try {
      await deleteDistribution(id);
      message.success("Đã xóa đợt phân phát");
      loadDistributions(selectedCampaignId);
      if (selectedDistributionId === id) setSelectedDistributionId(null);
    } catch {
      message.error("Lỗi khi xóa đợt phân phát");
    }
  };

  /* ================= DISTRIBUTION DETAIL HANDLERS ================= */
  const openDetailModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      formDetail.setFieldsValue(record);
    } else {
      formDetail.resetFields();
      formDetail.setFieldsValue({ distributionId: selectedDistributionId });
    }
    setIsDetailModalOpen(true);
  };

  const handleDetailSubmit = async (values) => {
    try {
      if (editingItem) {
        await updateDistributionDetail(editingItem.id, values);
        message.success("Cập nhật chi tiết thành công");
      } else {
        await createDistributionDetail(values);
        message.success("Thêm chi tiết thành công");
      }
      setIsDetailModalOpen(false);
      loadDistributionDetails(selectedDistributionId);
    } catch {
      message.error("Lỗi khi lưu chi tiết");
    }
  };

  const handleDeleteDetail = async (id) => {
    try {
      await deleteDistributionDetail(id);
      message.success("Đã xóa chi tiết");
      loadDistributionDetails(selectedDistributionId);
    } catch {
      message.error("Lỗi khi xóa chi tiết");
    }
  };

  /* ================= TRANSACTION HANDLERS ================= */
  const openTransactionModal = () => {
    formTransaction.resetFields();
    formTransaction.setFieldsValue({
      transactionType: "OUT",
      rescueRequestId: 0,
      lines: [{ reliefItemId: null, quantity: null }]
    });
    setIsTransactionModalOpen(true);
  };

  const handleTransactionSubmit = async (values) => {
    try {
      await createInventoryTransaction(values);
      message.success("Tạo giao dịch thành công");
      setIsTransactionModalOpen(false);
      loadInventoryTransactions();
    } catch {
      message.error("Lỗi khi tạo giao dịch");
    }
  };

  const handleConfirmTransaction = async (id) => {
    try {
      await confirmInventoryTransaction(id);
      message.success("Zác nhận giao dịch thành công");
      loadInventoryTransactions();
    } catch {
      message.error("Xác nhận giao dịch thất bại");
    }
  };

  /* ================= COLUMNS ================= */

  const campaignColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên chiến dịch", dataIndex: "campaignName" },
    { title: "Khu vực ID", dataIndex: "areaId" },
    { title: "Tháng/Năm", render: (_, r) => `${r.month}/${r.year}` },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (status) => <Tag color={status === "Hoàn thành" ? "green" : "blue"}>{status}</Tag>
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => {
            setSelectedCampaignId(record.id);
            setActiveTab("beneficiaries");
            loadBeneficiaries(record.id);
          }}>
            Chi tiết
          </Button>
          <Button onClick={() => openCampaignModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa chiến dịch này?" onConfirm={() => handleDeleteCampaign(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const beneficiaryColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Họ và tên", dataIndex: "fullName" },
    { title: "Điện thoại", dataIndex: "phone" },
    { title: "Địa chỉ", dataIndex: "address" },
    { title: "Nhóm ưu tiên", dataIndex: "priorityLevel" },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openBeneficiaryModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa người nhận này?" onConfirm={() => handleDeleteBeneficiary(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const supplyPlanColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Vật phẩm ID", dataIndex: "reliefItemId" },
    { title: "SL dự kiến", dataIndex: "plannedQuantity" },
    { title: "SL duyệt", dataIndex: "approvedQuantity" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openSupplyPlanModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa kế hoạch này?" onConfirm={() => handleDeleteSupplyPlan(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const distributionColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Đội cứu hộ ID", dataIndex: "rescueTeamId" },
    { title: "Thời gian", dataIndex: "distributedAt", render: (date) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "" },
    { title: "Trạng thái", dataIndex: "status" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => {
            setSelectedDistributionId(record.id);
            setActiveTab("distributionDetails");
            loadDistributionDetails(record.id);
          }}>
            Chi tiết phân phát
          </Button>
          <Button onClick={() => openDistributionModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa đợt phân phát này?" onConfirm={() => handleDeleteDistribution(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const distributionDetailColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Đ/tượng ID", dataIndex: "beneficiaryId" },
    { title: "Trạng thái", dataIndex: "status" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openDetailModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa chi tiết này?" onConfirm={() => handleDeleteDetail(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const transactionColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Kho hàng ID", dataIndex: "warehouseId" },
    { title: "Loại giao dịch", dataIndex: "transactionType" },
    { title: "Yêu cầu cứu hộ ID", dataIndex: "rescueRequestId" },
    { title: "Trạng thái", dataIndex: "confirmedAt", render: (date, record) => date || record.confirmed_at ? <Tag color="green">Đã xác nhận</Tag> : <Tag color="orange">Chờ xác nhận</Tag> },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          {!(record.confirmedAt || record.confirmed_at) && (
            <Button type="primary" onClick={() => handleConfirmTransaction(record.id || record.transactionId)}>Xác nhận</Button>
          )}
        </Space>
      )
    }
  ];

  /* ================= RENDER ================= */

  return (
    <div className="periodic-aid-page">
      <div className="periodic-aid-header">
        <h2>📦 Quản lý Cứu trợ định kỳ</h2>
        <p>Quản lý các chiến dịch, đối tượng, xuất kho và phân phát cứu trợ định kỳ</p>
      </div>

      <div className="periodic-aid-card">
        <Tabs activeKey={activeTab} onChange={handleTabChange} tabBarExtraContent={
          ["beneficiaries", "supplyPlans", "distributions"].includes(activeTab) && (
            <Select 
              placeholder="Chọn chiến dịch" 
              style={{ width: 250, marginRight: 16 }}
              value={selectedCampaignId}
              onChange={handleSelectCampaign}
              options={campaigns.map(c => ({ value: c.id, label: c.campaignName }))}
            />
          )
        }>
          <Tabs.TabPane tab="Chiến dịch" key="campaigns">
            <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openCampaignModal()}>Thêm chiến dịch</Button>
            <Table loading={loading} rowKey="id" columns={campaignColumns} dataSource={campaigns} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Kế hoạch hàng hóa" key="supplyPlans">
            <Button type="primary" style={{ marginBottom: 16 }} disabled={!selectedCampaignId} onClick={() => openSupplyPlanModal()}>Thêm kế hoạch</Button>
            <Table loading={loading} rowKey="id" columns={supplyPlanColumns} dataSource={supplyPlans} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Người nhận hỗ trợ" key="beneficiaries">
            <Button type="primary" style={{ marginBottom: 16 }} disabled={!selectedCampaignId} onClick={() => openBeneficiaryModal()}>Thêm người nhận</Button>
            <Table loading={loading} rowKey="id" columns={beneficiaryColumns} dataSource={beneficiaries} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đợt phân phát" key="distributions">
            <Button type="primary" style={{ marginBottom: 16 }} disabled={!selectedCampaignId} onClick={() => openDistributionModal()}>Tạo đợt phân phát</Button>
            <Table loading={loading} rowKey="id" columns={distributionColumns} dataSource={distributions} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Chi tiết phân phát" key="distributionDetails">
            {selectedDistributionId ? (
              <>
                <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openDetailModal()}>Thêm chi tiết</Button>
                <Table loading={loading} rowKey="id" columns={distributionDetailColumns} dataSource={distributionDetails} />
              </>
            ) : (
              <p>Vui lòng chọn một đợt phân phát từ tab Đợt phân phát để xem chi tiết.</p>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab="Giao dịch kho" key="transactions">
            <Button type="primary" style={{ marginBottom: 16 }} onClick={openTransactionModal}>Tạo giao dịch</Button>
            <Table loading={loading} rowKey="id" columns={transactionColumns} dataSource={inventoryTransactions} />
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* Campaign Modal */}
      <Modal title={editingItem ? "Sửa chiến dịch" : "Thêm chiến dịch"} open={isCampaignModalOpen} onCancel={() => setIsCampaignModalOpen(false)} onOk={() => formCampaign.submit()}>
        <Form form={formCampaign} layout="vertical" onFinish={handleCampaignSubmit}>
          <Form.Item name="campaignName" label="Tên chiến dịch" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="areaId" label="Khu vực ID" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="month" label="Tháng" rules={[{ required: true }]}><InputNumber min={1} max={12} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true }]}><InputNumber min={2000} max={3000} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>

      {/* Beneficiary Modal */}
      <Modal title={editingItem ? "Sửa người nhận" : "Thêm người nhận"} open={isBeneficiaryModalOpen} onCancel={() => setIsBeneficiaryModalOpen(false)} onOk={() => formBeneficiary.submit()}>
        <Form form={formBeneficiary} layout="vertical" onFinish={handleBeneficiarySubmit}>
          <Form.Item name="campaignId" label="Chiến dịch ID" rules={[{ required: true }]}><InputNumber disabled style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Điện thoại"><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ"><Input.TextArea /></Form.Item>
          <Form.Item name="priorityLevel" label="Mức độ ưu tiên"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>

      {/* Supply Plan Modal */}
      <Modal title={editingItem ? "Sửa kế hoạch" : "Thêm kế hoạch"} open={isSupplyPlanModalOpen} onCancel={() => setIsSupplyPlanModalOpen(false)} onOk={() => formSupplyPlan.submit()}>
        <Form form={formSupplyPlan} layout="vertical" onFinish={handleSupplyPlanSubmit}>
          <Form.Item name="campaignId" label="Chiến dịch ID" rules={[{ required: true }]}><InputNumber disabled style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="reliefItemId" label="Vật phẩm ID" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="plannedQuantity" label="SL dự kiến" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="approvedQuantity" label="SL phê duyệt"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>

      {/* Distribution Modal */}
      <Modal title={editingItem ? "Sửa đợt phân phát" : "Tạo đợt phân phát"} open={isDistributionModalOpen} onCancel={() => setIsDistributionModalOpen(false)} onOk={() => formDistribution.submit()}>
        <Form form={formDistribution} layout="vertical" onFinish={handleDistributionSubmit}>
          <Form.Item name="campaignId" label="Chiến dịch ID" rules={[{ required: true }]}><InputNumber disabled style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="rescueTeamId" label="Đội cứu hộ ID"><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="distributedAt" label="Thời gian phân phát"><DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="note" label="Ghi chú"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      {/* Distribution Detail Modal */}
      <Modal title={editingItem ? "Sửa chi tiết" : "Thêm chi tiết"} open={isDetailModalOpen} onCancel={() => setIsDetailModalOpen(false)} onOk={() => formDetail.submit()}>
        <Form form={formDetail} layout="vertical" onFinish={handleDetailSubmit}>
          <Form.Item name="distributionId" label="Đợt phân phát ID" rules={[{ required: true }]}><InputNumber disabled style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="beneficiaryId" label="Người nhận ID" rules={[{ required: true }]}><InputNumber style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="note" label="Ghi chú"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      {/* Transaction Modal */}
      <Modal title="Tạo giao dịch kho" open={isTransactionModalOpen} onCancel={() => setIsTransactionModalOpen(false)} onOk={() => formTransaction.submit()}>
        <Form form={formTransaction} layout="vertical" onFinish={handleTransactionSubmit}>
          <Form.Item name="warehouseId" label="Kho hàng" rules={[{ required: true }]}>
            <Select>
              {warehouses.map(w => <Select.Option key={w.id || w.warehouseId} value={w.id || w.warehouseId}>{w.warehouseName}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="transactionType" label="Loại giao dịch" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="IN">Nhập kho (IN)</Select.Option>
              <Select.Option value="OUT">Xuất kho (OUT)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="rescueRequestId" label="Yêu cầu cứu hộ ID (Tùy chọn)">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>

          <Form.List name="lines">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'reliefItemId']}
                      rules={[{ required: true, message: 'Missing item' }]}
                    >
                      <Select placeholder="Vật phẩm" style={{ width: 150 }}>
                        {reliefItems.map(i => <Select.Option key={i.id || i.reliefItemId} value={i.id || i.reliefItemId}>{i.itemName}</Select.Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Missing qty' }]}
                    >
                      <InputNumber placeholder="Số lượng" min={1} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Xóa</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>+ Thêm vật phẩm</Button>
                </Form.Item>
              </>
            )}
          </Form.List>

        </Form>
      </Modal>
    </div>
  );
}
