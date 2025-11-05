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

try {
    $stmt = $conn->prepare("
        SELECT s.SubscriptionID, s.Status AS SubscriptionStatus, s.Price, s.StartDate, s.EndDate, s.EmailMember, s.EmailAdmin,s.DateTimeStamp,
               sp.SubscriptionPaymentID, sp.Img_slip, sp.PaymentStatus, sp.PaymentMethod, sp.Time_Slip 
        FROM subscription s
        LEFT JOIN subscriptionpayment sp ON s.SubscriptionPaymentID = sp.SubscriptionPaymentID
        ORDER BY sp.Time_Slip DESC
    ");
    $stmt->execute();
    $res = $stmt->get_result();
    $subscriptions = [];
    while ($row = $res->fetch_assoc()) {
        $subscriptions[] = $row;
    }
    echo json_encode(["success" => true, "subscriptions" => $subscriptions]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
