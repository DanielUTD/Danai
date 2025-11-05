<?php
header("Content-Type: application/json");
include "db.php";
date_default_timezone_set('Asia/Bangkok');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $RentalID = $_POST['RentalID'] ?? null;
    $PaymentMethod = $_POST['PaymentMethod'] ?? null;
    $Img_slip = $_FILES['Img_slip']['name'] ?? null;

    if (!$RentalID || !$PaymentMethod) {
        echo json_encode(["success" => false, "message" => "ข้อมูลไม่ครบ"]);
        exit;
    }

    // บันทึกรูปสลิป (ถ้ามี)
    if ($Img_slip) {
        $targetDir = "uploads/";
        if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
        $targetFile = $targetDir . basename($_FILES["Img_slip"]["name"]);
        move_uploaded_file($_FILES["Img_slip"]["tmp_name"], $targetFile);
    } else {
        $targetFile = null;
    }

    $Time_Slip = date("Y-m-d H:i:s");
    $PaymentStatus = "Pending";

    $stmt = $conn->prepare("
        INSERT INTO rentalpayment (Time_Slip, Img_slip, PaymentStatus, PaymentMethod, RentalID)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssi", $Time_Slip, $targetFile, $PaymentStatus, $PaymentMethod, $RentalID);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "อัปโหลดสลิปสำเร็จ"]);
    } else {
        echo json_encode(["success" => false, "message" => "ไม่สามารถอัปโหลดได้"]);
    }
}
?>
