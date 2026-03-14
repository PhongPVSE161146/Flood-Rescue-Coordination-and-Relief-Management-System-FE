import "./rescue-operation-detail.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRescueAssignmentById,
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../../api/axios/CoordinatorApi/RescueRequestApi";
import UpdateDetailTeam from "../UpdateTeamSupportDetail/UpdateDetailTeam";
import { getAllRescueTeams } from "../../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../../api/axios/Auth/authApi";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};



const STATUS_STEPS = [
  { key:"PENDING", label:"Chờ Điều Phối", icon:"🕒" },
  { key:"ASSIGNED", label:"Đã Điều Động", icon:"📋" },
  { key:"ACCEPTED", label:"Đội đã nhận", icon:"🚑" },
  { key:"RESCUING", label:"Đang cứu hộ", icon:"🛟" },
  { key:"COMPLETED", label:"Hoàn thành", icon:"✔" },
  { key:"CANCELLED", label:"Đã hủy", icon:"❌" }
]

export default function RescueOperationDetail({ assignmentId }) {

  const navigate = useNavigate();

  const [detail,setDetail] = useState(null)

  const [location,setLocation] = useState({
    lat:10.8231,
    lng:106.6297
  })

  const [images,setImages] = useState([])
  const [openEdit,setOpenEdit] = useState(false)
  const [messages,setMessages] = useState([])
  const [input,setInput] = useState("")
  const messagesRef = useRef(null)

  const normalizeStatus = (s)=> s?.trim().toLowerCase()

  /* ================= LOAD DATA ================= */

  const fetchData = async()=>{

    try{
  
      const [
        assignment,
        requestRes,
        urgencyRes,
        teamRes,
        vehicleRes,
        statusRes
      ] = await Promise.all([
        getRescueAssignmentById(assignmentId),
        getPendingRescueRequests(),
        getUrgencyLevels(),
        getAllRescueTeams(),
        getAllVehicles(),
        getRequestStatuses()
      ])
  
      const requests = requestRes?.data || requestRes || []
      const teams = teamRes?.data?.items || []
      const vehicles = vehicleRes?.data || []
      const urgencies = urgencyRes || []
      const statuses = statusRes?.data || statusRes || []
  
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
  
      const req = requests.find(
        r=>r.rescueRequestId===assignment.rescueRequestId
      )
  
      const urgencyLevel = urgencyMap[req?.urgencyLevelId]
  
      const urgencyText =
        priorityTranslate[urgencyLevel] ||
        urgencyLevel ||
        "Không xác định"
  
        const data={

          missionId:assignment.assignmentId,
          rescueRequestId:assignment.rescueRequestId,
          rescueTeamId:assignment.rescueTeamId,
          vehicleId:assignment.vehicleId,
        
          team:teamMap[assignment.rescueTeamId],
          vehicle:vehicleMap[assignment.vehicleId],
          assignmentStatus: assignment.assignmentStatus,
          fullname:req?.fullname || req?.fullName,
          phone:req?.contactPhone,
          address:req?.address,
        
          urgency:urgencyText,
        
          status:statusMap[req?.requestStatusId],
          statusId:req?.requestStatusId,
        
          startTime:assignment.assignedAt
        
        }
  
      setDetail(data)
  
      if(req?.locationLat && req?.locationLng){
  
        setLocation({
          lat:req.locationLat,
          lng:req.locationLng
        })
  
      }
  
      if(req?.images){
        setImages(req.images)
      }
  
    }catch(err){
  
      console.error("Load detail error:",err)
  
    }
  
  }


  useEffect(()=>{

    if(!assignmentId) return
  
    fetchData()
  
  },[assignmentId])

  /* ===== AUTO SCROLL CHAT ===== */

  useEffect(()=>{
    if(messagesRef.current){
      messagesRef.current.scrollTop=
      messagesRef.current.scrollHeight
    }
  },[messages])


  /* ===== SEND MESSAGE ===== */

  const sendMessage=()=>{

    if(!input.trim()) return

    const now=new Date()

    const time=now.toLocaleTimeString("vi-VN",{
      hour:"2-digit",
      minute:"2-digit"
    })

    setMessages(prev=>[
      ...prev,
      {
        id:Date.now(),
        side:"right",
        author:"Bạn (Coordinator)",
        text:input,
        time
      }
    ])

    setInput("")

  }

  const handleKeyDown=(e)=>{
    if(e.key==="Enter"){
      sendMessage()
    }
  }

  const handleFinishMission=()=>{
    navigate("/coordinator/reports")
  }

  if(!detail){
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 600,
          color: "#555"
        }}
      >
        Chọn yêu cầu bên trái để xem chi tiết
      </div>
    );
  }

  let visibleSteps = STATUS_STEPS

  if(detail.assignmentStatus === "CANCELLED"){
    visibleSteps = STATUS_STEPS.filter(step =>
      ["ASSIGNED","CANCELLED"].includes(step.key)
    )
  }

  const currentIndex = visibleSteps.findIndex(
    s => s.key === detail.assignmentStatus
  )


  return(

<section className="rc-op-detail">

{/* HEADER */}

<header className="rc-op-detail__header">

<div>

<h2>
Nhiệm vụ #{detail.rescueRequestId}

<span className="rc-badge rc-badge--danger">
{detail.urgency}
</span>

</h2>

<p>
⏱ Bắt đầu lúc:
{detail.startTime &&
new Date(detail.startTime).toLocaleTimeString("vi-VN")}
</p>

</div>

<div className="rc-op-detail__actions">

<button className="btn-outline">
Hỗ trợ thêm đội
</button>

<button
className="btn-primary"
onClick={handleFinishMission}
>
Kết thúc nhiệm vụ
</button>

</div>

</header>

{/* ================= TIMELINE ================= */}

<section className="rc-op-card">

<div className="rc-timeline">

{visibleSteps.map((step,index)=>{

const isActive = index === currentIndex
const isDone = index < currentIndex

return(

<div key={step.key} className="rc-timeline__step">

<div
className={`rc-timeline__item 
${isActive ? "active":""}
${isDone ? "done":""}`}
>

<div className="rc-timeline__icon">
{step.icon}
</div>

<div className="rc-timeline__content">
<b>{step.label.toUpperCase()}</b>
</div>

</div>

{index < visibleSteps.length-1 && (
<div className={`rc-timeline__line ${isDone ? "done":""}`} />
)}

</div>

)

})}

</div>

</section>

{/* GRID */}

<div className="rc-op-grid">

<div className="rc-op-col">

{/* INFO */}

<section className="card">

<h4 className="card-title">👤 THÔNG TIN NGƯỜI DÂN</h4>

<div className="info-row">

  <div className="info-item">
    <label>HỌ VÀ TÊN</label>
    <strong>{detail.name || detail.fullname}</strong>
  </div>

  <div className="info-item">
    <label>SỐ ĐIỆN THOẠI</label>
    <strong className="phone">{detail.phone}</strong>
  </div>

</div>

<label>ĐỊA CHỈ HIỆN TẠI</label>

<p className="address-text">
  {detail.address}
</p>

</section>

{/* TEAM */}

<section className="rc-op-card">

  <div className="rc-op-card-header">

    <h4>🚑 ĐỘI CỨU HỘ & PHƯƠNG TIỆN</h4>

    <button
  className="rc-op-edit-btn"
  onClick={()=>setOpenEdit(true)}
  disabled={detail?.statusId >= 3}
>
  ✏️ Chỉnh sửa
</button>

  </div>

  <div className="rc-op-item">

    <label>Đội Cứu Hộ</label>

    <p>👥 {detail.team}</p>

  </div>

  <div className="rc-op-item">

    <label>Phương Tiện</label>

    <p>🚑 {detail.vehicle}</p>

  </div>

</section>

{/* MAP */}

<section className="rc-op-card">

<h4>
📍 VỊ TRÍ GPS
<span className="rc-online">● TRỰC TUYẾN</span>
</h4>

<div className="rc-map-mini">

<iframe
title="team-map"
src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
loading="lazy"
/>

</div>

</section>

</div>

{/* CHAT */}

<div className="rc-op-col">

<section className="rc-op-card">

<div className="rc-card-header">
<h4>📷 HÌNH ẢNH TỪ HIỆN TRƯỜNG</h4>
</div>

<div className="rc-images">

{images.length===0 && (
<div className="rc-image">
Không có hình ảnh
</div>
)}

{images.map((img,i)=>(

<div
key={i}
className="rc-image"
style={{
backgroundImage:`url(${img})`,
backgroundSize:"cover",
backgroundPosition:"center"
}}
>

</div>

))}

</div>

</section>

<section className="rc-op-card rc-chat">

<div className="rc-card-header">

<h4>💬 NHẬT KÝ CẬP NHẬT & CHAT</h4>

<span>ID: #{detail.missionId}</span>

</div>

<div
className="rc-chat__messages"
ref={messagesRef}
>

{messages.map(msg=>(
<div key={msg.id} className={`msg ${msg.side}`}>

<div className="msg__bubble">

<span className="msg__author">
{msg.author}
</span>

<p className="msg__text">
{msg.text}
</p>

<span className="msg__time">
{msg.time}
</span>

</div>

</div>
))}

</div>

<div className="rc-chat__input">

<input
placeholder="Nhập tin nhắn..."
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={handleKeyDown}
/>

<button onClick={sendMessage}>
➤
</button>

</div>

</section>

</div>

</div>

<UpdateDetailTeam
open={openEdit}
detail={detail}
onClose={()=>setOpenEdit(false)}
onSave={()=>{

  fetchData()

}}
/>

</section>

)

}