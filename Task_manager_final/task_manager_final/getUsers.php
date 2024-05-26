<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT id, username FROM bk_users");
    $stmt->execute();

    $result = $stmt->get_result();
    $users = array();

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($users);

    $stmt->close();
}
?>
