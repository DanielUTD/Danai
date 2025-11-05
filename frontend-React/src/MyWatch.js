import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieRating from "./MovieRating";

function MyWatch() {
  const navigate = useNavigate();
  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [user] = useState(() => {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  });

  // ---------------- ดึง My Watch ----------------
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    const fetchMyWatch = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost/movix-project/backend/get_mywatch.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ EmailMember: user.MemberEmail }),
        });
        const data = await res.json();
        if (isMounted) {
          if (data.success) setWatchList(data.watch);
          else alert(data.message);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) alert("เกิดข้อผิดพลาดขณะโหลด My Watch");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMyWatch();
    return () => {
      isMounted = false;
    };
  }, [navigate, user]);

  // ---------------- ดึงตอนของหนัง ----------------
  const fetchEpisodes = async (MovieID) => {
    setLoadingEpisodes(true);
    try {
      const res = await fetch(`http://localhost/movix-project/backend/Get_vdo.php?MovieID=${MovieID}`);
      const data = await res.json();
      setEpisodes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEpisodes([]);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  // ---------------- ดึงความคิดเห็น ----------------
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

  // ---------------- เปิด Modal ----------------
  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    if (movie.Status === "active") {
      fetchEpisodes(movie.MovieID);
      fetchComments(movie.MovieID);
    }
  };

  // ปิด Modal ด้วยปุ่ม ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedMovie(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ---------------- ส่งความคิดเห็นใหม่ ----------------
  const handleAddComment = async (e) => {
    e.preventDefault();
    const comment = e.target.comment.value.trim();
    if (!comment) return alert("กรุณาพิมพ์ความคิดเห็นก่อนส่ง");

    try {
      const res = await fetch("http://localhost/movix-project/backend/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MemberEmail: user.MemberEmail,
          MovieID: selectedMovie.MovieID,
          Coment: comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        e.target.reset();
        fetchComments(selectedMovie.MovieID);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการส่งความคิดเห็น");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>⏳ กำลังโหลด...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#121212", color: "#fff" }}>
      {/* ปุ่มกลับไปหน้า Movielist */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate("/movielist")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          🔙 กลับไปหน้า Movielist
        </button>
      </div>

      <h1 style={{ textAlign: "center", marginBottom: 20 }}>🎬 My Watch</h1>

      {watchList.length === 0 ? (
        <p style={{ textAlign: "center" }}>❌ ยังไม่มีหนังใน My Watch</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {watchList.map((movie) => (
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
              <img src={movie.Img_Poster} alt={movie.Name} style={{ width: "100%", height: 280, objectFit: "cover" }} />
              <div style={{ padding: 12, textAlign: "center" }}>
                <h3 style={{ margin: "8px 0", fontSize: "1rem" }}>{movie.Name}</h3>
                <p style={{ fontSize: "0.9rem", color: "#aaa" }}>สถานะ: {movie.Status}</p>
                <p style={{ fontSize: "0.9rem", color: "#aaa" }}>วันเริ่มต้น: {movie.StartDate?.split(" ")[0]}</p>
                <p style={{ fontSize: "0.9rem", color: "#aaa" }}>วันหมดอายุ: {movie.EndDate?.split(" ")[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Modal ---------------- */}
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
            <h2 style={{ textAlign: "center" }}>{selectedMovie.Name}</h2>
            <img
              src={selectedMovie.Img_Poster}
              alt={selectedMovie.Name}
              style={{ width: "100%", borderRadius: 8, marginBottom: 15, objectFit: "cover" }}
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

            <p style={{ lineHeight: 1.6, color: "#ccc" }}>{selectedMovie.Details || "ไม่มีรายละเอียด"}</p>
            <p style={{ color: "#ccc" }}>
              ซับไตเติ้ล: {selectedMovie.Subtitle || "-"} | เสียงพากย์: {selectedMovie.Voiceover || "-"}
            </p>
            <p style={{ color: "#ccc" }}>ประเภท: {selectedMovie.CategoryName || "-"}</p>
            <p style={{ color: "#ccc" }}>กลุ่ม: {selectedMovie.Group || "-"}</p>
            <p style={{ color: "#ccc" }}>View: {selectedMovie.Viewer || "0"}</p>
            <p style={{ color: "#bbb" }}>⭐ คะแนน: {selectedMovie.Rating || "-"}</p>

            {/* ให้คะแนน + แสดงความคิดเห็น */}
            {selectedMovie.Status === "active" && (
              <div style={{ marginTop: 15 }}>
                <h4>⭐ ให้คะแนนหนังเรื่องนี้</h4>
                <MovieRating movieID={selectedMovie.MovieID} user={user} />

                <div style={{ marginTop: 25 }}>
                  <h4>💬 แสดงความคิดเห็น</h4>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      name="comment"
                      rows="3"
                      placeholder="พิมพ์ความคิดเห็นของคุณ..."
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
              </div>
            )}

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

            {/* ---------------- ตอนของหนัง ---------------- */}
            {selectedMovie.Status === "active" ? (
              <>
                <h3 style={{ marginTop: 20 }}>📺 ตอนของหนัง</h3>
                {loadingEpisodes ? (
                  <p>⏳ กำลังโหลดตอน...</p>
                ) : episodes.length > 0 ? (
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
                  <p>❌ ยังไม่มีตอนสำหรับเรื่องนี้</p>
                )}
              </>
            ) : (
              <p style={{ color: "#f04e30" }}>⏳ กำลังดำเนินการ / หมดอายุ</p>
            )}

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

export default MyWatch;
