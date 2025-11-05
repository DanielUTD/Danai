// MoviePlayer.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Movieplayer.css";

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Hook ดึง query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MoviePlayer() {
  const { id } = useParams();
  const query = useQuery();
  const episode = query.get("episode") || 1;
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [nextEpisodeExists, setNextEpisodeExists] = useState(true);

  const seekBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
  };

  const seekForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
  };

  // ดึง URL หนังจาก backend
  useEffect(() => {
    setLoading(true);
    setNextEpisodeExists(true); // reset ทุกครั้งเมื่อเปลี่ยน episode

    fetch(`http://localhost/movix-project/backend/vdo.php?MovieID=${id}&episode=${episode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVideoUrl(data.url);

          // เช็กตอนถัดไป
          fetch(`http://localhost/movix-project/backend/vdo.php?MovieID=${id}&episode=${parseInt(episode)+1}`)
            .then(res => res.json())
            .then(nextData => {
              if (!nextData.success) setNextEpisodeExists(false);
            })
            .catch(() => setNextEpisodeExists(false));
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("ไม่สามารถเชื่อมต่อ backend ได้"))
      .finally(() => setLoading(false));
  }, [id, episode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const changeVolume = (e) => {
    const newVol = e.target.value;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    setMuted(newVol === 0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    if (!controlsVisible) return;
    const timeout = setTimeout(() => setControlsVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, [controlsVisible]);

  if (loading) return <p className="loading">กำลังโหลด...</p>;
  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => navigate("/Movielist")}>← กลับไปหน้ารายการ</button>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="player-container"
      onMouseMove={() => setControlsVisible(true)}
      style={{
        backgroundColor: "#000",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ปุ่มกลับไปหน้ารายการ */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 5,
          padding: "8px 16px",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ← กลับไปหน้ารายการ
      </button>

      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          cursor: "pointer",
          zIndex: 1,
        }}
      />

      {controlsVisible && (
        <>
          {/* Progress Bar */}
          <div
            className="progress-bar"
            onClick={handleSeek}
            style={{
              position: "absolute",
              bottom: 50,
              left: 0,
              right: 0,
              height: 6,
              background: "rgba(255,255,255,0.2)",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            <div
              className="progress"
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#f04e30",
              }}
            />
          </div>

          {/* Control Buttons */}
          <div
            className="controls"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              zIndex: 2,
              transition: "opacity 0.3s",
            }}
          >
            <button onClick={seekBackward} className="control-btn">⏪ 10s</button>
            <button onClick={togglePlay} className="control-btn">{playing ? "⏸" : "▶️"}</button>
            <button onClick={seekForward} className="control-btn">10s ⏩</button>
            <button onClick={toggleMute} className="control-btn">{muted || volume === 0 ? "🔇" : "🔊"}</button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              style={{ width: 100 }}
            />
            <span style={{ color: "#fff", fontFamily: "monospace", minWidth: 60, textAlign: "center" }}>
              {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
            </span>
            <button onClick={toggleFullscreen} className="control-btn">⛶</button>

            {/* เลือกตอน */}
            <div style={{ marginLeft: "auto" }}>
              <button
                onClick={() => navigate(`/movieplayer/${id}?episode=${parseInt(episode)-1}`)}
                disabled={episode <= 1}
                style={{ padding: "5px 10px", marginRight: 5 }}
              >
                ◀️ ตอนก่อนหน้า
              </button>
              {nextEpisodeExists && (
                <button
                  onClick={() => navigate(`/movieplayer/${id}?episode=${parseInt(episode)+1}`)}
                  style={{ padding: "5px 10px" }}
                >
                  ตอนถัดไป ▶️
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MoviePlayer;
