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
if (!isset($input['EmailMember'])) {
    echo json_encode(['success' => false, 'message' => 'Missing EmailMember']);
    exit();
}

$EmailMember = $input['EmailMember'];

try {
    // ดึงข้อมูลตะกร้า พร้อม RentalDuration จาก movieseriescartoon
    $stmt = $conn->prepare("
        SELECT 
            c.CartID,
            c.MovieID,
            m.Name AS MovieName,
            m.Img_Poster,
            m.Price,
            m.RentalDuration
        FROM cart c
        JOIN movieseriescartoon m ON c.MovieID = m.MovieID
        WHERE c.EmailMember = ?
        ORDER BY c.CartID ASC
    ");
    $stmt->bind_param("s", $EmailMember);
    $stmt->execute();
    $result = $stmt->get_result();

    $cart = [];
    while ($row = $result->fetch_assoc()) {
        $cart[] = $row;
    }

    echo json_encode(['success' => true, 'cart' => $cart]);
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: '.$e->getMessage()]);
}
?>
