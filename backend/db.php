<?php
// ปิดการแสดง error บนหน้า และ log ไว้ไฟล์ php_errors.log
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_errors.log');

$host = "localhost";
$user = "root";
$pass = "";
$db = "movix";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
