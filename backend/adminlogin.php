<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ตอบรับ preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// อ่าน JSON จาก request body
$input = file_get_contents("php://input");

// Debug: บันทึกข้อมูล input เพื่อเช็ค (ดูใน log ของ XAMPP)
file_put_contents("php://stderr", "Input JSON: " . $input . "\n");

$data = json_decode($input, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่มีข้อมูลส่งมา"
    ]);
    exit;
}

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกอีเมลและรหัสผ่าน"
    ]);
    exit;
}

// เชื่อมต่อฐานข้อมูล (แก้ไขชื่อไฟล์และ config ให้ตรงของคุณ)
include("db.php");

// เตรียม statement ป้องกัน SQL Injection
$sql = $conn->prepare("SELECT * FROM admin WHERE AdminEmail = ? AND Password = ?");
$sql->bind_param("ss", $email, $password);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "message" => "เข้าสู่ระบบสำเร็จ",
        "user" => $user
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    ]);
}

$conn->close();
?>