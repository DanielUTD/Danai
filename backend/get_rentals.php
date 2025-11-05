<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

try {
    $query = "
        SELECT RentalID, Status, Price, StartDate, EndDate, EmailAdmin, MemberEmail, MovieID, DateTimeStamp
        FROM rental
        ORDER BY DateTimeStamp DESC
    ";

    $result = $conn->query($query);
    $rentals = [];

    while ($row = $result->fetch_assoc()) {
        $rentals[] = $row;
    }

    echo json_encode([
        'success' => true,
        'rentals' => $rentals
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
