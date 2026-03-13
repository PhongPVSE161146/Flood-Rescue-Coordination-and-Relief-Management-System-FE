import "./MissionDetailRescue.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";

import {
  getRescueAssignmentById,
  getPendingRescueRequests,
  getUrgencyLevels
} from "../../../../../api/axios/CoordinatorApi/RescueRequestApi";

import { getAllRescueTeams } from "../../../../../api/axios/ManagerApi/rescueTeamApi";
import { getAllVehicles } from "../../../../../api/axios/ManagerApi/vehicleApi";
import { getRequestStatuses } from "../../../../../api/axios/Auth/authApi";

const priorityTranslate = {
  High:"Mức Độ Cao",
  Medium:"Mức Độ Trung Bình",
  Low:"Mức Độ Thấp"
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

const urgencyText =
priorityTranslate[urgencyLevel] ||
urgencyLevel ||
"Không xác định"

setDetail({

assignmentId:assignment.assignmentId,

requestId:assignment.rescueRequestId,

name:req?.fullName || req?.fullname || "Không rõ",

phone:req?.contactPhone || "Không có",

address:req?.address || "Chưa cập nhật",

detailDescription:req?.detailDescription || "Không có mô tả",

victimCount:req?.victimCount || 0,

availableRescueTool:req?.availableRescueTool || "Không có",

specialNeeds:req?.specialNeeds || "Không có",

rescueTeamNote:req?.rescueTeamNote || "Không có",

urgency:urgencyText,

status:statusMap[req?.statusId] || "Đang xử lý",

team:teamMap[assignment.rescueTeamId] || `Đội ${assignment.rescueTeamId}`,

vehicle:vehicleMap[assignment.vehicleId] || "Không có xe",

assignedAt:assignment.assignedAt,

lat:req?.locationLat || 10.7731,
lng:req?.locationLng || 106.7031,

image:req?.locationImageUrl

})

}catch(err){

console.error("Load mission detail error:",err)

}

}

fetchDetail()

},[id])

if(!detail){

return <div className="md-loading">Đang tải dữ liệu nhiệm vụ...</div>

}

return(

<section className="md-root">

{/* HEADER */}

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
{detail.assignedAt
? new Date(detail.assignedAt).toLocaleString("vi-VN")
:"Chưa phân công"}

</div>

</div>

<div className="md-header-actions">

<button
className="md-call"
onClick={()=>window.location.href=`tel:${detail.phone}`}
>
📞 Gọi người yêu cầu
</button>

</div>

<p className="md-address">📍 {detail.address}</p>

</header>

{/* CONTENT */}

<div className="md-content">

{/* LEFT */}

<aside className="md-left">

<div className="md-card">

<h4>👤 Người yêu cầu</h4>

<div className="md-info">
<label>Họ tên</label>
<b>{detail.name}</b>
</div>

<div className="md-info">
<label>Số điện thoại</label>
<b>{detail.phone}</b>
</div>

</div>

<div className="md-card">

<h4>🚑 Đội cứu hộ</h4>

<p>👥 {detail.team}</p>
<p>🚗 {detail.vehicle}</p>

</div>

<div className="md-card md-danger">

<h4>⚠ Mức độ nguy hiểm</h4>

<p>{detail.urgency}</p>

</div>

<div className="md-card">

<h4>📋 Thông tin cứu hộ</h4>

<div className="md-info">
<label>Số nạn nhân</label>
<b>{detail.victimCount}</b>
</div>

<div className="md-info">
<label>Dụng cụ có sẵn</label>
<b>{detail.availableRescueTool}</b>
</div>

<div className="md-info">
<label>Nhu cầu đặc biệt</label>
<b>{detail.specialNeeds}</b>
</div>

<div className="md-info">
<label>Ghi chú đội cứu hộ</label>
<b>{detail.rescueTeamNote}</b>
</div>

</div>

<div className="md-card">

<h4>📝 Mô tả sự cố</h4>

<p className="md-description">
{detail.detailDescription}
</p>

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

{/* IMAGE FROM API */}

<section className="md-media">

<h4>📷 Hình ảnh hiện trường</h4>

<div className="md-media-list">

{detail.image ? (

<img
src={detail.image}
alt="rescue"
className="md-thumb-img"
/>

):(

<div className="md-thumb-empty">
Không có hình ảnh
</div>

)}

</div>

</section>

</main>

</div>

{/* FOOTER */}

<footer className="md-footer">

<button
className="md-back"
onClick={()=>navigate(-1)}
>
← Quay lại
</button>

<button className="md-reject">
✖ Từ chối
</button>

<button className="md-accept">
✓ Chấp nhận nhiệm vụ
</button>

</footer>

</section>

)

}