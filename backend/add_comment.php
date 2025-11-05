<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php"; // 🔹 ใช้ไฟล์เชื่อมต่อฐานข้อมูลของคุณ

// อ่านข้อมูล JSON จาก frontend
$data = json_decode(file_get_contents("php://input"), true);

$MemberEmail = $data["MemberEmail"] ?? '';
$MovieID     = $data["MovieID"] ?? '';
$Coment      = $data["Coment"] ?? '';

// ตรวจสอบข้อมูล
if (!$MemberEmail || !$MovieID || !$Coment) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบถ้วน"
    ]);
    exit;
}

// เพิ่มข้อมูลลงฐานข้อมูล
$sql = "INSERT INTO comment (MemberEmail, MovieID, Coment) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $MemberEmail, $MovieID, $Coment);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "เพิ่มความคิดเห็นสำเร็จ"]);
} else {
    echo json_encode(["success" => false, "message" => "ไม่สามารถบันทึกข้อมูลได้"]);
}

$stmt->close();
$conn->close();
?>
