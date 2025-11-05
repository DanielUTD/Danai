// src/Payment.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartIDs = location.state?.CartIDs || [];
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [expired, setExpired] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const fetchRentals = async () => {
    if (!user || cartIDs.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/get_rentals_batch.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CartIDs: cartIDs, EmailMember: user.MemberEmail }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.rentals)) setRentals(data.rentals);
      else setRentals([]);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      alert("เกิดข้อผิดพลาดขณะโหลดข้อมูลการเช่า");
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    else fetchRentals();
  }, [cartIDs]);

  useEffect(() => {
    if (loading || expired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          alert("⏰ หมดเวลาการชำระเงิน");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, expired]);

  const handlePayment = async () => {
    if (expired) return alert("หมดเวลาการชำระเงิน");
    if (!slipFile) return alert("กรุณาอัปโหลดสลิปก่อนชำระเงิน");
    if (cartIDs.length === 0) return alert("ไม่พบรายการที่เลือกชำระเงิน");

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("CartIDs", JSON.stringify(cartIDs));
      formData.append("EmailMember", user.MemberEmail);
      formData.append("PaymentMethod", "offline");
      formData.append("SlipFile", slipFile);

      const res = await fetch("http://localhost/movix-project/backend/create_payment_batch.php", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (data.success) {
        alert("✅ ส่งสลิปเรียบร้อย!");
        navigate("/cart");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดขณะชำระเงิน");
    } finally {
      setProcessing(false);
    }
  };

  const totalPrice = rentals.reduce((sum, r) => sum + (parseInt(r.Price) || 0), 0);
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (!user) return null;

  return (
    <div style={{
      background: "linear-gradient(180deg, #0a0a0a, #1e1e1e)",
      minHeight: "100vh",
      padding: 30,
      fontFamily: "Poppins, sans-serif",
      color: "#fff"
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25
      }}>
        <h1 style={{ color: "#f04e30", fontSize: "2rem", fontWeight: 900 }}>
          💳 Payment
        </h1>
        <button
          onClick={() => navigate("/cart")}
          style={{
            padding: "8px 14px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseOver={(e) => (e.target.style.background = "#666")}
          onMouseOut={(e) => (e.target.style.background = "#444")}
        >
          🛒 กลับไปหน้า Cart
        </button>
      </header>

      {loading ? (
        <p>⏳ กำลังโหลดรายการเช่า...</p>
      ) : rentals.length > 0 ? (
        <div style={{
          background: "#1f1f1f",
          padding: 25,
          borderRadius: 12,
          maxWidth: 700,
          margin: "auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ color: "#f04e30", marginBottom: 15 }}>
            รายการเช่า ({rentals.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 20 }}>
            {rentals.map((r) => (
              <li key={r.CartID} style={{
                marginBottom: 8,
                background: "#292929",
                padding: 10,
                borderRadius: 8
              }}>
                🎬 {r.MovieName || r.MovieID} — {r.Price} บาท
              </li>
            ))}
          </ul>

          <p style={{ fontSize: "1.2rem", marginBottom: 15 }}>
            💰 <strong>รวมทั้งหมด:</strong> {totalPrice} บาท
          </p>

          {/* QR Payment Section */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            background: "#2b2b2b",
            borderRadius: 10,
            padding: 15,
            marginBottom: 20
          }}>
            {/* QR Section */}
<div style={{ flex: "1 1 200px", position: "relative" }}>
  <p>📱 สแกน QR นี้เพื่อชำระเงิน</p>
  <img
    src="/qr.jpg"
    alt="QR Code"
    onClick={() => setSelectedImage("/qr.jpg")}
    style={{
      width: 180,
      borderRadius: 10,
      marginTop: 10,
      boxShadow: "0 0 10px rgba(255,255,255,0.2)",
      cursor: "pointer",
      transition: "transform 0.3s",
    }}
    onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
  />

  {/* ชื่อบัญชี/พร้อมเพย์ */}
  <div style={{ marginTop: 10, fontSize: "0.9rem", color: "#bbb" }}>
    <p>💰 ธนาคารกรุงสุโขทัย</p>
    <p>บัญชี: 123-4-56789-0</p>
    <p>ชื่อบัญชี: MOVIX178</p>
  </div>
</div>

{/* Popup แสดงภาพใหญ่ */}
{selectedImage && (
  <div
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      cursor: "pointer",
    }}
  >
    <img
      src={selectedImage}
      alt="QR Zoom"
      style={{
        width: "350px",
        borderRadius: 15,
        boxShadow: "0 0 30px rgba(255,255,255,0.5)",
        animation: "zoomIn 0.3s ease",
      }}
    />
    <button
      onClick={() => setSelectedImage(null)}
      style={{
        position: "absolute",
        top: 20,
        right: 30,
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "2rem",
        cursor: "pointer",
      }}
    >
      ✖
    </button>
  </div>
)}


            <div style={{ flex: "1 1 200px", textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: 5, marginTop: 10 }}>
                📎 อัปโหลดสลิปการโอน
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSlipFile(e.target.files[0])}
                disabled={expired}
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #555"
                }}
              />
              {expired ? (
                <p style={{ color: "red", marginTop: 10 }}>หมดเวลาการชำระเงิน</p>
              ) : (
                <p style={{ color: "#00b894", marginTop: 10 }}>
                  ⏱ เวลาที่เหลือ: {formatTime(timeLeft)}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={handlePayment}
              disabled={processing || expired}
              style={{
                marginRight: 10,
                padding: "12px 25px",
                background: "#00b894",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "0.3s"
              }}
              onMouseOver={(e) => (e.target.style.background = "#019267")}
              onMouseOut={(e) => (e.target.style.background = "#00b894")}
            >
              {processing ? "⏳ กำลังส่งสลิป..." : "💳 ส่งสลิปชำระเงินทั้งหมด"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              style={{
                padding: "12px 25px",
                background: "#e17055",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "0.3s"
              }}
              onMouseOver={(e) => (e.target.style.background = "#d35400")}
              onMouseOut={(e) => (e.target.style.background = "#e17055")}
            >
              ❌ ยกเลิก
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: "#fff" }}>❌ ไม่พบรายการเช่า</p>
      )}
    </div>
  );
}

export default Payment;
