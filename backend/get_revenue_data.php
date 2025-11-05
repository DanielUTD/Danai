<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

try {
    // === Rental ===
    $stmt = $conn->prepare("
        SELECT 
            r.RentalID,
            r.MemberEmail AS EmailMember,
            r.Price,
            r.Status,
            r.DateTimeStamp
        FROM rental r
        WHERE r.Status = 'active'
        ORDER BY r.DateTimeStamp DESC
    ");
    $stmt->execute();
    $res = $stmt->get_result();
    $rentals = [];
    while ($row = $res->fetch_assoc()) {
        $rentals[] = $row;
    }
    $stmt->close();

    // === Subscription ===
    $stmt = $conn->prepare("
        SELECT 
            s.SubscriptionID,
            s.EmailMember,
            s.Price,
            s.Status,
            s.DateTimeStamp
        FROM subscription s
        WHERE s.Status = 'approved'
        ORDER BY s.DateTimeStamp DESC
    ");
    $stmt->execute();
    $res = $stmt->get_result();
    $subscriptions = [];
    while ($row = $res->fetch_assoc()) {
        $subscriptions[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "success" => true,
        "rentals" => $rentals,
        "subscriptions" => $subscriptions
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
