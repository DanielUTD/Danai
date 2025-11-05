<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include("db.php");

// อ่านข้อมูล JSON จาก request body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "ไม่มีข้อมูลส่งมา"]);
    exit;
}

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$username = $data['username'] ?? null;

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "กรอกข้อมูลให้ครบ"]);
    exit;
}

// ✅ เช็คว่ามีอีเมลซ้ำหรือไม่
$check = $conn->prepare("SELECT * FROM member WHERE MemberEmail = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "อีเมลนี้ถูกใช้แล้ว"]);
    exit;
}

// ✅ บันทึกลงฐานข้อมูล
$sql = $conn->prepare("INSERT INTO member (MemberEmail, Username ,Password, MemberCategory) VALUES (?, ?, ?, 'Rental')");
$sql->bind_param("sss", $email,$username,  $password);

if ($sql->execute()) {
    echo json_encode(["success" => true, "message" => "สมัครสมาชิกสำเร็จ"]);
} else {
    echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาด"]);
}

$conn->close();
?>
