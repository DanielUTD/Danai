<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

include 'db.php';

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? '';

if (!$email) {
    echo json_encode(['success'=>false,'message'=>'Email is required']);
    exit();
}

$stmt = $conn->prepare("SELECT Username, MemberEmail, MemberCategory FROM Member WHERE MemberEmail = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success'=>false,'message'=>'User not found']);
    exit();
}

$user = $result->fetch_assoc();
echo json_encode(['success'=>true,'user'=>$user]);
?>
