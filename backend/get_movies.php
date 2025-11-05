<?php
// ดีบัก
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

include "db.php";

try {
    // JOIN กับ Category เพื่อดึง CategoryName
    $sql = "
        SELECT 
    m.*, 
    c.CategoryName, 
    ROUND(AVG(r.Rating), 1) AS Rating
FROM movieseriescartoon m
LEFT JOIN Category c ON m.CategoryID = c.CategoryID
LEFT JOIN Ratingreview r ON m.MovieID = r.MovieID
GROUP BY m.MovieID;

    ";
    $result = $conn->query($sql);
    if (!$result) throw new Exception($conn->error);

    $movies = [];
    while ($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }

    echo json_encode([
        "success" => true,
        "movies" => $movies
    ]);
} catch (Exception $ex) {
    echo json_encode([
        "success" => false,
        "message" => "เกิดข้อผิดพลาด: " . $ex->getMessage()
    ]);
}

$conn->close();
?>
