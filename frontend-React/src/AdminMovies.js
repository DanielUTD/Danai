// AdminMovies.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminMovies() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState("add");
  const [currentMovie, setCurrentMovie] = useState({
    MovieID: "",
    Name: "",
    Img_Poster: "",
    Details: "",
    Subtitle: "",
    Voiceover: "",
    Group: "",
    Vdo_Trailer: "",
    Episode: 1,
    Price: 0,
    Viewer: 0,
    CategoryID: 1,
    RentalDuration: 3,
  });
  const [message, setMessage] = useState("");

  const [episodes, setEpisodes] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filteredMovies, setFilteredMovies] = useState([]);

  // ตรวจสอบ admin login
  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (!savedAdmin) {
      alert("กรุณาเข้าสู่ระบบ Admin");
      navigate("/adminlogin");
    } else {
      setAdmin(savedAdmin);
      fetchMovies();
      fetchCategories();
    }
  }, [navigate]);

  // Fetch movies
  const fetchMovies = () => {
    fetch("http://localhost/movix-project/backend/get_movies.php")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.movies)) {
          setMovies(data.movies);
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMovies([]);
        setLoading(false);
      });
  };

  // Fetch categories
  const fetchCategories = () => {
    fetch("http://localhost/movix-project/backend/Category.php")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  // Filter movies
  useEffect(() => {
    let temp = [...movies];
    if (searchTerm.trim() !== "") {
      temp = temp.filter(movie =>
        movie.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory !== "All") {
      temp = temp.filter(movie => String(movie.CategoryID) === filterCategory);
    }
    setFilteredMovies(temp);
  }, [movies, searchTerm, filterCategory]);

  const generateMovieID = () => {
    if (!movies.length) return "MV001";
    const lastID = movies[movies.length - 1].MovieID;
    const num = parseInt(lastID.slice(2)) + 1;
    return "MV" + String(num).padStart(3, "0");
  };

  const getYouTubeEmbed = (url) => {
    try {
      if (!url) return null;
      const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
      const match = url.match(ytRegex);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    } catch {
      return null;
    }
  };


  const openAddForm = () => {
    setFormType("add");
    setCurrentMovie({
      MovieID: generateMovieID(),
      Name: "",
      Img_Poster: "",
      Details: "",
      Subtitle: "",
      Voiceover: "",
      Group: "Movie",
      Vdo_Trailer: "",
      Episode: 1,
      Price: 0,
      Viewer: 0,
      CategoryID: categories[0]?.CategoryID || 1,
      RentalDuration: 3,
    });
    setFormOpen(true);
    setMessage("");
  };

  const openEditForm = (movie) => {
    setFormType("edit");
    setCurrentMovie({ ...movie });
    setFormOpen(true);
    setMessage("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("คุณแน่ใจว่าจะลบหนังเรื่องนี้?")) return;
    fetch(`http://localhost/movix-project/backend/deleteMovie.php?id=${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => { alert(data.message); fetchMovies(); })
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin) return;
    if (!currentMovie.Name || !currentMovie.CategoryID || !admin.AdminEmail) {
      setMessage("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    const url = formType === "add"
      ? "http://localhost/movix-project/backend/AddMovie.php"
      : "http://localhost/movix-project/backend/EditMovie.php";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentMovie, EmailAdmin: admin.AdminEmail })
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setFormOpen(false);
        fetchMovies();
      }
    } catch (err) {
      console.error(err);
      setMessage("เกิดข้อผิดพลาด");
    }
  };

  const openEpisodeManager = (movieID) => {
    setSelectedMovieID(movieID);
    fetch(`http://localhost/movix-project/backend/get_vdo.php?MovieID=${movieID}`)
      .then(res => res.json())
      .then(data => setEpisodes(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const handleUploadEpisode = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("MovieID", selectedMovieID);
    formData.append("Episode", episodes.length + 1);
    formData.append("video", uploadFile);

    try {
      const res = await fetch("http://localhost/movix-project/backend/uploadvdo.php", {
        method: "POST",
        body: formData
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { alert("เกิดข้อผิดพลาดจาก server"); return; }
      alert(data.message);
      if (data.success) openEpisodeManager(selectedMovieID);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถอัปโหลดได้");
    }
  };

  const handleDeleteEpisode = (id) => {
    if (!window.confirm("คุณแน่ใจว่าจะลบตอนนี้?")) return;
    fetch(`http://localhost/movix-project/backend/Deletevdo.php?id=${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (data.success) openEpisodeManager(selectedMovieID);
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>กำลังโหลดข้อมูล...</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "50px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>จัดการหนัง/ซีรีส์/การ์ตูน</h1>
      <button onClick={openAddForm} style={{ marginBottom: 20, padding: "10px 20px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: 6 }}>➕ เพิ่มหนังใหม่</button>

      {/* Search / Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input type="text" placeholder="ค้นหาชื่อหนัง..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="All">ทุกประเภท</option>
          {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
        </select>
      </div>

      {/* Movies Table */}
<table style={{ width: "100%", borderCollapse: "collapse" }}>
  <thead>
    <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>ลำดับ</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>ID</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>ชื่อหนัง</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>Category</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>Poster</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>Trailer</th>
      <th style={{ padding: 10, border: "1px solid #ddd" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(filteredMovies) && filteredMovies.map((movie, index) => (
      <tr key={movie.MovieID} style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
        <td style={{ padding: 10 }}>{index + 1}</td>
        <td style={{ padding: 10 }}>{movie.MovieID}</td>
        <td style={{ padding: 10 }}>{movie.Name}</td>
        <td style={{ padding: 10 }}>{categories.find(c => c.CategoryID === movie.CategoryID)?.CategoryName || movie.CategoryID}</td>
        
        {/* Poster Column */}
        <td style={{ padding: 10 }}>
          {movie.Img_Poster && (
            <img src={movie.Img_Poster} alt="poster" style={{ width: 60, display: "block", margin: "0 auto" }} />
          )}
        </td>
        
        {/* Trailer Column */}
        <td style={{ padding: 10 }}>
          {movie.Vdo_Trailer && (
            <iframe
              width="160"
              height="90"
              src={movie.Vdo_Trailer}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ borderRadius: 8 }}
            />
          )}
        </td>

        {/* Action Column */}
        <td style={{ padding: 10 }}>
          <button onClick={() => openEditForm(movie)} style={{ marginRight: 5, padding: "5px 10px", backgroundColor: "#FFC107", border: "none", borderRadius: 4 }}>✏️ แก้ไข</button>
          <button onClick={() => handleDelete(movie.MovieID)} style={{ marginRight: 5, padding: "5px 10px", backgroundColor: "#DC3545", color: "#fff", border: "none", borderRadius: 4 }}>🗑 ลบ</button>
          <button onClick={() => openEpisodeManager(movie.MovieID)} style={{ padding: "5px 10px", backgroundColor: "#17A2B8", color: "#fff", border: "none", borderRadius: 4 }}>🎬 จัดการตอน</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Add/Edit Form */}
      {formOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 500 }}>
            <h2>{formType === "add" ? "เพิ่มหนังใหม่" : "แก้ไขหนัง"}</h2>
            <form onSubmit={handleSubmit}>
              <label>ชื่อหนัง</label>
              <input type="text" value={currentMovie.Name} onChange={e => setCurrentMovie({ ...currentMovie, Name: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>URL Poster</label>
              <input type="text" value={currentMovie.Img_Poster} onChange={e => setCurrentMovie({ ...currentMovie, Img_Poster: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />
              

              <label>รายละเอียด</label>
              <textarea value={currentMovie.Details} onChange={e => setCurrentMovie({ ...currentMovie, Details: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>Subtitle</label>
              <input type="text" value={currentMovie.Subtitle} onChange={e => setCurrentMovie({ ...currentMovie, Subtitle: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>Voiceover</label>
              <input type="text" value={currentMovie.Voiceover} onChange={e => setCurrentMovie({ ...currentMovie, Voiceover: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>กลุ่ม</label>
              <select value={currentMovie.Group} onChange={e => setCurrentMovie({ ...currentMovie, Group: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
                <option value="Movie">Movie</option>
                <option value="Series">Series</option>
                <option value="Animation">Animation</option>
              </select>

              <label>URL Video Trailer</label>
              <input type="text" value={currentMovie.Vdo_Trailer} onChange={e => setCurrentMovie({ ...currentMovie, Vdo_Trailer: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>Episode</label>
              <input type="number" value={currentMovie.Episode} onChange={e => setCurrentMovie({ ...currentMovie, Episode: parseInt(e.target.value) || 1 })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>Price</label>
              <input type="number" value={currentMovie.Price} onChange={e => setCurrentMovie({ ...currentMovie, Price: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: 8, marginBottom: 10 }} />

              <label>Category</label>
              <select value={currentMovie.CategoryID} onChange={e => setCurrentMovie({ ...currentMovie, CategoryID: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
                {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
              </select>
              <label>DayRudation</label>
              <select
                value={currentMovie.RentalDuration}
                onChange={e => setCurrentMovie({ ...currentMovie, RentalDuration: parseInt(e.target.value) })}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              >
                <option value={3}>3</option>
                <option value={7}>7</option>
                <option value={15}>15</option>
              </select>

              <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>บันทึก</button>
              <button type="button" onClick={() => setFormOpen(false)} style={{ padding: "10px 20px", marginLeft: 10, backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>ยกเลิก</button>
            </form>
            {message && <p style={{ marginTop: 10, color: message.includes("เรียบร้อย") || message.includes("สำเร็จ") ? "green" : "red" }}>{message}</p>}
          </div>
        </div>
      )}

      {/* Episode Manager */}
      {selectedMovieID && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 600 }}>
            <h2>จัดการตอน (MovieID: {selectedMovieID})</h2>
            <ul style={{ maxHeight: 200, overflowY: "auto" }}>
              {Array.isArray(episodes) && episodes.map(ep => (
                <li key={ep.VdoMSC_ID} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span>EP {ep.Episode}</span>
                  <button onClick={() => handleDeleteEpisode(ep.VdoMSC_ID)} style={{ background: "#DC3545", color: "#fff", border: "none", borderRadius: 4, padding: "5px 10px" }}>🗑 ลบ</button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleUploadEpisode} style={{ marginTop: 10 }}>
              <input type="file" onChange={e => setUploadFile(e.target.files[0])} />
              <button type="submit" style={{ marginLeft: 10, padding: "5px 15px", background: "#28A745", color: "#fff", border: "none", borderRadius: 4 }}>อัปโหลดตอนใหม่</button>
            </form>
            <button onClick={() => setSelectedMovieID(null)} style={{ marginTop: 15, padding: "5px 15px", background: "#6c757d", color: "#fff", border: "none", borderRadius: 4 }}>ปิด</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminMovies;
