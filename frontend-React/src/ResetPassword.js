import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css"; // import CSS

function ResetPassword() {
  const email = sessionStorage.getItem("resetEmail");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 นาที (300 วินาที)
  const navigate = useNavigate();

  // จับเวลานับถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) {
      setMessage("OTP หมดอายุแล้ว กำลังกลับไปหน้า Login...");
      setTimeout(() => navigate("/login"), 2000); // เด้งกลับหลังหมดเวลา 2 วินาที
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/movix-project/backend/reset_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email, otp, password }),
        }
      );

      const text = await res.text();
      const data = text
        ? JSON.parse(text)
        : { status: "error", message: "Empty response" };

      setMessage(data.message || "");

      if (data.status === "success") {
        setShowSuccess(true);
        sessionStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="logo">Movix</h2>
        <h3>Reset Password</h3>

        {message && (
          <p
            className={`message ${
              message.toLowerCase().includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}

        {timeLeft > 0 && (
          <p className="timer">
            นับเวลาถอยหลังเปลี่ยนรหัสผ่าน {formatTime(timeLeft)}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input"
          />

          <div className="button-group">
            <button type="submit" className="button">
              Reset Password
            </button>
            <button
              type="button"
              className="button cancel"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="toast">
            ✅ รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว!<br />
            กำลังกลับไปหน้า Login...
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
