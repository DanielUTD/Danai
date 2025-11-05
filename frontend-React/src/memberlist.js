// MemberList.js
import React, { useEffect, useState } from "react";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost/movix-project/backend/Member.php")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setMembers(data);
        setFilteredMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("ไม่สามารถโหลดรายการสมาชิกได้");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let temp = [...members];

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (m) =>
          m.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.MemberEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      temp = temp.filter((m) => m.MemberCategory === filterCategory);
    }

    setFilteredMembers(temp);
  }, [searchTerm, filterCategory, members]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>กำลังโหลดข้อมูลสมาชิก...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: 40, color: "red" }}>{error}</p>;

  const categories = ["All", ...new Set(members.map((m) => m.MemberCategory))];

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "50px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>รายการสมาชิก</h1>

      {/* แสดงยอดสมาชิก */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          backgroundColor: "#f8f9fa",
          padding: "10px 0",
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        <strong>สมาชิกทั้งหมด:</strong> {members.length} คน{" "}
        {filterCategory !== "All" || searchTerm !== "" ? (
          <span style={{ color: "#007bff" }}>
            (แสดงผล {filteredMembers.length} คน)
          </span>
        ) : null}
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="ค้นหา Username / Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          {categories.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th> {/* หัวลำดับ */}
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={index} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{index + 1}</td> {/* เลขลำดับ */}
              <td style={{ padding: "10px" }}>{member.MemberEmail}</td>
              <td style={{ padding: "10px" }}>{member.Username}</td>
              <td style={{ padding: "10px" }}>{member.MemberCategory}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredMembers.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
          ไม่พบสมาชิกที่ตรงกับเงื่อนไข
        </p>
      )}
    </div>
  );
}

export default MemberList;
