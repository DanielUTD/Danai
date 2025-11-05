<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

try {
    $now = date("Y-m-d H:i:s");

    // Rental หมดอายุ
    $stmtRental = $conn->prepare("UPDATE rental SET Status = 'expired' WHERE Status = 'active' AND EndDate < ?");
    $stmtRental->bind_param("s", $now);
    $stmtRental->execute();
    $updatedRentals = $stmtRental->affected_rows;
    $stmtRental->close();

    // Subscription หมดอายุ
    $stmtSub = $conn->prepare("UPDATE subscription SET Status = 'expired' WHERE Status = 'approved' AND EndDate < ?");
    $stmtSub->bind_param("s", $now);
    $stmtSub->execute();
    $updatedSubs = $stmtSub->affected_rows;

    // ดึง EmailMember ของ Subscription ที่หมดอายุ
    $stmtExpiredSubs = $conn->prepare("SELECT EmailMember FROM subscription WHERE Status = 'expired' AND EndDate < ?");
    $stmtExpiredSubs->bind_param("s", $now);
    $stmtExpiredSubs->execute();
    $res = $stmtExpiredSubs->get_result();
    $expiredEmails = [];
    while ($row = $res->fetch_assoc()) {
        $expiredEmails[] = $row['EmailMember'];
    }
    $stmtExpiredSubs->close();

    // อัปเดต MemberCategory เป็น 'Rental' สำหรับสมาชิกที่ Subscription หมดอายุ
    if (!empty($expiredEmails)) {
        $placeholders = implode(',', array_fill(0, count($expiredEmails), '?'));
        $types = str_repeat('s', count($expiredEmails));
        $stmtMember = $conn->prepare("UPDATE member SET MemberCategory = 'Rental' WHERE MemberEmail IN ($placeholders)");
        $stmtMember->bind_param($types, ...$expiredEmails);
        $stmtMember->execute();
        $updatedMembers = $stmtMember->affected_rows;
        $stmtMember->close();
    } else {
        $updatedMembers = 0;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Status updated successfully',
        'rentals_updated' => $updatedRentals,
        'subscriptions_updated' => $updatedSubs,
        'members_updated' => $updatedMembers
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
