import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function RevenueChart() {
  const [rentals, setRentals] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("All"); // New: Filter Type

  // โหลดข้อมูลจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost/movix-project/backend/get_revenue_data.php");
        const data = await res.json();
        if (data.success) {
          setRentals(data.rentals);
          setSubscriptions(data.subscriptions);
        }
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    };
    fetchData();
  }, []);

  // รวมและคำนวณรายได้ โดยกรองตามวันที่และประเภท
  useEffect(() => {
    let combined = [
      ...subscriptions.map((s) => ({
        date: s.DateTimeStamp,
        amount: parseFloat(s.Price) || 0,
        type: "Subscription",
        email: s.EmailMember,
        status: s.Status,
      })),
      ...rentals.map((r) => ({
        date: r.DateTimeStamp,
        amount: parseFloat(r.Price) || 0,
        type: "Rental",
        email: r.EmailMember,
        status: r.Status,
      })),
    ];

    // กรองตาม Type
    if (filterType !== "All") {
      combined = combined.filter((item) => item.type === filterType);
    }

    // กรองตามวันที่
    const filtered = combined.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date.split(" ")[0]);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });

    // รวมยอดต่อวัน
    const revenueMap = {};
    filtered.forEach((item) => {
      const dateKey = item.date.split(" ")[0];
      revenueMap[dateKey] = (revenueMap[dateKey] || 0) + item.amount;
    });

    const sortedDailyRevenue = Object.keys(revenueMap)
      .sort()
      .map((date) => ({ date, amount: revenueMap[date] }));

    setCombinedItems(filtered);
    setDailyRevenue(sortedDailyRevenue);
  }, [rentals, subscriptions, startDate, endDate, filterType]);

  const totalRevenue = dailyRevenue.reduce((sum, d) => sum + d.amount, 0);
  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "รายได้รายวัน (Revenue per Day)",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value + " บาท"; // เพิ่มคำว่า "บาท"
        },
        color: "#000",
      },
    },
    x: {
      ticks: {
        color: "#000",
      },
    },
  },
};

  const chartData = {
    labels: dailyRevenue.map((d) => d.date),
    datasets: [
      {
        label: "Total Revenue (฿)",
        data: dailyRevenue.map((d) => d.amount),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 950, margin: "0 auto", padding: 20, backgroundColor: "#ffffffff", color: "#000000ff", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>📈 รายงานรายได้ (Revenue Report)</h2>

      {/* ตัวกรองวันที่และประเภท */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
        <label>
          Start Date:{" "}
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:{" "}
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Type:{" "}
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All</option>
            <option value="Subscription">Subscription</option>
            <option value="Rental">Rental</option>
          </select>
        </label>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20 , color: "#000000ff"}}>
        <h3 style={{ textAlign: "center", marginBottom: 20 , color: "#000000ff"}}>💰 รวมรายได้ทั้งหมด: {totalRevenue.toLocaleString()} บาท</h3>
        {startDate && endDate && <p>ช่วงวันที่ {startDate} ถึง {endDate}</p>}
      </div>

      {dailyRevenue.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>ไม่มีข้อมูลรายได้</p>
      ) : (
        <>
          <Line data={chartData} options={chartOptions} />

          <h3 style={{ marginTop: 30,backgroundColor: "#000000ff" }}>📋 รายการรายได้ทั้งหมด</h3>
          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 10,
              textAlign: "center",
              color: "#000",
              backgroundColor: "#fff"
            }}
          >
            <thead style={{ backgroundColor: "#007BFF", color: "#fff" }}>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount (฿)</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody style={{ color: "#000" }}>
              {combinedItems
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td style={{ color: item.status?.toLowerCase() === "approved" || item.status?.toLowerCase() === "active" ? "green" : "red" }}>
                      {item.status}
                    </td>
                    <td>{item.amount.toFixed(2)}</td>
                    <td>{item.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default RevenueChart;
