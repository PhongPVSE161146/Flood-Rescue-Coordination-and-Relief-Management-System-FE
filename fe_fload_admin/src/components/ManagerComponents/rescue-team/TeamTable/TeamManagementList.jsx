'use client';

import { useState, useEffect } from 'react';
import {
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Pagination
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

import AuthNotify from "../../../../utils/Common/AuthNotify";

/* MUI */

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

  /* PAGINATION */

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedTeams =
    teamsData.slice(
      startIndex,
      startIndex + pageSize
    );


  useEffect(() => {
    fetchProvinces();
  }, []);


  const fetchProvinces = async () => {

    try {

      const res = await getProvinces();

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

        setTeamAddresses(prev => ({
          ...prev,
          [teamId]: "Không xác định"
        }));

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

      setLoadingLocation(prev => ({
        ...prev,
        [teamId]: false
      }));

    }

  };


  const handleTeamClick = (teamId) => {

    fetchTeamLocation(teamId);

    setExpandedTeamId(
      expandedTeamId === teamId ? null : teamId
    );

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
        rcStatus: mappedStatus,
      });

      if (values.location) {
        await updateRescueTeamLocation(editingTeam.id, values.location);
      }

      AuthNotify.success(
        "Cập nhật thành công",
        "Thông tin đội cứu hộ đã được cập nhật"
      );

      setEditModalVisible(false);

      onTeamChanged?.();

    }
    catch {

      AuthNotify.error(
        "Cập nhật thất bại",
        "Không thể cập nhật đội cứu hộ"
      );

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

        AuthNotify.success(
          "Đã xóa đội",
          "Đội cứu hộ đã được xóa khỏi hệ thống"
        );

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


        {paginatedTeams.map((team, index) => (

          <div key={team.id}>

            <div className="table-row">

              <div className="col-center">
                {startIndex + index + 1}
              </div>

              <div className="team-name">
                {team.name}
              </div>

              <div>{team.phone}</div>

              <div className="location-cell">

                {loadingLocation[team.id]
                  ? <Spin size="small" />
                  : (
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
                    ? "Sẵn sàng"
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


      {/* PAGINATION */}

      <div className="table-pagination">

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={teamsData.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />

      </div>


      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => onTeamChanged?.()}
      />

    </div>

  );

}