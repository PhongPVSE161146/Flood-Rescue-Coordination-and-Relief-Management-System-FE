// import { useEffect, useState } from "react";
// import { Button, message } from "antd";

// import {
//   getInventoryTransactions,
//   confirmInventoryTransaction,
// } from "../../../../api/axios/ManagerApi/inventoryApi";

// import "../../../pages/Manager/Approval/ApprovalManagement.css";

// export default function ApprovalManagementContainer() {
//   const [transactions, setTransactions] = useState([]);
//   const [filter, setFilter] = useState("pending");

//   /* ================= LOAD DATA ================= */

//   async function loadTransactions() {
//     try {
//       const res = await getInventoryTransactions();

//       // ✅ res là array luôn
//       const outTransactions = (res || [])
//         .filter((t) => t.transactionType === "OUT")
//         .map((t) => ({
//           ...t,
//           id: t.transactionId, // ✅ fix id
//         }));

//       setTransactions(outTransactions);
//     } catch (err) {
//       console.error(err);
//       message.error("Load transactions thất bại");
//     }
//   }

//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   /* ================= FILTER ================= */

//   const pending = transactions.filter((t) => !t.confirmedAt);

//   const confirmed = transactions.filter((t) => t.confirmedAt);

//   const displayData = filter === "pending" ? pending : confirmed;

//   /* ================= CONFIRM ================= */

//   const handleConfirm = async (id) => {
//     try {
//       await confirmInventoryTransaction(id);
//       message.success("Dispatch thành công");
//       loadTransactions();
//     } catch (err) {
//       console.error(err);
//       message.error("Confirm thất bại");
//     }
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="dispatch-page">
//       <div className="dispatch-table">
//         <div className="table-header">
//           <h3>Dispatch Approval</h3>

//           <div className="filter">
//             <Button
//               type={filter === "pending" ? "primary" : "default"}
//               onClick={() => setFilter("pending")}
//             >
//               Pending ({pending.length})
//             </Button>

//             <Button
//               type={filter === "confirmed" ? "primary" : "default"}
//               onClick={() => setFilter("confirmed")}
//             >
//               Confirmed ({confirmed.length})
//             </Button>
//           </div>
//         </div>

//         {/* HEAD */}
//         <div className="table-head">
//           <span>Transaction</span>
//           <span>Warehouse</span>
//           <span>Type</span>
//           <span>Items</span>
//           <span>Status</span>
//           <span>Action</span>
//         </div>

//         {/* ROW */}
//         {displayData.map((t) => (
//           <div className="table-row" key={t.id}>
//             <div className="row-cell">
//               <strong>#{t.id}</strong>
//               <p>Request: {t.rescueRequestId || "-"}</p>
//             </div>

//             <div className="row-cell">
//               <strong>WH-{t.warehouseId}</strong>
//             </div>

//             <div className="row-cell">
//               <strong>{t.transactionType}</strong>
//             </div>

//             {/* ✅ FIX ITEMS UI */}
//             <div className="row-cell item">
//               {t.lines?.map((l, i) => (
//                 <p key={i}>
//                   {l.itemName} - {l.quantity} {l.unit}
//                 </p>
//               ))}
//             </div>

//             <div className="row-cell">
//               {t.confirmedAt ? (
//                 <strong style={{ color: "#22c55e" }}>Confirmed</strong>
//               ) : (
//                 <strong style={{ color: "#f97316" }}>Pending</strong>
//               )}
//             </div>

//             <div className="row-cell actions">
//               {!t.confirmedAt && (
//                 <Button
//                   type="primary"
//                   onClick={() => handleConfirm(t.id)}
//                 >
//                   Confirm
//                 </Button>
//               )}
//             </div>
//           </div>
//         ))}

//         {/* FOOTER */}
//         <div className="table-footer">
//           <span>Total: {displayData.length}</span>
//         </div>
//       </div>
//     </div>
//   );
// }