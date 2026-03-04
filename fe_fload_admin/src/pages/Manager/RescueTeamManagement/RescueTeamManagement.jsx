'use client';

import { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import {
  FilterOutlined,
  DownloadOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CoffeeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import TeamManagementList from '../../../components/ManagerComponents/rescue-team/TeamTable/TeamManagementList';
import ScheduleList from '../../../components/ManagerComponents/rescue-team/TeamSchedule/ScheduleList';
import { getAllRescueTeams } from '../../../../api/axios/ManagerApi/rescueTeamApi'; // ← import hàm api
import './RescueTeamManagement.css';

export default function RescueTeamManagement() {
  const [teams, setTeams] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await getAllRescueTeams();
        const data = response.data;

        if (Array.isArray(data)) {
          setTeams(data);
        } else if (Array.isArray(data?.data)) {
          setTeams(data.data);
        } else if (Array.isArray(data?.items)) {
          setTeams(data.items);
        } else {
          console.error("API không trả về mảng:", data);
          setTeams([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đội cứu hộ:', error);
        message.error('Không thể tải danh sách đội cứu hộ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Lọc đội theo trạng thái
  const getFilteredTeams = () => {
    if (filterStatus === 'all') return teams;
    return teams.filter((team) => {
      const status = team.rcStatus?.toLowerCase();
      if (filterStatus === 'active') return status === 'on duty';
      if (filterStatus === 'rest') return status === 'off duty' || status === 'rest';
      return false;
    });
  };

  const getTeamCount = (status) => {
    if (status === 'all') return teams.length;

    if (status === 'active') {
      return teams.filter((t) => t.rcStatus?.toLowerCase() === 'on duty').length;
    }
    if (status === 'rest') {
      return teams.filter((t) => {
        const s = t.rcStatus?.toLowerCase();
        return s === 'off duty' || s === 'rest';
      }).length;
    }
    return 0;
  };

  const totalMembers = teams.reduce((sum, team) => sum + (team.members || 0), 0);

  const filteredTeams = getFilteredTeams();

  // Mapping dữ liệu API sang format component con mong đợi
  const mappedTeams = filteredTeams.map((team) => ({
    id: team.rcid,
    name: team.rcName || 'Chưa đặt tên',
    skill: 'Chưa cập nhật', // API chưa có → để tạm
    members: team.members || 0, // nếu API có thì dùng, không thì 0
    status: team.rcStatus === 'on duty' ? 'active' : 'rest',
    mission: team.mission || '—',
    phone: team.rcPhone || '—',
    teamMembers: [], // nếu cần thành viên → gọi API riêng sau
  }));

  if (loading) {
    return (
      <div className="rescue-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Đang tải danh sách đội cứu hộ..." />
      </div>
    );
  }

  return (
    <div className="rescue-page">
      <div className="page-header">
        <div>
          <h2>Quản lý Đội cứu hộ</h2>
          <p>Giám sát và sắp xếp nhân sự cho các đội cứu hộ dưới quyền (UC-M08, UC-M18)</p>
        </div>

        <div className="header-actions">
          <Button icon={<FilterOutlined />}>Lọc nâng cao</Button>
          <Button icon={<DownloadOutlined />}>Xuất báo cáo</Button>
        </div>
      </div>

      <div className="stat-grid">
        <div onClick={() => setFilterStatus('all')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="TỔNG SỐ ĐỘI"
            value={getTeamCount('all')}
            icon={<TeamOutlined />}
            active={filterStatus === 'all'}
          />
        </div>
        <div onClick={() => setFilterStatus('active')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="ĐANG LÀM NHIỆM VỤ"
            value={getTeamCount('active')}
            icon={<ThunderboltOutlined />}
            green
            active={filterStatus === 'active'}
          />
        </div>
        <div onClick={() => setFilterStatus('rest')} style={{ cursor: 'pointer' }}>
          <StatCard
            title="ĐANG NGHỈ / DỰ PHÒNG"
            value={getTeamCount('rest')}
            icon={<CoffeeOutlined />}
            gray
            active={filterStatus === 'rest'}
          />
        </div>
        <StatCard
          title="NHÂN SỰ SẴN SÀNG"
          value={totalMembers}
          icon={<UserOutlined />}
        />
      </div>

      <TeamManagementList 
        teamsData={mappedTeams}
        filterStatus={filterStatus}
      />

      <ScheduleList />
    </div>
  );
}

function StatCard({ title, value, icon, green, gray, active }) {
  return (
    <div className={`stat-card ${green ? 'green' : ''} ${gray ? 'gray' : ''} ${active ? 'active' : ''}`}>
      <div className="stat-icon">{icon}</div>
      <span>{title}</span>
      <h2>{value}</h2>
    </div>
  );
}