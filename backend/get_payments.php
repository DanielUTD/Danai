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
    $stmt = $conn->prepare("
        SELECT 
            pb.PaymentBatchID,
            pb.EmailMember,
            pb.PaymentMethod,
            pb.Img_slip,
            pb.Time_Slip,
            pb.PaymentStatus,
            pb.RentalIDs,
            pb.AllPrice,
            r.EmailAdmin,
            r.DateTimeStamp
        FROM payment_batch pb
        LEFT JOIN rental r ON FIND_IN_SET(r.RentalID, pb.RentalIDs)
        GROUP BY pb.PaymentBatchID
        ORDER BY pb.Time_Slip DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();

    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $row['RentalIDsArray'] = $row['RentalIDs'] ? explode(',', $row['RentalIDs']) : [];
        $payments[] = $row;
    }

    echo json_encode(['success' => true, 'payments' => $payments]);
    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
