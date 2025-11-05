<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // แก้ปัญหา CORS

// ดึง MovieID และ Episode จาก query string
$MovieID = $_GET['MovieID'] ?? null;
$Episode = $_GET['episode'] ?? 1; // default ตอนแรก

if (!$MovieID) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ MovieID"
    ]);
    exit;
}

// เชื่อมต่อ database
include("db.php");

$stmt = $conn->prepare("SELECT FilePath FROM vdomsc WHERE MovieID=? AND Episode=? LIMIT 1");
$stmt->bind_param("si", $MovieID, $Episode);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $file = $row['FilePath'];

    if (!file_exists($file)) {
        echo json_encode([
            "success" => false,
            "message" => "ไฟล์หนังไม่พบบน server"
        ]);
        exit;
    }

    // ส่ง URL สำหรับ React player (สมมติไฟล์อยู่ใน folder /uploads/)
    $baseUrl = "http://localhost/movix-project/backend/videos/"; 
    $filename = basename($file);

    echo json_encode([
        "success" => true,
        "url" => $baseUrl . $filename
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบข้อมูลหนัง/ตอนนี้"
    ]);
}

$stmt->close();
$conn->close();
?>
