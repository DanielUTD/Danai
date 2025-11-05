<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Content-Type: application/json");

include("db.php");

// รับค่า JSON จาก body
$input = json_decode(file_get_contents("php://input"), true);
$categoryID = $input['CategoryID'] ?? null;
$emailAdmin = trim($input['EmailAdmin'] ?? '');

if (!$categoryID || !$emailAdmin) {
    echo json_encode(["success"=>false, "message"=>"ไม่พบข้อมูล CategoryID หรือ EmailAdmin"]);
    exit;
}

// ตรวจสอบ admin
$stmt = $conn->prepare("SELECT * FROM admin WHERE AdminEmail=?");
$stmt->bind_param("s", $emailAdmin);
$stmt->execute();
$result = $stmt->get_result();
if($result->num_rows === 0){
    echo json_encode(["success"=>false,"message"=>"Admin ไม่ถูกต้อง"]);
    exit;
}

// ลบ Category
$stmt = $conn->prepare("DELETE FROM Category WHERE CategoryID=?");
$stmt->bind_param("i", $categoryID);
if($stmt->execute()){
    echo json_encode(["success"=>true,"message"=>"ลบประเภทหนังเรียบร้อย"]);
}else{
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$stmt->error]);
}
$stmt->close();
$conn->close();
?>
