import React, { useEffect, useState } from "react";

function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All"); // เพิ่ม filter

  const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
  const EmailAdmin = adminData?.AdminEmail || "";

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/get_subscriptions.php");
      const data = await res.json();
      if (data.success) setSubscriptions(data.subscriptions);
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const updateStatus = async (SubscriptionID, Status) => {
    if (!window.confirm(`เปลี่ยนสถานะเป็น "${Status}"?`)) return;
    setUpdatingId(SubscriptionID);
    try {
      const res = await fetch("http://localhost/movix-project/backend/update_subscription_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ SubscriptionID, Status, EmailAdmin }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(prev =>
          prev.map(s =>
            s.SubscriptionID === SubscriptionID
              ? { ...s, SubscriptionStatus: Status, PaymentStatus: Status, EmailAdmin }
              : s
          )
        );
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะอัปเดตสถานะ");
    } finally { setUpdatingId(null); }
  };

  // Filter subscriptions ตามสถานะ
  const filteredSubscriptions = subscriptions.filter(s =>
    filterStatus === "All" ? true : s.SubscriptionStatus === filterStatus
  );

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto", color: "#000", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>💎 จัดการสมาชิกแบบรายเดือน</h1>

      {/* ปุ่มกรองสถานะ */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        {["All", "approved", "pending", "failed"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              margin: 5,
              padding: "8px 16px",
              backgroundColor: filterStatus === status ? "#f04e30" : "#555",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            {status === "approved" ? "✅ ชำระเงินสำเร็จ"
              : status === "pending" ? "⏳ กำลังดำเนินการ"
              : status === "failed" ? "❌ ชำระเงินไม่สำเร็จ"
              : "ทั้งหมด"}
          </button>
        ))}
      </div>

      {loading ? (
        <p>⏳ กำลังโหลด...</p>
      ) : filteredSubscriptions.length === 0 ? (
        <p>❌ ไม่มีสมาชิกในสถานะนี้</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f04e30", color: "#000" }}>
              <th style={{ padding: 8 }}>SubscriptionID</th>
              <th>Email Member</th>
              <th>ราคา</th>
              <th>สลิป</th>
              <th>วันที่ชำระ</th>
              <th>สถานะ</th>
              <th>Admin</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map(s => (
              <tr key={s.SubscriptionID} style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                <td>{s.SubscriptionID}</td>
                <td>{s.EmailMember}</td>
                <td>{s.Price}</td>
                <td>
                  {s.Img_slip && (
                    <img
                      src={`http://localhost/movix-project/backend/uploads/slipssub/${s.Img_slip}`}
                      alt="slip"
                      style={{ width: 80, cursor: "pointer" }}
                      onClick={() => setSelectedImage(`http://localhost/movix-project/backend/uploads/slipssub/${s.Img_slip}`)}
                    />
                  )}
                </td>
                <td>{s.Time_Slip}</td>
                <td>{s.SubscriptionStatus}</td>
                <td>{s.EmailAdmin || "-"}</td>
                <td>
                  {["approved", "pending", "failed"].map(status => (
                    <button
                      key={status}
                      disabled={updatingId === s.SubscriptionID}
                      onClick={() => updateStatus(s.SubscriptionID, status)}
                      style={{ margin: 2 }}
                    >
                      {status === "approved" ? "✅ อนุมัติ" : status === "pending" ? "⏳ รอตรวจสอบ" : "❌ ปฏิเสธ"}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center",
            cursor: "pointer"
          }}
        >
          <img src={selectedImage} alt="slip" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}
    </div>
  );
}

export default AdminSubscriptions;
