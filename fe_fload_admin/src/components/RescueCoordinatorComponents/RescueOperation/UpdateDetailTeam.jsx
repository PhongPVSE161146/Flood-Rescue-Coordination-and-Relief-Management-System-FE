import { useEffect, useState } from "react";

import {
  getAllRescueTeams
} from "../../../../api/axios/ManagerApi/rescueTeamApi";

import {
  getAllVehicles
} from "../../../../api/axios/ManagerApi/vehicleApi";

import {
  updateRescueAssignment
} from "../../../../api/axios/CoordinatorApi/RescueRequestApi";

import "./update-detail-team.css";

import AuthNotify from "../../../utils/Common/AuthNotify";

export default function UpdateDetailTeam({
  open,
  onClose,
  detail,
  onSave
}) {

  const [teams,setTeams] = useState([])
  const [vehicles,setVehicles] = useState([])

  const [teamId,setTeamId] = useState("")
  const [vehicleId,setVehicleId] = useState("")

  const [loading,setLoading] = useState(false)

  /* ================= STATUS TEAM ================= */

  const translateTeamStatus = (status)=>{

    switch(status){

      case "on duty":
        return "🟢 Đang trực"

      case "ready":
        return "🟢 Sẵn sàng"

      case "busy":
        return "🔴 Đang bận"

      default:
        return "Không rõ"

    }

  }

  /* ================= LOAD DATA ================= */

  useEffect(()=>{

    if(!open) return

    const fetchData = async()=>{

      try{

        const [teamRes,vehicleRes] = await Promise.all([
          getAllRescueTeams(),
          getAllVehicles()
        ])

        const teamList = teamRes?.data?.items || []
        const vehicleList = vehicleRes?.data || []

        /* ================= TEAM FILTER ================= */

        const readyTeams = teamList.filter(team =>

          team.rcStatus?.toLowerCase() === "on duty" ||

          team.rcid === detail?.rescueTeamId

        )

        /* ================= VEHICLE FILTER ================= */

        const readyVehicles = vehicleList.filter(vehicle =>

          vehicle.vehicleStatus?.toLowerCase() === "ready" ||

          vehicle.vehicleId === detail?.vehicleId

        )

        setTeams(readyTeams)
        setVehicles(readyVehicles)

        /* ================= SET CURRENT VALUE ================= */

        if(detail){

          setTeamId(Number(detail.rescueTeamId) || "")
          setVehicleId(Number(detail.vehicleId) || "")

        }

      }catch(err){

        console.error("Load popup data error:",err)

        AuthNotify.error(
          "Lỗi tải dữ liệu",
          "Không thể tải danh sách đội cứu hộ"
        )

      }

    }

    fetchData()

  },[open,detail])

  /* ================= UPDATE ================= */

  const handleSave = async()=>{

    if(!teamId || !vehicleId){

      AuthNotify.warning(
        "Thiếu thông tin",
        "Vui lòng chọn đội cứu hộ và phương tiện"
      )

      return

    }

    try{

      setLoading(true)

      const payload = {

        rescueTeamId:Number(teamId),
        vehicleId:Number(vehicleId)

      }

      await updateRescueAssignment(
        detail.missionId,
        payload
      )

      AuthNotify.success(
        "Cập nhật thành công",
        "Đã thay đổi đội cứu hộ và phương tiện"
      )

      /* ================= RELOAD DATA ================= */

      if(onSave){
        onSave(payload)
      }

      onClose()

    }catch(err){

      console.error("Update assignment error:",err)

      AuthNotify.error(
        "Cập nhật thất bại",
        err?.response?.data?.message ||
        "Không thể cập nhật đội cứu hộ"
      )

    }finally{

      setLoading(false)

    }

  }

  if(!open) return null

  return(

<div className="udt-overlay">

<div className="udt-popup">

<h3>🚑 Cập nhật đội cứu hộ</h3>

{/* TEAM */}

<label>Đội cứu hộ</label>

<select
value={teamId}
disabled={loading}
onChange={(e)=>setTeamId(Number(e.target.value))}
>

<option value="">
Chọn đội cứu hộ
</option>

{teams.map(team=>(

<option
key={team.rcid}
value={team.rcid}
>

{team.rcName} - {translateTeamStatus(team.rcStatus)}

</option>

))}

</select>

{/* VEHICLE */}

<label>Phương tiện</label>

<select
value={vehicleId}
disabled={loading}
onChange={(e)=>setVehicleId(Number(e.target.value))}
>

<option value="">
Chọn phương tiện
</option>

{vehicles.map(v=>(

<option
key={v.vehicleId}
value={v.vehicleId}
>

{v.vehicleName} (Sẵn sàng)

</option>

))}

</select>

{/* ACTION */}

<div className="udt-actions">

<button
className="btn-cancel"
onClick={onClose}
disabled={loading}
>
Hủy
</button>

<button
className="btn-save"
onClick={handleSave}
disabled={loading}
>
{loading ? "Đang cập nhật..." : "Lưu"}
</button>

</div>

{/* LOADING */}

{loading && (

<div className="udt-loading">

<div className="udt-spinner"></div>

<span>Đang cập nhật...</span>

</div>

)}

</div>

</div>

  )

}