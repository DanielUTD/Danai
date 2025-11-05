<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Methods: PUT, OPTIONS"); 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

header("Content-Type: application/json");
include("db.php");

$input = json_decode(file_get_contents("php://input"), true);
$categoryID = intval($input['CategoryID'] ?? 0);
$categoryName = trim($input['CategoryName'] ?? '');
$emailAdmin = trim($input['EmailAdmin'] ?? '');

if (!$categoryID) { echo json_encode(["success"=>false,"message"=>"ไม่พบ ID ของประเภท"]); exit; }
if (!$categoryName) { echo json_encode(["success"=>false,"message"=>"กรุณากรอกชื่อประเภทหนัง"]); exit; }
if (!$emailAdmin) { echo json_encode(["success"=>false,"message"=>"ไม่พบ Email ของผู้ดูแล"]); exit; }

$stmt = $conn->prepare("UPDATE Category SET CategoryName=?, EmailAdmin=? WHERE CategoryID=?");
$stmt->bind_param("ssi", $categoryName, $emailAdmin, $categoryID);

if ($stmt->execute()) {
    echo json_encode(["success"=>true,"message"=>"แก้ไขประเภทหนังสำเร็จ"]);
} else {
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$stmt->error]);
}

$stmt->close();
$conn->close();
?>
