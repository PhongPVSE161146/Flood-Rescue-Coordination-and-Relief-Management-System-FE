import { useEffect, useState } from "react";
import { Button, message } from "antd";

import {
  getInventoryTransactions,
  confirmInventoryTransaction,
} from "../../../../api/axios/ManagerApi/inventoryApi";

import "./ApprovalManagement.css";

export default function ApprovalDispatch() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getInventoryTransactions();

      const outTransactions = res.data
        .filter((t) => t.transactionType === "OUT")
        .map((t) => ({
          ...t,
          id: t.id || t.transactionId,
        }));

      setTransactions(outTransactions);
    } catch {
      message.error("Load transactions thất bại");
    }
  };

  /* ================= FILTER ================= */

  const pending = transactions.filter(
    (t) => !t.confirmedAt && !t.confirmed_at
  );

  const confirmed = transactions.filter(
    (t) => t.confirmedAt || t.confirmed_at
  );

  const displayData = filter === "pending" ? pending : confirmed;

  /* ================= CONFIRM ================= */

  const handleConfirm = async (id) => {
    try {
      await confirmInventoryTransaction(id);

      message.success("Dispatch thành công");

      loadTransactions();
    } catch {
      message.error("Confirm thất bại");
    }
  };

  return (
    <div className="dispatch-page">
      {/* ================= TABLE ================= */}

      <div className="dispatch-table">

        <div className="table-header">
          <h3>Dispatch Approval</h3>

          <div className="filter">
            <Button
              type={filter === "pending" ? "primary" : "default"}
              onClick={() => setFilter("pending")}
            >
              Pending ({pending.length})
            </Button>

            <Button
              type={filter === "confirmed" ? "primary" : "default"}
              onClick={() => setFilter("confirmed")}
            >
              Confirmed ({confirmed.length})
            </Button>
          </div>
        </div>

        {/* ================= TABLE HEAD ================= */}

        <div className="table-head">
          <span>Transaction</span>
          <span>Warehouse</span>
          <span>Type</span>
          <span>Items</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* ================= ROW ================= */}

        {displayData.map((t) => (
          <div className="table-row" key={t.id}>
            <div className="row-cell">
              <strong>#{t.id}</strong>
              <p>Request: {t.rescueRequestId}</p>
            </div>

            <div className="row-cell">
              <strong>{t.warehouseId}</strong>
            </div>

            <div className="row-cell">
              <strong>{t.transactionType}</strong>
            </div>

            <div className="row-cell item">
              <div>
                {t.lines?.map((l, i) => (
                  <p key={i}>
                    Item {l.reliefItemId} - Qty: {l.quantity}
                  </p>
                ))}
              </div>
            </div>

            <div className="row-cell">
              {t.confirmedAt || t.confirmed_at ? (
                <strong style={{ color: "#22c55e" }}>Confirmed</strong>
              ) : (
                <strong style={{ color: "#f97316" }}>Pending</strong>
              )}
            </div>

            <div className="row-cell actions">
              {!t.confirmedAt && !t.confirmed_at && (
                <Button
                  type="primary"
                  onClick={() => handleConfirm(t.id)}
                >
                  Confirm
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* ================= FOOTER ================= */}

        <div className="table-footer">
          <span>Total: {displayData.length}</span>
        </div>

      </div>
    </div>
  );
}