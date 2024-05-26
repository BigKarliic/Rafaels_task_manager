<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : '';

    $taskId = isset($_POST['taskId']) ? htmlspecialchars($_POST['taskId']) : '';

    $stmt = $conn->prepare("DELETE FROM bk_tasks WHERE user_id = ? AND id = ?");
    $stmt->bind_param("ss", $user_id, $taskId);

    if ($stmt->execute()) {
        echo "Task deleted successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>
