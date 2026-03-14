import "./rescue-operation-detail.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRescueAssignmentById,
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import { getAllRescueTeams } from "../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../api/axios/Auth/authApi";

const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};

export default function RescueOperationDetail({ assignmentId }) {

  const navigate = useNavigate();

  const [detail,setDetail] = useState(null)

  const [location,setLocation] = useState({
    lat:10.8231,
    lng:106.6297
  })

  const [images,setImages] = useState([])

  const [messages,setMessages] = useState([])
  const [input,setInput] = useState("")
  const messagesRef = useRef(null)

  /* ================= LOAD DATA ================= */

  useEffect(()=>{

    if(!assignmentId) return

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

        /* MAP LOOKUP */

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

          team:teamMap[assignment.rescueTeamId],

          vehicle:vehicleMap[assignment.vehicleId],

          fullname:req?.fullname || req?.fullName,

          phone:req?.contactPhone,

          address:req?.address,

          urgency:urgencyText,

          status:statusMap[req?.requestStatusId],

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
    return <div style={{padding:20}}>Chọn nhiệm vụ bên trái</div>
  }

  return(

<section className="rc-op-detail">

{/* HEADER */}

<header className="rc-op-detail__header">

<div>

<h2>
Nhiệm vụ #{detail.missionId}

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

<div className={`rc-timeline__item ${
detail.status==="Đã được tiếp nhận" ||
detail.status==="Đang trên đường" ||
detail.status==="Đang cứu hộ" ||
detail.status==="Đã hoàn thành"
?"done":""
}`}>

<div className="rc-timeline__icon">✓</div>

<div className="rc-timeline__content">
<b>ĐÃ TIẾP NHẬN</b>
</div>

</div>

<div className="rc-timeline__line"/>

<div className={`rc-timeline__item ${
detail.status==="Đang trên đường"
?"active"
: detail.status==="Đang cứu hộ" || detail.status==="Đã hoàn thành"
?"done":""
}`}>

<div className="rc-timeline__icon">🚑</div>

<div className="rc-timeline__content">
<b>ĐANG TRÊN ĐƯỜNG</b>
</div>

</div>

<div className="rc-timeline__line"/>

<div className={`rc-timeline__item ${
detail.status==="Đang cứu hộ"
?"active"
: detail.status==="Đã hoàn thành"
?"done":""
}`}>

<div className="rc-timeline__icon">🛟</div>

<div className="rc-timeline__content">
<b>ĐANG CỨU HỘ</b>
</div>

</div>

<div className="rc-timeline__line"/>

<div className={`rc-timeline__item ${
detail.status==="Đã hoàn thành"
?"done":""
}`}>

<div className="rc-timeline__icon">✔</div>

<div className="rc-timeline__content">
<b>HOÀN THÀNH</b>
</div>

</div>

</div>

</section>

{/* GRID */}

<div className="rc-op-grid">

<div className="rc-op-col">

{/* INFO */}

<section className="rc-op-card">

<h4>👤 THÔNG TIN NẠN NHÂN</h4>

<div className="rc-info-row">

<div>

<label>NGƯỜI GỬI YÊU CẦU</label>

<b>{detail.fullname}</b>

<span className="link">
{detail.phone}
</span>

</div>

<div>

<label>ĐỊA CHỈ</label>

<p>{detail.address}</p>

</div>

</div>

</section>

{/* TEAM */}

<section className="rc-op-card">

<h4>🚑 ĐỘI CỨU HỘ</h4>

<p>👥 {detail.team}</p>

<p>🚑 {detail.vehicle}</p>

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

{/* IMAGES */}

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

</div>

{/* CHAT */}

<div className="rc-op-col">

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

</section>

  )

}