'use client';

import { useState, useEffect } from 'react';

import {
  Button,
  Tag,
  Modal,
  message,
  Form,
  Input,
  Select,
  Spin,
} from 'antd';

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import {
  deleteRescueTeam,
  updateRescueTeam,
  getRescueTeamLocation,
  updateRescueTeamLocation,
} from '../../../../../api/axios/ManagerApi/rescueTeamApi';

import axios from "axios";

import './TeamManagementList.css';

import MemberTable from './MemberTable';
import CreateTeamModal from '../CreateTeam/CreateTeamModal';

const { Option } = Select;



/**
 * FREE reverse geocode using OpenStreetMap
 */
const reverseGeocode = async (location) => {
  
  try {

    if (!location) return "Không xác định";

    const [lng, lat] = location.split(",");

    if (!lng || !lat) return "Không xác định";

    const res = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: lat,
          lon: lng,
          format: "json"
        }
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
  onTeamDeleted,
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


  useEffect(() => {

    if (!teamsData?.length) return;
  
    teamsData.forEach(team => {
  
      fetchTeamLocation(team.id);
  
    });
  
  }, [teamsData]);
  /**
   * LOAD LOCATION + ADDRESS
   */
  const fetchTeamLocation = async (teamId) => {

    // tránh gọi lại nếu đã load
    if (teamLocations[teamId] !== undefined)
      return;
  
    try {
  
      setLoadingLocation(prev => ({
        ...prev,
        [teamId]: true,
      }));
  
  
      const res =
        await getRescueTeamLocation(teamId);
  
  
      const location =
        res?.data?.location || null;
  
  
      setTeamLocations(prev => ({
        ...prev,
        [teamId]: location,
      }));
  
  
      if (!location) {
  
        setTeamAddresses(prev => ({
          ...prev,
          [teamId]: "Không xác định",
        }));
  
        return;
  
      }
  
  
      const address =
        await reverseGeocode(location);
  
  
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
        [teamId]: false,
      }));
  
    }
  
  };



  /**
   * EXPAND TEAM
   */
  const handleTeamClick = (teamId) => {

    fetchTeamLocation(teamId);

    setExpandedTeamId(
      expandedTeamId === teamId
        ? null
        : teamId
    );

  };



  /**
   * OPEN EDIT
   */
  const handleEditTeam = (team) => {

    setEditingTeam(team);

    form.setFieldsValue({

      rcName: team.name,

      rcPhone: team.phone,

      areaId: team.areaId,

      rcStatus: team.status,

      location: teamLocations[team.id] || ""

    });

    setEditModalVisible(true);

  };



  /**
   * UPDATE TEAM
   */
  const handleUpdateTeam = async (values) => {

    try {

      setUpdating(true);


      await updateRescueTeam(
        editingTeam.id,
        {
          rcName: values.rcName,
          rcPhone: values.rcPhone,
          areaId: values.areaId,
          rcStatus: values.rcStatus,
        }
      );


      if (values.location) {

        await updateRescueTeamLocation(
          editingTeam.id,
          values.location
        );

      }


      message.success("Cập nhật thành công");


      setEditModalVisible(false);


      onTeamDeleted?.();


    }
    catch {

      message.error("Cập nhật thất bại");

    }
    finally {

      setUpdating(false);

    }

  };



  /**
   * DELETE TEAM
   */
  const handleDeleteTeam = (teamId, teamName) => {

    Modal.confirm({

      title: "Xác nhận xóa đội",

      icon:
        <ExclamationCircleOutlined />,

      content:
        `Bạn có chắc muốn xóa đội "${teamName}"?`,

      okType: "danger",

      onOk: async () => {

        await deleteRescueTeam(teamId);

        message.success("Đã xóa đội");

        onTeamDeleted?.();

      },

    });

  };



  return (

    <div className="card">


      {/* HEADER */}
      <div className="card-header">

        <span className="card-title">

          📋 Danh sách đội cứu hộ ({teamsData.length})

        </span>


        <Button
  icon={<PlusOutlined />}
  type="primary"
  onClick={() =>
    setCreateOpen(true)
  }
>
  Tạo đội cứu hộ
</Button>

      </div>



      {/* TABLE HEAD */}
      <div className="table-wrapper">


        <div className="table-head">

          <span>STT</span>

          <span>TÊN ĐỘI</span>

          <span>Số Điện Thoại</span>

          <span>TRẠNG THÁI</span>

          <span>VỊ TRÍ</span>

          <span>HÀNH ĐỘNG</span>

        </div>



        {/* TABLE BODY */}
        {

          teamsData.map(

            (team, index) => (

              <div key={team.id}>

                <TeamRow

                  index={index}

                  {...team}

                  location={
                    teamLocations[team.id]
                  }

                  address={
                    teamAddresses[team.id]
                  }

                  loadingLocation={
                    loadingLocation[team.id]
                  }

                  isExpanded={
                    expandedTeamId === team.id
                  }

                  onTeamClick={
                    () =>
                      handleTeamClick(team.id)
                  }

                  onEdit={
                    () =>
                      handleEditTeam(team)
                  }

                  onDelete={
                    () =>
                      handleDeleteTeam(
                        team.id,
                        team.name
                      )
                  }

                />


                {

                  expandedTeamId === team.id

                  && (

                    <MemberTable
                      teamId={team.id}
                    />

                  )

                }


              </div>

            )

          )

        }


      </div>

      <CreateTeamModal

open={createOpen}

onClose={() =>
  setCreateOpen(false)
}

onSuccess={() =>
  onTeamDeleted?.()
}

/>

      {/* EDIT MODAL */}
      <Modal

        open={editModalVisible}

        title="Chỉnh sửa đội cứu hộ"

        footer={null}

        onCancel={() =>
          setEditModalVisible(false)
        }

      >


        <Form

          form={form}

          layout="vertical"

          onFinish={handleUpdateTeam}

        >


          <Form.Item
            name="rcName"
            label="Tên đội"
            required
          >
            <Input />
          </Form.Item>


          <Form.Item
            name="rcPhone"
            label="Phone"
            required
          >
            <Input />
          </Form.Item>


          <Form.Item
            name="areaId"
            label="Area ID"
          >
            <Input type="number"/>
          </Form.Item>


          <Form.Item
            name="rcStatus"
            label="Status"
          >

            <Select>

              <Option value="active">
                Active
              </Option>

              <Option value="rest">
                Rest
              </Option>

            </Select>

          </Form.Item>


          <Form.Item
            name="location"
            label="Location (lng,lat)"
          >
            <Input
              placeholder="106.699018,10.779783"
            />
          </Form.Item>


          <Button

            type="primary"

            htmlType="submit"

            loading={updating}

            block

          >

            Lưu thay đổi

          </Button>


        </Form>


      </Modal>


    </div>

  );

}



/**
 * TEAM ROW
 */
function TeamRow({

  index,

  id,

  name,
  phone,

  skill,

  status,

  location,

  address,

  loadingLocation,

  isExpanded,

  onTeamClick,

  onEdit,

  onDelete,

}) {

  return (

    <div className="table-row">


      {/* STT */}
      <div>

        {index + 1}

      </div>



      {/* NAME */}
      <div className="team-info">

        <button
          onClick={onTeamClick}
        >

          {

            isExpanded
            ? <UpOutlined/>
            : <DownOutlined/>

          }

        </button>


        <strong>

          {name}

        </strong>

      </div>



      {/* SKILL */}
      <div>

        {phone}

      </div>



      {/* STATUS */}
      <div>

        <Tag

          color={
            status === "active"
            ? "green"
            : "default"
          }

        >

          {status}

        </Tag>

      </div>



      {/* LOCATION */}
      <div>

        {

          loadingLocation

          ? <Spin size="small"/>

          : address

          ? address

          : "Không xác định"

        }

      </div>



      {/* ACTION */}
      <div>

        <Button

          icon={<EditOutlined />}

          onClick={onEdit}

        />


        <Button

          danger

          icon={<DeleteOutlined />}

          onClick={onDelete}

        />


      </div>


    </div>

  );

}