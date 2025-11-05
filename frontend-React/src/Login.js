import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./movix-bg.jpg"; // ภาพพื้นหลัง
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const body = { email, password };

    try {
      const res = await fetch("http://localhost/movix-project/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/movielist");
      } else {
        setError(data.message || "Email หรือ Password ไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
      <div className="logoTop">Movix</div>
      <div className="formWrapper">
        <h2 className="title">Sign in</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="signInBtn">
            Sign In
          </button>
        </form>
        <p className="forgot" onClick={() => navigate("/forgotpassword")}>
          Forgot Password?
        </p>
        <p className="signupText">
          New to Movix?{" "}
          <span className="signupBtn" onClick={() => navigate("/register")}>
            Create your Account Movix
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
