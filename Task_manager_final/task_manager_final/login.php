<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '';
    $password = isset($_POST['password']) ? htmlspecialchars($_POST['password']) : '';

    $sql = "SELECT id FROM bk_users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        session_start();
        $_SESSION['user_id'] = $row['id'];
        header("Location: index.html");
        exit();
    } else {
        echo "Invalid username or password";
		header("Refresh: 2; URL=login.html");
    }
}

$conn->close();
?>
