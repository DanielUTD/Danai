<?php
header("Access-Control-Allow-Origin: *"); // อนุญาตทุก origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// สำหรับ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("db.php");

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(["success"=>true,"message"=>"OPTIONS"]);
    exit();
}

try {
    $MovieID = $_POST['MovieID'] ?? null;
    $Episode = $_POST['Episode'] ?? null;

    if (!$MovieID || !$Episode || !isset($_FILES['video'])) {
        echo json_encode(["success"=>false,"message"=>"กรุณากรอกข้อมูลให้ครบ"]);
        exit;
    }

    $targetDir = "videos/";
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

    $ext = pathinfo($_FILES['video']['name'], PATHINFO_EXTENSION);
    $newFile = uniqid("ep_").".".$ext;
    $targetFile = $targetDir.$newFile;

    if (!move_uploaded_file($_FILES['video']['tmp_name'], $targetFile)) {
        echo json_encode(["success"=>false,"message"=>"อัปโหลดไฟล์ล้มเหลว"]);
        exit;
    }

    $VdoMSC_ID = uniqid("msc_");
    $stmt = $conn->prepare("INSERT INTO vdomsc (VdoMSC_ID, MovieID, Episode, FilePath) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $VdoMSC_ID, $MovieID, $Episode, $targetFile);

    if ($stmt->execute()) {
        echo json_encode(["success"=>true,"message"=>"อัปโหลดสำเร็จ","file"=>$targetFile]);
    } else {
        echo json_encode(["success"=>false,"message"=>"บันทึก DB ไม่สำเร็จ: ".$stmt->error]);
    }

    $stmt->close();
    $conn->close();

} catch(Exception $e) {
    echo json_encode(["success"=>false,"message"=>"เกิดข้อผิดพลาด: ".$e->getMessage()]);
}
?>
