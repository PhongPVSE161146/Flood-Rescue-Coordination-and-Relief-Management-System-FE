import { useEffect, useState, useMemo } from "react";
import { Select } from "antd";

import {
  getAllAssignments,
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../../api/axios/CoordinatorApi/RescueRequestApi";

import { getAllRescueTeams } from "../../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../../api/axios/Auth/authApi";

import "./list-team-cuuho.css";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

const assignmentStatusMap = {
  ASSIGNED:"Đã điều động",
  ACCEPTED:"Đội đã nhận",
  COMPLETED:"Hoàn thành",
  PENDING:"Chờ điều phối"
}

const assignmentStatusClass = {
  ASSIGNED:"status-assigned",
  ACCEPTED:"status-accepted",
  COMPLETED:"status-completed",
  PENDING:"status-pending"
}

export default function ListTeamCuuHo({ onSelectMission }) {

  const [missions, setMissions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading,setLoading] = useState(false)

  const [tab,setTab] = useState("new")
  const [tabLoading,setTabLoading] = useState(null)

  const [filters,setFilters] = useState({
    requestType:"",
    address:"",
    urgency:""
  })

  /* ================= LOAD API ================= */

  const fetchData = async()=>{

    try{

      setLoading(true)

      const [
        assignmentRes,
        teamRes,
        vehicleRes,
        requestRes,
        urgencyRes,
        statusRes
      ] = await Promise.all([
        getAllAssignments(),
        getAllRescueTeams(),
        getAllVehicles(),
        getPendingRescueRequests(),
        getUrgencyLevels(),
        getRequestStatuses()
      ])

      const assignments = assignmentRes?.data || assignmentRes || []
      const teams = teamRes?.data?.items || []
      const vehicles = vehicleRes?.data || []
      const requests = requestRes?.data || requestRes || []
      const urgencies = urgencyRes || []
      const statuses = statusRes?.data || statusRes || []

      /* MAP LOOKUP */

      const teamMap={}
      teams.forEach(t=>{
        teamMap[t.rcid]=t.rcName
      })

      const vehicleMap={}
      vehicles.forEach(v=>{
        vehicleMap[v.vehicleId]=v.vehicleName
      })

      const requestMap={}
      requests.forEach(r=>{
        requestMap[r.rescueRequestId]=r
      })

      const urgencyMap={}
      urgencies.forEach(u=>{
        urgencyMap[u.urgencyLevelId]=u.levelName
      })

      /* STATUS MAP (VIETNAMESE) */

      const statusMap={}
      statuses.forEach(s=>{
        statusMap[s.statusId]=s.description
      })

      /* ACTIVE ASSIGNMENTS */

      const activeAssignments = assignments.map(a => a)

      const mapped = activeAssignments.map(a=>{

        const req = requestMap[a.rescueRequestId]
        
        const urgencyLevel = urgencyMap[req?.urgencyLevelId]
        
        const requestStatus = statusMap[req?.statusId]
        
        const assignmentStatus = a.assignmentStatus
        
        return{
        
        id:a.rescueRequestId,
        assignmentId:a.assignmentId,
        
        team:teamMap[a.rescueTeamId] || `Team ${a.rescueTeamId}`,
        
        vehicle:vehicleMap[a.vehicleId] || `Vehicle ${a.vehicleId}`,
        
        fullname:req?.fullname || req?.fullName || "Không rõ",
        
        phone:req?.contactPhone || "Không có",
        
        address:req?.address || "Không xác định",
        
        incident:req?.requestType || "",
        
        assignmentStatus:assignmentStatus,
        
        urgency:
        priorityTranslate[urgencyLevel] ||
        urgencyLevel ||
        "Không xác định",
        
        status:requestStatus || "Đang xử lý",
        
        time:a.assignedAt
        ? new Date(a.assignedAt).toLocaleTimeString("vi-VN",{
        hour:"2-digit",
        minute:"2-digit"
        })
        :""
        
        }
        
        })
      setMissions(mapped)

    }catch(err){

      console.error("Load mission error:",err)

    }finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    fetchData()
  },[])

  /* ================= FILTER OPTIONS ================= */

  const ADDRESS_OPTIONS = useMemo(()=>{
    const unique=[...new Set(missions.map(m=>m.address))]
    return unique.map(a=>({label:a,value:a}))
  },[missions])

  const URGENCY_OPTIONS=[
    {label:"Tất cả",value:""},
    {label:"Mức Độ Cao",value:"Mức Độ Cao"},
    {label:"Mức Độ Trung Bình",value:"Mức Độ Trung Bình"},
    {label:"Mức Độ Thấp",value:"Mức Độ Thấp"}
  ]

  /* ================= TAB ================= */

  const changeTab=(key)=>{

    setTabLoading(key)

    setTimeout(()=>{
      setTab(key)
      setTabLoading(null)
      setFilters({
        requestType:"",
        address:"",
        urgency:""
      })
    },200)

  }

  /* ================= FILTER ================= */

  const filtered = useMemo(()=>{

    let list=[...missions]

    if(search){
      list=list.filter(m=>
        m.team?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if(filters.address){
      list=list.filter(m=>m.address===filters.address)
    }

    if(filters.urgency){
      list=list.filter(m=>m.urgency===filters.urgency)
    }

    return list

  },[missions,filters,search])

  /* ================= UI ================= */

  return(

<section className="rc-team-list">

<div className="rc-team-list__header">

<div className="rc-team-list__header-left">

<div className="rc-team-list__title">

<h3>Đang cứu hộ ({filtered.length})</h3>

<button
className="rc-refresh-btn"
onClick={fetchData}
disabled={loading}
>

{loading ? (
<span className="rc-spinner"></span>
) : (
"🔄 Làm mới"
)}

</button>

</div>

<input
className="rc-team-list__search"
placeholder="Lọc theo đội..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<div className="rc-team-list__header-right">



<div className="rc-queue__tabs">

<button
className={tab==="new"?"active":""}
onClick={()=>changeTab("new")}
>
MỚI NHẤT
</button>

<button
className={tab==="expired"?"active":""}
onClick={()=>changeTab("expired")}
>
QUÁ HẠN
</button>

<button
className={tab==="merge"?"active":""}
onClick={()=>changeTab("merge")}
>
GỘP YÊU CẦU
</button>

</div>

</div>

</div>

{/* FILTER */}

{tab==="merge" && (

<div className="rc-filter">

<Select
placeholder="Địa chỉ"
allowClear
style={{width:"100%"}}
options={ADDRESS_OPTIONS}
value={filters.address || undefined}
onChange={(v)=>setFilters({
requestType:"",
address:v || "",
urgency:""
})}
/>

<Select
placeholder="Mức độ nguy hiểm"
allowClear
style={{width:"100%",marginTop:8}}
options={URGENCY_OPTIONS}
value={filters.urgency || undefined}
onChange={(v)=>setFilters({
requestType:"",
address:"",
urgency:v || ""
})}
/>

</div>

)}

{/* LIST */}

<div className="rc-team-list__items">

{loading && <div>Đang tải dữ liệu...</div>}

{!loading && filtered.length===0 && (
  <div className="rc-empty">
  Không có dữ liệu
</div>
)}

{filtered.map(item => (

<div
  key={item.assignmentId}
  className="rc-team-item"
  onClick={()=>onSelectMission?.(item.assignmentId)}
>

<div className="rc-team-item__top">
<div className="rc-team-item__id">
  Mã : #{item.id}
</div>

<span className="rc-team-item__priority">
{item.urgency}
</span>

<span
className={`status-badge ${assignmentStatusClass[item.assignmentStatus]}`}
>
{assignmentStatusMap[item.assignmentStatus]}
</span>
</div>

<strong>{item.fullname}</strong>

<div>👥 {item.team}</div>

<div>🚑 {item.vehicle}</div>

<div>📍 {item.address}</div>

<div>📞 {item.phone}</div>

<div className="rc-team-item__footer">
⏱ {item.time}
</div>

</div>

))}

</div>

</section>

)

}