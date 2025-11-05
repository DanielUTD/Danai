// AdminDashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminData = localStorage.getItem("admin");
  let admin = null;
  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch {
    admin = null;
  }

  useEffect(() => {
    if (!admin) navigate("/adminlogin");
  }, [admin, navigate]);

  if (!admin) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/adminlogin");
  };

  const buttonStyle = (bgColor, textColor = "#fff") => ({
    padding: "20px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    width: "100%",
    color: textColor,
    backgroundColor: bgColor,
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "50px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
          borderBottom: "2px solid #f04e30",
          paddingBottom: 10,
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "#222", margin: 0 }}>Admin Dashboard</h1>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 5px", fontWeight: "bold", color: "#333" }}>
            👋 สวัสดี, {admin.AdminUser}
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      {/* Section 1: จัดการหนัง / ประเภท */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ marginBottom: 15 }}>จัดการเนื้อหา</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <button style={buttonStyle("#007BFF")} onClick={() => navigate("/AdminMovies")}>เพิ่ม/แก้ไขหนัง</button>
          <button style={buttonStyle("#28A745")} onClick={() => navigate("/category")}>จัดการประเภทหนัง</button>
        </div>
      </div>

      {/* Section 2: รายได้ / การชำระเงิน */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ marginBottom: 15 }}>การเงิน</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <button style={buttonStyle("#fd7e14")} onClick={() => navigate("/AdminRevenue")}>รายงานรายได้</button>
          <button style={buttonStyle("#17A2B8")} onClick={() => navigate("/AdminPayments")}>จัดการการชำระเงิน/เช่า</button>
          <button style={buttonStyle("#6f42c1")} onClick={() => navigate("/AdminSubscriptions")}>จัดการสมาชิกรายเดือน</button>
        </div>
      </div>

      {/* Section 3: ผู้ใช้งาน / อัปเดตวันหมดอายุ / สมาชิก */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ marginBottom: 15 }}>ผู้ใช้งาน/หมดอายุ</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <button style={buttonStyle("#dc8ef2")} onClick={() => navigate("/AdminExpireDashboard")}>อัปเดตวันหมดอายุ</button>
          <button style={buttonStyle("#FFC107", "#222")} onClick={() => navigate("/memberlist")}>ดูผู้ใช้งาน</button>
          
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
