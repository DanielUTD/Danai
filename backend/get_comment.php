<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php"; // 🔹 ใช้ไฟล์เชื่อมต่อฐานข้อมูลของคุณ

$MovieID = $_GET['MovieID'] ?? '';

if (!$MovieID) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT ComentID, MemberEmail, MovieID, Coment 
        FROM comment 
        WHERE MovieID = ? 
        ORDER BY ComentID DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $MovieID);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

echo json_encode($comments);

$stmt->close();
$conn->close();
?>
