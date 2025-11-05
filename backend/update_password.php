<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// รองรับ CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// เปิด error reporting สำหรับ debug
ini_set('display_errors', 1);
error_reporting(E_ALL);

// เชื่อมต่อ DB
include 'db.php';
if (!$conn) {
    echo json_encode(['success'=>false,'message'=>'Database connection failed']);
    exit();
}

// อ่าน JSON
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$newPassword = $input['password'] ?? '';

if (!$email || !$newPassword) {
    echo json_encode(['success'=>false,'message'=>'Email หรือ password ห้ามว่าง']);
    exit();
}

// อัปเดตรหัสผ่าน
try {
    
    

    $stmt = $conn->prepare("UPDATE Member SET Password=? WHERE MemberEmail=?");
    if (!$stmt) throw new Exception($conn->error);

    $stmt->bind_param("ss", $newPassword, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success'=>true,'message'=>'เปลี่ยนรหัสผ่านเรียบร้อย']);
    } else {
        echo json_encode(['success'=>false,'message'=>'ไม่พบผู้ใช้ หรือรหัสผ่านเหมือนเดิม']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
}
?>
