import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
  const EmailAdmin = adminData?.AdminEmail || "";

  useEffect(() => {
    if (!adminData) navigate("/adminlogin");
    else fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/get_payments.php");
      const data = await res.json();
      if (data.success) setPayments(data.payments);
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะโหลดข้อมูลการชำระเงิน");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (PaymentBatchID, status) => {
    if (!window.confirm(`เปลี่ยนสถานะเป็น "${status}"?`)) return;
    setUpdatingId(PaymentBatchID);
    try {
      const res = await fetch("http://localhost/movix-project/backend/update_payment_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ PaymentBatchID, PaymentStatus: status, EmailAdmin }),
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev =>
          prev.map(p =>
            p.PaymentBatchID === PaymentBatchID ? { ...p, PaymentStatus: status, EmailAdmin } : p
          )
        );
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะอัปเดตสถานะ");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredPayments = (filterStatus === "all"
    ? payments
    : payments.filter(p => p.PaymentStatus === filterStatus)
  ).sort((a, b) => b.PaymentBatchID - a.PaymentBatchID);

  if (!adminData) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "50px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#121212", padding: 20, color: "#fff", borderRadius: 10 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>💰 จัดการการชำระเงินการเช่า</h1>
      <button onClick={() => navigate("/admindashboard")} style={{ marginBottom: 20, padding: "6px 12px", borderRadius: 6, backgroundColor: "#555", color: "#fff", border: "none", cursor: "pointer" }}>⬅ กลับไป Dashboard</button>

      {/* Filter */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        {["all", "pending", "paid", "failed"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: filterStatus === status ? "#f04e30" : "#555",
              color: "#fff"
            }}
          >
            {status === "paid" ? "✅ ชำระเงินสำเร็จ"
              : status === "pending" ? "⏳ รอตรวจสอบ"
              : status === "failed" ? "❌ ชำระเงินไม่สำเร็จ"
              : "ทั้งหมด"}
          </button>
        ))}
      </div>

      {loading ? <p>⏳ กำลังโหลด...</p> :
        filteredPayments.length === 0 ? <p>❌ ไม่มีรายการชำระเงิน</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr style={{ backgroundColor: "#f04e30", color: "#fff" }}>
                <th style={{ padding: 8 }}>BatchID</th>
                <th>Email Member</th>
                <th>จำนวนเรื่อง</th>
                <th>ราคาทั้งหมด</th>
                <th>รูปสลิป</th>
                <th>วันที่</th>
                <th>สถานะ</th>
                <th>Admin</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.PaymentBatchID} style={{ borderBottom: "1px solid #444" }}>
                  <td>{p.PaymentBatchID}</td>
                  <td>{p.EmailMember}</td>
                  <td>{p.RentalIDsArray.length}</td>
                  <td>{p.AllPrice}</td>
                  <td>
                    {p.Img_slip && (
                      <img
                        src={`http://localhost/movix-project/backend/uploads/slips/${p.Img_slip}`}
                        alt="slip"
                        style={{ width: 80, cursor: "pointer" }}
                        onClick={() => setSelectedImage(`http://localhost/movix-project/backend/uploads/slips/${p.Img_slip}`)}
                      />
                    )}
                  </td>
                  <td>{p.Time_Slip}</td>
                  <td>{p.PaymentStatus}</td>
                  <td>{p.EmailAdmin || "-"}</td>
                  <td>
                    <button disabled={updatingId === p.PaymentBatchID} onClick={() => updateStatus(p.PaymentBatchID, "paid")} style={{ margin: 2 }}>✅อนุมัติ</button>
                    <button disabled={updatingId === p.PaymentBatchID} onClick={() => updateStatus(p.PaymentBatchID, "pending")} style={{ margin: 2 }}>⏳กำลังตรวจสอบ</button>
                    <button disabled={updatingId === p.PaymentBatchID} onClick={() => updateStatus(p.PaymentBatchID, "failed")} style={{ margin: 2 }}>❌ชำระเงินไม่สำเร็จ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {/* Fullscreen slip */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex", justifyContent: "center", alignItems: "center",
            cursor: "pointer",
            zIndex: 9999
          }}
        >
          <img src={selectedImage} alt="slip" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 10, boxShadow: "0 0 15px #fff" }} />
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
