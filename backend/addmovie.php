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

// อ่าน JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "ไม่มีข้อมูลส่งมา"]);
    exit;
}

// ดึงค่าจาก request
$Name = $data['Name'] ?? null;
$Img_Poster = $data['Img_Poster'] ?? null;
$Details = $data['Details'] ?? null;
$Subtitle = $data['Subtitle'] ?? null;
$Voiceover = $data['Voiceover'] ?? null;
$Group = $data['Group'] ?? null;
$Vdo_Trailer = $data['Vdo_Trailer'] ?? null;
$Episode = $data['Episode'] ?? 1;
$Price = $data['Price'] ?? 0;
$Viewer = 0;
$CategoryID = $data['CategoryID'] ?? 1;
$EmailAdmin = $data['EmailAdmin'] ?? null;
$RentalDuration =$data['RentalDuration']?? null;

if (!$Name || !$Details || !$CategoryID || !$EmailAdmin) {
    echo json_encode(["success" => false, "message" => "กรุณากรอกข้อมูลให้ครบและตรวจสอบ Admin"]);
    exit;
}

// เชื่อมต่อฐานข้อมูล
include("db.php");

// สร้าง MovieID ใหม่
$result = $conn->query("SELECT MovieID FROM movieseriescartoon ORDER BY MovieID DESC LIMIT 1");
$last = $result->fetch_assoc();
$num = $last ? intval(substr($last['MovieID'], 2)) + 1 : 1;
$MovieID = 'MV' . str_pad($num, 3, '0', STR_PAD_LEFT);

// เตรียม statement
$stmt = $conn->prepare("INSERT INTO movieseriescartoon (MovieID, Name, Img_Poster, Details, Subtitle, Voiceover, `Group`, Vdo_Trailer, Episode, Price, Viewer, CategoryID, EmailAdmin,RentalDuration) VALUES (? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssiiissi", $MovieID, $Name, $Img_Poster, $Details, $Subtitle, $Voiceover, $Group, $Vdo_Trailer, $Episode, $Price, $Viewer, $CategoryID, $EmailAdmin,$RentalDuration);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "เพิ่มหนังเรียบร้อย", "MovieID" => $MovieID]);
} else {
    echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาด: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
