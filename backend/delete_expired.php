<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// รองรับ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// เชื่อมต่อฐานข้อมูล
include("db.php"); // สมมติว่ามีตัวแปร $conn

if (!$conn) {
    echo json_encode(["success" => false, "message" => "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"]);
    exit;
}

// รับค่า JSON
$input = json_decode(file_get_contents("php://input"), true);
$type = $input['type'] ?? '';
$id = $input['id'] ?? '';

if (!$type) {
    echo json_encode(["success" => false, "message" => "ข้อมูล type ไม่ครบ"]);
    exit;
}

// ฟังก์ชันลบ Rental
if ($type === "rental_all") {
    // ลบ Rental ทั้งหมดที่ expired หรือ failed
    $sql = "DELETE FROM rental WHERE Status='expired' OR Status='failed'";
    if ($conn->query($sql) === TRUE) {
        $deleted = $conn->affected_rows;
        echo json_encode([
            "success" => true,
            "deleted" => $deleted,
            "message" => $deleted > 0 ? "ลบ Rental หมดอายุ/failed ทั้งหมดสำเร็จ" : "ไม่มี Rental ให้ลบ"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาด: " . $conn->error]);
    }
    exit;
}

// ฟังก์ชันลบ Rental ตาม ID
if ($type === "rental") {
    if (!$id) {
        echo json_encode(["success" => false, "message" => "ID ไม่ถูกต้อง"]);
        exit;
    }
    $id = intval($id);
    $sql = "DELETE FROM rental WHERE RentalID=$id AND (Status='expired' OR Status='failed')";
    if ($conn->query($sql) === TRUE) {
        $deleted = $conn->affected_rows;
        echo json_encode([
            "success" => true,
            "deleted" => $deleted,
            "message" => $deleted > 0 ? "ลบ Rental สำเร็จ" : "ไม่มี Rental ให้ลบ"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาด: " . $conn->error]);
    }
    exit;
}

// ถ้า type อื่น
echo json_encode(["success" => false, "message" => "type ไม่ถูกต้อง"]);
?>
