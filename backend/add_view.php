<?php
include "db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $MovieID = $_POST['MovieID'] ?? '';

    if (!$MovieID) {
        echo json_encode(['success' => false, 'message' => 'ไม่มี MovieID']);
        exit;
    }

    // ตรวจว่ามีหนังเรื่องนี้ไหมก่อน
    $check = $conn->prepare("SELECT Viewer FROM movieseriescartoon WHERE MovieID = ?");
    $check->bind_param("s", $MovieID);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'ไม่พบ MovieID ในระบบ']);
        exit;
    }

    // อัปเดตจำนวนผู้ชม
    $sql = "UPDATE movieseriescartoon SET Viewer = COALESCE(Viewer, 0) + 1 WHERE MovieID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $MovieID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'เพิ่มจำนวนผู้ชมสำเร็จ']);
    } else {
        echo json_encode(['success' => false, 'message' => 'อัปเดตไม่สำเร็จ']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
