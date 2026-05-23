<?php
// ==========================================
// ACC - ENDPOINT DE AUTENTICACIÓN (PHP)
// ==========================================

require_once 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer el body JSON de la petición
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "El email y la contraseña son obligatorios."]);
        exit();
    }

    try {
        // Buscar el usuario por email
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Login exitoso
            echo json_encode([
                "session" => [
                    "user" => [
                        "id" => $user['id'],
                        "email" => $user['email']
                    ]
                ]
            ]);
        } else {
            // Credenciales incorrectas
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas. Inténtalo de nuevo."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error del servidor: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
