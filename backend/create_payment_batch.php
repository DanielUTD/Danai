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
    // ตรวจสอบ parameter
    if (!isset($_POST['EmailMember'], $_POST['CartIDs']) || !isset($_FILES['SlipFile'])) {
        throw new Exception("Missing parameters or slip file");
    }

    $EmailMember = $_POST['EmailMember'];
    $CartIDs = json_decode($_POST['CartIDs'], true);
    $SlipFile = $_FILES['SlipFile'];

    if (!is_array($CartIDs) || count($CartIDs) === 0) {
        throw new Exception("CartIDs must be a non-empty array");
    }

    // Upload slip
    $uploadDir = __DIR__ . "/uploads/slips/";
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
    $filename = time() . "_" . basename($SlipFile['name']);
    $filepath = $uploadDir . $filename;

    if (!move_uploaded_file($SlipFile['tmp_name'], $filepath)) {
        throw new Exception("Failed to upload slip file");
    }

    $DateTimeStamp = date("Y-m-d H:i:s");
    $PaymentStatus = "pending";
    $PaymentMethod = "QRCode";

    $conn->begin_transaction();

    // ดึงข้อมูลจาก cart
    $placeholders = implode(',', array_fill(0, count($CartIDs), '?'));
    $types = str_repeat('i', count($CartIDs));
    $stmt = $conn->prepare("SELECT CartID, MovieID, Price FROM cart WHERE CartID IN ($placeholders) AND EmailMember=?");
    $bindParams = array_merge($CartIDs, [$EmailMember]);
    $stmt->bind_param($types . "s", ...$bindParams);
    $stmt->execute();
    $result = $stmt->get_result();

    $rentalIDs = [];
    $totalPrice = 0;

    // เตรียม insert ลง rental
    $insertRental = $conn->prepare("
        INSERT INTO rental (Status, Price, StartDate, EndDate, EmailAdmin, MemberEmail, MovieID, DateTimeStamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $status = "pending";
    $EmailAdmin = "null";

    while ($row = $result->fetch_assoc()) {
        $totalPrice += intval($row['Price']);

        // ดึง RentalDuration ของหนัง
        $stmtMovie = $conn->prepare("SELECT RentalDuration FROM movieseriescartoon WHERE MovieID = ?");
        $stmtMovie->bind_param("s", $row['MovieID']);
        $stmtMovie->execute();
        $resMovie = $stmtMovie->get_result();
        $movie = $resMovie->fetch_assoc();
        $rentalDuration = isset($movie['RentalDuration']) ? intval($movie['RentalDuration']) : 3; // default 3 วัน
        $stmtMovie->close();

        $startDate = date("Y-m-d H:i:s");
        $endDate = date("Y-m-d H:i:s", strtotime("+$rentalDuration days"));

        $insertRental->bind_param(
            "sissssss",
            $status,
            $row['Price'],
            $startDate,
            $endDate,
            $EmailAdmin,
            $EmailMember,
            $row['MovieID'],
            $DateTimeStamp
        );
        $insertRental->execute();
        $rentalIDs[] = $conn->insert_id;
    }

    $stmt->close();
    $insertRental->close();

    // รวม RentalIDs
    $RentalIDsText = implode(',', $rentalIDs);

    // บันทึก payment_batch
    $stmt = $conn->prepare("
        INSERT INTO payment_batch 
        (EmailMember, PaymentMethod, Img_slip, Time_Slip, PaymentStatus, RentalIDs, AllPrice)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssssi", $EmailMember, $PaymentMethod, $filename, $DateTimeStamp, $PaymentStatus, $RentalIDsText, $totalPrice);
    $stmt->execute();
    $stmt->close();

    // ลบ cart ที่จ่ายแล้ว
    $stmt = $conn->prepare("DELETE FROM cart WHERE CartID IN ($placeholders) AND EmailMember=?");
    $stmt->bind_param($types . "s", ...$bindParams);
    $stmt->execute();
    $stmt->close();

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => '✅ ส่งสลิปเรียบร้อย! สร้าง rental และบันทึก AllPrice ใน payment_batch สำเร็จ',
        'RentalIDs' => $rentalIDs,
        'AllPrice' => $totalPrice
    ]);

} catch (Exception $e) {
    if ($conn->in_transaction) $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
