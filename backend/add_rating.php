<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

$data = json_decode(file_get_contents('php://input'), true);
$MovieID = $data['MovieID'] ?? '';
$MemberEmail = $data['MemberEmail'] ?? '';
$Rating = $data['Rating'] ?? null;

if (!$MovieID || !$MemberEmail || $Rating === null) {
    echo json_encode(['success' => false, 'message' => 'ข้อมูลไม่ครบ']);
    exit;
}

try {
    // 🔹 ตรวจสอบว่าเคยให้คะแนนแล้วหรือไม่
    $sqlCheck = $conn->prepare("SELECT * FROM Ratingreview WHERE MovieID=? AND MemberEmail=?");
    $sqlCheck->bind_param("ss", $MovieID, $MemberEmail);
    $sqlCheck->execute();
    $resultCheck = $sqlCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        // 🔹 เคยให้คะแนนแล้ว -> อัปเดต
        $sqlUpdate = $conn->prepare("UPDATE Ratingreview SET Rating=? WHERE MovieID=? AND MemberEmail=?");
        $sqlUpdate->bind_param("dss", $Rating, $MovieID, $MemberEmail);
        $sqlUpdate->execute();
        $message = "แก้ไขคะแนนเรียบร้อย";
    } else {
        // 🔹 หา ReviewID ล่าสุด แล้ว +1
        $result = $conn->query("SELECT MAX(ReviewID) AS lastID FROM Ratingreview");
        $row = $result->fetch_assoc();
        $newID = ($row['lastID'] ?? 0) + 1;

        $sqlInsert = $conn->prepare("INSERT INTO Ratingreview (ReviewID, MovieID, MemberEmail, Rating) VALUES (?, ?, ?, ?)");
        $sqlInsert->bind_param("issd", $newID, $MovieID, $MemberEmail, $Rating);
        $sqlInsert->execute();
        $message = "ให้คะแนนเรียบร้อย";
    }

    // 🔹 คำนวณคะแนนเฉลี่ยใหม่
    $sqlAvg = $conn->prepare("SELECT ROUND(AVG(Rating),1) AS avgRating, COUNT(*) AS countRating FROM Ratingreview WHERE MovieID=?");
    $sqlAvg->bind_param("s", $MovieID);
    $sqlAvg->execute();
    $resultAvg = $sqlAvg->get_result();
    $row = $resultAvg->fetch_assoc();
    $avgRating = $row['avgRating'] ?? 0;
    $countRating = $row['countRating'] ?? 0;

    echo json_encode([
        'success' => true,
        'message' => $message,
        'avgRating' => $avgRating,
        'countRating' => $countRating
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "เกิดข้อผิดพลาด: " . $e->getMessage()
    ]);
}

$conn->close();
?>
