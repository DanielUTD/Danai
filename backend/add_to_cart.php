<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// อ่าน JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$MovieID = $data['MovieID'] ?? null;
$EmailMember = $data['EmailMember'] ?? null;
$Price = $data['Price'] ?? null;
$Status = 'Rental'; // กำหนดค่าเริ่มต้น

// ตรวจสอบข้อมูลครบ
if (!$MovieID || !$EmailMember || $Price === null) {
    echo json_encode(["success" => false, "message" => "ข้อมูลหนังหรือผู้ใช้ไม่ครบ"]);
    exit;
}

// 🔍 ตรวจสอบว่าหนังนี้มีอยู่ในตะกร้าแล้วหรือยัง
$check = $conn->prepare("SELECT CartID FROM Cart WHERE MovieID = ? AND EmailMember = ?");
$check->bind_param("ss", $MovieID, $EmailMember);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "หนังเรื่องนี้อยู่ในตะกร้าแล้ว"]);
    exit;
}

// 🔍 ตรวจสอบว่าหนังนี้มีอยู่ใน Rental แล้วหรือยัง
$check2 = $conn->prepare("SELECT RentalID FROM Rental WHERE MovieID = ? AND MemberEmail = ?");
$check2->bind_param("ss", $MovieID, $EmailMember);
$check2->execute();
$result2 = $check2->get_result();
if ($result2->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "หนังเรื่องนี้อยู่ในบัญชีคุณแล้ว"]);
    exit;
}

// ➕ เพิ่มหนังลงตะกร้า
$stmt = $conn->prepare("INSERT INTO Cart (MovieID, EmailMember, Price, Status) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssds", $MovieID, $EmailMember, $Price, $Status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "เพิ่มลงตะกร้าแล้ว"]);
} else {
    echo json_encode(["success" => false, "message" => "เพิ่มไม่สำเร็จ"]);
}
?>
