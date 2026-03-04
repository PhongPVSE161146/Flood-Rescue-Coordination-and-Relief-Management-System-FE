'use client';

import { useState, useEffect } from 'react';

import {

  Button,
  Tag,
  Spin,
  message,
  Modal

} from 'antd';

import {

  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined

} from '@ant-design/icons';

import {

  getRescueTeamMembers,
  deleteTeamMember

} from '../../../../../api/axios/ManagerApi/rescueTeamApi';

import './MemberTable.css';

import CreateMemberModal from "../CreateTeam/CreateMemberModal";


export default function MemberTable({ teamId }) {

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);


  /**
   * FETCH MEMBERS
   */
  const fetchMembers = async () => {

    if (!teamId) return;

    try {

      setLoading(true);

      const response =
        await getRescueTeamMembers(teamId);

      const data = response.data;

      if (Array.isArray(data)) {

        setMembers(data);

      }
      else if (Array.isArray(data?.data)) {

        setMembers(data.data);

      }
      else if (Array.isArray(data?.items)) {

        setMembers(data.items);

      }
      else {

        setMembers([]);

      }

    }
    catch (error) {

      console.error(error);

      message.error(
        'Không thể tải danh sách thành viên'
      );

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchMembers();

  }, [teamId]);


  /**
   * DELETE MEMBER
   */
  const handleDeleteMember =
    (userId, fullName) => {

    Modal.confirm({

      title: 'Xác nhận xóa',

      icon: <ExclamationCircleOutlined />,

      content:
        `Bạn có chắc muốn xóa "${fullName}"?`,

      okType: 'danger',

      onOk: async () => {

        try {

          await deleteTeamMember(
            teamId,
            userId
          );

          message.success(
            "Đã xóa thành viên"
          );

          fetchMembers();

        }
        catch {

          message.error(
            "Xóa thất bại"
          );

        }

      },

    });

  };


  /**
   * LOADING
   */
  if (loading) {

    return (

      <div className="member-table-container loading">

        <Spin tip="Đang tải thành viên..." />

      </div>

    );

  }


  return (

    <div className="member-table-container">


      {/* HEADER */}
      <div className="member-table-header">

        <h4>

          👥 Danh sách thành viên đội
          ({members.length})

        </h4>


        <Button

          type="primary"

          icon={<PlusOutlined />}

          onClick={() =>
            setCreateOpen(true)
          }

        >

          Tạo thành viên

        </Button>

      </div>


      {/* TABLE */}
      <div className="member-table-wrapper">

        <div className="member-table-head">

          <span>ID</span>

          <span>HỌ TÊN</span>

          <span>ĐT LIÊN LẠC</span>

          <span>VỊ TRÍ</span>

          <span>HÀNH ĐỘNG</span>

        </div>


        {

          members.length === 0

          ? (

            <div className="no-data">

              Chưa có thành viên

            </div>

          )

          : (

            members.map(member => (

              <MemberRow

                key={member.userId}

                {...member}

                onDelete={() =>

                  handleDeleteMember(

                    member.userId,

                    member.fullName

                  )

                }

              />

            ))

          )

        }

      </div>


      {/* CREATE MODAL */}
      <CreateMemberModal

        open={createOpen}

        teamId={teamId}

        onClose={() =>
          setCreateOpen(false)
        }

        onSuccess={fetchMembers}

      />


    </div>

  );

}



/**
 * MEMBER ROW
 */
function MemberRow({

  userId,
  fullName,
  phone,
  roleInTeam,
  onDelete

}) {

  return (

    <div className="member-row">


      <div className="id-cell">

        <strong>{userId}</strong>

      </div>


      <div className="name-cell">

        {fullName}

      </div>


      <div className="phone-cell">

        {phone || "—"}

      </div>


      <div className="role-cell">

        <Tag color="blue">

          {roleInTeam || "Thành viên"}

        </Tag>

      </div>


      <div className="actions-cell">

        <Button

          size="small"

          icon={<EditOutlined />}

        >

          Sửa

        </Button>


        <Button

          danger

          size="small"

          icon={<DeleteOutlined />}

          onClick={onDelete}

        >

          Xóa

        </Button>

      </div>


    </div>

  );

}