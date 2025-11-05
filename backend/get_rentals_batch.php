<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include 'db.php';

$input = json_decode(file_get_contents('php://input'),true);
$CartIDs = $input['CartIDs'] ?? [];
$EmailMember = $input['EmailMember'] ?? '';

if (!is_array($CartIDs) || empty($CartIDs)) exit(json_encode(['success'=>false,'rentals'=>[]]));

$placeholders = implode(',', array_fill(0,count($CartIDs),'?'));
$types = str_repeat('i',count($CartIDs));

$stmt = $conn->prepare("SELECT c.CartID, c.MovieID, m.Name AS MovieName, c.Price, c.Status FROM cart c LEFT JOIN movieseriescartoon m ON c.MovieID = m.MovieID WHERE c.CartID IN ($placeholders) AND c.EmailMember=?");
$stmt->bind_param($types.'s', ...array_merge($CartIDs, [$EmailMember]));
$stmt->execute();
$result = $stmt->get_result();

$rentals = [];
while($row=$result->fetch_assoc()) $rentals[]=$row;

echo json_encode(['success'=>true,'rentals'=>$rentals]);
$stmt->close();
?>
