<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $otp = $_POST['otp'];
    $newPassword = $_POST['password']; // เอา password hash ออก

    // ตรวจสอบ OTP
    $stmt = $conn->prepare("SELECT * FROM Member WHERE MemberEmail = ? AND Reset_Password = ?");
    $stmt->bind_param("ss", $email, $otp);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // อัปเดตรหัสผ่านใหม่เป็น plain text
        $update = $conn->prepare("UPDATE Member SET Password = ?, Reset_Password = NULL WHERE MemberEmail = ?");
        $update->bind_param("ss", $newPassword, $email);
        $update->execute();

        echo json_encode(["status" => "success", "message" => "Password reset successful"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid reset code"]);
    }
}
?>
