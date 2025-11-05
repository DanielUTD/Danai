import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginSuccess) {
      navigate("/admindashboard");
    }
  }, [loginSuccess, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const body = { email, password };

    fetch("http://localhost/movix-project/backend/adminlogin.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ตอบกลับจาก backend:", data);
        if (data.success) {
          // ✅ เก็บ admin ลง localStorage
          localStorage.setItem("admin", JSON.stringify(data.user));
          setLoginSuccess(true);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("เกิดข้อผิดพลาดในการเชื่อมต่อ"));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.logo}>MovixAdmin</h2>
        <h3 style={{ marginBottom: 20 }}>เข้าสู่ระบบ</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111",
  },
  card: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: 350,
  },
  logo: {
    color: "#f04e30",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    margin: "10px 0",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#f04e30",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: "0.9rem",
  },
};

export default AdminLogin;
