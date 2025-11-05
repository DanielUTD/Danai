import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieRating from "./MovieRating";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");



  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const navigate = useNavigate();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const memberType = user?.MemberCategory || ""; // "Rental" หรือ "Subscription"

  const fetchComments = async (MovieID) => {
    setLoadingComments(true);
    try {
      const res = await fetch(`http://localhost/movix-project/backend/get_comment.php?MovieID=${MovieID}`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
      else setComments([]);
    } catch (err) {
      console.error(err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) {
      alert("กรุณาพิมพ์ข้อความก่อนส่ง");
      return;
    }

    try {
      const res = await fetch("http://localhost/movix-project/backend/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MemberEmail: user.MemberEmail,
          MovieID: selectedMovie.MovieID,
          Coment: newComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        fetchComments(selectedMovie.MovieID); // โหลดคอมเมนต์ใหม่ทันที
      } else {
        alert(data.message || "เพิ่มความคิดเห็นไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น");
    }
  };

  const addToCart = async (movie) => {
    if (!user) return navigate("/login");
    if (memberType === "Subscription") return; // ซ่อนปุ่มเพิ่มตระกร้าสำหรับ Subscription
    try {
      const res = await fetch(
        "http://localhost/movix-project/backend/add_to_cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            MovieID: movie.MovieID,
            Price: movie.Price || 0,
            Count: 1,
            EmailMember: user.MemberEmail,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert(`✅ เพิ่ม "${movie.Name}" ลงตระกร้าเรียบร้อย`);
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ มีข้อผิดพลาด ไม่สามารถเพิ่มลงตระกร้าได้");
    }
  };

  // โหลดหนังและหมวดหมู่
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await fetch(
          "http://localhost/movix-project/backend/get_movies.php"
        );
        const moviesData = await moviesRes.json();
        const categoriesRes = await fetch(
          "http://localhost/movix-project/backend/Category.php"
        );
        const categoriesData = await categoriesRes.json();

        const moviesArray =
          moviesData.success && Array.isArray(moviesData.movies)
            ? moviesData.movies
            : [];
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : [];

        setMovies(moviesArray);
        setFilteredMovies(moviesArray);
        setCategories(categoriesArray);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let temp = movies;
    if (filterGroup !== "All") temp = temp.filter((m) => m.Group === filterGroup);
    if (filterCategory !== "All")
      temp = temp.filter((m) => String(m.CategoryID) === filterCategory);
    if (searchTerm.trim() !== "")
      temp = temp.filter((m) =>
        m.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredMovies(temp);
  }, [movies, searchTerm, filterGroup, filterCategory]);

  const fetchEpisodes = (MovieID) => {
    setLoadingEpisodes(true);
    fetch(`http://localhost/movix-project/backend/Get_vdo.php?MovieID=${MovieID}`)
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(Array.isArray(data) ? data : []);
        setLoadingEpisodes(false);
      })
      .catch(() => {
        setEpisodes([]);
        setLoadingEpisodes(false);
      });
  };

  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    fetchEpisodes(movie.MovieID);
    fetchComments(movie.MovieID);
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50, color: "#fff" }}>
        ⏳ กำลังโหลดข้อมูล...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: 50, color: "red" }}>{error}</p>
    );

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "0 20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          borderBottom: "2px solid #f04e30",
        }}
      >
        <h1
          style={{
            fontWeight: 900,
            fontSize: "2.5rem",
            color: "#f04e30",
            margin: 0,
          }}
        >
          Movix
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <>
              <span style={{ color: "#fff" }}>👤 {user.Username}</span>
              <button
                onClick={() => navigate("/account")}
                style={{
                  background: "#32CD32",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                My Account
              </button>
              {(<button onClick={() => navigate("/subscription")}
                style={{ background: "#8A2BE2", padding: "6px 12px", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontWeight: 600, }} >
                Subscription
              </button>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                style={{
                  background: "#f04e30",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#007BFF",
                padding: "6px 12px",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              เข้าสู่ระบบ
            </button>
          )}
        </div>
      </header>

      {/* Filter Tabs + My Watch */}
      <div
        style={{
          display: "flex",
          gap: 15,
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 15,
          flexWrap: "wrap",
        }}
      >


        {/* Filter Tabs */}
        {["All", "Movie", "Series", "Animation"].map((grp) => (
          <button
            key={grp}
            onClick={() => setFilterGroup(grp)}
            style={{
              padding: "10px 25px",
              borderRadius: 30,
              border: "none",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: filterGroup === grp ? "#f04e30" : "#444",
              color: "#fff",
              transition: "0.3s",
            }}
          >
            {grp === "All" ? " Home" : grp}
          </button>
        ))}
      </div>

      {/* Search + Category Filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          margin: "20px auto",
          maxWidth: 800,
        }}
      >

        <input
          type="text"
          placeholder=" ค้นหาชื่อหนัง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #555",
            fontSize: "1rem",
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #555",
            fontSize: "1rem",
          }}
        >
          <option value="All">ทุกประเภท</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.CategoryID}>
              {c.CategoryName}
            </option>
          ))}
        </select>
        {user && memberType === "Rental" && (
          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "10px 25px",
              borderRadius: 30,
              border: "none",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "#00BFFF",
              color: "#fff",
              transition: "0.3s",
            }}
          >
            🛒 ตระกร้า
          </button>
        )}
        {/* ปุ่ม My Watch (แสดงเฉพาะเมื่อ user login แล้ว) */}
        {user && (
          <button
            onClick={() => navigate("/mywatch")}
            style={{
              padding: "10px 25px",
              borderRadius: 30,
              border: "none",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "#32CD32",
              color: "#fff",
              transition: "0.3s",
            }}
          >
            🎬 My Watch
          </button>
        )}
      </div>


      {/* Movies Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {Array.isArray(filteredMovies) &&
          filteredMovies.map((movie) => (
            <div
              key={movie.MovieID}
              style={{
                background: "#1f1f1f",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => openMovieModal(movie)}
            >
              <img
                src={movie.Img_Poster}
                alt={movie.Name}
                style={{ width: "100%", height: 280, objectFit: "cover" }}
              />
              <div style={{ padding: 12, color: "#fff", textAlign: "center" }}>
                <h3 style={{ margin: "8px 0", fontSize: "1rem" }}>{movie.Name}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#bbb" }}>
                  🎬 {movie.Price || "-"} บาท | {movie.RentalDuration || "-"} วัน
                </p>

                {/* ปุ่มเพิ่มตระกร้า สำหรับ Rental เท่านั้น */}
                {memberType === "Rental" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(movie);
                    }}
                    style={{
                      marginTop: 8,
                      padding: "6px 12px",
                      backgroundColor: "#f04e30",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      color: "#fff",
                      fontWeight: 600,
                      transition: "0.2s",
                    }}
                  >
                    ➕ เพิ่มลงตระกร้า
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <div
          onClick={() => setSelectedMovie(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            padding: 10,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#181818",
              borderRadius: 10,
              maxWidth: 700,
              width: "100%",
              padding: 20,
              color: "#fff",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            {/* ชื่อ + poster + trailer + details */}
            <h2 style={{ marginTop: 0, textAlign: "center" }}>{selectedMovie.Name}</h2>
            <img
              src={selectedMovie.Img_Poster}
              alt={selectedMovie.Name}
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 15,
                objectFit: "cover",
              }}
            />
            {selectedMovie.Vdo_Trailer && (
              <iframe
                width="100%"
                height="300"
                src={selectedMovie.Vdo_Trailer}
                title="Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ borderRadius: 8, marginBottom: 15 }}
              />
            )}
            <p style={{ lineHeight: 1.6, color: "#ccc" }}>
              {selectedMovie.Details || "ไม่มีรายละเอียด"}
            </p>

            {/* คะแนน */}
            {memberType === "Subscription" && (
              <div style={{ marginTop: 15 }}>
                <h4>⭐ ให้คะแนนหนังเรื่องนี้</h4>
                <MovieRating
                  movieID={selectedMovie.MovieID}
                  user={user}
                />
              </div>
            )}

            {/* สำหรับ Subscription: Episodes + Comments */}
            {memberType === "Subscription" && (
              <>
                {/* Episodes */}
                <h3 style={{ marginTop: 20 }}>📺 ตอนของหนัง</h3>
                {episodes.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {episodes.map((ep) => (
                      <button
                        key={ep.VdoMSC_ID}
                        onClick={async () => {
                          try {
                            await fetch("http://localhost/movix-project/backend/add_view.php", {
                              method: "POST",
                              headers: { "Content-Type": "application/x-www-form-urlencoded" },
                              body: new URLSearchParams({ MovieID: selectedMovie.MovieID }),
                            });
                            navigate(`/movieplayer/${selectedMovie.MovieID}?episode=${ep.Episode}`);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        style={{
                          padding: "8px 12px",
                          background: "#f04e30",
                          border: "none",
                          borderRadius: 6,
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ▶️ ตอน {ep.Episode}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>รออัพโหลด</p>
                )}

                {/* Comments */}
                <div style={{ marginTop: 25 }}>
                  <h4>💬 แสดงความคิดเห็น</h4>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      name="comment"
                      rows="3"
                      placeholder="พิมพ์ความคิดเห็นของคุณ..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 6,
                        border: "1px solid #555",
                        background: "#222",
                        color: "#fff",
                        marginBottom: 10,
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "6px 14px",
                        background: "#28a745",
                        border: "none",
                        borderRadius: 6,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      💬 ส่งความคิดเห็น
                    </button>
                  </form>


                </div>
              </>
            )}
{/* แสดงคอมเมนต์แบบอ่าน-only */}
                {loadingComments ? (
                  <p>⏳ กำลังโหลดความคิดเห็น...</p>
                ) : comments.length === 0 ? (
                  <p style={{ marginTop: 10 }}>ยังไม่มีความคิดเห็น</p>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    {comments.map((c) => (
                      <div
                        key={c.ComentID}
                        style={{
                          borderBottom: "1px solid #333",
                          padding: "8px 0",
                          marginBottom: 5,
                        }}
                      >
                        <strong style={{ color: "#66b3ff" }}>{c.MemberEmail}</strong>
                        <p style={{ margin: "4px 0", color: "#ccc" }}>{c.Coment}</p>
                      </div>
                    ))}
                  </div>
                )}
            {/* สำหรับ Rental */}
            {memberType === "Rental" && (
              <>
                

                {/* ปุ่มเพิ่มตระกร้า */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(selectedMovie);
                  }}
                  style={{
                    marginTop: 12,
                    padding: "8px 16px",
                    backgroundColor: "#f04e30",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  ➕ เพิ่มลงตระกร้า
                </button>
              </>
            )}


            {/* ปุ่มปิด Modal */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => setSelectedMovie(null)}
                style={{
                  padding: "8px 16px",
                  background: "#555",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MovieList;
