import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
  } from "recharts";
  
  import "./RescueTrendChart.css";
  
  export default function RescueTrendChart({ data = [] }) {
  
    const formatData = data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit"
      })
    }));
  
    return (
      <div className="dashboard-card">
        <div className="dashboard-title">Xu hướng Cứu Hộ</div>
  
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={formatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3c52" />
  
            <XAxis dataKey="date" stroke="#8aa0b6" />
  
            {/* 🔥 FIX LABEL TRỤC Y */}
            <YAxis
              stroke="#8aa0b6"
              label={{
                value: "Số nhiệm vụ",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#8aa0b6" }
              }}
            />
  
            {/* 🔥 FIX TOOLTIP */}
            <Tooltip
              formatter={(value) => [`${value}`, "Số nhiệm vụ"]}
              labelFormatter={(label) => `Ngày: ${label}`}
            />
  
            {/* 🔥 FIX NAME */}
            <Line
              type="monotone"
              dataKey="taskCount"
              name="Số nhiệm vụ"
              stroke="#1890ff"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }