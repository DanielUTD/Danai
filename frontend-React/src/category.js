import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [currentCategory, setCurrentCategory] = useState({ CategoryID: null, CategoryName: "" });
  const [message, setMessage] = useState("");

  // ตรวจสอบ admin login
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (!savedAdmin) {
      alert("กรุณาเข้าสู่ระบบ Admin");
      navigate("/adminlogin");
    } else {
      setAdmin(savedAdmin);
      fetchCategories();
    }
  }, [navigate]);

  // ดึงข้อมูลประเภทหนัง
  const fetchCategories = () => {
    fetch("http://localhost/movix-project/backend/Category.php")
      .then(res => res.json())
      .then(data => { setCategories(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  // ฟังก์ชันเปิดฟอร์มเพิ่ม
  const openAddForm = () => { 
    setFormType("add"); 
    setCurrentCategory({ CategoryID: null, CategoryName: "" }); 
    setFormOpen(true); 
    setMessage(""); 
  };

  // ฟังก์ชันเปิดฟอร์มแก้ไข
  const openEditForm = (cat) => { 
    setFormType("edit"); 
    setCurrentCategory(cat); 
    setFormOpen(true); 
    setMessage(""); 
  };

  // ฟังก์ชันลบ
  const handleDelete = (id) => {
  if (!window.confirm("คุณแน่ใจว่าจะลบประเภทนี้?")) return;
  if (!admin) return alert("ไม่พบข้อมูล Admin");

  fetch(`http://localhost/movix-project/backend/DeleteCategory.php`, { 
    method: "POST", // เปลี่ยนจาก DELETE เป็น POST
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ CategoryID: id, EmailAdmin: admin.AdminEmail })
  })
    .then(res => res.json())
    .then(data => { 
      alert(data.message); 
      fetchCategories(); 
    })
    .catch(err => console.error(err));
};


  // ฟังก์ชันบันทึก add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin) return alert("ไม่พบข้อมูล Admin");

    if (!currentCategory.CategoryName) { 
      setMessage("กรุณากรอกชื่อประเภทหนัง"); 
      return; 
    }

    const url = formType === "add"
      ? "http://localhost/movix-project/backend/AddCategory.php"
      : "http://localhost/movix-project/backend/EditCategory.php";
    const method = formType === "add" ? "POST" : "PUT";

    const bodyData = formType === "add" 
      ? { CategoryName: currentCategory.CategoryName, EmailAdmin: admin.AdminEmail } 
      : { ...currentCategory, EmailAdmin: admin.AdminEmail };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) { 
        setFormOpen(false); 
        fetchCategories(); 
      }
    } catch (err) { 
      console.error(err); 
      setMessage("เกิดข้อผิดพลาด"); 
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>กำลังโหลด...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>จัดการประเภทหนัง</h1>
      <button 
        style={{ marginBottom: 20, padding: "10px 20px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: 6 }} 
        onClick={openAddForm}
      >
        ➕ เพิ่มประเภทหนัง
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>ชื่อประเภท</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.CategoryID} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 10 }}>{index + 1}</td>
              <td style={{ padding: 10 }}>{cat.CategoryName}</td>
              <td style={{ padding: 10 }}>
                <button 
                  style={{ marginRight: 10, padding: "5px 10px", backgroundColor: "#FFC107", border: "none", borderRadius: 4 }} 
                  onClick={() => openEditForm(cat)}
                >
                  ✏️ แก้ไข
                </button>
                <button 
                  style={{ padding: "5px 10px", backgroundColor: "#DC3545", border: "none", borderRadius: 4, color: "#fff" }} 
                  onClick={() => handleDelete(cat.CategoryID)}
                >
                  🗑 ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {formOpen && (
        <div style={{ position: "fixed", top:0, left:0, width:"100%", height:"100%", backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ backgroundColor:"#fff", padding:20, borderRadius:10, width:400 }}>
            <h2>{formType === "add" ? "เพิ่มประเภทหนัง" : "แก้ไขประเภทหนัง"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label>ชื่อประเภทหนัง</label>
                <input 
                  type="text" 
                  value={currentCategory.CategoryName} 
                  onChange={e => setCurrentCategory({ ...currentCategory, CategoryName: e.target.value })} 
                  style={{ width:"100%", padding:8, marginTop:5 }}
                />
              </div>
              <button type="submit" style={{ padding:"10px 20px", backgroundColor: formType==="add"?"#28A745":"#FFC107", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>บันทึก</button>
              <button type="button" onClick={()=>setFormOpen(false)} style={{ padding:"10px 20px", marginLeft:10, backgroundColor:"#6c757d", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>ยกเลิก</button>
            </form>
            {message && <p style={{ marginTop: 10, color: message.includes("สำเร็จ")?"green":"red" }}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
