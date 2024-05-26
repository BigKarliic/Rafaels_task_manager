<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newUsername = isset($_POST['newUsername']) ? htmlspecialchars($_POST['newUsername']) : '';
    $newPassword = isset($_POST['newPassword']) ? htmlspecialchars($_POST['newPassword']) : '';

    $checkExistingUser = "SELECT id FROM bk_users WHERE username = '$newUsername'";
    $result = $conn->query($checkExistingUser);

    if ($result->num_rows > 0) {
        echo "Error: This username is already taken. Please choose a different one.";
		header("Refresh: 2; URL=register.html");
    } else {
        $sql = "INSERT INTO bk_users (username, password) VALUES ('$newUsername', '$newPassword')";

        if ($conn->query($sql) === TRUE) {
            echo "Registration successful. Redirecting to login page...";
            header("Refresh: 2; URL=login.html");
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
