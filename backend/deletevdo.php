<?php
header("Access-Control-Allow-Origin: *"); // อนุญาตทุก origin
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ตอบ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("db.php");

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(["success"=>true,"message"=>"OPTIONS"]);
    exit();
}

$VdoMSC_ID = $_GET['id'] ?? null;
if (!$VdoMSC_ID) {
    echo json_encode(["success"=>false,"message"=>"ไม่พบ VdoMSC_ID"]);
    exit;
}

// ลบไฟล์จาก server
$stmt = $conn->prepare("SELECT FilePath FROM vdomsc WHERE VdoMSC_ID=?");
$stmt->bind_param("s", $VdoMSC_ID);
$stmt->execute();
$res = $stmt->get_result();
$file = $res->fetch_assoc()['FilePath'] ?? null;
$stmt->close();

if ($file && file_exists($file)) unlink($file);

// ลบจาก database
$stmt = $conn->prepare("DELETE FROM vdomsc WHERE VdoMSC_ID=?");
$stmt->bind_param("s", $VdoMSC_ID);

if ($stmt->execute()) {
    echo json_encode(["success"=>true,"message"=>"ลบตอนสำเร็จ"]);
} else {
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$stmt->error]);
}

$stmt->close();
$conn->close();
?>
