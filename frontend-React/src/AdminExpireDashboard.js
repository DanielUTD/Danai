import React, { useState, useEffect } from "react";

function AdminExpireDashboard() {
    const [rentals, setRentals] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // โหลดข้อมูลจาก backend
    const fetchData = async () => {
        try {
            const resRentals = await fetch("http://localhost/movix-project/backend/get_rentals.php");
            const dataRentals = await resRentals.json();
            if (dataRentals.success) setRentals(dataRentals.rentals || []);

            const resSubs = await fetch("http://localhost/movix-project/backend/get_subscriptions.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const dataSubs = await resSubs.json();
            if (dataSubs.success) setSubscriptions(dataSubs.subscriptions || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ปุ่มอัปเดตสถานะหมดอายุ
    const handleExpireAll = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost/movix-project/backend/update_status.php");
            const data = await res.json();
            if (data.success) {
                setMessage(
                    `✅ อัปเดตสำเร็จ! Rental: ${data.rentals_updated}, Subscription: ${data.subscriptions_updated}`
                );
                fetchData(); // โหลดข้อมูลใหม่
            } else {
                setMessage(`❌ มีข้อผิดพลาด: ${data.message}`);
            }
        } catch (err) {
            setMessage(`❌ Error: ${err.message}`);
        }
        setLoading(false);
    };
    // ฟังก์ชันลบ
    const handleDelete = async (type, id) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${type} นี้?`)) return;
        try {
            const res = await fetch("http://localhost/movix-project/backend/delete_expired.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, id }),
            });
            const data = await res.json();
            if (data.success) {
                alert("✅ ลบสำเร็จ!");
                fetchData(); // โหลดข้อมูลใหม่
            } else {
                alert(`❌ ลบไม่สำเร็จ: ${data.message}`);
            }
        } catch (err) {
            alert(`❌ Error: ${err.message}`);
        }
    };


    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
            <h2 style={{ textAlign: "center" }}>🛠️ ระบบอัปเดตสถานะหมดอายุ</h2>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
               
                    {loading ? "กำลังอัปเดต..." : "อัปเดตสถานะหมดอายุ"}
                
                {message && <p style={{ marginTop: 10 }}>{message}</p>}
            </div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <button
                    onClick={handleExpireAll}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        borderRadius: 6,
                        backgroundColor: "#28a745",
                        color: "#fff",
                        marginRight: 10 // เว้นระยะระหว่างปุ่ม
                    }}
                >
                    {loading ? "กำลังอัปเดต..." : "อัปเดตสถานะหมดอายุ"}
                </button>

                <button
                    onClick={() => handleDelete("rental_all")} // ฟังก์ชันลบ Rental ทั้งหมด
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        cursor: "pointer",
                        borderRadius: 6,
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                    }}
                >
                    ลบ Rental หมดอายุ/failed ทั้งหมด
                </button>
            </div>

            <h3 style={{ color: "#000" }}>📋 Rental ทั้งหมด</h3>
            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                <thead style={{ backgroundColor: "#007BFF", color: "white" }}>
                    <tr>
                        <th>#</th>
                        <th>Member Email</th>
                        <th>Status</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map((r, idx) => (
                        <tr key={r.RentalID}>
                            <td>{idx + 1}</td>
                            <td>{r.MemberEmail}</td>
                            <td style={{ color: r.Status === "expired" || r.Status === "failed" ? "red" : "green" }}>
                                {r.Status}
                            </td>
                            <td>{r.EndDate}</td>

                        </tr>
                    ))}
                </tbody>

            </table>

            <h3 style={{ color: "#000" }}>📋 Subscription ทั้งหมด</h3>
            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#6f42c1", color: "white" }}>
                    <tr>
                        <th>#</th>
                        <th>Member Email</th>
                        <th>Status</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((s, idx) => (
                        <tr key={s.SubscriptionID}>
                            <td>{idx + 1}</td>
                            <td>{s.EmailMember}</td>
                            <td style={{ color: s.SubscriptionStatus === "expired" || s.SubscriptionStatus === "failed" ? "red" : "green" }}>{s.SubscriptionStatus}</td>
                            <td>{s.EndDate}</td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}

export default AdminExpireDashboard;
