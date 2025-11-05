// src/Account.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const userData = rawUser ? JSON.parse(rawUser) : null;

  useEffect(() => {
    if (!userData) return;
    setUser({
      Username: userData.Username,
      MemberEmail: userData.MemberEmail,
      MemberCategory: userData.MemberCategory
    });
    setLoading(false);
  }, []);

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) return alert("กรุณากรอกรหัสผ่านให้ครบทั้งสองช่อง");
    if (password !== confirmPassword) return alert("รหัสผ่านทั้งสองช่องไม่ตรงกัน");

    setUpdating(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/update_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.MemberEmail, password }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setPassword("");
        setConfirmPassword("");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p style={{ color: "#fff" }}>⏳ กำลังโหลดข้อมูล...</p>;
  if (!user) return <p style={{ color: "#fff" }}>ไม่พบผู้ใช้</p>;

  return (
    <div style={{ background: "#121212", minHeight: "100vh", padding: 20, color: "#fff", fontFamily: "Poppins, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#32CD32" }}>👤 บัญชีผู้ใช้</h1>
        <button
          onClick={() => navigate("/movielist")}
          style={{
            padding: "8px 16px",
            background: "#f04e30",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          🎬 ไปหน้า Movielist
        </button>
      </header>

      <div style={{ background: "#1f1f1f", padding: 20, borderRadius: 10, maxWidth: 500, margin: "auto" }}>
        <p><strong>Username:</strong> {user.Username}</p>
        <p><strong>Email:</strong> {user.MemberEmail}</p>
        <p><strong>Status:</strong> {user.MemberCategory}</p>

        <hr style={{ borderColor: "#333", margin: "20px 0" }} />

        <h3>🔑 เปลี่ยนรหัสผ่าน</h3>
        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #555",
            background: "#121212",
            color: "#fff"
          }}
        />
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 15,
            borderRadius: 6,
            border: "1px solid #555",
            background: "#121212",
            color: "#fff"
          }}
        />
        <button
          onClick={handleChangePassword}
          disabled={updating}
          style={{
            width: "100%",
            padding: "12px",
            background: "#00b894",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {updating ? "⏳ กำลังเปลี่ยนรหัส..." : "💾 เปลี่ยนรหัสผ่าน"}
        </button>
      </div>
    </div>
  );
}

export default Account;
