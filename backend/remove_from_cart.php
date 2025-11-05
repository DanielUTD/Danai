<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$CartID = $input['CartID'] ?? '';
$EmailMember = $input['EmailMember'] ?? '';

if(!$CartID || !$EmailMember){
    echo json_encode(['success'=>false, 'message'=>'Missing data']);
    exit;
}

// ตรวจสอบ status
$stmt = $conn->prepare("SELECT Status FROM cart WHERE CartID=? AND EmailMember=?");
$stmt->bind_param("is", $CartID, $EmailMember);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if(!$row){
    echo json_encode(['success'=>false, 'message'=>'ไม่พบ item']);
    exit;
}

if($row['Status'] === 'processing'){
    echo json_encode(['success'=>false, 'message'=>'Item กำลังดำเนินการเช่า ลบไม่ได้']);
    exit;
}

// ลบ cart
$stmt2 = $conn->prepare("DELETE FROM cart WHERE CartID=? AND EmailMember=?");
$stmt2->bind_param("is", $CartID, $EmailMember);
if($stmt2->execute()){
    echo json_encode(['success'=>true, 'message'=>'ลบสำเร็จ']);
}else{
    echo json_encode(['success'=>false, 'message'=>'ลบไม่สำเร็จ']);
}
