<?php
// เปิด error logging สำหรับ debug (ลบออกใน production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ใช้ PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// เรียก autoload ของ Composer (PHPMailer)
require __DIR__ . '/../vendor/autoload.php';
 // ต้องแน่ใจว่า path ถูกต้อง

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ตอบ OPTIONS request สำหรับ CORS
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    echo json_encode(["status" => "ok"]);
    exit();
}

// อ่าน POST จาก fetch
parse_str(file_get_contents("php://input"), $postData);
$email = $postData['email'] ?? '';

// ตรวจสอบ email
if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit();
}

// เชื่อมต่อ database
include 'db.php';
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

try {
    // ตรวจสอบ email ใน DB
    $stmt = $conn->prepare("SELECT * FROM Member WHERE MemberEmail = ?");
    if (!$stmt) throw new Exception($conn->error);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Email not found"]);
        exit();
    }

    // สร้าง OTP 6 หลัก
    $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

    // อัปเดต OTP ลง DB
    $update = $conn->prepare("UPDATE Member SET Reset_Password = ? WHERE MemberEmail = ?");
    if (!$update) throw new Exception($conn->error);
    $update->bind_param("ss", $otp, $email);
    $update->execute();

    // ส่ง email ด้วย PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'eferymaster062@gmail.com';
        $mail->Password = 'xhxp vezf sejm wdpa'; // ใช้ App Password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('eferymaster062@gmail.com', 'Movix System');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = "Your Password Reset Code";
        $mail->Body = "<h3>Your OTP code is: <b>$otp</b></h3><p>Use this code to reset your password.</p>";

        $mail->send();

    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Mailer error: " . $mail->ErrorInfo]);
        exit();
    }

    // ส่ง JSON response success
    echo json_encode(["status" => "success", "message" => "Reset code sent to your email"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}
?>
