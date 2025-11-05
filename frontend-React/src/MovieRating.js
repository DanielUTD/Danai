import React, { useEffect, useState } from "react";

function MovieRating({ movieID, user }) {
  const [rating, setRating] = useState(0);       // คะแนนของผู้ใช้
  const [avgRating, setAvgRating] = useState(0); // คะแนนเฉลี่ย
  const [countRating, setCountRating] = useState(0); // จำนวนคนให้คะแนน

  // ฟังก์ชันดึงคะแนนจาก backend
  const fetchRating = () => {
    if (!movieID) return;

    fetch(`http://localhost/movix-project/backend/get_rating.php?MovieID=${movieID}&MemberEmail=${user?.MemberEmail || ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvgRating(data.avgRating || 0);
          setCountRating(data.countRating || 0);
          setRating(data.userRating || 0); // คะแนนของผู้ใช้
        }
      })
      .catch(err => console.error(err));
  };

  // ฟังก์ชันส่งคะแนนไป backend
  const submitRating = (value) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนให้คะแนน");
      return;
    }

    fetch("http://localhost/movix-project/backend/add_rating.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        MovieID: movieID,
        MemberEmail: user.MemberEmail,
        Rating: value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`คุณให้คะแนน ${value} ดาว เรียบร้อยแล้ว`);
          fetchRating(); // อัปเดตคะแนนเฉลี่ยและดาวผู้ใช้
        } else {
          alert(data.message || "เกิดข้อผิดพลาด");
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRating();
  }, [movieID]);

  return (
    <div style={{ textAlign: "center", marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => submitRating(star)}
          style={{
            fontSize: 24,
            color: star <= rating ? "#f04e30" : "#888",
            cursor: "pointer"
          }}
        >
          ★
        </span>
      ))}
      <p style={{ margin: 0, color: "#bbb", fontSize: "0.85rem" }}>
        ⭐ คะแนนเฉลี่ย: {avgRating} ({countRating} คน)
      </p>
    </div>
  );
}

export default MovieRating;
