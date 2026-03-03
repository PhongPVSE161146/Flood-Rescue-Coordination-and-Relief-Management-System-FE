import "./UserTable.css";
import { Tag, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { getProvinces } from "../../../../../api/axios/Auth/authApi";

export default function UserTable({
  onRowClick,
  onEdit,
  loading,
  users = [],
 
}) {

  const [provinces, setProvinces] = useState([]);

  /* ================= FETCH PROVINCES ================= */
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      const data = res?.data || res || [];
      setProvinces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH PROVINCES ERROR:", error);
      setProvinces([]);
    }
  };

  /* ================= PROVINCE MAP (TỐI ƯU) ================= */
  const provinceMap = useMemo(() => {
    const map = {};
    provinces.forEach((p) => {
      map[Number(p.id)] = p.name;
    });
    return map;
  }, [provinces]);

  /* ================= ROLE COLOR ================= */
  const getRoleColor = (role) => {
    if (!role) return "default";

    switch (role.toLowerCase()) {
      case "admin":
        return "red";
      case "manager":
        return "gold";
      case "rescuecoordinator":
        return "purple";
      case "rescueteam":
        return "blue";
      default:
        return "default";
    }
  };

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status) => {
    if (!status) return "default";

    switch (status.toLowerCase()) {
      case "hoạt động":
        return "green";
      case "khóa":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div className="userTable">

      {loading ? (

        <div className="userTable__loading">
          <Spin size="large" />
        </div>

      ) : (

        <table>

          <thead>
            <tr>
              <th style={{ width: "60px" }}>STT</th>
              <th>Người dùng</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Khu vực</th>
              <th>Trạng thái</th>
              <th style={{ width: "60px" }}>Sửa</th>
            </tr>
          </thead>

          <tbody>

            {users.length === 0 ? (

              <tr>
                <td colSpan="7" className="userTable__empty">
                  Không có dữ liệu
                </td>
              </tr>

            ) : (

              users.map((user, index) => (

                <tr
                  key={user.id}
                  onClick={() => onRowClick?.(user)}
                >

                  {/* STT */}
                  <td className="userTable__stt">
                    {index + 1}
                  </td>

                  {/* NAME */}
                  <td>
                    <div className="userTable__name">
                      {user.name || "N/A"}
                    </div>
                  </td>

                  {/* PHONE */}
                  <td>
                    {user.phone || "N/A"}
                  </td>

                  {/* ROLE */}
                  <td>
                    <Tag color={getRoleColor(user.role)}>
                      {user.role || "N/A"}
                    </Tag>
                  </td>

                  {/* AREA */}
                  <td>
                    {provinceMap[Number(user.areaId)] || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Tag color={getStatusColor(user.status)}>
                      {user.status || "N/A"}
                    </Tag>
                  </td>

                  {/* EDIT */}
                  <td>
                    <EditOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(user);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      )}

    </div>
  );
}