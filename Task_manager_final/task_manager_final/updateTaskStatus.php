<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $taskId = isset($_POST['taskId']) ? htmlspecialchars($_POST['taskId']) : '';
    $completed = isset($_POST['completed']) ? htmlspecialchars($_POST['completed']) : '';

    $stmt = $conn->prepare("UPDATE bk_tasks SET completed = ? WHERE id = ?");
    $stmt->bind_param("ii", $completed, $taskId);

    if ($stmt->execute()) {
        echo "Task status updated successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>
