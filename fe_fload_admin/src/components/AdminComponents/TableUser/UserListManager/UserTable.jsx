import "./UserTable.css";
import { Tag, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllUser } from "../../../../../api/axios/AdminApi/userApi";

export default function UserTable({ onRowClick, onEdit, loading, users}) {

  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(false);


  // useEffect(() => {

  //   fetchUsers();

  // }, []);


  // /**
  //  * FETCH USERS FROM API
  //  */
  // const fetchUsers = async () => {

  //   try {

  //     setLoading(true);

  //     const data = await getAllUser();

  //     if (!Array.isArray(data)) {

  //       setUsers([]);
  //       return;

  //     }

  //     const validUsers = data.filter(
  //       user => user.roleName && user.roleName.trim() !== ""
  //     );

  //     const mappedUsers = validUsers.map(user => ({

  //       id: user.userId,

  //       name: user.fullName ?? "Unknown",

  //       phone: user.phone ?? "N/A",

  //       role: user.roleName,

  //       roleColor: getRoleColor(user.roleName),

  //       area: user.areaId ? `Area ${user.areaId}` : "N/A",

  //       status: "Hoạt động",

  //       statusColor: "green",

  //     }));

  //     setUsers(mappedUsers);

  //   }
  //   catch (error) {

  //     console.error(error);

  //     setUsers([]);

  //   }
  //   finally {

  //     setLoading(false);

  //   }

  // };


  /**
   * ROLE COLOR
   */
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
                      {user.name}
                    </div>
                  </td>


                  {/* PHONE */}
                  <td>
                    {user.phone}
                  </td>


                  {/* ROLE */}
                  <td>
                    <Tag color={user.roleColor}>
                      {user.role}
                    </Tag>
                  </td>


                  {/* AREA */}
                  <td>
                    {user.area}
                  </td>


                  {/* STATUS */}
                  <td>
                    <span className={`status ${user.statusColor}`}>
                      {user.status}
                    </span>
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