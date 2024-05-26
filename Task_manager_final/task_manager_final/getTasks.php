<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    session_start();
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : '';
    
    $taskDate = isset($_GET['date']) ? htmlspecialchars($_GET['date']) : '';

    $stmt = $conn->prepare("SELECT t.*, td.detail_text FROM bk_tasks t LEFT JOIN bk_task_details td ON t.id = td.task_id WHERE t.user_id = ? AND t.task_date = ?");
$stmt->bind_param("ss", $user_id, $taskDate);
$stmt->execute();

$result = $stmt->get_result();
$tasks = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($tasks);

$stmt->close();
}
?>

