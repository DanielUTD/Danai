<?php
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

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$EmailMember = $data['EmailMember'] ?? null;

if (!$EmailMember) {
    echo json_encode(['success' => false, 'message' => 'Missing EmailMember']);
    exit;
}

try {
    // ดึง Rental ทั้งหมดจากตาราง rental
    $rentalQuery = $conn->prepare("
SELECT 
    r.MovieID, 
    m.Name, 
    m.Img_Poster,
    m.Details,
    m.Subtitle, 
    m.Voiceover, 
    m.Group,
    m.Vdo_Trailer,
    m.Episode,
    m.Viewer,c.CategoryName,
    ROUND(AVG(rt.Rating), 1) AS Rating,          
    r.StartDate, 
    r.EndDate, 
    r.Status, 
    'Rental' AS Type
FROM rental r
JOIN movieseriescartoon m ON r.MovieID = m.MovieID
LEFT JOIN Category c ON m.CategoryID = c.CategoryID
LEFT JOIN Ratingreview rt ON m.MovieID = rt.MovieID
WHERE r.MemberEmail = ?
GROUP BY r.MovieID, m.Name, m.Img_Poster, m.Details, m.Subtitle, m.Voiceover, m.Group, m.Vdo_Trailer, m.Episode, m.Viewer, r.StartDate, r.EndDate, r.Status
ORDER BY r.EndDate DESC;


    ");
    $rentalQuery->bind_param("s", $EmailMember);
    $rentalQuery->execute();
    $rentalRes = $rentalQuery->get_result();
    $rentals = $rentalRes->fetch_all(MYSQLI_ASSOC);
    $rentalQuery->close();

    // ส่งข้อมูล rental กลับ
    echo json_encode(['success' => true, 'watch' => $rentals]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
