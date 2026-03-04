'use client';

import { Button } from 'antd';
import './TeamScheduleSection.css';

export default function ScheduleList() {
  return (
    <div className="card">
      <div className="schedule-header">
        <div>
          <h3>Lịch trực Đội cứu hộ (UC-M18)</h3>
          <p>Sắp xếp ca trực tuần hiện tại: 15/05 - 21/05</p>
        </div>

        <div className="week-control">
          <Button>‹</Button>
          <Button>Tuần này</Button>
          <Button>›</Button>
        </div>
      </div>

      <div className="schedule-grid">
        <div className="schedule-head">
          <span>ĐỘI</span>
          <span>THỨ 2</span>
          <span>THỨ 3</span>
          <span>THỨ 4</span>
          <span>THỨ 5</span>
          <span>THỨ 6</span>
          <span>THỨ 7</span>
          <span>CHỦ NHẬT</span>
        </div>

        <ScheduleRow
          team="Alpha Team"
          data={['Ca sáng', 'Ca sáng', '', 'Ca đêm', 'Ca đêm', '', 'Trực ban']}
          color="green"
        />

        <ScheduleRow
          team="Delta Med"
          data={['', 'Trực viện', 'Trực viện', '', 'Ca sáng', 'Ca chiều', '']}
          color="blue"
        />

        <ScheduleRow
          team="K9 Rescue"
          data={[
            'Dự phòng',
            '',
            'Dự phòng',
            'Huấn luyện',
            '',
            'Tuần tra',
            'Tuần tra',
          ]}
          color="orange"
        />
      </div>
    </div>
  );
}

function ScheduleRow({ team, data, color }) {
  return (
    <div className="schedule-row">
      <strong>{team}</strong>
      {data.map((d, i) => (
        <div key={i} className={`shift ${color}`}>
          {d}
        </div>
      ))}
    </div>
  );
}
