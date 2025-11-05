// src/Cart.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // ดึงข้อมูลตะกร้า
  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost/movix-project/backend/get_cart.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailMember: user.MemberEmail }),
      });
      const data = await res.json();
      if (data.success) setCart(Array.isArray(data.cart) ? data.cart : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rawUser) navigate("/login");
    else fetchCart();
  }, [rawUser]);

  const toggleSelect = (CartID) => {
    setSelectedCart(prev =>
      prev.includes(CartID)
        ? prev.filter(id => id !== CartID)
        : [...prev, CartID]
    );
  };

  const removeItem = async (CartID) => {
    if (!user) return;
    setProcessingId(CartID);
    try {
      const res = await fetch("http://localhost/movix-project/backend/remove_from_cart.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CartID, EmailMember: user.MemberEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(prev => prev.filter(i => i.CartID !== CartID));
        setSelectedCart(prev => prev.filter(id => id !== CartID));
      } else console.warn("Failed to remove item:", data.message);
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayment = () => {
    if (selectedCart.length === 0) {
      alert("กรุณาเลือกหนังที่จะชำระเงิน");
      return;
    }
    navigate("/payment", { state: { CartIDs: selectedCart } });
  };

  if (!user) return null;

  const totalPrice = cart
    .filter(item => selectedCart.includes(item.CartID))
    .reduce((sum, item) => sum + (parseInt(item.Price) || 0), 0);

  return (
    <div style={{ background: "#121212", minHeight: "100vh", padding: 20, fontFamily: "Poppins, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#f04e30", fontSize: "2rem", fontWeight: 900 }}>🛒 Cart </h1>
        <button onClick={() => navigate("/movielist")} style={{ padding: "6px 12px", background: "#555", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          🏠 กลับไปหน้า Movies
        </button>
      </header>

      {loading ? (
        <p style={{ color: "#fff" }}>⏳ กำลังโหลดตะกร้า...</p>
      ) : cart.length === 0 ? (
        <p style={{ color: "#fff" }}>❌ ตะกร้าว่าง</p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {cart.map(item => (
              <div key={item.CartID} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1f1f1f", padding: 12, borderRadius: 10, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={selectedCart.includes(item.CartID)} onChange={() => toggleSelect(item.CartID)} />
                  <span style={{ fontWeight: 600 }}>{item.MovieName || item.MovieID}</span>
                  <span style={{ fontSize: "0.9rem", color: "#bbb" }}>ราคา: {item.Price} บาท</span>
                  <span style={{ fontSize: "0.9rem", color: "#bbb" }}>⏳ ระยะเวลาเช่า: {item.RentalDuration || 7} วัน</span>
                </div>
                <button onClick={() => removeItem(item.CartID)} disabled={processingId === item.CartID} style={{ padding: "6px 12px", background: "#f04e30", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  {processingId === item.CartID ? "⏳ กำลังลบ..." : "❌ ลบ"}
                </button>
              </div>
            ))}
          </div>
          <p style={{ color: "#fff", marginTop: 15 }}><strong>  หนังในตระกร้า:{cart.length} เรื่อง</strong> </p>
          <p style={{ color: "#fff", marginTop: 15 }}><strong>    รวมราคาที่เลือก:</strong> {totalPrice} บาท</p>
          <button onClick={handlePayment} style={{ marginTop: 20, padding: "10px 20px", background: "#00b894", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            💳 ชำระเงินที่เลือก
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
