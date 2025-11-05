<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["EmailMember"] ?? "";

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "ไม่มีอีเมล"]);
    exit;
}

$sql = "
    SELECT SubscriptionID, Status, Price, StartDate, EndDate, EmailMember, SubscriptionPaymentID,
           DateTimeStamp
    FROM subscription
    WHERE EmailMember = ?
    ORDER BY DateTimeStamp DESC
    LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "subscription" => $row]);
} else {
    echo json_encode(["success" => true, "subscription" => null]);
}
?>
