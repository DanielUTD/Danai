<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include 'db.php';

if (!isset($_POST['RentalID'], $_POST['EmailMember'], $_POST['PaymentMethod'])) {
    echo json_encode(['success'=>false,'message'=>'Missing parameters']);
    exit();
}

$RentalID = $_POST['RentalID'];
$EmailMember = $_POST['EmailMember'];
$PaymentMethod = $_POST['PaymentMethod'];
$DateTimeStamp = date("Y-m-d H:i:s");

// อัปโหลดสลิป
$Img_slip = null;
if (isset($_FILES['SlipFile']) && $_FILES['SlipFile']['error'] === 0) {
    $uploadDir = 'uploads/slips/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = uniqid('slip_') . '_' . basename($_FILES['SlipFile']['name']);
    $targetPath = $uploadDir . $filename;
    if (move_uploaded_file($_FILES['SlipFile']['tmp_name'], $targetPath)) {
        $Img_slip = $targetPath;
    } else {
        echo json_encode(['success'=>false,'message'=>'ไม่สามารถอัปโหลดไฟล์สลิปได้']);
        exit();
    }
}

$conn->begin_transaction();
try {
    // Insert into rentalpayment
    $stmt = $conn->prepare("INSERT INTO rentalpayment (Time_Slip, Img_slip, PaymentStatus, PaymentMethod, RentalID)
                            VALUES (?, ?, ?, ?, ?)");
    $Time_Slip = $DateTimeStamp;
    $PaymentStatus = "paid"; // สมมติชำระสำเร็จทันที
    $stmt->bind_param("ssssi", $Time_Slip, $Img_slip, $PaymentStatus, $PaymentMethod, $RentalID);
    $stmt->execute();
    $RentalPaymentID = $stmt->insert_id;
    $stmt->close();

    // Update rental with RentalPaymentID
    $stmt = $conn->prepare("UPDATE rental SET Status='paid', RentalPaymentID=? WHERE RentalID=? AND MemberEmail=?");
    $stmt->bind_param("iis", $RentalPaymentID, $RentalID, $EmailMember);
    $stmt->execute();
    $stmt->close();

    // Update cart table Status เป็น 'CheckingPaid' สำหรับรายการที่เกี่ยวข้องกับ RentalID
    $stmt = $conn->prepare("UPDATE cart SET Status='CheckingPaid' WHERE CartID=?");
    $stmt->bind_param("i", $RentalID);
    $stmt->execute();
    $stmt->close();

    $conn->commit();
    echo json_encode(['success'=>true,'message'=>'ชำระเงินและอัปเดตสลิปเรียบร้อย']);
} catch(Exception $e){
    $conn->rollback();
    echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
}
?>
