<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : '';
    $eventText = isset($_POST['eventText']) ? htmlspecialchars($_POST['eventText']) : '';
    $taskDate = isset($_POST['date']) ? htmlspecialchars($_POST['date']) : '';
    $detailText = isset($_POST['detailText']) ? htmlspecialchars($_POST['detailText']) : '';
	$timeText = isset($_POST['timeText']) ? htmlspecialchars($_POST['timeText']) : '';

    $stmt = $conn->prepare("INSERT INTO bk_tasks (user_id, task_text, task_date, task_time) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("ssss", $user_id, $eventText, $taskDate, $timeText);

    if ($stmt->execute()) {
        $taskId = $conn->insert_id;

        $stmtDetails = $conn->prepare("INSERT INTO bk_task_details (task_id, detail_text) VALUES (?, ?)");
        $stmtDetails->bind_param("ss", $taskId, $detailText);

        if ($stmtDetails->execute()) {
            echo "Event and details added successfully";
        } else {
            echo "Error adding details: " . $stmtDetails->error;
        }

        $stmtDetails->close();
    } else {
        echo "Error adding event: " . $stmt->error;
    }

    $stmt->close();
}
?>