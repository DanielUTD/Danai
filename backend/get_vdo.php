<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("db.php");

$MovieID = $_GET['MovieID'] ?? null;
if (!$MovieID) {
    echo json_encode([]);
    exit;
}

// ดึง max episode
$stmtMax = $conn->prepare("SELECT MAX(Episode) as maxEpisode FROM vdomsc WHERE MovieID=?");
$stmtMax->bind_param("s", $MovieID);
$stmtMax->execute();
$resMax = $stmtMax->get_result();
$maxEpisode = ($rowMax = $resMax->fetch_assoc()) ? (int)$rowMax['maxEpisode'] : 0;
$stmtMax->close();

// ดึง episodes ทั้งหมด
$stmt = $conn->prepare("SELECT * FROM vdomsc WHERE MovieID=? ORDER BY Episode ASC");
$stmt->bind_param("s", $MovieID);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $episodes = [];
    while ($row = $result->fetch_assoc()) {
        $episodes[] = [
            "VdoMSC_ID" => $row["VdoMSC_ID"],
            "MovieID" => $row["MovieID"],
            "Episode" => (int)$row["Episode"],
            "FilePath" => $row["FilePath"],
            "maxEpisode" => $maxEpisode  // เพิ่มให้ React ใช้
        ];
    }
    echo json_encode($episodes); // ส่งเป็น array ตรง ๆ
} else {
    echo json_encode([]);
}

$stmt->close();
$conn->close();
?>
