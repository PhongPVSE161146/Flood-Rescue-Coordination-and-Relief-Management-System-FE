import "./UserTable.css";
import { Tag, Spin, Pagination } from "antd";
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

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

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

  /* ================= PROVINCE MAP ================= */
  const provinceMap = useMemo(() => {
    const map = {};
    provinces.forEach((p) => {
      map[Number(p.id)] = p.name;
    });
    return map;
  }, [provinces]);

  /* ================= PAGINATED USERS ================= */

  const paginatedUsers = useMemo(() => {

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return users.slice(start, end);

  }, [users, currentPage]);

  /* ================= ROLE COLOR ================= */

  const getRoleColor = (role) => {
    if (!role) return "default";

    switch (role.toLowerCase()) {
      case "admin":
        return "red";
      case "manager":
        return "gold";
      case "coordinator":
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

        <>

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

              {paginatedUsers.length === 0 ? (

                <tr>
                  <td colSpan="7" className="userTable__empty">
                    Không có dữ liệu
                  </td>
                </tr>

              ) : (

                paginatedUsers.map((user, index) => (

                  <tr
                    key={user.id}
                    onClick={() => onRowClick?.(user)}
                  >

                    {/* STT */}
                    <td className="userTable__stt">
                      {(currentPage - 1) * pageSize + index + 1}
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
                      {provinceMap[Number(user.areaId)] || "Chưa Cập Nhật"}
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

          {/* PAGINATION UI */}

          {users.length > pageSize && (

            <div className="userTable__pagination">

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />

            </div>

          )}

        </>

      )}

    </div>

  );
}