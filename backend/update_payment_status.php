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

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['PaymentBatchID'], $input['PaymentStatus'], $input['EmailAdmin'])) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit();
}

$PaymentBatchID = intval($input['PaymentBatchID']);
$PaymentStatus = $input['PaymentStatus'];
$EmailAdmin = $input['EmailAdmin'];

$validStatuses = ['pending', 'paid', 'failed'];
if (!in_array($PaymentStatus, $validStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid PaymentStatus']);
    exit();
}

$conn->begin_transaction();

try {
    // 1️⃣ อัปเดต payment_batch
    $stmt = $conn->prepare("UPDATE payment_batch SET PaymentStatus=? WHERE PaymentBatchID=?");
    $stmt->bind_param("si", $PaymentStatus, $PaymentBatchID);
    $stmt->execute();
    $stmt->close();

    // 2️⃣ ดึง RentalIDs
    $stmt = $conn->prepare("SELECT RentalIDs FROM payment_batch WHERE PaymentBatchID=?");
    $stmt->bind_param("i", $PaymentBatchID);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if ($row && !empty($row['RentalIDs'])) {
        $RentalIDs = array_map('intval', explode(',', $row['RentalIDs']));
        $placeholders = implode(',', array_fill(0, count($RentalIDs), '?'));

        $statusMap = [
            'paid' => 'active',
            'failed' => 'failed',
            'pending' => 'pending'
        ];
        $newRentalStatus = $statusMap[$PaymentStatus];

        // 🔹 อัปเดตทีเดียว ใช้ IN clause
        $types = str_repeat('i', count($RentalIDs));
        $stmt = $conn->prepare("UPDATE rental SET Status=?, EmailAdmin=? WHERE RentalID IN ($placeholders)");

        // สร้าง array สำหรับ bind_param
        $bindParams = array_merge([$newRentalStatus, $EmailAdmin], $RentalIDs);

        // เตรียม dynamic bind
        $refs = [];
        foreach ($bindParams as $key => $value) {
            $refs[$key] = &$bindParams[$key];
        }

        call_user_func_array([$stmt, 'bind_param'], array_merge([str_repeat('s',2).$types], $refs));
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Payment status, rental status, and EmailAdmin updated successfully']);
} catch (Exception $e) {
    if ($conn->in_transaction) $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
