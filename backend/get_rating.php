<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "db.php";

$MovieID = $_GET['MovieID'] ?? '';
$MemberEmail = $_GET['MemberEmail'] ?? '';

if (!$MovieID) {
    echo json_encode(['success' => false, 'message' => 'MovieID ไม่ถูกต้อง']);
    exit;
}

try {
    // คะแนนเฉลี่ย
    $stmt = $conn->prepare("SELECT ROUND(AVG(Rating),1) AS avgRating, COUNT(*) AS countRating FROM Ratingreview WHERE MovieID=?");
    $stmt->bind_param("s", $MovieID);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $avgRating = $result['avgRating'] ?? 0;
    $countRating = $result['countRating'] ?? 0;

    // คะแนนของผู้ใช้
    $userRating = 0;
    if ($MemberEmail) {
        $stmt2 = $conn->prepare("SELECT Rating FROM Ratingreview WHERE MovieID=? AND MemberEmail=?");
        $stmt2->bind_param("ss", $MovieID, $MemberEmail);
        $stmt2->execute();
        $res2 = $stmt2->get_result()->fetch_assoc();
        if ($res2) $userRating = $res2['Rating'];
    }

    echo json_encode([
        'success' => true,
        'avgRating' => $avgRating,
        'countRating' => $countRating,
        'userRating' => $userRating
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>