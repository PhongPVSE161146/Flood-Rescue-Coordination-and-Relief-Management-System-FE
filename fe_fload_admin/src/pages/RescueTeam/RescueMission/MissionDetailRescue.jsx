import "./MissionDetailRescue.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";

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

export default function MissionDetailRescue(){

const { id } = useParams()
const navigate = useNavigate()

const [detail,setDetail] = useState(null)

useEffect(()=>{

const fetchDetail = async()=>{

try{

const [
assignment,
requestRes,
urgencyRes,
teamRes,
vehicleRes,
statusRes
] = await Promise.all([
getRescueAssignmentById(id),
getPendingRescueRequests(),
getUrgencyLevels(),
getAllRescueTeams(),
getAllVehicles(),
getRequestStatuses()
])

const requests = requestRes?.data || requestRes || []
const urgencies = urgencyRes || []
const teams = teamRes?.data?.items || []
const vehicles = vehicleRes?.data || []
const statuses = statusRes?.data || statusRes || []

const teamMap={}
teams.forEach(t=>teamMap[t.rcid]=t.rcName)

const vehicleMap={}
vehicles.forEach(v=>vehicleMap[v.vehicleId]=v.vehicleName)

const urgencyMap={}
urgencies.forEach(u=>urgencyMap[u.urgencyLevelId]=u.levelName)

const statusMap={}
statuses.forEach(s=>statusMap[s.statusId]=s.description)

const req = requests.find(
r=>r.rescueRequestId===assignment.rescueRequestId
)

const urgencyLevel = urgencyMap[req?.urgencyLevelId]

setDetail({

assignmentId:assignment.assignmentId,

requestId:assignment.rescueRequestId,

name:req?.fullName || req?.fullname || "Không rõ",

phone:req?.contactPhone || "Không có",

address:req?.address || "Chưa cập nhật",

urgency:
priorityTranslate[urgencyLevel] ||
urgencyLevel ||
"Không xác định",

status:statusMap[req?.requestStatusId] || "Đang xử lý",

team:teamMap[assignment.rescueTeamId] || `Đội ${assignment.rescueTeamId}`,

vehicle:vehicleMap[assignment.vehicleId] || "Không có xe",

assignedAt:assignment.assignedAt,

lat:req?.latitude || 10.7731,
lng:req?.longitude || 106.7031

})

}
catch(err){

console.error("Load mission detail error:",err)

}

}

fetchDetail()

},[id])

if(!detail){

return <div style={{padding:40}}>Đang tải dữ liệu nhiệm vụ...</div>

}

return(

<section className="md-root">

{/* ================= HEADER ================= */}

<header className="md-header">

<div className="md-header-inner">

<div className="md-title">

Nhiệm vụ cứu hộ

<span className="md-badge">
#{detail.requestId}
</span>

<span className="md-status">
{detail.status}
</span>

</div>

<div className="md-time">

⏱ Phân công lúc:
{" "}
{detail.assignedAt
? new Date(detail.assignedAt).toLocaleString("vi-VN")
: "Chưa phân công"}

</div>

</div>

</header>

{/* ================= CONTENT ================= */}

<div className="md-content">

{/* LEFT */}

<aside className="md-left">

{/* NẠN NHÂN */}

<div className="md-card">

<h4>👤 Thông tin người yêu cầu</h4>

<div className="md-info">

<label>Họ và tên</label>
<b>{detail.name}</b>

</div>

<div className="md-info">

<label>Số điện thoại</label>

<span className="md-phone">
{detail.phone}
</span>

<button
className="md-call"
onClick={()=>window.location.href=`tel:${detail.phone}`}
>
📞 Gọi
</button>

</div>

</div>

{/* ĐỊA CHỈ */}

<div className="md-card">

<h4>📍 Vị trí cứu hộ</h4>

<p>{detail.address}</p>

</div>

{/* MỨC ĐỘ */}

<div className="md-card md-danger">

<h4>⚠ Mức độ nguy hiểm</h4>

<p>{detail.urgency}</p>

</div>

{/* ĐỘI CỨU HỘ */}

<div className="md-card">

<h4>🚑 Đội cứu hộ</h4>

<p>👥 {detail.team}</p>
<p>🚗 {detail.vehicle}</p>

</div>

</aside>

{/* RIGHT */}

<main className="md-right">

{/* MAP */}

<div className="md-map">

<div className="md-map-label">

📍 {detail.address}

</div>

<iframe
title="rescue-map"
src={`https://www.google.com/maps?q=${detail.lat},${detail.lng}&z=15&output=embed`}
loading="lazy"
/>

</div>

{/* MEDIA */}

<section className="md-media">

<div className="md-media-header">

<h4>📷 Hình ảnh hiện trường</h4>

<span className="md-download">
Tải tất cả
</span>

</div>

<div className="md-media-list">

<div className="md-thumb"></div>
<div className="md-thumb"></div>

<div className="md-thumb video">
▶
</div>

<div className="md-thumb upload">
📷
<span>Thêm ảnh</span>
</div>

</div>

</section>

</main>

</div>

{/* ================= FOOTER ================= */}

<footer className="md-footer">

<button
className="md-back"
onClick={()=>navigate(-1)}
>

← Quay lại

</button>

<button className="md-accept">

✓ Nhận nhiệm vụ

</button>

</footer>

</section>

)

}