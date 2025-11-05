<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

$MovieID = $_GET['id'] ?? null;
if (!$MovieID) {
    echo json_encode(["success"=>false,"message"=>"ไม่พบ MovieID"]);
    exit;
}

include("db.php");

$stmt = $conn->prepare("DELETE FROM movieseriescartoon WHERE MovieID=?");
$stmt->bind_param("s", $MovieID);

if ($stmt->execute()) {
    echo json_encode(["success"=>true,"message"=>"ลบหนังสำเร็จ"]);
} else {
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$stmt->error]);
}

$stmt->close();
$conn->close();
