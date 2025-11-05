// src/Subscription.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); 
  const [expired, setExpired] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // สำหรับคลิกดู QR

  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const fetchSubscription = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/get_subscription_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailMember: user.MemberEmail }),
      });
      const data = await res.json();
      if (data.success) setSubscription(data.subscription);
      else setSubscription(null);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถโหลดสถานะสมาชิกได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchSubscription();
  }, []);

  useEffect(() => {
    if (!subscription || subscription.Status !== "pending") return;
    if (timeLeft <= 0) {
      setExpired(true);
      alert("หมดเวลาการชำระเงิน กรุณาสมัครใหม่อีกครั้ง");
      setSubscription(null);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, subscription]);

  const handlePayment = async () => {
    if (!slipFile) return alert("กรุณาอัปโหลดรูปสลิปก่อน");
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("EmailMember", user.MemberEmail);
      formData.append("SlipFile", slipFile);

      const res = await fetch("http://localhost/movix-project/backend/create_subscription.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ ส่งสลิปเรียบร้อย!");
        await fetchSubscription();
        navigate("/Movielist");
      } else {
        alert(`❌ ${data.message} หากมีปัญหาโปรดติดต่อ Admin`);
        await fetchSubscription();
      }
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาดในการส่งสลิป โปรดติดต่อ Admin");
    } finally {
      setProcessing(false);
    }
  };

  const cancelSubscription = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกการสมัคร?")) {
      setSubscription(null);
      setTimeLeft(300);
      setExpired(false);
      alert("ยกเลิกการสมัครเรียบร้อย");
    }
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  if (!user) return null;
  if (loading) return <p style={{ color: "#fff" }}>⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div style={{ background: "#121212", minHeight: "100vh", color: "#fff", padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#32CD32", fontWeight: 900 }}>💎 สมัครสมาชิกรายเดือน</h1>
        <button onClick={() => navigate("/movielist")} style={{ background: "#555", padding: "6px 12px", borderRadius: 6, border: "none", color: "#fff", cursor: "pointer" }}>🎬 กลับหน้าหลัก</button>
      </header>

      {subscription ? (
        <div style={{ background: "#1f1f1f", padding: 20, borderRadius: 10, maxWidth: 500, margin: "auto" }}>
          <h2>📜 สถานะปัจจุบัน: {subscription.Status}</h2>
          <p>ราคา: {subscription.Price} บาท</p>

          {subscription.Status === "approved" && (
            <>
              <p>เริ่มต้น: {subscription.StartDate}</p>
              <p>สิ้นสุด: {subscription.EndDate}</p>
            </>
          )}

          {subscription.Status === "pending" && (
            <>
              <h3 style={{ color: "#f04e30" }}>⏳ รอดำเนินการ / หากโอนแล้วกรุณาติดต่อ Admin</h3>

              {/* QR Code */}
              <div style={{ textAlign: "center", marginBottom: 15 }}>
                <p>📱 สแกน QR เพื่อชำระเงิน</p>
                <img
                  src="/qr.jpg"
                  alt="QR Code"
                  style={{ width: 180, borderRadius: 10, margin: "auto", cursor: "pointer", boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
                  onClick={() => setSelectedImage("/qr.jpg")}
                />
              </div>

              {/* แสดงบัญชีธนาคาร */}
              <div style={{ background: "#2c2c2c", padding: 10, borderRadius: 8, marginBottom: 15 }}>
                <p>🏦 บัญชีธนาคารกรุงสุโขทัย:</p>
                <p>เลขบัญชี: 123-4-56789-0</p>
                <p>ชื่อ Movix178 Co., Ltd.</p>
              </div>

              <label>📎 อัปโหลดรูปสลิป:</label>
              <input type="file" accept="image/*" onChange={(e) => setSlipFile(e.target.files[0])} style={{ display: "block", marginTop: 5 }} disabled={expired} />
              
              {!expired && <p>⏱ เวลาที่เหลือ: {formatTime(timeLeft)}</p>}
              {expired && <p style={{ color:"red" }}>หมดเวลาการชำระเงิน</p>}

              <div style={{ marginTop: 15 }}>
                <button onClick={handlePayment} disabled={processing || expired} style={{ marginRight: 10, padding:"10px 20px", background:"#00b894", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>
                  {processing ? "⏳ กำลังส่งสลิป..." : "💳 ส่งสลิปชำระเงิน"}
                </button>
                <button onClick={cancelSubscription} style={{ marginTop: 10, padding:"10px 20px", background:"#e74c3c", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>
                  ❌ ยกเลิก
                </button>
              </div>
            </>
          )}

          {(subscription.Status === "failed" || subscription.Status === "expired") && (
            <>
              <p style={{ color: "#f04e30" }}>❌ {subscription.Status === "failed" ? "การสมัครล้มเหลว" : "หมดอายุสมาชิก"} หากมีปัญหาโปรดติดต่อ Admin</p>
              <button onClick={() => { setSubscription(null); setTimeLeft(300); setExpired(false); }} style={{ padding:"10px 20px", background:"#32CD32", border:"none", borderRadius:6, color:"#fff", cursor:"pointer", fontWeight: 600 }}>
                💎 สมัครสมาชิกใหม่
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{ background: "#1f1f1f", padding: 20, borderRadius: 10, maxWidth: 500, margin: "auto", textAlign: "center" }}>
          <h2>📦 แพ็กเกจสมาชิกรายเดือน</h2>
          <p>ราคา: <strong>99 บาท / เดือน</strong></p>
          <p>ดูหนังได้ไม่จำกัดทุกเรื่องในระบบ</p>
          <button onClick={() => setSubscription({ Status: "pending", Price: 99 })} style={{ padding: "10px 20px", background: "#32CD32", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            💎 สมัครตอนนี้
          </button>
        </div>
      )}

      {/* Lightbox สำหรับดู QR */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999,
          cursor: "pointer"
        }}>
          <img src={selectedImage} alt="QR Large" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
}

export default Subscription;
