'use client';

import { useState, useEffect } from 'react';
import {
  Tag,
  Modal,
  message,
  Form,
  Input,
  Select,
  Spin,
} from 'antd';

import {
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import {
  deleteRescueTeam,
  updateRescueTeam,
  getRescueTeamLocation,
  updateRescueTeamLocation,
} from '../../../../../api/axios/ManagerApi/rescueTeamApi';
import { getProvinces } from '../../../../../api/axios/Auth/authApi';
import axios from "axios";

import './TeamManagementList.css';

import MemberTable from './MemberTable';
import CreateTeamModal from '../CreateTeam/CreateTeamModal';

/* ✅ MUI */
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const { Option } = Select;

/* ================= REVERSE GEOCODE ================= */
const reverseGeocode = async (location) => {
  try {
    if (!location) return "Không xác định";
    const [lng, lat] = location.split(",");
    if (!lng || !lat) return "Không xác định";

    const res = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: { lat, lon: lng, format: "json" }
      }
    );

    return res.data.display_name || "Không xác định";
  }
  catch {
    return "Không xác định";
  }
};

export default function TeamManagementList({
  teamsData,
  onTeamChanged,
}) {

  const [createOpen, setCreateOpen] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);
  const [teamLocations, setTeamLocations] = useState({});
  const [teamAddresses, setTeamAddresses] = useState({});
  const [loadingLocation, setLoadingLocation] = useState({});
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);
  
  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
  
      console.log("Province API response:", res);
  
      let data = [];
  
      if (Array.isArray(res?.data)) {
        data = res.data;
      }
      else if (Array.isArray(res?.data?.data)) {
        data = res.data.data;
      }
      else if (Array.isArray(res?.data?.items)) {
        data = res.data.items;
      }
      else if (Array.isArray(res)) {
        data = res;
      }
  
      setProvinces(data);
    } catch (err) {
      console.log("Load provinces error:", err);
    }
  };
  useEffect(() => {
    if (!teamsData?.length) return;
    teamsData.forEach(team => {
      fetchTeamLocation(team.id);
    });
  }, [teamsData]);

  const fetchTeamLocation = async (teamId) => {
    if (teamLocations[teamId] !== undefined) return;

    try {
      setLoadingLocation(prev => ({ ...prev, [teamId]: true }));

      const res = await getRescueTeamLocation(teamId);
      const location = res?.data?.location || null;

      setTeamLocations(prev => ({ ...prev, [teamId]: location }));

      if (!location) {
        setTeamAddresses(prev => ({ ...prev, [teamId]: "Không xác định" }));
        return;
      }

      const address = await reverseGeocode(location);

      setTeamAddresses(prev => ({
        ...prev,
        [teamId]: address || "Không xác định",
      }));
    }
    catch {
      setTeamAddresses(prev => ({
        ...prev,
        [teamId]: "Không xác định",
      }));
    }
    finally {
      setLoadingLocation(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const handleTeamClick = (teamId) => {
    fetchTeamLocation(teamId);
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
  
    const mappedStatus =
      team.status === "active"
        ? "active"
        : "rest";
  
    form.setFieldsValue({
      rcName: team.name,
      rcPhone: team.phone,
      areaId: team.areaId,
      rcStatus: mappedStatus,
      location: teamLocations[team.id] || ""
    });
  
    setEditModalVisible(true);
  };

  const handleUpdateTeam = async (values) => {
    try {
      setUpdating(true);
  
      const mappedStatus =
        values.rcStatus === "active"
          ? "on duty"
          : "off duty";
  
      await updateRescueTeam(editingTeam.id, {
        rcName: values.rcName,
        rcPhone: values.rcPhone,
        areaId: Number(values.areaId),
        rcStatus: mappedStatus, // 🔥 fix ở đây
      });
  
      if (values.location) {
        await updateRescueTeamLocation(editingTeam.id, values.location);
      }
  
      message.success("Cập nhật thành công");
      setEditModalVisible(false);
      onTeamChanged?.();
    }
    catch (err) {
      console.log("Update error:", err);
      message.error("Cập nhật thất bại");
    }
    finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "rest":
        return "orange";
      default:
        return "default";
    }
  };
  const handleDeleteTeam = (teamId, teamName) => {
    Modal.confirm({
      title: "Xác nhận xóa đội",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn xóa đội "${teamName}"?`,
      okType: "danger",
      onOk: async () => {
        await deleteRescueTeam(teamId);
        message.success("Đã xóa đội");
        onTeamChanged?.();
      },
    });
  };

  return (
    <div className="card">

      <div className="card-header">
        <div className="card-title">
          🚑 Danh sách đội cứu hộ ({teamsData.length})
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          className="mui-create-btn"
        >
          Tạo đội cứu hộ
        </Button>
      </div>

      <div className="table-wrapper">

        <div className="table-head">
          <span>STT</span>
          <span>TÊN ĐỘI</span>
          <span>SĐT</span>
          <span>VỊ TRÍ</span>
          <span>TRẠNG THÁI</span>
          <span>HÀNH ĐỘNG</span>
        </div>

        {teamsData.map((team, index) => (
          <div key={team.id}>
            <div className="table-row">

              <div className="col-center">{index + 1}</div>

              <div className="team-name">{team.name}</div>

              <div>{team.phone}</div>

              <div className="location-cell">
  {loadingLocation[team.id] ? (
    <Spin size="small" />
  ) : (
    <Tooltip title={teamAddresses[team.id]}>
      <span className="truncate-text">
        {teamAddresses[team.id] || "Không xác định"}
      </span>
    </Tooltip>
  )}
</div>

              <div>
                <Tag color={getStatusColor(team.status)}>
                  {team.status === "active"
                    ? "Sẵng sàng"
                    : team.status === "rest"
                      ? "Đang nghỉ"
                      : "Không xác định"}
                </Tag>
              </div>

              <div className="col-action">
                <Stack direction="row" spacing={1}>

                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      className="action-edit"
                      onClick={() => handleEditTeam(team)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      className="action-delete"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Xem thành viên">
                    <IconButton
                      size="small"
                      className="action-expand"
                      onClick={() => handleTeamClick(team.id)}
                    >
                      {expandedTeamId === team.id
                        ? <ExpandLessIcon fontSize="small" />
                        : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>

                </Stack>
              </div>

            </div>

            {expandedTeamId === team.id && (
              <MemberTable teamId={team.id} />
            )}
          </div>
        ))}

      </div>

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => onTeamChanged?.()}
      />

<Modal
  open={editModalVisible}
  footer={null}
  onCancel={() => setEditModalVisible(false)}
  className="edit-team-modal"
  centered
>
  <div className="modal-header">
    <h2>🚑 Chỉnh sửa đội cứu hộ</h2>
    <p>Cập nhật thông tin đội cứu hộ</p>
  </div>

  <Form
    form={form}
    layout="vertical"
    onFinish={handleUpdateTeam}
    className="modal-form"
  >
    <Form.Item
      name="rcName"
      label="Tên đội"
      rules={[{ required: true, message: "Nhập tên đội" }]}
    >
      <Input size="large" placeholder="Nhập tên đội cứu hộ" />
    </Form.Item>

    <Form.Item
      name="rcPhone"
      label="Số điện thoại"
      rules={[{ required: true, message: "Nhập số điện thoại" }]}
    >
      <Input size="large" placeholder="090xxxxxxx" />
    </Form.Item>

    {/* 🔥 Dropdown khu vực */}
    <Form.Item
      name="areaId"
      label="Khu vực"
      rules={[{ required: true, message: "Chọn khu vực" }]}
    >
      <Select
        size="large"
        placeholder="Chọn tỉnh / thành phố"
        showSearch
      >
        {provinces.map((province) => (
          <Option key={province.id} value={province.id}>
            {province.name}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name="rcStatus"
      label="Trạng thái"
      rules={[{ required: true }]}
    >
      <Select size="large">
        <Option value="active">Sẵn sàng</Option>
        <Option value="rest">Đang nghỉ</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="location"
      label="Vị trí (lng,lat)"
    >
      <Input size="large" placeholder="106.699018,10.779783" />
    </Form.Item>

    <Button
      variant="contained"
      fullWidth
      type="submit"
      disabled={updating}
      className="modal-save-btn"
    >
      Lưu thay đổi
    </Button>
  </Form>
</Modal>

    </div>
  );
}