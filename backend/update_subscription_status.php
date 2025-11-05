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
$SubscriptionID = $data['SubscriptionID'] ?? null;
$Status = $data['Status'] ?? null;
$EmailAdmin = $data['EmailAdmin'] ?? null;

if (!$SubscriptionID || !$Status || !$EmailAdmin) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

try {
    $conn->begin_transaction();

    // 1️⃣ อัปเดต subscription
    $stmt1 = $conn->prepare("UPDATE subscription SET Status=?, EmailAdmin=? WHERE SubscriptionID=?");
    $stmt1->bind_param("ssi", $Status, $EmailAdmin, $SubscriptionID);
    $stmt1->execute();
    $stmt1->close();

    // 2️⃣ อัปเดต subscriptionpayment ให้ตรงกัน
    $stmt2 = $conn->prepare("
        UPDATE subscriptionpayment sp
        JOIN subscription s ON sp.SubscriptionPaymentID = s.SubscriptionPaymentID
        SET sp.PaymentStatus=?
        WHERE s.SubscriptionID=?
    ");
    $stmt2->bind_param("si", $Status, $SubscriptionID);
    $stmt2->execute();
    $stmt2->close();

    // 3️⃣ อัปเดต Member.MemberCategory เป็น "Subscription" ถ้า Status = "approved"
    if ($Status === "approved") {
        $stmt3 = $conn->prepare("UPDATE member m
                                 JOIN subscription s ON m.MemberEmail = s.EmailMember
                                 SET m.MemberCategory='Subscription'
                                 WHERE s.SubscriptionID=?");
        $stmt3->bind_param("i", $SubscriptionID);
        $stmt3->execute();
        $stmt3->close();
    }

    $conn->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
