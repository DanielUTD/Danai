<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$email = $_POST["EmailMember"] ?? "";
if (empty($email)) {
  echo json_encode(["success" => false, "message" => "ไม่มีอีเมล"]);
  exit;
}

$targetDir = "../backend/uploads/slipssub/";
if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
$fileExtension = pathinfo($_FILES["SlipFile"]["name"], PATHINFO_EXTENSION);

// สร้างชื่อไฟล์ใหม่ไม่ซ้ำ
$fileName = uniqid("slip_", true) . "." . $fileExtension;

$targetFile = $targetDir . $fileName;

if (move_uploaded_file($_FILES["SlipFile"]["tmp_name"], $targetFile)) {
  $price = 99;
  $status = "pending";
  $method = "QRCode";
  $start = date("Y-m-d H:i:s");
  $end = date("Y-m-d H:i:s", strtotime("+30 days"));

  $conn->begin_transaction();
  try {
    // ✅ 1. บันทึกลงตาราง subscriptionpayment ก่อน
    $stmt1 = $conn->prepare("
      INSERT INTO subscriptionpayment (Time_Slip, Img_slip, PaymentStatus, PaymentMethod)
      VALUES (NOW(), ?, 'pending', ?)
    ");
    $stmt1->bind_param("ss", $fileName, $method);
    $stmt1->execute();
    $paymentID = $conn->insert_id;

    // ✅ 2. บันทึกลงตาราง subscription (อ้างอิง paymentID)
    $stmt2 = $conn->prepare("
      INSERT INTO subscription 
      (Status, Price, StartDate, EndDate, EmailAdmin, EmailMember, SubscriptionPaymentID, DateTimeStamp)
      VALUES (?, ?, ?, ?, NULL, ?, ?, NOW())
    ");
    $stmt2->bind_param("sisssi", $status, $price, $start, $end, $email, $paymentID);
    $stmt2->execute();
    $subscriptionID = $conn->insert_id;

    // ✅ 3. อัปเดต subscriptionpayment ให้เชื่อมกับ subscriptionID
    $stmt3 = $conn->prepare("
      UPDATE subscriptionpayment
      SET SubscriptionID = ?
      WHERE SubscriptionPaymentID = ?
    ");
    $stmt3->bind_param("ii", $subscriptionID, $paymentID);
    $stmt3->execute();

    $conn->commit();
    echo json_encode(["success" => true]);
  } catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "อัปโหลดสลิปไม่สำเร็จ"]);
}
?>
