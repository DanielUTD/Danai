<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['EmailMember'], $input['CartID'], $input['Price'])) {
    echo json_encode(['success'=>false,'message'=>'Missing parameters']);
    exit();
}

$EmailMember = $input['EmailMember'];
$CartID = $input['CartID'];
$Price = $input['Price'];

$conn->begin_transaction();
try {
    // ตรวจสอบว่ามี item ใน cart และยังไม่ processing
    $stmt = $conn->prepare("SELECT Status FROM cart WHERE CartID=? AND EmailMember=?");
    $stmt->bind_param("is", $CartID, $EmailMember);
    $stmt->execute();
    $result = $stmt->get_result();
    $cartItem = $result->fetch_assoc();
    $stmt->close();

    if (!$cartItem) throw new Exception("ไม่พบรายการในตะกร้า");
    if ($cartItem['Status']==='processing') throw new Exception("รายการนี้กำลังดำเนินการเช่าอยู่แล้ว");

    // สร้าง rental
    $stmt = $conn->prepare("INSERT INTO rental (Status, Price, MemberEmail, CartID, DateTimeStamp, StartDate, EndDate) VALUES ('processing', ?, ?, ?, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))");
    $stmt->bind_param("isi", $Price, $EmailMember, $CartID);
    $stmt->execute();
    $rentalID = $stmt->insert_id;
    $stmt->close();

    // สร้าง rentalpayment

    // อัปเดต rental ให้มี RentalPaymentID
    $stmt = $conn->prepare("UPDATE rental SET RentalPaymentID=? WHERE RentalID=?");
    $stmt->bind_param("ii", $rentalPaymentID, $rentalID);
    $stmt->execute();
    $stmt->close();

    // อัปเดต cart.Status
    $stmt = $conn->prepare("UPDATE cart SET Status='processing' WHERE CartID=? AND EmailMember=?");
    $stmt->bind_param("is", $CartID, $EmailMember);
    $stmt->execute();
    $stmt->close();

    $conn->commit();

    // ส่ง rentalID กลับไปฝั่ง React
    echo json_encode([
    'success' => true,
    'message' => 'เช่าสำเร็จ! กำลังดำเนินการ...',
    'RentalID' => $rentalID
]);

} catch(Exception $e){
    $conn->rollback();
    echo json_encode(['success'=>false,'message'=>'เกิดข้อผิดพลาด: '.$e->getMessage()]);
}
?>
