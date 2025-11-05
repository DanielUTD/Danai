<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    include 'db.php';
} catch (Exception $e) {
    echo json_encode(['success'=>false, 'message'=>'DB connection error']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$EmailMember = $input['EmailMember'] ?? null;

if (!$EmailMember) {
    echo json_encode(['success'=>false,'message'=>'Missing EmailMember']);
    exit();
}

try {
    $stmt = $conn->prepare("
        SELECT r.RentalID, r.Status, r.Price, r.StartDate, r.EndDate, r.MemberEmail, r.CartID,
               p.RentalPaymentID, p.PaymentStatus, p.PaymentMethod, p.Img_slip
        FROM rental r
        LEFT JOIN rentalpayment p ON r.RentalID = p.RentalID
        WHERE r.MemberEmail = ? AND (r.Status='processing' OR r.Status='pending')
        ORDER BY r.DateTimeStamp DESC
    ");
    $stmt->bind_param("s", $EmailMember);
    $stmt->execute();
    $result = $stmt->get_result();

    $rentals = [];
    while($row = $result->fetch_assoc()) {
        $rentals[] = $row;
    }

    echo json_encode(['success'=>true, 'rentals'=>$rentals]);
    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
}
?>
