<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

header("Content-Type: application/json");
include("db.php");

$input = json_decode(file_get_contents("php://input"), true);
$categoryName = trim($input['CategoryName'] ?? '');
$emailAdmin = trim($input['EmailAdmin'] ?? '');

if (!$categoryName) { echo json_encode(["success"=>false,"message"=>"กรุณากรอกชื่อประเภทหนัง"]); exit; }
if (!$emailAdmin) { echo json_encode(["success"=>false,"message"=>"ไม่พบ Email ของผู้ดูแล"]); exit; }

$stmt = $conn->prepare("INSERT INTO Category (CategoryName, EmailAdmin) VALUES (?, ?)");
$stmt->bind_param("ss", $categoryName, $emailAdmin);

if ($stmt->execute()) {
    echo json_encode(["success"=>true,"message"=>"เพิ่มประเภทหนังสำเร็จ","CategoryID"=>$stmt->insert_id]);
} else {
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$stmt->error]);
}

$stmt->close();
$conn->close();
?>
