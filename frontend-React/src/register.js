import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import background from "./movix-bg.jpg";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // เพิ่ม state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // ตรวจสอบรหัสผ่านตรงกันก่อนส่ง
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setSuccess("");
      return;
    }

    fetch("http://localhost/movix-project/backend/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(data.message);
          setError("");
          setTimeout(() => navigate("/login"), 1500); // สมัครเสร็จ → กลับไป Login
        } else {
          setError(data.message);
          setSuccess("");
        }
      })
      .catch(() => setError("เกิดข้อผิดพลาดในการเชื่อมต่อ"));
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
      <div className="logoTop">Movix</div>
      <div className="formWrapper">
        <h2 className="title">สมัครสมาชิก</h2>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Confirm Password"   // เพิ่มช่องยืนยันรหัสผ่าน
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            สมัครสมาชิก
          </button>
        </form>

        <p style={{ marginTop: 15 }}>
          มีบัญชีแล้ว?{" "}
          <span
            style={{ color: "#28a745", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/login")}
          >
            เข้าสู่ระบบ
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
