<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include("db.php"); // เชื่อมต่อฐานข้อมูล

$sql = "SELECT CategoryID, CategoryName, EmailAdmin FROM Category";
$result = $conn->query($sql);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
