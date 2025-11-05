<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include("db.php"); // ไฟล์เชื่อมต่อฐานข้อมูล

// ดึงข้อมูลสมาชิก
$sql = "SELECT MemberEmail, Username, MemberCategory FROM Member";
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// ส่งข้อมูลเป็น JSON
echo json_encode($data);

$conn->close();
