import "./rescue-operation-detail.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRescueAssignmentById,
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../../api/axios/CoordinatorApi/RescueRequestApi";
import { Image } from "antd";
// import UpdateDetailTeam from "../UpdateTeamSupportDetail/UpdateDetailTeam";
import { getAllRescueTeams } from "../../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../../api/axios/Auth/authApi";
const API_BASE = "https://api-rescue.purintech.id.vn";
const priorityTranslate = {
  High: "Mức Độ Cao",
  Medium: "Mức Độ Trung Bình",
  Low: "Mức Độ Thấp"
};



const STATUS_STEPS = [
  { key: "PENDING", label: "Chờ điều phối", icon: "⏳" },
  { key: "ASSIGNED", label: "Đã điều động", icon: "📋" },
  { key: "ACCEPTED", label: "Đội đã nhận", icon: "👍" },
  { key: "DEPARTED", label: "Đã xuất phát", icon: "🚑" },
  { key: "ARRIVED", label: "Đã đến hiện trường", icon: "📍" },
  { key: "COMPLETED", label: "Hoàn thành", icon: "✔" },
  // { key: "REJECTED", label: "Từ chối nhiệm vụ", icon: "❌" }
];

export default function RescueOperationDetail({ assignmentId }) {

  const navigate = useNavigate();

  const [detail,setDetail] = useState(null)

  const [location,setLocation] = useState({
    lat:10.8231,
    lng:106.6297
  })
  const [loading,setLoading] = useState(false)
  const [images,setImages] = useState([])





  /* ================= LOAD DATA ================= */

  const fetchData = async()=>{

    try{
  
      setLoading(true)
  
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
        
          startTime:assignment.assignedAt,
          detailDescription:req?.detailDescription || "",

victimCount:req?.victimCount || 0,

availableRescueTool:req?.availableRescueTool || "",

specialNeeds:req?.specialNeeds || "",
rejectReason: assignment?.rejectReason || "",
        
        }
  
      setDetail(data)
  
      if(req?.locationLat && req?.locationLng){
  
        setLocation({
          lat:req.locationLat,
          lng:req.locationLng
        })
  
      }
  
     /* ================= IMAGE FIX ================= */

const imgs = [];

if (Array.isArray(req?.imageUrls)) {
  imgs.push(...req.imageUrls);
}

if (Array.isArray(req?.images)) {
  imgs.push(...req.images);
}

if (req?.locationImageUrl) {
  imgs.push(req.locationImageUrl);
}

/* chuẩn hóa URL */
const normalizedImages = imgs.map((img) =>
  img.startsWith("http") ? img : API_BASE + img
);

setImages(normalizedImages);
  
}catch(err){

  console.error("Load detail error:",err)

}finally{

  setLoading(false)

}

}


  useEffect(()=>{

    if(!assignmentId) return
  
    fetchData()
  
  },[assignmentId])


  const handleFinishMission=()=>{
    navigate("/coordinator/reports")
  }

  if(loading){
    return(
      <div className="rc-loading">
    
        Đang tải dữ liệu nhiệm vụ...
      </div>
    )
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
⏱ Phân công lúc: 
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

<h4 className="card-title">1. THÔNG TIN NGƯỜI DÂN</h4>

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
<div className="info-item">

<label>ĐỊA CHỈ HIỆN TẠI</label>

<p className="address-text">
  {detail.address}
</p>
</div>
</section>

{/* TEAM */}

<section className="rc-op-card">

  <div className="rc-op-card-header">

    <h4 className="card-title">2. ĐỘI CỨU HỘ & PHƯƠNG TIỆN</h4>

    {/* <button
  className="rc-op-edit-btn"
  onClick={()=>setOpenEdit(true)}
  disabled={detail?.statusId >= 3}
>
  ✏️ Chỉnh sửa
</button> */}

  </div>

  <div className="rc-op-item">

    <label>Tên Đội Cứu Hộ</label>

    <p> {detail.team}</p>

  </div>

  <div className="rc-op-item">

    <label>Tên Phương Tiện</label>

    <p> {detail.vehicle}</p>

  </div>

</section>

{/* MAP */}

<section className="rc-op-card">

<h4 className="card-title">
3. VỊ TRÍ GPS
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
    <h4 className="card-title">4.  HÌNH ẢNH TỪ HIỆN TRƯỜNG</h4>
  </div>

  <div className="rc-images">

    {images.length === 0 && (
      <div className="rc-image">
        Không có hình ảnh
      </div>
    )}

    {images.length > 0 && (
      <Image.PreviewGroup>
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt="rescue"
            className="rc-image"
            style={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              borderRadius: 10
            }}
          />
        ))}
      </Image.PreviewGroup>
    )}

  </div>

</section>
<section className="card">

<h4 className="card-title">
  5. TÌNH TRẠNG KHẨN CẤP
</h4>

<p className="quote">
  {detail.detailDescription}
</p>

</section>
<section className="card">

<h4 className="card-title">
  6. NGUỒN LỰC
</h4>

<div className="resource-grid">

  <div className="resource-item">
    <label>SỐ NGƯỜI GẶP NẠN</label>
    <p>{detail.victimCount}</p>
  </div>

  <div className="resource-item">
    <label>DỤNG CỤ CỨU HỘ</label>
    <p>{detail.availableRescueTool}</p>
  </div>

</div>

<label>NHU CẦU ĐẶC BIỆT</label>

<p>{detail.specialNeeds}</p>

<label>GHI CHÚ CHO ĐỘI CỨU HỘ</label>

<p>{detail.rescueTeamNote || "Không có"}</p>

</section>
<section className="card">

<h4 className="card-title">
  7. LÝ DO TỪ CHỐI
</h4>

<p className="quote">
  {detail.rejectReason}
</p>

</section>

</div>

</div>

{/* <UpdateDetailTeam
open={openEdit}
detail={detail}
onClose={()=>setOpenEdit(false)}
onSave={()=>{

  fetchData()

}}
/> */}

</section>

)

}