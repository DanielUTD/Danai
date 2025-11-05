<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "ไม่มีข้อมูลส่งมา"]);
    exit;
}

$MovieID = $data['MovieID'] ?? null;
$Name = $data['Name'] ?? null;
$Img_Poster = $data['Img_Poster'] ?? null;
$Details = $data['Details'] ?? null;
$Subtitle = $data['Subtitle'] ?? null;
$Voiceover = $data['Voiceover'] ?? null;
$Group = $data['Group'] ?? null;
$Vdo_Trailer = $data['Vdo_Trailer'] ?? null;
$Episode = $data['Episode'] ?? 1;
$Price = $data['Price'] ?? 0;
$CategoryID = $data['CategoryID'] ?? 1;
$EmailAdmin = $data['EmailAdmin'] ?? null;
$RentalDuration = $data['RentalDuration'] ?? 3;

if (!$MovieID || !$Name || !$EmailAdmin) {
    echo json_encode(["success" => false, "message" => "กรุณากรอกข้อมูลให้ครบและตรวจสอบ Admin"]);
    exit;
}

include("db.php");

$stmt = $conn->prepare("UPDATE movieseriescartoon 
    SET Name=?, Img_Poster=?, Details=?, Subtitle=?, Voiceover=?, `Group`=?, 
        Vdo_Trailer=?, Episode=?, Price=?, CategoryID=?, EmailAdmin=?, RentalDuration=? 
    WHERE MovieID=?");

$stmt->bind_param(
    "sssssssiiisis",  // ← ถูกต้องตามชนิดข้อมูลในฐานข้อมูล
    $Name,
    $Img_Poster,
    $Details,
    $Subtitle,
    $Voiceover,
    $Group,
    $Vdo_Trailer,
    $Episode,
    $Price,
    $CategoryID,
    $EmailAdmin,
    $RentalDuration,
    $MovieID
);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "แก้ไขหนังเรียบร้อย"]);
    } else {
        echo json_encode(["success" => false, "message" => "ไม่มีการเปลี่ยนแปลงข้อมูล"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาด: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
