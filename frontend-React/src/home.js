import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const sliderRef = useRef(null); // ✅ ref สำหรับ slider

  useEffect(() => {
    fetch("http://localhost/movix-project/backend/get_movies.php")
      .then((res) => res.json())
      .then((data) => {
        setMovies(Array.isArray(data.movies) ? data.movies : data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const ytMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : url;
  };

  const filteredMovies =
    filter === "All" ? movies : movies.filter((movie) => movie.Group === filter);

  // ✅ ฟังก์ชันเลื่อน carousel
  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <button className={`logo ${filter === "All" ? "active-menu" : ""}`} onClick={() => setFilter("All")}>MOVIX</button>
        <nav className="nav-links">
          <a href="#" className={filter === "Movie" ? "active-menu" : ""} onClick={() => setFilter("Movie")}>Movies</a>
          <a href="#" className={filter === "Series" ? "active-menu" : ""} onClick={() => setFilter("Series")}>Series</a>
          <a href="#" className={filter === "Animations" ? "active-menu" : ""} onClick={() => setFilter("Animation")}>Animations</a>
        </nav>
        <button onClick={() => navigate("/login")} className="login-btn">Sign in / Register</button>
      </header>

      {/* Banner */}
      <section className="banner">
        <div className="banner-overlay">
          <h2 className="banner-text">WELCOME TO MOVIX</h2>
          <p className="banner-sub">WATCH NOW</p>
        </div>
      </section>

      {/* Movies Carousel */}
      <section className="movie-row">
        {loading ? (
          <p style={{ color: "#fff" }}>Loading...</p>
        ) : (
          <div className="carousel-container">
            <button className="carousel-btn left" onClick={scrollLeft}>◀</button>
            <div className="movie-slider" ref={sliderRef}>
              {filteredMovies.map((movie) => (
                <div key={movie.MovieID} className="movie-card" onClick={() => setSelectedMovie(movie)}>
                  <img src={movie.Img_Poster} alt={movie.Name} />
                </div>
              ))}
            </div>
            <button className="carousel-btn right" onClick={scrollRight}>▶</button>
          </div>
        )}
      </section>

      {/* Modal ของหนัง */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.Name}</h2>
            <img src={selectedMovie.Img_Poster} alt={selectedMovie.Name} className="modal-poster" />
            <p>{selectedMovie.Details || "ไม่มีรายละเอียด"}</p>
            {selectedMovie.Vdo_Trailer && (
              <iframe
                width="100%"
                height="400"
                src={getEmbedUrl(selectedMovie.Vdo_Trailer)}
                title={`Trailer ${selectedMovie.MovieID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            
            <p>{selectedMovie.Details || "ไม่มีรายละเอียด"}</p>

            <p>
              <strong>Subtitle:</strong> {selectedMovie.Subtitle || "-"} |{" "}
              <strong>Voice:</strong> {selectedMovie.Voiceover || "-"}
            </p>
            <p>
              <strong>Episode:</strong> {selectedMovie.Episode || "-"} |{" "}
              <strong>Price:</strong> {selectedMovie.Price || "-"} บาท
            </p>
            <p style={{ lineHeight: 1.6, color: "#ccc" }}>
              กลุ่ม: {selectedMovie.Group || "ไม่มีรายละเอียด"}
            </p>
            <p style={{ lineHeight: 1.6, color: "#ccc" }}>
              ประเภท: {selectedMovie.CategoryName || "ไม่มีรายละเอียด"}
            </p>
            <p style={{ lineHeight: 1.6, color: "#ccc" }}>
              View: {selectedMovie.Viewer || "ไม่มีรายละเอียด"} 🎬 คะแนน: {selectedMovie.Rating || "-"}
            </p>
            <button onClick={() => setSelectedMovie(null)} className="close-btn">ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
