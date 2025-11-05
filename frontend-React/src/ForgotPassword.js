import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // import CSS

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost/movix-project/backend/request_reset.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email }),
        }
      );

      const text = await res.text();
      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : { status: "error", message: "Empty response" };
      } catch {
        data = { status: "error", message: "Invalid JSON" };
      }

      setMessage(data.message || "Something went wrong");

      if (data.status === "success") {
        // เก็บ email ใน sessionStorage
        sessionStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/resetpassword"), 1500);
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    }
  };

  const handleCancel = () => {
    navigate("/login"); // กลับหน้า login
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="logo">Movix</h2>
        <h3>ลืมรหัสผ่าน</h3>

        {message && (
          <p
            className={`message ${
              message.toLowerCase().includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <div className="button-group">
            <button type="submit" className="button">
              ส่งรหัส OTP
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
      </div>
    </div>
  );
}

export default ForgotPassword;
