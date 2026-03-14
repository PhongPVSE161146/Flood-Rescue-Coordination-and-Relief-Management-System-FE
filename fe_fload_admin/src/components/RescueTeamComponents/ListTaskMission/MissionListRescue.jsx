import "./MissionListRescue.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAllAssignments,
  getPendingRescueRequests,
  getUrgencyLevels,

} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";
import {  acceptRescueAssignment} from "../../../../api/axios/RescueApi/RescueTask";
import { getAllRescueTeams } from "../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../api/axios/Auth/authApi";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

export default function MissionListRescue() {

  const navigate = useNavigate();

  const [missions,setMissions] = useState([])
  const [loading,setLoading] = useState(false)

  const [filterLevel,setFilterLevel] = useState("")
  const [filterAddress,setFilterAddress] = useState("")

  /* ================= LOAD DATA ================= */

  const fetchAssignments = async()=>{

    try{

      setLoading(true)

      const [
        assignmentRes,
        requestRes,
        urgencyRes,
        teamRes,
        vehicleRes,
        statusRes
      ] = await Promise.all([
        getAllAssignments(),
        getPendingRescueRequests(),
        getUrgencyLevels(),
        getAllRescueTeams(),
        getAllVehicles(),
        getRequestStatuses()
      ])

      const assignments = assignmentRes?.data || assignmentRes || []
      const requests = requestRes?.data || requestRes || []
      const urgencies = urgencyRes || []
      const teams = teamRes?.data?.items || []
      const vehicles = vehicleRes?.data || []
      const statuses = statusRes?.data || statusRes || []

      const requestMap={}
      requests.forEach(r=>{
        requestMap[r.rescueRequestId]=r
      })

      const teamMap={}
      teams.forEach(t=>{
        teamMap[t.rcid]=t.rcName
      })

      const vehicleMap={}
      vehicles.forEach(v=>{
        vehicleMap[v.vehicleId]=v.vehicleName
      })

      const urgencyMap={}
      urgencies.forEach(u=>{
        urgencyMap[u.urgencyLevelId]=u.levelName
      })

      const statusMap={}
      statuses.forEach(s=>{
        statusMap[s.statusId]=s.description
      })

      const mapped = assignments.map(a=>{

        const req = requestMap[a.rescueRequestId]

        const urgencyLevel = urgencyMap[req?.urgencyLevelId]

        const urgencyText =
        priorityTranslate[urgencyLevel] ||
        urgencyLevel ||
        "Không xác định"

        const statusName =
        statusMap[req?.requestStatusId] ||
        "Đang xử lý"

        return{

          id:a.assignmentId,

          title:req?.fullName || req?.fullname || "Người gửi yêu cầu",

          phone:req?.contactPhone || "Không có",

          level:urgencyText,

          address:req?.address || "Chưa cập nhật",

          team:teamMap[a.rescueTeamId] || `Đội ${a.rescueTeamId}`,

          vehicle:vehicleMap[a.vehicleId] || "Không có xe",

          status:statusName,

          time:a.assignedAt
          ? new Date(a.assignedAt).toLocaleString("vi-VN")
          :"Chưa phân công",

          active:a.assignmentStatus==="ASSIGNED",

          lat:req?.latitude || 10.7731,
          lng:req?.longitude || 106.7031

        }

      })

      setMissions(mapped)

    }
    catch(err){

      console.error("Load assignments error:",err)

    }
    finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    fetchAssignments()
  },[])

  /* ================= ACCEPT MISSION ================= */

  const handleAcceptMission = async (assignmentId)=>{

    try{

      await acceptRescueAssignment(assignmentId)

      alert("Đã nhận nhiệm vụ thành công")

      fetchAssignments()

    }
    catch(err){

      console.error(err)
      alert("Nhận nhiệm vụ thất bại")

    }

  }

  /* ================= FILTER ================= */

  const filteredMissions = missions.filter(m=>{

    const levelMatch = filterLevel
      ? m.level === filterLevel
      : true

    const addressMatch = filterAddress
      ? m.address.toLowerCase().includes(filterAddress.toLowerCase())
      : true

    return levelMatch && addressMatch

  })

  /* ================= UI ================= */

  return(

<section className="rm-mission-list">

<header className="rm-list-header">

<h3>
Nhiệm vụ cứu hộ <span>{filteredMissions.length}</span>
</h3>

<p>Các yêu cầu cứu hộ đang được điều phối từ trung tâm.</p>

</header>

{/* FILTER */}

<div className="rm-filter">

<select
value={filterLevel}
onChange={(e)=>setFilterLevel(e.target.value)}
>

<option value="">Tất cả mức độ</option>
<option value="Mức Độ Cao">Mức Độ Cao</option>
<option value="Mức Độ Trung Bình">Mức Độ Trung Bình</option>
<option value="Mức Độ Thấp">Mức Độ Thấp</option>

</select>

<input
placeholder="Lọc theo địa chỉ..."
value={filterAddress}
onChange={(e)=>setFilterAddress(e.target.value)}
/>

</div>

{/* LOADING */}

{loading && <p style={{padding:"10px"}}>Đang tải dữ liệu...</p>}

{/* LIST */}

{filteredMissions.map(m=>(

<div
key={m.id}
className={`rm-mission-card ${m.active?"active":""}`}
>

{/* MAP */}

<div className="rm-map-thumb">

<iframe
title={m.id}
src={`https://www.google.com/maps?q=${m.lat},${m.lng}&z=15&output=embed`}
loading="lazy"
/>

</div>

{/* CONTENT */}

<div className="rm-card-body">

<div className="rm-card-head">

<span className="rm-badge">
{m.level}
</span>

<span className="rm-time">
{m.time}
</span>

</div>

<h4>👤 {m.title}</h4>

<p className="rm-address">
📍 {m.address}
</p>

<div className="rm-tags">

<span>📞 {m.phone}</span>

<span>👥 {m.team}</span>

<span>🚑 {m.vehicle}</span>

<span>📊 {m.status}</span>

</div>

<div className="rm-actions">

<button
className="rm-btn-accept"
onClick={()=>handleAcceptMission(m.id)}
disabled={!m.active}
>
✓ CHẤP NHẬN NHIỆM VỤ
</button>

<button
className="rm-btn-detail"
onClick={()=>navigate(`/rescueTeam/mission/${m.id}`)}
>

XEM CHI TIẾT →

</button>

</div>

</div>

</div>

))}

</section>

)

}